// /api/groups/[slug]
//   GET    → grupo + top-10 membros + flags `isMember` e `myRole`.
//   DELETE → apenas owner. Hard-delete em cascata.
//
// Justificativa do hard-delete (em vez de soft):
//   - Grupos não acumulam métricas críticas como `users` ou `posts` standalone;
//     se o owner apaga, o feed do grupo perde sentido.
//   - Um soft-delete exigiria filtro `is_active=0` em todas as listagens e nos
//     joins do feed (o outro engenheiro teria que adaptar /api/feed). Em MVP
//     o ROI não compensa.
//   - Hard-delete cascateia: study_group_members → posts.group_id (SET NULL,
//     pois posts continuam visíveis no feed pessoal do autor — acordo com o
//     eng do feed; ele garante que group_id é nullable em posts).

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient as client } from '@/lib/db';
import {
  getGroupAccent,
  type GroupDetail,
  type GroupMember,
  type GroupRole,
} from '@/lib/study-groups';

interface GroupRow {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  concurso_slug: string | null;
  is_private: number;
  member_count: number;
  created_at: string;
}

interface MemberRow {
  user_id: string;
  role: string;
  joined_at: string;
  nome: string | null;
  username: string | null;
  avatar_id: number | null;
  equipped_border: string | null;
}

// ─── GET ───────────────────────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: 'Slug obrigatório' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? null;

  try {
    const groupRs = await client.execute({
      sql: `SELECT id, owner_id, name, slug, description, concurso_slug,
                   is_private, member_count, created_at
            FROM study_groups WHERE slug = ? LIMIT 1`,
      args: [slug],
    });

    if (groupRs.rows.length === 0) {
      return NextResponse.json({ error: 'Grupo não encontrado' }, { status: 404 });
    }

    const group = groupRs.rows[0] as unknown as GroupRow;

    // Membros do user atual (1 query) — pra computar isMember/myRole.
    let myRole: GroupRole | null = null;
    if (currentUserId) {
      if (group.owner_id === currentUserId) {
        myRole = 'owner';
      } else {
        const memberRs = await client.execute({
          sql: 'SELECT role FROM study_group_members WHERE group_id = ? AND user_id = ? LIMIT 1',
          args: [group.id, currentUserId],
        });
        if (memberRs.rows.length > 0) {
          myRole = (memberRs.rows[0] as unknown as { role: GroupRole }).role;
        }
      }
    }
    const isMember = myRole !== null;

    // Privacidade: grupo privado → só membros podem ver detalhes.
    if (group.is_private === 1 && !isMember) {
      return NextResponse.json(
        { error: 'Grupo privado. Você precisa ser convidado.' },
        { status: 403 },
      );
    }

    // Top-10 membros — owner primeiro, depois moderators, depois members.
    // Usamos ORDER BY CASE pra priorizar role e, em empate, joined_at ASC
    // (membros mais antigos aparecem antes — cria senso de "fundadores").
    const membersRs = await client.execute({
      sql: `SELECT m.user_id, m.role, m.joined_at,
                   u.nome, u.username, u.avatar_id, u.equipped_border
            FROM study_group_members m
            JOIN users u ON u.id = m.user_id
            WHERE m.group_id = ?
            ORDER BY
              CASE m.role
                WHEN 'owner' THEN 0
                WHEN 'moderator' THEN 1
                ELSE 2
              END,
              m.joined_at ASC
            LIMIT 10`,
      args: [group.id],
    });

    const topMembers: GroupMember[] = (membersRs.rows as unknown as MemberRow[]).map((r) => ({
      userId: r.user_id,
      nome: r.nome,
      username: r.username,
      avatarId: r.avatar_id ?? 1,
      equippedBorder: r.equipped_border,
      role: (r.role as GroupRole) ?? 'member',
      joinedAt: r.joined_at,
    }));

    const detail: GroupDetail = {
      id: group.id,
      name: group.name,
      slug: group.slug,
      description: group.description,
      concursoSlug: group.concurso_slug,
      isPrivate: group.is_private === 1,
      memberCount: group.member_count,
      createdAt: group.created_at,
      ownerId: group.owner_id,
      isMember,
      myRole,
      accent: getGroupAccent(group.concurso_slug),
      topMembers,
    };

    return NextResponse.json({ group: detail });
  } catch (error) {
    console.error('Erro ao buscar grupo:', error);
    return NextResponse.json({ error: 'Erro ao buscar grupo' }, { status: 500 });
  }
}

// ─── DELETE ────────────────────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
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
    const groupRs = await client.execute({
      sql: 'SELECT id, owner_id FROM study_groups WHERE slug = ? LIMIT 1',
      args: [slug],
    });
    if (groupRs.rows.length === 0) {
      return NextResponse.json({ error: 'Grupo não encontrado' }, { status: 404 });
    }
    const group = groupRs.rows[0] as unknown as { id: string; owner_id: string };

    if (group.owner_id !== userId) {
      return NextResponse.json(
        { error: 'Apenas o dono do grupo pode excluir' },
        { status: 403 },
      );
    }

    // Cascata em batch (atomic). posts.group_id setado pra NULL — assim o feed
    // pessoal de cada autor mantém o post histórico, mas ele "sai" do feed do
    // grupo (que vai deixar de existir).
    await client.batch(
      [
        {
          sql: 'UPDATE posts SET group_id = NULL WHERE group_id = ?',
          args: [group.id],
        },
        {
          sql: 'DELETE FROM study_group_members WHERE group_id = ?',
          args: [group.id],
        },
        {
          sql: 'DELETE FROM study_groups WHERE id = ?',
          args: [group.id],
        },
      ],
      'write',
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Caso a tabela `posts` ainda não exista no banco (outro eng não deployou
    // ainda), o UPDATE quebra. Retry sem ele — graceful.
    const msg = error instanceof Error ? error.message : '';
    if (/no such table:\s*posts/i.test(msg)) {
      try {
        await client.batch(
          [
            { sql: 'DELETE FROM study_group_members WHERE group_id = (SELECT id FROM study_groups WHERE slug = ?)', args: [slug] },
            { sql: 'DELETE FROM study_groups WHERE slug = ?', args: [slug] },
          ],
          'write',
        );
        return NextResponse.json({ ok: true });
      } catch (innerErr) {
        console.error('Erro ao excluir grupo (fallback):', innerErr);
      }
    }
    console.error('Erro ao excluir grupo:', error);
    return NextResponse.json({ error: 'Erro ao excluir grupo' }, { status: 500 });
  }
}
