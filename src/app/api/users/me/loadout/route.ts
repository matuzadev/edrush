import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient as client } from '@/lib/db';

interface LoadoutBody {
  borderItemId: string | null;
  avatarItemId: string | null;
  badgeIds: string[];
}

function parseBody(raw: unknown): LoadoutBody | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const borderItemId = obj.borderItemId === null || typeof obj.borderItemId === 'string' ? obj.borderItemId as string | null : undefined;
  const avatarItemId = obj.avatarItemId === null || typeof obj.avatarItemId === 'string' ? obj.avatarItemId as string | null : undefined;
  const badgeIds = Array.isArray(obj.badgeIds) ? obj.badgeIds : undefined;
  if (borderItemId === undefined || avatarItemId === undefined || badgeIds === undefined) return null;
  if (badgeIds.length > 3) return null;
  if (!badgeIds.every((b) => typeof b === 'string')) return null;
  return { borderItemId, avatarItemId, badgeIds: badgeIds as string[] };
}

/**
 * Verifica que cada itemId pertence ao inventário ativo do usuário e
 * tem categoria compatível com o slot. Retorna mapa itemId -> categoria.
 */
async function validateOwnership(
  userId: string,
  itemIds: string[],
): Promise<Map<string, string>> {
  if (itemIds.length === 0) return new Map();
  const placeholders = itemIds.map(() => '?').join(',');
  const now = new Date().toISOString();
  const rs = await client.execute({
    sql: `SELECT si.id AS item_id, si.category AS category
          FROM user_inventory ui
          JOIN store_items si ON si.id = ui.store_item_id
          WHERE ui.user_id = ?
            AND ui.store_item_id IN (${placeholders})
            AND (ui.expires_at IS NULL OR ui.expires_at > ?)`,
    args: [userId, ...itemIds, now],
  });
  const out = new Map<string, string>();
  for (const row of rs.rows) {
    const r = row as unknown as { item_id: string; category: string };
    out.set(r.item_id, r.category);
  }
  return out;
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

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const body = parseBody(raw);
  if (!body) {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  try {
    // Coleta IDs únicos não-nulos para validação
    const allIds = [
      body.borderItemId,
      body.avatarItemId,
      ...body.badgeIds,
    ].filter((id): id is string => typeof id === 'string' && id.length > 0);

    const owned = await validateOwnership(userId, [...new Set(allIds)]);

    // Valida que cada item pertence ao usuário e está no slot correto
    if (body.borderItemId) {
      const cat = owned.get(body.borderItemId);
      if (!cat) return NextResponse.json({ error: 'border_not_owned' }, { status: 400 });
      if (cat !== 'borda_perfil') return NextResponse.json({ error: 'border_invalid_category' }, { status: 400 });
    }
    if (body.avatarItemId) {
      const cat = owned.get(body.avatarItemId);
      if (!cat) return NextResponse.json({ error: 'avatar_not_owned' }, { status: 400 });
      if (cat !== 'avatar_orgao' && cat !== 'avatar_vitoria') {
        return NextResponse.json({ error: 'avatar_invalid_category' }, { status: 400 });
      }
    }
    for (const bid of body.badgeIds) {
      const cat = owned.get(bid);
      if (!cat) return NextResponse.json({ error: 'badge_not_owned', badgeId: bid }, { status: 400 });
      if (cat !== 'mini_logo_badge') {
        return NextResponse.json({ error: 'badge_invalid_category', badgeId: bid }, { status: 400 });
      }
    }

    const now = new Date().toISOString();

    // UPSERT em user_profile_loadout
    await client.execute({
      sql: `INSERT OR REPLACE INTO user_profile_loadout
            (user_id, border_item_id, avatar_item_id, equipped_badge_ids, updated_at)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        userId,
        body.borderItemId,
        body.avatarItemId,
        JSON.stringify(body.badgeIds),
        now,
      ],
    });

    // Atualiza is_equipped no inventário:
    // 1. Zera todos os flags do user nas categorias afetadas
    // 2. Marca como 1 os itens que estão no loadout
    const equippedIds = new Set<string>();
    if (body.borderItemId) equippedIds.add(body.borderItemId);
    if (body.avatarItemId) equippedIds.add(body.avatarItemId);
    for (const bid of body.badgeIds) equippedIds.add(bid);

    const slotCategories = ['borda_perfil', 'avatar_orgao', 'avatar_vitoria', 'mini_logo_badge'];
    const catPlaceholders = slotCategories.map(() => '?').join(',');
    await client.execute({
      sql: `UPDATE user_inventory
            SET is_equipped = 0
            WHERE user_id = ?
              AND store_item_id IN (
                SELECT id FROM store_items WHERE category IN (${catPlaceholders})
              )`,
      args: [userId, ...slotCategories],
    });

    if (equippedIds.size > 0) {
      const ids = [...equippedIds];
      const placeholders = ids.map(() => '?').join(',');
      await client.execute({
        sql: `UPDATE user_inventory
              SET is_equipped = 1
              WHERE user_id = ? AND store_item_id IN (${placeholders})`,
        args: [userId, ...ids],
      });

      await client.execute({
        sql: `UPDATE users
              SET equipped_border = COALESCE(
                (SELECT slug FROM store_items WHERE id = ? AND category = 'borda_perfil'),
                CASE
                  WHEN equipped_border IN (
                    SELECT slug FROM store_items WHERE category = 'borda_perfil'
                  ) THEN 'recruta'
                  ELSE equipped_border
                END
              ),
              atualizado_em = ?
              WHERE id = ?`,
        args: [body.borderItemId, now, userId],
      });
    }

    return NextResponse.json({
      ok: true,
      loadout: {
        borderItemId: body.borderItemId,
        avatarItemId: body.avatarItemId,
        badgeIds: body.badgeIds,
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar loadout:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
