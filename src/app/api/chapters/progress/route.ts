import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { user_chapter_progress, chapters, chapter_unlocks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/chapters/progress
 * Retorna o progresso do usuário em todos os capítulos
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  if (!userId) {
    return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
  }

  try {
    // Buscar todos os capítulos
    const allChapters = await db.select().from(chapters);

    // Buscar progresso do usuário
    const userProgress = await db
      .select()
      .from(user_chapter_progress)
      .where(eq(user_chapter_progress.user_id, userId));

    // Enriquecer com dados dos capítulos
    const result = allChapters.map((chapter) => {
      const progress = userProgress.find((p) => p.chapter_id === chapter.id);
      return {
        ...chapter,
        progress: progress || {
          is_unlocked: chapter.is_primeiro ? 1 : 0,
          is_completed: 0,
          acertos_total: 0,
          questoes_respondidas: 0,
          percentual_acerto: 0,
        },
      };
    });

    return NextResponse.json({ chapters: result });
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return NextResponse.json({ error: 'Erro ao buscar progresso' }, { status: 500 });
  }
}

/**
 * POST /api/chapters/progress
 * Atualiza progresso de um capítulo e verifica desbloqueios
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  if (!userId) {
    return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
  }

  const body = await request.json();
  const { chapterId, acertos, questoes, tempoMs } = body;

  if (!chapterId || acertos == null || questoes == null) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  try {
    const percentualAcerto = (acertos / questoes) * 100;

    // Verificar se já tem progresso
    const existingProgress = await db
      .select()
      .from(user_chapter_progress)
      .where(
        and(
          eq(user_chapter_progress.user_id, userId),
          eq(user_chapter_progress.chapter_id, chapterId)
        )
      );

    if (existingProgress.length > 0) {
      // Atualizar progresso
      await db
        .update(user_chapter_progress)
        .set({
          acertos_total: acertos,
          questoes_respondidas: questoes,
          percentual_acerto: percentualAcerto,
          tempo_estudo_ms: (existingProgress[0].tempo_estudo_ms || 0) + (tempoMs || 0),
          is_completed: percentualAcerto >= 80 ? 1 : 0,
          completado_em:
            percentualAcerto >= 80 ? new Date().toISOString() : null,
          atualizado_em: new Date().toISOString(),
        })
        .where(
          and(
            eq(user_chapter_progress.user_id, userId),
            eq(user_chapter_progress.chapter_id, chapterId)
          )
        );
    } else {
      // Criar novo progresso
      await db.insert(user_chapter_progress).values({
        user_id: userId,
        chapter_id: chapterId,
        is_unlocked: 1,
        is_completed: percentualAcerto >= 80 ? 1 : 0,
        acertos_total: acertos,
        questoes_respondidas: questoes,
        percentual_acerto: percentualAcerto,
        tempo_estudo_ms: tempoMs || 0,
        iniciado_em: new Date().toISOString(),
        completado_em:
          percentualAcerto >= 80 ? new Date().toISOString() : null,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      });
    }

    // Se completou (80%+), desbloquear próximos capítulos
    if (percentualAcerto >= 80) {
      await desbloquearProximosCapitulos(userId, chapterId);
    }

    return NextResponse.json({
      success: true,
      percentualAcerto,
      completado: percentualAcerto >= 80,
    });
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    return NextResponse.json({ error: 'Erro ao atualizar progresso' }, { status: 500 });
  }
}

/**
 * Desbloqueia automaticamente próximos capítulos quando user completa um
 */
async function desbloquearProximosCapitulos(userId: string, chapterId: number) {
  try {
    // Buscar desbloqueios para este capítulo
    const unlocks = await db
      .select()
      .from(chapter_unlocks)
      .where(eq(chapter_unlocks.chapter_id_origem, chapterId));

    for (const unlock of unlocks) {
      const chapterDestinoId = unlock.chapter_id_destino;

      // Verificar se já tem progresso
      const existingProgress = await db
        .select()
        .from(user_chapter_progress)
        .where(
          and(
            eq(user_chapter_progress.user_id, userId),
            eq(user_chapter_progress.chapter_id, chapterDestinoId)
          )
        );

      if (existingProgress.length > 0) {
        // Atualizar para desbloqueado
        await db
          .update(user_chapter_progress)
          .set({
            is_unlocked: 1,
            atualizado_em: new Date().toISOString(),
          })
          .where(
            and(
              eq(user_chapter_progress.user_id, userId),
              eq(user_chapter_progress.chapter_id, chapterDestinoId)
            )
          );
      } else {
        // Criar novo registro desbloqueado
        await db.insert(user_chapter_progress).values({
          user_id: userId,
          chapter_id: chapterDestinoId,
          is_unlocked: 1,
          is_completed: 0,
          acertos_total: 0,
          questoes_respondidas: 0,
          percentual_acerto: 0,
          tempo_estudo_ms: 0,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
        });
      }
    }

    console.log(
      `✅ Desbloqueados ${unlocks.length} capítulos para usuário ${userId}`
    );
  } catch (error) {
    console.error('Erro ao desbloquear capítulos:', error);
  }
}
