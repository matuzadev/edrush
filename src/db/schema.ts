import { sqliteTable, text, integer, real, primaryKey, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Tabela de UF (Estados) e Cidades
export const ufs = sqliteTable('ufs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  codigo_ibge: integer('codigo_ibge').notNull().unique(),
  sigla: text('sigla').notNull().unique(),
  nome: text('nome').notNull(),
  regiao: text('regiao').notNull(), // Norte, Nordeste, Centro-Oeste, Sudeste, Sul
  criado_em: text('criado_em').default(new Date().toISOString()).notNull(),
});

export const cidades = sqliteTable(
  'cidades',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    codigo_ibge: integer('codigo_ibge').notNull().unique(),
    nome: text('nome').notNull(),
    uf_id: integer('uf_id').notNull().references(() => ufs.id),
    criado_em: text('criado_em').default(new Date().toISOString()).notNull(),
  },
  (table) => [
    index('idx_cidades_uf_id').on(table.uf_id),
    index('idx_cidades_nome').on(table.nome),
  ]
);

// Tabela de Usuários (migração do Supabase)
export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    senha_hash: text('senha_hash'), // null se usar OAuth
    nome: text('nome'),
    foto_url: text('foto_url'),
    provider: text('provider').default('email'), // email, google
    provider_id: text('provider_id'), // ID do Google, etc
    uf_id: integer('uf_id').references(() => ufs.id),
    cidade_id: integer('cidade_id').references(() => cidades.id),
    subscription_status: text('subscription_status').default('free'), // free, active, cancelled
    subscription_expires_at: text('subscription_expires_at'),
    stripe_customer_id: text('stripe_customer_id'),
    // Onboarding
    onboarding_completed: integer('onboarding_completed').default(0), // 0 = false, 1 = true
    selected_concurso_id: integer('selected_concurso_id'),
    selected_concurso_slug: text('selected_concurso_slug'),
    selected_areas: text('selected_areas'), // JSON array of disciplina strings
    // Perfil customizável
    username: text('username'),
    bio: text('bio'),
    birthday: text('birthday'), // YYYY-MM-DD
    location: text('location'),
    avatar_id: integer('avatar_id').default(1),
    xp: integer('xp').default(0),
    level: integer('level').default(1),
    referral_code: text('referral_code').unique(),
    referred_by_code: text('referred_by_code'),
    equipped_border: text('equipped_border').default('recruta'), // slug da borda equipada
    // Economia de cristais + buffs
    crystals: integer('crystals').notNull().default(0),
    expBuffMultiplier: real('exp_buff_multiplier').notNull().default(1.0),
    expBuffExpiresAt: text('exp_buff_expires_at'),
    criado_em: text('criado_em').notNull(),
    atualizado_em: text('atualizado_em').notNull(),
  },
  (table) => [
    index('idx_users_email').on(table.email),
    index('idx_users_provider_id').on(table.provider_id),
    index('idx_users_uf_id').on(table.uf_id),
    index('idx_users_cidade_id').on(table.cidade_id),
  ]
);

// Tabela de Concursos
export const concursos = sqliteTable(
  'concursos',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    titulo: text('titulo').notNull(),
    organizador: text('organizador').notNull(), // Polícia Federal, Polícia Estadual, etc
    orgao: text('orgao').notNull(), // Ministério, Secretaria, etc
    descricao: text('descricao'),
    uf_id: integer('uf_id').references(() => ufs.id),
    cidade_id: integer('cidade_id').references(() => cidades.id),
    vagas_total: integer('vagas_total'),
    vagas_por_funcao: text('vagas_por_funcao'), // JSON
    status: text('status').notNull(), // ativo, edital_proximo, finalizado
    data_publicacao_edital: text('data_publicacao_edital'),
    data_abertura_inscricoes: text('data_abertura_inscricoes'),
    data_fechamento_inscricoes: text('data_fechamento_inscricoes'),
    data_prova_objetiva: text('data_prova_objetiva'),
    data_prova_discursiva: text('data_prova_discursiva'),
    data_resultado_final: text('data_resultado_final'),
    url_edital: text('url_edital'),
    url_site_oficial: text('url_site_oficial'),
    banca: text('banca'), // CESPE, FCC, FGV, etc
    remuneracao_inicial: real('remuneracao_inicial'),
    nivel_escolaridade: text('nivel_escolaridade'), // Ensino Médio, Superior, etc
    criado_em: text('criado_em').default(new Date().toISOString()).notNull(),
    atualizado_em: text('atualizado_em').default(new Date().toISOString()).notNull(),
    fonte_scrape: text('fonte_scrape'), // gov.br, PC, IADES, etc
    logo_url: text('logo_url'), // URL da logo do órgão (ex: /logos/orgaos/pf.png)
    slug: text('slug'), // slug para URL amigável
    // Colunas enriquecidas (adicionadas via ALTER TABLE idempotente)
    cargo: text('cargo'), // cargo específico (ex.: "Perito Criminal Federal")
    area_especialidade: text('area_especialidade'), // área dentro do cargo (ex.: "Informática Forense")
    edital_numero: text('edital_numero'), // número do edital (ex.: "Ed_1_PF_25_Abertura")
    edital_ano: integer('edital_ano'),
    vagas_cargo: integer('vagas_cargo'), // vagas só para este cargo/especialidade
    url_inscricao: text('url_inscricao'),
    requisitos: text('requisitos'), // JSON array de strings
    destaque: integer('destaque').default(0), // 1 = destacado na UI
  },
  (table) => [
    index('idx_concursos_status').on(table.status),
    index('idx_concursos_uf_id').on(table.uf_id),
    index('idx_concursos_data_inscricoes').on(table.data_abertura_inscricoes),
  ]
);

// Tabela de Editais
export const editais = sqliteTable(
  'editais',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    concurso_id: integer('concurso_id').notNull().references(() => concursos.id),
    numero_edital: text('numero_edital').notNull(),
    data_publicacao: text('data_publicacao').notNull(),
    url_pdf: text('url_pdf'),
    versao: integer('versao').default(1),
    alteracoes_descritas: text('alteracoes_descritas'),
    criado_em: text('criado_em').default(new Date().toISOString()).notNull(),
  },
  (table) => [
    index('idx_editais_concurso_id').on(table.concurso_id),
    primaryKey({ columns: [table.concurso_id, table.numero_edital] }),
  ]
);

// Tabela de Candidato x Concurso (favoritos/acompanhamento)
export const concurso_candidato = sqliteTable(
  'concurso_candidato',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: text('user_id').notNull().references(() => users.id),
    concurso_id: integer('concurso_id').notNull().references(() => concursos.id),
    is_favorito: integer('is_favorito').default(0), // 0 = false, 1 = true
    estudando: integer('estudando').default(0), // 0 = false, 1 = true
    data_inscricao: text('data_inscricao'),
    numero_inscricao: text('numero_inscricao'),
    status_candidatura: text('status_candidatura'), // nao_inscrito, inscrito, aprovado, reprovado
    criado_em: text('criado_em').default(new Date().toISOString()).notNull(),
    atualizado_em: text('atualizado_em').default(new Date().toISOString()).notNull(),
  },
  (table) => [
    index('idx_concurso_candidato_user').on(table.user_id),
    index('idx_concurso_candidato_concurso').on(table.concurso_id),
  ]
);

// Tabela de Questões
export const questions = sqliteTable(
  'questions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    titulo: text('titulo').notNull(),
    disciplina: text('disciplina').notNull(), // Direito Penal, Redes, etc
    capitulo: text('capitulo').notNull(), // Capítulo dentro da disciplina
    tipo: text('tipo').notNull(), // 'multipla_escolha', 'verdadeiro_falso'
    enunciado: text('enunciado').notNull(),
    explicacao: text('explicacao'), // Detalhes da resposta correta
    dica: text('dica'), // Dica para ajudar
    opcoes: text('opcoes'), // JSON array para múltipla escolha
    resposta_correta: text('resposta_correta').notNull(), // A, B, C, D, E ou "Verdadeiro"/"Falso"
    dificuldade: text('dificuldade').default('médio'), // fácil, médio, difícil
    fonte: text('fonte'), // CESPE, FCC, FGV, etc
    concurso_id: integer('concurso_id').references(() => concursos.id),
    ano: integer('ano'), // Ano da prova
    // Material de estudos por questão
    material_resumo: text('material_resumo'), // 2-4 frases sobre o conceito testado
    material_topicos: text('material_topicos'), // JSON array de strings (chips)
    material_estrategia: text('material_estrategia'), // como atacar esse tipo de questão
    material_referencias: text('material_referencias'), // JSON array de {title, type, author}
    material_conteudo: text('material_conteudo'), // Markdown completo 200-500 palavras
    criado_em: text('criado_em').default(new Date().toISOString()).notNull(),
    atualizado_em: text('atualizado_em').default(new Date().toISOString()).notNull(),
  },
  (table) => [
    index('idx_questions_disciplina').on(table.disciplina),
    index('idx_questions_capitulo').on(table.capitulo),
    index('idx_questions_concurso_id').on(table.concurso_id),
    index('idx_questions_dificuldade').on(table.dificuldade),
  ]
);

// Tabela de Respostas do Usuário (para rastreamento)
export const user_responses = sqliteTable(
  'user_responses',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: text('user_id').notNull().references(() => users.id),
    question_id: integer('question_id').notNull(), // 0 quando externo (questão local/mock)
    external_id: text('external_id'), // id da questão quando vier de fonte externa (localStorage/mock)
    resposta_dada: text('resposta_dada').notNull(),
    acertou: integer('acertou').notNull(), // 0 = errado, 1 = correto
    tempo_resposta_ms: integer('tempo_resposta_ms'), // Em milissegundos
    disciplina: text('disciplina'),
    capitulo: text('capitulo'),
    subject: text('subject'), // slug da matéria (ex.: "portugues")
    origem: text('origem'), // 'study' | 'simulado'
    respondida_em: text('respondida_em').default(new Date().toISOString()).notNull(),
  },
  (table) => [
    index('idx_user_responses_user_id').on(table.user_id),
    index('idx_user_responses_question_id').on(table.question_id),
    index('idx_user_responses_respondida_em').on(table.respondida_em),
  ]
);

// Tabela de Sessões de Estudo
// Registra agregados de cada sessão finalizada — não depende da tabela questions,
// pois questões ainda vêm do localStorage durante a migração em progresso.
export const study_sessions = sqliteTable(
  'study_sessions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: text('user_id').notNull().references(() => users.id),
    session_date: text('session_date').notNull(), // YYYY-MM-DD
    questions_answered: integer('questions_answered').notNull().default(0),
    correct_answers: integer('correct_answers').notNull().default(0),
    concurso_slug: text('concurso_slug'),
    subject: text('subject'), // matéria/disciplina da sessão (URL slug, ex.: "portugues")
    chapter_id: integer('chapter_id'), // id do capítulo em subjects.json (1, 2, 3...)
    criado_em: text('criado_em').notNull(),
  },
  (table) => [
    index('idx_study_sessions_user_id').on(table.user_id),
    index('idx_study_sessions_date').on(table.session_date),
    index('idx_study_sessions_user_date').on(table.user_id, table.session_date),
    index('idx_study_sessions_subject_chapter').on(table.subject, table.chapter_id),
  ]
);

// Tabela de Indicações (Referral)
export const referrals = sqliteTable(
  'referrals',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    referrer_id: text('referrer_id').notNull().references(() => users.id),
    referred_id: text('referred_id').references(() => users.id),
    referral_code: text('referral_code').notNull(),
    referred_email: text('referred_email'),
    status: text('status').notNull().default('registered'), // registered | subscribed | rewarded
    reward_granted_at: text('reward_granted_at'),
    criado_em: text('criado_em').notNull(),
    atualizado_em: text('atualizado_em').notNull(),
  },
  (table) => [
    index('idx_referrals_referrer_id').on(table.referrer_id),
    index('idx_referrals_referred_id').on(table.referred_id),
    index('idx_referrals_code').on(table.referral_code),
    index('idx_referrals_status').on(table.status),
  ]
);

// Tabela de Amizades
export const friendships = sqliteTable(
  'friendships',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    requester_id: text('requester_id').notNull().references(() => users.id),
    receiver_id: text('receiver_id').notNull().references(() => users.id),
    status: text('status').notNull().default('pending'), // pending, accepted, rejected
    criado_em: text('criado_em').notNull(),
    atualizado_em: text('atualizado_em').notNull(),
  },
  (table) => [
    index('idx_friendships_requester').on(table.requester_id),
    index('idx_friendships_receiver').on(table.receiver_id),
    index('idx_friendships_status').on(table.status),
  ]
);

// Tabela de Bordas Desbloqueadas pelo Usuário (catálogo das bordas vive no client em data/borders.ts)
export const user_borders = sqliteTable(
  'user_borders',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: text('user_id').notNull().references(() => users.id),
    border_slug: text('border_slug').notNull(),
    unlocked_at: text('unlocked_at').notNull(),
  },
  (table) => [
    index('idx_user_borders_user').on(table.user_id),
    index('idx_user_borders_slug').on(table.border_slug),
    index('idx_user_borders_pair').on(table.user_id, table.border_slug),
  ]
);

// Tabela de Mensagens (chat entre amigos)
export const messages = sqliteTable(
  'messages',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sender_id: text('sender_id').notNull().references(() => users.id),
    receiver_id: text('receiver_id').notNull().references(() => users.id),
    type: text('type').notNull().default('text'), // 'text' | 'result'
    content: text('content').notNull(),
    payload: text('payload'), // JSON: { accuracy, total, correct, subject, ... } quando type='result'
    read: integer('read').notNull().default(0),
    criado_em: text('criado_em').notNull(),
  },
  (table) => [
    index('idx_messages_sender').on(table.sender_id),
    index('idx_messages_receiver').on(table.receiver_id),
    index('idx_messages_pair').on(table.sender_id, table.receiver_id),
    index('idx_messages_read').on(table.read),
    index('idx_messages_criado').on(table.criado_em),
  ]
);

// Tabela de Preferências do Usuário
export const user_settings = sqliteTable(
  'user_settings',
  {
    user_id: text('user_id').primaryKey().references(() => users.id),
    display_name: text('display_name'),
    notif_email: integer('notif_email').notNull().default(1),
    notif_milestones: integer('notif_milestones').notNull().default(1),
    notif_weekly: integer('notif_weekly').notNull().default(1),
    pref_theme: text('pref_theme').notNull().default('dark'), // dark | light
    pref_language: text('pref_language').notNull().default('pt'), // pt | en
    pref_daily_goal: integer('pref_daily_goal').notNull().default(20),
    sound_enabled: integer('sound_enabled').notNull().default(1),
    // Novas preferências de UX do quiz
    auto_play: integer('auto_play').notNull().default(0),        // avança auto após 3s de feedback
    show_timer: integer('show_timer').notNull().default(1),      // exibe cronômetro no quiz
    hard_mode: integer('hard_mode').notNull().default(0),        // perde 2 vidas em vez de 1
    compact_ui: integer('compact_ui').notNull().default(0),      // UI compacta (~30% menos padding)
    criado_em: text('criado_em').notNull(),
    atualizado_em: text('atualizado_em').notNull(),
  }
);

// Tabela de Tentativas de Simulado
export const simulado_attempts = sqliteTable(
  'simulado_attempts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: text('user_id').notNull().references(() => users.id),
    discipline: text('discipline').notNull(),
    total_questions: integer('total_questions').notNull(),
    correct_answers: integer('correct_answers').notNull(),
    skipped: integer('skipped').notNull().default(0),
    accuracy: integer('accuracy').notNull().default(0), // 0-100
    duration_ms: integer('duration_ms'),
    started_at: text('started_at').notNull(),
    finished_at: text('finished_at').notNull(),
    criado_em: text('criado_em').notNull(),
  },
  (table) => [
    index('idx_simulado_attempts_user').on(table.user_id),
    index('idx_simulado_attempts_discipline').on(table.discipline),
    index('idx_simulado_attempts_finished').on(table.finished_at),
  ]
);

// Tabela de Notificações
export const notifications = sqliteTable(
  'notifications',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: text('user_id').notNull().references(() => users.id),
    type: text('type').notNull(), // friend_request, friend_accepted, achievement, admin_message
    title: text('title').notNull(),
    body: text('body').notNull(),
    read: integer('read').notNull().default(0), // 0 = false, 1 = true
    related_id: text('related_id'), // ID da solicitação, achievement, etc.
    criado_em: text('criado_em').notNull(),
  },
  (table) => [
    index('idx_notifications_user_id').on(table.user_id),
    index('idx_notifications_read').on(table.read),
    index('idx_notifications_user_read').on(table.user_id, table.read),
  ]
);

// Tabela de Capítulos/Blocos (módulos de estudo com 10+ questões por dificuldade)
export const chapters = sqliteTable(
  'chapters',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    disciplina: text('disciplina').notNull(), // Direito Penal, Português, etc
    numero: integer('numero').notNull(), // 1, 2, 3, etc.
    titulo: text('titulo').notNull(), // Nome do bloco (ex: "Conceitos Básicos")
    descricao: text('descricao'), // Descrição do conteúdo
    ordem: integer('ordem').notNull().default(0), // Ordem de exibição
    is_primeiro: integer('is_primeiro').default(0), // 0 = false, 1 = true (primeiro é sempre desbloqueado)
    criado_em: text('criado_em').default(new Date().toISOString()).notNull(),
  },
  (table) => [
    index('idx_chapters_disciplina').on(table.disciplina),
    index('idx_chapters_numero').on(table.numero),
    index('idx_chapters_ordem').on(table.ordem),
  ]
);

// Tabela de Progresso do Usuário nos Capítulos
export const user_chapter_progress = sqliteTable(
  'user_chapter_progress',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: text('user_id').notNull().references(() => users.id),
    chapter_id: integer('chapter_id').notNull().references(() => chapters.id),
    is_unlocked: integer('is_unlocked').default(0), // 0 = locked, 1 = unlocked
    is_completed: integer('is_completed').default(0), // 0 = false, 1 = true (quando termina com sucesso)
    acertos_total: integer('acertos_total').default(0),
    questoes_respondidas: integer('questoes_respondidas').default(0),
    percentual_acerto: real('percentual_acerto').default(0),
    tempo_estudo_ms: integer('tempo_estudo_ms').default(0), // Total de tempo em ms
    iniciado_em: text('iniciado_em'),
    completado_em: text('completado_em'),
    criado_em: text('criado_em').default(new Date().toISOString()).notNull(),
    atualizado_em: text('atualizado_em').default(new Date().toISOString()).notNull(),
  },
  (table) => [
    index('idx_user_chprog_user_id').on(table.user_id),
    index('idx_user_chprog_chapter_id').on(table.chapter_id),
    index('idx_user_chprog_user_chapter').on(table.user_id, table.chapter_id),
    index('idx_user_chprog_unlocked').on(table.is_unlocked),
  ]
);

// Tabela de Desbloqueios (qual capítulo desbloqueia qual)
export const chapter_unlocks = sqliteTable(
  'chapter_unlocks',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    chapter_id_origem: integer('chapter_id_origem').notNull().references(() => chapters.id),
    chapter_id_destino: integer('chapter_id_destino').notNull().references(() => chapters.id),
    percentual_necessario: real('percentual_necessario').default(80), // % de acerto necessário
    criado_em: text('criado_em').default(new Date().toISOString()).notNull(),
  },
  (table) => [
    index('idx_unlocks_origem').on(table.chapter_id_origem),
    index('idx_unlocks_destino').on(table.chapter_id_destino),
    primaryKey({ columns: [table.chapter_id_origem, table.chapter_id_destino] }),
  ]
);

// ── MATERIAIS DE ESTUDO (PDFs por disciplina/concurso) ────────────────
// Pipeline: IA gera content_json → admin revisa/publica → PDF renderiza e
// sobe pro Vercel Blob. Botão de download lê blob_url quando status='published'.
export const study_materials = sqliteTable(
  'study_materials',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    concurso_slug: text('concurso_slug').notNull(),
    disciplina: text('disciplina').notNull(),
    // JSON estruturado retornado pelo Claude (sections com type chapter/heading/paragraph/list/callout/example).
    content_json: text('content_json'),
    // URL no Vercel Blob — null enquanto não publicado.
    blob_url: text('blob_url'),
    // Hash MD5 das fontes (questions.material_*) usado pra invalidação.
    source_hash: text('source_hash'),
    page_count: integer('page_count'),
    file_size: integer('file_size'),
    // draft | published | failed | generating
    status: text('status').notNull().default('draft'),
    error_msg: text('error_msg'),
    generated_at: text('generated_at'),
    published_at: text('published_at'),
    published_by: text('published_by').references(() => users.id),
    criado_em: text('criado_em').notNull(),
    atualizado_em: text('atualizado_em').notNull(),
  },
  (table) => [
    index('idx_sm_concurso_disc').on(table.concurso_slug, table.disciplina),
    index('idx_sm_status').on(table.status),
  ]
);

// Log de downloads de materiais (auditoria + analytics).
export const study_material_downloads = sqliteTable(
  'study_material_downloads',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: text('user_id').notNull().references(() => users.id),
    material_id: integer('material_id').notNull().references(() => study_materials.id),
    downloaded_at: text('downloaded_at').notNull(),
  },
  (table) => [
    index('idx_smd_user').on(table.user_id),
    index('idx_smd_material').on(table.material_id),
  ]
);

// Tabela de transações de cristais (auditoria)
export const crystalTransactions = sqliteTable(
  'crystal_transactions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    amount: integer('amount').notNull(), // positivo = ganho, negativo = gasto
    type: text('type').notNull(), // earn_question | earn_chapter | earn_streak | spend_store | admin_grant | refund | other
    reason: text('reason').notNull(),
    referenceId: text('reference_id'),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    index('idx_crystal_tx_user').on(table.userId, table.createdAt),
    index('idx_crystal_tx_type').on(table.type),
  ]
);

// Catálogo de itens da loja
export const storeItems = sqliteTable(
  'store_items',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    category: text('category').notNull(), // avatar_orgao | avatar_vitoria | borda_perfil | mini_logo_badge | exp_buff | plataforma_trial
    priceCrystals: integer('price_crystals').notNull(),
    rarity: text('rarity').notNull(), // common | rare | epic | legendary | mythic
    imageUrl: text('image_url'),
    metadata: text('metadata'), // JSON
    isActive: integer('is_active').notNull().default(1),
    stock: integer('stock'), // null = ilimitado
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [
    index('idx_store_active').on(table.category, table.isActive),
    index('idx_store_rarity').on(table.rarity),
  ]
);

// Inventário do usuário
export const userInventory = sqliteTable(
  'user_inventory',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    storeItemId: text('store_item_id').notNull().references(() => storeItems.id),
    acquiredAt: text('acquired_at').notNull(),
    expiresAt: text('expires_at'),
    isEquipped: integer('is_equipped').notNull().default(0),
  },
  (table) => [
    index('idx_user_inv_user').on(table.userId),
    index('idx_user_inv_item').on(table.storeItemId),
    index('idx_user_inv_equipped').on(table.userId, table.isEquipped),
  ]
);

// Loadout do perfil (vitrine)
export const userProfileLoadout = sqliteTable(
  'user_profile_loadout',
  {
    userId: text('user_id').primaryKey().references(() => users.id),
    borderItemId: text('border_item_id'),
    avatarItemId: text('avatar_item_id'),
    equippedBadgeIds: text('equipped_badge_ids'), // JSON array max 3
    updatedAt: text('updated_at').notNull(),
  }
);

// ──────────────── COMUNIDADE ────────────────
export const posts = sqliteTable(
  'posts',
  {
    id: text('id').primaryKey(),
    user_id: text('user_id').notNull().references(() => users.id),
    content: text('content').notNull(),
    post_type: text('post_type').notNull().default('text'),
    group_id: text('group_id'),
    target_type: text('target_type'),
    target_id: text('target_id'),
    image_url: text('image_url'),
    metadata: text('metadata'),
    likes_count: integer('likes_count').notNull().default(0),
    comments_count: integer('comments_count').notNull().default(0),
    is_pinned: integer('is_pinned').notNull().default(0),
    deleted_at: text('deleted_at'),
    created_at: text('created_at').notNull(),
  },
  (table) => [
    index('idx_posts_feed').on(table.group_id, table.created_at),
    index('idx_posts_user').on(table.user_id, table.created_at),
    index('idx_posts_target').on(table.target_type, table.target_id),
    index('idx_posts_type').on(table.post_type, table.created_at),
  ],
);

export const comments = sqliteTable(
  'comments',
  {
    id: text('id').primaryKey(),
    post_id: text('post_id').notNull().references(() => posts.id),
    user_id: text('user_id').notNull().references(() => users.id),
    parent_id: text('parent_id'),
    content: text('content').notNull(),
    likes_count: integer('likes_count').notNull().default(0),
    deleted_at: text('deleted_at'),
    created_at: text('created_at').notNull(),
  },
  (table) => [
    index('idx_comments_post').on(table.post_id, table.created_at),
    index('idx_comments_parent').on(table.parent_id),
  ],
);

export const likes = sqliteTable(
  'likes',
  {
    user_id: text('user_id').notNull(),
    target_id: text('target_id').notNull(),
    target_type: text('target_type').notNull(),
    created_at: text('created_at').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.user_id, table.target_id, table.target_type] }),
    index('idx_likes_target').on(table.target_id, table.target_type),
  ],
);

export const studyGroups = sqliteTable(
  'study_groups',
  {
    id: text('id').primaryKey(),
    owner_id: text('owner_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    concurso_slug: text('concurso_slug'),
    is_private: integer('is_private').notNull().default(0),
    member_count: integer('member_count').notNull().default(1),
    icon: text('icon'),
    accent_color: text('accent_color'),
    created_at: text('created_at').notNull(),
  },
);

export const studyGroupMembers = sqliteTable(
  'study_group_members',
  {
    group_id: text('group_id').notNull().references(() => studyGroups.id),
    user_id: text('user_id').notNull().references(() => users.id),
    role: text('role').notNull().default('member'),
    joined_at: text('joined_at').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.group_id, table.user_id] }),
    index('idx_group_members_user').on(table.user_id),
  ],
);

export const reports = sqliteTable(
  'reports',
  {
    id: text('id').primaryKey(),
    reporter_id: text('reporter_id').notNull().references(() => users.id),
    target_id: text('target_id').notNull(),
    target_type: text('target_type').notNull(),
    reason: text('reason').notNull(),
    status: text('status').notNull().default('pending'),
    resolved_by: text('resolved_by'),
    resolved_at: text('resolved_at'),
    created_at: text('created_at').notNull(),
  },
  (table) => [
    index('idx_reports_pending').on(table.status, table.created_at),
  ],
);

// Relações
export const ufsRelations = relations(ufs, ({ many }) => ({
  cidades: many(cidades),
  users: many(users),
  concursos: many(concursos),
}));

export const cidadesRelations = relations(cidades, ({ one, many }) => ({
  uf: one(ufs, {
    fields: [cidades.uf_id],
    references: [ufs.id],
  }),
  users: many(users),
  concursos: many(concursos),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  uf: one(ufs, {
    fields: [users.uf_id],
    references: [ufs.id],
  }),
  cidade: one(cidades, {
    fields: [users.cidade_id],
    references: [cidades.id],
  }),
  concursos_seguindo: many(concurso_candidato),
}));

export const concursosRelations = relations(concursos, ({ one, many }) => ({
  uf: one(ufs, {
    fields: [concursos.uf_id],
    references: [ufs.id],
  }),
  cidade: one(cidades, {
    fields: [concursos.cidade_id],
    references: [cidades.id],
  }),
  editais: many(editais),
  candidatos: many(concurso_candidato),
}));

export const editaisRelations = relations(editais, ({ one }) => ({
  concurso: one(concursos, {
    fields: [editais.concurso_id],
    references: [concursos.id],
  }),
}));

export const concurso_candidatoRelations = relations(concurso_candidato, ({ one }) => ({
  user: one(users, {
    fields: [concurso_candidato.user_id],
    references: [users.id],
  }),
  concurso: one(concursos, {
    fields: [concurso_candidato.concurso_id],
    references: [concursos.id],
  }),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  concurso: one(concursos, {
    fields: [questions.concurso_id],
    references: [concursos.id],
  }),
  user_responses: many(user_responses),
}));

export const user_responsesRelations = relations(user_responses, ({ one }) => ({
  user: one(users, {
    fields: [user_responses.user_id],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [user_responses.question_id],
    references: [questions.id],
  }),
}));

export const studySessionsRelations = relations(study_sessions, ({ one }) => ({
  user: one(users, {
    fields: [study_sessions.user_id],
    references: [users.id],
  }),
}));

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  requester: one(users, {
    fields: [friendships.requester_id],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [friendships.receiver_id],
    references: [users.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, { fields: [referrals.referrer_id], references: [users.id] }),
  referred: one(users, { fields: [referrals.referred_id], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.user_id],
    references: [users.id],
  }),
}));

export const chaptersRelations = relations(chapters, ({ many }) => ({
  user_progress: many(user_chapter_progress),
  unlocks_de: many(chapter_unlocks, { relationName: 'unlocks_de' }),
  unlocks_para: many(chapter_unlocks, { relationName: 'unlocks_para' }),
}));

export const user_chapter_progressRelations = relations(user_chapter_progress, ({ one }) => ({
  user: one(users, {
    fields: [user_chapter_progress.user_id],
    references: [users.id],
  }),
  chapter: one(chapters, {
    fields: [user_chapter_progress.chapter_id],
    references: [chapters.id],
  }),
}));

export const chapter_unlocksRelations = relations(chapter_unlocks, ({ one }) => ({
  chapter_origem: one(chapters, {
    fields: [chapter_unlocks.chapter_id_origem],
    references: [chapters.id],
    relationName: 'unlocks_de',
  }),
  chapter_destino: one(chapters, {
    fields: [chapter_unlocks.chapter_id_destino],
    references: [chapters.id],
    relationName: 'unlocks_para',
  }),
}));
