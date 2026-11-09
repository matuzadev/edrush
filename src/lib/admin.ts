// Admin authorization helper.
//
// Admins precisam ter uma sessão Google com e-mail verificado. A autorização
// pode vir de `ADMIN_EMAILS` ou da coluna `users.is_admin`.
//
//
// Uso típico (gating por sessão — síncrono, sem hit no banco):
//   const session = await getServerSession(authOptions);
//   if (!isAdminSession(session)) {
//     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   }
//
// Uso por userId (assíncrono, consulta o banco — para casos onde só
// temos o id, ou quando `is_admin` é fonte da verdade):
//   const ok = await requireAdmin(userId, session);
//   if (!ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

import type { Session } from 'next-auth';
import { lsClient } from '@/lib/db';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

function hasVerifiedGoogleSession(
  session: Session | null | undefined,
): session is Session {
  return (
    session?.user?.provider === 'google' &&
    session.user.googleEmailVerified === true
  );
}

export function isAdminSession(session: Session | null | undefined): boolean {
  return (
    hasVerifiedGoogleSession(session) &&
    isAdminEmail(session.user.email)
  );
}

/**
 * Confirms both the authenticated Google identity and the user's admin grant.
 */
export async function requireAdmin(
  userId: string | null | undefined,
  session: Session | null | undefined,
): Promise<boolean> {
  if (
    !userId ||
    !hasVerifiedGoogleSession(session) ||
    session.user.id !== userId
  ) {
    return false;
  }

  const sessionEmail = session.user.email?.trim().toLowerCase();
  if (!sessionEmail) return false;

  try {
    try {
      const rs = await lsClient.execute({
        sql: 'SELECT is_admin, email FROM users WHERE id = ? LIMIT 1',
        args: [userId],
      });
      if (rs.rows.length === 0) return false;
      const row = rs.rows[0] as unknown as { is_admin: number | null; email: string | null };
      const email = row.email?.trim().toLowerCase();
      if (email !== sessionEmail) return false;
      return Number(row.is_admin ?? 0) === 1 || isAdminEmail(email);
    } catch {
      const rs = await lsClient.execute({
        sql: 'SELECT email FROM users WHERE id = ? LIMIT 1',
        args: [userId],
      });
      if (rs.rows.length === 0) return false;
      const row = rs.rows[0] as unknown as { email: string | null };
      const email = row.email?.trim().toLowerCase();
      return email === sessionEmail && isAdminEmail(email);
    }
  } catch (err) {
    console.error('[admin] requireAdmin failed:', err);
    return false;
  }
}
