import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { users, friendships } from '@/db/schema';
import { and, eq, like, ne, or, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
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

  // Buscar relacionamentos existentes com esses usuários
  const targetIds = results.map(u => u.id);

  // SQLite não tem suporte nativo a IN com Drizzle em batch, fazendo via raw SQL
  const placeholders = targetIds.map(() => '?').join(', ');
  const existingRaw = await db.run(
    sql.raw(
      `SELECT id, requester_id, receiver_id, status FROM friendships
       WHERE (requester_id = '${currentUserId}' AND receiver_id IN (${targetIds.map(id => `'${id}'`).join(', ')}))
          OR (receiver_id = '${currentUserId}' AND requester_id IN (${targetIds.map(id => `'${id}'`).join(', ')}))`
    )
  );

  // Mapear relacionamentos por userId do outro lado
  const relationshipMap = new Map<string, { id: number; status: string; iAmRequester: boolean }>();
  for (const row of existingRaw.rows as any[]) {
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
