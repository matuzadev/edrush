'use client';

import { ReactNode } from 'react';
import { getBorder, BorderDef } from '@/data/borders';

interface AvatarBorderProps {
  slug: string | null | undefined;
  size: number;            // px do avatar interno (a borda adiciona ~12px de raio)
  children: ReactNode;     // o avatar (SVG, img, etc.)
  className?: string;
  showSparkles?: boolean;  // override pra esconder partículas em locais pequenos
}

export function AvatarBorder({ slug, size, children, className, showSparkles = true }: AvatarBorderProps) {
  const border = getBorder(slug);
  const ringWidth = border.style.width ?? 3;
  const padding = ringWidth + 2; // gap entre ring e conteúdo
  const totalSize = size + (padding + ringWidth) * 2;

  // Animation timing/uniqueness por slug pra rotates não sincronizarem visualmente
  const animId = `border-${border.slug}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className ?? ''}`}
      style={{
        width: totalSize,
        height: totalSize,
      }}
    >
      <style>{`
        @keyframes ${animId}-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ${animId}-pulse {
          0%, 100% { box-shadow: 0 0 ${border.style.glowSize ?? 12}px ${border.style.glow}; }
          50%      { box-shadow: 0 0 ${(border.style.glowSize ?? 12) + 8}px ${border.style.glow}; }
        }
        @keyframes ${animId}-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50%      { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Anel externo (borda) */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: border.style.ring,
          padding: ringWidth,
          boxShadow: `0 0 ${border.style.glowSize ?? 12}px ${border.style.glow}`,
          animation: [
            border.style.rotate ? `${animId}-rotate 6s linear infinite` : null,
            border.style.pulse ? `${animId}-pulse 2.4s ease-in-out infinite` : null,
          ].filter(Boolean).join(', ') || undefined,
        }}
      >
        {/* Máscara interna (gap entre ring e avatar) */}
        <div
          className="w-full h-full rounded-full"
          style={{ background: '#020617' }}
        />
      </div>

      {/* Avatar interno */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{ width: size, height: size }}
      >
        {children}
      </div>

      {/* Sparkles decorativos (só pra bordas com sparkle e tamanhos médios+) */}
      {border.style.sparkle && showSparkles && size >= 48 && (
        <>
          <span
            className="absolute pointer-events-none"
            style={{
              top: '8%',
              right: '12%',
              width: 6,
              height: 6,
              background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
              borderRadius: '50%',
              animation: `${animId}-sparkle 1.6s ease-in-out infinite`,
              animationDelay: '0s',
            }}
          />
          <span
            className="absolute pointer-events-none"
            style={{
              bottom: '14%',
              left: '8%',
              width: 5,
              height: 5,
              background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
              borderRadius: '50%',
              animation: `${animId}-sparkle 1.6s ease-in-out infinite`,
              animationDelay: '0.6s',
            }}
          />
          <span
            className="absolute pointer-events-none"
            style={{
              top: '38%',
              left: '6%',
              width: 4,
              height: 4,
              background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
              borderRadius: '50%',
              animation: `${animId}-sparkle 1.6s ease-in-out infinite`,
              animationDelay: '1.0s',
            }}
          />
        </>
      )}
    </div>
  );
}

export type { BorderDef };
