'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

interface ModernLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export function ModernLayout({ children, showNav = true }: ModernLayoutProps) {
  return (
    <main className="min-h-screen bg-[#0d1411] text-[#f3f5f1]">
      {showNav && (
        <header className="border-b border-white/10">
          <nav
            aria-label="Navegação principal"
            className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-5 sm:px-8"
          >
            <Link
              href="/"
              aria-label="EdRush — página inicial"
              className="inline-flex items-center gap-2 text-xl font-bold tracking-tight no-underline"
            >
              <Zap className="fill-emerald-500 text-emerald-500" size={23} aria-hidden="true" />
              <span>
                Ed<span className="text-emerald-500">Rush</span>
              </span>
            </Link>

            <div className="hidden items-center gap-8 text-sm text-[#b3bbb5] sm:flex">
              <Link href="#recursos" className="transition hover:text-white">
                Recursos
              </Link>
              <Link href="/concursos" className="transition hover:text-white">
                Concursos
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-[#d3d8d3] transition hover:text-white"
              >
                Entrar
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold text-[#06251b] transition hover:bg-emerald-400"
              >
                Criar conta
              </Link>
            </div>
          </nav>
        </header>
      )}
      {children}
    </main>
  );
}