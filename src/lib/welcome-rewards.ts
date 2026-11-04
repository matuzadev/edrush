import { lsClient } from '@/lib/db';
import crypto from 'crypto';

const WELCOME_BADGE_SLUG = 'badge-recruta';
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
