'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Avatar from './Avatar';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Settings, User, LogOut, ChevronDown, RefreshCw, Loader2, ShoppingBag, Package, Newspaper, BookOpen } from 'lucide-react';
import { AvatarSelector } from '@/components/AvatarSelector';
import { getAvatar } from '@/data/avatars';
import { usUserProfile } from '@/hooks/useProfile';

interface UserMenuProps {
  onLogout: () => void;
}

// Mapa de cor de glow por nível (inline style para Tailwind v4)
const LEVEL_GLOW_COLOR: Record<number, string> = {
  1:  'rgba(148,163,184,0.5)',
  2:  'rgba(96,165,250,0.5)',
  3:  'rgba(34,211,238,0.5)',
  4:  'rgba(20,184,166,0.5)',
  5:  'rgba(52,211,153,0.5)',
  6:  'rgba(163,230,53,0.5)',
  7:  'rgba(250,204,21,0.5)',
  8:  'rgba(251,146,60,0.5)',
  9:  'rgba(248,113,113,0.5)',
  10: 'rgba(232,121,249,0.5)',
  11: 'rgba(251,191,36,0.5)',
  12: 'rgba(244,63,94,0.5)',
};

const LEVEL_BADGE_BG: Record<number, string> = {
  1:  '#475569',
  2:  '#3b82f6',
  3:  '#06b6d4',
  4:  '#14b8a6',
  5:  '#10b981',
  6:  '#84cc16',
  7:  '#eab308',
  8:  '#f97316',
  9:  '#ef4444',
  10: '#d946ef',
  11: '#f59e0b',
  12: '#e11d48',
};

export function UserMenu({ onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { profile, isLoading } = usUserProfile();
  const router = useRouter();
  const { update } = useSession();

  // Limpa o concurso selecionado e leva o usuário para a tela de seleção.
  // Mesmo handler usado antes nos botões "Trocar concurso" do dashboard.
  async function handleChangeConcurso() {
    if (isResetting) return;
    setIsResetting(true);
    try {
      const res = await fetch('/api/onboarding/reset', { method: 'POST' });
      if (res.ok) {
        await update();
        setOpen(false);
        router.push('/onboarding/select-concurso');
      } else {
        setIsResetting(false);
      }
    } catch {
      setIsResetting(false);
    }
  }

  // Fechar ao clicar fora
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const level = profile.level ?? 1;
  const glowColor = LEVEL_GLOW_COLOR[level] ?? LEVEL_GLOW_COLOR[1];
  const badgeBg = LEVEL_BADGE_BG[level] ?? LEVEL_BADGE_BG[1];
  const displayName = profile.nome ?? profile.username ?? profile.email.split('@')[0] ?? 'Usuário';
  const initial = displayName.charAt(0).toUpperCase();
  const avatarDef = getAvatar(profile.avatar_id ?? 1);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="relative flex items-center gap-1.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Menu do usuário"
      >
        {/* Avatar + nível em coluna */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/10 transition"
            style={{
              boxShadow: open
                ? `0 0 0 2px ${glowColor}, 0 0 12px ${avatarDef.colors.primary}55`
                : `0 0 8px ${avatarDef.colors.primary}22`,
              background: `linear-gradient(135deg, ${avatarDef.colors.primary}22, ${avatarDef.colors.accent}11)`,
            }}
          >
            {isLoading ? (
              <div className="w-full h-full bg-slate-700 animate-pulse" />
            ) : (
              <Avatar avatar={avatarDef} url={profile.foto_url ?? null} size={36} alt={displayName} />
            )}
          </div>

          {/* Badge de nível abaixo do avatar — neutro */}
          <span
            className="px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider whitespace-nowrap leading-none"
            style={{
              background: 'rgba(15,23,42,0.85)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: '#cbd5e1',
            }}
            aria-label={`Nível ${level}`}
          >
            Nv {level}
          </span>
        </div>

        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
          role="menu"
        >
          {/* Header do dropdown */}
          <div className="px-4 pt-4 pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 shrink-0"
                style={{
                  boxShadow: `0 0 12px ${glowColor}, 0 0 20px ${avatarDef.colors.primary}33`,
                  background: `linear-gradient(135deg, ${avatarDef.colors.primary}22, ${avatarDef.colors.accent}11)`,
                }}
              >
                <Avatar avatar={avatarDef} url={profile.foto_url ?? null} size={40} alt={displayName} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{displayName}</p>
                <p
                  className="text-xs font-semibold"
                  style={{ color: glowColor.replace('0.5)', '1)') }}
                >
                  {profile.levelName} — Nível {level}
                </p>
              </div>
            </div>

            {/* Barra de XP mini */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>{profile.xpIntoLevel.toLocaleString('pt-BR')} XP</span>
                <span>{profile.xpNeeded.toLocaleString('pt-BR')} XP</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${profile.xpProgressPct}%`,
                    backgroundColor: glowColor.replace('0.5)', '1)'),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Items do menu */}
          <div className="py-2">
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
              role="menuitem"
            >
              <User className="w-4 h-4 text-emerald-400" />
              Perfil
            </Link>
            <Link
              href="/dashboard/materiais"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
              role="menuitem"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Materiais PDF
            </Link>
            <Link
              href="/dashboard/feed"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
              role="menuitem"
            >
              <Newspaper className="w-4 h-4 text-emerald-400" />
              Comunidade
            </Link>
            <Link
              href="/dashboard/loja"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
              role="menuitem"
            >
              <ShoppingBag className="w-4 h-4 text-fuchsia-400" />
              Loja de Cristais
            </Link>
            <Link
              href="/dashboard/inventario"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
              role="menuitem"
            >
              <Package className="w-4 h-4 text-cyan-400" />
              Inventário
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
              role="menuitem"
            >
              <Settings className="w-4 h-4 text-blue-400" />
              Configurações
            </Link>
            <button
              onClick={handleChangeConcurso}
              disabled={isResetting}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
              role="menuitem"
            >
              {isResetting ? (
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 text-emerald-400" />
              )}
              {isResetting ? 'Trocando...' : 'Trocar concurso'}
            </button>
          </div>

          {/* Separador + Sair */}
          <div className="border-t border-white/5 py-2">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition"
              role="menuitem"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
