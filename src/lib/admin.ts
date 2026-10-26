// Admin authorization helper.
//
// Admin é definido por:
//   1. e-mail listado em `ADMIN_EMAILS` (env var, vírgula-separado), OU
//   2. coluna `users.is_admin = 1` no banco (gerenciado por outro engenheiro).
//
// Não usar `subscription_status='admin'` como autorização administrativa.
//
// Uso típico (gating por sessão — síncrono, sem hit no banco):
//   const session = await getServerSession(authOptions);
//   if (!isAdminSession(session)) {
//     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//   }
//
// Uso por userId (assíncrono, consulta o banco — para casos onde só
// temos o id, ou quando `is_admin` é fonte da verdade):
//   const ok = await requireAdmin(userId);
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

export function isAdminSession(session: Session | null | undefined): boolean {
  return isAdminEmail(session?.user?.email ?? null);
}

// Reutiliza o singleton libsql centralizado em @/lib/db (evita conexões
// redundantes ao Turso).
function getAdminClient() {
  return lsClient;
}

/**
 * Verifica se um usuário é admin consultando o banco.
 *
 * Aceita admin tanto por:
 *   - `users.is_admin = 1` (fonte de verdade no banco), OU
 *   - `users.email` listado em `ADMIN_EMAILS` (failsafe via env)
 *
 * Robusto contra a coluna `is_admin` ainda não existir (outro engenheiro
 * a cria via ALTER TABLE) — nesse caso recai para o gating por email.
 *
 * Retorna `false` em qualquer falha (nunca lança), de modo que o caller
 * possa simplesmente fazer `if (!await requireAdmin(id)) return 403`.
 */
export async function requireAdmin(userId: string | null | undefined): Promise<boolean> {
  if (!userId || typeof userId !== 'string') return false;
  const client = getAdminClient();
  try {
    // Tenta buscar is_admin + email; se a coluna não existir, faz fallback
    // só com email.
    let isAdminFlag = 0;
    let email: string | null = null;
    try {
      const rs = await client.execute({
        sql: 'SELECT is_admin, email FROM users WHERE id = ? LIMIT 1',
        args: [userId],
      });
      if (rs.rows.length === 0) return false;
      const row = rs.rows[0] as unknown as { is_admin: number | null; email: string | null };
      isAdminFlag = Number(row.is_admin ?? 0);
      email = row.email ?? null;
    } catch {
      // Coluna `is_admin` ainda não existe — busca só email.
      const rs = await client.execute({
        sql: 'SELECT email FROM users WHERE id = ? LIMIT 1',
        args: [userId],
      });
      if (rs.rows.length === 0) return false;
      const row = rs.rows[0] as unknown as { email: string | null };
      email = row.email ?? null;
    }

    if (isAdminFlag === 1) return true;
    if (isAdminEmail(email)) return true;
    return false;
  } catch (err) {
    console.error('[admin] requireAdmin failed:', err);
    return false;
  }
}
