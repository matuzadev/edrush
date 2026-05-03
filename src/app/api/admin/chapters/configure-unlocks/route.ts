import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { chapter_unlocks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * POST /api/admin/chapters/configure-unlocks
 * Configura qual capítulo desbloqueia qual (relação 1-para-N)
 * Body: { chapterId: number, unlocksChapterIds: number[] }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Validar se é admin
  // if (session.user.role !== 'admin') {
  //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // }

  const body = await request.json();
  const { chapterId, unlocksChapterIds, percentualNecessario } = body;

  if (!chapterId || !unlocksChapterIds || !Array.isArray(unlocksChapterIds)) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  try {
    // Limpar antigos desbloqueios para este capítulo
    await db
      .delete(chapter_unlocks)
      .where(eq(chapter_unlocks.chapter_id_origem, chapterId));

    // Inserir novos
    for (const unlocksId of unlocksChapterIds) {
      await db.insert(chapter_unlocks).values({
        chapter_id_origem: chapterId,
        chapter_id_destino: unlocksId,
        percentual_necessario: percentualNecessario || 80,
        criado_em: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Capítulo ${chapterId} agora desbloqueia ${unlocksChapterIds.length} capítulos`,
    });
  } catch (error) {
    console.error('Erro ao configurar desbloqueios:', error);
    return NextResponse.json({ error: 'Erro ao configurar' }, { status: 500 });
  }
}

/**
 * GET /api/admin/chapters/unlocks-config
 * Retorna configuração atual de desbloqueios
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const unlocks = await db.select().from(chapter_unlocks);

    return NextResponse.json({ unlocks });
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    return NextResponse.json({ error: 'Erro ao buscar' }, { status: 500 });
  }
}
