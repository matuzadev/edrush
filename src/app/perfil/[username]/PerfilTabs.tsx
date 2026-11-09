'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Eye, FileText, Award, Sparkles, ArrowRight } from 'lucide-react';
import { TIER_STYLE, MEDAL_CATEGORIES } from '@/lib/levels';
import type { Medal } from '@/lib/levels';
import { ConcursoBadge } from '@/components/ConcursoBadge';
import { ProfileShowcase } from '@/components/profile/ProfileShowcase';
import { PostsTab } from './PostsTab';
import { JoinPromoModal } from './JoinPromoModal';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, isLoading: authLoading } = useAuth();

  // Visitante sem conta: destacamos o CTA e mostramos o modal de captação.
  // Enquanto a sessão carrega, tratamos como logado para evitar flash de
  // conteúdo de marketing para quem na verdade já tem conta.
  const isVisitor = !authLoading && !user;

  const initialTab = parseTab(sp?.get('tab') ?? null);
  const [tab, setTab] = useState<TabId>(initialTab);

  const handleSelect = useCallback(
    (next: TabId) => {
      setTab(next);
      const params = new URLSearchParams(sp?.toString() ?? '');
      if (next === 'overview') params.delete('tab');
      else params.set('tab', next);
      const qs = params.toString();
      const base = pathname ?? '';
      router.replace(qs ? `${base}?${qs}` : base, { scroll: false });
    },
    [router, pathname, sp],
  );

  return (
    <>
      <TabBar active={tab} onSelect={handleSelect} />

      {tab === 'overview' && <OverviewTab data={data} isVisitor={isVisitor} />}
      {tab === 'posts' && <PostsTab userId={data.id} username={data.username} />}
      {tab === 'achievements' && <AchievementsTab achievements={data.achievements} />}

      {/* Pop-up de captação — apenas para visitantes sem conta. */}
      {isVisitor && (
        <JoinPromoModal
          username={data.username}
          questionsAnswered={data.totalQuestionsAnswered}
        />
      )}
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
    <div className="sticky z-20 py-2 -mx-4 px-4" style={{ top: 56 }}>
      <div
        role="tablist"
        aria-label="Seções do perfil"
        className="flex gap-1 p-1 rounded-2xl backdrop-blur-xl"
        style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}
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
              className="relative flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              style={{
                color: isActive ? '#022c22' : '#94a3b8',
                background: isActive
                  ? 'linear-gradient(135deg, #34d399, #10b981)'
                  : 'transparent',
                boxShadow: isActive ? '0 6px 18px -6px rgba(16,185,129,0.7)' : 'none',
              }}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Overview tab ───────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.55))',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">{children}</h2>;
}

function OverviewTab({ data, isVisitor }: { data: PerfilTabsData; isVisitor: boolean }) {
  const p = data;
  const medalsByCategory = MEDAL_CATEGORIES.map((cat) => ({
    category: cat,
    medals: p.achievements.filter((m) => m.category === cat),
  })).filter((g) => g.medals.length > 0);

  const weekly = p.weeklyProgress ?? [];
  const weekMax = Math.max(1, ...weekly.map((d) => d.answered));
  const byDisc = (p.byDisciplina ?? []).filter((d) => d.answered > 0);

  return (
    <div id="panel-overview" role="tabpanel" className="space-y-6 mt-2">
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

      {/* Atividade semanal + por disciplina */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico de barras — últimos 7 dias */}
        <Card>
          <SectionTitle>Últimos 7 dias</SectionTitle>
          <div className="flex items-end justify-between gap-2 h-32">
            {weekly.map((d) => {
              const pct = Math.round((d.answered / weekMax) * 100);
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] font-bold text-slate-500 tabular-nums opacity-0 group-hover:opacity-100 transition">
                    {d.answered}
                  </span>
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{
                        height: `${Math.max(4, pct)}%`,
                        background: d.answered > 0
                          ? 'linear-gradient(180deg, #34d399, #059669)'
                          : 'rgba(255,255,255,0.05)',
                        boxShadow: d.answered > 0 ? '0 0 12px -4px rgba(16,185,129,0.8)' : 'none',
                      }}
                      title={`${d.date}: ${d.answered} questões`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">{d.day}</span>
                </div>
              );
            })}
            {weekly.length === 0 && (
              <p className="text-xs text-slate-600 w-full text-center self-center">Sem atividade recente.</p>
            )}
          </div>
        </Card>

        {/* Desempenho por disciplina */}
        <Card>
          <SectionTitle>Desempenho por disciplina</SectionTitle>
          {byDisc.length === 0 ? (
            <p className="text-xs text-slate-600 py-8 text-center">Ainda sem dados por disciplina.</p>
          ) : (
            <div className="space-y-3">
              {byDisc.map((d) => {
                const color = d.accuracy >= 80 ? '#34d399' : d.accuracy >= 60 ? '#fbbf24' : '#fb7185';
                return (
                  <div key={d.disciplina}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="font-bold text-slate-300 truncate pr-2">{d.disciplina}</span>
                      <span className="tabular-nums shrink-0" style={{ color }}>{d.accuracy}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden bg-slate-800/80">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${d.accuracy}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Medals by category */}
      <div className="space-y-4">
        <SectionTitle>Medalhas</SectionTitle>
        {medalsByCategory.map(({ category, medals }) => (
          <Card key={category}>
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
          </Card>
        ))}
      </div>

      {/* Activity calendar */}
      <Card>
        <SectionTitle>Atividade (30 dias)</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {p.activityLog.map((d) => (
            <div
              key={d.date}
              title={`${d.date}: ${d.questionsAnswered} questões`}
              className={`w-6 h-6 rounded-md cursor-default transition-transform hover:scale-110 ${
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
      </Card>

      {/* CTA — destacado apenas para visitantes sem conta.
          Quem já está logado não vê (já faz parte da plataforma). */}
      {isVisitor && (
        <div
          className="ff-cta-glow relative overflow-hidden rounded-3xl text-center py-9 px-6 scroll-mt-24"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.16), rgba(6,182,212,0.10))',
            border: '1px solid rgba(16,185,129,0.45)',
          }}
        >
          {/* Brilho que percorre a borda */}
          <span aria-hidden className="ff-cta-sheen pointer-events-none absolute inset-0" />

          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black mb-3"
            style={{ background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.45)', color: '#6ee7b7' }}
          >
            <Sparkles size={12} /> ENTRE NA DISPUTA
          </span>

          <p className="text-white font-black text-xl sm:text-2xl">Quer competir com {p.username}?</p>
          <p className="text-slate-300 text-sm mt-1.5 mb-5 max-w-sm mx-auto">
            {p.totalQuestionsAnswered > 0
              ? `${p.username} já respondeu ${p.totalQuestionsAnswered.toLocaleString('pt-BR')} questões. Crie sua conta grátis e comece a subir de nível.`
              : 'Crie sua conta grátis e comece a subir de nível.'}
          </p>
          <Link
            href="/auth/signup"
            className="ff-cta-pulse inline-flex items-center gap-2 px-8 py-3.5 text-slate-950 font-black rounded-2xl transition active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #34d399, #10b981)',
              boxShadow: '0 10px 30px -8px rgba(16,185,129,0.6)',
            }}
          >
            Criar minha conta grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[11px] text-slate-500 mt-3">Sem cartão de crédito · leva 30 segundos</p>

          <style jsx>{`
            @keyframes ff-cta-pulse-kf {
              0%, 100% { box-shadow: 0 10px 30px -8px rgba(16,185,129,0.6); }
              50%      { box-shadow: 0 10px 40px -4px rgba(16,185,129,0.95); }
            }
            .ff-cta-pulse { animation: ff-cta-pulse-kf 2.4s ease-in-out infinite; }
            @keyframes ff-cta-sheen-kf {
              0%   { transform: translateX(-120%); }
              60%, 100% { transform: translateX(120%); }
            }
            .ff-cta-sheen {
              background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.10) 50%, transparent 60%);
              animation: ff-cta-sheen-kf 4.5s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .ff-cta-pulse, .ff-cta-sheen { animation: none; }
            }
          `}</style>
        </div>
      )}
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
