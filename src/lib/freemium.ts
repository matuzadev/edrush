import { eq } from 'drizzle-orm';
import { db, lsClient } from '@/lib/db';
import { users } from '@/db/schema';
import { isAdminEmail } from '@/lib/admin';

export const FREE_DAILY_QUESTION_LIMIT = 10;

export async function isUserPremium(userId: string, email?: string | null): Promise<boolean> {
  if (isAdminEmail(email)) return true;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      email: true,
      subscription_status: true,
      subscription_expires_at: true,
    },
  });
  if (!user) return false;
  if (isAdminEmail(user.email)) return true;
  if (user.subscription_status !== 'active') return false;
  return !user.subscription_expires_at || new Date(user.subscription_expires_at) > new Date();
}

export async function getAnswersToday(userId: string): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const result = await lsClient.execute({
    sql: `SELECT COUNT(*) AS total FROM user_responses
          WHERE user_id = ? AND substr(respondida_em, 1, 10) = ?`,
    args: [userId, today],
  });
  return Number((result.rows[0] as unknown as { total: number | string } | undefined)?.total ?? 0);
}