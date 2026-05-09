'use client';

import { useEffect, useRef } from 'react';

interface LevelInfo {
  name: string;
  color: string;
  bg: string;
  border: string;
}

interface LevelUpModalProps {
  level: number;
  levelInfo: LevelInfo;
  xpEarned: number;
  onClose: () => void;
}

// Mapa de cor do nível para gradiente (Tailwind v4 requer classes literais)
const LEVEL_GRADIENT: Record<number, string> = {
  1:  'from-slate-800 to-slate-900',
  2:  'from-blue-900 to-slate-900',
  3:  'from-cyan-900 to-slate-900',
  4:  'from-teal-900 to-slate-900',
  5:  'from-emerald-900 to-slate-900',
  6:  'from-lime-900 to-slate-900',
  7:  'from-yellow-900 to-slate-900',
  8:  'from-orange-900 to-slate-900',
  9:  'from-red-900 to-slate-900',
  10: 'from-fuchsia-900 to-slate-900',
  11: 'from-amber-900 to-slate-900',
  12: 'from-red-950 to-pink-950',
};

const LEVEL_GLOW: Record<number, string> = {
  1:  'shadow-slate-500/40',
  2:  'shadow-blue-500/40',
  3:  'shadow-cyan-500/40',
  4:  'shadow-teal-500/40',
  5:  'shadow-emerald-500/40',
  6:  'shadow-lime-500/40',
  7:  'shadow-yellow-500/40',
  8:  'shadow-orange-500/40',
  9:  'shadow-red-500/40',
  10: 'shadow-fuchsia-500/40',
  11: 'shadow-amber-500/40',
  12: 'shadow-pink-500/40',
};

const LEVEL_TEXT: Record<number, string> = {
  1:  'text-slate-300',
  2:  'text-blue-300',
  3:  'text-cyan-300',
  4:  'text-teal-300',
  5:  'text-emerald-300',
  6:  'text-lime-300',
  7:  'text-yellow-300',
  8:  'text-orange-300',
  9:  'text-red-300',
  10: 'text-fuchsia-300',
  11: 'text-amber-300',
  12: 'text-pink-300',
};

function playLevelUpSound() {
  try {
    const ctx = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  } catch {
    // AudioContext não disponível — silêncio
  }
}

export function LevelUpModal({ level, levelInfo, xpEarned, onClose }: LevelUpModalProps) {
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (!hasPlayedRef.current) {
      hasPlayedRef.current = true;
      playLevelUpSound();
    }
  }, []);

  const gradient = LEVEL_GRADIENT[level] ?? 'from-emerald-900 to-slate-900';
  const glow = LEVEL_GLOW[level] ?? 'shadow-emerald-500/40';
  const textColor = LEVEL_TEXT[level] ?? 'text-emerald-300';

  // Gerar 30 confetes com posições aleatórias fixas (seed via index)
  const confetti = Array.from({ length: 30 }, (_, i) => ({
    left: `${(i * 37 + 11) % 100}%`,
    animDelay: `${(i * 0.11) % 1.2}s`,
    animDuration: `${1.2 + (i * 0.07) % 0.8}s`,
    color: ['bg-yellow-400', 'bg-emerald-400', 'bg-blue-400', 'bg-pink-400', 'bg-orange-400'][i % 5],
    size: i % 3 === 0 ? 'w-3 h-3' : 'w-2 h-2',
  }));

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes levelup-entrance {
          0%   { transform: scale(0.5) translateY(40px); opacity: 0; }
          60%  { transform: scale(1.08) translateY(-8px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes levelup-number {
          0%   { transform: scale(0.3); opacity: 0; }
          70%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes xp-badge-pop {
          0%   { transform: scale(0); opacity: 0; }
          80%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .confetti-piece { animation: confetti-fall linear infinite; }
        .levelup-card   { animation: levelup-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .levelup-number { animation: levelup-number 0.5s 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .xp-badge       { animation: xp-badge-pop 0.4s 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      `}</style>

      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Nível alcançado"
      >
        {/* Confetes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map((c, i) => (
            <div
              key={i}
              className={`confetti-piece absolute top-0 rounded-sm ${c.color} ${c.size}`}
              style={{ left: c.left, animationDelay: c.animDelay, animationDuration: c.animDuration }}
            />
          ))}
        </div>

        {/* Card */}
        <div
          className={`levelup-card relative mx-4 max-w-sm w-full rounded-3xl border-2 ${levelInfo.border} bg-gradient-to-b ${gradient} shadow-2xl ${glow} p-8 text-center`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow interno */}
          <div className="absolute inset-0 rounded-3xl bg-white/5 pointer-events-none" />

          {/* Header */}
          <p className="text-xs uppercase tracking-widest font-black text-slate-400 mb-1">
            Novo nivel alcancado
          </p>

          {/* Numero do nivel */}
          <div className={`levelup-number text-[96px] font-black leading-none ${textColor} drop-shadow-lg`}>
            {level}
          </div>

          {/* Nome do nivel */}
          <p className={`text-2xl font-black mt-1 mb-6 ${textColor}`}>
            {levelInfo.name}
          </p>

          {/* Recompensas */}
          <div className="space-y-3 mb-8">
            <div className={`xp-badge flex items-center justify-center gap-2 rounded-2xl px-4 py-3 ${levelInfo.bg} border ${levelInfo.border}`}>
              <span className="text-yellow-400 text-lg">+50 XP</span>
              <span className="text-slate-300 text-sm">bonus de nivel</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 bg-slate-800/60 border border-white/10">
              <span className="text-blue-400 text-lg">+{xpEarned} XP</span>
              <span className="text-slate-300 text-sm">da sessao</span>
            </div>
          </div>

          {/* Botao continuar */}
          <button
            onClick={onClose}
            className={`w-full py-4 rounded-2xl font-black text-lg ${levelInfo.bg} border-2 ${levelInfo.border} ${textColor} hover:scale-[1.02] transition active:scale-[0.98]`}
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </>
  );
}
