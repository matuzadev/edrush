import Link from 'next/link';
import type { ReactNode } from 'react';

export function LegalPageLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <header className="border-b border-[var(--border)]">
        <nav
          aria-label="Navegação principal"
          className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5 sm:px-8"
        >
          <Link href="/" className="text-xl font-bold tracking-tight no-underline">
            Ed<span className="text-emerald-500">Rush</span>
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-medium text-slate-400 transition hover:text-[var(--fg)] no-underline"
          >
            Criar conta
          </Link>
        </nav>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-sm font-semibold text-emerald-500">EdRush</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-slate-500">Última atualização: {updatedAt}</p>
        <div className="legal-content mt-10 space-y-8">{children}</div>
      </article>

      <footer className="border-t border-[var(--border)]">
        <nav
          aria-label="Documentos legais"
          className="mx-auto flex max-w-4xl flex-wrap gap-x-6 gap-y-3 px-5 py-6 text-sm text-slate-500 sm:px-8"
        >
          <Link href="/privacidade" className="transition hover:text-[var(--fg)] no-underline">
            Política de Privacidade
          </Link>
          <Link href="/termos" className="transition hover:text-[var(--fg)] no-underline">
            Termos de Serviço
          </Link>
          <Link href="/" className="transition hover:text-[var(--fg)] no-underline">
            Página inicial
          </Link>
        </nav>
      </footer>
    </main>
  );
}
