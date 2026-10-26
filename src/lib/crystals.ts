import { lsClient as client } from '@/lib/db';
import crypto from 'crypto';

// Usamos o cliente raw libsql (singleton em @/lib/db) para garantir atomicidade
// via UPDATE com cláusula "WHERE crystals >= ?" e checagem de rowsAffected.
// Drizzle abstrai demais para esse caso (precisamos saber se o UPDATE realmente
// afetou a linha).

export type CrystalTxType =
  | 'earn_question'
  | 'earn_chapter'
  | 'earn_streak'
  | 'spend_store'
  | 'admin_grant'
  | 'refund'
  | 'other';

export interface CrystalTransaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  reason: string;
  referenceId: string | null;
  createdAt: string;
}

/**
 * Lê o saldo atual de cristais do usuário.
 * Retorna 0 se o usuário não existe.
 */
export async function getCrystalBalance(userId: string): Promise<number> {
  const rs = await client.execute({
    sql: 'SELECT crystals FROM users WHERE id = ?',
    args: [userId],
  });
  if (rs.rows.length === 0) return 0;
  return Number((rs.rows[0] as unknown as { crystals: number }).crystals ?? 0);
}

/**
 * Concede `amount` cristais ao usuário e registra transação positiva.
 * Não há limite máximo — o front pode usar números absurdos para grants admin.
 */
export async function grantCrystals(
  userId: string,
  amount: number,
  type: CrystalTxType,
  reason: string,
  referenceId?: string | null,
): Promise<{ balance: number }> {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('grantCrystals: amount deve ser positivo');
  }
  const now = new Date().toISOString();

  await client.execute({
    sql: 'UPDATE users SET crystals = crystals + ? WHERE id = ?',
    args: [amount, userId],
  });

  await client.execute({
    sql: `INSERT INTO crystal_transactions (id, user_id, amount, type, reason, reference_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [crypto.randomUUID(), userId, amount, type, reason, referenceId ?? null, now],
  });

  const balance = await getCrystalBalance(userId);
  return { balance };
}

/**
 * Tenta debitar `amount` cristais do usuário de forma atômica.
 * Sucesso: retorna { ok: true, balance }.
 * Falta de saldo: retorna { ok: false, error: 'insufficient', balance } SEM
 * registrar transação. A atomicidade é garantida pelo predicado
 * `crystals >= ?` no UPDATE — se o saldo for insuficiente, rowsAffected=0.
 */
export async function spendCrystals(
  userId: string,
  amount: number,
  reason: string,
  referenceId?: string | null,
): Promise<
  | { ok: true; balance: number }
  | { ok: false; error: 'insufficient'; balance: number }
> {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('spendCrystals: amount deve ser positivo');
  }
  const now = new Date().toISOString();

  const updRs = await client.execute({
    sql: 'UPDATE users SET crystals = crystals - ? WHERE id = ? AND crystals >= ?',
    args: [amount, userId, amount],
  });

  if (updRs.rowsAffected !== 1) {
    const balance = await getCrystalBalance(userId);
    return { ok: false, error: 'insufficient', balance };
  }

  await client.execute({
    sql: `INSERT INTO crystal_transactions (id, user_id, amount, type, reason, reference_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [crypto.randomUUID(), userId, -amount, 'spend_store', reason, referenceId ?? null, now],
  });

  const balance = await getCrystalBalance(userId);
  return { ok: true, balance };
}

/**
 * Histórico paginado de transações de cristais (mais recente primeiro).
 */
export async function getTransactionHistory(
  userId: string,
  opts: { limit?: number; offset?: number } = {},
): Promise<CrystalTransaction[]> {
  const limit = Math.min(Math.max(1, opts.limit ?? 20), 100);
  const offset = Math.max(0, opts.offset ?? 0);

  const rs = await client.execute({
    sql: `SELECT id, user_id, amount, type, reason, reference_id, created_at
          FROM crystal_transactions
          WHERE user_id = ?
          ORDER BY created_at DESC
          LIMIT ? OFFSET ?`,
    args: [userId, limit, offset],
  });

  return rs.rows.map((row) => {
    const r = row as unknown as {
      id: string;
      user_id: string;
      amount: number;
      type: string;
      reason: string;
      reference_id: string | null;
      created_at: string;
    };
    return {
      id: r.id,
      userId: r.user_id,
      amount: Number(r.amount),
      type: r.type,
      reason: r.reason,
      referenceId: r.reference_id ?? null,
      createdAt: r.created_at,
    };
  });
}

/**
 * Aplica buff de EXP. Multiplier substitui o atual (não acumula).
 * Se já existe buff ativo, a duração é estendida (novoFim = atualFim + duration).
 * Se não há buff ativo, novoFim = now + duration.
 */
export async function applyExpBuff(
  userId: string,
  multiplier: number,
  durationHours: number,
): Promise<{ multiplier: number; expiresAt: string }> {
  if (!Number.isFinite(multiplier) || multiplier <= 1) {
    throw new Error('applyExpBuff: multiplier deve ser > 1');
  }
  if (!Number.isFinite(durationHours) || durationHours <= 0) {
    throw new Error('applyExpBuff: durationHours deve ser positivo');
  }

  const rs = await client.execute({
    sql: 'SELECT exp_buff_expires_at FROM users WHERE id = ?',
    args: [userId],
  });
  const currentExpires = (rs.rows[0] as unknown as { exp_buff_expires_at: string | null })
    ?.exp_buff_expires_at ?? null;

  const now = Date.now();
  const currentMs = currentExpires ? new Date(currentExpires).getTime() : 0;
  const baseMs = currentMs > now ? currentMs : now;
  const newExpiresMs = baseMs + durationHours * 60 * 60 * 1000;
  const newExpires = new Date(newExpiresMs).toISOString();

  await client.execute({
    sql: `UPDATE users
          SET exp_buff_multiplier = ?, exp_buff_expires_at = ?
          WHERE id = ?`,
    args: [multiplier, newExpires, userId],
  });

  return { multiplier, expiresAt: newExpires };
}

/**
 * Estende a assinatura do usuário em `days` dias.
 * Se a assinatura está expirada (ou nunca existiu), usa now como base.
 * Caso contrário, soma sobre a expiração atual.
 */
