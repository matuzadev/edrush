'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  X,
  Trophy,
  Flame,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  /** Username do perfil sendo visitado — usado para personalizar o copy. */
  username: string;
  /** Métrica social opcional (questões respondidas pelo dono do perfil). */
  questionsAnswered?: number;
}

// Atraso antes de abrir o modal (ms). Tempo suficiente para a pessoa "fisgar"
// no conteúdo do perfil antes da oferta aparecer — sem ser intrusivo de cara.
const OPEN_DELAY_MS = 7000;
// Só mostramos 1× por sessão para não irritar quem está navegando vários perfis.
const SESSION_KEY = 'ff_join_promo_seen';

const PERKS: { icon: typeof Trophy; title: string; desc: string }[] = [
  { icon: Target,  title: '4.000+ questões',   desc: 'Comentadas, com Active Recall e métricas reais.' },
  { icon: Trophy,  title: 'Ranking e medalhas', desc: 'Suba de nível e dispute o topo com a galera.' },
  { icon: Flame,   title: 'Sequência diária',   desc: 'Crie o hábito que aprova — sem perder o ritmo.' },
];

export function JoinPromoModal({ username, questionsAnswered }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // controla animação de entrada

  const dismiss = useCallback(() => {
    setMounted(false);
    // espera a transição de saída antes de desmontar
    window.setTimeout(() => setOpen(false), 220);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* sessionStorage indisponível (modo privado) — sem problema */
    }
  }, []);

  // Agenda a abertura do modal uma vez por sessão.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      /* ignore */
    }
    if (seen) return;

    const t = window.setTimeout(() => {
      setOpen(true);
      // próximo frame -> dispara transição de entrada
      requestAnimationFrame(() => setMounted(true));
    }, OPEN_DELAY_MS);

    return () => window.clearTimeout(t);
  }, []);

  // Trava o scroll do body + fecha no ESC enquanto aberto.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-promo-title"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={dismiss}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: mounted ? 1 : 0 }}
      />

      {/* Card */}
      <div
        className="relative w-full sm:max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl border border-emerald-400/20 transition-all duration-200"
        style={{
          background: 'linear-gradient(180deg, #0b1220, #020617)',
          boxShadow: '0 -20px 60px -10px rgba(16,185,129,0.25), 0 30px 80px -20px rgba(0,0,0,0.8)',
          transform: mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.98)',
          opacity: mounted ? 1 : 0,
        }}
      >
        {/* Aurora topo */}
        <div aria-hidden className="relative h-24 overflow-hidden">
          <div className="ff-promo-aurora absolute inset-0" />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(2,6,23,0.85) 90%, #020617 100%)' }}
          />
          {/* Selo grátis */}
          <div className="absolute top-3 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black backdrop-blur"
            style={{ background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.45)', color: '#6ee7b7' }}>
            <Sparkles size={12} /> 100% GRÁTIS PARA COMEÇAR
          </div>
        </div>

        {/* Botão fechar */}
        <button
          onClick={dismiss}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 grid place-items-center w-8 h-8 rounded-full text-slate-300 hover:text-white transition"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <X size={16} />
        </button>

        <div className="px-6 pb-6 -mt-6">
          {/* Troféu flutuante */}
          <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl mb-4"
            style={{
              background: 'linear-gradient(135deg, #34d399, #10b981)',
              boxShadow: '0 12px 30px -8px rgba(16,185,129,0.7)',
            }}>
            <Trophy className="w-7 h-7 text-slate-950" />
          </div>

          <h2 id="join-promo-title" className="text-center text-2xl font-black text-white leading-tight">
            Bora competir com{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {username}
            </span>
            ?
          </h2>
          <p className="text-center text-sm text-slate-400 mt-2">
            {typeof questionsAnswered === 'number' && questionsAnswered > 0 ? (
              <>
                {username} já respondeu{' '}
                <span className="font-bold text-slate-200">
                  {questionsAnswered.toLocaleString('pt-BR')} questões
                </span>
                . Crie sua conta e comece a subir no ranking hoje.
              </>
            ) : (
              <>Crie sua conta grátis, suba de nível e dispute o topo do ranking.</>
            )}
          </p>

          {/* Perks */}
          <ul className="mt-5 space-y-2.5">
            {PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <li key={perk.title} className="flex items-start gap-3 rounded-2xl px-3 py-2.5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="grid place-items-center w-9 h-9 rounded-xl shrink-0"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-100">{perk.title}</p>
                    <p className="text-xs text-slate-500 leading-snug">{perk.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* CTAs */}
          <div className="mt-6 space-y-2.5">
            <Link
              href="/auth/signup"
              onClick={dismiss}
              className="group flex items-center justify-center gap-2 w-full px-6 py-3.5 text-slate-950 font-black rounded-2xl transition active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #34d399, #10b981)',
                boxShadow: '0 14px 34px -10px rgba(16,185,129,0.7)',
              }}
            >
              Criar minha conta grátis
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/auth/login"
              onClick={dismiss}
              className="flex items-center justify-center w-full px-6 py-3 text-sm font-bold text-slate-200 rounded-2xl transition hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.12)' }}
            >
              Já tenho conta — entrar
            </Link>

            <button
              onClick={dismiss}
              className="block w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-300 transition py-1.5"
            >
              Talvez mais tarde
            </button>
          </div>

          {/* Garantia / confiança */}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
            <ShieldCheck size={13} className="text-emerald-500/70" />
            Sem cartão de crédito. Leva menos de 30 segundos.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes ff-promo-aurora-move {
          0%   { transform: translate3d(-6%, -4%, 0) scale(1.1); }
          50%  { transform: translate3d(6%, 4%, 0) scale(1.2); }
          100% { transform: translate3d(-6%, -4%, 0) scale(1.1); }
        }
        .ff-promo-aurora {
          background:
            radial-gradient(45% 70% at 25% 30%, rgba(16,185,129,0.6), transparent 60%),
            radial-gradient(50% 70% at 80% 20%, rgba(6,182,212,0.5), transparent 60%),
            radial-gradient(55% 75% at 60% 90%, rgba(139,92,246,0.45), transparent 60%);
          filter: blur(6px) saturate(1.2);
          animation: ff-promo-aurora-move 12s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ff-promo-aurora { animation: none; }
        }
      `}</style>
    </div>
  );
}
