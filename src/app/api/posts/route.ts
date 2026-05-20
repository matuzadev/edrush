import { NextRequest, NextResponse } from 'next/server';
import {
  lsClient,
  generateId,
  getAuthedUserId,
  isUserAdmin,
  notifyMentions,
  POST_TYPES,
  TARGET_TYPES,
  POST_MAX_CONTENT,
  isContentClean,
  sanitizeContent,
  userRateLimit,
  type PostType,
} from '@/lib/community';

interface CreatePostBody {
  content?: string;
  postType?: PostType;
  groupId?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  imageUrl?: string | null;
  metadata?: unknown;
}

/**
 * POST /api/posts — cria um post
 *
 * Body:
 *   { content, postType?, groupId?, targetType?, targetId?, imageUrl?, metadata? }
 *
 * Validações:
 *   - autenticação obrigatória
 *   - content: 1-2000 chars, não-vazio, não-bloqueado
 *   - rate limit: 10 posts/hora por user
 *   - postType='news' requer admin
 *   - se groupId presente: user precisa ser membro do grupo
 *   - se targetType/targetId presentes: par deve ser válido
 */
export async function POST(req: NextRequest) {
  const userId = await getAuthedUserId();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Rate limit: 10 posts/hora
  const rl = userRateLimit(`post:${userId}`, 10, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: rl.retryAfter },
      { status: 429 },
    );
  }

  let body: CreatePostBody;
  try {
    body = (await req.json()) as CreatePostBody;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const content = sanitizeContent(body.content ?? '', POST_MAX_CONTENT);
  if (!content) {
    return NextResponse.json(
      { error: `content vazio ou maior que ${POST_MAX_CONTENT} chars` },
      { status: 400 },
    );
  }
  if (!isContentClean(content)) {
    return NextResponse.json({ error: 'content_blocked' }, { status: 400 });
  }

  const postType: PostType =
    body.postType && (POST_TYPES as readonly string[]).includes(body.postType)
      ? body.postType
      : 'text';

  // Apenas admin pode criar postType='news'
  if (postType === 'news') {
    const admin = await isUserAdmin(userId);
    if (!admin) {
      return NextResponse.json({ error: 'admin_required_for_news' }, { status: 403 });
    }
  }

  // Validação de target
  let targetType: string | null = null;
  let targetId: string | null = null;
  if (body.targetType && body.targetId) {
    if (!(TARGET_TYPES as readonly string[]).includes(body.targetType)) {
      return NextResponse.json({ error: 'invalid_target_type' }, { status: 400 });
    }
    targetType = body.targetType;
    targetId = body.targetId;
  }

  // Validação de grupo
  let groupId: string | null = null;
  if (body.groupId) {
    const memberRs = await lsClient.execute({
      sql: 'SELECT 1 FROM study_group_members WHERE group_id = ? AND user_id = ?',
      args: [body.groupId, userId],
    });
    if (memberRs.rows.length === 0) {
      return NextResponse.json({ error: 'not_member_of_group' }, { status: 403 });
    }
    groupId = body.groupId;
  }

  const id = generateId('p_');
  const now = new Date().toISOString();
  const metadataJson = body.metadata ? JSON.stringify(body.metadata) : null;

  try {
    await lsClient.execute({
      sql: `INSERT INTO posts
            (id, user_id, content, post_type, group_id, target_type, target_id,
             image_url, metadata, likes_count, comments_count, is_pinned, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?)`,
      args: [
        id,
        userId,
        content,
        postType,
        groupId,
        targetType,
        targetId,
        body.imageUrl ?? null,
        metadataJson,
        now,
      ],
    });

    // Notifica menções (não bloqueia criação em caso de falha).
    try {
      const authorRs = await lsClient.execute({
        sql: 'SELECT username, nome FROM users WHERE id = ?',
        args: [userId],
      });
      const authorRow = authorRs.rows[0] as unknown as
        | { username: string | null; nome: string | null }
        | undefined;
      const authorUsername = authorRow?.username ?? authorRow?.nome ?? 'alguém';
      await notifyMentions({
        content,
        authorId: userId,
        authorUsername,
        type: 'mention',
        relatedId: id,
      });
    } catch (mentionErr) {
      console.error('[/api/posts POST] mention notify falhou:', mentionErr);
    }

    return NextResponse.json(
      {
        post: {
          id,
          content,
          postType,
          groupId,
          targetType,
          targetId,
          imageUrl: body.imageUrl ?? null,
          metadata: body.metadata ?? null,
          likesCount: 0,
          commentsCount: 0,
          isPinned: false,
          likedByMe: false,
          createdAt: now,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[/api/posts POST] erro:', error);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
