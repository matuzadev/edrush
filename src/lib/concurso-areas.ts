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
    // Baseado no edital Ed_1_PF_25_Abertura (CEBRASPE) para Perito Criminal Federal
    // — Área 3: Informática Forense. Currículo confere com o conteúdo programático
    // dos cargos da PF (Conhecimentos Básicos + Específicos da especialidade).
    match: ['perito criminal federal', 'perito digital'],
    areas: [
      // ── Conhecimentos Básicos ────────────────────────────────────────────
      'portugues',                  // Língua Portuguesa (capítulos seedados)
      'informatica-basica',         // Noções gerais de informática
      'direito-constitucional',     // Noções de Direito Constitucional
      'direito-administrativo',     // Noções de Direito Administrativo
      'direito-penal',              // Direito Penal e Processual Penal
      'criminalistica',             // Criminalística
      // ── Conhecimentos Específicos — Informática Forense ─────────────────
      'fundamentos-computacao',     // Arquitetura, SOs, virtualização, RAID
      'redes-de-computadores',      // Modelos OSI/TCP/IP, protocolos, VPN
      'seguranca-informacao',       // Conceitos de segurança, malware, defesas
      'computacao-nuvem',           // Cloud, virtualização, containers
      'bancos-de-dados',            // SGBDs, SQL, modelagem, NoSQL
      'engenharia-reversa-malware', // Análise de malware, debuggers, sandbox
      'linguagens-programacao',     // C, Java, Python, JS, web
      'estrutura-dados-algoritmos', // Listas, árvores, busca, ordenação
      'sistemas-informacao',        // Ciclo de vida, requisitos, testes
      'teoria-sistemas',            // Sistemas abertos/fechados, integração
      'extras-esfcex',              // Criptografia, LGPD, forense digital, Git
      // ── Produção textual e estratégia de prova ──────────────────────────
      'prova-discursiva',
      'banca-analise',
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
    // Baseado na Planilha PF & EsFCEX.xlsx — aba "Concurso ESFCEX"
    match: ['esfcex', 'exercito brasileiro', 'exército brasileiro'],
    areas: [
      // Conhecimentos Gerais
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
      // Conhecimentos Específicos
      'fundamentos-informatica',
      'escritorio-produtividade',
      'redes-de-computadores',
      'seguranca-informacao',
      'computacao-nuvem',
      'teoria-sistemas',
      'camadas-aplicacao',
      'sistemas-informacao',
      'teoria-informacao',
      'banco-de-dados',
      // Extra recomendado
      'extras-esfcex',
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
