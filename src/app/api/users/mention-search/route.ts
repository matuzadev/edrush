import { NextRequest, NextResponse } from 'next/server';
import { lsClient, getAuthedUserId, userRateLimit } from '@/lib/community';

interface UserRow {
  id: string;
  username: string | null;
  nome: string | null;
  avatar_id: number | null;
  equipped_border: string | null;
}

/**
 * GET /api/users/mention-search?q=xxx
 *
 * Autocomplete de menções @username (até 8 resultados).
 *
 * - Auth obrigatória
 * - q: 2..30 chars
 * - rate limit: 30 buscas/min por usuário
 * - ordenação: match exato no username > prefixo > demais; depois alfabética
 *
 * Nota: rota separada de `/api/users/search` (que serve sistema de amigos
 * com formato e regras diferentes) para não acoplar os dois usos.
 */
export async function GET(req: NextRequest) {
  const userId = await getAuthedUserId();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const rl = userRateLimit(`user_mention_search:${userId}`, 30, 60);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: rl.retryAfter },
      { status: 429 },
    );
  }

  const q = (req.nextUrl.searchParams.get('q') ?? '').trim();
  if (q.length < 2 || q.length > 30) {
    return NextResponse.json({ error: 'invalid_query' }, { status: 400 });
  }

  try {
    const rs = await lsClient.execute({
      sql: `
        SELECT id, username, nome, avatar_id, equipped_border
        FROM users
        WHERE username IS NOT NULL
          AND (
            LOWER(username) LIKE LOWER(? || '%')
            OR LOWER(nome) LIKE LOWER('%' || ? || '%')
          )
        ORDER BY
          CASE
            WHEN LOWER(username) = LOWER(?) THEN 0
            WHEN LOWER(username) LIKE LOWER(? || '%') THEN 1
            ELSE 2
          END,
          username ASC
        LIMIT 8
      `,
      args: [q, q, q, q],
    });
    const rows = rs.rows as unknown as UserRow[];

    const users = rows.map((r) => ({
      id: r.id,
      username: r.username ?? '',
      nome: r.nome,
      avatarId: r.avatar_id ?? 1,
      equippedBorder: r.equipped_border ?? 'recruta',
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('[/api/users/mention-search GET] erro:', error);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
