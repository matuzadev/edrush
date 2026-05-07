import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { messages } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';

// PATCH /api/messages/read
// Body: { fromUserId } — marca todas as mensagens recebidas desse usuário como lidas
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  let body: { fromUserId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const fromUserId = body.fromUserId?.trim();
  if (!fromUserId) {
    return NextResponse.json({ error: 'fromUserId obrigatório' }, { status: 400 });
  }

  try {
    await db.update(messages)
      .set({ read: 1 })
      .where(and(
        eq(messages.sender_id, fromUserId),
        eq(messages.receiver_id, userId),
        eq(messages.read, 0)
      ));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao marcar mensagens como lidas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
