import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { ensureReferralCode, getReferralStats } from '@/lib/referral';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const userId = (session.user as any).id as string;
  const [code, stats] = await Promise.all([
    ensureReferralCode(userId),
    getReferralStats(userId),
  ]);

  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://focofederal.com.br';
  return NextResponse.json({ code, referralUrl: `${baseUrl}/auth/signup?ref=${code}`, ...stats });
}
