// /dashboard/feed/grupos — listagem de Grupos de Estudo.
//
// Server Component: busca os grupos iniciais direto no banco (em vez de fazer
// um fetch HTTP pra própria API; mais rápido e mantém SSR).
// Renderiza o GroupsBrowser (client) com o estado inicial hidratado.
//
// Tabs/Search/Modal vivem no client component pra evitar reload por filtro.

import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient as client } from '@/lib/db';
import {
  getGroupAccent,
  type GroupListItem,
  type GroupRole,
} from '@/lib/study-groups';
import { GroupsBrowser } from './GroupsBrowser';

export const dynamic = 'force-dynamic';

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
  my_role: string | null;
}

async function fetchInitialGroups(currentUserId: string | null): Promise<GroupListItem[]> {
  try {
    const sql = `
      SELECT g.id, g.owner_id, g.name, g.slug, g.description,
             g.concurso_slug, g.is_private, g.member_count, g.created_at,
             m.role AS my_role
      FROM study_groups g
      LEFT JOIN study_group_members m
        ON m.group_id = g.id AND m.user_id = ?
      WHERE g.is_private = 0
         OR m.user_id IS NOT NULL
         OR g.owner_id = ?
      ORDER BY g.created_at DESC, g.id DESC
      LIMIT 30
    `;
    const rs = await client.execute({
      sql,
      args: [currentUserId ?? '', currentUserId ?? ''],
    });
    const rows = rs.rows as unknown as GroupRow[];
    return rows.map((row): GroupListItem => {
      const isMember = row.my_role !== null || row.owner_id === currentUserId;
      const myRole: GroupRole | null = row.owner_id === currentUserId
        ? 'owner'
        : (row.my_role as GroupRole | null);
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        concursoSlug: row.concurso_slug,
        isPrivate: row.is_private === 1,
        memberCount: row.member_count,
        createdAt: row.created_at,
        ownerId: row.owner_id,
        isMember,
        myRole,
        accent: getGroupAccent(row.concurso_slug),
      };
    });
  } catch (err) {
    // Tabela ainda não existe (eng paralelo deployando) → trate como vazio.
    const msg = err instanceof Error ? err.message : '';
    if (/no such table|no such column/i.test(msg)) {
      return [];
    }
    console.error('Erro fetchInitialGroups:', err);
    return [];
  }
}

export default async function GruposPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; concursoSlug?: string | null } | undefined;
  const currentUserId = user?.id ?? null;
  const userConcursoSlug = user?.concursoSlug ?? null;

  const initialGroups = await fetchInitialGroups(currentUserId);

  return (
    <GroupsBrowser
      initialGroups={initialGroups}
      currentUserId={currentUserId}
      userConcursoSlug={userConcursoSlug}
    />
  );
}
