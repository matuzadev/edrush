import { NextRequest, NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/db';
import { users } from '@/db/schema';
<<<<<<< HEAD
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/auth';
=======
import { eq, or } from 'drizzle-orm';
import { hashPassword } from '@/auth';
import { registerReferral } from '@/lib/referral';
import { strictRateLimit } from '@/lib/rate-limit';
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
import crypto from 'crypto';

initializeDatabase();

<<<<<<< HEAD
export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      );
    }

=======
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
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 8 caracteres' },
        { status: 400 }
      );
    }
<<<<<<< HEAD

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
=======
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
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
      senha_hash,
      provider: 'email',
      subscription_status: 'free',
      criado_em: now,
      atualizado_em: now,
    });

<<<<<<< HEAD
=======
    // ── referral ──────────────────────────────────────────────────────────────
    if (referralCode && typeof referralCode === 'string') {
      await registerReferral({
        referralCode,
        referredId: newUserId,
        referredEmail: cleanEmail,
      }).catch(() => {});
    }

>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno ao registrar usuário' },
      { status: 500 }
    );
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
