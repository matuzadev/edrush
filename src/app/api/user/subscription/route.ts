import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  return NextResponse.json({
    status: 'free',
    hasAccess: true,
    isPremium: true,
    isPaid: false,
    isTrial: false,
    trialDaysRemaining: 0,
    expiresAt: null,
    dailyLimit: null,
    answeredToday: 0,
    questionsRemainingToday: null,
  });
}
