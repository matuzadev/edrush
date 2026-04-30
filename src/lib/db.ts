import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '@/db/schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:data/foco-federal.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

export async function initializeDatabase() {
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
          subscription_status TEXT DEFAULT 'free',
          subscription_expires_at TEXT,
          stripe_customer_id TEXT,
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

    await seedUFs();
    console.log('✅ Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
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

export default db;
