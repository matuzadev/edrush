'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Crown,
  RefreshCw,
  Lock,
  PlayCircle,
  Target,
  TrendingUp,
  Loader2,
  Layers,
  CheckCheck,
} from 'lucide-react';
import { NotificationBell } from '@/components/NotificationBell';
import { UserMenu } from '@/components/UserMenu';
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
}

export default function PersonalizedDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const slug = params.concursoSlug as string;

  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>('');
  const [stats, setStats] = useState<ProgressStats>({
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    subjectsDone: 0,
    loaded: false,
  });
  const [isResetting, setIsResetting] = useState(false);
  // Capítulos completados: chave "subject:chapterId" → true.
  // Alimentado por /api/user/chapter-completion. Usado para liberar o próximo
  // capítulo na trilha (estilo Duolingo).
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());

  const user = session?.user as UserSession | undefined;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated' && user) {
      // Validar que o slug da URL corresponde ao concurso salvo do usuário
      if (user.concursoSlug && user.concursoSlug !== slug) {
        router.replace(`/dashboard/${user.concursoSlug}`);
        return;
      }

      loadUserData();
    }
  }, [status, user, slug, router]);

  async function loadUserData() {
    try {
      const [profileRes, statsRes, completionRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/stats'),
        fetch('/api/user/chapter-completion'),
      ]);

      if (completionRes.ok) {
        const cdata = await completionRes.json();
        const list: { subject: string; chapterId: number }[] = cdata.completed ?? [];
        setCompletedSet(new Set(list.map((c) => `${c.subject}:${c.chapterId}`)));
      }

      let areas: string[] = [];
      if (profileRes.ok) {
        const profile = await profileRes.json();
        areas = profile.selectedAreas ?? [];
        setSelectedAreas(areas);
        if (areas.length > 0) setActiveSubject(areas[0]);
        else setActiveSubject(Object.keys(subjects)[0]);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        const totalAnswered = Number(data.totalQuestionsAnswered ?? 0);
        const totalCorrect = Number(data.totalQuestionsCorrect ?? 0);
        const accuracy = Number(data.accuracy ?? 0);

        // "Matérias feitas" = disciplinas distintas em que o usuário já respondeu pelo menos 1 questão
        const byDisciplina: { disciplina: string; answered: number }[] = data.byDisciplina ?? [];
        const subjectsDone = byDisciplina.filter((d) => d.answered > 0).length;

        setStats({ totalAnswered, totalCorrect, accuracy, subjectsDone, loaded: true });
      } else {
        setStats((prev) => ({ ...prev, loaded: true }));
      }
    } catch {
      const allSlugs = Object.keys(subjects);
      setSelectedAreas(allSlugs);
      setActiveSubject(allSlugs[0]);
      setStats((prev) => ({ ...prev, loaded: true }));
    }
  }

  async function handleChangeConcurso() {
    setIsResetting(true);
    try {
      const res = await fetch('/api/onboarding/reset', { method: 'POST' });
      if (res.ok) {
        await update(); // Atualizar JWT
        router.push('/onboarding/select-concurso');
      }
    } catch {
      setIsResetting(false);
    }
  }

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

  // Determinar matérias a exibir: apenas as selecionadas no onboarding
  const displaySubjects =
    selectedAreas.length > 0
      ? selectedAreas.filter((s) => (subjects as any)[s])
      : Object.keys(subjects);

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
            FOCO FEDERAL
          </Link>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="hidden sm:inline text-sm text-slate-400 font-medium truncate max-w-xs">
            {concursoDisplayName}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <NotificationBell />
          <UserMenu onLogout={handleLogout} />
          {/* Badge PRO — premium minimalista com gradient dourado e brilho sutil no hover */}
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
          <button
            onClick={handleChangeConcurso}
            disabled={isResetting}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition border border-white/10 hover:border-emerald-500/30 rounded-lg px-2.5 py-1.5"
            title="Trocar concurso"
          >
            {isResetting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RefreshCw size={12} />
            )}
            <span>Trocar concurso</span>
          </button>
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
              {displaySubjects.length} matéria{displaySubjects.length !== 1 ? 's' : ''} selecionada
              {displaySubjects.length !== 1 ? 's' : ''}
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
          <button
            onClick={handleChangeConcurso}
            disabled={isResetting}
            className="sm:hidden flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 rounded-full text-sm font-semibold transition"
          >
            {isResetting ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Trocar concurso
          </button>
        </div>

        {/* Seletor de matérias */}
        {displaySubjects.length > 0 && (
          <>
            <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
              {displaySubjects.map((subjectSlug) => (
                <button
                  key={subjectSlug}
                  onClick={() => setActiveSubject(subjectSlug)}
                  className={`px-5 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm ${
                    activeSubject === subjectSlug
                      ? 'bg-emerald-500 text-[#020617] shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-900 text-slate-400 border border-white/5 hover:border-emerald-500/50'
                  }`}
                >
                  {(subjects as any)[subjectSlug]?.title ?? subjectSlug}
                </button>
              ))}
            </div>

            {/* Trilha de capítulos */}
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
                    <div key={chapter.id} className="relative z-10 flex flex-col items-center group">
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

                      <style jsx>{`
                        div:nth-child(even) { transform: translateX(40px); }
                        div:nth-child(odd) { transform: translateX(-40px); }
                      `}</style>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
