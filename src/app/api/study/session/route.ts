import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import {
  study_sessions, users, notifications,
  chapters, user_chapter_progress, chapter_unlocks,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { xpForSession, computeLevel } from '@/lib/levels';
import { checkAndUnlockBorders } from '@/lib/borders';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  let body: {
    questionsAnswered: number;
    correctAnswers: number;
    concursoSlug?: string;
    subject?: string;        // slug do subjects.json (URL), ex.: 'portugues'
    chapterId?: number;      // id do capítulo em subjects.json (1, 2, 3...)
    // Compat: marca o capítulo como completado em user_chapter_progress quando ≥80%.
    disciplina?: string;     // ex.: 'lingua-portuguesa' (usado como fallback)
    chapter?: string;        // título do capítulo
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const { questionsAnswered, correctAnswers, concursoSlug, subject, chapterId, disciplina, chapter } = body;

  if (
    typeof questionsAnswered !== 'number' ||
    typeof correctAnswers !== 'number' ||
    questionsAnswered < 0 ||
    correctAnswers < 0 ||
    correctAnswers > questionsAnswered
  ) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const now = new Date();
  const sessionDate = now.toISOString().split('T')[0];
  const earned = xpForSession(correctAnswers, questionsAnswered);

  try {
    // Insert session
    await db.insert(study_sessions).values({
      user_id: userId,
      session_date: sessionDate,
      questions_answered: questionsAnswered,
      correct_answers: correctAnswers,
      concurso_slug: concursoSlug ?? null,
      subject: subject ?? null,
      chapter_id: typeof chapterId === 'number' ? chapterId : null,
      criado_em: now.toISOString(),
    });

    // Atualiza progresso do capítulo (e desbloqueia próximos quando completar ≥ 80%).
    // Não bloqueia a resposta se algo falhar.
    if (disciplina && chapter && questionsAnswered > 0) {
      try {
        const accuracy = (correctAnswers / questionsAnswered) * 100;
        const completou = accuracy >= 80;

        const ch = await db.query.chapters.findFirst({
          where: and(eq(chapters.disciplina, disciplina), eq(chapters.titulo, chapter)),
        });

        if (ch) {
          const existing = await db.query.user_chapter_progress.findFirst({
            where: and(
              eq(user_chapter_progress.user_id, userId),
              eq(user_chapter_progress.chapter_id, ch.id),
            ),
          });

          if (existing) {
            await db.update(user_chapter_progress).set({
              acertos_total: correctAnswers,
              questoes_respondidas: questionsAnswered,
              percentual_acerto: accuracy,
              // só promove para completed; nunca desmarca um capítulo já completado
              is_completed: existing.is_completed === 1 || completou ? 1 : 0,
              completado_em: existing.completado_em ?? (completou ? now.toISOString() : null),
              atualizado_em: now.toISOString(),
            }).where(and(
              eq(user_chapter_progress.user_id, userId),
              eq(user_chapter_progress.chapter_id, ch.id),
            ));
          } else {
            await db.insert(user_chapter_progress).values({
              user_id: userId,
              chapter_id: ch.id,
              is_unlocked: 1,
              is_completed: completou ? 1 : 0,
              acertos_total: correctAnswers,
              questoes_respondidas: questionsAnswered,
              percentual_acerto: accuracy,
              tempo_estudo_ms: 0,
              iniciado_em: now.toISOString(),
              completado_em: completou ? now.toISOString() : null,
              criado_em: now.toISOString(),
              atualizado_em: now.toISOString(),
            });
          }

          // Quando completa, desbloqueia os próximos capítulos definidos em chapter_unlocks.
          if (completou) {
            const unlocks = await db.select().from(chapter_unlocks)
              .where(eq(chapter_unlocks.chapter_id_origem, ch.id));
            for (const u of unlocks) {
              const destProg = await db.query.user_chapter_progress.findFirst({
                where: and(
                  eq(user_chapter_progress.user_id, userId),
                  eq(user_chapter_progress.chapter_id, u.chapter_id_destino),
                ),
              });
              if (destProg) {
                await db.update(user_chapter_progress).set({
                  is_unlocked: 1,
                  atualizado_em: now.toISOString(),
                }).where(and(
                  eq(user_chapter_progress.user_id, userId),
                  eq(user_chapter_progress.chapter_id, u.chapter_id_destino),
                ));
              } else {
                await db.insert(user_chapter_progress).values({
                  user_id: userId,
                  chapter_id: u.chapter_id_destino,
                  is_unlocked: 1,
                  is_completed: 0,
                  acertos_total: 0,
                  questoes_respondidas: 0,
                  percentual_acerto: 0,
                  tempo_estudo_ms: 0,
                  criado_em: now.toISOString(),
                  atualizado_em: now.toISOString(),
                });
              }
            }
          }
        }
      } catch (err) {
        console.error('Erro ao atualizar progresso de capítulo (sem bloquear):', err);
      }
    }

    let leveledUp = false;
    let newLevel = 1;
    let levelInfo: { name: string; color: string; bg: string; border: string } | null = null;

    if (earned > 0) {
      // Fetch current level and XP before update
      const userRow = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { xp: true, level: true },
      });
      const currentXp = userRow?.xp ?? 0;
      const oldLevel = userRow?.level ?? 1;
      const newXp = currentXp + earned;
      const newLevelInfo = computeLevel(newXp);
      newLevel = newLevelInfo.level;
      leveledUp = newLevel > oldLevel;

      await db
        .update(users)
        .set({ xp: newXp, level: newLevel, atualizado_em: now.toISOString() })
        .where(eq(users.id, userId));

      levelInfo = {
        name: newLevelInfo.name,
        color: newLevelInfo.color,
        bg: newLevelInfo.bg,
        border: newLevelInfo.border,
      };

      // Se subiu de nível, criar notificação e dar +50 XP de bônus
      if (leveledUp) {
        await db.insert(notifications).values({
          user_id: userId,
          type: 'achievement',
          title: `Nível ${newLevel} alcançado!`,
          body: `Parabéns! Você atingiu o nível ${newLevel} — ${newLevelInfo.name}. Continue assim!`,
          read: 0,
          related_id: String(newLevel),
          criado_em: now.toISOString(),
        });

        // Bônus de +50 XP ao subir de nível
        await db
          .update(users)
          .set({ xp: newXp + 50, atualizado_em: now.toISOString() })
          .where(eq(users.id, userId));
      }
    }

    // Verifica e desbloqueia bordas que o usuário agora atinge.
    // Falhas aqui não bloqueiam a resposta (fire-and-forget seguro).
    let newBorders: { slug: string; name: string; tier: string }[] = [];
    try {
      const unlocked = await checkAndUnlockBorders(userId);
      newBorders = unlocked.map(b => ({ slug: b.slug, name: b.name, tier: b.tier }));
    } catch (e) {
      console.error('Falha ao verificar bordas:', e);
    }

    return NextResponse.json({
      ok: true,
      xpEarned: earned,
      newLevel,
      leveledUp,
      levelInfo,
      newBorders,
    });
  } catch (error) {
    console.error('Erro ao salvar sessão de estudo:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
