import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'matheus@gmail.com')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Admin bypass — unlimited access without subscription
    if (ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
      return NextResponse.json({
        status: 'active',
        hasAccess: true,
        isPaid: true,
        isTrial: false,
        trialDaysRemaining: 0,
        expiresAt: null,
        isAdmin: true,
      });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const now = new Date();
    let isPaid = user.subscription_status === 'active';
    if (isPaid && user.subscription_expires_at) {
      isPaid = new Date(user.subscription_expires_at) > now;
    }

    return NextResponse.json({
      status: user.subscription_status,
      hasAccess: isPaid,
      isPaid,
      isTrial: false,
      trialDaysRemaining: 0,
      expiresAt: user.subscription_expires_at,
    });
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
