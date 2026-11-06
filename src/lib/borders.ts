import { db, lsClient } from '@/lib/db';
import { user_borders, users, study_sessions, notifications } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { computeLevel, computeMedals } from '@/lib/levels';
import { isFounderEmail } from '@/lib/welcome-rewards';
import { BORDERS, BORDER_BY_SLUG, meetsCriteria, canUserAccessBorder, type UserBorderStats, type BorderDef } from '@/data/borders';

export type { UserBorderStats } from '@/data/borders';

// Calcula UserBorderStats reais do usuário (a partir do DB)
export async function getUserBorderStats(userId: string): Promise<UserBorderStats> {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) {
    return { level: 1, streak: 0, totalAnswered: 0, accuracy: 0, totalSessions: 0, medals: 0 };
  }

  const aggRes = await db
    .select({
      totalAnswered: sql<number>`COALESCE(SUM(questions_answered), 0)`,
      totalCorrect:  sql<number>`COALESCE(SUM(correct_answers), 0)`,
      totalSessions: sql<number>`COUNT(*)`,
    })
    .from(study_sessions)
    .where(eq(study_sessions.user_id, userId));

  const agg = aggRes[0] ?? { totalAnswered: 0, totalCorrect: 0, totalSessions: 0 };
  const totalAnswered = Number(agg.totalAnswered);
  const totalCorrect  = Number(agg.totalCorrect);
  const totalSessions = Number(agg.totalSessions);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Streak — últimos 90 dias
  const ninetyAgo = new Date(); ninetyAgo.setDate(ninetyAgo.getDate() - 90);
  const ninetyAgoStr = ninetyAgo.toISOString().split('T')[0];
  const sessions = await db
    .select({ session_date: study_sessions.session_date })
    .from(study_sessions)
    .where(sql`${study_sessions.user_id} = ${userId} AND ${study_sessions.session_date} >= ${ninetyAgoStr}`);

  const dates = [...new Set(sessions.map(s => s.session_date))].sort((a, b) => (a > b ? -1 : 1));
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let current = today;
  for (const d of dates) {
    if (d === current) {
      streak++;
      const prev = new Date(current + 'T00:00:00Z');
      prev.setUTCDate(prev.getUTCDate() - 1);
      current = prev.toISOString().split('T')[0];
    } else if (d < current) break;
  }

  const levelInfo = computeLevel(user.xp ?? 0);
  const medalsArr = computeMedals({ totalAnswered, totalCorrect, totalSessions, streak, level: levelInfo.level });
  const medals = medalsArr.filter(m => m.unlocked).length;

  return {
    level: levelInfo.level,
    streak,
    totalAnswered,
    accuracy,
    totalSessions,
    medals,
  };
}

// Lista bordas já desbloqueadas pelo usuário
export async function getUnlockedBorderSlugs(userId: string): Promise<Set<string>> {
  const rows = await db
    .select({ slug: user_borders.border_slug })
    .from(user_borders)
    .where(eq(user_borders.user_id, userId));
  return new Set(rows.map(r => r.slug));
}

// Verifica e desbloqueia novas bordas baseado nos stats atuais.
// Retorna lista de bordas recém-desbloqueadas (para notificar o frontend).
export async function checkAndUnlockBorders(userId: string): Promise<BorderDef[]> {
  const userRow = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { email: true },
  });
  const userEmail = userRow?.email ?? null;
  const isFounder = userEmail ? isFounderEmail(userEmail) : false;

  const [stats, unlocked] = await Promise.all([
    getUserBorderStats(userId),
    getUnlockedBorderSlugs(userId),
  ]);

  const newlyUnlocked: BorderDef[] = [];
  const now = new Date().toISOString();

  for (const border of BORDERS) {
    if (unlocked.has(border.slug)) continue;

    // Bordas exclusivas são autorizadas no servidor, sem expor o e-mail na resposta.
    if (border.exclusive) {
      if (!canUserAccessBorder(border, isFounder)) continue;
      // se autorizado, desbloqueio imediato
    } else if (!meetsCriteria(border, stats)) {
      continue;
    }

    try {
      await db.insert(user_borders).values({
        user_id: userId,
        border_slug: border.slug,
        unlocked_at: now,
      });
      newlyUnlocked.push(border);

      // Notifica achievement (idempotente — não duplica se já existe)
      try {
        const existing = await db
          .select({ id: notifications.id })
          .from(notifications)
          .where(and(
            eq(notifications.user_id, userId),
            eq(notifications.type, 'border_unlocked'),
            eq(notifications.related_id, border.slug),
          ))
          .limit(1);

        if (existing.length === 0) {
          await db.insert(notifications).values({
            user_id: userId,
            type: 'border_unlocked',
            title: `🎀 Nova borda desbloqueada: ${border.name}`,
            body: border.description,
            related_id: border.slug,
            read: 0,
            criado_em: now,
          });
        }
      } catch { /* falha silenciosa de notification não bloqueia o unlock */ }
    } catch {
      // unique constraint — outra concurrent unlock já criou. ignorar.
    }
  }

  return newlyUnlocked;
}

// Busca a borda equipada de um usuário (com fallback pra 'recruta')
export async function getEquippedBorderSlug(userId: string): Promise<string> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { equipped_border: true },
  });
  return user?.equipped_border ?? 'recruta';
}

// Equipa uma borda (verifica se está desbloqueada antes)
export async function equipBorder(userId: string, slug: string): Promise<{ ok: boolean; error?: string }> {
  const border = BORDER_BY_SLUG[slug];
  if (!border) {
    return { ok: false, error: 'Borda inexistente' };
  }

  // Bordas exclusivas: valida a identidade do fundador somente no servidor.
  if (border.exclusive) {
    const userRow = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { email: true },
    });
    const isFounder = userRow?.email ? isFounderEmail(userRow.email) : false;
    if (!canUserAccessBorder(border, isFounder)) {
      return { ok: false, error: 'Esta borda é exclusiva' };
    }
  }

  // 'recruta' é sempre permitida (default de todos); demais precisam estar desbloqueadas
  if (slug !== 'recruta') {
    const unlocked = await getUnlockedBorderSlugs(userId);
    if (!unlocked.has(slug)) {
      return { ok: false, error: 'Borda ainda não desbloqueada' };
    }
  }
  try {
    await db.update(users)
      .set({ equipped_border: slug, atualizado_em: new Date().toISOString() })
      .where(eq(users.id, userId));
    await lsClient.execute({
      sql: 'UPDATE user_profile_loadout SET border_item_id = NULL, updated_at = ? WHERE user_id = ?',
      args: [new Date().toISOString(), userId],
    });
    await lsClient.execute({
      sql: `UPDATE user_inventory
            SET is_equipped = 0
            WHERE user_id = ?
              AND store_item_id IN (
                SELECT id FROM store_items WHERE category = 'borda_perfil'
              )`,
      args: [userId],
    });
    return { ok: true };
  } catch (e) {
    console.error('Erro ao equipar borda:', e);
    return { ok: false, error: 'Erro interno' };
  }
}
