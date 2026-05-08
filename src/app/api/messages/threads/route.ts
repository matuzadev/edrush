import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { friendships, users, messages } from '@/db/schema';
import { and, desc, eq, inArray, or, sql } from 'drizzle-orm';

// GET /api/messages/threads
// Retorna lista de conversas: cada amigo aceito com {lastMessage, unreadCount}
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  try {
    // 1) Lista amigos aceitos — Drizzle parametriza ${userId} via tagged template.
    const friendRows = await db
      .select({
        requester_id: friendships.requester_id,
        receiver_id: friendships.receiver_id,
      })
      .from(friendships)
      .where(
        and(
          eq(friendships.status, 'accepted'),
          or(eq(friendships.requester_id, userId), eq(friendships.receiver_id, userId)),
        ),
      );
    const friendIds = friendRows.map((r) =>
      r.requester_id === userId ? r.receiver_id : r.requester_id,
    );

    if (friendIds.length === 0) {
      return NextResponse.json({ threads: [], totalUnread: 0 });
    }

    // 2) Dados básicos de cada amigo — inArray (parametrizado).
    const friendUsers = await db
      .select({
        id: users.id,
        nome: users.nome,
        username: users.username,
        avatar_id: users.avatar_id,
        xp: users.xp,
        level: users.level,
      })
      .from(users)
      .where(inArray(users.id, friendIds));

    const userMap = new Map<string, { id: string; nome: string | null; username: string | null; avatar_id: number; xp: number; level: number }>();
    for (const row of friendUsers) {
      userMap.set(row.id, {
        id: row.id,
        nome: row.nome,
        username: row.username,
        avatar_id: row.avatar_id ?? 1,
        xp: row.xp ?? 0,
        level: row.level ?? 1,
      });
    }

    // 3) Última mensagem por par + unread count
    // Para cada amigo, buscar última msg (em qualquer direção) e count de não lidas (recebidas e não lidas)
    type Thread = {
      friendId: string;
      nome: string | null;
      username: string | null;
      avatar_id: number;
      level: number;
      unreadCount: number;
      lastMessage: { id: number; content: string; type: string; mine: boolean; createdAt: string } | null;
    };
    const threads: Thread[] = [];
    let totalUnread = 0;

    for (const friendId of friendIds) {
      // Última mensagem entre os dois — Drizzle (parametrizado).
      const lastMsgRows = await db
        .select({
          id: messages.id,
          sender_id: messages.sender_id,
          receiver_id: messages.receiver_id,
          type: messages.type,
          content: messages.content,
          payload: messages.payload,
          read: messages.read,
          criado_em: messages.criado_em,
        })
        .from(messages)
        .where(
          or(
            and(eq(messages.sender_id, userId), eq(messages.receiver_id, friendId)),
            and(eq(messages.sender_id, friendId), eq(messages.receiver_id, userId)),
          ),
        )
        .orderBy(desc(messages.criado_em))
        .limit(1);
      const lastMsg = lastMsgRows[0] ?? null;

      // Count de não lidas (apenas as recebidas pelo usuário corrente).
      const unreadRs = await db
        .select({ n: sql<number>`COUNT(*)` })
        .from(messages)
        .where(
          and(
            eq(messages.sender_id, friendId),
            eq(messages.receiver_id, userId),
            eq(messages.read, 0),
          ),
        );
      const unreadCount = Number(unreadRs[0]?.n ?? 0);
      totalUnread += unreadCount;

      const u = userMap.get(friendId);
      if (!u) continue;

      threads.push({
        friendId,
        nome: u.nome,
        username: u.username,
        avatar_id: u.avatar_id,
        level: u.level,
        unreadCount,
        lastMessage: lastMsg ? {
          id: lastMsg.id,
          content: lastMsg.content,
          type: lastMsg.type,
          mine: lastMsg.sender_id === userId,
          createdAt: lastMsg.criado_em,
        } : null,
      });
    }

    // Ordenar por última msg (mais recente primeiro), threads sem msg vão por último
    threads.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return b.lastMessage.createdAt.localeCompare(a.lastMessage.createdAt);
    });

    return NextResponse.json({ threads, totalUnread });
  } catch (error) {
    console.error('Erro ao buscar threads:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
