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
};

function rowToJson(row: any) {
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

    if (existing) return NextResponse.json(rowToJson(existing));

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

  try {
    // Upsert manual: tenta UPDATE; se 0 linhas, INSERT
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
        ...(updates as any),
        criado_em: now,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao salvar settings:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
