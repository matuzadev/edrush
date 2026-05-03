import { db } from '@/lib/db';
import { users, referrals } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

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

export async function processReferralReward(subscribedUserId: string): Promise<void> {
  const referral = await db.query.referrals.findFirst({
    where: sql`${referrals.referred_id} = ${subscribedUserId} AND ${referrals.status} = 'registered'`,
  });
  if (!referral) return;

  const now = new Date().toISOString();

  // Mark as subscribed
  await db.update(referrals)
    .set({ status: 'subscribed', atualizado_em: now })
    .where(eq(referrals.id, referral.id));

  // Extend referrer subscription by 30 days
  const referrer = await db.query.users.findFirst({
    where: eq(users.id, referral.referrer_id),
    columns: { id: true, subscription_status: true, subscription_expires_at: true },
  });
  if (!referrer) return;

  const currentExpiry = referrer.subscription_expires_at
    ? new Date(referrer.subscription_expires_at)
    : new Date();

  // If expired, start from today
  if (currentExpiry < new Date()) currentExpiry.setTime(Date.now());
  currentExpiry.setDate(currentExpiry.getDate() + 30);

  await db.update(users).set({
    subscription_status: 'active',
    subscription_expires_at: currentExpiry.toISOString(),
    atualizado_em: now,
  }).where(eq(users.id, referral.referrer_id));

  // Mark reward as granted
  await db.update(referrals).set({
    status: 'rewarded',
    reward_granted_at: now,
    atualizado_em: now,
  }).where(eq(referrals.id, referral.id));
}

export async function getReferralStats(userId: string) {
  const refs = await db.query.referrals.findMany({
    where: eq(referrals.referrer_id, userId),
    columns: { status: true, referred_email: true, criado_em: true, reward_granted_at: true },
    orderBy: (r, { desc }) => [desc(r.criado_em)],
  });

  return {
    total: refs.length,
    subscribed: refs.filter(r => r.status === 'subscribed' || r.status === 'rewarded').length,
    rewarded: refs.filter(r => r.status === 'rewarded').length,
    list: refs.map(r => ({
      email: r.referred_email ? maskEmail(r.referred_email) : '—',
      status: r.status,
      date: r.criado_em,
      rewardAt: r.reward_granted_at,
    })),
  };
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const masked = local.slice(0, 2) + '***' + (local.length > 4 ? local.slice(-1) : '');
  return masked + '@' + domain;
}
