'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const isValidConcursoSlug = (slug: unknown): slug is string =>
  typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug.trim());

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
      return;
    }

    const user = session?.user as
      | { onboardingCompleted?: boolean; concursoSlug?: string | null }
      | undefined;

    if (!user) return;

    const concursoSlug = user.concursoSlug?.trim();
    if (user.onboardingCompleted && isValidConcursoSlug(concursoSlug)) {
      router.replace(`/dashboard/${encodeURIComponent(concursoSlug)}`);
      return;
    }

    router.replace('/onboarding/select-concurso');
  }, [status, session, router]);

  const isError = status === 'authenticated' && !session?.user;
  const message = isError
    ? 'Não foi possível verificar os dados da sua conta.'
    : status === 'loading'
      ? 'Verificando sua conta...'
      : 'Redirecionando você para o destino correto...';

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center px-6">
      <section className="max-w-md text-center" role={isError ? 'alert' : 'status'} aria-live="polite">
        {!isError && (
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
        )}
        <h1 className="text-xl font-bold text-white mb-2">
          {isError ? 'Não foi possível abrir o painel' : 'EDRUSH'}
        </h1>
        <p className="text-slate-400">{message}</p>
        {isError && (
          <Link
            href="/onboarding/select-concurso"
            className="inline-block mt-5 rounded-full bg-emerald-500 px-5 py-2 font-semibold text-[#020617]"
          >
            Continuar configuração
          </Link>
        )}
      </section>
    </main>
  );
}
