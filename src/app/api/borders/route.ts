import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { BORDERS, describeCriteria } from '@/data/borders';
import { getUserBorderStats, getUnlockedBorderSlugs, getEquippedBorderSlug, checkAndUnlockBorders } from '@/lib/borders';

// GET /api/borders
// Retorna o catálogo completo + status (unlocked, equipped) e stats agregados.
// Também oportuniza desbloquear bordas que o usuário já meets criteria mas ainda não tem registro.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  try {
    // Garante que recruta está sempre desbloqueada (todos têm)
    await checkAndUnlockBorders(userId);

    const [stats, unlocked, equipped] = await Promise.all([
      getUserBorderStats(userId),
      getUnlockedBorderSlugs(userId),
      getEquippedBorderSlug(userId),
    ]);

    const items = BORDERS.map(b => ({
      slug: b.slug,
      name: b.name,
      description: b.description,
      tier: b.tier,
      criteriaText: describeCriteria(b),
      criteriaType: b.criteria.type,
      criteriaValue: b.criteria.value,
      style: b.style,
      unlocked: unlocked.has(b.slug),
      equipped: equipped === b.slug,
    }));

    return NextResponse.json({
      borders: items,
      stats,
      equipped,
      totalUnlocked: unlocked.size,
      total: BORDERS.length,
    });
  } catch (error) {
    console.error('Erro ao listar bordas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
