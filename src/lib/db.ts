import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'path';
import * as schema from '@/db/schema';

// Criar diretório de dados se não existir
const dbPath = path.join(process.cwd(), 'data', 'foco-federal.db');

// Inicializar banco de dados
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

// Criar tabelas se não existirem
export function initializeDatabase() {
  try {
    // Verificar se tabelas existem
    const tables = sqlite
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      )
      .all();

    if (tables.length === 0) {
      console.log('📦 Criando tabelas no banco de dados...');
      
      // Criar tabelas manualmente (Drizzle não cria automaticamente em SQLite)
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS ufs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          codigo_ibge INTEGER NOT NULL UNIQUE,
          sigla TEXT NOT NULL UNIQUE,
          nome TEXT NOT NULL,
          regiao TEXT NOT NULL,
          criado_em TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS cidades (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          codigo_ibge INTEGER NOT NULL UNIQUE,
          nome TEXT NOT NULL,
          uf_id INTEGER NOT NULL,
          criado_em TEXT NOT NULL,
          FOREIGN KEY (uf_id) REFERENCES ufs(id)
        );

        CREATE INDEX IF NOT EXISTS idx_cidades_uf_id ON cidades(uf_id);
        CREATE INDEX IF NOT EXISTS idx_cidades_nome ON cidades(nome);

        CREATE TABLE IF NOT EXISTS users (
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
          pagbank_customer_id TEXT,
          criado_em TEXT NOT NULL,
          atualizado_em TEXT NOT NULL,
          FOREIGN KEY (uf_id) REFERENCES ufs(id),
          FOREIGN KEY (cidade_id) REFERENCES cidades(id)
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider_id);
        CREATE INDEX IF NOT EXISTS idx_users_uf_id ON users(uf_id);
        CREATE INDEX IF NOT EXISTS idx_users_cidade_id ON users(cidade_id);

        CREATE TABLE IF NOT EXISTS concursos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          organizador TEXT NOT NULL,
          orgao TEXT NOT NULL,
          descricao TEXT,
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
          criado_em TEXT NOT NULL,
          atualizado_em TEXT NOT NULL,
          fonte_scrape TEXT,
          FOREIGN KEY (uf_id) REFERENCES ufs(id),
          FOREIGN KEY (cidade_id) REFERENCES cidades(id)
        );

        CREATE INDEX IF NOT EXISTS idx_concursos_status ON concursos(status);
        CREATE INDEX IF NOT EXISTS idx_concursos_uf_id ON concursos(uf_id);
        CREATE INDEX IF NOT EXISTS idx_concursos_data_inscricoes ON concursos(data_abertura_inscricoes);

        CREATE TABLE IF NOT EXISTS editais (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          concurso_id INTEGER NOT NULL,
          numero_edital TEXT NOT NULL,
          data_publicacao TEXT NOT NULL,
          url_pdf TEXT,
          versao INTEGER DEFAULT 1,
          alteracoes_descritas TEXT,
          criado_em TEXT NOT NULL,
          UNIQUE(concurso_id, numero_edital),
          FOREIGN KEY (concurso_id) REFERENCES concursos(id)
        );

        CREATE INDEX IF NOT EXISTS idx_editais_concurso_id ON editais(concurso_id);

        CREATE TABLE IF NOT EXISTS concurso_candidato (
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
          
        );

        CREATE INDEX IF NOT EXISTS idx_concurso_candidato_user ON concurso_candidato(user_id);
        CREATE INDEX IF NOT EXISTS idx_concurso_candidato_concurso ON concurso_candidato(concurso_id);
      `);

      console.log('✅ Tabelas criadas com sucesso!');

      // Inserir dados de UFs e Cidades (dados brasileiros)
      seedUFsAndCidades(sqlite);
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

// Função para popular UFs e Cidades
function seedUFsAndCidades(sqlite: Database.Database) {
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

  const insertUf = sqlite.prepare(
    'INSERT OR IGNORE INTO ufs (codigo_ibge, sigla, nome, regiao, criado_em) VALUES (?, ?, ?, ?, ?)'
  );

  console.log('📍 Inserindo UFs...');
  for (const uf of ufData) {
    insertUf.run(uf.codigo_ibge, uf.sigla, uf.nome, uf.regiao, new Date().toISOString());
  }
  console.log('✅ UFs inseridas!');
}

export default db;
