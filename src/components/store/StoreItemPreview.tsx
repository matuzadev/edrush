'use client';

import { getAvatar } from '@/data/avatars';

// ─── Renderização visual de cada categoria de item da loja ────────────
// Para avatares (órgão), reaproveita o catálogo de avatares (`avatarId`).
// Para os demais (vitória, bordas, badges e buffs), produz SVGs
// inline pequenos e estilizados — isso evita criar 27 arquivos novos
// e mantém o catálogo todo data-driven.

export type ItemCategory =
  | 'avatar_orgao'
  | 'avatar_vitoria'
  | 'borda_perfil'
  | 'mini_logo_badge'
  | 'exp_buff';

export interface StoreItemLite {
  id: string;
  slug: string;
  name: string;
  rarity: string;
  category: string;
  metadata: unknown;
  imageUrl?: string | null;
}

interface Props {
  item: StoreItemLite;
  size?: number; // px
}

// ─── Helpers para metadata estruturada ───────────────────────────────
function asObj(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function getAvatarId(meta: unknown): number | null {
  const obj = asObj(meta);
  const id = obj.avatarId;
  return typeof id === 'number' ? id : null;
}

// ─── Cores por raridade (halo de fundo) ──────────────────────────────
const RARITY_COLOR: Record<string, string> = {
  common: '#64748b',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
  mythic: '#f43f5e',
};

const RARITY_GLOW: Record<string, string> = {
  common: 'rgba(100,116,139,0.25)',
  rare: 'rgba(59,130,246,0.35)',
  epic: 'rgba(168,85,247,0.45)',
  legendary: 'rgba(245,158,11,0.55)',
  mythic: 'rgba(244,63,94,0.65)',
};

// ─── Avatares de "vitória" (SVG inline por kind) ─────────────────────
function VictoryAvatar({ kind, size }: { kind: string; size: number }) {
  const s = size;
  if (kind === 'trofeu') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="trf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="#1c1300" stroke="#92400e" strokeWidth="1.5" />
        <path d="M22 14h20v8c0 7-4.5 12-10 12s-10-5-10-12v-8z" fill="url(#trf)" stroke="#fbbf24" />
        <path d="M22 18h-4v4c0 3 2 5 4 5" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
        <path d="M42 18h4v4c0 3-2 5-4 5" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
        <rect x="26" y="36" width="12" height="3" fill="#92400e" />
        <rect x="22" y="40" width="20" height="4" rx="1" fill="#78350f" />
      </svg>
    );
  }
  if (kind === 'coroa') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="cra" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="#1a0d2e" stroke="#7e22ce" strokeWidth="1.5" />
        <path d="M14 36 L18 22 L24 32 L32 18 L40 32 L46 22 L50 36 Z" fill="url(#cra)" stroke="#fbbf24" />
        <rect x="14" y="36" width="36" height="6" rx="1" fill="#a16207" />
        <circle cx="18" cy="22" r="2" fill="#ef4444" />
        <circle cx="32" cy="18" r="2.5" fill="#a855f7" />
        <circle cx="46" cy="22" r="2" fill="#3b82f6" />
      </svg>
    );
  }
  if (kind === 'medalha-ouro') {
    return (
      <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
        <defs>
          <radialGradient id="med" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#a16207" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="#1c1300" stroke="#92400e" strokeWidth="1.5" />
        <path d="M22 12 L26 22 L20 22 Z" fill="#dc2626" />
        <path d="M42 12 L38 22 L44 22 Z" fill="#1d4ed8" />
        <circle cx="32" cy="36" r="14" fill="url(#med)" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="32" y="40" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="11" fill="#7c2d12">1</text>
      </svg>
    );
  }
  // louros (default)
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill="#0a1f14" stroke="#15803d" strokeWidth="1.5" />
      <path d="M14 32 Q14 22 22 18 Q24 28 22 36 Q18 36 14 32 Z" fill="#16a34a" stroke="#22c55e" />
      <path d="M50 32 Q50 22 42 18 Q40 28 42 36 Q46 36 50 32 Z" fill="#16a34a" stroke="#22c55e" />
      <path d="M16 36 Q22 42 32 44 Q42 42 48 36" stroke="#22c55e" strokeWidth="1.5" fill="none" />
      <text x="32" y="34" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="13" fill="#fbbf24">★</text>
    </svg>
  );
}

// ─── Bordas de perfil (preview com anel grosso colorido) ─────────────
const BORDER_GRADIENTS: Record<string, string> = {
  gray: 'linear-gradient(135deg, #94a3b8, #475569)',
  silver: 'linear-gradient(135deg, #e2e8f0, #94a3b8)',
  bronze: 'linear-gradient(135deg, #d97706, #92400e)',
  blue: 'linear-gradient(135deg, #60a5fa, #1e40af)',
  violet: 'linear-gradient(135deg, #a78bfa, #6d28d9)',
  gold: 'linear-gradient(135deg, #fde047, #b45309)',
  ruby: 'linear-gradient(135deg, #fb7185, #9f1239)',
};

function BorderPreview({ slug, meta, size }: { slug: string; meta: unknown; size: number }) {
  const obj = asObj(meta);
  const color = typeof obj.color === 'string' ? obj.color : 'gray';
  const animated = obj.animated === true;
  const customGradient = typeof obj.gradient === 'string' ? obj.gradient : null;

  const ring = customGradient
    ? `linear-gradient(135deg, #fbbf24, #d946ef, #06b6d4)`
    : BORDER_GRADIENTS[color] ?? BORDER_GRADIENTS.gray;

  const animId = `bp-${slug.replace(/[^a-zA-Z0-9]/g, '')}`;
  const padding = Math.max(3, Math.round(size * 0.08));

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {animated && (
        <style>{`
          @keyframes ${animId}-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes ${animId}-glow {
            0%, 100% { box-shadow: 0 0 12px rgba(217,70,239,0.45); }
            50%      { box-shadow: 0 0 24px rgba(217,70,239,0.75); }
          }
        `}</style>
      )}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: ring,
          padding,
          animation: animated ? `${animId}-spin 5s linear infinite, ${animId}-glow 2.4s ease-in-out infinite` : undefined,
        }}
      >
        <div className="w-full h-full rounded-full" style={{ background: '#020617' }} />
      </div>
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: size - padding * 2,
          height: size - padding * 2,
          background: '#0f172a',
          color: '#94a3b8',
          fontWeight: 800,
          fontSize: size * 0.22,
        }}
      >
        AA
      </div>
    </div>
  );
}

// ─── Badges (mini logos verificado/veterano/etc) ─────────────────────
function BadgePreview({ kind, size }: { kind: string; size: number }) {
  const s = size;
  switch (kind) {
    case 'verified':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <path d="M32 4 L40 10 L50 10 L52 20 L60 26 L56 36 L60 46 L50 50 L44 58 L32 56 L20 58 L14 50 L4 46 L8 36 L4 26 L12 20 L14 10 L24 10 Z" fill="#3b82f6" stroke="#1e40af" strokeWidth="1.5" />
          <path d="M22 32 L29 40 L44 24" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'veteran':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" fill="#7c2d12" stroke="#92400e" strokeWidth="2" />
          <path d="M32 14 L36 26 L48 26 L38 34 L42 46 L32 38 L22 46 L26 34 L16 26 L28 26 Z" fill="#fbbf24" />
        </svg>
      );
    case 'top-contributor':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="tc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
          </defs>
          <path d="M32 4 L48 14 L48 38 L32 60 L16 38 L16 14 Z" fill="url(#tc)" stroke="#c084fc" strokeWidth="2" />
          <text x="32" y="34" textAnchor="middle" fontWeight="900" fontFamily="Arial" fontSize="14" fill="#fff">TOP</text>
        </svg>
      );
    case 'beta-tester':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="2" />
          <text x="32" y="38" textAnchor="middle" fontWeight="900" fontFamily="Arial" fontSize="18" fill="#7dd3fc">β</text>
        </svg>
      );
    case 'founder':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="fdr" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>
          <path d="M32 4 L40 10 L50 10 L52 20 L60 26 L56 36 L60 46 L50 50 L44 58 L32 56 L20 58 L14 50 L4 46 L8 36 L4 26 L12 20 L14 10 L24 10 Z" fill="url(#fdr)" stroke="#92400e" strokeWidth="2" />
          <text x="32" y="38" textAnchor="middle" fontWeight="900" fontFamily="Arial" fontSize="14" fill="#451a03">F</text>
        </svg>
      );
    case 'perito':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <defs>
            <radialGradient id="prt" cx="0.5" cy="0.5" r="0.6">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0e7490" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#prt)" stroke="#67e8f9" strokeWidth="2" />
          <circle cx="32" cy="32" r="18" fill="none" stroke="#fde047" strokeWidth="2" />
          <circle cx="32" cy="32" r="9" fill="none" stroke="#fde047" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="2.5" fill="#fde047" />
          <line x1="32" y1="9" x2="32" y2="16" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="32" y1="48" x2="32" y2="55" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="9" y1="32" x2="16" y2="32" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="48" y1="32" x2="55" y2="32" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'maratonista':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="mrt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#mrt)" stroke="#fed7aa" strokeWidth="2" />
          <path d="M16 40 L26 30 L34 36 L48 22" stroke="#fef3c7" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="48" cy="22" r="3.5" fill="#fde047" stroke="#fef3c7" strokeWidth="0.8" />
          <circle cx="26" cy="30" r="2" fill="#fef3c7" />
          <circle cx="34" cy="36" r="2" fill="#fef3c7" />
          <circle cx="16" cy="40" r="2" fill="#fef3c7" />
        </svg>
      );
    case 'aprovado':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="apv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#apv)" stroke="#052e16" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="28" fill="none" stroke="#052e16" strokeWidth="1" strokeDasharray="2.5 3" />
          <path d="M19 33 L28 43 L46 22" stroke="#052e16" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill="#1e293b" stroke="#475569" strokeWidth="2" />
    </svg>
  );
}

// ─── EXP Buff (relógio + multiplicador) ──────────────────────────────
function BuffPreview({ meta, size }: { meta: unknown; size: number }) {
  const obj = asObj(meta);
  const mult = typeof obj.multiplier === 'number' ? obj.multiplier : 1.5;
  const hours = typeof obj.durationHours === 'number' ? obj.durationHours : 24;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="bf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#022c22" stroke="#065f46" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="22" fill="url(#bf)" stroke="#34d399" strokeWidth="1.5" />
      <text x="32" y="30" textAnchor="middle" fontWeight="900" fontFamily="Arial" fontSize="13" fill="#fff">{mult}x</text>
      <text x="32" y="42" textAnchor="middle" fontWeight="700" fontFamily="Arial" fontSize="7" fill="#a7f3d0">EXP {hours}h</text>
    </svg>
  );
}

// ─── Componente principal ─────────────────────────────────────────────
export function StoreItemPreview({ item, size = 96 }: Props) {
  const haloColor = RARITY_COLOR[item.rarity] ?? RARITY_COLOR.common;
  const haloGlow = RARITY_GLOW[item.rarity] ?? RARITY_GLOW.common;
  const obj = asObj(item.metadata);

  let inner: React.ReactNode = null;

  // Se um imageUrl externo for fornecido (ex.: arquivo em /public), ele tem prioridade
  // sobre os SVGs inline gerados por categoria. Aceita paths absolutos (/foo.svg),
  // URLs http(s) e data: URIs.
  const hasExternalImage =
    typeof item.imageUrl === 'string' &&
    item.imageUrl.length > 0 &&
    (item.imageUrl.startsWith('/') ||
      item.imageUrl.startsWith('http') ||
      item.imageUrl.startsWith('data:'));

  if (hasExternalImage) {
    inner = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.imageUrl as string}
        alt={item.name}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain', borderRadius: '50%' }}
      />
    );
  } else if (item.category === 'avatar_orgao') {
    const avatarId = getAvatarId(item.metadata);
    if (avatarId !== null) {
      const def = getAvatar(avatarId);
      inner = (
        <div
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: def.svg }}
        />
      );
    }
  } else if (item.category === 'avatar_vitoria') {
    const kind = typeof obj.kind === 'string' ? obj.kind : 'trofeu';
    inner = <VictoryAvatar kind={kind} size={size} />;
  } else if (item.category === 'borda_perfil') {
    inner = <BorderPreview slug={item.slug} meta={item.metadata} size={size} />;
  } else if (item.category === 'mini_logo_badge') {
    const kind = typeof obj.kind === 'string' ? obj.kind : 'verified';
    inner = <BadgePreview kind={kind} size={size} />;
  } else if (item.category === 'exp_buff') {
    inner = <BuffPreview meta={item.metadata} size={size} />;
  }

  return (
    <div
      className="relative inline-flex items-center justify-center rounded-2xl"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${haloColor}22 0%, transparent 70%)`,
        boxShadow: `0 0 24px ${haloGlow}`,
      }}
    >
      {inner}
    </div>
  );
}

// Mini-versão (usado em listas compactas, perfil público)
export function StoreItemThumb({ item, size = 36 }: Props) {
  return <StoreItemPreview item={item} size={size} />;
}
