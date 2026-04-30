import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { friendships, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createNotification } from '@/lib/notifications';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const currentUserId = (session.user as any).id as string;
  const { id } = await params;
  const friendshipId = parseInt(id, 10);

  if (isNaN(friendshipId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  let body: { action?: 'accept' | 'reject' };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const { action } = body;

  if (!action || !['accept', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'action deve ser "accept" ou "reject"' }, { status: 400 });
  }

  const friendship = await db.query.friendships.findFirst({
    where: eq(friendships.id, friendshipId),
  });

  if (!friendship) {
    return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 });
  }

  // Apenas o receiver pode aceitar/rejeitar
  if (friendship.receiver_id !== currentUserId) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  }

  if (friendship.status !== 'pending') {
    return NextResponse.json({ error: 'Solicitação já processada' }, { status: 409 });
  }

  const now = new Date().toISOString();
  const newStatus = action === 'accept' ? 'accepted' : 'rejected';

  await db
    .update(friendships)
    .set({ status: newStatus, atualizado_em: now })
    .where(eq(friendships.id, friendshipId));

  // Se aceito, notificar quem enviou a solicitação
  if (action === 'accept') {
    const accepter = await db.query.users.findFirst({
      where: eq(users.id, currentUserId),
    });

    const accepterName = accepter?.username ?? accepter?.nome ?? 'Alguém';

    await createNotification({
      userId: friendship.requester_id,
      type: 'friend_accepted',
      title: 'Solicitação de amizade aceita',
      body: `${accepterName} aceitou sua solicitação de amizade!`,
      relatedId: String(friendshipId),
    });
  }

  return NextResponse.json({ status: newStatus });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const currentUserId = (session.user as any).id as string;
  const { id } = await params;
  const friendshipId = parseInt(id, 10);

  if (isNaN(friendshipId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const friendship = await db.query.friendships.findFirst({
    where: eq(friendships.id, friendshipId),
  });

  if (!friendship) {
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
  }

  // Apenas os envolvidos podem desfazer
  if (friendship.requester_id !== currentUserId && friendship.receiver_id !== currentUserId) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
  }

  await db.delete(friendships).where(eq(friendships.id, friendshipId));

  return NextResponse.json({ ok: true });
}
