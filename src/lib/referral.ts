import { db } from '@/lib/db';
import { users, referrals } from '@/db/schema';
import { eq } from 'drizzle-orm';

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'FF-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function ensureReferralCode(userId: string): Promise<string> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { referral_code: true },
  });

  if (user?.referral_code) return user.referral_code;

  // Generate unique code
  let code = '';
  let attempts = 0;
  while (attempts < 10) {
    const candidate = generateReferralCode();
    const existing = await db.query.users.findFirst({
      where: eq(users.referral_code, candidate),
      columns: { id: true },
    });
    if (!existing) { code = candidate; break; }
    attempts++;
  }
  if (!code) code = generateReferralCode() + '-' + userId.slice(0, 4).toUpperCase();

  await db.update(users).set({ referral_code: code, atualizado_em: new Date().toISOString() }).where(eq(users.id, userId));
  return code;
}

export async function registerReferral(opts: {
  referralCode: string;
  referredId: string;
  referredEmail: string;
}): Promise<boolean> {
  const { referralCode, referredId, referredEmail } = opts;

  // Find the referrer
  const referrer = await db.query.users.findFirst({
    where: eq(users.referral_code, referralCode),
    columns: { id: true },
  });
  if (!referrer) return false;

  // Don't self-refer
  if (referrer.id === referredId) return false;

  // Check if already registered
  const existing = await db.query.referrals.findFirst({
    where: eq(referrals.referred_id, referredId),
  });
  if (existing) return false;

  const now = new Date().toISOString();
  await db.insert(referrals).values({
    referrer_id: referrer.id,
    referred_id: referredId,
    referral_code: referralCode,
    referred_email: referredEmail,
    status: 'registered',
    criado_em: now,
    atualizado_em: now,
  });

  // Save referred_by_code on the referred user
  await db.update(users)
    .set({ referred_by_code: referralCode, atualizado_em: now })
    .where(eq(users.id, referredId));

  return true;
}

export async function getReferralStats(userId: string) {
  const refs = await db.query.referrals.findMany({
    where: eq(referrals.referrer_id, userId),
    columns: { referred_email: true, criado_em: true },
    orderBy: (r, { desc }) => [desc(r.criado_em)],
  });

  return { total: refs.length };
}
