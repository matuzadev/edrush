import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { friendships, users } from '@/db/schema';
<<<<<<< HEAD
import { and, eq, or } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
=======
import { eq, inArray, or } from 'drizzle-orm';
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const currentUserId = (session.user as any).id as string;

  // Buscar todas as relações envolvendo o usuário
  const relations = await db
    .select({
      id: friendships.id,
      requester_id: friendships.requester_id,
      receiver_id: friendships.receiver_id,
      status: friendships.status,
      criado_em: friendships.criado_em,
    })
    .from(friendships)
    .where(
      or(
        eq(friendships.requester_id, currentUserId),
        eq(friendships.receiver_id, currentUserId)
      )
    );

  if (relations.length === 0) {
    return NextResponse.json({ friends: [], pendingSent: [], pendingReceived: [] });
  }

  // Coletar IDs dos outros usuários
  const otherIds = [...new Set(relations.map(r =>
    r.requester_id === currentUserId ? r.receiver_id : r.requester_id
  ))];

<<<<<<< HEAD
  // Buscar dados dos outros usuários via SQL raw para compatibilidade com SQLite
  const otherUsersRaw = await db.run(
    sql.raw(
      `SELECT id, nome, username, avatar_id FROM users WHERE id IN (${otherIds.map(id => `'${id}'`).join(', ')})`
    )
  );

  const userMap = new Map<string, { id: string; nome: string | null; username: string | null; avatar_id: number | null }>();
  for (const row of otherUsersRaw.rows as any[]) {
=======
  // Buscar dados dos outros usuários via Drizzle inArray (parametrizado).
  const otherUsers = await db
    .select({
      id: users.id,
      nome: users.nome,
      username: users.username,
      avatar_id: users.avatar_id,
    })
    .from(users)
    .where(inArray(users.id, otherIds));

  const userMap = new Map<string, { id: string; nome: string | null; username: string | null; avatar_id: number | null }>();
  for (const row of otherUsers) {
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
    userMap.set(row.id, {
      id: row.id,
      nome: row.nome,
      username: row.username,
      avatar_id: row.avatar_id ?? 1,
    });
  }

  const friends: any[] = [];
  const pendingSent: any[] = [];
  const pendingReceived: any[] = [];

  for (const rel of relations) {
    const otherId = rel.requester_id === currentUserId ? rel.receiver_id : rel.requester_id;
    const otherUser = userMap.get(otherId);

    const entry = {
      friendshipId: rel.id,
      userId: otherId,
      nome: otherUser?.nome ?? null,
      username: otherUser?.username ?? null,
      avatar_id: otherUser?.avatar_id ?? 1,
      since: rel.criado_em,
    };

    if (rel.status === 'accepted') {
      friends.push(entry);
    } else if (rel.status === 'pending') {
      if (rel.requester_id === currentUserId) {
        pendingSent.push(entry);
      } else {
        pendingReceived.push(entry);
      }
    }
  }

  return NextResponse.json({ friends, pendingSent, pendingReceived });
}
