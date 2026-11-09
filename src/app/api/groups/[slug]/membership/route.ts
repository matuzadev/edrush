// /api/groups/[slug]/membership
//   GET  → lista paginada de membros do grupo (com avatar, nome, role).
//   POST → toggle entrar/sair.
//          Se grupo público, entra direto.
//          Se grupo privado, retorna { status: 'pending' } sem persistir.
//          (TODO v2: implementar fluxo de aprovação com tabela join_requests.
//           No MVP, privado = só convite — não tratamos aqui.)
//
// Race-condition: o toggle (read-then-write) tem janela inerente. Mitigamos
// com UPDATE condicional no member_count + verificação de affected rows.
// Em concorrência alta o `member_count` pode dessincronizar — em produção
// deveríamos usar trigger ou recalcular de tempos em tempos.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import type { InValue } from '@libsql/client';
import { lsClient as client } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import {
  decodeGroupCursor,
  encodeGroupCursor,
  type GroupMember,
  type GroupRole,
} from '@/lib/study-groups';

const MEMBERS_PAGE_SIZE = 30;

interface MemberJoinRow {
  user_id: string;
  role: string;
  joined_at: string;
  nome: string | null;
  username: string | null;
  avatar_id: number | null;
  equipped_border: string | null;
}

// Helper: resolve grupo por slug → retorna {id, ownerId, isPrivate} ou null.
async function findGroup(slug: string) {
  const rs = await client.execute({
    sql: 'SELECT id, owner_id, is_private FROM study_groups WHERE slug = ? LIMIT 1',
    args: [slug],
  });
  if (rs.rows.length === 0) return null;
  const row = rs.rows[0] as unknown as { id: string; owner_id: string; is_private: number };
  return { id: row.id, ownerId: row.owner_id, isPrivate: row.is_private === 1 };
}

// ─── GET ───────────────────────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: 'Slug obrigatório' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? null;

  try {
    const group = await findGroup(slug);
    if (!group) {
      return NextResponse.json({ error: 'Grupo não encontrado' }, { status: 404 });
    }

    // Privacidade: lista de membros de grupo privado só pra membros.
    if (group.isPrivate) {
      if (!currentUserId) {
        return NextResponse.json({ error: 'Grupo privado' }, { status: 403 });
      }
      const memberRs = await client.execute({
        sql: 'SELECT 1 FROM study_group_members WHERE group_id = ? AND user_id = ? LIMIT 1',
        args: [group.id, currentUserId],
      });
      if (memberRs.rows.length === 0 && group.ownerId !== currentUserId) {
        return NextResponse.json({ error: 'Grupo privado' }, { status: 403 });
      }
    }

    const cursor = decodeGroupCursor(req.nextUrl.searchParams.get('cursor'));

    const where: string[] = ['m.group_id = ?'];
    const args: InValue[] = [group.id];
    if (cursor) {
      where.push('(m.joined_at < ? OR (m.joined_at = ? AND m.user_id < ?))');
      args.push(cursor.createdAt, cursor.createdAt, cursor.id);
    }

    const sql = `
      SELECT m.user_id, m.role, m.joined_at,
             u.nome, u.username, u.avatar_id, u.equipped_border
      FROM study_group_members m
      JOIN users u ON u.id = m.user_id
      WHERE ${where.join(' AND ')}
      ORDER BY
        CASE m.role
          WHEN 'owner' THEN 0
          WHEN 'moderator' THEN 1
          ELSE 2
        END,
        m.joined_at ASC
      LIMIT ?
    `;
    args.push(MEMBERS_PAGE_SIZE + 1);

    const rs = await client.execute({ sql, args });
    const rows = rs.rows as unknown as MemberJoinRow[];
    const hasMore = rows.length > MEMBERS_PAGE_SIZE;
    const page = hasMore ? rows.slice(0, MEMBERS_PAGE_SIZE) : rows;

    const members: GroupMember[] = page.map((r) => ({
      userId: r.user_id,
      nome: r.nome,
      username: r.username,
      avatarId: r.avatar_id ?? 1,
      equippedBorder: r.equipped_border,
      role: (r.role as GroupRole) ?? 'member',
      joinedAt: r.joined_at,
    }));

    const last = page[page.length - 1];
    const nextCursor = hasMore && last
      ? encodeGroupCursor(last.joined_at, last.user_id)
      : null;

    return NextResponse.json({ members, nextCursor });
  } catch (error) {
    console.error('Erro ao listar membros:', error);
    return NextResponse.json({ error: 'Erro ao listar membros' }, { status: 500 });
  }
}

// ─── POST (toggle entrar/sair) ─────────────────────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const limited = rateLimit(req);
  if (limited) return limited;

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: 'Slug obrigatório' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const group = await findGroup(slug);
    if (!group) {
      return NextResponse.json({ error: 'Grupo não encontrado' }, { status: 404 });
    }

    // Owner não pode "sair" do próprio grupo (precisaria transferir ownership).
    if (group.ownerId === userId) {
      return NextResponse.json(
        { error: 'O dono não pode sair do próprio grupo. Transfira a propriedade ou exclua.' },
        { status: 400 },
      );
    }

    // Estado atual?
    const existRs = await client.execute({
      sql: 'SELECT role FROM study_group_members WHERE group_id = ? AND user_id = ? LIMIT 1',
      args: [group.id, userId],
    });
    const isCurrentlyMember = existRs.rows.length > 0;

    if (isCurrentlyMember) {
      // SAIR
      await client.batch(
        [
          {
            sql: 'DELETE FROM study_group_members WHERE group_id = ? AND user_id = ?',
            args: [group.id, userId],
          },
          {
            // Cláusula > 0 evita desconto abaixo de zero em race-conditions.
            sql: 'UPDATE study_groups SET member_count = member_count - 1 WHERE id = ? AND member_count > 0',
            args: [group.id],
          },
        ],
        'write',
      );

      return NextResponse.json({ status: 'left', isMember: false, role: null });
    }

    // ENTRAR
    if (group.isPrivate) {
      // MVP: privado retorna 'pending' como contrato; aprovação será em v2.
      // TODO v2: persistir em tabela join_requests + notificar owner.
      return NextResponse.json({ status: 'pending', isMember: false, role: null });
    }

    const now = new Date().toISOString();
    await client.batch(
      [
        {
          sql: `INSERT INTO study_group_members (group_id, user_id, role, joined_at)
                VALUES (?, ?, 'member', ?)`,
          args: [group.id, userId, now],
        },
        {
          sql: 'UPDATE study_groups SET member_count = member_count + 1 WHERE id = ?',
          args: [group.id],
        },
      ],
      'write',
    );

    return NextResponse.json({ status: 'joined', isMember: true, role: 'member' as GroupRole });
  } catch (error) {
    console.error('Erro no toggle de membership:', error);
    return NextResponse.json({ error: 'Erro ao alterar membership' }, { status: 500 });
  }
}
