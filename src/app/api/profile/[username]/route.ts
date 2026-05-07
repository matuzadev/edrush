import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, study_sessions, user_responses } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
import { computeLevel, computeMedals } from '@/lib/levels';

function computeStreak(sessionDates: string[]): number {
  if (!sessionDates.length) return 0;
  const unique = [...new Set(sessionDates)].sort((a, b) => (a > b ? -1 : 1));
  const today = new Date().toISOString().split('T')[0];
  let streak = 0; let current = today;
  for (const date of unique) {
    if (date === current) {
      streak++;
      const d = new Date(current + 'T00:00:00Z');
      d.setUTCDate(d.getUTCDate() - 1);
      current = d.toISOString().split('T')[0];
    } else if (date < current) break;
  }
  return streak;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  if (!username) return NextResponse.json({ error: 'Username inválido' }, { status: 400 });

  try {
    // Find user by username or nome (fallback)
    const user = await db.query.users.findFirst({
      where: sql`LOWER(${users.username}) = LOWER(${username}) OR LOWER(${users.nome}) = LOWER(${username})`,
    });

    if (!user) return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });

    // Aggregate stats
    const statsRes = await db
      .select({
        totalAnswered: sql<number>`COALESCE(SUM(questions_answered), 0)`,
        totalCorrect:  sql<number>`COALESCE(SUM(correct_answers), 0)`,
        totalSessions: sql<number>`COUNT(*)`,
      })
      .from(study_sessions)
      .where(eq(study_sessions.user_id, user.id));

    const stats = statsRes[0] ?? { totalAnswered: 0, totalCorrect: 0, totalSessions: 0 };
    const totalAnswered = Number(stats.totalAnswered);
    const totalCorrect  = Number(stats.totalCorrect);
    const totalSessions = Number(stats.totalSessions);
    const accuracy      = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    // Sessions last 90d for streak + activity
    const ninetyAgo = new Date(); ninetyAgo.setDate(ninetyAgo.getDate() - 90);
    const ninetyAgoStr = ninetyAgo.toISOString().split('T')[0];

    const sessions = await db
      .select({ session_date: study_sessions.session_date, questions_answered: study_sessions.questions_answered, correct_answers: study_sessions.correct_answers })
      .from(study_sessions)
      .where(sql`${study_sessions.user_id} = ${user.id} AND ${study_sessions.session_date} >= ${ninetyAgoStr}`);

    const activityMap = new Map<string, { answered: number; correct: number }>();
    for (const s of sessions) {
      const ex = activityMap.get(s.session_date);
      if (ex) {
        ex.answered += s.questions_answered;
        ex.correct  += s.correct_answers;
      } else {
        activityMap.set(s.session_date, { answered: s.questions_answered, correct: s.correct_answers });
      }
    }

    const activityLog: { date: string; questionsAnswered: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      activityLog.push({ date: dateStr, questionsAnswered: activityMap.get(dateStr)?.answered ?? 0 });
    }

    // Weekly progress (últimos 7 dias)
    const weeklyProgress: { day: string; date: string; answered: number; correct: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const day = activityMap.get(dateStr);
      weeklyProgress.push({
        day: WEEKDAY_LABELS[d.getDay()],
        date: dateStr,
        answered: day?.answered ?? 0,
        correct: day?.correct ?? 0,
      });
    }

    // Top disciplinas (até 6) — fonte: user_responses
    const byDisciplinaRaw = await db
      .select({
        disciplina: user_responses.disciplina,
        answered:   sql<number>`COUNT(*)`,
        correct:    sql<number>`SUM(${user_responses.acertou})`,
      })
      .from(user_responses)
      .where(sql`${user_responses.user_id} = ${user.id} AND ${user_responses.disciplina} IS NOT NULL`)
      .groupBy(user_responses.disciplina)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(6);

    const byDisciplina = byDisciplinaRaw.map(r => ({
      disciplina: r.disciplina ?? 'Outros',
      answered: Number(r.answered),
      correct: Number(r.correct),
      accuracy: Number(r.answered) > 0 ? Math.round((Number(r.correct) / Number(r.answered)) * 100) : 0,
    }));

    const streak = computeStreak(sessions.map(s => s.session_date));

    const storedXp  = user.xp ?? 0;
    const levelInfo = computeLevel(storedXp);

    const medals = computeMedals({ totalAnswered, totalCorrect, totalSessions, streak, level: levelInfo.level });

    return NextResponse.json({
      username: user.username ?? user.nome ?? 'Concurseiro',
      nome: user.nome,
      avatar_id: user.avatar_id ?? 1,
      bio: user.bio ?? null,
      location: user.location ?? null,
      criado_em: user.criado_em,
      equippedBorder: user.equipped_border ?? 'recruta',
      xp: storedXp,
      level: levelInfo.level,
      levelName: levelInfo.name,
      levelColor: levelInfo.color,
      levelBg: levelInfo.bg,
      levelBorder: levelInfo.border,
      xpIntoLevel: levelInfo.xpIntoLevel,
      xpNeeded: levelInfo.xpNeeded,
      xpProgressPct: levelInfo.progressPct,
      totalQuestionsAnswered: totalAnswered,
      totalQuestionsCorrect: totalCorrect,
      totalSessions,
      accuracy,
      streak,
      medals: medals.filter(m => m.unlocked).length,
      totalMedals: medals.length,
      achievements: medals,
      activityLog,
      weeklyProgress,
      byDisciplina,
    });
  } catch (error) {
    console.error('Erro ao buscar perfil público:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
