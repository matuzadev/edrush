import { NextRequest, NextResponse } from 'next/server';
import {
  lsClient,
  decodeCursor,
  encodeCursor,
  POST_TYPES,
  type PostType,
  getAuthedUserId,
} from '@/lib/community';

const PAGE_SIZE = 20;

interface PostRow {
  id: string;
  user_id: string;
  content: string;
  post_type: string;
  group_id: string | null;
  target_type: string | null;
  target_id: string | null;
  image_url: string | null;
  metadata: string | null;
  likes_count: number;
  comments_count: number;
  is_pinned: number;
  created_at: string;
  // joined
  author_username: string | null;
  author_nome: string | null;
  author_avatar_id: number | null;
  author_equipped_border: string | null;
  author_xp: number | null;
  // by-me
  liked_by_me: number;
}

/**
 * GET /api/feed
 * Query params:
 *   ?cursor=...          (paginação cursor-based)
 *   ?type=text|result|question|news
 *   ?group_id=...
 *   ?target_type=question&target_id=123
 *   ?user_id=...         (perfil de um user — futuro)
 *   ?limit=20            (max 50)
 *
 * Retorna { posts: [...], nextCursor: string|null }
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthedUserId();

    const sp = req.nextUrl.searchParams;
    const cursor = decodeCursor(sp.get('cursor'));
    const typeParam = sp.get('type');
    const groupId = sp.get('group_id');
    const targetType = sp.get('target_type');
    const targetId = sp.get('target_id');
    const userIdFilter = sp.get('user_id');
    const limit = Math.min(50, Math.max(1, parseInt(sp.get('limit') ?? String(PAGE_SIZE), 10)));

    // WHERE construction
    const where: string[] = ['p.deleted_at IS NULL'];
    const args: (string | number)[] = [];

    if (typeParam && (POST_TYPES as readonly string[]).includes(typeParam)) {
      where.push('p.post_type = ?');
      args.push(typeParam);
    }
    if (groupId) {
      where.push('p.group_id = ?');
      args.push(groupId);
    } else if (groupId === null && !targetId && !userIdFilter) {
      // Feed global (default): só posts SEM group_id e SEM target (ou só notícias)
      // Mas mantemos posts target_id também — feed geral mostra tudo público
      // Não adicionamos filtro: pega tudo (com cuidado de não incluir mensagens de grupo privado em feed global)
    }
    if (targetType && targetId) {
      where.push('p.target_type = ?', 'p.target_id = ?');
      args.push(targetType, targetId);
    }
    if (userIdFilter) {
      where.push('p.user_id = ?');
      args.push(userIdFilter);
    }

    // Cursor: created_at < cursor.created_at OR (= AND id < cursor.id)
    if (cursor) {
      where.push('(p.created_at < ? OR (p.created_at = ? AND p.id < ?))');
      args.push(cursor.created_at, cursor.created_at, cursor.id);
    }

    // liked_by_me via subquery (zero quando anônimo)
    const likedSelect = userId
      ? `(SELECT 1 FROM likes WHERE user_id = ? AND target_id = p.id AND target_type = 'post' LIMIT 1)`
      : '0';
    const likedArgs = userId ? [userId] : [];

    const sql = `
      SELECT
        p.id, p.user_id, p.content, p.post_type, p.group_id,
        p.target_type, p.target_id, p.image_url, p.metadata,
        p.likes_count, p.comments_count, p.is_pinned, p.created_at,
        u.username AS author_username,
        u.nome AS author_nome,
        u.avatar_id AS author_avatar_id,
        u.equipped_border AS author_equipped_border,
        u.xp AS author_xp,
        ${likedSelect} AS liked_by_me
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE ${where.join(' AND ')}
      ORDER BY p.is_pinned DESC, p.created_at DESC, p.id DESC
      LIMIT ?
    `;

    const rs = await lsClient.execute({
      sql,
      args: [...likedArgs, ...args, limit + 1],
    });
    const rows = rs.rows as unknown as PostRow[];

    const hasMore = rows.length > limit;
    const trimmed = hasMore ? rows.slice(0, limit) : rows;

    const posts = trimmed.map((r) => ({
      id: r.id,
      content: r.content,
      postType: r.post_type as PostType,
      groupId: r.group_id,
      targetType: r.target_type,
      targetId: r.target_id,
      imageUrl: r.image_url,
      metadata: r.metadata ? safeJson(r.metadata) : null,
      likesCount: r.likes_count,
      commentsCount: r.comments_count,
      isPinned: r.is_pinned === 1,
      likedByMe: r.liked_by_me === 1,
      createdAt: r.created_at,
      author: {
        id: r.user_id,
        username: r.author_username ?? r.author_nome ?? 'Concurseiro',
        nome: r.author_nome,
        avatarId: r.author_avatar_id ?? 1,
        equippedBorder: r.author_equipped_border ?? 'recruta',
        xp: r.author_xp ?? 0,
      },
    }));

    const nextCursor = hasMore && trimmed.length > 0
      ? encodeCursor({
          created_at: trimmed[trimmed.length - 1].created_at,
          id: trimmed[trimmed.length - 1].id,
        })
      : null;

    return NextResponse.json({ posts, nextCursor });
  } catch (error) {
    console.error('[/api/feed] erro:', error);
    return NextResponse.json({ error: 'Erro ao carregar feed' }, { status: 500 });
  }
}

function safeJson(s: string): unknown {
  try { return JSON.parse(s); } catch { return null; }
}
