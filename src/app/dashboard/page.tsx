'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UnifiedNavbar } from '@/components/UnifiedNavbar';
import { CheckCircle, Lock, PlayCircle, Star } from 'lucide-react';

// Exemplo de estrutura de dados para as trilhas
import subjectsData from '@/data/subjects.json';

const COURSES = Object.keys(subjectsData).reduce((acc, slug) => {
  acc[slug] = {
    title: subjectsData[slug].title,
    chapters: subjectsData[slug].chapters.map((c: any) => ({ id: c.id, title: c.title, completed: false }))
  };
  return acc;
}, {} as any);


export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeSubject, setActiveSubject] = useState('portugues');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated') {
      const user = session?.user as any;
      // Redirecionar para dashboard personalizado se onboarding completo
      if (user?.onboardingCompleted && user?.concursoSlug) {
        router.replace(`/dashboard/${user.concursoSlug}`);
        return;
      }
      // Sem onboarding → middleware já redireciona, mas como fallback:
      if (!user?.onboardingCompleted) {
        router.replace('/onboarding/select-concurso');
      }
    }
  }, [status, session, router]);

  const handleLogout = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/auth/login' });
  };

  if (status === 'loading' || status === 'authenticated') return null;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <UnifiedNavbar />

      <main className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        {/* Botões de Ação Rápida */}
        <div className="flex gap-3 mb-12 flex-wrap">
          <Link
            href="/questions"
            className="px-6 py-2 input-modern border-[var(--cyan-500)]/30 hover:border-[var(--cyan-400)] text-[var(--cyan-300)] hover:bg-[var(--cyan-500)]/10 hover:shadow-[var(--glow-cyan)]"
          >
            Ir para Questões
          </Link>
        </div>

        {/* Seletor de Matérias */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-2 scrollbar-hide">
          {Object.keys(subjectsData).map((slug) => (
            <button
              key={slug}
              onClick={() => setActiveSubject(slug)}
              className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap hover-lift ${
                activeSubject === slug
                ? 'btn-gradient shadow-[var(--glow-emerald)]'
                : 'bg-[var(--card)] text-slate-400 border border-[var(--border)] hover:border-[var(--emerald-500)]/50 hover:text-[var(--fg)]'
              }`}
            >
              {subjectsData[slug].title}
            </button>
          ))}
        </div>

        {/* Trilha de Aprendizagem (Style Duolingo) */}
        <div className="relative flex flex-col items-center gap-8">
          {/* Linha vertical de conexão */}
          <div className="absolute top-0 bottom-0 w-1.5 bg-slate-800/50 -z-0" />

          {COURSES[activeSubject as keyof typeof COURSES].chapters.map((chapter, index) => {
            const isLocked = index > 0 && !COURSES[activeSubject as keyof typeof COURSES].chapters[index - 1].completed;

            return (
              <div key={chapter.id} className="relative z-10 flex flex-col items-center group">
                {/* O "Círculo" do Duolingo */}
                <Link
                  href={isLocked ? '#' : `/dashboard/chapter/${activeSubject}/${chapter.id}`}
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center border-b-8 transition-all hover-lift
                    ${chapter.completed
                      ? 'bg-[var(--emerald-500)] border-[var(--emerald-400)] hover:bg-[var(--emerald-400)] shadow-[var(--glow-emerald)]'
                      : isLocked
                        ? 'bg-slate-800 border-slate-900 cursor-not-allowed opacity-80'
                        : 'bg-[var(--emerald-500)] border-[var(--emerald-400)] animate-pulse-ring shadow-[var(--glow-mixed)]'
                    }
                  `}
                >
                  {chapter.completed ? (
                    <CheckCircle className="w-10 h-10 text-white fill-emerald-600/30" />
                  ) : isLocked ? (
                    <Lock className="w-8 h-8 text-slate-500" />
                  ) : (
                    <PlayCircle className="w-10 h-10 text-white fill-emerald-600/30" />
                  )}
                </Link>

                {/* Tooltip de Título */}
                <div className="mt-4 glass-card px-4 py-2 transition-all group-hover:-translate-y-1 group-hover:shadow-[var(--glow-emerald)]">
                  <span className="text-xs font-bold text-[var(--emerald-400)] uppercase tracking-widest block text-center">
                    Capítulo {chapter.id}
                  </span>
                  <h3 className="text-[var(--fg)] font-medium text-center">{chapter.title}</h3>
                </div>

                {/* Curva de deslocamento (opcional para dar o efeito zig-zag do Duolingo) */}
                <style jsx>{`
                  div:nth-child(even) { transform: translateX(40px); }
                  div:nth-child(odd) { transform: translateX(-40px); }
                `}</style>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}