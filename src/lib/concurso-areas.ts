/**
 * Mapeamento de concursos para suas matérias com base em editais reais.
 * A chave é um padrão (substring) do título do concurso em lowercase sem acentos.
 * As matérias são slugs de src/data/subjects.json.
 */

export interface ConcursoAreaMap {
  match: string[];   // padrões que identificam o concurso (titulo lowercase, sem acento)
  areas: string[];   // slugs das matérias correspondentes
}

export const CONCURSO_AREAS: ConcursoAreaMap[] = [
  // ─── POLÍCIA FEDERAL ───────────────────────────────────────────────────────
  {
    match: ['perito criminal federal', 'perito digital'],
    areas: [
      'lingua-portuguesa',
      'direito-penal',
      'direito-constitucional',
      'direito-administrativo',
      'criminalistica',
      'medicina-legal',
      'fundamentos-computacao',
      'redes-de-computadores',
      'seguranca-informacao',
      'bancos-de-dados',
      'linguagens-programacao',
      'estrutura-dados-algoritmos',
      'engenharia-reversa-malware',
      'computacao-nuvem',
      'prova-discursiva',
    ],
  },
  {
    match: ['delegado de policia federal', 'delegado de polícia federal'],
    areas: [
      'lingua-portuguesa',
      'direito-constitucional',
      'direito-administrativo',
      'direito-penal',
      'criminalistica',
      'medicina-legal',
      'criminologia',
      'direito-tributario',
      'raciocinio-logico',
      'prova-discursiva',
    ],
  },
  {
    match: ['agente de policia federal', 'agente de polícia federal'],
    areas: [
      'lingua-portuguesa',
      'direito-constitucional',
      'direito-administrativo',
      'direito-penal',
      'raciocinio-logico',
      'informatica-basica',
      'criminalistica',
      'criminologia',
    ],
  },
  {
    match: ['escrivao de policia federal', 'escrivão de polícia federal'],
    areas: [
      'lingua-portuguesa',
      'direito-constitucional',
      'direito-administrativo',
      'direito-penal',
      'raciocinio-logico',
      'informatica-basica',
    ],
  },

  // ─── RECEITA FEDERAL ───────────────────────────────────────────────────────
  {
    match: ['auditor fiscal da receita', 'auditor-fiscal da receita'],
    areas: [
      'lingua-portuguesa',
      'direito-tributario',
      'legislacao-tributaria',
      'direito-constitucional',
      'direito-administrativo',
      'contabilidade-geral',
      'matematica-financeira',
      'economia',
      'raciocinio-logico',
      'informatica-basica',
      'prova-discursiva',
    ],
  },
  {
    match: ['analista tributario da receita', 'analista tributário da receita'],
    areas: [
      'lingua-portuguesa',
      'direito-tributario',
      'legislacao-tributaria',
      'direito-constitucional',
      'direito-administrativo',
      'contabilidade-geral',
      'matematica-financeira',
      'raciocinio-logico',
      'informatica-basica',
    ],
  },

  // ─── POLÍCIA RODOVIÁRIA FEDERAL ────────────────────────────────────────────
  {
    match: ['policial rodoviario federal', 'policial rodoviário federal'],
    areas: [
      'lingua-portuguesa',
      'direito-constitucional',
      'direito-administrativo',
      'direito-penal',
      'legislacao-transito',
      'raciocinio-logico',
      'informatica-basica',
    ],
  },

  // ─── BANCO CENTRAL ─────────────────────────────────────────────────────────
  {
    match: ['banco central'],
    areas: [
      'lingua-portuguesa',
      'direito-constitucional',
      'direito-administrativo',
      'economia',
      'matematica-financeira',
      'contabilidade-geral',
      'redes-de-computadores',
      'fundamentos-computacao',
      'bancos-de-dados',
      'seguranca-informacao',
      'computacao-nuvem',
      'linguagens-programacao',
      'raciocinio-logico',
    ],
  },

  // ─── TCU ───────────────────────────────────────────────────────────────────
  {
    match: ['tcu', 'tribunal de contas da uniao', 'tribunal de contas da união'],
    areas: [
      'lingua-portuguesa',
      'direito-constitucional',
      'direito-administrativo',
      'contabilidade-geral',
      'raciocinio-logico',
      'redes-de-computadores',
      'fundamentos-computacao',
      'bancos-de-dados',
      'seguranca-informacao',
      'computacao-nuvem',
      'linguagens-programacao',
      'estrutura-dados-algoritmos',
      'prova-discursiva',
    ],
  },

  // ─── CORREIOS ──────────────────────────────────────────────────────────────
  {
    match: ['correios', 'empresa brasileira de correios'],
    areas: [
      'lingua-portuguesa',
      'matematica-basica',
      'raciocinio-logico',
      'informatica-basica',
      'atendimento-cliente',
      'direito-constitucional',
    ],
  },

  // ─── INSS ──────────────────────────────────────────────────────────────────
  {
    match: ['inss', 'seguro social'],
    areas: [
      'lingua-portuguesa',
      'direito-previdenciario',
      'direito-constitucional',
      'direito-administrativo',
      'matematica-basica',
      'raciocinio-logico',
      'informatica-basica',
    ],
  },

  // ─── CAIXA ECONÔMICA FEDERAL ───────────────────────────────────────────────
  {
    match: ['caixa economica federal', 'caixa econômica federal'],
    areas: [
      'lingua-portuguesa',
      'matematica-financeira',
      'raciocinio-logico',
      'direito-constitucional',
      'direito-administrativo',
      'contabilidade-geral',
      'economia',
      'redes-de-computadores',
      'bancos-de-dados',
      'linguagens-programacao',
      'seguranca-informacao',
      'computacao-nuvem',
      'estrutura-dados-algoritmos',
    ],
  },

  // ─── BANCO DO BRASIL ───────────────────────────────────────────────────────
  {
    match: ['banco do brasil'],
    areas: [
      'lingua-portuguesa',
      'matematica-financeira',
      'raciocinio-logico',
      'direito-constitucional',
      'direito-administrativo',
      'contabilidade-geral',
      'economia',
      'redes-de-computadores',
      'bancos-de-dados',
      'linguagens-programacao',
      'seguranca-informacao',
      'computacao-nuvem',
      'estrutura-dados-algoritmos',
    ],
  },

  // ─── EXÉRCITO / ESFCEx ─────────────────────────────────────────────────────
  {
    match: ['esfcex', 'exercito brasileiro', 'exército brasileiro'],
    areas: [
      'lingua-portuguesa',
      'matematica-financeira',
      'fisica-basica',
      'raciocinio-logico',
      'redes-de-computadores',
      'fundamentos-computacao',
      'bancos-de-dados',
      'linguagens-programacao',
      'seguranca-informacao',
      'estrutura-dados-algoritmos',
    ],
  },

  // ─── ANATEL ────────────────────────────────────────────────────────────────
  {
    match: ['anatel'],
    areas: [
      'lingua-portuguesa',
      'direito-constitucional',
      'direito-administrativo',
      'direito-tributario',
      'telecomunicacoes',
      'redes-de-computadores',
      'seguranca-informacao',
      'matematica-financeira',
      'raciocinio-logico',
      'prova-discursiva',
    ],
  },

  // ─── POLÍCIA PENAL FEDERAL ─────────────────────────────────────────────────
  {
    match: ['policia penal federal', 'polícia penal federal', 'depen'],
    areas: [
      'lingua-portuguesa',
      'direito-constitucional',
      'direito-administrativo',
      'direito-penal',
      'criminalistica',
      'redes-de-computadores',
      'fundamentos-computacao',
      'seguranca-informacao',
      'engenharia-reversa-malware',
      'raciocinio-logico',
    ],
  },

  // ─── IBGE ──────────────────────────────────────────────────────────────────
  {
    match: ['ibge'],
    areas: [
      'lingua-portuguesa',
      'matematica-basica',
      'raciocinio-logico',
      'informatica-basica',
      'direito-administrativo',
      'geografia-fisica',
      'geografia-humana',
      'estatistica',
    ],
  },

  // ─── ABIN ──────────────────────────────────────────────────────────────────
  {
    match: ['abin'],
    areas: [
      'lingua-portuguesa',
      'direito-constitucional',
      'direito-administrativo',
      'direito-penal',
      'raciocinio-logico',
      'redes-de-computadores',
      'seguranca-informacao',
      'fundamentos-computacao',
      'prova-discursiva',
    ],
  },

  // ─── STF / STJ ─────────────────────────────────────────────────────────────
  {
    match: ['stf', 'stj', 'supremo tribunal', 'superior tribunal'],
    areas: [
      'lingua-portuguesa',
      'direito-constitucional',
      'direito-administrativo',
      'direito-civil',
      'direito-tributario',
      'contabilidade-geral',
      'raciocinio-logico',
      'informatica-basica',
      'prova-discursiva',
    ],
  },
];

/** Remove acentos e converte para lowercase para comparação */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Retorna os slugs de matérias para um dado título de concurso.
 * Retorna null se não encontrar mapeamento (usa fallback do subjects.json).
 */
export function getAreasForConcurso(titulo: string): string[] | null {
  const normalized = normalize(titulo);
  for (const entry of CONCURSO_AREAS) {
    for (const pattern of entry.match) {
      if (normalized.includes(normalize(pattern))) {
        return entry.areas;
      }
    }
  }
  return null;
}
