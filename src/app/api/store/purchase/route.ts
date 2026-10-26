import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient as client } from '@/lib/db';
import crypto from 'crypto';
import {
  spendCrystals,
  applyExpBuff,
  grantCrystals,
} from '@/lib/crystals';

interface StoreItemRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price_crystals: number;
  rarity: string;
  metadata: string | null;
  is_active: number;
  stock: number | null;
}

interface BuffMetadata { multiplier: number; durationHours: number }
interface TrialMetadata { days: number }

function parseMetadata(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const userId = (session.user as unknown as { id: string }).id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const itemId =
    body && typeof body === 'object' && 'itemId' in body
      ? String((body as { itemId: unknown }).itemId ?? '')
      : '';
  if (!itemId) {
    return NextResponse.json({ error: 'itemId obrigatório' }, { status: 400 });
  }

  try {
    // Busca item
    const itemRs = await client.execute({
      sql: `SELECT id, slug, name, description, category, price_crystals, rarity,
                   metadata, is_active, stock
            FROM store_items
            WHERE id = ?`,
      args: [itemId],
    });
    if (itemRs.rows.length === 0) {
      return NextResponse.json({ error: 'item_not_found' }, { status: 404 });
    }
    const item = itemRs.rows[0] as unknown as StoreItemRow;

    if (item.is_active !== 1) {
      return NextResponse.json({ error: 'item_inactive' }, { status: 400 });
    }
    if (item.category === 'plataforma_trial') {
      return NextResponse.json({ error: 'subscription_items_unavailable' }, { status: 410 });
    }
    if (item.stock !== null && item.stock !== undefined && Number(item.stock) <= 0) {
      return NextResponse.json({ error: 'out_of_stock' }, { status: 400 });
    }

    const metadata = parseMetadata(item.metadata);

    // Bloqueia recompra de itens permanentes (não-buff/trial). Buffs e trials podem
    // ser recomprados (acumulam duração via applyExpBuff/extendSubscription).
    const stackable = item.category === 'exp_buff' || item.category === 'plataforma_trial';
    if (!stackable) {
      const existingRs = await client.execute({
        sql: `SELECT id FROM user_inventory
              WHERE user_id = ? AND store_item_id = ?
                AND (expires_at IS NULL OR expires_at > ?)
              LIMIT 1`,
        args: [userId, item.id, new Date().toISOString()],
      });
      if (existingRs.rows.length > 0) {
        return NextResponse.json({ error: 'already_owned' }, { status: 400 });
      }
    }

    // Tenta debitar cristais (atômico).
    const price = Number(item.price_crystals);
    const spendResult = await spendCrystals(
      userId,
      price,
      `Compra: ${item.name}`,
      item.id,
    );

    if (!spendResult.ok) {
      return NextResponse.json(
        {
          error: 'insufficient_crystals',
          missing: price - spendResult.balance,
          balance: spendResult.balance,
        },
        { status: 402 },
      );
    }

    // Calcula expiresAt para itens consumíveis.
    let expiresAt: string | null = null;
    let appliedEffect: { kind: string; expiresAt?: string; multiplier?: number; days?: number } | null = null;

    if (item.category === 'exp_buff') {
      const meta = metadata as Partial<BuffMetadata> | null;
      const multiplier = Number(meta?.multiplier);
      const durationHours = Number(meta?.durationHours);
      if (!Number.isFinite(multiplier) || multiplier <= 1 ||
          !Number.isFinite(durationHours) || durationHours <= 0) {
        // Reembolsa se metadata estiver corrompida.
        await grantCrystals(userId, price, 'refund', `Reembolso: metadata inválida ${item.slug}`, item.id);
        return NextResponse.json({ error: 'invalid_item_metadata' }, { status: 500 });
      }
      const buff = await applyExpBuff(userId, multiplier, durationHours);
      expiresAt = buff.expiresAt;
      appliedEffect = { kind: 'exp_buff', multiplier: buff.multiplier, expiresAt: buff.expiresAt };
    }

    // Insere no inventário
    await client.execute({
      sql: `INSERT INTO user_inventory (id, user_id, store_item_id, acquired_at, expires_at, is_equipped)
            VALUES (?, ?, ?, ?, ?, 0)`,
      args: [crypto.randomUUID(), userId, item.id, new Date().toISOString(), expiresAt],
    });

    // Decrementa stock se finito
    if (item.stock !== null && item.stock !== undefined) {
      await client.execute({
        sql: 'UPDATE store_items SET stock = stock - 1, updated_at = ? WHERE id = ? AND stock > 0',
        args: [new Date().toISOString(), item.id],
      });
    }

    return NextResponse.json({
      balance: spendResult.balance,
      item: {
        id: item.id,
        slug: item.slug,
        name: item.name,
        category: item.category,
        rarity: item.rarity,
      },
      expiresAt,
      appliedEffect,
    });
  } catch (error) {
    console.error('Erro ao processar compra:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
