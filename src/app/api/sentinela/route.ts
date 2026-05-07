import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { user_sentinela, study_sessions, users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getUserBorderStats } from '@/lib/borders';
import { computeMood } from '@/lib/sentinela';
import { pickMessage, MESSAGES, type SentinelaMood } from '@/data/sentinelaMessages';

interface SentinelaRow {
  user_id: string;
  last_mood: string;
  last_message_id: string | null;
  last_seen_at: string | null;
  last_visit_at: string | null;
  total_interactions: number;
  muted: number;
  hidden: number;
  shown_messages: string;
  preferences: string;
  criado_em: string;
  atualizado_em: string;
}

async function ensureRow(userId: string, now: string): Promise<SentinelaRow> {
  const existing = await db.query.user_sentinela.findFirst({
    where: eq(user_sentinela.user_id, userId),
  });
  if (existing) return existing as SentinelaRow;

  await db.insert(user_sentinela).values({
    user_id: userId,
    last_mood: 'awake',
    last_message_id: null,
    last_seen_at: null,
    last_visit_at: null,
    total_interactions: 0,
    muted: 0,
    hidden: 0,
    shown_messages: '[]',
    preferences: '{}',
    criado_em: now,
    atualizado_em: now,
  });
  return {
    user_id: userId, last_mood: 'awake', last_message_id: null, last_seen_at: null,
    last_visit_at: null, total_interactions: 0, muted: 0, hidden: 0,
    shown_messages: '[]', preferences: '{}', criado_em: now, atualizado_em: now,
  };
}

// GET /api/sentinela?path=/dashboard/study
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const pathname = req.nextUrl.searchParams.get('path') ?? null;

  const now = new Date().toISOString();
  const today = now.split('T')[0];

  try {
    const row = await ensureRow(userId, now);

    // Se hidden, retorna mínimo
    if (row.hidden === 1) {
      return NextResponse.json({ hidden: true });
    }

    // Stats agregados
    const stats = await getUserBorderStats(userId);

    // Última sessão (pra calcular hoursSinceLastSession)
    const lastSessionRes = await db
      .select({ d: study_sessions.session_date, c: study_sessions.criado_em })
      .from(study_sessions)
      .where(eq(study_sessions.user_id, userId))
      .orderBy(sql`${study_sessions.criado_em} DESC`)
      .limit(1);
    const lastSession = lastSessionRes[0];
    const hoursSinceLastSession = lastSession
      ? (Date.now() - new Date(lastSession.c).getTime()) / 36e5
      : Infinity;

    // Accuracy recente (últimas 5 sessões)
    const recentRes = await db
      .select({
        answered: study_sessions.questions_answered,
        correct: study_sessions.correct_answers,
      })
      .from(study_sessions)
      .where(eq(study_sessions.user_id, userId))
      .orderBy(sql`${study_sessions.criado_em} DESC`)
      .limit(5);
    const totalRec = recentRes.reduce((s, r) => s + r.answered, 0);
    const correctRec = recentRes.reduce((s, r) => s + r.correct, 0);
    const recentAccuracy = totalRec > 0 ? Math.round((correctRec / totalRec) * 100) : stats.accuracy;

    // Primeiro acesso do dia (compara com last_visit_at)
    const lastVisitDate = row.last_visit_at?.split('T')[0] ?? null;
    const isFirstVisitToday = lastVisitDate !== today;

    // Detecta level-up recente: notification de 'achievement' nas últimas 2h
    const userRow = await db.query.users.findFirst({ where: eq(users.id, userId), columns: { atualizado_em: true } });
    const recentlyUpdated = userRow ? (Date.now() - new Date(userRow.atualizado_em).getTime()) < 2 * 36e5 : false;

    const mood: SentinelaMood = computeMood({
      level: stats.level,
      streak: stats.streak,
      totalAnswered: stats.totalAnswered,
      accuracy: stats.accuracy,
      totalSessions: stats.totalSessions,
      recentAccuracy,
      hoursSinceLastSession,
      isFirstVisitToday,
      pathname: pathname ?? undefined,
      leveledUpRecently: recentlyUpdated && stats.level > 1,
    });

    // Escolhe mensagem
    const shown: string[] = JSON.parse(row.shown_messages || '[]');
    const message = pickMessage(mood, shown);

    // Atualiza last_visit_at + last_mood (não marca a msg como vista ainda — isso é via dismiss)
    await db.update(user_sentinela)
      .set({
        last_mood: mood,
        last_message_id: message.id,
        last_visit_at: now,
        atualizado_em: now,
      })
      .where(eq(user_sentinela.user_id, userId));

    return NextResponse.json({
      hidden: false,
      muted: row.muted === 1,
      mood,
      message,
      stats: {
        level: stats.level,
        streak: stats.streak,
        accuracy: stats.accuracy,
      },
      totalAvailable: MESSAGES[mood].length,
      totalSeen: shown.filter(id => MESSAGES[mood].some(m => m.id === id)).length,
    });
  } catch (error) {
    console.error('Erro no Sentinela:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// PATCH /api/sentinela
// Body: { muted?: boolean, hidden?: boolean, preferences?: object }
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  let body: { muted?: boolean; hidden?: boolean; preferences?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const now = new Date().toISOString();
  await ensureRow(userId, now);

  const updates: Record<string, unknown> = { atualizado_em: now };
  if (typeof body.muted === 'boolean') updates.muted = body.muted ? 1 : 0;
  if (typeof body.hidden === 'boolean') updates.hidden = body.hidden ? 1 : 0;
  if (body.preferences && typeof body.preferences === 'object') {
    updates.preferences = JSON.stringify(body.preferences);
  }

  try {
    await db.update(user_sentinela).set(updates).where(eq(user_sentinela.user_id, userId));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao atualizar Sentinela:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
