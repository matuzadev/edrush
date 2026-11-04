'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Crown,
  Lock,
  PlayCircle,
  Target,
  TrendingUp,
  Layers,
  CheckCheck,
  BookOpen,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { NotificationBell } from '@/components/NotificationBell';
import { UserMenu } from '@/components/UserMenu';
import { BlockSetupModal } from '@/components/study/BlockSetupModal';
import subjects from '@/data/subjects.json';

interface UserSession {
  id: string;
  email: string;
  name?: string | null;
  onboardingCompleted: boolean;
  concursoSlug: string | null;
}

interface ProgressStats {
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  subjectsDone: number;
  loaded: boolean;
  error: boolean;
}

const isValidConcursoSlug = (slug: unknown): slug is string =>
  typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug.trim());

async function fetchJsonWithTimeout(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export default function PersonalizedDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const slug = (params?.concursoSlug as string | undefined) ?? '';

  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>('');
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [stats, setStats] = useState<ProgressStats>({
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    subjectsDone: 0,
    loaded: false,
    error: false,
  });
  // Capítulos completados: chave "subject:chapterId" → true.
  // Alimentado por /api/user/chapter-completion. Usado para liberar o próximo
  // capítulo na trilha (estilo Duolingo).
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [completionLoaded, setCompletionLoaded] = useState(false);
  const [completionError, setCompletionError] = useState(false);
  // Modal de "iniciar bloco rápido"
  const [blockModalOpen, setBlockModalOpen] = useState(false);

  const user = session?.user as UserSession | undefined;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
      return;
    }
    if (status === 'authenticated') {
      if (!user || !user.onboardingCompleted || !isValidConcursoSlug(user.concursoSlug)) {
        router.replace('/onboarding/select-concurso');
        return;
      }

      if (user.concursoSlug !== slug) {
        router.replace(`/dashboard/${encodeURIComponent(user.concursoSlug)}`);
        return;
      }

      let cancelled = false;
      const controllers = [
        new AbortController(),
        new AbortController(),
        new AbortController(),
      ];
      const timeoutIds = controllers.map((controller) =>
        window.setTimeout(() => controller.abort(), 10_000),
      );
      const request = (url: string, controller: AbortController) =>
        fetchJsonWithTimeout(url, controller.signal);

      void request('/api/user/profile', controllers[0])
        .then((result) => {
          if (cancelled) return;
          const profile = result as { selectedAreas?: unknown };
          const areas = Array.isArray(profile.selectedAreas)
            ? profile.selectedAreas.filter(
                (area): area is string => typeof area === 'string' && Boolean((subjects as any)[area]),
              )
            : [];
          setSelectedAreas(areas);
          setActiveSubject(areas[0] ?? '');
          setProfileError(false);
        })
        .catch(() => {
          if (!cancelled) setProfileError(true);
        })
        .finally(() => {
          window.clearTimeout(timeoutIds[0]);
          if (!cancelled) setProfileLoaded(true);
        });

      void request('/api/user/stats', controllers[1])
        .then((result) => {
          if (cancelled) return;
          const data = result as {
            totalQuestionsAnswered?: number;
            totalQuestionsCorrect?: number;
            accuracy?: number;
            byDisciplina?: { disciplina: string; answered: number }[];
          };
          const totalAnswered = Number(data.totalQuestionsAnswered ?? 0);
          const totalCorrect = Number(data.totalQuestionsCorrect ?? 0);
          const accuracy = Number(data.accuracy ?? 0);
          const byDisciplina = Array.isArray(data.byDisciplina) ? data.byDisciplina : [];
          const subjectsDone = byDisciplina.filter((item) => Number(item.answered) > 0).length;
          setStats({ totalAnswered, totalCorrect, accuracy, subjectsDone, loaded: true, error: false });
        })
        .catch(() => {
          if (!cancelled) setStats((prev) => ({ ...prev, loaded: true, error: true }));
        })
        .finally(() => window.clearTimeout(timeoutIds[1]));

      void request('/api/user/chapter-completion', controllers[2])
        .then((result) => {
          if (cancelled) return;
          const data = result as { completed?: { subject: string; chapterId: number }[] };
          const list = Array.isArray(data.completed) ? data.completed : [];
          setCompletedSet(new Set(list.map((item) => `${item.subject}:${item.chapterId}`)));
          setCompletionError(false);
        })
        .catch(() => {
          if (!cancelled) setCompletionError(true);
        })
        .finally(() => {
          window.clearTimeout(timeoutIds[2]);
          if (!cancelled) setCompletionLoaded(true);
        });

      return () => {
        cancelled = true;
        controllers.forEach((controller) => controller.abort());
        timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      };
    }
  }, [status, user, slug, router]);

  async function handleLogout() {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/auth/login' });
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Carregando painel...</p>
        </div>
      </div>
    );
  }

  // Determinar matérias a exibir: apenas as selecionadas no onboarding.
  // Enquanto o perfil não carrega, retorna [] para evitar flash de TODAS as
  // matérias do subjects.json (Perito + ESFCEX + …) misturadas.
  const displaySubjects = !profileLoaded || profileError
    ? []
    : selectedAreas;

  const activeSubjectData = activeSubject
    ? (subjects as any)[activeSubject]
    : null;

  // Slug formatado para exibição
  const concursoDisplayName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Navbar */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50 px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
          >
            EDRUSH
          </Link>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="hidden sm:inline text-sm text-slate-400 font-medium truncate max-w-xs">
            {concursoDisplayName}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <NotificationBell />
          <UserMenu onLogout={handleLogout} />
          {/* Badge de destaque com gradient dourado e brilho sutil no hover */}
          <div
            className="pro-badge hidden md:flex relative items-center gap-1.5 px-3 py-1.5 rounded-full overflow-hidden cursor-default group"
            style={{
              background: 'linear-gradient(135deg, rgba(120,53,15,0.22) 0%, rgba(15,23,42,0.92) 50%, rgba(120,53,15,0.22) 100%)',
              border: '1px solid rgba(251,191,36,0.32)',
              boxShadow: 'inset 0 1px 0 rgba(253,230,138,0.06), 0 4px 14px -4px rgba(251,191,36,0.18)',
              transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
            }}
            title="Plano Pro ativo"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(253,230,138,0.10), 0 0 18px -2px rgba(251,191,36,0.40)';
              e.currentTarget.style.borderColor = 'rgba(251,191,36,0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(253,230,138,0.06), 0 4px 14px -4px rgba(251,191,36,0.18)';
              e.currentTarget.style.borderColor = 'rgba(251,191,36,0.32)';
            }}
          >
            {/* Glow sutil no canto */}
            <span
              aria-hidden
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full pointer-events-none opacity-40 blur-lg"
              style={{ background: '#fbbf24' }}
            />
            {/* Shine sweep no hover */}
            <span
              aria-hidden
              className="pro-shine absolute top-0 left-0 h-full w-1/3 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(253,230,138,0.22), transparent)',
                transform: 'translateX(-150%) skewX(-12deg)',
              }}
            />
            <Crown
              size={13}
              strokeWidth={2.5}
              className="relative z-10 shrink-0"
              style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 3px rgba(251,191,36,0.55))' }}
            />
            <span
              className="relative z-10 text-[11px] font-black tracking-[0.22em]"
              style={{
                background: 'linear-gradient(180deg, #fef3c7 0%, #fbbf24 50%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              PRO
            </span>
            <style jsx>{`
              @keyframes pro-shine-sweep {
                0%   { transform: translateX(-150%) skewX(-12deg); }
                100% { transform: translateX(420%)  skewX(-12deg); }
              }
              .pro-badge:hover .pro-shine {
                animation: pro-shine-sweep 1.1s ease-out;
              }
            `}</style>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Cabeçalho personalizado */}
        <div className="mb-6 relative overflow-hidden rounded-2xl bg-slate-900/80 border border-white/8 p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-cyan-500/5 pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Target size={13} className="text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Seu painel personalizado
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">{concursoDisplayName}</h1>
            <p className="text-slate-500 text-sm">
              {profileLoaded ? (
                <>
                  {displaySubjects.length} matéria{displaySubjects.length !== 1 ? 's' : ''} selecionada
                  {displaySubjects.length !== 1 ? 's' : ''}
                </>
              ) : (
                <span className="inline-block h-3 w-32 rounded bg-slate-800 animate-pulse" />
              )}
            </p>
          </div>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {([
            {
              icon: Layers,
              label: 'Matérias Totais',
              hint: 'no seu plano de estudos',
              value: displaySubjects.length,
              accent: '#10b981',
              iconBg: 'bg-emerald-500/10',
              iconColor: 'text-emerald-400',
              ringFrom: 'from-emerald-500/30',
              ringTo: 'to-emerald-500/0',
            },
            {
              icon: CheckCheck,
              label: 'Matérias feitas',
              hint:
                displaySubjects.length > 0
                  ? `${Math.round((stats.subjectsDone / displaySubjects.length) * 100)}% do plano`
                  : '—',
              value: stats.loaded ? `${stats.subjectsDone}/${displaySubjects.length}` : '...',
              accent: '#22c55e',
              iconBg: 'bg-green-500/10',
              iconColor: 'text-green-400',
              ringFrom: 'from-green-500/30',
              ringTo: 'to-green-500/0',
              progress:
                displaySubjects.length > 0
                  ? Math.min(100, Math.round((stats.subjectsDone / displaySubjects.length) * 100))
                  : 0,
            },
            {
              icon: TrendingUp,
              label: 'Respondidas',
              hint: stats.totalAnswered > 0 ? `${stats.totalCorrect} corretas` : 'comece agora',
              value: stats.loaded ? stats.totalAnswered.toLocaleString('pt-BR') : '...',
              accent: '#3b82f6',
              iconBg: 'bg-blue-500/10',
              iconColor: 'text-blue-400',
              ringFrom: 'from-blue-500/30',
              ringTo: 'to-blue-500/0',
            },
            {
              icon: Target,
              label: 'Taxa de Acertos',
              hint:
                stats.totalAnswered > 0
                  ? stats.accuracy >= 70
                    ? 'Excelente desempenho'
                    : stats.accuracy >= 50
                      ? 'Continue praticando'
                      : 'Foco nas revisões'
                  : 'sem dados ainda',
              value: stats.loaded
                ? stats.totalAnswered > 0
                  ? `${stats.accuracy}%`
                  : '—'
                : '...',
              accent: '#8b5cf6',
              iconBg: 'bg-violet-500/10',
              iconColor: 'text-violet-400',
              ringFrom: 'from-violet-500/30',
              ringTo: 'to-violet-500/0',
              progress: stats.totalAnswered > 0 ? stats.accuracy : 0,
            },
          ] as const).map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-white/8 rounded-2xl p-5 group transition-all hover:border-white/20 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
              >
                {/* glow superior */}
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"
                  style={{ background: metric.accent }}
                />
                {/* linha de topo */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${metric.accent}, transparent)` }}
                />

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${metric.iconBg} ring-1 ring-white/5`}
                    >
                      <Icon size={18} className={metric.iconColor} />
                    </div>
                    <div
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r ${metric.ringFrom} ${metric.ringTo} text-white/80`}
                    >
                      Live
                    </div>
                  </div>

                  <div className="text-3xl font-black text-white leading-none mb-1 tabular-nums">
                    {metric.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-300 mb-0.5">{metric.label}</div>
                  <div className="text-[11px] text-slate-500">{metric.hint}</div>

                  {'progress' in metric && metric.progress !== undefined && (
                    <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${metric.progress}%`,
                          background: `linear-gradient(90deg, ${metric.accent}, ${metric.accent}cc)`,
                          boxShadow: `0 0 12px ${metric.accent}55`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Botões rápidos */}
        <div className="flex gap-3 mb-10 flex-wrap">
          <Link
            href="/questions"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#020617] rounded-full text-sm font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_28px_rgba(16,185,129,0.35)]"
          >
            Ir para simulado aplicado
          </Link>
        </div>

        {/* Seletor de matérias */}
        {!profileLoaded ? (
          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Suas Matérias
              </h2>
              <span className="inline-block h-2.5 w-16 rounded bg-slate-800 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.05] bg-slate-900/40 px-3 py-3 animate-pulse"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-6 shrink-0 rounded-full bg-slate-800" />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="h-2.5 w-4/5 rounded bg-slate-800" />
                      <div className="h-2 w-1/2 rounded bg-slate-800/70" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : displaySubjects.length > 0 && (
          <>
            <div className="mb-4">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Suas Matérias
                </h2>
                <span className="text-[10px] tabular-nums text-slate-600 uppercase tracking-widest">
                  {displaySubjects.length} no plano
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5">
                {displaySubjects.map((subjectSlug) => {
                  const subjectData = (subjects as any)[subjectSlug];
                  const title = subjectData?.title ?? subjectSlug;
                  const chapterCount = subjectData?.chapters?.length ?? 0;
                  const isActive = activeSubject === subjectSlug;
                  const completedChapters = subjectData?.chapters?.filter(
                    (ch: { id: number }) => completedSet.has(`${subjectSlug}:${ch.id}`)
                  ).length ?? 0;
                  const progressPct = chapterCount > 0
                    ? Math.round((completedChapters / chapterCount) * 100)
                    : 0;

                  return (
                    <button
                      key={subjectSlug}
                      onClick={() => setActiveSubject(subjectSlug)}
                      data-active={isActive}
                      style={{
                        ['--p' as string]: `${progressPct}%`,
                        ['--deg' as string]: `${(progressPct / 100) * 360}deg`,
                      }}
                      className="
                        group relative isolate overflow-hidden rounded-xl
                        border border-white/[0.07] bg-slate-900/40 backdrop-blur-sm
                        px-3 py-3 text-left
                        transition-[transform,border-color,background-color,box-shadow] duration-300
                        hover:-translate-y-0.5 hover:border-white/15 hover:bg-slate-900/70
                        hover:shadow-[0_8px_30px_-12px_rgba(16,185,129,0.25)]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617]
                        data-[active=true]:border-emerald-400/40
                        data-[active=true]:bg-emerald-500/[0.08]
                        data-[active=true]:shadow-[0_8px_32px_-8px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]
                        before:pointer-events-none before:absolute before:inset-0 before:-z-10
                        before:bg-[radial-gradient(140%_90%_at_50%_-10%,rgba(16,185,129,0.20),transparent_60%)]
                        before:opacity-0 before:transition-opacity before:duration-500
                        hover:before:opacity-100 data-[active=true]:before:opacity-100
                        after:pointer-events-none after:absolute after:inset-x-3 after:bottom-1.5 after:h-[2px] after:rounded-full
                        after:bg-gradient-to-r after:from-emerald-400/80 after:via-emerald-400 after:to-cyan-300
                        after:[width:calc(var(--p)-1.5rem)]
                        after:shadow-[0_0_10px_rgba(16,185,129,0.6)]
                        after:opacity-30 after:transition-[opacity,width] after:duration-700
                        group-hover:after:opacity-70 data-[active=true]:after:opacity-100
                      "
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Conic ring de progresso ao redor do dot */}
                        <span
                          aria-hidden
                          className="
                            relative grid place-items-center size-6 shrink-0 rounded-full
                            bg-[conic-gradient(from_-90deg,theme(colors.emerald.400)_var(--deg),theme(colors.slate.700/0.5)_0)]
                            transition-[transform] duration-500
                            group-hover:rotate-[15deg] group-data-[active=true]:rotate-[15deg]
                            after:absolute after:inset-[2px] after:rounded-full after:bg-slate-950
                            group-data-[active=true]:after:bg-emerald-950
                          "
                        >
                          <span className="
                            relative z-10 size-1.5 rounded-full bg-slate-500
                            transition-[background-color,box-shadow] duration-300
                            group-data-[active=true]:bg-emerald-300
                            group-data-[active=true]:shadow-[0_0_8px_rgba(110,231,183,0.9)]
                          " />
                        </span>

                        <div className="flex-1 min-w-0">
                          <span className="
                            block truncate text-[13px] font-semibold tracking-tight
                            text-slate-200 transition-colors
                            group-hover:text-white
                            group-data-[active=true]:text-emerald-100
                          ">
                            {title}
                          </span>
                          <span className="
                            block text-[10px] font-medium tabular-nums text-slate-500
                            transition-colors group-data-[active=true]:text-emerald-400/80
                          ">
                            {completedChapters}/{chapterCount} · {progressPct}%
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trilha de capítulos */}
            {activeSubjectData && (
              <div className="mt-8 mb-4">
                <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
                    <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                      {activeSubjectData.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setBlockModalOpen(true)}
                    className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-emerald-300 transition-all hover:-translate-y-0.5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(16,185,129,0.14), rgba(6,182,212,0.06))',
                      border: '1px solid rgba(16,185,129,0.35)',
                      boxShadow: '0 0 14px -4px rgba(16,185,129,0.40)',
                    }}
                    title="Estudar bloco com filtros personalizados"
                  >
                    <Zap size={12} className="group-hover:text-emerald-200 transition" fill="currentColor" />
                    Bloco rápido
                  </button>
                </div>
              </div>
            )}
            {activeSubjectData && (
              <div className="relative flex flex-col items-center gap-8">
                <div className="absolute top-0 bottom-0 w-1.5 bg-slate-800 -z-0" />

                {activeSubjectData.chapters.map((chapter: any, index: number) => {
                  // Duolingo-style: capítulo desbloqueia se for o primeiro OU se
                  // o anterior já foi completado (≥80% em ≥1 sessão).
                  const prev = index > 0 ? activeSubjectData.chapters[index - 1] : null;
                  const isCompleted = completedSet.has(`${activeSubject}:${chapter.id}`);
                  const prevCompleted = prev ? completedSet.has(`${activeSubject}:${prev.id}`) : true;
                  const isLocked = index > 0 && !prevCompleted;

                  return (
                    <div
                      key={chapter.id}
                      className="relative z-10 flex flex-col items-center group"
                      style={{ transform: `translateX(${index % 2 === 0 ? -40 : 40}px)` }}
                    >
                      <Link
                        href={isLocked ? '#' : `/dashboard/chapter/${activeSubject}/${chapter.id}`}
                        className={`
                          w-20 h-20 rounded-full flex items-center justify-center border-b-8 transition-all
                          ${
                            isLocked
                              ? 'bg-slate-800 border-slate-900 cursor-not-allowed opacity-80'
                              : isCompleted
                                ? 'bg-cyan-500 border-cyan-700'
                                : 'bg-emerald-500 border-emerald-700 animate-pulse-ring'
                          }
                        `}
                        title={isCompleted ? 'Concluído — toque para revisar' : isLocked ? 'Bloqueado: complete o anterior' : 'Começar capítulo'}
                      >
                        {isLocked ? (
                          <Lock className="w-8 h-8 text-slate-500" />
                        ) : isCompleted ? (
                          <CheckCheck className="w-9 h-9 text-white" />
                        ) : (
                          <PlayCircle className="w-10 h-10 text-white fill-emerald-600/30" />
                        )}
                      </Link>

                      <div className="mt-4 bg-slate-900 border border-white/10 px-4 py-2 rounded-xl shadow-xl transition-all group-hover:-translate-y-1">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block text-center">
                          Capítulo {chapter.id}
                        </span>
                        <h3 className="text-white font-medium text-center">{chapter.title}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal: iniciar bloco rápido com filtros */}
      {activeSubjectData && (
        <BlockSetupModal
          isOpen={blockModalOpen}
          onClose={() => setBlockModalOpen(false)}
          disciplina={activeSubjectData.title}
          subjectSlug={activeSubject}
          concursoSlug={slug}
        />
      )}
    </div>
  );
}
