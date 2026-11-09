import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { checkAndUnlockBorders } from '@/lib/borders';

// POST /api/borders/check
// Verifica e desbloqueia bordas que o usuário já meets criteria.
// Retorna lista de bordas recém-desbloqueadas (para UI mostrar toast/animation).
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  try {
    const newlyUnlocked = await checkAndUnlockBorders(userId);
    return NextResponse.json({
      newlyUnlocked: newlyUnlocked.map(b => ({
        slug: b.slug,
        name: b.name,
        description: b.description,
        tier: b.tier,
        style: b.style,
      })),
    });
  } catch (error) {
    console.error('Erro ao verificar bordas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
