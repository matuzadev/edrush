'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Eye, FileText, Award } from 'lucide-react';
import { TIER_STYLE, MEDAL_CATEGORIES } from '@/lib/levels';
import type { Medal } from '@/lib/levels';
import { ConcursoBadge } from '@/components/ConcursoBadge';
import { ProfileShowcase } from '@/components/profile/ProfileShowcase';
import { PostsTab } from './PostsTab';

interface ItemRef {
  id: string;
  slug: string;
  name: string;
  rarity: string;
  category: string;
  metadata: unknown;
}

export interface PerfilTabsData {
  id: string;
  username: string;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  totalSessions: number;
  accuracy: number;
  streak: number;
  medals: number;
  totalMedals: number;
  achievements: Medal[];
  activityLog: { date: string; questionsAnswered: number }[];
  weeklyProgress?: { day: string; date: string; answered: number; correct: number }[];
  byDisciplina?: { disciplina: string; answered: number; correct: number; accuracy: number }[];
  concursoSlug?: string | null;
  loadout?: { border: ItemRef | null; avatar: ItemRef | null; badges: ItemRef[] };
  inventory?: Array<{ category: string; items: ItemRef[] }>;
  expBuff?: { multiplier: number; expiresAt: string } | null;
}

type TabId = 'overview' | 'posts' | 'achievements';

const TABS: { id: TabId; label: string; icon: typeof Eye }[] = [
  { id: 'overview',     label: 'Visão geral', icon: Eye },
  { id: 'posts',        label: 'Posts',       icon: FileText },
  { id: 'achievements', label: 'Conquistas',  icon: Award },
];

interface Props {
  data: PerfilTabsData;
}

export function PerfilTabs({ data }: Props) {
  return (
    <Suspense fallback={null}>
      <PerfilTabsInner data={data} />
    </Suspense>
  );
}

function PerfilTabsInner({ data }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const initialTab = parseTab(sp.get('tab'));
  const [tab, setTab] = useState<TabId>(initialTab);

  const handleSelect = useCallback(
    (next: TabId) => {
      setTab(next);
      const params = new URLSearchParams(sp.toString());
      if (next === 'overview') params.delete('tab');
      else params.set('tab', next);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, sp],
  );

  return (
    <>
      <TabBar active={tab} onSelect={handleSelect} />

      {tab === 'overview' && <OverviewTab data={data} />}
      {tab === 'posts' && <PostsTab userId={data.id} username={data.username} />}
      {tab === 'achievements' && <AchievementsTab achievements={data.achievements} />}
    </>
  );
}

function parseTab(v: string | null): TabId {
  if (v === 'posts' || v === 'achievements' || v === 'overview') return v;
  return 'overview';
}

// ─── Tab bar ────────────────────────────────────────────────────────────────

function TabBar({
  active,
  onSelect,
}: {
  active: TabId;
  onSelect: (id: TabId) => void;
}) {
  return (
    <div
      className="sticky z-10 -mx-4 px-4 bg-slate-950/80 backdrop-blur border-b border-white/5"
      style={{ top: 56 }}
    >
      <div
        role="tablist"
        aria-label="Seções do perfil"
        className="flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar"
      >
        {TABS.map((t) => {
          const isActive = active === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${t.id}`}
              onClick={() => onSelect(t.id)}
              className="relative shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 rounded"
              style={{
                color: isActive ? '#34d399' : '#94a3b8',
              }}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{t.label}</span>
              <span
                aria-hidden
                className="absolute left-0 right-0 -bottom-px h-0.5 rounded-t transition-all"
                style={{
                  background: isActive ? '#10b981' : 'transparent',
                  boxShadow: isActive ? '0 0 12px -2px rgba(16,185,129,0.6)' : 'none',
                }}
              />
            </button>
          );
        })}
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// ─── Overview tab ───────────────────────────────────────────────────────────

function OverviewTab({ data }: { data: PerfilTabsData }) {
  const p = data;
  const medalsByCategory = MEDAL_CATEGORIES.map((cat) => ({
    category: cat,
    medals: p.achievements.filter((m) => m.category === cat),
  })).filter((g) => g.medals.length > 0);

  return (
    <div id="panel-overview" role="tabpanel" className="space-y-8">
      {/* Concurso em estudo */}
      {p.concursoSlug && <ConcursoBadge slug={p.concursoSlug} variant="card" />}

      {/* Vitrine */}
      {(p.loadout || (p.inventory && p.inventory.length > 0) || p.expBuff) && (
        <ProfileShowcase
          loadout={p.loadout ?? { border: null, avatar: null, badges: [] }}
          inventory={p.inventory ?? []}
          expBuff={p.expBuff ?? null}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Questões',  value: p.totalQuestionsAnswered.toLocaleString('pt-BR'), icon: '📝', color: 'text-emerald-400' },
          { label: 'Precisão',  value: `${p.accuracy}%`,           icon: '🎯', color: p.accuracy >= 80 ? 'text-emerald-400' : p.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400' },
          { label: 'Sequência', value: `${p.streak}d`,             icon: '🔥', color: 'text-orange-400' },
          { label: 'Medalhas',  value: `${p.medals}/${p.totalMedals}`, icon: '🏅', color: 'text-yellow-400' },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900 border border-white/8 rounded-2xl p-4">
            <span className="text-xl">{s.icon}</span>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-600 uppercase tracking-wide mt-0.5 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Medals by category */}
      <div className="space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Medalhas</h2>
        {medalsByCategory.map(({ category, medals }) => (
          <div key={category} className="bg-slate-900 border border-white/8 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{category}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {medals.map((m) => {
                const ts = TIER_STYLE[m.tier];
                return (
                  <div
                    key={m.id}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all ${
                      m.unlocked ? `${ts.bg} ${ts.border} shadow-sm ${ts.glow}` : 'bg-slate-800/40 border-slate-700/50 opacity-40'
                    }`}
                  >
                    <span className={`text-xl shrink-0 ${m.unlocked ? '' : 'grayscale'}`}>{m.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${m.unlocked ? ts.text : 'text-slate-600'}`}>{m.label}</p>
                      <p className="text-xs text-slate-600 truncate capitalize">{ts.label}</p>
                    </div>
                    {m.unlocked && <span className={`ml-auto text-xs font-bold shrink-0 ${ts.text}`}>✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Activity calendar */}
      <div className="bg-slate-900 border border-white/8 rounded-2xl p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Atividade (30 dias)</h2>
        <div className="flex flex-wrap gap-1.5">
          {p.activityLog.map((d) => (
            <div
              key={d.date}
              title={`${d.date}: ${d.questionsAnswered} questões`}
              className={`w-6 h-6 rounded-md cursor-default ${
                d.questionsAnswered >= 20 ? 'bg-emerald-400' :
                d.questionsAnswered >= 10 ? 'bg-emerald-500/70' :
                d.questionsAnswered >= 1  ? 'bg-emerald-700/70' :
                'bg-slate-800'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
          <span>Menos</span>
          {['bg-slate-800','bg-emerald-700/70','bg-emerald-500/70','bg-emerald-400'].map((c) => (
            <div key={c} className={`w-4 h-4 rounded ${c}`} />
          ))}
          <span>Mais</span>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-4">
        <p className="text-slate-500 text-sm mb-3">Quer competir com {p.username}?</p>
        <Link
          href="/auth/signup"
          className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          Criar minha conta grátis
        </Link>
      </div>
    </div>
  );
}

// ─── Achievements tab ───────────────────────────────────────────────────────

function AchievementsTab({ achievements }: { achievements: Medal[] }) {
  const [filter, setFilter] = useState<string>('Todos');

  const categories = useMemo(() => {
    const present = new Set(achievements.map((m) => m.category));
    return ['Todos', ...MEDAL_CATEGORIES.filter((c) => present.has(c))];
  }, [achievements]);

  const filtered = useMemo(() => {
    if (filter === 'Todos') return achievements;
    return achievements.filter((m) => m.category === filter);
  }, [filter, achievements]);

  const grouped = useMemo(() => {
    const cats = filter === 'Todos' ? MEDAL_CATEGORIES : [filter];
    return cats
      .map((cat) => ({
        category: cat,
        medals: filtered.filter((m) => m.category === cat),
      }))
      .filter((g) => g.medals.length > 0);
  }, [filter, filtered]);

  const unlockedCount = achievements.filter((m) => m.unlocked).length;

  return (
    <div id="panel-achievements" role="tabpanel" className="space-y-5">
      {/* Header com contagem */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
          Conquistas
        </h2>
        <span className="text-xs font-bold text-yellow-400">
          {unlockedCount}/{achievements.length}
        </span>
      </div>

      {/* Filtros por categoria */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((c) => {
          const active = filter === c;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition border"
              style={{
                background: active ? 'rgba(16,185,129,0.15)' : 'rgba(15,23,42,0.6)',
                color: active ? '#34d399' : '#94a3b8',
                borderColor: active ? 'rgba(16,185,129,0.40)' : 'rgba(255,255,255,0.06)',
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Grid de medalhas */}
      {grouped.length === 0 ? (
        <div
          className="rounded-2xl py-12 px-6 text-center"
          style={{
            background: 'rgba(15,23,42,0.50)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className="text-sm text-slate-500">Nenhuma medalha nesta categoria.</p>
        </div>
      ) : (
        grouped.map(({ category, medals }) => (
          <div key={category} className="bg-slate-900 border border-white/8 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              {category}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {medals.map((m) => {
                const ts = TIER_STYLE[m.tier];
                return (
                  <div
                    key={m.id}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all ${
                      m.unlocked
                        ? `${ts.bg} ${ts.border} shadow-sm ${ts.glow}`
                        : 'bg-slate-800/40 border-slate-700/50 opacity-40'
                    }`}
                  >
                    <span className={`text-xl shrink-0 ${m.unlocked ? '' : 'grayscale'}`}>
                      {m.icon}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${m.unlocked ? ts.text : 'text-slate-600'}`}>
                        {m.label}
                      </p>
                      <p className="text-xs text-slate-600 truncate capitalize">
                        {ts.label}
                      </p>
                    </div>
                    {m.unlocked && (
                      <span className={`ml-auto text-xs font-bold shrink-0 ${ts.text}`}>
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
