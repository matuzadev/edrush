import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { BORDERS, describeCriteria, canUserAccessBorder } from '@/data/borders';
import { getUserBorderStats, getUnlockedBorderSlugs, getEquippedBorderSlug, checkAndUnlockBorders } from '@/lib/borders';
import { isFounderEmail } from '@/lib/welcome-rewards';

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
    // Garante que recruta + bordas exclusivas autorizadas estão desbloqueadas
    await checkAndUnlockBorders(userId);

    const [stats, unlocked, equipped, userRow] = await Promise.all([
      getUserBorderStats(userId),
      getUnlockedBorderSlugs(userId),
      getEquippedBorderSlug(userId),
      db.query.users.findFirst({ where: eq(users.id, userId), columns: { email: true } }),
    ]);
    const userEmail = userRow?.email ?? null;
    const isFounder = userEmail ? isFounderEmail(userEmail) : false;

    const visibleBorders = BORDERS.filter(b => canUserAccessBorder(b, isFounder));

    const items = visibleBorders.map(b => ({
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

    // Conta unlocked apenas entre as bordas visíveis pra esse usuário
    const totalUnlockedVisible = visibleBorders.filter(b => unlocked.has(b.slug)).length;

    return NextResponse.json({
      borders: items,
      stats,
      equipped,
      totalUnlocked: totalUnlockedVisible,
      total: visibleBorders.length,
    });
  } catch (error) {
    console.error('Erro ao listar bordas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
