import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db, lsClient } from '@/lib/db';
import { friendships } from '@/db/schema';
import { and, eq, inArray, or } from 'drizzle-orm';
import { rateLimit } from '@/lib/rate-limit';

const ACTIVE_WINDOW_MS = 2 * 60 * 1000;
const NEW_USER_WINDOW_DAYS = 30;
const RESULT_LIMIT = 20;

interface DiscoverUser {
  id: string;
  nome: string | null;
  username: string | null;
  avatar_id: number | null;
  criado_em: string;
  last_seen?: string;
}

export async function GET(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const currentUserId = (session.user as { id: string }).id;
  const mode = req.nextUrl.searchParams.get('mode');
  if (mode !== 'online' && mode !== 'new') {
    return NextResponse.json({ error: 'Modo de descoberta inválido' }, { status: 400 });
  }

  try {
    let users: DiscoverUser[];

    if (mode === 'online') {
      const activeSince = new Date(Date.now() - ACTIVE_WINDOW_MS).toISOString();
      const result = await lsClient.execute({
        sql: `SELECT u.id, u.nome, u.username, u.avatar_id, u.criado_em, p.last_seen
              FROM student_presence p
              INNER JOIN users u ON u.id = p.user_id
              WHERE p.last_seen >= ? AND u.id != ? AND u.onboarding_completed = 1
              ORDER BY p.last_seen DESC
              LIMIT ?`,
        args: [activeSince, currentUserId, RESULT_LIMIT],
      });
      users = result.rows as unknown as DiscoverUser[];
    } else {
      const newUserSince = new Date(Date.now() - NEW_USER_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
      const result = await lsClient.execute({
        sql: `SELECT id, nome, username, avatar_id, criado_em
              FROM users
              WHERE id != ? AND onboarding_completed = 1 AND criado_em >= ?
              ORDER BY criado_em DESC
              LIMIT ?`,
        args: [currentUserId, newUserSince, RESULT_LIMIT],
      });
      users = result.rows as unknown as DiscoverUser[];
    }

    if (users.length === 0) {
      return NextResponse.json({ users: [] }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const targetIds = users.map((user) => user.id);
    const existingRels = await db
      .select({
        id: friendships.id,
        requester_id: friendships.requester_id,
        receiver_id: friendships.receiver_id,
        status: friendships.status,
      })
      .from(friendships)
      .where(
        or(
          and(eq(friendships.requester_id, currentUserId), inArray(friendships.receiver_id, targetIds)),
          and(eq(friendships.receiver_id, currentUserId), inArray(friendships.requester_id, targetIds)),
        ),
      );

    const relationshipMap = new Map(
      existingRels.map((relation) => {
        const otherId = relation.requester_id === currentUserId
          ? relation.receiver_id
          : relation.requester_id;
        return [otherId, {
          id: relation.id,
          status: relation.status,
          iAmRequester: relation.requester_id === currentUserId,
        }];
      }),
    );

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        nome: user.nome,
        username: user.username,
        avatar_id: user.avatar_id ?? 1,
        isOnline: mode === 'online',
        isNew: mode === 'new',
        relationship: relationshipMap.get(user.id) ?? null,
      })),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Erro ao encontrar estudantes:', error);
    return NextResponse.json({ error: 'Não foi possível encontrar estudantes.' }, { status: 500 });
  }
}
