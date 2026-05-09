'use client';

import { ReactNode } from 'react';
import { getBorder, BorderDef } from '@/data/borders';

interface AvatarBorderProps {
  slug: string | null | undefined;
  size: number;            // px do avatar interno
  children: ReactNode;
  className?: string;
  showSparkles?: boolean;
}

// Cada borda recebe um id único de animação para não compartilhar timeline
function uid(slug: string) {
  return `b-${slug.replace(/[^a-zA-Z0-9]/g, '')}`;
}

export function AvatarBorder({ slug, size, children, className, showSparkles = true }: AvatarBorderProps) {
  const border = getBorder(slug);
  const ringWidth = border.style.width ?? 3;
  const padding = ringWidth + 2;
  const totalSize = size + (padding + ringWidth) * 2;
  const id = uid(border.slug);

  // Decompõe flags de animação
  const { rotate, rotateReverse, pulse, pulseFast, breathe, sparkle, shimmer, rays, dualRing } = border.style;
  const rotSpeed = border.style.rotateSpeed ?? 6;
  const glowSize = border.style.glowSize ?? 12;

  // Combina animações no ring principal
  const ringAnimations: string[] = [];
  if (rotate)        ringAnimations.push(`${id}-rotate ${rotSpeed}s linear infinite`);
  if (rotateReverse) ringAnimations.push(`${id}-rotate-rev ${rotSpeed}s linear infinite`);
  if (pulse)         ringAnimations.push(`${id}-pulse 2.4s ease-in-out infinite`);
  if (pulseFast)     ringAnimations.push(`${id}-pulse-fast 1.2s ease-in-out infinite`);
  if (breathe)       ringAnimations.push(`${id}-breathe 3.2s ease-in-out infinite`);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className ?? ''}`}
      style={{ width: totalSize, height: totalSize }}
    >
      <style>{`
        @keyframes ${id}-rotate     { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes ${id}-rotate-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes ${id}-pulse {
          0%, 100% { box-shadow: 0 0 ${glowSize}px ${border.style.glow}; }
          50%      { box-shadow: 0 0 ${glowSize + 8}px ${border.style.glow}; }
        }
        @keyframes ${id}-pulse-fast {
          0%, 100% { box-shadow: 0 0 ${glowSize}px ${border.style.glow}, inset 0 0 4px ${border.style.glow}; }
          50%      { box-shadow: 0 0 ${glowSize + 12}px ${border.style.glow}, inset 0 0 8px ${border.style.glow}; }
        }
        @keyframes ${id}-breathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.04); }
        }
        @keyframes ${id}-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50%      { opacity: 1; transform: scale(1.3); }
        }
        @keyframes ${id}-shimmer {
          0%   { transform: translateX(-100%) skewX(-12deg); }
          60%  { transform: translateX(180%)  skewX(-12deg); }
          100% { transform: translateX(180%)  skewX(-12deg); }
        }
        @keyframes ${id}-ray {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 0.9; }
        }
      `}</style>

      {/* Anel externo decorativo (segundo ring quando dualRing) */}
      {dualRing && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: border.style.dualRing,
            padding: 1,
            opacity: 0.7,
            animation: rotate ? `${id}-rotate-rev ${rotSpeed * 1.4}s linear infinite` : undefined,
          }}
        >
          <div className="w-full h-full rounded-full" style={{ background: '#020617' }} />
        </div>
      )}

      {/* Raios externos (apenas em bordas com rays) */}
      {rays && size >= 48 && (
        <>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <div
              key={angle}
              className="absolute pointer-events-none"
              style={{
                width: 2,
                height: totalSize / 2 + 6,
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${angle}deg)`,
                background: `linear-gradient(to bottom, transparent, ${border.style.glow} 60%, transparent)`,
                animation: `${id}-ray 1.6s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </>
      )}

      {/* Anel principal */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: border.style.ring,
          padding: ringWidth + (dualRing ? 3 : 0),
          boxShadow: `0 0 ${glowSize}px ${border.style.glow}`,
          animation: ringAnimations.join(', ') || undefined,
        }}
      >
        <div className="w-full h-full rounded-full" style={{ background: '#020617' }} />
      </div>

      {/* Sweep de brilho (shimmer) */}
      {shimmer && (
        <div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          style={{ padding: ringWidth }}
        >
          <div
            className="w-full h-full rounded-full overflow-hidden"
            style={{ background: 'transparent' }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${border.style.glow} 50%, transparent 100%)`,
                animation: `${id}-shimmer 2.8s ease-in-out infinite`,
                mixBlendMode: 'overlay',
              }}
            />
          </div>
        </div>
      )}

      {/* Avatar interno — preenche EXATAMENTE o slot, centralizado */}
      <div
        className="relative rounded-full overflow-hidden flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: '#0f172a',
        }}
      >
        <div className="w-full h-full flex items-center justify-center [&>*]:w-full [&>*]:h-full">
          {children}
        </div>
      </div>

      {/* Sparkles */}
      {sparkle && showSparkles && size >= 44 && (
        <>
          {[
            { top: '6%',  right: '10%', delay: '0s',   sz: 6 },
            { bottom: '12%', left: '6%', delay: '0.5s', sz: 5 },
            { top: '36%', left: '4%',  delay: '1.0s',  sz: 4 },
            { bottom: '28%', right: '8%', delay: '1.5s', sz: 4 },
          ].map((s, i) => (
            <span
              key={i}
              className="absolute pointer-events-none"
              style={{
                ...s,
                width: s.sz,
                height: s.sz,
                background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
                borderRadius: '50%',
                animation: `${id}-sparkle 1.6s ease-in-out infinite`,
                animationDelay: s.delay,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

export type { BorderDef };
