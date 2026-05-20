// /dashboard/feed/grupos/[slug] — página individual do grupo.
//
// Server Component: busca o grupo direto no banco em SSR (mais rápido que
// fetch HTTP do próprio API). Renderiza:
//   - Header com nome, descrição, badge do concurso, contagem
//   - Botão entrar/sair (client component)
//   - Sidebar de membros (server, top-8)
//   - Feed central via <GroupFeed /> client (consome /api/feed?group_id=)

import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient as client } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Users, Lock, Globe, Calendar, Crown, Shield } from 'lucide-react';
import {
  getGroupAccent,
  type GroupDetail,
  type GroupMember,
  type GroupRole,
} from '@/lib/study-groups';
import { GroupFeed } from '@/components/community/GroupFeed';
import { GroupMembershipButton } from './GroupMembershipButton';

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

async function loadGroup(slug: string, currentUserId: string | null): Promise<GroupDetail | null> {
  try {
    const groupRs = await client.execute({
      sql: `SELECT id, owner_id, name, slug, description, concurso_slug,
                   is_private, member_count, created_at
            FROM study_groups WHERE slug = ? LIMIT 1`,
      args: [slug],
    });
    if (groupRs.rows.length === 0) return null;
    const g = groupRs.rows[0] as unknown as GroupRow;

    let myRole: GroupRole | null = null;
    if (currentUserId) {
      if (g.owner_id === currentUserId) {
        myRole = 'owner';
      } else {
        const memberRs = await client.execute({
          sql: 'SELECT role FROM study_group_members WHERE group_id = ? AND user_id = ? LIMIT 1',
          args: [g.id, currentUserId],
        });
        if (memberRs.rows.length > 0) {
          myRole = (memberRs.rows[0] as unknown as { role: GroupRole }).role;
        }
      }
    }
    const isMember = myRole !== null;

    // Privado e não-membro → bloqueia (página retorna 404 pra não-membros).
    if (g.is_private === 1 && !isMember) return null;

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
            LIMIT 8`,
      args: [g.id],
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

    return {
      id: g.id,
      name: g.name,
      slug: g.slug,
      description: g.description,
      concursoSlug: g.concurso_slug,
      isPrivate: g.is_private === 1,
      memberCount: g.member_count,
      createdAt: g.created_at,
      ownerId: g.owner_id,
      isMember,
      myRole,
      accent: getGroupAccent(g.concurso_slug),
      topMembers,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (/no such table|no such column/i.test(msg)) {
      return null;
    }
    console.error('Erro loadGroup:', err);
    return null;
  }
}

export default async function GrupoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const group = await loadGroup(slug, currentUserId);
  if (!group) notFound();

  const accent = group.accent;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        {/* Voltar */}
        <Link
          href="/dashboard/feed/grupos"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-300 transition mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para grupos
        </Link>

        {/* Header card */}
        <header
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.5) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Glow accent */}
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: accent.glow, opacity: 0.5 }}
          />
          <div className="relative flex flex-col sm:flex-row sm:items-start gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 text-slate-950 font-black text-base"
              style={{
                background: accent.gradient,
                boxShadow: `0 0 24px ${accent.glow}`,
              }}
            >
              {accent.badge}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {group.concursoSlug && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md"
                    style={{
                      background: `${accent.base}1f`,
                      border: `1px solid ${accent.base}55`,
                      color: accent.base,
                    }}
                  >
                    {group.concursoSlug}
                  </span>
                )}
                {group.isPrivate ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/30 text-violet-300">
                    <Lock className="w-3 h-3" />
                    Privado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    <Globe className="w-3 h-3" />
                    Público
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {group.name}
              </h1>
              {group.description && (
                <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-2xl">
                  {group.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-4 text-xs text-slate-400 flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {group.memberCount} {group.memberCount === 1 ? 'membro' : 'membros'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Criado em{' '}
                  {new Date(group.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* CTA membership */}
            <div className="shrink-0">
              <GroupMembershipButton
                slug={group.slug}
                initialIsMember={group.isMember}
                initialRole={group.myRole}
                isOwner={group.ownerId === currentUserId}
                isPrivate={group.isPrivate}
                authenticated={!!currentUserId}
                accentBase={accent.base}
                accentGlow={accent.glow}
              />
            </div>
          </div>
        </header>

        {/* Layout 2 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Feed central */}
          <section>
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">
              Posts do grupo
            </h2>
            <GroupFeed groupId={group.id} accentColor={accent.base} />
          </section>

          {/* Sidebar de membros */}
          <aside>
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">
              Membros ({group.memberCount})
            </h2>
            <div
              className="rounded-2xl p-3"
              style={{
                background:
                  'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.4) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <ul className="flex flex-col gap-1">
                {group.topMembers.map((m) => (
                  <MemberItem key={m.userId} member={m} accentColor={accent.base} />
                ))}
              </ul>
              {group.memberCount > group.topMembers.length && (
                <p className="text-xs text-slate-500 text-center mt-3 pt-3 border-t border-white/5">
                  + {group.memberCount - group.topMembers.length} outros membros
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function MemberItem({ member, accentColor }: { member: GroupMember; accentColor: string }) {
  const display = member.username ?? member.nome ?? 'Membro';
  const initial = display.charAt(0).toUpperCase();

  return (
    <li className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0"
        style={{
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)`,
          color: '#020617',
        }}
      >
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{display}</p>
        <p className="text-[11px] text-slate-500 capitalize">
          {roleLabel(member.role)}
        </p>
      </div>
      {member.role === 'owner' && (
        <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      )}
      {member.role === 'moderator' && (
        <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
      )}
    </li>
  );
}

function roleLabel(role: GroupRole): string {
  switch (role) {
    case 'owner':
      return 'Dono';
    case 'moderator':
      return 'Moderador';
    default:
      return 'Membro';
  }
}
