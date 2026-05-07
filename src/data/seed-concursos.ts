// Banco semente de concursos — carregado idempotentemente em initializeDatabase().
// A chave de idempotência é o campo `slug`: cada concurso só é inserido se nenhuma
// linha com aquele slug já existir na tabela. Para reaplicar/atualizar um concurso,
// apague a linha no banco (DELETE FROM concursos WHERE slug=?) e reinicie o servidor.
//
// Fontes verificadas para PF 2025:
//   Edital oficial: https://cdn.cebraspe.org.br/concursos/pf_25/arquivos/Ed_1_PF_25_Abertura.pdf
//   Site CEBRASPE: https://www.cebraspe.org.br/concursos/pf_25
//   Portal PF: https://www.gov.br/pf/pt-br/acesso-a-informacao/servidores/concursos

export type SeedConcurso = {
  // Campos da tabela `concursos` (colunas existentes)
  titulo: string;
  organizador: string;  // órgão realizador (ex.: "Polícia Federal")
  orgao: string;        // órgão vinculador (ex.: "Ministério da Justiça e Segurança Pública")
  descricao: string;
  slug: string;         // chave de idempotência — único por concurso
  // uf_id e cidade_id são null: concurso federal, vagas em todo o território nacional
  vagas_total: number | null;
  vagas_por_funcao: string | null; // JSON de { cargo: vagas } para o concurso todo
  status: 'previsto' | 'edital_proximo' | 'inscricoes_abertas' | 'aguardando_prova' | 'finalizado';
  data_publicacao_edital: string | null; // YYYY-MM-DD
  data_abertura_inscricoes: string | null;
  data_fechamento_inscricoes: string | null;
  data_prova_objetiva: string | null;
  data_prova_discursiva: string | null;
  data_resultado_final: string | null;
  url_edital: string | null;
  url_site_oficial: string | null;
  banca: string | null;
  remuneracao_inicial: number | null; // BRL, ex.: 26800.00
  nivel_escolaridade: string | null;
  fonte_scrape: string | null;
  logo_url: string | null;

  // Colunas novas adicionadas nesta versão
  cargo: string | null;              // cargo específico seedado (ex.: "Perito Criminal Federal")
  area_especialidade: string | null; // área dentro do cargo (ex.: "Informática Forense")
  edital_numero: string | null;      // número do edital (ex.: "Ed_1_PF_25_Abertura")
  edital_ano: number | null;
  vagas_cargo: number | null;        // vagas apenas para este cargo/especialidade
  url_inscricao: string | null;
  requisitos: string | null;         // JSON array de strings
  destaque: number;                  // 1 = destacar na UI, 0 = normal
};

// ─── PF 2025 — Perito Criminal Federal ──────────────────────────────────────
// Fonte primária: Edital Ed_1_PF_25_Abertura, publicado em 20/05/2025 no DOU.
// Banca: CEBRASPE. Total do concurso: 1.000 vagas (5 cargos).
// Perito Criminal Federal: 69 vagas distribuídas em 13 especialidades.
// Provas realizadas em 27/07/2025. Status em Mai/2026: finalizado (CFP em andamento).
//
// Vagas por especialidade (verificadas):
//   Área 1  — Contábil-Financeira:        16 vagas
//   Área 2  — Engenharia Elétrica/Eletrônica: 1 vaga
//   Área 3  — Informática Forense:        24 vagas
//   Área 5  — Geologia Forense:            5 vagas
//   Área 7  — Engenharia Civil:            2 vagas
//   Área 11 — Engenharia Cartográfica:     1 vaga
//   Área 12 — Medicina Legal:              1 vaga
//   Área 16 — Física Forense:              1 vaga
//   Área 17 — Engenharia de Minas:         1 vaga
//   Área 19 — Genética Forense:            1 vaga
//   Área 20 — Engenharia Ambiental:        1 vaga
//   Área 21 — Antropologia Forense:        1 vaga
//   Área 22 — Meio Ambiente:              14 vagas
//   TOTAL:                                69 vagas

const PF_2025_BASE: Omit<SeedConcurso, 'cargo' | 'area_especialidade' | 'vagas_cargo' | 'slug' | 'titulo' | 'descricao'> = {
  organizador: 'Polícia Federal',
  orgao: 'Ministério da Justiça e Segurança Pública',
  vagas_total: 1000,
  vagas_por_funcao: JSON.stringify({
    'Delegado de Polícia Federal': 120,
    'Perito Criminal Federal': 69,
    'Escrivão de Polícia Federal': 160,
    'Agente de Polícia Federal': 630,
    'Papiloscopista Policial Federal': 21,
  }),
  status: 'finalizado',
  data_publicacao_edital: '2025-05-20',
  data_abertura_inscricoes: '2025-05-26',
  data_fechamento_inscricoes: '2025-06-17',
  data_prova_objetiva: '2025-07-27',
  data_prova_discursiva: '2025-07-27',
  data_resultado_final: null, // resultado final ainda não publicado oficialmente no DOU até a data de seed
  url_edital: 'https://cdn.cebraspe.org.br/concursos/pf_25/arquivos/Ed_1_PF_25_Abertura.pdf',
  url_site_oficial: 'https://www.cebraspe.org.br/concursos/pf_25',
  banca: 'CEBRASPE',
  remuneracao_inicial: 26800.00,
  nivel_escolaridade: 'Superior Completo',
  fonte_scrape: 'cebraspe.org.br',
  logo_url: '/imagens/logos/policia-federal.png',
  edital_numero: 'Ed_1_PF_25_Abertura',
  edital_ano: 2025,
  url_inscricao: 'https://www.cebraspe.org.br/concursos/pf_25',
  destaque: 1,
};

export const SEED_CONCURSOS: SeedConcurso[] = [
  // ── PF 2025: Perito Criminal Federal — visão geral do cargo ──────────────
  // Entrada principal que representa o cargo como um todo no seletor de concurso.
  {
    ...PF_2025_BASE,
    slug: 'pf-perito-criminal-2025',
    titulo: 'Polícia Federal 2025 — Perito Criminal Federal',
    descricao:
      'Concurso para Perito Criminal Federal da Polícia Federal, com 69 vagas distribuídas ' +
      'em 13 especialidades (Informática Forense, Contábil-Financeira, Meio Ambiente e outras). ' +
      'Banca CEBRASPE. Provas realizadas em 27/07/2025. Remuneração inicial: R$ 26.800,00.',
    cargo: 'Perito Criminal Federal',
    area_especialidade: null, // representa o cargo completo, não uma área específica
    vagas_cargo: 69,
    requisitos: JSON.stringify([
      'Diploma de graduação em curso superior específico à área de especialidade',
      'Registro no conselho de classe profissional pertinente (quando aplicável)',
      'Carteira Nacional de Habilitação — categoria B (mínimo)',
      'Aptidão em exame médico, psicológico e avaliação física',
      'Idoneidade moral comprovada por investigação social',
      'Nacionalidade brasileira',
      'Estar em dia com obrigações eleitorais e militares',
    ]),
  },

  // ── PF 2025: Perito Criminal Federal — Área 3: Informática Forense ───────
  // Maior área em vagas (24). Entrada dedicada para estudantes de TI/Segurança.
  {
    ...PF_2025_BASE,
    slug: 'pf-perito-criminal-informatica-forense-2025',
    titulo: 'Polícia Federal 2025 — Perito Criminal Federal (Informática Forense)',
    descricao:
      'Cargo: Perito Criminal Federal — Área 3: Informática Forense. ' +
      '24 vagas (maior área do concurso). Exige graduação em Ciência da Computação, ' +
      'Engenharia de Computação, Sistemas de Informação ou áreas correlatas. ' +
      'Banca CEBRASPE. Provas: 27/07/2025.',
    cargo: 'Perito Criminal Federal',
    area_especialidade: 'Informática Forense',
    vagas_cargo: 24,
    requisitos: JSON.stringify([
      'Diploma de graduação em Ciência da Computação, Engenharia de Computação, Sistemas de Informação ou área correlata',
      'Carteira Nacional de Habilitação — categoria B (mínimo)',
      'Aptidão em exame médico, psicológico e avaliação física',
      'Idoneidade moral comprovada por investigação social',
      'Nacionalidade brasileira',
      'Estar em dia com obrigações eleitorais e militares',
    ]),
  },

  // ── EXEMPLO NÃO VERIFICADO: PRF ──────────────────────────────────────────
  // AVISO: Dados abaixo são baseados em informações públicas gerais sobre a PRF,
  // mas NÃO refletem um edital específico publicado. Não use como fonte oficial.
  // Marque como 'previsto' para indicar que ainda não há edital confirmado.
  {
    slug: 'prf-policial-rodoviario-federal-2026',
    titulo: 'Polícia Rodoviária Federal 2026 — Policial Rodoviário Federal',
    organizador: 'Polícia Rodoviária Federal',
    orgao: 'Ministério da Justiça e Segurança Pública',
    descricao:
      'EXEMPLO (dados não verificados por edital publicado). ' +
      'Próximo concurso da PRF previsto para 2026. Última remuneração conhecida: ' +
      'R$ 11.670,33 (2025). Pedido de 263 vagas encaminhado ao MJSP em 2025.',
    cargo: 'Policial Rodoviário Federal',
    area_especialidade: null,
    vagas_total: null,
    vagas_por_funcao: null,
    vagas_cargo: null,
    status: 'previsto',
    data_publicacao_edital: null,
    data_abertura_inscricoes: null,
    data_fechamento_inscricoes: null,
    data_prova_objetiva: null,
    data_prova_discursiva: null,
    data_resultado_final: null,
    url_edital: null,
    url_site_oficial: 'https://www.prf.gov.br',
    banca: null,
    remuneracao_inicial: 11670.33,
    nivel_escolaridade: 'Superior Completo',
    fonte_scrape: null,
    logo_url: '/imagens/logos/prf.png',
    edital_numero: null,
    edital_ano: null,
    url_inscricao: null,
    requisitos: JSON.stringify([
      'Diploma de graduação em curso superior de qualquer área',
      'Carteira Nacional de Habilitação — categoria B (mínimo)',
      'Aptidão em exame médico, psicológico e avaliação física',
    ]),
    destaque: 0,
  },
];
