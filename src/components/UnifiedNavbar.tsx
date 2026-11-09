'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { NotificationBell } from '@/components/NotificationBell';
import { UserMenu } from '@/components/UserMenu';
import { Crown, ChevronLeft } from 'lucide-react';

interface UnifiedNavbarProps {
  /** Título opcional exibido após o logo (ex: "Meu Perfil", "Loja") */
  title?: string;
  /** Se true, exibe botão de voltar à esquerda do logo */
  showBack?: boolean;
  /** URL de retorno padrão /dashboard */
  backHref?: string;
  /** Conteúdo extra à direita, antes dos ícones de usuário */
  rightSlot?: React.ReactNode;
  /** Callback de logout — se omitido, usa signOut padrão */
  onLogout?: () => void;
}

/**
 * Navbar unificada seguindo o design system da landing page:
 * - border-b border-[var(--border)] em vez de bg-[#0f172a]/80 hardcoded
 * - max-w-6xl consistente com a landing
 * - Logo "EdRush" com accent emerald
 * - Suporta light/dark mode via CSS variables
 */
export function UnifiedNavbar({
  title,
  showBack = false,
  backHref = '/dashboard',
  rightSlot,
  onLogout,
}: UnifiedNavbarProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-sm">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        {/* Esquerda: Back (opcional) + Logo + Título */}
        <div className="flex items-center gap-3 min-w-0">
          {showBack && (
            <Link
              href={backHref}
              className="shrink-0 text-slate-400 transition hover:text-[var(--fg)]"
              aria-label="Voltar"
            >
              <ChevronLeft size={20} />
            </Link>
          )}

          <Link
            href={isAuthenticated ? '/dashboard' : '/'}
            className="text-xl font-bold tracking-tight no-underline shrink-0"
          >
            Ed<span className="text-emerald-500">Rush</span>
          </Link>

          {title && (
            <>
              <span className="hidden sm:inline text-slate-600 dark:text-slate-600" aria-hidden>·</span>
              <span className="hidden sm:inline text-sm font-medium text-slate-500 truncate">
                {title}
              </span>
            </>
          )}
        </div>

        {/* Direita: Slot custom + Notificações + UserMenu ou Login/Signup */}
        <div className="flex items-center gap-3 shrink-0">
          {rightSlot}

          {isAuthenticated ? (
            <>
              <NotificationBell />
              <UserMenu onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-slate-400 transition hover:text-[var(--fg)] no-underline hidden sm:inline-block"
              >
                Entrar
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 no-underline"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}