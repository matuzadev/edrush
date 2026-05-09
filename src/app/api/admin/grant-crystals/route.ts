import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { isAdminSession } from '@/lib/admin';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { grantCrystals } from '@/lib/crystals';

/**
 * POST /api/admin/grant-crystals
 *
 * Concede cristais para um usuário (ou para si mesmo se `email` ausente).
 * Requer autenticação como admin (e-mail listado em ADMIN_EMAILS).
 *
 * Body:
 *   { amount: number, email?: string, reason?: string }
 *
 * Exemplos via curl (logado no browser, copie o cookie de sessão):
 *   curl -X POST http://localhost:3000/api/admin/grant-crystals \
 *     -H "Content-Type: application/json" \
 *     -H "Cookie: next-auth.session-token=..." \
 *     -d '{"amount": 100000}'
 *
 * Mais fácil: chame de dentro do dashboard via fetch no DevTools console:
 *   fetch('/api/admin/grant-crystals', {
 *     method: 'POST',
 *     headers: {'Content-Type':'application/json'},
 *     body: JSON.stringify({ amount: 100000 })
 *   }).then(r => r.json()).then(console.log)
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const obj = body as Record<string, unknown>;
  const amount = Number(obj.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10_000_000) {
    return NextResponse.json(
      { error: 'amount deve ser um número entre 1 e 10.000.000' },
      { status: 400 },
    );
  }

  const targetEmail = typeof obj.email === 'string'
    ? obj.email.trim().toLowerCase()
    : session.user.email.toLowerCase();
  const reason = typeof obj.reason === 'string' && obj.reason.trim().length > 0
    ? obj.reason.trim().slice(0, 200)
    : 'Concedido via painel admin';

  try {
    const target = await db.query.users.findFirst({
      where: eq(users.email, targetEmail),
      columns: { id: true, email: true, nome: true },
    });
    if (!target) {
      return NextResponse.json({ error: 'user_not_found', email: targetEmail }, { status: 404 });
    }

    const result = await grantCrystals(
      target.id,
      Math.floor(amount),
      'admin_grant',
      reason,
      session.user.email, // referenceId = quem concedeu
    );

    return NextResponse.json({
      ok: true,
      target: { id: target.id, email: target.email, nome: target.nome },
      granted: Math.floor(amount),
      newBalance: result.balance,
      grantedBy: session.user.email,
    });
  } catch (error) {
    console.error('Erro ao conceder cristais (admin):', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
