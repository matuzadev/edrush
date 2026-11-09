import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { requireAdmin } from '@/lib/admin';
import { lsClient } from '@/lib/db';

/**
 * GET /api/admin/reports
 *
 * Lista denúncias paginadas. Query params:
 *   - status: 'pending' (default) | 'resolved' | 'dismissed'
 *   - cursor: ISO datetime (created_at) do último item da página anterior
 *   - limit:  número de itens (default 20, max 50)
 *
 * Retorno:
 *   {
 *     reports: [{
 *       id, reason, status, createdAt,
 *       targetType, targetId,
 *       reporter: { id, nome, username },
 *       target:   { content, authorId, authorName, authorAvatarId,
 *                   likesCount, commentsCount, deletedAt }
 *     }],
 *     nextCursor: string | null
 *   }
 *
 * 403 quando o usuário não é admin (via `requireAdmin`).
 */

const VALID_STATUSES = new Set(['pending', 'resolved', 'dismissed']);
const TRUNCATE_LEN = 300;

function getClient() {
  return lsClient;
}

interface ReportRow {
  id: string;
  reporter_id: string;
  target_id: string;
  target_type: string;
  reason: string;
  status: string;
  created_at: string;
}

interface ReporterRow {
  id: string;
  nome: string | null;
  username: string | null;
}

interface PostRow {
  id: string;
  user_id: string;
  content: string;
  likes_count: number | null;
  comments_count: number | null;
  deleted_at: string | null;
  author_nome: string | null;
  author_username: string | null;
  author_avatar_id: number | null;
}

interface CommentRow {
  id: string;
  user_id: string;
  content: string;
  likes_count: number | null;
  deleted_at: string | null;
  author_nome: string | null;
  author_username: string | null;
  author_avatar_id: number | null;
}

function truncate(s: string | null | undefined, len = TRUNCATE_LEN): string {
  if (!s) return '';
  if (s.length <= len) return s;
  return s.slice(0, len) + '…';
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ok = await requireAdmin(userId, session);
  if (!ok) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get('status') ?? 'pending';
  const status = VALID_STATUSES.has(statusParam) ? statusParam : 'pending';
  const cursor = searchParams.get('cursor');
  const limitParam = parseInt(searchParams.get('limit') ?? '20', 10);
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), 50)
    : 20;

  const client = getClient();

  try {
    // 1) Busca reports paginados (cursor por created_at DESC)
    const args: (string | number)[] = [status];
    let sql = `SELECT id, reporter_id, target_id, target_type, reason, status, created_at
               FROM reports
               WHERE status = ?`;
    if (cursor) {
      sql += ` AND created_at < ?`;
      args.push(cursor);
    }
    sql += ` ORDER BY created_at DESC LIMIT ?`;
    args.push(limit + 1); // +1 para detectar nextCursor

    const reportsRs = await client.execute({ sql, args });
    const allReports = reportsRs.rows as unknown as ReportRow[];

    const hasMore = allReports.length > limit;
    const reports = hasMore ? allReports.slice(0, limit) : allReports;
    const nextCursor = hasMore ? reports[reports.length - 1].created_at : null;

    if (reports.length === 0) {
      return NextResponse.json({ reports: [], nextCursor: null });
    }

    // 2) Reúne IDs únicos para JOIN em lote
    const reporterIds = Array.from(new Set(reports.map((r) => r.reporter_id)));
    const postIds = Array.from(
      new Set(reports.filter((r) => r.target_type === 'post').map((r) => r.target_id))
    );
    const commentIds = Array.from(
      new Set(reports.filter((r) => r.target_type === 'comment').map((r) => r.target_id))
    );

    // 3) Busca reporters
    const reportersById = new Map<string, ReporterRow>();
    if (reporterIds.length > 0) {
      const placeholders = reporterIds.map(() => '?').join(',');
      const rs = await client.execute({
        sql: `SELECT id, nome, username FROM users WHERE id IN (${placeholders})`,
        args: reporterIds,
      });
      for (const row of rs.rows as unknown as ReporterRow[]) {
        reportersById.set(row.id, row);
      }
    }

    // 4) Busca posts denunciados (com autor via JOIN)
    const postsById = new Map<string, PostRow>();
    if (postIds.length > 0) {
      const placeholders = postIds.map(() => '?').join(',');
      try {
        const rs = await client.execute({
          sql: `SELECT p.id, p.user_id, p.content, p.likes_count, p.comments_count, p.deleted_at,
                       u.nome AS author_nome, u.username AS author_username, u.avatar_id AS author_avatar_id
                FROM posts p
                LEFT JOIN users u ON u.id = p.user_id
                WHERE p.id IN (${placeholders})`,
          args: postIds,
        });
        for (const row of rs.rows as unknown as PostRow[]) {
          postsById.set(row.id, row);
        }
      } catch (err) {
        // Tabela `posts` ainda não existe (criada por outro engenheiro)
        console.warn('[mod] posts table not available yet:', err);
      }
    }

    // 5) Busca comments denunciados (com autor via JOIN)
    const commentsById = new Map<string, CommentRow>();
    if (commentIds.length > 0) {
      const placeholders = commentIds.map(() => '?').join(',');
      try {
        const rs = await client.execute({
          sql: `SELECT c.id, c.user_id, c.content, c.likes_count, c.deleted_at,
                       u.nome AS author_nome, u.username AS author_username, u.avatar_id AS author_avatar_id
                FROM comments c
                LEFT JOIN users u ON u.id = c.user_id
                WHERE c.id IN (${placeholders})`,
          args: commentIds,
        });
        for (const row of rs.rows as unknown as CommentRow[]) {
          commentsById.set(row.id, row);
        }
      } catch (err) {
        console.warn('[mod] comments table not available yet:', err);
      }
    }

    // 6) Monta resposta final
    const out = reports.map((r) => {
      const reporter = reportersById.get(r.reporter_id);

      let target: {
        content: string;
        authorId: string | null;
        authorName: string | null;
        authorUsername: string | null;
        authorAvatarId: number | null;
        likesCount: number;
        commentsCount: number;
        deletedAt: string | null;
        missing: boolean;
      };

      if (r.target_type === 'post') {
        const p = postsById.get(r.target_id);
        target = p
          ? {
              content: truncate(p.content),
              authorId: p.user_id,
              authorName: p.author_nome,
              authorUsername: p.author_username,
              authorAvatarId: p.author_avatar_id,
              likesCount: Number(p.likes_count ?? 0),
              commentsCount: Number(p.comments_count ?? 0),
              deletedAt: p.deleted_at,
              missing: false,
            }
          : {
              content: '(post não encontrado ou removido)',
              authorId: null,
              authorName: null,
              authorUsername: null,
              authorAvatarId: null,
              likesCount: 0,
              commentsCount: 0,
              deletedAt: null,
              missing: true,
            };
      } else {
        const c = commentsById.get(r.target_id);
        target = c
          ? {
              content: truncate(c.content),
              authorId: c.user_id,
              authorName: c.author_nome,
              authorUsername: c.author_username,
              authorAvatarId: c.author_avatar_id,
              likesCount: Number(c.likes_count ?? 0),
              commentsCount: 0,
              deletedAt: c.deleted_at,
              missing: false,
            }
          : {
              content: '(comentário não encontrado ou removido)',
              authorId: null,
              authorName: null,
              authorUsername: null,
              authorAvatarId: null,
              likesCount: 0,
              commentsCount: 0,
              deletedAt: null,
              missing: true,
            };
      }

      return {
        id: r.id,
        reason: r.reason,
        status: r.status,
        createdAt: r.created_at,
        targetType: r.target_type,
        targetId: r.target_id,
        reporter: reporter
          ? {
              id: reporter.id,
              nome: reporter.nome,
              username: reporter.username,
            }
          : { id: r.reporter_id, nome: null, username: null },
        target,
      };
    });

    // Conta de pendentes (útil pra badge no header). Só calcula quando o
    // tab atual é "pending" pra economizar query.
    let pendingCount: number | null = null;
    try {
      const countRs = await client.execute({
        sql: `SELECT COUNT(*) AS n FROM reports WHERE status = 'pending'`,
        args: [],
      });
      pendingCount = Number((countRs.rows[0] as unknown as { n: number })?.n ?? 0);
    } catch {
      pendingCount = null;
    }

    return NextResponse.json({ reports: out, nextCursor, pendingCount });
  } catch (err) {
    // Tabela `reports` pode ainda não existir (criada por outro engenheiro)
    const message = err instanceof Error ? err.message : 'unknown';
    if (/no such table|reports/i.test(message)) {
      console.warn('[mod] reports table not available yet:', message);
      return NextResponse.json({
        reports: [],
        nextCursor: null,
        pendingCount: 0,
        warning: 'reports_table_not_ready',
      });
    }
    console.error('[mod] GET /api/admin/reports failed:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
