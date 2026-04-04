import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const FREE_TRIAL_DAYS = 3;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const now = new Date();
    const criadoEm = new Date(user.criado_em);
    const daysSinceCreation = Math.floor(
      (now.getTime() - criadoEm.getTime()) / (1000 * 60 * 60 * 24)
    );

    const isTrial = user.subscription_status === 'free' && daysSinceCreation < FREE_TRIAL_DAYS;
    const trialDaysRemaining = isTrial ? FREE_TRIAL_DAYS - daysSinceCreation : 0;

    let isPaid = user.subscription_status === 'active';
    if (isPaid && user.subscription_expires_at) {
      isPaid = new Date(user.subscription_expires_at) > now;
    }

    const hasAccess = isTrial || isPaid;

    return NextResponse.json({
      status: user.subscription_status,
      hasAccess,
      isTrial,
      isPaid,
      trialDaysRemaining,
      expiresAt: user.subscription_expires_at,
    });
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
