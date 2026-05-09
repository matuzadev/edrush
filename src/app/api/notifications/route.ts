import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { notifications, users } from '@/db/schema';
<<<<<<< HEAD
import { eq, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { createNotification } from '@/lib/notifications';
=======
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { createNotification } from '@/lib/notifications';
import { isAdminSession } from '@/lib/admin';
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const currentUserId = (session.user as any).id as string;

  const results = await db
    .select()
    .from(notifications)
    .where(eq(notifications.user_id, currentUserId))
    .orderBy(sql`${notifications.read} ASC, ${notifications.criado_em} DESC`)
    .limit(20);

  const unreadCount = results.filter(n => n.read === 0).length;

  return NextResponse.json({ notifications: results, unreadCount });
}

// Admin-only: enviar notificação para todos ou para um userId específico
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

<<<<<<< HEAD
  const currentUserId = (session.user as any).id as string;

  // Verificar se é admin (subscription_status = 'admin' ou checar por email)
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, currentUserId),
  });

  if (!currentUser || currentUser.subscription_status !== 'admin') {
=======
  // Admin é definido por ADMIN_EMAILS env var (não por subscription_status,
  // que é mutável pelo webhook Stripe).
  if (!isAdminSession(session)) {
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  let body: {
    userId?: string;
    title?: string;
    body?: string;
    type?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const { userId, title, body: notifBody, type = 'admin_message' } = body;

  if (!title || !notifBody) {
    return NextResponse.json({ error: 'title e body são obrigatórios' }, { status: 400 });
  }

  if (userId) {
    // Enviar para um usuário específico
    await createNotification({
      userId,
      type: type as any,
      title,
      body: notifBody,
    });
    return NextResponse.json({ sent: 1 });
  } else {
    // Enviar para todos os usuários
    const allUsers = await db.select({ id: users.id }).from(users);
    const now = new Date().toISOString();

    const values = allUsers.map(u => ({
      user_id: u.id,
      type: type as any,
      title,
      body: notifBody,
      read: 0 as const,
      related_id: null,
      criado_em: now,
    }));

    // Inserir em lotes de 100
    for (let i = 0; i < values.length; i += 100) {
      await db.insert(notifications).values(values.slice(i, i + 100));
    }

    return NextResponse.json({ sent: allUsers.length });
  }
}
