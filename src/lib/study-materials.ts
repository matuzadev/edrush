// Orquestração de materiais de estudo:
//   1. generateAndStoreMaterial: gera content via IA, renderiza PDF, sobe ao Blob,
//      persiste em study_materials com status='draft'.
//   2. publishMaterial: muda status pra 'published' (admin gate).
//   3. unpublishMaterial: reverte pra draft.
//   4. listMaterials*: getters para UI e API.

import { put } from '@vercel/blob';
import { lsClient } from '@/lib/db';
import { generateStudyMaterial } from './study-material-generator';
import { renderPDF } from './pdf-renderer';
import type { StudyMaterialContent } from './study-material-types';

export interface MaterialRow {
  id: number;
  concurso_slug: string;
  disciplina: string;
  blob_url: string | null;
  page_count: number | null;
  file_size: number | null;
  status: 'draft' | 'published' | 'failed' | 'generating';
  error_msg: string | null;
  generated_at: string | null;
  published_at: string | null;
  criado_em: string;
  atualizado_em: string;
}

function sanitizeSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uploadPDFToBlob(buffer: Buffer, params: {
  concursoSlug: string;
  disciplina: string;
}): Promise<string> {
  const filename = `study-materials/${params.concursoSlug}/${sanitizeSlug(params.disciplina)}.pdf`;
  const blob = await put(filename, buffer, {
    access: 'public',
    addRandomSuffix: true,
    contentType: 'application/pdf',
  });
  return blob.url;
}

export interface GenerateOptions {
  concursoSlug: string;
  disciplina: string;
}

export interface GenerateResult {
  materialId: number;
  pageCount: number;
  fileSize: number;
  blobUrl: string;
  tokensUsed: { input: number; output: number };
}

/**
 * Gera material via IA, renderiza PDF, sobe ao Blob, persiste com status='draft'.
 * Idempotente: se já existe registro para (concurso, disciplina), atualiza.
 * Throws em erro de IA/render/upload — chamador decide o que fazer.
 */
export async function generateAndStoreMaterial(opts: GenerateOptions): Promise<GenerateResult> {
  const { concursoSlug, disciplina } = opts;
  const now = new Date().toISOString();

  // Marca como 'generating' antes de chamar IA (pode demorar 30-90s).
  await client_upsertGenerating(concursoSlug, disciplina, now);

  try {
    const { content, sourceHash, tokensUsed } = await generateStudyMaterial({
      concursoSlug,
      disciplina,
    });

    const { buffer, pageCount } = await renderPDF(content);
    const blobUrl = await uploadPDFToBlob(buffer, { concursoSlug, disciplina });

    const materialId = await client_upsertReady({
      concursoSlug,
      disciplina,
      contentJson: JSON.stringify(content),
      blobUrl,
      sourceHash,
      pageCount,
      fileSize: buffer.byteLength,
      now: new Date().toISOString(),
    });

    return {
      materialId,
      pageCount,
      fileSize: buffer.byteLength,
      blobUrl,
      tokensUsed,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await client_upsertFailed(concursoSlug, disciplina, msg, new Date().toISOString());
    throw err;
  }
}

async function client_upsertGenerating(concursoSlug: string, disciplina: string, now: string) {
  // INSERT ou UPDATE — usa UNIQUE(concurso_slug, disciplina).
  await lsClient.execute({
    sql: `INSERT INTO study_materials
            (concurso_slug, disciplina, status, criado_em, atualizado_em)
          VALUES (?, ?, 'generating', ?, ?)
          ON CONFLICT (concurso_slug, disciplina) DO UPDATE SET
            status='generating',
            error_msg=NULL,
            atualizado_em=excluded.atualizado_em`,
    args: [concursoSlug, disciplina, now, now],
  });
}

async function client_upsertReady(p: {
  concursoSlug: string;
  disciplina: string;
  contentJson: string;
  blobUrl: string;
  sourceHash: string;
  pageCount: number;
  fileSize: number;
  now: string;
}): Promise<number> {
  await lsClient.execute({
    sql: `INSERT INTO study_materials
            (concurso_slug, disciplina, content_json, blob_url, source_hash,
             page_count, file_size, status, generated_at, criado_em, atualizado_em)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?)
          ON CONFLICT (concurso_slug, disciplina) DO UPDATE SET
            content_json=excluded.content_json,
            blob_url=excluded.blob_url,
            source_hash=excluded.source_hash,
            page_count=excluded.page_count,
            file_size=excluded.file_size,
            status='draft',
            error_msg=NULL,
            generated_at=excluded.generated_at,
            atualizado_em=excluded.atualizado_em`,
    args: [
      p.concursoSlug, p.disciplina, p.contentJson, p.blobUrl, p.sourceHash,
      p.pageCount, p.fileSize, p.now, p.now, p.now,
    ],
  });

  const idRs = await lsClient.execute({
    sql: `SELECT id FROM study_materials WHERE concurso_slug = ? AND disciplina = ? LIMIT 1`,
    args: [p.concursoSlug, p.disciplina],
  });
  return Number((idRs.rows[0] as unknown as { id: number }).id);
}

async function client_upsertFailed(concursoSlug: string, disciplina: string, errMsg: string, now: string) {
  await lsClient.execute({
    sql: `INSERT INTO study_materials
            (concurso_slug, disciplina, status, error_msg, criado_em, atualizado_em)
          VALUES (?, ?, 'failed', ?, ?, ?)
          ON CONFLICT (concurso_slug, disciplina) DO UPDATE SET
            status='failed',
            error_msg=excluded.error_msg,
            atualizado_em=excluded.atualizado_em`,
    args: [concursoSlug, disciplina, errMsg.slice(0, 1000), now, now],
  });
}

export async function publishMaterial(materialId: number, adminId: string): Promise<void> {
  const now = new Date().toISOString();
  await lsClient.execute({
    sql: `UPDATE study_materials
          SET status='published', published_at=?, published_by=?, atualizado_em=?
          WHERE id = ? AND status='draft'`,
    args: [now, adminId, now, materialId],
  });
}

export async function unpublishMaterial(materialId: number): Promise<void> {
  const now = new Date().toISOString();
  await lsClient.execute({
    sql: `UPDATE study_materials
          SET status='draft', published_at=NULL, published_by=NULL, atualizado_em=?
          WHERE id = ?`,
    args: [now, materialId],
  });
}

export async function getMaterialByDisciplina(
  concursoSlug: string,
  disciplina: string,
): Promise<MaterialRow | null> {
  const rs = await lsClient.execute({
    sql: `SELECT id, concurso_slug, disciplina, blob_url, page_count, file_size,
                 status, error_msg, generated_at, published_at, criado_em, atualizado_em
          FROM study_materials WHERE concurso_slug = ? AND disciplina = ? LIMIT 1`,
    args: [concursoSlug, disciplina],
  });
  if (rs.rows.length === 0) return null;
  return rs.rows[0] as unknown as MaterialRow;
}

export async function listMaterialsByConcurso(concursoSlug: string): Promise<MaterialRow[]> {
  const rs = await lsClient.execute({
    sql: `SELECT id, concurso_slug, disciplina, blob_url, page_count, file_size,
                 status, error_msg, generated_at, published_at, criado_em, atualizado_em
          FROM study_materials
          WHERE concurso_slug = ? OR concurso_slug = 'global'
          ORDER BY disciplina ASC`,
    args: [concursoSlug],
  });
  return rs.rows as unknown as MaterialRow[];
}

export async function listAllMaterials(): Promise<MaterialRow[]> {
  const rs = await lsClient.execute(`
    SELECT id, concurso_slug, disciplina, blob_url, page_count, file_size,
           status, error_msg, generated_at, published_at, criado_em, atualizado_em
    FROM study_materials
    ORDER BY atualizado_em DESC
  `);
  return rs.rows as unknown as MaterialRow[];
}

export async function getMaterialContent(materialId: number): Promise<StudyMaterialContent | null> {
  const rs = await lsClient.execute({
    sql: 'SELECT content_json FROM study_materials WHERE id = ?',
    args: [materialId],
  });
  if (rs.rows.length === 0) return null;
  const r = rs.rows[0] as unknown as { content_json: string | null };
  if (!r.content_json) return null;
  try {
    return JSON.parse(r.content_json) as StudyMaterialContent;
  } catch {
    return null;
  }
}

export async function logDownload(userId: string, materialId: number): Promise<void> {
  try {
    await lsClient.execute({
      sql: `INSERT INTO study_material_downloads (user_id, material_id, downloaded_at)
            VALUES (?, ?, ?)`,
      args: [userId, materialId, new Date().toISOString()],
    });
  } catch {
    // analytics — não pode quebrar download
  }
}

/**
 * Materiais publicados podem ser baixados por qualquer usuário autenticado.
 * Os downloads publicados estão disponíveis a todos os usuários autenticados.
 */
