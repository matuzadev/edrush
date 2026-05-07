'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { NotificationBell } from '@/components/NotificationBell';
import { LogOut, CheckCircle, Lock, PlayCircle, Star } from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';

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
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Navbar Minimalista */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50 px-6 h-16 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          FOCO FEDERAL
        </Link>
        
        <div className="flex items-center gap-4">
          <NotificationBell />
          <UserMenu onLogout={handleLogout} />
          <div className="hidden md:flex bg-slate-900 rounded-full px-4 py-1 border border-white/5 items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-white">PRO</span>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Botões de Ação Rápida */}
        <div className="flex gap-3 mb-12 flex-wrap">
          <Link 
            href="/questions"
            className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 rounded-full font-semibold transition"
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
              className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${
                activeSubject === slug
                ? 'bg-emerald-500 text-[#020617] shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 text-slate-400 border border-white/5 hover:border-emerald-500/50'
              }`}
            >
              {subjectsData[slug].title}
            </button>
          ))}
        </div>

        {/* Trilha de Aprendizagem (Style Duolingo) */}
        <div className="relative flex flex-col items-center gap-8">
          {/* Linha vertical de conexão */}
          <div className="absolute top-0 bottom-0 w-1.5 bg-slate-800 -z-0" />

          {COURSES[activeSubject as keyof typeof COURSES].chapters.map((chapter, index) => {
            const isLocked = index > 0 && !COURSES[activeSubject as keyof typeof COURSES].chapters[index - 1].completed;
            
            return (
              <div key={chapter.id} className="relative z-10 flex flex-col items-center group">
                {/* O "Círculo" do Duolingo */}
                <Link 
                  href={isLocked ? '#' : `/dashboard/chapter/${activeSubject}/${chapter.id}`}
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center border-b-8 transition-all
                    ${chapter.completed 
                      ? 'bg-emerald-500 border-emerald-700 hover:bg-emerald-400' 
                      : isLocked 
                        ? 'bg-slate-800 border-slate-900 cursor-not-allowed opacity-80' 
                        : 'bg-emerald-500 border-emerald-700 animate-pulse-ring'
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
                <div className="mt-4 bg-slate-900 border border-white/10 px-4 py-2 rounded-xl shadow-xl transition-all group-hover:-translate-y-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block text-center">
                    Capítulo {chapter.id}
                  </span>
                  <h3 className="text-white font-medium text-center">{chapter.title}</h3>
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