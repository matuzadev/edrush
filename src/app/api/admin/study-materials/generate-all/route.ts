// POST /api/admin/study-materials/generate-all
//
// Dispara geração em batch para todas as combinações (concurso_slug, disciplina)
// que têm questões cadastradas. Roda sequencial para não estourar rate-limit
// do Anthropic + custo controlado. Pode demorar dezenas de minutos.
//
// Estratégia: dispara em background e retorna imediatamente com a lista de
// targets. Frontend faz polling em /api/admin/study-materials.
//
// Em serverless Vercel sem fila, o "background" é limitado: nesse handler
// rodamos em paralelo via Promise.all chunked. Se Vercel encerrar a request,
// o que estava in-flight termina; o resto fica como 'draft' parcial.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { requireAdmin } from '@/lib/admin';
import {
  generateAndStoreMaterial,
} from '@/lib/study-materials';
import { listGeneratableDisciplines } from '@/lib/study-material-generator';

export const maxDuration = 300; // ~13 min (Vercel pro plan limit é 900s)

interface BatchResult {
  concursoSlug: string;
  disciplina: string;
  ok: boolean;
  error?: string;
  pageCount?: number;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!userId || !(await requireAdmin(userId, session))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Body opcional: { concursoSlug?: string, onlyMissing?: boolean }
  let body: { concursoSlug?: string; onlyMissing?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    // body vazio é OK
  }

  let targets = await listGeneratableDisciplines();
  if (body.concursoSlug) {
    targets = targets.filter((t) => t.concursoSlug === body.concursoSlug);
  }

  if (targets.length === 0) {
    return NextResponse.json({
      ok: true,
      message: 'Nenhuma disciplina com questões cadastradas para gerar.',
      results: [],
    });
  }

  // Rodamos em série pra controlar custo + evitar rate-limit do Anthropic.
  // (Anthropic Sonnet hoje tem RPM ~50, mas RPM ≠ TPM; cautela.)
  const results: BatchResult[] = [];
  for (const t of targets) {
    try {
      const res = await generateAndStoreMaterial({
        concursoSlug: t.concursoSlug,
        disciplina: t.disciplina,
      });
      results.push({
        concursoSlug: t.concursoSlug,
        disciplina: t.disciplina,
        ok: true,
        pageCount: res.pageCount,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({
        concursoSlug: t.concursoSlug,
        disciplina: t.disciplina,
        ok: false,
        error: msg,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    total: results.length,
    succeeded: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}
