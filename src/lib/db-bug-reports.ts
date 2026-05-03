/**
 * Integração de Bug Reports com Banco de Dados Turso
 * 
 * Passos:
 * 1. Atualize src/lib/db.ts para incluir a criação da tabela (veja abaixo)
 * 2. Importe as funções deste arquivo no endpoint /api/bugs/report
 * 3. Chame await saveBugReportToDatabase(report)
 */

import { db } from './db';
import { BugReport } from './bug-report';

/**
 * Salva um bug report no banco de dados
 */
export async function saveBugReportToDatabase(report: BugReport): Promise<void> {
  try {
    await db.execute({
      sql: `
        INSERT INTO bug_reports (
          id, 
          title, 
          description, 
          severity, 
          page, 
          user_agent, 
          email, 
          screenshot,
          status,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        report.id,
        report.title,
        report.description,
        report.severity,
        report.page,
        report.userAgent,
        report.email || null,
        report.screenshot || null,
        'novo',
        report.timestamp,
      ],
    });

    console.log(`✅ Bug report saved to database: ${report.id}`);
  } catch (error) {
    console.error('❌ Erro ao salvar bug report no banco:', error);
    throw error;
  }
}

/**
 * Busca todos os bug reports com filtros
 */
export async function getBugReports(filters?: {
  severity?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let sql = 'SELECT * FROM bug_reports WHERE 1=1';
    const args: any[] = [];

    if (filters?.severity) {
      sql += ' AND severity = ?';
      args.push(filters.severity);
    }

    if (filters?.status) {
      sql += ' AND status = ?';
      args.push(filters.status);
    }

    sql += ' ORDER BY created_at DESC';

    if (filters?.limit) {
      sql += ' LIMIT ?';
      args.push(filters.limit);
    }

    if (filters?.offset) {
      sql += ' OFFSET ?';
      args.push(filters.offset);
    }

    const result = await db.execute({
      sql,
      args,
    });

    return result.rows as BugReport[];
  } catch (error) {
    console.error('❌ Erro ao buscar bug reports:', error);
    throw error;
  }
}

/**
 * Busca um bug report específico
 */
export async function getBugReportById(id: string): Promise<BugReport | null> {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM bug_reports WHERE id = ?',
      args: [id],
    });

    return (result.rows?.[0] as BugReport) || null;
  } catch (error) {
    console.error('❌ Erro ao buscar bug report:', error);
    throw error;
  }
}

/**
 * Atualiza status de um bug report
 */
export async function updateBugReportStatus(
  id: string,
  status: 'novo' | 'em-analise' | 'resolvido' | 'rejeitado'
): Promise<void> {
  try {
    await db.execute({
      sql: 'UPDATE bug_reports SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [status, id],
    });

    console.log(`✅ Bug report status updated: ${id} -> ${status}`);
  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error);
    throw error;
  }
}

/**
 * Deleta um bug report
 */
export async function deleteBugReport(id: string): Promise<void> {
  try {
    await db.execute({
      sql: 'DELETE FROM bug_reports WHERE id = ?',
      args: [id],
    });

    console.log(`✅ Bug report deleted: ${id}`);
  } catch (error) {
    console.error('❌ Erro ao deletar bug report:', error);
    throw error;
  }
}

/**
 * Obtém estatísticas de bug reports
 */
export async function getBugReportsStats() {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN severity = 'crítica' THEN 1 ELSE 0 END) as critica_count,
          SUM(CASE WHEN severity = 'alta' THEN 1 ELSE 0 END) as alta_count,
          SUM(CASE WHEN severity = 'média' THEN 1 ELSE 0 END) as media_count,
          SUM(CASE WHEN severity = 'baixa' THEN 1 ELSE 0 END) as baixa_count,
          SUM(CASE WHEN status = 'novo' THEN 1 ELSE 0 END) as novo_count,
          SUM(CASE WHEN status = 'em-analise' THEN 1 ELSE 0 END) as analise_count,
          SUM(CASE WHEN status = 'resolvido' THEN 1 ELSE 0 END) as resolvido_count
        FROM bug_reports
      `,
      args: [],
    });

    return result.rows?.[0] || {};
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    throw error;
  }
}

/**
 * Busca bugs mais frequentes por padrão
 */
export async function getTopBugs(limit: number = 10) {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          title,
          COUNT(*) as count,
          severity,
          MAX(created_at) as last_reported
        FROM bug_reports
        WHERE created_at > datetime('now', '-30 days')
        GROUP BY title
        ORDER BY count DESC
        LIMIT ?
      `,
      args: [limit],
    });

    return result.rows || [];
  } catch (error) {
    console.error('❌ Erro ao buscar top bugs:', error);
    throw error;
  }
}

/**
 * DDL - Criar tabela no banco de dados
 * 
 * Adicione isto ao seu src/lib/db.ts na função initializeDatabase()
 * 
 * await client.batch([
 *   client.execute({
 *     sql: `
 *       CREATE TABLE IF NOT EXISTS bug_reports (
 *         id TEXT PRIMARY KEY,
 *         title TEXT NOT NULL,
 *         description TEXT NOT NULL,
 *         severity TEXT NOT NULL CHECK (severity IN ('baixa', 'média', 'alta', 'crítica')),
 *         page TEXT,
 *         user_agent TEXT,
 *         email TEXT,
 *         screenshot BLOB,
 *         status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'em-analise', 'resolvido', 'rejeitado')),
 *         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 *       )
 *     `,
 *     args: [],
 *   }),
 * ]);
 */
