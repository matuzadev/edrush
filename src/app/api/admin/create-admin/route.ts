import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fullName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'email and password are required' },
        { status: 400 }
      );
    }

    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existing) {
      return NextResponse.json({ error: 'Usuário já existe' }, { status: 409 });
    }

    const senha_hash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const newUser = {
      id: crypto.randomUUID(),
      email,
      senha_hash,
      nome: fullName ?? '',
      provider: 'email',
      subscription_status: 'active',
      criado_em: now,
      atualizado_em: now,
    };

    await db.insert(users).values(newUser);

    return NextResponse.json({ user: { id: newUser.id, email: newUser.email } });
  } catch (err: any) {
    console.error('create-admin error', err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
