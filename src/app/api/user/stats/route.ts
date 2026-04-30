import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { users, study_sessions, notifications } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { createNotification } from '@/lib/notifications';

// Definição das medalhas — derivadas de stats, sem tabela própria
interface Achievement {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
}

function computeAchievements(
  totalAnswered: number,
  totalCorrect: number,
  totalSessions: number,
  currentStreak: number
): Achievement[] {
  const accuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;

  return [
    {
      id: 'first_question',
      label: 'Primeira Questão',
      description: 'Respondeu sua primeira questão',
      unlocked: totalAnswered >= 1,
    },
    {
      id: 'ten_questions',
      label: 'Dez Questões',
      description: 'Respondeu 10 questões',
      unlocked: totalAnswered >= 10,
    },
    {
      id: 'hundred_questions',
      label: 'Centurião',
      description: 'Respondeu 100 questões',
      unlocked: totalAnswered >= 100,
    },
    {
      id: 'five_hundred_questions',
      label: 'Veterano',
      description: 'Respondeu 500 questões',
      unlocked: totalAnswered >= 500,
    },
    {
      id: 'first_session',
      label: 'Primeiro Treino',
      description: 'Completou sua primeira sessão de estudo',
      unlocked: totalSessions >= 1,
    },
    {
      id: 'ten_sessions',
      label: 'Consistente',
      description: 'Completou 10 sessões de estudo',
      unlocked: totalSessions >= 10,
    },
    {
      id: 'accuracy_70',
      label: 'Bom Aproveitamento',
      description: 'Atingiu 70% de acertos',
      unlocked: totalAnswered >= 20 && accuracy >= 0.7,
    },
    {
      id: 'accuracy_90',
      label: 'Excelência',
      description: 'Atingiu 90% de acertos',
      unlocked: totalAnswered >= 20 && accuracy >= 0.9,
    },
    {
      id: 'streak_3',
      label: 'Sequência de 3',
      description: '3 dias seguidos estudando',
      unlocked: currentStreak >= 3,
    },
    {
      id: 'streak_7',
      label: 'Semana Completa',
      description: '7 dias seguidos estudando',
      unlocked: currentStreak >= 7,
    },
  ];
}

function computeStreak(sessionDates: string[]): number {
  if (sessionDates.length === 0) return 0;

  // Pegar datas únicas ordenadas DESC
  const unique = [...new Set(sessionDates)].sort((a, b) => (a > b ? -1 : 1));
  const today = new Date().toISOString().split('T')[0];

  // Streak conta a partir de hoje ou ontem
  let streak = 0;
  let current = today;

  for (const date of unique) {
    if (date === current) {
      streak++;
      // Retroceder um dia
      const d = new Date(current + 'T00:00:00Z');
      d.setUTCDate(d.getUTCDate() - 1);
      current = d.toISOString().split('T')[0];
    } else if (date < current) {
      // Buraco — streak quebrado
      break;
    }
  }

  return streak;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  try {
    // Buscar dados do usuário
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Agregar stats das sessões
    const statsResult = await db
      .select({
        totalAnswered: sql<number>`COALESCE(SUM(questions_answered), 0)`,
        totalCorrect: sql<number>`COALESCE(SUM(correct_answers), 0)`,
        totalSessions: sql<number>`COUNT(*)`,
      })
      .from(study_sessions)
      .where(eq(study_sessions.user_id, userId));

    const stats = statsResult[0] ?? { totalAnswered: 0, totalCorrect: 0, totalSessions: 0 };

    // Buscar datas das sessões para calcular streak e activityLog (últimos 90 dias)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const ninetyDaysAgoStr = ninetyDaysAgo.toISOString().split('T')[0];

    const sessionsResult = await db
      .select({
        session_date: study_sessions.session_date,
        questions_answered: study_sessions.questions_answered,
        correct_answers: study_sessions.correct_answers,
      })
      .from(study_sessions)
      .where(
        sql`${study_sessions.user_id} = ${userId} AND ${study_sessions.session_date} >= ${ninetyDaysAgoStr}`
      );

    // Agregar por dia para o activityLog
    const activityMap = new Map<string, { questionsAnswered: number; correctAnswers: number; sessions: number }>();
    for (const s of sessionsResult) {
      const existing = activityMap.get(s.session_date);
      if (existing) {
        existing.questionsAnswered += s.questions_answered;
        existing.correctAnswers += s.correct_answers;
        existing.sessions += 1;
      } else {
        activityMap.set(s.session_date, {
          questionsAnswered: s.questions_answered,
          correctAnswers: s.correct_answers,
          sessions: 1,
        });
      }
    }

    // Gerar activityLog com os últimos 30 dias (para o componente ActivityCalendar)
    const activityLog: { date: string; completed: boolean; chaptersCompletedToday: number; questionsAnswered: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const day = activityMap.get(dateStr);
      activityLog.push({
        date: dateStr,
        completed: !!day && day.sessions > 0,
        chaptersCompletedToday: day?.sessions ?? 0,
        questionsAnswered: day?.questionsAnswered ?? 0,
      });
    }

    // Calcular streak com todas as sessões
    const allDates = sessionsResult.map(s => s.session_date);
    const streak = computeStreak(allDates);

    const totalAnswered = Number(stats.totalAnswered);
    const totalCorrect = Number(stats.totalCorrect);
    const totalSessions = Number(stats.totalSessions);
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    const achievements = computeAchievements(totalAnswered, totalCorrect, totalSessions, streak);
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    // Criar notificações para conquistas recém-desbloqueadas (que ainda não foram notificadas)
    const unlockedIds = achievements.filter(a => a.unlocked).map(a => a.id);
    if (unlockedIds.length > 0) {
      // Buscar quais conquistas já foram notificadas para este usuário
      const alreadyNotified = await db
        .select({ related_id: notifications.related_id })
        .from(notifications)
        .where(
          and(
            eq(notifications.user_id, userId),
            eq(notifications.type, 'achievement')
          )
        );

      const notifiedIds = new Set(alreadyNotified.map(n => n.related_id));

      // Notificar apenas conquistas novas
      for (const achievement of achievements.filter(a => a.unlocked)) {
        if (!notifiedIds.has(achievement.id)) {
          await createNotification({
            userId,
            type: 'achievement',
            title: `Conquista desbloqueada: ${achievement.label}`,
            body: achievement.description,
            relatedId: achievement.id,
          });
        }
      }
    }

    return NextResponse.json({
      // Perfil básico
      id: user.id,
      nome: user.nome,
      email: user.email,
      foto_url: user.foto_url,
      username: user.username ?? user.nome ?? 'Concurseiro',
      bio: user.bio ?? null,
      birthday: user.birthday ?? null,
      location: user.location ?? null,
      avatar_id: user.avatar_id ?? 1,
      criado_em: user.criado_em,
      // Stats
      totalQuestionsAnswered: totalAnswered,
      totalQuestionsCorrect: totalCorrect,
      totalSessions,
      accuracy,
      streak,
      // Achievements
      medals: unlockedCount,
      achievements,
      // Activity
      activityLog,
    });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
