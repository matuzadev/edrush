import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { hashPassword } from '@/auth';
import { registerReferral } from '@/lib/referral';
import { strictRateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';

const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;

export async function POST(req: NextRequest) {
  const limited = strictRateLimit(req);
  if (limited) return limited;

  try {
    const { email, password, name, username, birthday, location, referralCode } = await req.json();

    // ── basic validation ──────────────────────────────────────────────────────
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 8 caracteres' },
        { status: 400 }
      );
    }
    if (username && !USERNAME_RE.test(username)) {
      return NextResponse.json(
        { error: 'Username inválido. Use 3-30 caracteres: letras, números ou _' },
        { status: 400 }
      );
    }

    // ── uniqueness check ──────────────────────────────────────────────────────
    const cleanEmail    = email.toLowerCase().trim();
    const cleanUsername = username?.trim().toLowerCase();

    const existing = await db.query.users.findFirst({
      where: cleanUsername
        ? or(eq(users.email, cleanEmail), eq(users.username, cleanUsername))
        : eq(users.email, cleanEmail),
      columns: { email: true, username: true },
    });

    if (existing) {
      if (existing.email === cleanEmail) {
        return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Este username já está em uso' }, { status: 409 });
    }

    // ── insert ────────────────────────────────────────────────────────────────
    const senha_hash = await hashPassword(password);
    const now        = new Date().toISOString();
    const newUserId  = crypto.randomUUID();

    await db.insert(users).values({
      id: newUserId,
      email: cleanEmail,
      nome: name.trim(),
      username: cleanUsername || null,
      birthday: birthday || null,
      location: location?.trim() || null,
      senha_hash,
      provider: 'email',
      criado_em: now,
      atualizado_em: now,
    });

    // ── referral ──────────────────────────────────────────────────────────────
    if (referralCode && typeof referralCode === 'string') {
      await registerReferral({
        referralCode,
        referredId: newUserId,
        referredEmail: cleanEmail,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno ao registrar usuário' },
      { status: 500 }
    );
  }
}
