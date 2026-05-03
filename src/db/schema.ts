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
    question_id: integer('question_id').notNull().references(() => questions.id),
    resposta_dada: text('resposta_dada').notNull(),
    acertou: integer('acertou').notNull(), // 0 = errado, 1 = correto
    tempo_resposta_ms: integer('tempo_resposta_ms'), // Em milissegundos
    disciplina: text('disciplina'),
    capitulo: text('capitulo'),
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
    subject: text('subject'), // matéria/disciplina da sessão
    criado_em: text('criado_em').notNull(),
  },
  (table) => [
    index('idx_study_sessions_user_id').on(table.user_id),
    index('idx_study_sessions_date').on(table.session_date),
    index('idx_study_sessions_user_date').on(table.user_id, table.session_date),
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
