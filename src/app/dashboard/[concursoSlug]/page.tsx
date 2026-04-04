'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  LogOut,
  User,
  Star,
  RefreshCw,
  CheckCircle,
  Lock,
  PlayCircle,
  BookOpen,
  Target,
  TrendingUp,
  Loader2,
} from 'lucide-react';
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
}

export default function PersonalizedDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const slug = params.concursoSlug as string;

  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>('');
  const [stats, setStats] = useState<ProgressStats>({ totalAnswered: 0, totalCorrect: 0, accuracy: 0 });
  const [isResetting, setIsResetting] = useState(false);

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
      // Carregar áreas selecionadas do perfil via session (já armazenadas no DB)
      // e buscar progresso
      const [profileRes, subRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/subscription'),
      ]);

      if (profileRes.ok) {
        const profile = await profileRes.json();
        const areas: string[] = profile.selectedAreas ?? [];
        setSelectedAreas(areas);
        if (areas.length > 0) setActiveSubject(areas[0]);
        else setActiveSubject(Object.keys(subjects)[0]);
      }
    } catch {
      // fallback: usar todas as matérias do subjects.json
      const allSlugs = Object.keys(subjects);
      setSelectedAreas(allSlugs);
      setActiveSubject(allSlugs[0]);
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
            href="/"
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
          <Link href="/dashboard/profile" className="text-slate-400 hover:text-emerald-400 transition">
            <User className="w-5 h-5" />
          </Link>
          <div className="hidden md:flex bg-slate-900 rounded-full px-3 py-1 border border-white/5 items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-white">PRO</span>
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
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Cabeçalho personalizado */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Seu painel personalizado
            </span>
          </div>
          <h1 className="text-3xl font-black text-white mb-1">{concursoDisplayName}</h1>
          <p className="text-slate-400 text-sm">
            {displaySubjects.length} matéria{displaySubjects.length !== 1 ? 's' : ''} selecionada
            {displaySubjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: BookOpen, label: 'Matérias', value: displaySubjects.length, color: 'emerald' },
            { icon: TrendingUp, label: 'Respondidas', value: stats.totalAnswered, color: 'blue' },
            {
              icon: Target,
              label: 'Acertos',
              value: stats.totalAnswered > 0 ? `${stats.accuracy}%` : '-',
              color: 'violet',
            },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 text-center"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 bg-${metric.color}-500/10`}
                >
                  <Icon size={18} className={`text-${metric.color}-400`} />
                </div>
                <div className="text-2xl font-black text-white">{metric.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{metric.label}</div>
              </div>
            );
          })}
        </div>

        {/* Botões rápidos */}
        <div className="flex gap-3 mb-10 flex-wrap">
          <Link
            href="/questions"
            className="px-5 py-2 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-semibold transition"
          >
            Ir para Questões
          </Link>
          <button
            onClick={handleChangeConcurso}
            disabled={isResetting}
            className="sm:hidden flex items-center gap-1.5 px-5 py-2 bg-slate-800 border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 rounded-full text-sm font-semibold transition"
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
                  const isLocked = index > 0;

                  return (
                    <div key={chapter.id} className="relative z-10 flex flex-col items-center group">
                      <Link
                        href={isLocked ? '#' : `/dashboard/chapter/${activeSubject}/${chapter.id}`}
                        className={`
                          w-20 h-20 rounded-full flex items-center justify-center border-b-8 transition-all
                          ${
                            isLocked
                              ? 'bg-slate-800 border-slate-900 cursor-not-allowed opacity-80'
                              : 'bg-emerald-500 border-emerald-700 animate-pulse-ring'
                          }
                        `}
                      >
                        {isLocked ? (
                          <Lock className="w-8 h-8 text-slate-500" />
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
