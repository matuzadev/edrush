import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient as client } from '@/lib/db';
import { getCrystalBalance } from '@/lib/crystals';

const VALID_CATEGORIES = new Set([
  'avatar_orgao',
  'avatar_vitoria',
  'borda_perfil',
  'mini_logo_badge',
  'exp_buff',
]);

const VALID_RARITIES = new Set(['common', 'rare', 'epic', 'legendary', 'mythic']);

// Ordem de raridade para sort=rarity_desc (maior raridade primeiro)
const RARITY_ORDER: Record<string, number> = {
  mythic: 5,
  legendary: 4,
  epic: 3,
  rare: 2,
  common: 1,
};

interface StoreItemRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price_crystals: number;
  rarity: string;
  image_url: string | null;
  metadata: string | null;
  is_active: number;
  stock: number | null;
  created_at: string;
  updated_at: string;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? ((session.user as unknown as { id: string }).id ?? null) : null;

    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category');
    const rarity = searchParams.get('rarity');
    const affordable = searchParams.get('affordable') === '1';
    const sort = searchParams.get('sort') ?? 'newest';

    // Validação manual (sem zod)
    if (category && !VALID_CATEGORIES.has(category)) {
      return NextResponse.json({ error: 'category inválida' }, { status: 400 });
    }
    if (rarity && !VALID_RARITIES.has(rarity)) {
      return NextResponse.json({ error: 'rarity inválida' }, { status: 400 });
    }

    // SQL básico — filtros opcionais via concatenação parametrizada
    const where: string[] = ["is_active = 1", "category != 'plataforma_trial'"];
    const args: (string | number)[] = [];
    if (category) { where.push('category = ?'); args.push(category); }
    if (rarity) { where.push('rarity = ?'); args.push(rarity); }

    let orderBy = 'created_at DESC';
    if (sort === 'price_asc') orderBy = 'price_crystals ASC';
    else if (sort === 'price_desc') orderBy = 'price_crystals DESC';
    else if (sort === 'newest') orderBy = 'created_at DESC';
    // rarity_desc é tratado em memória (pq raridade é texto não-ordenável)

    const sql = `SELECT id, slug, name, description, category, price_crystals, rarity,
                        image_url, metadata, is_active, stock, created_at, updated_at
                 FROM store_items
                 WHERE ${where.join(' AND ')}
                 ORDER BY ${orderBy}`;

    const rs = await client.execute({ sql, args });
    let rows = rs.rows as unknown as StoreItemRow[];

    if (sort === 'rarity_desc') {
      rows = [...rows].sort((a, b) => (RARITY_ORDER[b.rarity] ?? 0) - (RARITY_ORDER[a.rarity] ?? 0));
    }

    // Enriquece com owned/equipped + balance, se autenticado
    let ownedSet = new Set<string>();
    let equippedSet = new Set<string>();
    let balance: number | undefined;

    if (userId) {
      balance = await getCrystalBalance(userId);

      const invRs = await client.execute({
        sql: `SELECT store_item_id, is_equipped, expires_at
              FROM user_inventory
              WHERE user_id = ?`,
        args: [userId],
      });
      for (const row of invRs.rows) {
        const r = row as unknown as { store_item_id: string; is_equipped: number; expires_at: string | null };
        // Item expirado não conta como owned
        if (r.expires_at && new Date(r.expires_at).getTime() < Date.now()) continue;
        ownedSet.add(r.store_item_id);
        if (r.is_equipped === 1) equippedSet.add(r.store_item_id);
      }
    }

    let items = rows.map((r) => {
      let metadata: unknown = null;
      if (r.metadata) {
        try { metadata = JSON.parse(r.metadata); } catch { metadata = null; }
      }
      return {
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description,
        category: r.category,
        priceCrystals: Number(r.price_crystals),
        rarity: r.rarity,
        imageUrl: r.image_url,
        metadata,
        stock: r.stock,
        owned: ownedSet.has(r.id),
        equipped: equippedSet.has(r.id),
      };
    });

    if (affordable && balance !== undefined) {
      items = items.filter((it) => it.priceCrystals <= balance!);
    }

    return NextResponse.json({ items, balance });
  } catch (error) {
    console.error('Erro ao listar itens da loja:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
