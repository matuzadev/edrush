import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { messages, friendships } from '@/db/schema';
import { and, eq, or, sql, desc } from 'drizzle-orm';

// GET /api/messages?with={otherUserId}&limit=50
// Retorna histórico de mensagens entre o usuário atual e o outro
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const otherId = req.nextUrl.searchParams.get('with');
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '50'), 200);

  if (!otherId) {
    return NextResponse.json({ error: 'Parâmetro "with" obrigatório' }, { status: 400 });
  }

  try {
    // Verifica amizade aceita (segurança: só conversa com amigos)
    const friendship = await db.query.friendships.findFirst({
      where: and(
        eq(friendships.status, 'accepted'),
        or(
          and(eq(friendships.requester_id, userId), eq(friendships.receiver_id, otherId)),
          and(eq(friendships.requester_id, otherId), eq(friendships.receiver_id, userId))
        )
      ),
    });
    if (!friendship) {
      return NextResponse.json({ error: 'Apenas amigos podem trocar mensagens' }, { status: 403 });
    }

    const rows = await db
      .select()
      .from(messages)
      .where(or(
        and(eq(messages.sender_id, userId), eq(messages.receiver_id, otherId)),
        and(eq(messages.sender_id, otherId), eq(messages.receiver_id, userId))
      ))
      .orderBy(desc(messages.criado_em))
      .limit(limit);

    return NextResponse.json({
      messages: rows.reverse().map(m => ({
        id: m.id,
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        type: m.type,
        content: m.content,
        payload: m.payload ? JSON.parse(m.payload) : null,
        read: m.read === 1,
        createdAt: m.criado_em,
        mine: m.sender_id === userId,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// POST /api/messages
// Body: { receiverId, content, type?, payload? }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  let body: {
    receiverId?: string;
    content?: string;
    type?: 'text' | 'result';
    payload?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const receiverId = body.receiverId?.trim();
  const content = body.content?.trim();
  const type = body.type === 'result' ? 'result' : 'text';

  if (!receiverId || !content) {
    return NextResponse.json({ error: 'receiverId e content obrigatórios' }, { status: 400 });
  }
  if (content.length > 2000) {
    return NextResponse.json({ error: 'Mensagem muito longa (máx 2000)' }, { status: 400 });
  }
  if (receiverId === userId) {
    return NextResponse.json({ error: 'Não pode enviar para si mesmo' }, { status: 400 });
  }

  try {
    const friendship = await db.query.friendships.findFirst({
      where: and(
        eq(friendships.status, 'accepted'),
        or(
          and(eq(friendships.requester_id, userId), eq(friendships.receiver_id, receiverId)),
          and(eq(friendships.requester_id, receiverId), eq(friendships.receiver_id, userId))
        )
      ),
    });
    if (!friendship) {
      return NextResponse.json({ error: 'Apenas amigos podem trocar mensagens' }, { status: 403 });
    }

    const now = new Date().toISOString();
    const inserted = await db.insert(messages).values({
      sender_id: userId,
      receiver_id: receiverId,
      type,
      content,
      payload: body.payload ? JSON.stringify(body.payload) : null,
      read: 0,
      criado_em: now,
    }).returning();

    const m = inserted[0];
    return NextResponse.json({
      message: {
        id: m.id,
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        type: m.type,
        content: m.content,
        payload: m.payload ? JSON.parse(m.payload) : null,
        read: false,
        createdAt: m.criado_em,
        mine: true,
      },
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
