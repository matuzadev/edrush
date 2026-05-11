// Geração de material de estudos via Ollama LOCAL.
//
// Por que Ollama: roda 100% offline, zero custo, zero rate-limit. Trade-off
// é qualidade (modelos 7-9B são ok mas não Sonnet) e latência (1-5min por
// disciplina dependendo do hardware).
//
// Pipeline:
//   1. Busca questões + capítulos da disciplina/concurso no Turso
//   2. Monta contexto compacto (título, enunciado curto, gabarito, material_* curado)
//   3. POST http://localhost:11434/api/chat com format=json
//   4. Retorna { content, sourceHash }
//
// Setup (uma vez, na máquina que vai gerar):
//   curl -fsSL https://ollama.com/install.sh | sh
//   ollama serve  (deixa rodando)
//   ollama pull llama3.1:8b
//   No .env.local: OLLAMA_MODEL=llama3.1:8b  (ou qwen2.5:7b, gemma2:9b, etc.)

import crypto from 'crypto';
import { lsClient } from '@/lib/db';
import type { StudyMaterialContent } from './study-material-types';

const DEFAULT_BASE_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3.1:8b';

// Context window precisa caber prompt + saída. Llama 3.1 suporta 128K; usamos 16K
// pra ficar rápido. Aumente se o modelo cortar respostas.
const NUM_CTX = 16384;
const TEMPERATURE = 0.4;

interface QuestionRow {
  titulo: string;
  capitulo: string;
  enunciado: string;
  resposta_correta: string;
  explicacao: string | null;
  dica: string | null;
  material_resumo: string | null;
  material_topicos: string | null;
  material_estrategia: string | null;
}

interface ConcursoRow {
  titulo: string;
  organizador: string;
  banca: string | null;
  nivel_escolaridade: string | null;
}

function getBaseUrl(): string {
  return process.env.OLLAMA_BASE_URL?.replace(/\/$/, '') || DEFAULT_BASE_URL;
}

function getModel(): string {
  return process.env.OLLAMA_MODEL || DEFAULT_MODEL;
}

function hashSources(rows: QuestionRow[]): string {
  const h = crypto.createHash('md5');
  for (const r of rows) {
    h.update(r.titulo);
    h.update('|');
    h.update(r.material_resumo ?? '');
    h.update('|');
    h.update(r.material_topicos ?? '');
    h.update('|');
    h.update(r.material_estrategia ?? '');
  }
  return h.digest('hex');
}

async function loadConcurso(slug: string): Promise<ConcursoRow | null> {
  const rs = await lsClient.execute({
    sql: `SELECT titulo, organizador, banca, nivel_escolaridade
          FROM concursos WHERE slug = ? LIMIT 1`,
    args: [slug],
  });
  if (rs.rows.length === 0) return null;
  return rs.rows[0] as unknown as ConcursoRow;
}

async function loadQuestions(concursoSlug: string, disciplina: string): Promise<QuestionRow[]> {
  // Pega questões do concurso específico E questões "globais" da disciplina.
  // Limite menor que na versão Anthropic — modelos locais têm context menor.
  const rs = await lsClient.execute({
    sql: `SELECT q.titulo, q.capitulo, q.enunciado, q.resposta_correta,
                 q.explicacao, q.dica,
                 q.material_resumo, q.material_topicos, q.material_estrategia
          FROM questions q
          LEFT JOIN concursos c ON c.id = q.concurso_id
          WHERE q.disciplina = ?
            AND (c.slug = ? OR q.concurso_id IS NULL)
          ORDER BY q.capitulo, q.id
          LIMIT 80`,
    args: [disciplina, concursoSlug],
  });
  return rs.rows as unknown as QuestionRow[];
}

function buildContextSummary(rows: QuestionRow[]): string {
  const byChapter = new Map<string, QuestionRow[]>();
  for (const r of rows) {
    const key = r.capitulo || 'Geral';
    const arr = byChapter.get(key) ?? [];
    arr.push(r);
    byChapter.set(key, arr);
  }

  const parts: string[] = [];
  for (const [chapter, qs] of byChapter.entries()) {
    parts.push(`### Capítulo: ${chapter}`);
    parts.push(`(${qs.length} questões no banco)`);
    const samples = qs.slice(0, 5); // mais enxuto pra modelos locais
    for (const q of samples) {
      parts.push(`- ${q.titulo}`);
      if (q.material_resumo) {
        parts.push(`  RESUMO: ${q.material_resumo.slice(0, 400)}`);
      }
      if (q.material_estrategia) {
        parts.push(`  ESTRATÉGIA: ${q.material_estrategia.slice(0, 300)}`);
      }
      if (q.explicacao) {
        parts.push(`  GABARITO: ${q.explicacao.slice(0, 300)}`);
      }
    }
    parts.push('');
  }
  return parts.join('\n');
}

function buildSystemPrompt(): string {
  return `Você é um professor brasileiro especialista em concursos públicos. Escreve material de estudos COMPLETO, didático e específico para concurso público brasileiro.

REGRAS:
- Português brasileiro formal-didático
- Foco 100% no que cai em concurso público (sem teoria acadêmica solta)
- Direto, estruturado, com exemplos resolvidos e pegadinhas de banca
- Cada capítulo precisa ter pelo menos 3-4 blocos de conteúdo
- SEMPRE inclua exemplos do tipo "example" (pelo menos 1 por capítulo)
- SEMPRE inclua callouts "warning" para pegadinhas de banca
- Use "definition" para termos-chave

SAÍDA: APENAS um JSON válido seguindo este schema TypeScript:

interface ContentBlock {
  // tipos: paragraph | heading | list | callout | example | definition | table
  type: string;
  // paragraph/heading/callout: text
  text?: string;
  // heading: level (2 ou 3)
  level?: number;
  // list: items array, ordered? bool
  items?: string[];
  ordered?: boolean;
  // callout: style (tip|warning|info|rule), title?
  style?: string;
  title?: string;
  // example: question, answer, explanation?
  question?: string;
  answer?: string;
  explanation?: string;
  // definition: term, meaning
  term?: string;
  meaning?: string;
  // table: headers, rows
  headers?: string[];
  rows?: string[][];
}

interface ChapterSection {
  title: string;
  intro?: string;
  blocks: ContentBlock[];
}

interface StudyMaterialContent {
  title: string;        // título do concurso
  subtitle: string;     // subtítulo curto
  concurso_slug: string;
  disciplina: string;
  abstract: string;     // 2-3 parágrafos de visão geral
  chapters: ChapterSection[]; // 5 a 10 capítulos
  references?: string[];      // 3-6 fontes
  generated_at: string;       // ISO timestamp
}

Retorne APENAS o JSON, sem texto antes ou depois, sem fences \`\`\`.`;
}

function buildUserPrompt(params: {
  concurso: ConcursoRow;
  concursoSlug: string;
  disciplina: string;
  context: string;
}): string {
  return `Gere o material de estudos completo para a disciplina **${params.disciplina}** do concurso **${params.concurso.titulo}** (${params.concurso.organizador}${params.concurso.banca ? `, banca ${params.concurso.banca}` : ''}).

Base seu material nos tópicos e conteúdo curado abaixo. Pode expandir, mas mantenha relevância:

${params.context || '(banco de questões vazio para esta disciplina — gere material baseado no que tipicamente cai em concurso público brasileiro)'}

Slug do concurso: "${params.concursoSlug}". Disciplina: "${params.disciplina}".

Retorne APENAS o JSON do StudyMaterialContent.`;
}

function tryParseContent(raw: string): StudyMaterialContent {
  let text = raw.trim();
  // Remove fences de markdown que modelos às vezes adicionam
  if (text.startsWith('```')) {
    const firstNl = text.indexOf('\n');
    text = text.slice(firstNl + 1);
    if (text.endsWith('```')) text = text.slice(0, -3).trim();
  }
  // Encontra o primeiro { e o último } (defensivo)
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('Resposta do Ollama não contém JSON parseável');
  }
  const json = text.slice(start, end + 1);
  return JSON.parse(json) as StudyMaterialContent;
}

interface OllamaChatResponse {
  message?: { role: string; content: string };
  done?: boolean;
  prompt_eval_count?: number;
  eval_count?: number;
  // erro
  error?: string;
}

async function callOllama(systemPrompt: string, userPrompt: string): Promise<{
  text: string;
  inputTokens: number;
  outputTokens: number;
}> {
  const baseUrl = getBaseUrl();
  const model = getModel();

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      format: 'json', // força saída JSON válida (Ollama feature)
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      options: {
        temperature: TEMPERATURE,
        num_ctx: NUM_CTX,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Ollama retornou ${res.status}: ${body.slice(0, 300)}. ` +
      `Verifique se 'ollama serve' está rodando em ${baseUrl} e se o modelo '${model}' foi puxado (ollama pull ${model}).`,
    );
  }

  const data = (await res.json()) as OllamaChatResponse;

  if (data.error) {
    throw new Error(`Ollama error: ${data.error}`);
  }
  if (!data.message?.content) {
    throw new Error('Ollama não retornou conteúdo');
  }

  return {
    text: data.message.content,
    inputTokens: data.prompt_eval_count ?? 0,
    outputTokens: data.eval_count ?? 0,
  };
}

export interface GeneratedMaterial {
  content: StudyMaterialContent;
  sourceHash: string;
  tokensUsed: { input: number; output: number };
}

export async function generateStudyMaterial(params: {
  concursoSlug: string;
  disciplina: string;
}): Promise<GeneratedMaterial> {
  const { concursoSlug, disciplina } = params;

  const concurso = await loadConcurso(concursoSlug);
  if (!concurso) {
    throw new Error(`Concurso não encontrado: ${concursoSlug}`);
  }

  const rows = await loadQuestions(concursoSlug, disciplina);
  const sourceHash = hashSources(rows);
  const context = buildContextSummary(rows);

  const { text, inputTokens, outputTokens } = await callOllama(
    buildSystemPrompt(),
    buildUserPrompt({ concurso, concursoSlug, disciplina, context }),
  );

  const parsed = tryParseContent(text);

  // Sanity: garante que o slug/disciplina batem (modelo às vezes inventa).
  parsed.concurso_slug = concursoSlug;
  parsed.disciplina = disciplina;
  parsed.generated_at = new Date().toISOString();

  // Defaults caso o modelo omita campos
  if (!parsed.title) parsed.title = concurso.titulo;
  if (!parsed.subtitle) parsed.subtitle = `Material focado em ${concurso.organizador}`;
  if (!parsed.abstract) parsed.abstract = `Material completo de ${disciplina} para o concurso ${concurso.titulo}.`;
  if (!Array.isArray(parsed.chapters)) parsed.chapters = [];

  return {
    content: parsed,
    sourceHash,
    tokensUsed: {
      input: inputTokens,
      output: outputTokens,
    },
  };
}

/**
 * Lista todas as combinações (concurso_slug, disciplina) que têm pelo menos uma
 * questão cadastrada. Usado pelo batch generator do admin.
 */
export async function listGeneratableDisciplines(): Promise<
  Array<{ concursoSlug: string; concursoTitulo: string; disciplina: string; questionCount: number }>
> {
  const rs = await lsClient.execute(`
    SELECT c.slug AS slug, c.titulo AS titulo, q.disciplina AS disciplina, COUNT(*) AS n
    FROM concursos c
    LEFT JOIN questions q ON q.concurso_id = c.id
    WHERE q.disciplina IS NOT NULL
    GROUP BY c.slug, q.disciplina
    UNION ALL
    SELECT 'global' AS slug, 'Material Geral' AS titulo, q.disciplina AS disciplina, COUNT(*) AS n
    FROM questions q
    WHERE q.disciplina IS NOT NULL AND q.concurso_id IS NULL
    GROUP BY q.disciplina
  `);
  return rs.rows.map((row) => {
    const r = row as unknown as { slug: string; titulo: string; disciplina: string; n: number };
    return {
      concursoSlug: r.slug,
      concursoTitulo: r.titulo,
      disciplina: r.disciplina,
      questionCount: Number(r.n),
    };
  });
}

/**
 * Health-check do Ollama. Retorna `{ ok: true }` se conectado e modelo disponível,
 * ou `{ ok: false, error }` caso contrário. Útil pra UI admin avisar se o setup
 * tá quebrado antes de o user clicar "Gerar".
 */
export async function checkOllamaHealth(): Promise<{ ok: boolean; error?: string; model?: string; baseUrl?: string }> {
  const baseUrl = getBaseUrl();
  const model = getModel();
  try {
    const res = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) {
      return { ok: false, error: `Ollama respondeu ${res.status}`, baseUrl, model };
    }
    const data = (await res.json()) as { models?: Array<{ name: string }> };
    const found = (data.models ?? []).some((m) => m.name === model || m.name.startsWith(model + ':'));
    if (!found) {
      return {
        ok: false,
        error: `Modelo "${model}" não encontrado. Rode: ollama pull ${model}`,
        baseUrl,
        model,
      };
    }
    return { ok: true, baseUrl, model };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      error: `Ollama não está acessível em ${baseUrl}. Inicie com: ollama serve. (${msg})`,
      baseUrl,
      model,
    };
  }
}
