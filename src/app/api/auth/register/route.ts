import { NextRequest, NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/auth';
import crypto from 'crypto';

initializeDatabase();

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 8 caracteres' },
        { status: 400 }
      );
    }

    const existing = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase().trim()),
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 409 }
      );
    }

    const senha_hash = await hashPassword(password);
    const now = new Date().toISOString();

    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: email.toLowerCase().trim(),
      nome: name.trim(),
      senha_hash,
      provider: 'email',
      subscription_status: 'free',
      criado_em: now,
      atualizado_em: now,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno ao registrar usuário' },
      { status: 500 }
    );
  }
}