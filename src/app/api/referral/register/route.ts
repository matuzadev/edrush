import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { registerReferral } from '@/lib/referral';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Called by OAuth callback to register referral code from session/cookie
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const userId = (session.user as any).id as string;
  const { referralCode } = await req.json();

  if (!referralCode || typeof referralCode !== 'string') {
    return NextResponse.json({ error: 'Código inválido' }, { status: 400 });
  }

  const userRecord = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { id: true, email: true, referred_by_code: true },
  });

  if (!userRecord) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  if (userRecord.referred_by_code) return NextResponse.json({ alreadyRegistered: true });

  const registered = await registerReferral({
    referralCode,
    referredId: userId,
    referredEmail: userRecord.email,
  });

  return NextResponse.json({ registered });
}
