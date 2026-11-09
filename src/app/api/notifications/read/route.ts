import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { notifications } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const currentUserId = (session.user as any).id as string;

  let body: { id?: number } = {};
  try {
    body = await req.json();
  } catch {
    // body vazio = marcar todas
  }

  if (body.id) {
    // Marcar uma específica (verificar que pertence ao usuário)
    await db
      .update(notifications)
      .set({ read: 1 })
      .where(
        and(
          eq(notifications.id, body.id),
          eq(notifications.user_id, currentUserId)
        )
      );
  } else {
    // Marcar todas como lidas
    await db
      .update(notifications)
      .set({ read: 1 })
      .where(eq(notifications.user_id, currentUserId));
  }

  return NextResponse.json({ ok: true });
}
