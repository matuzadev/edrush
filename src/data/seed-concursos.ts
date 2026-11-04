// Banco semente de concursos — carregado idempotentemente em initializeDatabase().
// A chave de idempotência é o campo `slug`: cada concurso só é inserido se nenhuma
// linha com aquele slug já existir na tabela. Para reaplicar/atualizar um concurso,
// faça uma migração revisada após backup; a inicialização não atualiza nem exclui
// registros existentes.
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

const PF_2025_BASE: Omit<SeedConcurso, 'cargo' | 'area_especialidade' | 'vagas_cargo' | 'slug' | 'titulo' | 'descricao' | 'requisitos'> = {
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
  // ── PF 2025: Perito Criminal Federal — Área 3: Informática Forense ───────
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

  // ── EsFCEx 2026 — Oficial do Quadro Complementar (Informática) ──────────
  // Fontes verificadas (mai/2026):
  //   Edital ESEX2501 publicado no DOU em 12/03/2026 (CFO/QC + CFO/QCM 2026/2027).
  //   Site oficial: https://esfcex.eb.mil.br
  //   Inscrições: 27/03/2026 (10h) a 12/06/2026 (15h).
  //   Exame Intelectual: 12/07/2026 (09h-13h, horário de Brasília).
  //   Vagas Informática (CFO/QC): 4 (3 ampla concorrência + 1 cota negros).
  //   Total CFO/QC: 63 vagas em 19 áreas. Total geral (CFO/QC + Capelães): 66.
  //   Soldo durante o curso: R$ 8.245,00. Após formação (1º Ten): R$ 9.000+.
  //   Banca: a própria EsFCEx (concurso interno do Exército Brasileiro).
  //   Provas: 50 itens objetivos (20 conhecimentos gerais + 30 específicos).
  //   Disciplinas: Língua Portuguesa, História do Brasil, Geografia do Brasil,
  //                Conhecimentos Específicos da área (Informática).
  {
    titulo: 'EsFCEx 2026 — Oficial do Quadro Complementar (Informática)',
    organizador: 'EsFCEx (Escola de Saúde e Formação Complementar do Exército)',
    orgao: 'Exército Brasileiro — Comando do Exército / Ministério da Defesa',
    descricao:
      'Curso de Formação de Oficiais do Quadro Complementar (CFO/QC) — ' +
      'Área de Informática. 4 vagas (3 ampla concorrência + 1 reservada a negros) ' +
      'para matrícula em 2027. Exige graduação em Ciência da Computação, ' +
      'Engenharia da Computação, Sistemas de Informação ou Engenharia de Software. ' +
      'Provas em 12/07/2026 (Exame Intelectual). Soldo durante o curso: R$ 8.245,00.',
    slug: 'esfcex-oficial-quadro-complementar-informatica-2026',
    vagas_total: 66,
    vagas_por_funcao: JSON.stringify({
      'CFO/QC — Administração': 4,
      'CFO/QC — Ciências Contábeis': 4,
      'CFO/QC — Comunicação Social (Jornalismo)': 1,
      'CFO/QC — Direito': 5,
      'CFO/QC — Economia': 2,
      'CFO/QC — Enfermagem': 15,
      'CFO/QC — Estatística': 1,
      'CFO/QC — Informática': 4,
      'CFO/QC — Psicologia': 1,
      'CFO/QC — Pedagogia': 1,
      'CFO/QC — Veterinária': 1,
      'CFO/QC — Magistério Biologia': 2,
      'CFO/QC — Magistério Geografia': 3,
      'CFO/QC — Magistério História': 2,
      'CFO/QC — Magistério Inglês': 3,
      'CFO/QC — Magistério Matemática': 4,
      'CFO/QC — Magistério Português': 5,
      'CFO/QC — Magistério Química': 3,
      'CFO/QC — Magistério Física': 2,
      'CFO/QCM — Padre Católico Apostólico Romano': 2,
      'CFO/QCM — Pastor Evangélico': 1,
    }),
    status: 'inscricoes_abertas',
    data_publicacao_edital: '2026-03-12',
    data_abertura_inscricoes: '2026-03-27',
    data_fechamento_inscricoes: '2026-06-12',
    data_prova_objetiva: '2026-07-12',
    data_prova_discursiva: null,
    data_resultado_final: '2027-03-16',
    url_edital: 'https://esfcex.eb.mil.br/index.php/2026/concurso-2026',
    url_site_oficial: 'https://esfcex.eb.mil.br',
    banca: 'EsFCEx (Comissão de Aplicação e Fiscalização própria)',
    remuneracao_inicial: 8245.00,
    nivel_escolaridade: 'Superior Completo',
    fonte_scrape: 'esfcex.eb.mil.br',
    logo_url: '/imagens/logos/exercito-brasileiro.png',
    edital_numero: 'ESEX2501 — CFO/QC 2026',
    edital_ano: 2026,
    url_inscricao: 'https://esfcex.eb.mil.br',
    destaque: 1,
    cargo: 'Oficial do Quadro Complementar (CFO/QC)',
    area_especialidade: 'Informática',
    vagas_cargo: 4,
    requisitos: JSON.stringify([
      'Bacharelado em Ciência da Computação, Engenharia da Computação, Sistemas de Informação ou Engenharia de Software',
      'Idade entre 21 e 36 anos (até 31 DEZ do ano da matrícula)',
      'Nacionalidade brasileira',
      'Estar em dia com obrigações eleitorais e militares',
      'Idoneidade moral comprovada e bons antecedentes',
      'Aptidão em Inspeção de Saúde (IS), Exame de Aptidão Física (EAF) e Avaliação Psicológica',
      'Não estar respondendo a processo criminal',
      'Altura mínima: 1,60 m (homens) / 1,55 m (mulheres)',
    ]),
  },
];
