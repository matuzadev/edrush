import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { users, friendships } from '@/db/schema';
import { and, eq, or } from 'drizzle-orm';
import { createNotification } from '@/lib/notifications';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const currentUserId = (session.user as any).id as string;

  let body: { receiverId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const { receiverId } = body;

  if (!receiverId || typeof receiverId !== 'string') {
    return NextResponse.json({ error: 'receiverId é obrigatório' }, { status: 400 });
  }

  if (receiverId === currentUserId) {
    return NextResponse.json({ error: 'Você não pode adicionar a si mesmo' }, { status: 400 });
  }

  // Verificar se o destinatário existe
  const receiver = await db.query.users.findFirst({
    where: eq(users.id, receiverId),
  });

  if (!receiver) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  // Verificar se já existe uma relação entre os dois
  const existing = await db.query.friendships.findFirst({
    where: or(
      and(eq(friendships.requester_id, currentUserId), eq(friendships.receiver_id, receiverId)),
      and(eq(friendships.requester_id, receiverId), eq(friendships.receiver_id, currentUserId))
    ),
  });

  if (existing) {
    if (existing.status === 'accepted') {
      return NextResponse.json({ error: 'Vocês já são amigos' }, { status: 409 });
    }
    if (existing.status === 'pending') {
      return NextResponse.json({ error: 'Solicitação já enviada' }, { status: 409 });
    }
    // rejected: remover e criar novo
    await db.delete(friendships).where(eq(friendships.id, existing.id));
  }

  const now = new Date().toISOString();

  const [newFriendship] = await db
    .insert(friendships)
    .values({
      requester_id: currentUserId,
      receiver_id: receiverId,
      status: 'pending',
      criado_em: now,
      atualizado_em: now,
    })
    .returning();

  // Buscar nome do solicitante para a notificação
  const requester = await db.query.users.findFirst({
    where: eq(users.id, currentUserId),
  });

  const requesterName = requester?.username ?? requester?.nome ?? 'Alguém';

  // Criar notificação para o destinatário
  await createNotification({
    userId: receiverId,
    type: 'friend_request',
    title: 'Nova solicitação de amizade',
    body: `${requesterName} quer ser seu amigo no EdRush.`,
    relatedId: String(newFriendship.id),
  });

  return NextResponse.json({ friendship: newFriendship }, { status: 201 });
}
