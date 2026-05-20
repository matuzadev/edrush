import { NextRequest, NextResponse } from 'next/server';
import {
  lsClient,
  generateId,
  getAuthedUserId,
  userRateLimit,
  notifyMentions,
  COMMENT_MAX_CONTENT,
  isContentClean,
  sanitizeContent,
} from '@/lib/community';

interface Params {
  params: Promise<{ id: string }>;
}

interface CommentRow {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  likes_count: number;
  created_at: string;
  author_username: string | null;
  author_nome: string | null;
  author_avatar_id: number | null;
  author_equipped_border: string | null;
  liked_by_me: number;
}

/**
 * GET /api/posts/:id/comments
 * Retorna até 50 comentários (top-level + replies aninhados em 1 nível),
 * ordenados por mais curtidos primeiro, depois cronológico.
 */
export async function GET(req: NextRequest, { params }: Params) {
  const userId = await getAuthedUserId();
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.nextUrl.searchParams.get('limit') ?? '50', 10)),
  );

  try {
    const likedSelect = userId
      ? `(SELECT 1 FROM likes WHERE user_id = ? AND target_id = c.id AND target_type = 'comment' LIMIT 1)`
      : '0';
    const likedArgs = userId ? [userId] : [];

    const rs = await lsClient.execute({
      sql: `
        SELECT
          c.id, c.post_id, c.user_id, c.parent_id, c.content, c.likes_count, c.created_at,
          u.username AS author_username,
          u.nome AS author_nome,
          u.avatar_id AS author_avatar_id,
          u.equipped_border AS author_equipped_border,
          ${likedSelect} AS liked_by_me
        FROM comments c
        JOIN users u ON u.id = c.user_id
        WHERE c.post_id = ? AND c.deleted_at IS NULL
        ORDER BY c.likes_count DESC, c.created_at ASC
        LIMIT ?
      `,
      args: [...likedArgs, id, limit],
    });
    const rows = rs.rows as unknown as CommentRow[];

    const comments = rows.map((r) => ({
      id: r.id,
      postId: r.post_id,
      parentId: r.parent_id,
      content: r.content,
      likesCount: r.likes_count,
      likedByMe: r.liked_by_me === 1,
      createdAt: r.created_at,
      author: {
        id: r.user_id,
        username: r.author_username ?? r.author_nome ?? 'Concurseiro',
        nome: r.author_nome,
        avatarId: r.author_avatar_id ?? 1,
        equippedBorder: r.author_equipped_border ?? 'recruta',
      },
    }));

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('[/api/posts/:id/comments GET] erro:', error);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}

/**
 * POST /api/posts/:id/comments — cria comentário (até 1 nível de reply).
 */
export async function POST(req: NextRequest, { params }: Params) {
  const userId = await getAuthedUserId();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  // Rate limit: 30 comments/hora
  const rl = userRateLimit(`comment:${userId}`, 30, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: rl.retryAfter },
      { status: 429 },
    );
  }

  let body: { content?: string; parentId?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const content = sanitizeContent(body.content ?? '', COMMENT_MAX_CONTENT);
  if (!content) {
    return NextResponse.json(
      { error: `content vazio ou maior que ${COMMENT_MAX_CONTENT} chars` },
      { status: 400 },
    );
  }
  if (!isContentClean(content)) {
    return NextResponse.json({ error: 'content_blocked' }, { status: 400 });
  }

  try {
    // Confirma post existe
    const postRs = await lsClient.execute({
      sql: 'SELECT 1 FROM posts WHERE id = ? AND deleted_at IS NULL',
      args: [id],
    });
    if (postRs.rows.length === 0) {
      return NextResponse.json({ error: 'post_not_found' }, { status: 404 });
    }

    // Garante que parent_id é top-level (1 nível só)
    let parentId: string | null = null;
    if (body.parentId) {
      const parentRs = await lsClient.execute({
        sql: 'SELECT parent_id FROM comments WHERE id = ? AND post_id = ? AND deleted_at IS NULL',
        args: [body.parentId, id],
      });
      if (parentRs.rows.length === 0) {
        return NextResponse.json({ error: 'parent_not_found' }, { status: 400 });
      }
      const parent = parentRs.rows[0] as unknown as { parent_id: string | null };
      // Se parent já é reply, ancora no avô (achatamento — força profundidade max 2)
      parentId = parent.parent_id ?? body.parentId;
    }

    const commentId = generateId('c_');
    const now = new Date().toISOString();
    await lsClient.execute({
      sql: `INSERT INTO comments (id, post_id, user_id, parent_id, content, likes_count, created_at)
            VALUES (?, ?, ?, ?, ?, 0, ?)`,
      args: [commentId, id, userId, parentId, content, now],
    });
    await lsClient.execute({
      sql: 'UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?',
      args: [id],
    });

    // re-lê com info do autor
    const newRs = await lsClient.execute({
      sql: `SELECT c.id, c.post_id, c.parent_id, c.content, c.likes_count, c.created_at,
                   u.username, u.nome, u.avatar_id, u.equipped_border
            FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = ?`,
      args: [commentId],
    });
    const r = newRs.rows[0] as unknown as {
      id: string; post_id: string; parent_id: string | null; content: string;
      likes_count: number; created_at: string;
      username: string | null; nome: string | null; avatar_id: number | null;
      equipped_border: string | null;
    };

    // Notifica menções (best-effort).
    try {
      const authorUsername = r.username ?? r.nome ?? 'alguém';
      await notifyMentions({
        content,
        authorId: userId,
        authorUsername,
        type: 'mention_comment',
        relatedId: commentId,
      });
    } catch (mentionErr) {
      console.error('[/api/posts/:id/comments POST] mention notify falhou:', mentionErr);
    }

    return NextResponse.json(
      {
        comment: {
          id: r.id,
          postId: r.post_id,
          parentId: r.parent_id,
          content: r.content,
          likesCount: r.likes_count,
          likedByMe: false,
          createdAt: r.created_at,
          author: {
            id: userId,
            username: r.username ?? r.nome ?? 'Concurseiro',
            nome: r.nome,
            avatarId: r.avatar_id ?? 1,
            equippedBorder: r.equipped_border ?? 'recruta',
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[/api/posts/:id/comments POST] erro:', error);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
