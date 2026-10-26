import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db, lsClient } from '@/lib/db';
import { users, study_sessions, notifications, user_responses } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { createNotification } from '@/lib/notifications';
import { computeLevel, computeMedals, xpForSession } from '@/lib/levels';

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
}

function computeStreak(sessionDates: string[]): number {
  if (sessionDates.length === 0) return 0;
  const unique = [...new Set(sessionDates)].sort((a, b) => (a > b ? -1 : 1));
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let current = today;
  for (const date of unique) {
    if (date === current) {
      streak++;
      const d = new Date(current + 'T00:00:00Z');
      d.setUTCDate(d.getUTCDate() - 1);
      current = d.toISOString().split('T')[0];
    } else if (date < current) {
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
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const ninetyDaysAgoStr = ninetyDaysAgo.toISOString().split('T')[0];

    // Todas as queries independentes em paralelo — antes eram 7+ round-trips
    // sequenciais ao Turso. O cliente libsql multiplexa, então queries
    // independentes são bem mais rápidas em batch concorrente.
    const [
      user,
      statsResult,
      sessionsResult,
      byDisciplinaRaw,
      platformTotalRs,
      platformByDiscRs,
      equippedBadgesResult,
      alreadyNotified,
    ] = await Promise.all([
      db.query.users.findFirst({ where: eq(users.id, userId) }),
      db
        .select({
          totalAnswered: sql<number>`COALESCE(SUM(questions_answered), 0)`,
          totalCorrect: sql<number>`COALESCE(SUM(correct_answers), 0)`,
          totalSessions: sql<number>`COUNT(*)`,
        })
        .from(study_sessions)
        .where(eq(study_sessions.user_id, userId)),
      db
        .select({
          session_date: study_sessions.session_date,
          questions_answered: study_sessions.questions_answered,
          correct_answers: study_sessions.correct_answers,
        })
        .from(study_sessions)
        .where(sql`${study_sessions.user_id} = ${userId} AND ${study_sessions.session_date} >= ${ninetyDaysAgoStr}`),
      db
        .select({
          disciplina: user_responses.disciplina,
          answered: sql<number>`COUNT(*)`,
          correct: sql<number>`SUM(${user_responses.acertou})`,
        })
        .from(user_responses)
        .where(sql`${user_responses.user_id} = ${userId} AND ${user_responses.disciplina} IS NOT NULL`)
        .groupBy(user_responses.disciplina)
        .orderBy(sql`COUNT(*) DESC`)
        .limit(10),
      lsClient.execute('SELECT COUNT(*) AS n FROM questions').catch(() => null),
      lsClient
        .execute('SELECT disciplina, COUNT(*) AS n FROM questions GROUP BY disciplina ORDER BY n DESC')
        .catch(() => null),
      fetchEquippedBadges(userId).catch(() => [] as EquippedBadge[]),
      db
        .select({ related_id: notifications.related_id })
        .from(notifications)
        .where(and(eq(notifications.user_id, userId), eq(notifications.type, 'achievement'))),
    ]);

    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const stats = statsResult[0] ?? { totalAnswered: 0, totalCorrect: 0, totalSessions: 0 };
    const totalAnswered = Number(stats.totalAnswered);
    const totalCorrect  = Number(stats.totalCorrect);
    const totalSessions = Number(stats.totalSessions);
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

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

    const byDisciplina = byDisciplinaRaw.map(r => ({
      disciplina: r.disciplina ?? 'Outros',
      answered: Number(r.answered),
      correct: Number(r.correct),
      accuracy: Number(r.answered) > 0 ? Math.round((Number(r.correct) / Number(r.answered)) * 100) : 0,
    }));

    const totalPlatformQuestions = platformTotalRs
      ? Number((platformTotalRs.rows[0] as unknown as { n: number })?.n ?? 0)
      : 0;
    const platformQuestionsByDisciplina = platformByDiscRs
      ? platformByDiscRs.rows.map((row) => {
          const r = row as unknown as { disciplina: string | null; n: number };
          return { disciplina: r.disciplina ?? 'Outros', total: Number(r.n) || 0 };
        })
      : [];

    const distinctSubjectsTouched = byDisciplina.length;

    const storedXp = user.xp ?? 0;
    const levelInfo = computeLevel(storedXp);

    const medals = computeMedals({
      totalAnswered,
      totalCorrect,
      totalSessions,
      streak,
      level: levelInfo.level,
      distinctSubjectsTouched,
      accuracy,
    });
    const unlockedMedals = medals.filter(m => m.unlocked);

    const equippedBadges = equippedBadgesResult;

    // Disparar notificações de medalhas em paralelo. Antes era um for-await
    // sequencial — N writes serializados ao Turso para um endpoint de leitura.
    const notifiedIds = new Set(alreadyNotified.map(n => n.related_id));
    const newMedalsToNotify = unlockedMedals.filter(m => !notifiedIds.has(m.id));
    if (newMedalsToNotify.length > 0) {
      await Promise.all(
        newMedalsToNotify.map((medal) =>
          createNotification({
            userId,
            type: 'achievement',
            title: `${medal.icon} Medalha desbloqueada: ${medal.label}`,
            body: `${medal.description} · ${medal.tier === 'platinum' ? '💎 Platina' : medal.tier === 'gold' ? '🥇 Ouro' : medal.tier === 'silver' ? '🥈 Prata' : '🥉 Bronze'}`,
            relatedId: medal.id,
          }).catch((err) => console.warn('createNotification falhou:', err))
        )
      );
    }

    return NextResponse.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      foto_url: user.foto_url,
      username: user.username ?? user.nome ?? 'Concurseiro',
      bio: user.bio ?? null,
      birthday: user.birthday ?? null,
      location: user.location ?? null,
      avatar_id: user.avatar_id ?? 1,
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
      // Stats do usuário
      totalQuestionsAnswered: totalAnswered,
      totalQuestionsCorrect: totalCorrect,
      totalSessions,
      accuracy,
      streak,
      distinctSubjectsTouched,
      // Stats da plataforma (banco inteiro)
      totalPlatformQuestions,
      platformQuestionsByDisciplina,
      coveragePct: totalPlatformQuestions > 0
        ? Math.round((totalAnswered / totalPlatformQuestions) * 1000) / 10  // uma casa decimal
        : 0,
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
    });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
