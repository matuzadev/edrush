import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
<<<<<<< HEAD
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
=======
import { users, study_sessions, notifications, user_responses } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { createNotification } from '@/lib/notifications';
import { computeLevel, computeMedals, xpForSession } from '@/lib/levels';
import { createClient } from '@libsql/client';

const lsClient = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:data/foco-federal.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

interface EquippedBadge {
  id: string;
  slug: string;
  name: string;
  rarity: string;
  category: string;
  metadata: unknown;
  imageUrl: string | null;
}

// Selos atualmente equipados pelo usuário (ordem em equipped_badge_ids do loadout).
async function fetchEquippedBadges(userId: string): Promise<EquippedBadge[]> {
  const ldRs = await lsClient.execute({
    sql: 'SELECT equipped_badge_ids FROM user_profile_loadout WHERE user_id = ?',
    args: [userId],
  });
  if (ldRs.rows.length === 0) return [];
  const raw = (ldRs.rows[0] as unknown as { equipped_badge_ids: string | null }).equipped_badge_ids;
  if (!raw) return [];
  let badgeIds: string[] = [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) badgeIds = arr.filter((x): x is string => typeof x === 'string');
  } catch { return []; }
  if (badgeIds.length === 0) return [];

  const placeholders = badgeIds.map(() => '?').join(',');
  const now = new Date().toISOString();
  const itemsRs = await lsClient.execute({
    sql: `SELECT si.id, si.slug, si.name, si.rarity, si.category, si.metadata, si.image_url
          FROM user_inventory ui
          JOIN store_items si ON si.id = ui.store_item_id
          WHERE ui.user_id = ?
            AND ui.store_item_id IN (${placeholders})
            AND (ui.expires_at IS NULL OR ui.expires_at > ?)`,
    args: [userId, ...badgeIds, now],
  });
  const byId = new Map<string, EquippedBadge>();
  for (const row of itemsRs.rows) {
    const r = row as unknown as {
      id: string; slug: string; name: string; rarity: string; category: string;
      metadata: string | null; image_url: string | null;
    };
    let metadata: unknown = null;
    if (r.metadata) { try { metadata = JSON.parse(r.metadata); } catch { metadata = null; } }
    byId.set(r.id, {
      id: r.id, slug: r.slug, name: r.name, rarity: r.rarity, category: r.category,
      metadata, imageUrl: r.image_url,
    });
  }
  return badgeIds.map((id) => byId.get(id)).filter((b): b is EquippedBadge => !!b);
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
}

function computeStreak(sessionDates: string[]): number {
  if (sessionDates.length === 0) return 0;
<<<<<<< HEAD

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
=======
  const unique = [...new Set(sessionDates)].sort((a, b) => (a > b ? -1 : 1));
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let current = today;
  for (const date of unique) {
    if (date === current) {
      streak++;
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
      const d = new Date(current + 'T00:00:00Z');
      d.setUTCDate(d.getUTCDate() - 1);
      current = d.toISOString().split('T')[0];
    } else if (date < current) {
<<<<<<< HEAD
      // Buraco — streak quebrado
      break;
    }
  }

=======
      break;
    }
  }
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
  return streak;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  try {
<<<<<<< HEAD
    // Buscar dados do usuário
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Agregar stats das sessões
=======
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    // Aggregate stats from sessions
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
    const statsResult = await db
      .select({
        totalAnswered: sql<number>`COALESCE(SUM(questions_answered), 0)`,
        totalCorrect: sql<number>`COALESCE(SUM(correct_answers), 0)`,
        totalSessions: sql<number>`COUNT(*)`,
      })
      .from(study_sessions)
      .where(eq(study_sessions.user_id, userId));

    const stats = statsResult[0] ?? { totalAnswered: 0, totalCorrect: 0, totalSessions: 0 };
<<<<<<< HEAD

    // Buscar datas das sessões para calcular streak e activityLog (últimos 90 dias)
=======
    const totalAnswered = Number(stats.totalAnswered);
    const totalCorrect  = Number(stats.totalCorrect);
    const totalSessions = Number(stats.totalSessions);
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    // Sessions last 90 days for streak + activityLog
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
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
<<<<<<< HEAD
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
=======
      .where(sql`${study_sessions.user_id} = ${userId} AND ${study_sessions.session_date} >= ${ninetyDaysAgoStr}`);

    const activityMap = new Map<string, { questionsAnswered: number; correctAnswers: number; sessions: number }>();
    for (const s of sessionsResult) {
      const ex = activityMap.get(s.session_date);
      if (ex) { ex.questionsAnswered += s.questions_answered; ex.correctAnswers += s.correct_answers; ex.sessions += 1; }
      else activityMap.set(s.session_date, { questionsAnswered: s.questions_answered, correctAnswers: s.correct_answers, sessions: 1 });
    }

    const activityLog: { date: string; completed: boolean; chaptersCompletedToday: number; questionsAnswered: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const day = activityMap.get(dateStr);
      activityLog.push({ date: dateStr, completed: !!day && day.sessions > 0, chaptersCompletedToday: day?.sessions ?? 0, questionsAnswered: day?.questionsAnswered ?? 0 });
    }

    const streak = computeStreak(sessionsResult.map(s => s.session_date));

    // Weekly progress (last 7 days)
    const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weeklyProgress: { day: string; date: string; answered: number; correct: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const day = activityMap.get(dateStr);
      weeklyProgress.push({ day: DAYS[d.getUTCDay()], date: dateStr, answered: day?.questionsAnswered ?? 0, correct: day?.correctAnswers ?? 0 });
    }

    // Per-disciplina breakdown
    const byDisciplinaRaw = await db
      .select({
        disciplina: user_responses.disciplina,
        answered: sql<number>`COUNT(*)`,
        correct: sql<number>`SUM(${user_responses.acertou})`,
      })
      .from(user_responses)
      .where(sql`${user_responses.user_id} = ${userId} AND ${user_responses.disciplina} IS NOT NULL`)
      .groupBy(user_responses.disciplina)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(10);

    const byDisciplina = byDisciplinaRaw.map(r => ({
      disciplina: r.disciplina ?? 'Outros',
      answered: Number(r.answered),
      correct: Number(r.correct),
      accuracy: Number(r.answered) > 0 ? Math.round((Number(r.correct) / Number(r.answered)) * 100) : 0,
    }));

    // XP & Level — use stored value (updated by session endpoint), fallback to computed
    const storedXp = user.xp ?? 0;
    const levelInfo = computeLevel(storedXp);

    // Medals
    const medals = computeMedals({
      totalAnswered,
      totalCorrect,
      totalSessions,
      streak,
      level: levelInfo.level,
    });
    const unlockedMedals = medals.filter(m => m.unlocked);

    // Selos equipados (até 3) — para renderizar inline no header do perfil
    let equippedBadges: EquippedBadge[] = [];
    try {
      equippedBadges = await fetchEquippedBadges(userId);
    } catch (err) {
      console.warn('Falha ao buscar selos equipados (silenciado):', err);
    }

    // Notify newly unlocked medals
    const alreadyNotified = await db
      .select({ related_id: notifications.related_id })
      .from(notifications)
      .where(and(eq(notifications.user_id, userId), eq(notifications.type, 'achievement')));
    const notifiedIds = new Set(alreadyNotified.map(n => n.related_id));

    for (const medal of unlockedMedals) {
      if (!notifiedIds.has(medal.id)) {
        await createNotification({
          userId,
          type: 'achievement',
          title: `${medal.icon} Medalha desbloqueada: ${medal.label}`,
          body: `${medal.description} · ${medal.tier === 'platinum' ? '💎 Platina' : medal.tier === 'gold' ? '🥇 Ouro' : medal.tier === 'silver' ? '🥈 Prata' : '🥉 Bronze'}`,
          relatedId: medal.id,
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
        });
      }
    }

<<<<<<< HEAD
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
=======
    return NextResponse.json({
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
      id: user.id,
      nome: user.nome,
      email: user.email,
      foto_url: user.foto_url,
      username: user.username ?? user.nome ?? 'Concurseiro',
      bio: user.bio ?? null,
      birthday: user.birthday ?? null,
      location: user.location ?? null,
      avatar_id: user.avatar_id ?? 1,
<<<<<<< HEAD
      criado_em: user.criado_em,
=======
      equippedBorder: user.equipped_border ?? 'recruta',
      concursoSlug: user.selected_concurso_slug ?? null,
      criado_em: user.criado_em,
      // XP & Level
      xp: storedXp,
      level: levelInfo.level,
      levelName: levelInfo.name,
      levelColor: levelInfo.color,
      levelBg: levelInfo.bg,
      levelBorder: levelInfo.border,
      xpIntoLevel: levelInfo.xpIntoLevel,
      xpNeeded: levelInfo.xpNeeded,
      xpProgressPct: levelInfo.progressPct,
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
      // Stats
      totalQuestionsAnswered: totalAnswered,
      totalQuestionsCorrect: totalCorrect,
      totalSessions,
      accuracy,
      streak,
<<<<<<< HEAD
      // Achievements
      medals: unlockedCount,
      achievements,
      // Activity
      activityLog,
=======
      // Medals
      medals: unlockedMedals.length,
      totalMedals: medals.length,
      achievements: medals,  // keep compat key
      // Activity
      activityLog,
      byDisciplina,
      weeklyProgress,
      // Loadout — selos equipados pelo usuário (renderizados inline no header)
      equippedBadges,
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
    });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
