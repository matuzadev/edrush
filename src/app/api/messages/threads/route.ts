import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

// GET /api/messages/threads
// Retorna lista de conversas: cada amigo aceito com {lastMessage, unreadCount}
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  try {
    // 1) Lista amigos aceitos
    const friendsRaw = await db.run(sql`
      SELECT
        CASE WHEN requester_id = ${userId} THEN receiver_id ELSE requester_id END AS friend_id
      FROM friendships
      WHERE status = 'accepted'
        AND (requester_id = ${userId} OR receiver_id = ${userId})
    `);
    const friendIds = (friendsRaw.rows as { friend_id: string }[]).map(r => r.friend_id);

    if (friendIds.length === 0) {
      return NextResponse.json({ threads: [], totalUnread: 0 });
    }

    // 2) Dados básicos de cada amigo
    const usersRaw = await db.run(sql.raw(
      `SELECT id, nome, username, avatar_id, xp, level FROM users WHERE id IN (${friendIds.map(id => `'${id.replace(/'/g, "''")}'`).join(', ')})`
    ));
    const userMap = new Map<string, { id: string; nome: string | null; username: string | null; avatar_id: number; xp: number; level: number }>();
    for (const row of usersRaw.rows as { id: string; nome: string | null; username: string | null; avatar_id: number | null; xp: number | null; level: number | null }[]) {
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
    const threads = [];
    let totalUnread = 0;

    for (const friendId of friendIds) {
      const lastMsgRaw = await db.run(sql`
        SELECT id, sender_id, receiver_id, type, content, payload, read, criado_em
        FROM messages
        WHERE (sender_id = ${userId} AND receiver_id = ${friendId})
           OR (sender_id = ${friendId} AND receiver_id = ${userId})
        ORDER BY criado_em DESC
        LIMIT 1
      `);
      const lastMsg = (lastMsgRaw.rows[0] ?? null) as null | {
        id: number; sender_id: string; receiver_id: string; type: string;
        content: string; payload: string | null; read: number; criado_em: string;
      };

      const unreadRaw = await db.run(sql`
        SELECT COUNT(*) AS n
        FROM messages
        WHERE sender_id = ${friendId} AND receiver_id = ${userId} AND read = 0
      `);
      const unreadCount = Number((unreadRaw.rows[0] as { n: number })?.n ?? 0);
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
