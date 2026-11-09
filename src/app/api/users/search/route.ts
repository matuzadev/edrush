import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { users, friendships } from '@/db/schema';
import { and, eq, inArray, like, ne, or } from 'drizzle-orm';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const currentUserId = (session.user as any).id as string;
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (q.length < 2) {
    return NextResponse.json({ users: [] });
  }

  const pattern = `%${q}%`;

  // Buscar usuários cujo nome ou username bate com a query, excluindo o próprio usuário
  const results = await db
    .select({
      id: users.id,
      nome: users.nome,
      username: users.username,
      avatar_id: users.avatar_id,
    })
    .from(users)
    .where(
      and(
        ne(users.id, currentUserId),
        or(
          like(users.nome, pattern),
          like(users.username, pattern)
        )
      )
    )
    .limit(15);

  if (results.length === 0) {
    return NextResponse.json({ users: [] });
  }

  // Buscar relacionamentos existentes com esses usuários — query parametrizada
  // via Drizzle inArray (placeholders, sem interpolação de string).
  const targetIds = results.map(u => u.id);

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

  // Mapear relacionamentos por userId do outro lado
  const relationshipMap = new Map<string, { id: number; status: string; iAmRequester: boolean }>();
  for (const row of existingRels) {
    const otherId = row.requester_id === currentUserId ? row.receiver_id : row.requester_id;
    relationshipMap.set(otherId, {
      id: row.id,
      status: row.status,
      iAmRequester: row.requester_id === currentUserId,
    });
  }

  const enriched = results.map(u => ({
    id: u.id,
    nome: u.nome,
    username: u.username,
    avatar_id: u.avatar_id ?? 1,
    relationship: relationshipMap.get(u.id) ?? null,
  }));

  return NextResponse.json({ users: enriched });
}
