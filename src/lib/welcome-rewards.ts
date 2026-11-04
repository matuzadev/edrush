import { lsClient } from '@/lib/db';
import crypto from 'crypto';

export const FOUNDER_EMAIL = 'matheus@gmail.com';

const WELCOME_BADGE_SLUG = 'badge-beta-tester';
const WELCOME_REWARD_REFERENCE = 'welcome-kit-v1';

export async function grantWelcomeBadge(userId: string): Promise<void> {
  const itemResult = await lsClient.execute({
    sql: 'SELECT id FROM store_items WHERE slug = ? LIMIT 1',
    args: [WELCOME_BADGE_SLUG],
  });
  const itemId = itemResult.rows[0]
    ? String((itemResult.rows[0] as unknown as { id: string }).id)
    : null;

  if (!itemId) {
    throw new Error(`Item de boas-vindas não encontrado: ${WELCOME_BADGE_SLUG}`);
  }

  const now = new Date().toISOString();
  await lsClient.execute({
    sql: `INSERT INTO user_inventory (id, user_id, store_item_id, acquired_at, expires_at, is_equipped)
          SELECT ?, ?, ?, ?, NULL, 0
          WHERE NOT EXISTS (
            SELECT 1 FROM user_inventory WHERE user_id = ? AND store_item_id = ?
          )`,
    args: [crypto.randomUUID(), userId, itemId, now, userId, itemId],
  });

  await lsClient.execute({
    sql: `INSERT INTO user_profile_loadout
          (user_id, border_item_id, avatar_item_id, equipped_badge_ids, updated_at)
          VALUES (?, NULL, NULL, ?, ?)
          ON CONFLICT(user_id) DO NOTHING`,
    args: [userId, JSON.stringify([itemId]), now],
  });

  const transactionResult = await lsClient.execute({
    sql: `SELECT id FROM crystal_transactions
          WHERE user_id = ? AND reference_id = ? LIMIT 1`,
    args: [userId, WELCOME_REWARD_REFERENCE],
  });

  if (transactionResult.rows.length === 0) {
    await lsClient.execute({
      sql: `INSERT INTO crystal_transactions
            (id, user_id, amount, type, reason, reference_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        crypto.randomUUID(),
        userId,
        500,
        'admin_grant',
        'Kit de boas-vindas',
        WELCOME_REWARD_REFERENCE,
        now,
      ],
    });
  }
}

export async function grantFounderBadge(userId: string, email: string): Promise<void> {
  if (email.trim().toLowerCase() !== FOUNDER_EMAIL) return;

  const itemResult = await lsClient.execute({
    sql: 'SELECT id FROM store_items WHERE slug = ? LIMIT 1',
    args: ['badge-membro-fundador'],
  });
  const itemId = itemResult.rows[0]
    ? String((itemResult.rows[0] as unknown as { id: string }).id)
    : null;

  if (!itemId) {
    throw new Error('Item de fundador não encontrado: badge-membro-fundador');
  }

  const now = new Date().toISOString();
  await lsClient.execute({
    sql: `INSERT INTO user_inventory (id, user_id, store_item_id, acquired_at, expires_at, is_equipped)
          SELECT ?, ?, ?, ?, NULL, 1
          WHERE NOT EXISTS (
            SELECT 1 FROM user_inventory WHERE user_id = ? AND store_item_id = ?
          )`,
    args: [crypto.randomUUID(), userId, itemId, now, userId, itemId],
  });

  const loadoutResult = await lsClient.execute({
    sql: 'SELECT equipped_badge_ids FROM user_profile_loadout WHERE user_id = ?',
    args: [userId],
  });
  let badgeIds: string[] = [];
  if (loadoutResult.rows.length > 0) {
    const raw = (loadoutResult.rows[0] as unknown as { equipped_badge_ids: string | null }).equipped_badge_ids;
    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          badgeIds = parsed.filter((id): id is string => typeof id === 'string');
        }
      } catch {
        badgeIds = [];
      }
    }
  }
  const equippedBadgeIds = [itemId, ...badgeIds.filter((id) => id !== itemId)].slice(0, 3);

  await lsClient.execute({
    sql: `INSERT INTO user_profile_loadout
          (user_id, border_item_id, avatar_item_id, equipped_badge_ids, updated_at)
          VALUES (?, NULL, NULL, ?, ?)
          ON CONFLICT(user_id) DO UPDATE SET
            equipped_badge_ids = excluded.equipped_badge_ids,
            updated_at = excluded.updated_at`,
    args: [userId, JSON.stringify(equippedBadgeIds), now],
  });

  const placeholders = equippedBadgeIds.map(() => '?').join(',');
  await lsClient.execute({
    sql: `UPDATE user_inventory
          SET is_equipped = CASE WHEN store_item_id IN (${placeholders}) THEN 1 ELSE 0 END
          WHERE user_id = ?
            AND store_item_id IN (
              SELECT id FROM store_items WHERE category = 'mini_logo_badge'
            )`,
    args: [...equippedBadgeIds, userId],
  });
}
