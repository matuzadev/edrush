import 'server-only';
import { db, lsClient } from '@/lib/db';
import { users, study_sessions, user_responses } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { computeLevel, computeMedals, type Medal } from '@/lib/levels';

/**
 * Camada de dados do perfil público.
 *
 * Extraída da rota /api/profile/[username] para poder ser chamada DIRETAMENTE
 * pelo server component da página (sem um round-trip HTTP para a própria API).
 * A rota agora é apenas um wrapper fino sobre `getProfileData`.
 */

export interface ItemRef {
  id: string;
  slug: string;
  name: string;
  rarity: string;
  category: string;
  metadata: unknown;
}

export interface ProfileData {
  id: string;
  username: string;
  nome: string | null;
  foto_url: string | null;
  avatar_id: number;
  isCeo: boolean;
  bio: string | null;
  location: string | null;
  criado_em: string;
  equippedBorder: string;
  concursoSlug: string | null;
  xp: number;
  level: number;
  levelName: string;
  levelColor: string;
  levelBg: string;
  levelBorder: string;
  xpIntoLevel: number;
  xpNeeded: number;
  xpProgressPct: number;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  totalSessions: number;
  accuracy: number;
  streak: number;
  medals: number;
  totalMedals: number;
  achievements: Medal[];
  activityLog: { date: string; questionsAnswered: number }[];
  weeklyProgress: { day: string; date: string; answered: number; correct: number }[];
  byDisciplina: { disciplina: string; answered: number; correct: number; accuracy: number }[];
  loadout: { border: ItemRef | null; avatar: ItemRef | null; badges: ItemRef[] };
  inventory: Array<{ category: string; items: ItemRef[] }>;
  expBuff: { multiplier: number; expiresAt: string } | null;
}

interface InventoryRow {
  id: string;
  slug: string;
  name: string;
  rarity: string;
  category: string;
  metadata: string | null;
  expires_at: string | null;
}

function parseMeta(raw: string | null): unknown {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function rowToItemRef(r: { id: string; slug: string; name: string; rarity: string; category: string; metadata: string | null }): ItemRef {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    rarity: r.rarity,
    category: r.category,
    metadata: parseMeta(r.metadata),
  };
}

async function fetchProfileShowcase(userId: string): Promise<{
  loadout: { border: ItemRef | null; avatar: ItemRef | null; badges: ItemRef[] };
  inventory: Array<{ category: string; items: ItemRef[] }>;
  expBuff: { multiplier: number; expiresAt: string } | null;
}> {
  const now = new Date().toISOString();
  const [loadoutRs, invRs, buffRs] = await Promise.all([
    lsClient.execute({
      sql: `SELECT border_item_id, avatar_item_id, equipped_badge_ids
            FROM user_profile_loadout WHERE user_id = ?`,
      args: [userId],
    }),
    lsClient.execute({
      sql: `SELECT si.id, si.slug, si.name, si.rarity, si.category, si.metadata, ui.expires_at
            FROM user_inventory ui
            JOIN store_items si ON si.id = ui.store_item_id
            WHERE ui.user_id = ?
              AND (ui.expires_at IS NULL OR ui.expires_at > ?)
            ORDER BY si.category, si.rarity DESC`,
      args: [userId, now],
    }),
    lsClient.execute({
      sql: 'SELECT exp_buff_multiplier, exp_buff_expires_at FROM users WHERE id = ?',
      args: [userId],
    }),
  ]);

  let borderId: string | null = null;
  let avatarId: string | null = null;
  let badgeIds: string[] = [];
  if (loadoutRs.rows.length > 0) {
    const r = loadoutRs.rows[0] as unknown as {
      border_item_id: string | null;
      avatar_item_id: string | null;
      equipped_badge_ids: string | null;
    };
    borderId = r.border_item_id;
    avatarId = r.avatar_item_id;
    if (r.equipped_badge_ids) {
      try {
        const arr = JSON.parse(r.equipped_badge_ids);
        if (Array.isArray(arr)) badgeIds = arr.filter((x): x is string => typeof x === 'string');
      } catch { /* ignora */ }
    }
  }

  const allItems: ItemRef[] = (invRs.rows as unknown as InventoryRow[]).map(rowToItemRef);
  const itemsById = new Map(allItems.map((it) => [it.id, it]));

  const grouped = new Map<string, ItemRef[]>();
  for (const it of allItems) {
    const arr = grouped.get(it.category) ?? [];
    arr.push(it);
    grouped.set(it.category, arr);
  }
  const inventory = [...grouped.entries()].map(([category, items]) => ({ category, items }));

  const border = borderId ? itemsById.get(borderId) ?? null : null;
  const avatar = avatarId ? itemsById.get(avatarId) ?? null : null;
  const badges = badgeIds.map((id) => itemsById.get(id)).filter((b): b is ItemRef => !!b);

  let expBuff: { multiplier: number; expiresAt: string } | null = null;
  if (buffRs.rows.length > 0) {
    const b = buffRs.rows[0] as unknown as {
      exp_buff_multiplier: number;
      exp_buff_expires_at: string | null;
    };
    if (b.exp_buff_expires_at && new Date(b.exp_buff_expires_at).getTime() > Date.now()) {
      expBuff = {
        multiplier: Number(b.exp_buff_multiplier ?? 1),
        expiresAt: b.exp_buff_expires_at,
      };
    }
  }

  return { loadout: { border, avatar, badges }, inventory, expBuff };
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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

/**
 * Busca todos os dados do perfil público de um usuário (por username ou nome).
 * Retorna `null` se o usuário não existir.
 */
export async function getProfileData(username: string): Promise<ProfileData | null> {
  if (!username) return null;

  const user = await db.query.users.findFirst({
    where: sql`LOWER(${users.username}) = LOWER(${username}) OR LOWER(${users.nome}) = LOWER(${username})`,
  });
  if (!user) return null;

  const ninetyAgo = new Date(); ninetyAgo.setDate(ninetyAgo.getDate() - 90);
  const ninetyAgoStr = ninetyAgo.toISOString().split('T')[0];

  // Todas as queries dependentes do user.id em paralelo.
  const [statsRes, sessions, byDisciplinaRaw, showcase] = await Promise.all([
    db
      .select({
        totalAnswered: sql<number>`COALESCE(SUM(questions_answered), 0)`,
        totalCorrect:  sql<number>`COALESCE(SUM(correct_answers), 0)`,
        totalSessions: sql<number>`COUNT(*)`,
      })
      .from(study_sessions)
      .where(eq(study_sessions.user_id, user.id)),
    db
      .select({ session_date: study_sessions.session_date, questions_answered: study_sessions.questions_answered, correct_answers: study_sessions.correct_answers })
      .from(study_sessions)
      .where(sql`${study_sessions.user_id} = ${user.id} AND ${study_sessions.session_date} >= ${ninetyAgoStr}`),
    db
      .select({
        disciplina: user_responses.disciplina,
        answered:   sql<number>`COUNT(*)`,
        correct:    sql<number>`SUM(${user_responses.acertou})`,
      })
      .from(user_responses)
      .where(sql`${user_responses.user_id} = ${user.id} AND ${user_responses.disciplina} IS NOT NULL`)
      .groupBy(user_responses.disciplina)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(6),
    fetchProfileShowcase(user.id).catch((err) => {
      console.warn('Falha ao buscar vitrine do perfil (silenciado):', err);
      return {
        loadout: { border: null as ItemRef | null, avatar: null as ItemRef | null, badges: [] as ItemRef[] },
        inventory: [] as Array<{ category: string; items: ItemRef[] }>,
        expBuff: null as { multiplier: number; expiresAt: string } | null,
      };
    }),
  ]);

  const stats = statsRes[0] ?? { totalAnswered: 0, totalCorrect: 0, totalSessions: 0 };
  const totalAnswered = Number(stats.totalAnswered);
  const totalCorrect  = Number(stats.totalCorrect);
  const totalSessions = Number(stats.totalSessions);
  const accuracy      = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

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
  const isCeo = user.email === 'matheus@gmail.com';

  return {
    id: user.id,
    username: user.username ?? user.nome ?? 'Concurseiro',
    nome: user.nome,
    foto_url: user.foto_url ?? null,
    avatar_id: user.avatar_id ?? 1,
    isCeo,
    bio: user.bio ?? null,
    location: user.location ?? null,
    criado_em: user.criado_em,
    equippedBorder: user.equipped_border ?? 'recruta',
    concursoSlug: user.selected_concurso_slug ?? null,
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
    loadout: showcase.loadout,
    inventory: showcase.inventory,
    expBuff: showcase.expBuff,
  };
}
