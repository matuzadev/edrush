import { NextRequest, NextResponse } from 'next/server';
import { lsClient, getAuthedUserId, userRateLimit } from '@/lib/community';

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/posts/:id/like — toggle like.
 * Retorna { liked, likesCount }.
 */
export async function POST(_req: NextRequest, { params }: Params) {
  const userId = await getAuthedUserId();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  // Anti-abuso: 200 likes/hora — generoso mas barra script
  const rl = userRateLimit(`like:${userId}`, 200, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: rl.retryAfter },
      { status: 429 },
    );
  }

  try {
    // verifica que o post existe e não está deletado
    const postRs = await lsClient.execute({
      sql: 'SELECT 1 FROM posts WHERE id = ? AND deleted_at IS NULL',
      args: [id],
    });
    if (postRs.rows.length === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const existsRs = await lsClient.execute({
      sql: `SELECT 1 FROM likes WHERE user_id = ? AND target_id = ? AND target_type = 'post'`,
      args: [userId, id],
    });
    const alreadyLiked = existsRs.rows.length > 0;

    if (alreadyLiked) {
      // unlike
      await lsClient.execute({
        sql: `DELETE FROM likes WHERE user_id = ? AND target_id = ? AND target_type = 'post'`,
        args: [userId, id],
      });
      await lsClient.execute({
        sql: 'UPDATE posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?',
        args: [id],
      });
    } else {
      // like
      const now = new Date().toISOString();
      await lsClient.execute({
        sql: `INSERT INTO likes (user_id, target_id, target_type, created_at) VALUES (?, ?, 'post', ?)`,
        args: [userId, id, now],
      });
      await lsClient.execute({
        sql: 'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
        args: [id],
      });
    }

    // re-lê o counter atualizado
    const countRs = await lsClient.execute({
      sql: 'SELECT likes_count FROM posts WHERE id = ?',
      args: [id],
    });
    const likesCount = Number(
      (countRs.rows[0] as unknown as { likes_count: number })?.likes_count ?? 0,
    );

    return NextResponse.json({ liked: !alreadyLiked, likesCount });
  } catch (error) {
    console.error('[/api/posts/:id/like] erro:', error);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
