import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email obrigatório', isActive: false },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, userEmail),
    });

    if (!user) {
      return NextResponse.json({ isActive: false });
    }

    const isActive =
      user.subscription_status === 'active' &&
      !!user.subscription_expires_at &&
      new Date(user.subscription_expires_at) > new Date();

    return NextResponse.json({ isActive });
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar assinatura', isActive: false },
      { status: 500 }
    );
  }
}
