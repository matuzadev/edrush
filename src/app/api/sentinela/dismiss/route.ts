import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { user_sentinela } from '@/db/schema';
import { eq } from 'drizzle-orm';

// POST /api/sentinela/dismiss
// Body: { messageId: string } — adiciona ao shown_messages para não repetir
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  let body: { messageId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }
  const messageId = body.messageId?.trim();
  if (!messageId) {
    return NextResponse.json({ error: 'messageId obrigatório' }, { status: 400 });
  }

  const now = new Date().toISOString();

  try {
    const row = await db.query.user_sentinela.findFirst({
      where: eq(user_sentinela.user_id, userId),
    });
    if (!row) return NextResponse.json({ ok: true });

    const shown: string[] = JSON.parse(row.shown_messages || '[]');
    if (!shown.includes(messageId)) shown.push(messageId);
    // Limita a 200 IDs para não crescer infinitamente
    const trimmed = shown.slice(-200);

    await db.update(user_sentinela)
      .set({
        shown_messages: JSON.stringify(trimmed),
        last_seen_at: now,
        total_interactions: (row.total_interactions ?? 0) + 1,
        atualizado_em: now,
      })
      .where(eq(user_sentinela.user_id, userId));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao dismissar Sentinela:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
