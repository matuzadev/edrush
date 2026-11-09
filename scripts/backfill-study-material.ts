// ─────────────────────────────────────────────────────────────────────────────
// Backfill determinístico de material de estudos por questão.
//
// Para cada questão sem material no Turso, gera os 5 campos
// (material_resumo, material_topicos, material_estrategia,
//  material_referencias, material_conteudo) usando dados da própria questão
// (enunciado, explicacao, dica, dificuldade, tipo) + bibliografia por disciplina
// vinda de src/data/study-tips.json.
//
// Também vincula concurso_id=5 (EsFCEx) nas questões das disciplinas mapeadas
// em concurso-areas.ts → bloco EsFCEx, quando ainda estão NULL.
//
// Idempotente: questões com material já populado são pulados.
//
// Uso: npx tsx scripts/backfill-study-material.ts
// Opções:
//   --force-all          Reescreve material mesmo em quem já tem
//   --disciplina=<slug>  Restringe a uma disciplina
//   --concurso=<id>      Restringe a um concurso_id
//   --dry-run            Calcula tudo mas não escreve
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

// ─── env ─────────────────────────────────────────────────────────────────────
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const args = process.argv.slice(2);
const FORCE_ALL = args.includes('--force-all');
const DRY_RUN = args.includes('--dry-run');
const DISC_FILTER = args.find((a) => a.startsWith('--disciplina='))?.split('=')[1];
const CONCURSO_FILTER = args.find((a) => a.startsWith('--concurso='))?.split('=')[1];

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || process.env.NEXT_PUBLIC_TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// ─── study-tips (bibliografia / chips / estratégia por disciplina) ───────────
type Ref = { title: string; type: string; author: string };
type StudyTip = {
  quickReview: string;
  keyTopics: string[];
  references: Ref[];
  strategy: string;
};
const studyTips: Record<string, StudyTip> = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/data/study-tips.json'), 'utf-8'),
);

// Aliases entre slugs que aparecem em `disciplina` mas não em study-tips.
const DISC_ALIASES: Record<string, string> = {
  'Direito Constitucional': 'direito-constitucional',
  'Raciocínio Lógico': 'raciocinio-logico',
  'Português': 'portugues',
  'Direito Administrativo': 'direito-administrativo',
  'Matemática': 'matematica-basica',
  'Direito Penal': 'direito-penal',
  'Informática Básica': 'informatica-basica',
  'Matemática Financeira': 'matematica-financeira',
  'Administração Pública': 'direito-administrativo',
  'Atualidades': 'historia-temas',
  'banco-de-dados': 'bancos-de-dados',
};

function tipFor(disciplina: string): StudyTip | null {
  if (studyTips[disciplina]) return studyTips[disciplina];
  const alias = DISC_ALIASES[disciplina];
  if (alias && studyTips[alias]) return studyTips[alias];
  return null;
}

// ─── EsFCEx → concurso_id=5 (slugs das disciplinas do bloco EsFCEx) ──────────
const ESFCEX_DISCIPLINAS = new Set([
  'compreensao-textos',
  'gramatica-texto',
  'semantica',
  'reescrita-textual',
  'historia-colonia',
  'historia-imperio',
  'historia-republica',
  'historia-temas',
  'geografia-fisica',
  'geografia-humana',
  'geografia-economica',
  'organizacao-territorio',
  'fundamentos-informatica',
  'escritorio-produtividade',
  'teoria-sistemas',
  'camadas-aplicacao',
  'sistemas-informacao',
  'teoria-informacao',
  'banco-de-dados',
  'extras-esfcex',
]);

// ─── helpers de geração ──────────────────────────────────────────────────────

function clamp(s: string, max: number): string {
  if (!s) return s;
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const last = cut.lastIndexOf('. ');
  return last > max * 0.6 ? cut.slice(0, last + 1) : cut + '…';
}

// Tópicos derivados da questão: palavras-chave do enunciado/capítulo
// + os keyTopics da disciplina (filtrados pelos termos que aparecem na questão).
function buildTopicos(
  q: { enunciado: string; capitulo: string; explicacao: string | null; dica: string | null },
  tip: StudyTip | null,
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (s: string) => {
    const t = s.trim();
    if (!t || seen.has(t.toLowerCase())) return;
    seen.add(t.toLowerCase());
    out.push(t);
  };

  // O capítulo é sempre o primeiro chip — orienta o leitor.
  push(q.capitulo);

  // KeyTopics da disciplina que casam (substring case-insensitive) com a questão.
  const haystack = [q.enunciado, q.explicacao ?? '', q.dica ?? '', q.capitulo]
    .join(' ')
    .toLowerCase();

  if (tip) {
    for (const kt of tip.keyTopics) {
      const head = kt.split(/[:(\-—]/)[0].trim().toLowerCase();
      if (head && haystack.includes(head.split(' ').slice(0, 2).join(' '))) {
        push(kt);
        if (out.length >= 6) break;
      }
    }
    // Se ainda não tem o suficiente, completa com os 2-3 primeiros keyTopics
    if (out.length < 4) {
      for (const kt of tip.keyTopics.slice(0, 4)) {
        push(kt);
        if (out.length >= 6) break;
      }
    }
  }

  return out.slice(0, 6);
}

// Resumo: 2-4 frases — abre situando a temática do capítulo e fecha
// reforçando o que essa questão específica testa.
function buildResumo(q: {
  enunciado: string;
  explicacao: string | null;
  dica: string | null;
  capitulo: string;
  disciplina: string;
}): string {
  const expl = (q.explicacao ?? '').trim();
  const dica = (q.dica ?? '').trim();

  const lead = `Esta questão aborda **${q.capitulo}** — um dos pontos clássicos cobrados nas bancas brasileiras.`;

  // Pegamos a 1ª-2ª frase da explicação (a "essência") para tornar específico.
  let core = '';
  if (expl) {
    const sentences = expl.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
    core = ' ' + sentences;
  } else if (dica) {
    core = ` ${dica}`;
  } else {
    core = ` Domine os conceitos do capítulo para resolver itens dessa natureza com segurança.`;
  }

  return clamp(lead + core, 600);
}

// Estratégia: combina o tipo (V/F vs múltipla) com o keyword principal do cap.
function buildEstrategia(q: {
  tipo: string;
  capitulo: string;
  dificuldade: string;
  dica: string | null;
  disciplina: string;
}, tip: StudyTip | null): string {
  const isVF = q.tipo === 'verdadeiro_falso' || q.tipo === 'verdadeiro-falso';
  const dif = (q.dificuldade ?? 'médio').toLowerCase();

  const bankTip = isVF
    ? `Em itens **Verdadeiro/Falso** (estilo CESPE/CEBRASPE), o erro normalmente está em **um único termo absoluto** — palavras como *"sempre"*, *"nunca"*, *"qualquer"*, *"todo"*, *"somente"*. Releia comparando palavra a palavra com a regra de ${q.capitulo}.`
    : `Em **múltipla escolha**, elimine primeiro as alternativas extremas e as que misturam conceitos de capítulos diferentes. Foque na alternativa que aplica diretamente a regra de ${q.capitulo}.`;

  const difTip =
    dif === 'fácil'
      ? `Como questão **fácil**, espera-se conhecimento direto do conceito principal — não tente complicar.`
      : dif === 'difícil'
        ? `Como questão **difícil**, atenção a exceções, jurisprudência recente e detalhes pouco óbvios da matéria.`
        : `Em nível **médio**, a banca costuma testar uma exceção ou um caso específico do conceito.`;

  const hintLine = q.dica
    ? ` Use a dica como atalho: *"${clamp(q.dica, 140)}"*.`
    : '';

  const stratLine = tip?.strategy ? ` Estratégia geral da disciplina: ${clamp(tip.strategy, 200)}` : '';

  return clamp(`${bankTip} ${difTip}${hintLine}${stratLine}`, 800);
}

// Referências: vindas do study-tips da disciplina (até 4).
function buildReferencias(disciplina: string, tip: StudyTip | null): Ref[] {
  if (tip) return tip.references.slice(0, 4);
  return [
    {
      title: `Manual de ${disciplina} para Concursos`,
      type: 'livro',
      author: 'Bibliografia recomendada do edital',
    },
  ];
}

// Conteúdo completo (markdown, 200-500 palavras): estruturado por seções.
function buildConteudo(
  q: {
    enunciado: string;
    explicacao: string | null;
    dica: string | null;
    capitulo: string;
    disciplina: string;
    tipo: string;
    dificuldade: string;
    resposta_correta: string;
  },
  topicos: string[],
  estrategia: string,
  refs: Ref[],
  tip: StudyTip | null,
): string {
  const expl = (q.explicacao ?? '').trim();
  const dica = (q.dica ?? '').trim();
  const isVF = q.tipo === 'verdadeiro_falso' || q.tipo === 'verdadeiro-falso';
  const respLabel = isVF
    ? `**${q.resposta_correta}**`
    : `**alternativa ${q.resposta_correta}**`;

  const sections: string[] = [];

  sections.push(`# ${q.capitulo}`);
  sections.push(`> Material de estudos específico para esta questão.`);

  // O que está em jogo
  sections.push(`## O que esta questão testa`);
  sections.push(
    `A questão exige domínio de **${q.capitulo}** (${q.disciplina.replace(/-/g, ' ')}). A resposta correta é ${respLabel}, e o raciocínio por trás disso é o seguinte:`,
  );
  if (expl) {
    sections.push(expl);
  } else {
    sections.push(`A banca testa o conceito central do capítulo aplicado a um caso típico. Reveja o tópico no material indicado abaixo.`);
  }

  // Conceitos-chave
  if (topicos.length) {
    sections.push(`## Conceitos-chave`);
    sections.push(topicos.map((t) => `- ${t}`).join('\n'));
  }

  // Pegadinhas / estratégia
  sections.push(`## Como atacar este tipo de questão`);
  sections.push(estrategia);

  // Dica
  if (dica) {
    sections.push(`## Dica rápida`);
    sections.push(`> ${dica}`);
  }

  // Estratégia geral da disciplina
  if (tip?.strategy) {
    sections.push(`## Como estudar **${q.disciplina.replace(/-/g, ' ')}**`);
    sections.push(tip.strategy);
  }

  // Referências
  if (refs.length) {
    sections.push(`## Bibliografia recomendada`);
    sections.push(refs.map((r) => `- **${r.title}** — *${r.author}* (${r.type})`).join('\n'));
  }

  return sections.join('\n\n');
}

// ─── main ────────────────────────────────────────────────────────────────────
async function main() {
  const conditions: string[] = [];
  const sqlArgs: (string | number)[] = [];

  if (!FORCE_ALL) {
    conditions.push(
      `(material_resumo IS NULL OR material_resumo = '' OR material_conteudo IS NULL OR material_conteudo = '')`,
    );
  }
  if (DISC_FILTER) {
    conditions.push('disciplina = ?');
    sqlArgs.push(DISC_FILTER);
  }
  if (CONCURSO_FILTER) {
    conditions.push('concurso_id = ?');
    sqlArgs.push(parseInt(CONCURSO_FILTER, 10));
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `
    SELECT id, disciplina, capitulo, tipo, enunciado, explicacao, dica, dificuldade,
           resposta_correta, concurso_id
    FROM questions
    ${where}
    ORDER BY id
  `;

  console.log('[backfill] Buscando questões…');
  const rs = await client.execute({ sql, args: sqlArgs });
  console.log(`[backfill] ${rs.rows.length} questões para processar.`);

  let updated = 0;
  let concursoLinked = 0;
  const batchSize = 50;

  for (let i = 0; i < rs.rows.length; i += batchSize) {
    const batch = rs.rows.slice(i, i + batchSize);
    const stmts: { sql: string; args: any[] }[] = [];

    for (const row of batch as any[]) {
      const q = {
        id: Number(row.id),
        disciplina: String(row.disciplina ?? ''),
        capitulo: String(row.capitulo ?? ''),
        tipo: String(row.tipo ?? ''),
        enunciado: String(row.enunciado ?? ''),
        explicacao: row.explicacao ? String(row.explicacao) : null,
        dica: row.dica ? String(row.dica) : null,
        dificuldade: String(row.dificuldade ?? 'médio'),
        resposta_correta: String(row.resposta_correta ?? ''),
        concurso_id: row.concurso_id != null ? Number(row.concurso_id) : null,
      };

      const tip = tipFor(q.disciplina);
      const topicos = buildTopicos(q, tip);
      const resumo = buildResumo(q);
      const estrategia = buildEstrategia(q, tip);
      const refs = buildReferencias(q.disciplina, tip);
      const conteudo = buildConteudo(q, topicos, estrategia, refs, tip);

      // Vincula concurso EsFCEx (id=5) se a disciplina é do bloco e ainda está null.
      const shouldLinkEsfcex = q.concurso_id == null && ESFCEX_DISCIPLINAS.has(q.disciplina);

      if (shouldLinkEsfcex) {
        stmts.push({
          sql: `UPDATE questions SET
                  material_resumo = ?,
                  material_topicos = ?,
                  material_estrategia = ?,
                  material_referencias = ?,
                  material_conteudo = ?,
                  concurso_id = 5,
                  atualizado_em = ?
                WHERE id = ?`,
          args: [
            resumo,
            JSON.stringify(topicos),
            estrategia,
            JSON.stringify(refs),
            conteudo,
            new Date().toISOString(),
            q.id,
          ],
        });
        concursoLinked++;
      } else {
        stmts.push({
          sql: `UPDATE questions SET
                  material_resumo = ?,
                  material_topicos = ?,
                  material_estrategia = ?,
                  material_referencias = ?,
                  material_conteudo = ?,
                  atualizado_em = ?
                WHERE id = ?`,
          args: [
            resumo,
            JSON.stringify(topicos),
            estrategia,
            JSON.stringify(refs),
            conteudo,
            new Date().toISOString(),
            q.id,
          ],
        });
      }

      updated++;
    }

    if (DRY_RUN) {
      // Mostra apenas um exemplo do lote para inspeção.
      if (i === 0 && batch.length) {
        const sample = stmts[0];
        console.log('\n[dry-run] Exemplo do primeiro UPDATE:');
        console.log('SQL:', sample.sql);
        console.log('Args[0..4] preview:');
        console.log(' - resumo:', String(sample.args[0]).slice(0, 200));
        console.log(' - topicos:', sample.args[1]);
        console.log(' - estrategia:', String(sample.args[2]).slice(0, 200));
        console.log(' - referencias:', sample.args[3]);
        console.log(' - conteudo (primeiros 400 chars):');
        console.log(String(sample.args[4]).slice(0, 400));
      }
    } else {
      await client.batch(stmts, 'write');
      if ((i / batchSize) % 5 === 0) {
        console.log(`[backfill] ${updated}/${rs.rows.length} processados…`);
      }
    }
  }

  console.log('\n[backfill] ✅ Concluído.');
  console.log(`  - Questões atualizadas com material: ${updated}`);
  console.log(`  - Questões vinculadas ao EsFCEx (concurso_id=5): ${concursoLinked}`);
  if (DRY_RUN) console.log('  - Modo dry-run: nada foi persistido.');
}

main().catch((e) => {
  console.error('[backfill] erro:', e);
  process.exit(1);
});
