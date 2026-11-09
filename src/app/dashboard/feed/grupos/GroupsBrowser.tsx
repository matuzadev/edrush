'use client';

// GroupsBrowser — UI interativa do catálogo de grupos.
// - Tabs: Todos / Meus / Recomendados (filtrado pelo concurso do user).
// - Busca com debounce client-side (500ms) refazendo query.
// - Modal de criação acoplado.
// - Empty state cativante com CTA emerald.

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Users, Lock, Globe, Loader2, Sparkles } from 'lucide-react';
import { CreateGroupModal } from '@/components/community/CreateGroupModal';
import {
  getGroupAccent,
  type GroupListItem,
} from '@/lib/study-groups';

type Tab = 'all' | 'mine' | 'recommended';

interface Props {
  initialGroups: GroupListItem[];
  currentUserId: string | null;
  userConcursoSlug: string | null;
}

export function GroupsBrowser({
  initialGroups,
  currentUserId,
  userConcursoSlug,
}: Props) {
  const [groups, setGroups] = useState<GroupListItem[]>(initialGroups);
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce do search — evita disparo a cada tecla.
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recarrega da API sempre que tab/search muda.
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      reload();
    }, 350);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, search]);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (tab === 'mine') params.set('mine', '1');
      if (tab === 'recommended' && userConcursoSlug) {
        // "Recomendado" = mesmo prefixo do concurso do user.
        // No backend filtramos por igualdade; aceita-se o prefixo do head.
        const head = userConcursoSlug.split('-')[0];
        params.set('concurso', head);
      }
      const res = await fetch(`/api/groups?${params.toString()}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Erro ao carregar grupos');
        return;
      }
      setGroups(data.groups ?? []);
    } catch (err) {
      console.error(err);
      setError('Erro de rede');
    } finally {
      setLoading(false);
    }
  }

  // Quando um grupo é criado pelo modal — adiciona no topo otimisticamente.
  function handleCreated(group: GroupListItem) {
    setGroups((prev) => [group, ...prev.filter((g) => g.id !== group.id)]);
  }

  const showEmpty = !loading && groups.length === 0;

  // "Recomendados" sem concurso configurado → mensagem específica
  const noConcursoForRecommended = tab === 'recommended' && !userConcursoSlug;

  const filteredGroups = useMemo(() => groups, [groups]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
              Comunidade
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Grupos de Estudo
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Conecte-se com quem foca no mesmo concurso, troque resumos e
              compare progresso.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            disabled={!currentUserId}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black text-slate-950 transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              boxShadow: '0 0 20px rgba(16,185,129,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 28px rgba(16,185,129,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(16,185,129,0.3)';
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            Criar grupo
          </button>
        </header>

        {/* Tabs + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div
            className="inline-flex p-1 rounded-xl"
            style={{
              background: 'rgba(15,23,42,0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {([
              { key: 'all' as const, label: 'Todos' },
              { key: 'mine' as const, label: 'Meus grupos' },
              { key: 'recommended' as const, label: 'Pra você' },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background:
                    tab === key
                      ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.15))'
                      : 'transparent',
                  color: tab === key ? '#34d399' : '#94a3b8',
                  border:
                    tab === key
                      ? '1px solid rgba(16,185,129,0.3)'
                      : '1px solid transparent',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar grupos..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
              style={{
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="px-4 py-3 mb-6 rounded-xl text-sm"
            style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.3)',
              color: '#fca5a5',
            }}
          >
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
        )}

        {/* Conteúdo */}
        {!loading && (
          <>
            {showEmpty ? (
              <EmptyState
                tab={tab}
                noConcurso={noConcursoForRecommended}
                onCreate={() => setModalOpen(true)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGroups.map((g) => (
                  <GroupCard key={g.id} group={g} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <CreateGroupModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultConcursoSlug={userConcursoSlug}
        onCreated={(group) => {
          handleCreated(group);
          // Modal já navega pra página do grupo após criar — mas hidratamos
          // a lista pra caso o user volte.
        }}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Subcomponentes
// ──────────────────────────────────────────────────────────────────────────

function GroupCard({ group }: { group: GroupListItem }) {
  // accent é serializável (vem do server), mas em recargas client recomputamos
  // pra garantir que entradas vindas de POST otimista tenham accent.
  const accent = group.accent ?? getGroupAccent(group.concursoSlug);

  return (
    <Link
      href={`/dashboard/feed/grupos/${group.slug}`}
      className="group relative block rounded-2xl p-5 transition-all hover:-translate-y-0.5"
      style={{
        background:
          'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.4) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent.base}55`;
        e.currentTarget.style.boxShadow = `0 8px 32px -8px ${accent.glow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="flex items-start gap-3">
        {/* Ícone colorido */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-slate-950 font-black text-sm"
          style={{
            background: accent.gradient,
            boxShadow: `0 0 16px ${accent.glow}`,
          }}
        >
          {accent.badge}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white truncate">{group.name}</h3>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3" />
              {group.memberCount} {group.memberCount === 1 ? 'membro' : 'membros'}
            </span>
            <span className="text-slate-600">·</span>
            {group.isPrivate ? (
              <span className="inline-flex items-center gap-1 text-violet-300">
                <Lock className="w-3 h-3" />
                Privado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <Globe className="w-3 h-3" />
                Público
              </span>
            )}
          </div>
        </div>

        {group.isMember && (
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md shrink-0"
            style={{
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.3)',
              color: '#34d399',
            }}
          >
            {group.myRole === 'owner' ? 'Dono' : 'Membro'}
          </span>
        )}
      </div>

      {group.description && (
        <p
          className="text-sm text-slate-400 mt-3 leading-relaxed"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {group.description}
        </p>
      )}

      <div
        className="flex items-center justify-between mt-4 pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span
          className="text-xs font-bold transition-all inline-flex items-center gap-1"
          style={{ color: accent.base }}
        >
          {group.isMember ? 'Abrir grupo' : 'Ver grupo'} →
        </span>
        <span className="text-[11px] text-slate-500">
          {formatRelative(group.createdAt)}
        </span>
      </div>
    </Link>
  );
}

function EmptyState({
  tab,
  noConcurso,
  onCreate,
}: {
  tab: Tab;
  noConcurso: boolean;
  onCreate: () => void;
}) {
  const message =
    tab === 'mine'
      ? 'Você ainda não entrou em nenhum grupo'
      : noConcurso
        ? 'Selecione um concurso no onboarding pra ver recomendações'
        : tab === 'recommended'
          ? 'Sem grupos do seu concurso ainda'
          : 'Nenhum grupo criado ainda';

  const subtitle =
    tab === 'mine'
      ? 'Entre em algum grupo público ou crie o seu pra começar a estudar junto.'
      : 'Seja o pioneiro: crie o primeiro grupo de estudos da comunidade.';

  return (
    <div
      className="flex flex-col items-center text-center py-16 px-6 rounded-3xl"
      style={{
        background:
          'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(6,182,212,0.03) 100%)',
        border: '1px dashed rgba(16,185,129,0.25)',
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: 'linear-gradient(135deg, #10b981, #06b6d4)',
          boxShadow: '0 0 24px rgba(16,185,129,0.4)',
        }}
      >
        <Sparkles className="w-8 h-8 text-slate-950" strokeWidth={2.5} />
      </div>
      <h2 className="text-xl font-black text-white mb-2">{message}</h2>
      <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-6">
        {subtitle}
      </p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-slate-950 transition-all"
        style={{
          background: 'linear-gradient(135deg, #10b981, #06b6d4)',
          boxShadow: '0 0 20px rgba(16,185,129,0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 28px rgba(16,185,129,0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 20px rgba(16,185,129,0.3)';
        }}
      >
        <Plus className="w-4 h-4" strokeWidth={3} />
        Criar primeiro grupo
      </button>
    </div>
  );
}

// Formatador de "tempo relativo" — mantém leve (sem date-fns).
function formatRelative(iso: string): string {
  try {
    const then = new Date(iso).getTime();
    const diffMin = Math.round((Date.now() - then) / 60000);
    if (diffMin < 1) return 'agora';
    if (diffMin < 60) return `há ${diffMin}min`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) return `há ${diffH}h`;
    const diffD = Math.round(diffH / 24);
    if (diffD < 7) return `há ${diffD}d`;
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  } catch {
    return '';
  }
}
