import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { user_settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

const DEFAULTS = {
  display_name: null as string | null,
  notif_email: 1,
  notif_milestones: 1,
  notif_weekly: 1,
  pref_theme: 'dark' as 'dark' | 'light',
  pref_language: 'pt' as 'pt' | 'en',
  pref_daily_goal: 20,
  sound_enabled: 1,
  auto_play: 0,
  show_timer: 1,
  hard_mode: 0,
  compact_ui: 0,
};

function rowToJson(row: Record<string, unknown>) {
  return {
    displayName: row.display_name ?? null,
    notifications: {
      email: (row.notif_email ?? 1) === 1,
      milestones: (row.notif_milestones ?? 1) === 1,
      weekly: (row.notif_weekly ?? 1) === 1,
    },
    preferences: {
      theme: row.pref_theme ?? 'dark',
      language: row.pref_language ?? 'pt',
      dailyGoal: row.pref_daily_goal ?? 20,
    },
    soundEnabled: (row.sound_enabled ?? 1) === 1,
    autoPlay: (row.auto_play ?? 0) === 1,
    showTimer: (row.show_timer ?? 1) === 1,
    hardMode: (row.hard_mode ?? 0) === 1,
    compactUi: (row.compact_ui ?? 0) === 1,
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  try {
    const existing = await db.query.user_settings.findFirst({
      where: eq(user_settings.user_id, userId),
    });

    if (existing) return NextResponse.json(rowToJson(existing as Record<string, unknown>));

    // Cria com defaults na primeira vez
    const now = new Date().toISOString();
    await db.insert(user_settings).values({
      user_id: userId,
      ...DEFAULTS,
      criado_em: now,
      atualizado_em: now,
    });
    return NextResponse.json(rowToJson({ ...DEFAULTS }));
  } catch (error) {
    console.error('Erro ao buscar settings:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as any).id as string;

  let body: {
    displayName?: string | null;
    notifications?: { email?: boolean; milestones?: boolean; weekly?: boolean };
    preferences?: { theme?: 'dark' | 'light'; language?: 'pt' | 'en'; dailyGoal?: number };
    soundEnabled?: boolean;
    autoPlay?: boolean;
    showTimer?: boolean;
    hardMode?: boolean;
    compactUi?: boolean;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const updates: Record<string, unknown> = { atualizado_em: new Date().toISOString() };
  if (body.displayName !== undefined) updates.display_name = body.displayName;
  if (body.notifications?.email !== undefined) updates.notif_email = body.notifications.email ? 1 : 0;
  if (body.notifications?.milestones !== undefined) updates.notif_milestones = body.notifications.milestones ? 1 : 0;
  if (body.notifications?.weekly !== undefined) updates.notif_weekly = body.notifications.weekly ? 1 : 0;
  if (body.preferences?.theme !== undefined) updates.pref_theme = body.preferences.theme;
  if (body.preferences?.language !== undefined) updates.pref_language = body.preferences.language;
  if (body.preferences?.dailyGoal !== undefined) {
    const n = Number(body.preferences.dailyGoal);
    if (isNaN(n) || n < 1 || n > 500) {
      return NextResponse.json({ error: 'dailyGoal inválido (1-500)' }, { status: 400 });
    }
    updates.pref_daily_goal = n;
  }
  if (body.soundEnabled !== undefined) updates.sound_enabled = body.soundEnabled ? 1 : 0;
  if (body.autoPlay !== undefined) updates.auto_play = body.autoPlay ? 1 : 0;
  if (body.showTimer !== undefined) updates.show_timer = body.showTimer ? 1 : 0;
  if (body.hardMode !== undefined) updates.hard_mode = body.hardMode ? 1 : 0;
  if (body.compactUi !== undefined) updates.compact_ui = body.compactUi ? 1 : 0;

  try {
    const existing = await db.query.user_settings.findFirst({
      where: eq(user_settings.user_id, userId),
    });

    if (existing) {
      await db.update(user_settings).set(updates).where(eq(user_settings.user_id, userId));
    } else {
      const now = new Date().toISOString();
      await db.insert(user_settings).values({
        user_id: userId,
        ...DEFAULTS,
        ...(updates as typeof DEFAULTS & { atualizado_em: string }),
        criado_em: now,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao salvar settings:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
