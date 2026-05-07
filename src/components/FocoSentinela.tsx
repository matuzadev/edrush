'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { VolumeX, Volume2, EyeOff, X } from 'lucide-react';
import type { SentinelaMood, SentinelaMessage } from '@/data/sentinelaMessages';

const POLL_MS = 60_000;
const FETCH_DEBOUNCE = 1500;

// Cores da íris por mood — define a alma do Sentinela em cada estado
const MOOD_VISUAL: Record<SentinelaMood, {
  iris: string;
  irisAccent: string;
  glow: string;
  ring: string;        // anel ao redor do olho
  bgFill: string;      // sclera (parte branca)
  pupilScale: number;  // tamanho relativo da pupila
  rays?: boolean;
  shake?: boolean;
  closed?: boolean;
  pulse?: boolean;
}> = {
  awake:     { iris: '#06b6d4', irisAccent: '#67e8f9', glow: 'rgba(6,182,212,0.5)',  ring: 'rgba(6,182,212,0.30)',  bgFill: '#f1f5f9', pupilScale: 0.4 },
  happy:     { iris: '#10b981', irisAccent: '#6ee7b7', glow: 'rgba(16,185,129,0.6)', ring: 'rgba(16,185,129,0.40)', bgFill: '#f1f5f9', pupilScale: 0.45, pulse: true },
  proud:     { iris: '#fbbf24', irisAccent: '#fde047', glow: 'rgba(251,191,36,0.7)', ring: 'rgba(251,191,36,0.50)', bgFill: '#fef9c3', pupilScale: 0.4, rays: true },
  concerned: { iris: '#f59e0b', irisAccent: '#fdba74', glow: 'rgba(245,158,11,0.55)',ring: 'rgba(245,158,11,0.40)', bgFill: '#f1f5f9', pupilScale: 0.55, shake: true },
  sleeping:  { iris: '#475569', irisAccent: '#64748b', glow: 'rgba(71,85,105,0.40)', ring: 'rgba(71,85,105,0.30)',  bgFill: '#1e293b', pupilScale: 0.4, closed: true },
  excited:   { iris: '#ec4899', irisAccent: '#f9a8d4', glow: 'rgba(236,72,153,0.65)',ring: 'rgba(236,72,153,0.45)', bgFill: '#fce7f3', pupilScale: 0.5, pulse: true },
  focused:   { iris: '#8b5cf6', irisAccent: '#c4b5fd', glow: 'rgba(139,92,246,0.55)',ring: 'rgba(139,92,246,0.40)', bgFill: '#ede9fe', pupilScale: 0.30 },
  cheering:  { iris: '#fbbf24', irisAccent: '#ec4899', glow: 'rgba(251,191,36,0.7)', ring: 'rgba(251,191,36,0.50)', bgFill: '#f1f5f9', pupilScale: 0.45, rays: true, pulse: true },
};

interface SentinelaState {
  hidden?: boolean;
  muted?: boolean;
  mood: SentinelaMood;
  message: SentinelaMessage;
  stats?: { level: number; streak: number; accuracy: number };
  totalAvailable?: number;
  totalSeen?: number;
}

export function FocoSentinela() {
  const pathname = usePathname();
  const [state, setState] = useState<SentinelaState | null>(null);
  const [showBalloon, setShowBalloon] = useState(false);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [eyeBlinking, setEyeBlinking] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const eyeRef = useRef<HTMLDivElement>(null);
  const dismissedRef = useRef<Set<string>>(new Set());

  // Esconde em rotas onde concentração é prioridade (simulado, capítulo, study)
  const shouldHide =
    !pathname ||
    pathname.includes('/dashboard/simulado') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/onboarding') ||
    pathname === '/' ||
    pathname.startsWith('/perfil');

  // Fetch estado do servidor
  const fetchState = useCallback(async () => {
    try {
      const res = await fetch(`/api/sentinela?path=${encodeURIComponent(pathname || '')}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.hidden) {
        setState({ hidden: true, mood: 'awake', message: { id: '_', text: '' } });
      } else {
        setState(data);
      }
    } catch {
      // silencioso
    }
  }, [pathname]);

  useEffect(() => {
    if (shouldHide) return;
    const t = setTimeout(fetchState, FETCH_DEBOUNCE);
    return () => clearTimeout(t);
  }, [shouldHide, fetchState]);

  // Polling periódico
  useEffect(() => {
    if (shouldHide) return;
    const interval = setInterval(fetchState, POLL_MS);
    return () => clearInterval(interval);
  }, [shouldHide, fetchState]);

  // Auto-show balloon na primeira mensagem (depois auto-dismiss)
  useEffect(() => {
    if (!state || state.hidden || state.muted || !state.message?.text) return;
    if (dismissedRef.current.has(state.message.id)) return;
    setShowBalloon(true);
    const dur = state.message.duration ?? 8000;
    const t = setTimeout(() => {
      handleDismiss();
    }, dur);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.message?.id, state?.muted]);

  // Pupila segue o cursor (parallax sutil ±18%)
  useEffect(() => {
    if (shouldHide) return;
    const onMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;
      const r = eyeRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      // Normaliza para no máximo ±0.6 (em unidades do raio)
      const dist = Math.sqrt(dx * dx + dy * dy);
      const max = 200;
      const k = Math.min(1, dist / max);
      const angle = Math.atan2(dy, dx);
      setPupilOffset({ x: Math.cos(angle) * k * 8, y: Math.sin(angle) * k * 8 });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [shouldHide]);

  // Blink — a cada 4-7s
  useEffect(() => {
    if (shouldHide) return;
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      const delay = 4000 + Math.random() * 3000;
      timeout = setTimeout(() => {
        setEyeBlinking(true);
        setTimeout(() => setEyeBlinking(false), 180);
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => clearTimeout(timeout);
  }, [shouldHide]);

  const handleDismiss = useCallback(() => {
    if (!state?.message?.id) return;
    setShowBalloon(false);
    dismissedRef.current.add(state.message.id);
    fetch('/api/sentinela/dismiss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: state.message.id }),
    }).catch(() => {});
  }, [state?.message?.id]);

  const toggleMute = useCallback(async () => {
    if (!state) return;
    const newMuted = !state.muted;
    setState({ ...state, muted: newMuted });
    if (newMuted) setShowBalloon(false);
    await fetch('/api/sentinela', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ muted: newMuted }),
    });
  }, [state]);

  const handleHide = useCallback(async () => {
    setState(s => s ? { ...s, hidden: true } : s);
    setShowSettings(false);
    await fetch('/api/sentinela', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: true }),
    });
  }, []);

  if (shouldHide || !state || state.hidden) return null;

  const visual = MOOD_VISUAL[state.mood];

  return (
    <>
      <div
        className="fixed bottom-6 left-6 z-40 select-none"
        style={{ pointerEvents: 'auto' }}
      >
        <style>{`
          @keyframes sent-blink {
            0%, 100% { transform: scaleY(1); }
            50%      { transform: scaleY(0.05); }
          }
          @keyframes sent-breathe {
            0%, 100% { transform: scale(1); }
            50%      { transform: scale(1.04); }
          }
          @keyframes sent-shake {
            0%, 100% { transform: translateX(0); }
            25%      { transform: translateX(-2px); }
            75%      { transform: translateX(2px); }
          }
          @keyframes sent-pulse {
            0%, 100% { box-shadow: 0 0 14px var(--sent-glow); }
            50%      { box-shadow: 0 0 26px var(--sent-glow); }
          }
          @keyframes sent-rotate {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes sent-ray {
            0%, 100% { opacity: 0.2; }
            50%      { opacity: 0.9; }
          }
          @keyframes sent-zzz {
            0%   { opacity: 0; transform: translateY(0) scale(0.8); }
            50%  { opacity: 1; }
            100% { opacity: 0; transform: translateY(-18px) scale(1.1); }
          }
          @keyframes sent-balloon-in {
            from { opacity: 0; transform: translateY(8px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* Container principal: olho + raios + zzz */}
        <div
          ref={eyeRef}
          className="relative cursor-pointer"
          style={{
            width: 64,
            height: 64,
            // @ts-expect-error custom property
            '--sent-glow': visual.glow,
            animation: [
              visual.shake ? 'sent-shake 0.8s ease-in-out infinite' : null,
              visual.pulse ? 'sent-breathe 2.4s ease-in-out infinite' : null,
            ].filter(Boolean).join(', ') || undefined,
          }}
          onClick={() => {
            setInteracted(true);
            if (state.muted) return;
            // Toggle balloon ao clicar
            if (showBalloon) {
              handleDismiss();
            } else if (!dismissedRef.current.has(state.message.id)) {
              setShowBalloon(true);
              const dur = state.message.duration ?? 8000;
              setTimeout(() => handleDismiss(), dur);
            } else {
              // Já viu essa msg; força refetch pra pegar uma nova
              fetchState();
            }
          }}
          onContextMenu={(e) => { e.preventDefault(); setShowSettings(true); }}
          title="Foco Sentinela — clique para falar comigo, botão direito pra opções"
        >
          {/* Anel decorativo girando */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `conic-gradient(from 0deg, ${visual.iris}00 0%, ${visual.iris}cc 50%, ${visual.iris}00 100%)`,
              padding: 2,
              animation: 'sent-rotate 6s linear infinite',
              boxShadow: `0 0 14px ${visual.glow}`,
            }}
          >
            <div className="w-full h-full rounded-full" style={{ background: '#020617' }} />
          </div>

          {/* Raios externos (proud / cheering) */}
          {visual.rays && (
            <>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <div
                  key={angle}
                  className="absolute pointer-events-none"
                  style={{
                    width: 1.5,
                    height: 38,
                    left: '50%',
                    top: '50%',
                    transformOrigin: '0 0',
                    transform: `rotate(${angle}deg)`,
                    background: `linear-gradient(to bottom, transparent, ${visual.iris}, transparent)`,
                    animation: `sent-ray 1.6s ease-in-out ${i * 0.12}s infinite`,
                  }}
                />
              ))}
            </>
          )}

          {/* ZZZ subindo (sleeping) */}
          {visual.closed && (
            <>
              {['Z', 'Z', 'Z'].map((z, i) => (
                <span
                  key={i}
                  className="absolute font-black"
                  style={{
                    color: '#94a3b8',
                    fontSize: 11 + i * 2,
                    top: -8 - i * 6,
                    left: 30 + i * 3,
                    animation: `sent-zzz 2.8s ease-out ${i * 0.5}s infinite`,
                  }}
                >
                  {z}
                </span>
              ))}
            </>
          )}

          {/* O OLHO (SVG) */}
          <svg
            viewBox="0 0 64 64"
            className="absolute inset-0 w-full h-full"
            style={{ filter: `drop-shadow(0 0 8px ${visual.glow})` }}
          >
            {/* Sclera */}
            <ellipse
              cx="32" cy="32" rx="22" ry={visual.closed ? 1 : 16}
              fill={visual.bgFill}
              style={{
                transition: 'rx 0.3s, ry 0.18s',
                transform: eyeBlinking ? 'scaleY(0.05)' : 'scaleY(1)',
                transformOrigin: 'center',
              }}
            />

            {/* Íris (não desenha quando dormindo/blinking) */}
            {!visual.closed && !eyeBlinking && (
              <>
                <defs>
                  <radialGradient id="iris-grad" cx="35%" cy="30%">
                    <stop offset="0%"  stopColor={visual.irisAccent} />
                    <stop offset="60%" stopColor={visual.iris} />
                    <stop offset="100%" stopColor="#020617" />
                  </radialGradient>
                </defs>
                <circle
                  cx={32 + pupilOffset.x}
                  cy={32 + pupilOffset.y}
                  r="9"
                  fill="url(#iris-grad)"
                  style={{ transition: 'cx 0.06s, cy 0.06s' }}
                />
                {/* Pupila */}
                <circle
                  cx={32 + pupilOffset.x}
                  cy={32 + pupilOffset.y}
                  r={9 * visual.pupilScale}
                  fill="#020617"
                  style={{ transition: 'r 0.3s, cx 0.06s, cy 0.06s' }}
                />
                {/* Reflexo de luz (3 pontos) */}
                <circle
                  cx={32 + pupilOffset.x - 2.5}
                  cy={32 + pupilOffset.y - 2.5}
                  r="1.5"
                  fill="#ffffff"
                  opacity="0.95"
                />
                <circle
                  cx={32 + pupilOffset.x - 4.5}
                  cy={32 + pupilOffset.y - 0.5}
                  r="0.8"
                  fill="#ffffff"
                  opacity="0.7"
                />
              </>
            )}

            {/* Pálpebra superior — borda do olho */}
            <path
              d={`M 10 32 Q 32 ${visual.closed ? 32 : 14} 54 32`}
              fill="none"
              stroke={visual.iris}
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d={`M 10 32 Q 32 ${visual.closed ? 32 : 50} 54 32`}
              fill="none"
              stroke={visual.iris}
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>

          {/* Indicador de notificação (pulsa quando tem msg nova não lida) */}
          {!showBalloon && !state.muted && state.message?.id &&
           !dismissedRef.current.has(state.message.id) && interacted === false && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              style={{
                background: visual.iris,
                boxShadow: `0 0 8px ${visual.glow}`,
                animation: 'sent-pulse 1.6s ease-in-out infinite',
              }}
            />
          )}
        </div>

        {/* Balão de fala */}
        {showBalloon && state.message?.text && !state.muted && (
          <div
            className="absolute bottom-0 left-full ml-4 max-w-[280px]"
            style={{ animation: 'sent-balloon-in 0.22s ease-out' }}
          >
            <div
              className="relative rounded-2xl px-4 py-3"
              style={{
                background: 'linear-gradient(135deg, rgba(15,23,42,0.97), rgba(15,23,42,0.85))',
                border: `1px solid ${visual.iris}55`,
                boxShadow: `0 12px 30px -8px rgba(0,0,0,0.5), 0 0 14px ${visual.glow}`,
              }}
            >
              {/* Seta apontando pro olho */}
              <div
                className="absolute -left-1.5 bottom-4 w-3 h-3 rotate-45"
                style={{
                  background: 'rgba(15,23,42,0.95)',
                  borderLeft: `1px solid ${visual.iris}55`,
                  borderBottom: `1px solid ${visual.iris}55`,
                }}
              />
              {/* Linha gradient no topo */}
              <div
                className="absolute top-0 left-3 right-3 h-px rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${visual.iris}, transparent)` }}
              />

              <p className="text-sm text-white leading-snug font-medium">
                {state.message.text}
              </p>
              {state.message.author && (
                <p className="text-[11px] mt-1 italic" style={{ color: visual.iris }}>
                  — {state.message.author}
                </p>
              )}

              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/8">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                    className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 transition"
                    title={state.muted ? 'Ativar mensagens' : 'Silenciar'}
                  >
                    {state.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowSettings(true); }}
                    className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 transition"
                    title="Opções"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded transition"
                  style={{ color: visual.iris }}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de configurações */}
      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowSettings(false); }}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.97), rgba(15,23,42,0.88))',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-black text-white mb-1">Foco Sentinela</h3>
            <p className="text-xs text-slate-500 mb-4">Companheiro virtual do Foco Federal.</p>

            <div className="space-y-2">
              <button
                onClick={toggleMute}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/8 hover:border-white/20 transition text-left"
              >
                {state.muted
                  ? <Volume2 className="w-4 h-4 text-emerald-400" />
                  : <VolumeX className="w-4 h-4 text-slate-400" />}
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">
                    {state.muted ? 'Ativar mensagens' : 'Silenciar mensagens'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {state.muted ? 'Volta a falar com você' : 'Continua visível, mas calado'}
                  </p>
                </div>
              </button>

              <button
                onClick={handleHide}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/8 hover:border-red-500/30 transition text-left"
              >
                <EyeOff className="w-4 h-4 text-red-400" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">Ocultar Sentinela</p>
                  <p className="text-[11px] text-slate-500">Esconde até você reativar nas Configurações</p>
                </div>
              </button>
            </div>

            {state.stats && (
              <div className="mt-4 pt-4 border-t border-white/8 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Nível</p>
                  <p className="text-base font-black text-white">{state.stats.level}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Sequência</p>
                  <p className="text-base font-black text-orange-400">{state.stats.streak}d</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Acerto</p>
                  <p className="text-base font-black text-emerald-400">{state.stats.accuracy}%</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
