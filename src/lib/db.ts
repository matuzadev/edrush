import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '@/db/schema';
import { SEED_QUESTIONS, SEED_CHAPTERS } from '@/data/seed-questions';
import { SEED_CONCURSOS, DEPRECATED_CONCURSO_SLUGS } from '@/data/seed-concursos';
import { STORE_ITEMS_SEED } from '@/data/seed-store-items';
import crypto from 'crypto';

const databaseUrl =
  process.env.TURSO_DB_URL ??
  process.env.TURSO_DATABASE_URL ??
  process.env.NEXT_PUBLIC_TURSO_CONNECTION_URL;
const databaseAuthToken = process.env.TURSO_AUTH_TOKEN;

if (process.env.NODE_ENV === 'production' && !databaseUrl) {
  throw new Error('TURSO_DB_URL é obrigatória em produção; SQLite local não persiste na Vercel');
}
if (databaseUrl?.startsWith('libsql://') && !databaseAuthToken) {
  throw new Error('TURSO_AUTH_TOKEN é obrigatório para conectar ao banco Turso');
}

export const client = createClient({
  url: databaseUrl ?? 'file:data/foco-federal.db',
  authToken: databaseAuthToken,
});

// Alias for code that needs the raw libsql client. Prefer importing `client`
// or `db` (drizzle) directly — never `createClient(...)` again.
export const lsClient = client;

export const db = drizzle(client, { schema });

let _initialized = false;
let _initPromise: Promise<void> | null = null;

export async function initializeDatabase() {
  if (_initialized) return;
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    try {
    // Criar tabelas em lotes para evitar timeouts
    await client.batch(
      [
        `CREATE TABLE IF NOT EXISTS ufs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          codigo_ibge INTEGER NOT NULL UNIQUE,
          sigla TEXT NOT NULL UNIQUE,
          nome TEXT NOT NULL,
          regiao TEXT NOT NULL,
          criado_em TEXT NOT NULL
        )`,

        `CREATE TABLE IF NOT EXISTS cidades (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          codigo_ibge INTEGER NOT NULL UNIQUE,
          nome TEXT NOT NULL,
          uf_id INTEGER NOT NULL,
          criado_em TEXT NOT NULL,
          FOREIGN KEY (uf_id) REFERENCES ufs(id)
        )`,

        `CREATE INDEX IF NOT EXISTS idx_cidades_uf_id ON cidades(uf_id)`,
        `CREATE INDEX IF NOT EXISTS idx_cidades_nome ON cidades(nome)`,

        `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          senha_hash TEXT,
          nome TEXT,
          foto_url TEXT,
          provider TEXT DEFAULT 'email',
          provider_id TEXT,
          uf_id INTEGER,
          cidade_id INTEGER,
          onboarding_completed INTEGER DEFAULT 0,
          selected_concurso_id INTEGER,
          selected_concurso_slug TEXT,
          selected_areas TEXT,
          criado_em TEXT NOT NULL,
          atualizado_em TEXT NOT NULL,
          FOREIGN KEY (uf_id) REFERENCES ufs(id),
          FOREIGN KEY (cidade_id) REFERENCES cidades(id)
        )`,

        `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
        `CREATE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider_id)`,

        `CREATE TABLE IF NOT EXISTS concursos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          organizador TEXT NOT NULL,
          orgao TEXT NOT NULL DEFAULT '',
          descricao TEXT,
          slug TEXT,
          uf_id INTEGER,
          cidade_id INTEGER,
          vagas_total INTEGER,
          vagas_por_funcao TEXT,
          status TEXT NOT NULL,
          data_publicacao_edital TEXT,
          data_abertura_inscricoes TEXT,
          data_fechamento_inscricoes TEXT,
          data_prova_objetiva TEXT,
          data_prova_discursiva TEXT,
          data_resultado_final TEXT,
          url_edital TEXT,
          url_site_oficial TEXT,
          banca TEXT,
          remuneracao_inicial REAL,
          nivel_escolaridade TEXT,
          fonte_scrape TEXT,
          logo_url TEXT,
          criado_em TEXT NOT NULL,
          atualizado_em TEXT NOT NULL,
          FOREIGN KEY (uf_id) REFERENCES ufs(id),
          FOREIGN KEY (cidade_id) REFERENCES cidades(id)
        )`,

        `CREATE INDEX IF NOT EXISTS idx_concursos_status ON concursos(status)`,

        `CREATE TABLE IF NOT EXISTS editais (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          concurso_id INTEGER NOT NULL,
          numero_edital TEXT NOT NULL,
          data_publicacao TEXT NOT NULL,
          url_pdf TEXT,
          versao INTEGER DEFAULT 1,
          alteracoes_descritas TEXT,
          criado_em TEXT NOT NULL,
          FOREIGN KEY (concurso_id) REFERENCES concursos(id)
        )`,

        `CREATE TABLE IF NOT EXISTS concurso_candidato (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          concurso_id INTEGER NOT NULL,
          is_favorito INTEGER DEFAULT 0,
          estudando INTEGER DEFAULT 0,
          data_inscricao TEXT,
          numero_inscricao TEXT,
          status_candidatura TEXT,
          criado_em TEXT NOT NULL,
          atualizado_em TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (concurso_id) REFERENCES concursos(id)
        )`,

        `CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          disciplina TEXT NOT NULL,
          capitulo TEXT NOT NULL,
          tipo TEXT NOT NULL,
          enunciado TEXT NOT NULL,
          explicacao TEXT,
          dica TEXT,
          opcoes TEXT,
          resposta_correta TEXT NOT NULL,
          dificuldade TEXT DEFAULT 'médio',
          fonte TEXT,
          concurso_id INTEGER,
          ano INTEGER,
          criado_em TEXT NOT NULL,
          atualizado_em TEXT NOT NULL,
          FOREIGN KEY (concurso_id) REFERENCES concursos(id)
        )`,

        `CREATE INDEX IF NOT EXISTS idx_questions_disciplina ON questions(disciplina)`,
        `CREATE INDEX IF NOT EXISTS idx_questions_concurso_id ON questions(concurso_id)`,

        `CREATE TABLE IF NOT EXISTS user_responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          question_id INTEGER NOT NULL,
          resposta_dada TEXT NOT NULL,
          acertou INTEGER NOT NULL,
          tempo_resposta_ms INTEGER,
          respondida_em TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (question_id) REFERENCES questions(id)
        )`,

        `CREATE INDEX IF NOT EXISTS idx_user_responses_user_id ON user_responses(user_id)`,

        `CREATE TABLE IF NOT EXISTS study_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          session_date TEXT NOT NULL,
          questions_answered INTEGER NOT NULL DEFAULT 0,
          correct_answers INTEGER NOT NULL DEFAULT 0,
          concurso_slug TEXT,
          subject TEXT,
          criado_em TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )`,

        `CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id)`,
        `CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON study_sessions(session_date)`,
        `CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON study_sessions(user_id, session_date)`,

        `CREATE TABLE IF NOT EXISTS friendships (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          requester_id TEXT NOT NULL,
          receiver_id TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          criado_em TEXT NOT NULL,
          atualizado_em TEXT NOT NULL,
          FOREIGN KEY (requester_id) REFERENCES users(id),
          FOREIGN KEY (receiver_id) REFERENCES users(id)
        )`,

        `CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships(requester_id)`,
        `CREATE INDEX IF NOT EXISTS idx_friendships_receiver ON friendships(receiver_id)`,
        `CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status)`,

        `CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          read INTEGER NOT NULL DEFAULT 0,
          related_id TEXT,
          criado_em TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )`,

        `CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)`,
        `CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read)`,
        `CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read)`,

      ],
      'write'
    );

    // Adicionar colunas novas em users (safe: try/catch por coluna)
    const newUserColumns = [
      `ALTER TABLE users ADD COLUMN username TEXT`,
      `ALTER TABLE users ADD COLUMN bio TEXT`,
      `ALTER TABLE users ADD COLUMN birthday TEXT`,
      `ALTER TABLE users ADD COLUMN location TEXT`,
      `ALTER TABLE users ADD COLUMN avatar_id INTEGER DEFAULT 1`,
    ];

    for (const sql of newUserColumns) {
      try {
        await client.execute(sql);
      } catch {
        // Coluna já existe — ignorar
      }
    }

    // Índices em users.username (case-sensitive + expression index para LOWER).
    // Sem o expression index, lookups por username com LOWER(?) fazem full scan.
    try { await client.execute(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`); } catch {}
    try { await client.execute(`CREATE INDEX IF NOT EXISTS idx_users_username_lower ON users(LOWER(username))`); } catch {}

    // Adicionar colunas novas em users (xp, level, referral, borda equipada)
    const newUsersColumns = [
      `ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0`,
      `ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1`,
      `ALTER TABLE users ADD COLUMN referral_code TEXT`,
      `ALTER TABLE users ADD COLUMN referred_by_code TEXT`,
      `ALTER TABLE users ADD COLUMN equipped_border TEXT DEFAULT 'recruta'`,
    ];
    for (const sql of newUsersColumns) {
      try { await client.execute(sql); } catch { /* já existe */ }
    }

    // Tabela de bordas desbloqueadas
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS user_borders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          border_slug TEXT NOT NULL,
          unlocked_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_borders_user ON user_borders(user_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_borders_slug ON user_borders(border_slug)`);
      await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_user_borders_pair ON user_borders(user_id, border_slug)`);
    } catch { /* já existe */ }

    // Criar tabela de referrals
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS referrals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          referrer_id TEXT NOT NULL,
          referred_id TEXT,
          referral_code TEXT NOT NULL,
          referred_email TEXT,
          status TEXT NOT NULL DEFAULT 'registered',
          reward_granted_at TEXT,
          criado_em TEXT NOT NULL,
          atualizado_em TEXT NOT NULL,
          FOREIGN KEY (referrer_id) REFERENCES users(id),
          FOREIGN KEY (referred_id) REFERENCES users(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status)`);
    } catch { /* já existe */ }

    // Adicionar colunas de material de estudos em questions (safe: try/catch por coluna)
    const newQuestionMaterialColumns = [
      `ALTER TABLE questions ADD COLUMN material_resumo TEXT`,
      `ALTER TABLE questions ADD COLUMN material_topicos TEXT`,
      `ALTER TABLE questions ADD COLUMN material_estrategia TEXT`,
      `ALTER TABLE questions ADD COLUMN material_referencias TEXT`,
      `ALTER TABLE questions ADD COLUMN material_conteudo TEXT`,
    ];
    for (const sql of newQuestionMaterialColumns) {
      try { await client.execute(sql); } catch { /* já existe */ }
    }

    // Coluna chapter_id em study_sessions — para rastreamento "Duolingo-style" de
    // qual capítulo foi completado e desbloquear o próximo automaticamente.
    try {
      await client.execute(`ALTER TABLE study_sessions ADD COLUMN chapter_id INTEGER`);
    } catch { /* já existe */ }
    try {
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_study_sessions_subject_chapter ON study_sessions(subject, chapter_id)`);
    } catch { /* ignora */ }

    // Adicionar colunas novas em user_responses (safe: try/catch por coluna)
    const newResponseColumns = [
      `ALTER TABLE user_responses ADD COLUMN disciplina TEXT`,
      `ALTER TABLE user_responses ADD COLUMN capitulo TEXT`,
      `ALTER TABLE user_responses ADD COLUMN external_id TEXT`,
      `ALTER TABLE user_responses ADD COLUMN subject TEXT`,
      `ALTER TABLE user_responses ADD COLUMN origem TEXT`,
    ];

    for (const sql of newResponseColumns) {
      try {
        await client.execute(sql);
      } catch {
        // Coluna já existe — ignorar
      }
    }

    // Tabela de mensagens (chat entre amigos)
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sender_id TEXT NOT NULL,
          receiver_id TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'text',
          content TEXT NOT NULL,
          payload TEXT,
          read INTEGER NOT NULL DEFAULT 0,
          criado_em TEXT NOT NULL,
          FOREIGN KEY (sender_id) REFERENCES users(id),
          FOREIGN KEY (receiver_id) REFERENCES users(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_messages_pair ON messages(sender_id, receiver_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_messages_criado ON messages(criado_em)`);
    } catch { /* já existe */ }

    // Tabela de preferências do usuário (settings)
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS user_settings (
          user_id TEXT PRIMARY KEY,
          display_name TEXT,
          notif_email INTEGER NOT NULL DEFAULT 1,
          notif_milestones INTEGER NOT NULL DEFAULT 1,
          notif_weekly INTEGER NOT NULL DEFAULT 1,
          pref_theme TEXT NOT NULL DEFAULT 'dark',
          pref_language TEXT NOT NULL DEFAULT 'pt',
          pref_daily_goal INTEGER NOT NULL DEFAULT 20,
          sound_enabled INTEGER NOT NULL DEFAULT 1,
          criado_em TEXT NOT NULL,
          atualizado_em TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
    } catch { /* já existe */ }

    // Adicionar novas colunas de settings (idempotente)
    const newSettingsColumns = [
      `ALTER TABLE user_settings ADD COLUMN auto_play INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE user_settings ADD COLUMN show_timer INTEGER NOT NULL DEFAULT 1`,
      `ALTER TABLE user_settings ADD COLUMN hard_mode INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE user_settings ADD COLUMN compact_ui INTEGER NOT NULL DEFAULT 0`,
    ];
    for (const sql of newSettingsColumns) {
      try { await client.execute(sql); } catch { /* já existe */ }
    }

    // Tabela de tentativas de simulado
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS simulado_attempts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          discipline TEXT NOT NULL,
          total_questions INTEGER NOT NULL,
          correct_answers INTEGER NOT NULL,
          skipped INTEGER NOT NULL DEFAULT 0,
          accuracy INTEGER NOT NULL DEFAULT 0,
          duration_ms INTEGER,
          started_at TEXT NOT NULL,
          finished_at TEXT NOT NULL,
          criado_em TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_simulado_attempts_user ON simulado_attempts(user_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_simulado_attempts_discipline ON simulado_attempts(discipline)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_simulado_attempts_finished ON simulado_attempts(finished_at)`);
    } catch { /* já existe */ }

    // Criar tabela de Capítulos/Blocos
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS chapters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          disciplina TEXT NOT NULL,
          numero INTEGER NOT NULL,
          titulo TEXT NOT NULL,
          descricao TEXT,
          ordem INTEGER NOT NULL DEFAULT 0,
          is_primeiro INTEGER DEFAULT 0,
          criado_em TEXT NOT NULL
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_chapters_disciplina ON chapters(disciplina)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_chapters_numero ON chapters(numero)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_chapters_ordem ON chapters(ordem)`);
    } catch { /* já existe */ }

    // Criar tabela de Progresso do Usuário nos Capítulos
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS user_chapter_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          chapter_id INTEGER NOT NULL,
          is_unlocked INTEGER DEFAULT 0,
          is_completed INTEGER DEFAULT 0,
          acertos_total INTEGER DEFAULT 0,
          questoes_respondidas INTEGER DEFAULT 0,
          percentual_acerto REAL DEFAULT 0,
          tempo_estudo_ms INTEGER DEFAULT 0,
          iniciado_em TEXT,
          completado_em TEXT,
          criado_em TEXT NOT NULL,
          atualizado_em TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (chapter_id) REFERENCES chapters(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_chprog_user_id ON user_chapter_progress(user_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_chprog_chapter_id ON user_chapter_progress(chapter_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_chprog_user_chapter ON user_chapter_progress(user_id, chapter_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_chprog_unlocked ON user_chapter_progress(is_unlocked)`);
    } catch { /* já existe */ }

    // Criar tabela de Desbloqueios
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS chapter_unlocks (
          chapter_id_origem INTEGER NOT NULL,
          chapter_id_destino INTEGER NOT NULL,
          percentual_necessario REAL DEFAULT 80,
          criado_em TEXT NOT NULL,
          PRIMARY KEY (chapter_id_origem, chapter_id_destino),
          FOREIGN KEY (chapter_id_origem) REFERENCES chapters(id),
          FOREIGN KEY (chapter_id_destino) REFERENCES chapters(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_unlocks_origem ON chapter_unlocks(chapter_id_origem)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_unlocks_destino ON chapter_unlocks(chapter_id_destino)`);
    } catch { /* já existe */ }

    // ── ECONOMIA DE CRISTAIS + LOJA ─────────────────────────────────────
    // Colunas em users (idempotente)
    const newUsersCrystalColumns = [
      `ALTER TABLE users ADD COLUMN crystals INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE users ADD COLUMN exp_buff_multiplier REAL NOT NULL DEFAULT 1.0`,
      `ALTER TABLE users ADD COLUMN exp_buff_expires_at TEXT`,
    ];
    for (const sql of newUsersCrystalColumns) {
      try { await client.execute(sql); } catch { /* já existe */ }
    }

    // Tabela de transações de cristais
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS crystal_transactions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          amount INTEGER NOT NULL,
          type TEXT NOT NULL,
          reason TEXT NOT NULL,
          reference_id TEXT,
          created_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_crystal_tx_user ON crystal_transactions(user_id, created_at DESC)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_crystal_tx_type ON crystal_transactions(type)`);
    } catch { /* já existe */ }

    // Tabela de itens da loja
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS store_items (
          id TEXT PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          price_crystals INTEGER NOT NULL,
          rarity TEXT NOT NULL,
          image_url TEXT,
          metadata TEXT,
          is_active INTEGER NOT NULL DEFAULT 1,
          stock INTEGER,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_store_active ON store_items(category, is_active)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_store_rarity ON store_items(rarity)`);
    } catch { /* já existe */ }

    // Tabela de inventário
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS user_inventory (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          store_item_id TEXT NOT NULL,
          acquired_at TEXT NOT NULL,
          expires_at TEXT,
          is_equipped INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (store_item_id) REFERENCES store_items(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_inv_user ON user_inventory(user_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_inv_item ON user_inventory(store_item_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_user_inv_equipped ON user_inventory(user_id, is_equipped)`);
    } catch { /* já existe */ }

    // Tabela de loadout (vitrine)
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS user_profile_loadout (
          user_id TEXT PRIMARY KEY,
          border_item_id TEXT,
          avatar_item_id TEXT,
          equipped_badge_ids TEXT,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
    } catch { /* já existe */ }

    // ──────────────── COMUNIDADE ────────────────
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS posts (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          content TEXT NOT NULL,
          post_type TEXT NOT NULL DEFAULT 'text',
          group_id TEXT,
          target_type TEXT,
          target_id TEXT,
          image_url TEXT,
          metadata TEXT,
          likes_count INTEGER NOT NULL DEFAULT 0,
          comments_count INTEGER NOT NULL DEFAULT 0,
          is_pinned INTEGER NOT NULL DEFAULT 0,
          deleted_at TEXT,
          created_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_posts_feed ON posts(group_id, created_at DESC)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id, created_at DESC)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_posts_target ON posts(target_type, target_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(post_type, created_at DESC)`);
    } catch { /* já existe */ }

    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS comments (
          id TEXT PRIMARY KEY,
          post_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          parent_id TEXT,
          content TEXT NOT NULL,
          likes_count INTEGER NOT NULL DEFAULT 0,
          deleted_at TEXT,
          created_at TEXT NOT NULL,
          FOREIGN KEY (post_id) REFERENCES posts(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at ASC)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id)`);
    } catch { /* já existe */ }

    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS likes (
          user_id TEXT NOT NULL,
          target_id TEXT NOT NULL,
          target_type TEXT NOT NULL,
          created_at TEXT NOT NULL,
          PRIMARY KEY (user_id, target_id, target_type)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_id, target_type)`);
    } catch { /* já existe */ }

    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS study_groups (
          id TEXT PRIMARY KEY,
          owner_id TEXT NOT NULL,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          concurso_slug TEXT,
          is_private INTEGER NOT NULL DEFAULT 0,
          member_count INTEGER NOT NULL DEFAULT 1,
          icon TEXT,
          accent_color TEXT,
          created_at TEXT NOT NULL,
          FOREIGN KEY (owner_id) REFERENCES users(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_groups_concurso ON study_groups(concurso_slug)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_groups_member_count ON study_groups(member_count DESC)`);
    } catch { /* já existe */ }

    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS study_group_members (
          group_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'member',
          joined_at TEXT NOT NULL,
          PRIMARY KEY (group_id, user_id),
          FOREIGN KEY (group_id) REFERENCES study_groups(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_group_members_user ON study_group_members(user_id)`);
    } catch { /* já existe */ }

    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS reports (
          id TEXT PRIMARY KEY,
          reporter_id TEXT NOT NULL,
          target_id TEXT NOT NULL,
          target_type TEXT NOT NULL,
          reason TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          resolved_by TEXT,
          resolved_at TEXT,
          created_at TEXT NOT NULL,
          FOREIGN KEY (reporter_id) REFERENCES users(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_reports_pending ON reports(status, created_at)`);
    } catch { /* já existe */ }

    try {
      await client.execute(`ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0`);
    } catch { /* já existe */ }

    // ── MATERIAIS DE ESTUDO (PDFs por disciplina/concurso) ────────────────
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS study_materials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          concurso_slug TEXT NOT NULL,
          disciplina TEXT NOT NULL,
          content_json TEXT,
          blob_url TEXT,
          source_hash TEXT,
          page_count INTEGER,
          file_size INTEGER,
          status TEXT NOT NULL DEFAULT 'draft',
          error_msg TEXT,
          generated_at TEXT,
          published_at TEXT,
          published_by TEXT,
          criado_em TEXT NOT NULL,
          atualizado_em TEXT NOT NULL,
          FOREIGN KEY (published_by) REFERENCES users(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_sm_concurso_disc ON study_materials(concurso_slug, disciplina)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_sm_status ON study_materials(status)`);
      await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_sm_unique ON study_materials(concurso_slug, disciplina)`);
    } catch { /* já existe */ }

    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS study_material_downloads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          material_id INTEGER NOT NULL,
          downloaded_at TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (material_id) REFERENCES study_materials(id)
        )
      `);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_smd_user ON study_material_downloads(user_id)`);
      await client.execute(`CREATE INDEX IF NOT EXISTS idx_smd_material ON study_material_downloads(material_id)`);
    } catch { /* já existe */ }

    // Seed de itens da loja (idempotente: só insere se store_items vazio)
    await seedStoreItems();

    // Backfill de cristais (UMA VEZ): se nenhuma transação ainda foi registrada,
    // dá 500 cristais a todos os usuários e logga transação admin_grant.
    await backfillCrystals();

    // Adicionar colunas enriquecidas em concursos (idempotente)
    const newConcursosColumns = [
      `ALTER TABLE concursos ADD COLUMN cargo TEXT`,
      `ALTER TABLE concursos ADD COLUMN area_especialidade TEXT`,
      `ALTER TABLE concursos ADD COLUMN edital_numero TEXT`,
      `ALTER TABLE concursos ADD COLUMN edital_ano INTEGER`,
      `ALTER TABLE concursos ADD COLUMN vagas_cargo INTEGER`,
      `ALTER TABLE concursos ADD COLUMN url_inscricao TEXT`,
      `ALTER TABLE concursos ADD COLUMN requisitos TEXT`,
      `ALTER TABLE concursos ADD COLUMN destaque INTEGER DEFAULT 0`,
    ];
    for (const sql of newConcursosColumns) {
      try { await client.execute(sql); } catch { /* coluna já existe */ }
    }

    await seedUFs();
    await seedQuestionsBank();
    await seedConcursosBank();
    console.log('✅ Banco de dados inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar banco de dados:', error);
      _initPromise = null;
      throw error;
    }
  })();
  await _initPromise;
  _initialized = true;
}

async function seedUFs() {
  const ufData = [
    { codigo_ibge: 11, sigla: 'RO', nome: 'Rondônia', regiao: 'Norte' },
    { codigo_ibge: 12, sigla: 'AC', nome: 'Acre', regiao: 'Norte' },
    { codigo_ibge: 13, sigla: 'AM', nome: 'Amazonas', regiao: 'Norte' },
    { codigo_ibge: 14, sigla: 'RR', nome: 'Roraima', regiao: 'Norte' },
    { codigo_ibge: 15, sigla: 'PA', nome: 'Pará', regiao: 'Norte' },
    { codigo_ibge: 16, sigla: 'AP', nome: 'Amapá', regiao: 'Norte' },
    { codigo_ibge: 17, sigla: 'TO', nome: 'Tocantins', regiao: 'Norte' },
    { codigo_ibge: 21, sigla: 'MA', nome: 'Maranhão', regiao: 'Nordeste' },
    { codigo_ibge: 22, sigla: 'PI', nome: 'Piauí', regiao: 'Nordeste' },
    { codigo_ibge: 23, sigla: 'CE', nome: 'Ceará', regiao: 'Nordeste' },
    { codigo_ibge: 24, sigla: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste' },
    { codigo_ibge: 25, sigla: 'PB', nome: 'Paraíba', regiao: 'Nordeste' },
    { codigo_ibge: 26, sigla: 'PE', nome: 'Pernambuco', regiao: 'Nordeste' },
    { codigo_ibge: 27, sigla: 'AL', nome: 'Alagoas', regiao: 'Nordeste' },
    { codigo_ibge: 28, sigla: 'SE', nome: 'Sergipe', regiao: 'Nordeste' },
    { codigo_ibge: 29, sigla: 'BA', nome: 'Bahia', regiao: 'Nordeste' },
    { codigo_ibge: 31, sigla: 'MG', nome: 'Minas Gerais', regiao: 'Sudeste' },
    { codigo_ibge: 32, sigla: 'ES', nome: 'Espírito Santo', regiao: 'Sudeste' },
    { codigo_ibge: 33, sigla: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste' },
    { codigo_ibge: 35, sigla: 'SP', nome: 'São Paulo', regiao: 'Sudeste' },
    { codigo_ibge: 41, sigla: 'PR', nome: 'Paraná', regiao: 'Sul' },
    { codigo_ibge: 42, sigla: 'SC', nome: 'Santa Catarina', regiao: 'Sul' },
    { codigo_ibge: 43, sigla: 'RS', nome: 'Rio Grande do Sul', regiao: 'Sul' },
    { codigo_ibge: 50, sigla: 'MS', nome: 'Mato Grosso do Sul', regiao: 'Centro-Oeste' },
    { codigo_ibge: 51, sigla: 'MT', nome: 'Mato Grosso', regiao: 'Centro-Oeste' },
    { codigo_ibge: 52, sigla: 'GO', nome: 'Goiás', regiao: 'Centro-Oeste' },
    { codigo_ibge: 53, sigla: 'DF', nome: 'Distrito Federal', regiao: 'Centro-Oeste' },
  ];

  const now = new Date().toISOString();
  for (const uf of ufData) {
    await client.execute({
      sql: 'INSERT OR IGNORE INTO ufs (codigo_ibge, sigla, nome, regiao, criado_em) VALUES (?, ?, ?, ?, ?)',
      args: [uf.codigo_ibge, uf.sigla, uf.nome, uf.regiao, now],
    });
  }
}

// Seed idempotente do banco de questões e dos capítulos correspondentes.
// Por (disciplina, capítulo): só insere questões se nenhuma existe naquele par.
// Capítulos: só insere se a tupla (disciplina, numero) ainda não existe.
async function seedQuestionsBank() {
  try {
    // 1) Capítulos
    for (const ch of SEED_CHAPTERS) {
      const existing = await client.execute({
        sql: 'SELECT id FROM chapters WHERE disciplina = ? AND numero = ? LIMIT 1',
        args: [ch.disciplina, ch.numero],
      });
      if (existing.rows.length === 0) {
        await client.execute({
          sql: `INSERT INTO chapters (disciplina, numero, titulo, descricao, ordem, is_primeiro, criado_em)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            ch.disciplina,
            ch.numero,
            ch.titulo,
            ch.descricao ?? null,
            ch.numero,
            ch.is_primeiro ? 1 : 0,
            new Date().toISOString(),
          ],
        });
      }
    }

    // 2) Questões — agrupa pelo par (disciplina, capitulo); só popula se vazio.
    const groups = new Map<string, typeof SEED_QUESTIONS>();
    for (const q of SEED_QUESTIONS) {
      const key = `${q.disciplina}|${q.capitulo}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(q);
    }

    for (const [key, batch] of groups.entries()) {
      const [disciplina, capitulo] = key.split('|');
      const countRs = await client.execute({
        sql: 'SELECT COUNT(*) AS n FROM questions WHERE disciplina = ? AND capitulo = ?',
        args: [disciplina, capitulo],
      });
      const existingCount = Number((countRs.rows[0] as unknown as { n: number })?.n ?? 0);
      if (existingCount > 0) continue; // já populado, não duplica

      const now = new Date().toISOString();
      for (const q of batch) {
        await client.execute({
          sql: `INSERT INTO questions
            (titulo, disciplina, capitulo, tipo, enunciado, explicacao, dica, opcoes,
             resposta_correta, dificuldade, fonte,
             material_resumo, material_topicos, material_estrategia,
             criado_em, atualizado_em)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            q.titulo,
            q.disciplina,
            q.capitulo,
            q.tipo,
            q.enunciado,
            q.explicacao ?? null,
            q.dica ?? null,
            q.opcoes ? JSON.stringify(q.opcoes) : null,
            q.resposta_correta,
            q.dificuldade,
            q.fonte ?? null,
            q.material_resumo ?? null,
            q.material_topicos ? JSON.stringify(q.material_topicos) : null,
            q.material_estrategia ?? null,
            now,
            now,
          ],
        });
      }
      console.log(`📚 Seed: ${batch.length} questões inseridas em "${disciplina}" / "${capitulo}"`);
    }
  } catch (err) {
    console.error('⚠️  Falha ao popular banco de questões (seed):', err);
    // Não relança: app deve subir mesmo se o seed falhar.
  }
}

// Seed idempotente do catálogo de concursos.
// Chave de idempotência: slug. Só insere se nenhuma linha com aquele slug existir.
// Para forçar re-seed de um concurso: DELETE FROM concursos WHERE slug=? e reinicie.
async function seedConcursosBank() {
  try {
    // Limpa slugs descontinuados (ver DEPRECATED_CONCURSO_SLUGS em seed-concursos.ts).
    // Roda em todo boot — barato e idempotente: se já não existe, o DELETE é no-op.
    // Cascateia em tabelas-filhas (editais, concurso_candidato, questions) para
    // evitar erro de FK silencioso.
    for (const slug of DEPRECATED_CONCURSO_SLUGS) {
      try {
        const idRs = await client.execute({
          sql: 'SELECT id FROM concursos WHERE slug = ?',
          args: [slug],
        });
        const ids = idRs.rows.map((r) => Number((r as unknown as { id: number }).id));
        for (const id of ids) {
          await client.execute({ sql: 'DELETE FROM editais WHERE concurso_id = ?', args: [id] });
          await client.execute({ sql: 'DELETE FROM concurso_candidato WHERE concurso_id = ?', args: [id] });
          await client.execute({ sql: 'UPDATE questions SET concurso_id = NULL WHERE concurso_id = ?', args: [id] });
        }
        await client.execute({
          sql: 'DELETE FROM concursos WHERE slug = ?',
          args: [slug],
        });
      } catch (err) {
        console.warn(`⚠️  Falha ao limpar slug deprecated "${slug}":`, err);
      }
    }

    const now = new Date().toISOString();
    for (const c of SEED_CONCURSOS) {
      const existing = await client.execute({
        sql: 'SELECT id FROM concursos WHERE slug = ? LIMIT 1',
        args: [c.slug],
      });
      if (existing.rows.length > 0) continue; // já existe, não duplica

      await client.execute({
        sql: `INSERT INTO concursos (
          titulo, organizador, orgao, descricao, slug,
          vagas_total, vagas_por_funcao, status,
          data_publicacao_edital, data_abertura_inscricoes, data_fechamento_inscricoes,
          data_prova_objetiva, data_prova_discursiva, data_resultado_final,
          url_edital, url_site_oficial, banca,
          remuneracao_inicial, nivel_escolaridade, fonte_scrape, logo_url,
          cargo, area_especialidade, edital_numero, edital_ano,
          vagas_cargo, url_inscricao, requisitos, destaque,
          criado_em, atualizado_em
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?
        )`,
        args: [
          c.titulo,
          c.organizador,
          c.orgao,
          c.descricao,
          c.slug,
          c.vagas_total ?? null,
          c.vagas_por_funcao ?? null,
          c.status,
          c.data_publicacao_edital ?? null,
          c.data_abertura_inscricoes ?? null,
          c.data_fechamento_inscricoes ?? null,
          c.data_prova_objetiva ?? null,
          c.data_prova_discursiva ?? null,
          c.data_resultado_final ?? null,
          c.url_edital ?? null,
          c.url_site_oficial ?? null,
          c.banca ?? null,
          c.remuneracao_inicial ?? null,
          c.nivel_escolaridade ?? null,
          c.fonte_scrape ?? null,
          c.logo_url ?? null,
          c.cargo ?? null,
          c.area_especialidade ?? null,
          c.edital_numero ?? null,
          c.edital_ano ?? null,
          c.vagas_cargo ?? null,
          c.url_inscricao ?? null,
          c.requisitos ?? null,
          c.destaque,
          now,
          now,
        ],
      });
      console.log(`🏛️  Seed concurso: "${c.titulo}" (${c.slug})`);
    }
  } catch (err) {
    console.error('⚠️  Falha ao popular banco de concursos (seed):', err);
    // Não relança: app deve subir mesmo se o seed falhar.
  }
}

// Seed idempotente do catálogo de itens da loja.
// Só insere se store_items estiver vazio. Para forçar re-seed: TRUNCATE store_items.
async function seedStoreItems() {
  try {
    const countRs = await client.execute('SELECT COUNT(*) AS n FROM store_items');
    const count = Number((countRs.rows[0] as unknown as { n: number })?.n ?? 0);
    if (count > 0) return;

    const now = new Date().toISOString();
    for (const item of STORE_ITEMS_SEED) {
      await client.execute({
        sql: `INSERT INTO store_items
          (id, slug, name, description, category, price_crystals, rarity, image_url, metadata, is_active, stock, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          crypto.randomUUID(),
          item.slug,
          item.name,
          item.description,
          item.category,
          item.priceCrystals,
          item.rarity,
          item.imageUrl ?? null,
          item.metadata ? JSON.stringify(item.metadata) : null,
          item.isActive === false ? 0 : 1,
          item.stock ?? null,
          now,
          now,
        ],
      });
    }
    console.log(`🛒 Seed loja: ${STORE_ITEMS_SEED.length} itens inseridos`);
  } catch (err) {
    console.error('⚠️  Falha ao popular store_items (seed):', err);
  }
}

// Backfill de cristais — roda só uma vez (quando crystal_transactions está vazio).
// Concede 500 cristais de boas-vindas a todos os usuários cadastrados.
async function backfillCrystals() {
  try {
    const txCountRs = await client.execute('SELECT COUNT(*) AS n FROM crystal_transactions');
    const txCount = Number((txCountRs.rows[0] as unknown as { n: number })?.n ?? 0);
    if (txCount > 0) return;

    const usersRs = await client.execute('SELECT id FROM users');
    if (usersRs.rows.length === 0) return;

    const now = new Date().toISOString();
    for (const row of usersRs.rows) {
      const userId = (row as unknown as { id: string }).id;
      // Apenas concede para users com 0 cristais (defesa contra reset)
      const updRs = await client.execute({
        sql: 'UPDATE users SET crystals = crystals + 500 WHERE id = ? AND crystals = 0',
        args: [userId],
      });
      if (updRs.rowsAffected === 1) {
        await client.execute({
          sql: `INSERT INTO crystal_transactions (id, user_id, amount, type, reason, reference_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [crypto.randomUUID(), userId, 500, 'admin_grant', 'Bônus de boas-vindas', null, now],
        });
      }
    }
    console.log(`💎 Backfill cristais: ${usersRs.rows.length} usuários processados`);
  } catch (err) {
    console.error('⚠️  Falha no backfill de cristais:', err);
  }
}

export default db;
