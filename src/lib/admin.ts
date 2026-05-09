// Admin authorization helper.
//
// Admin é definido por e-mail listado em `ADMIN_EMAILS` (env var,
// vírgula-separado). Não usar `subscription_status='admin'` para gating —
// esse campo é mutável pelo webhook Stripe e por ataques de DB.
//
// Uso típico:
//   const session = await getServerSession(authOptions);
//   if (!isAdminSession(session)) {
//     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   }

import type { Session } from 'next-auth';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function isAdminSession(session: Session | null | undefined): boolean {
  return isAdminEmail(session?.user?.email ?? null);
}
