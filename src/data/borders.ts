// Catálogo de bordas. Cada borda é um anel decorativo aplicado ao avatar.
// Renderizado via CSS (gradient + box-shadow + animação) em vez de SVG complexo,
// para ficar leve e escalar com qualquer tamanho de avatar.

export type BorderTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

// Todos os critérios são avaliados contra o objeto UserStats (lib/borders.ts)
export type BorderCriteriaType =
  | 'level'              // user.level >= value
  | 'streak'             // user.streak >= value
  | 'questions'          // user.totalAnswered >= value
  | 'accuracy'           // user.accuracy >= value (com mínimo de respostas)
  | 'sessions'           // user.totalSessions >= value
  | 'medals'             // user.medals desbloqueadas >= value
  | 'special';           // unlock manual (admin/launch event)

export interface BorderDef {
  slug: string;
  name: string;
  description: string;
  tier: BorderTier;
  criteria: {
    type: BorderCriteriaType;
    value: number;
    minQuestions?: number; // para accuracy (evita "100% com 1 questão")
  };
  // Estilo visual aplicado como CSS ring + glow + animação opcional
  style: {
    ring: string;          // background do ring (gradient ou cor)
    glow: string;          // box-shadow color
    glowSize?: number;     // px do glow externo (default 12)
    pulse?: boolean;       // animação de pulse
    rotate?: boolean;      // gradient gira
    sparkle?: boolean;     // partículas de brilho
    width?: number;        // espessura do ring em px (default 3)
  };
}

// ───── 18 bordas em 5 tiers ─────
export const BORDERS: BorderDef[] = [
  // ── BRONZE — primeiros passos ──
  {
    slug: 'recruta',
    name: 'Recruta',
    description: 'Bem-vindo ao Foco Federal — bordadefault concedida a todos.',
    tier: 'bronze',
    criteria: { type: 'special', value: 0 },
    style: {
      ring: 'linear-gradient(135deg, #475569, #64748b)',
      glow: 'rgba(100,116,139,0.30)',
      glowSize: 8,
    },
  },
  {
    slug: 'estreante',
    name: 'Estreante',
    description: 'Respondeu suas primeiras 10 questões.',
    tier: 'bronze',
    criteria: { type: 'questions', value: 10 },
    style: {
      ring: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      glow: 'rgba(245,158,11,0.40)',
    },
  },
  {
    slug: 'dedicado',
    name: 'Dedicado',
    description: '3 dias seguidos estudando.',
    tier: 'bronze',
    criteria: { type: 'streak', value: 3 },
    style: {
      ring: 'linear-gradient(135deg, #d97706, #f97316)',
      glow: 'rgba(249,115,22,0.40)',
    },
  },
  {
    slug: 'iniciante',
    name: 'Iniciante',
    description: 'Atingiu o Nível 3.',
    tier: 'bronze',
    criteria: { type: 'level', value: 3 },
    style: {
      ring: 'linear-gradient(135deg, #b45309, #f59e0b)',
      glow: 'rgba(180,83,9,0.40)',
    },
  },

  // ── SILVER — evolução constante ──
  {
    slug: 'concurseiro',
    name: 'Concurseiro',
    description: '100 questões respondidas.',
    tier: 'silver',
    criteria: { type: 'questions', value: 100 },
    style: {
      ring: 'linear-gradient(135deg, #94a3b8, #cbd5e1, #94a3b8)',
      glow: 'rgba(148,163,184,0.45)',
      glowSize: 14,
    },
  },
  {
    slug: 'persistente',
    name: 'Persistente',
    description: 'Sequência de 7 dias.',
    tier: 'silver',
    criteria: { type: 'streak', value: 7 },
    style: {
      ring: 'linear-gradient(135deg, #64748b, #e2e8f0, #64748b)',
      glow: 'rgba(226,232,240,0.40)',
      glowSize: 14,
    },
  },
  {
    slug: 'aspirante',
    name: 'Aspirante',
    description: 'Atingiu o Nível 5.',
    tier: 'silver',
    criteria: { type: 'level', value: 5 },
    style: {
      ring: 'linear-gradient(135deg, #475569, #94a3b8, #475569)',
      glow: 'rgba(148,163,184,0.50)',
      glowSize: 14,
    },
  },
  {
    slug: 'preciso',
    name: 'Preciso',
    description: '70%+ de acerto em 100 questões.',
    tier: 'silver',
    criteria: { type: 'accuracy', value: 70, minQuestions: 100 },
    style: {
      ring: 'linear-gradient(135deg, #06b6d4, #67e8f9, #06b6d4)',
      glow: 'rgba(6,182,212,0.45)',
      glowSize: 14,
    },
  },

  // ── GOLD — domínio sólido ──
  {
    slug: 'estrategista',
    name: 'Estrategista',
    description: '500 questões respondidas.',
    tier: 'gold',
    criteria: { type: 'questions', value: 500 },
    style: {
      ring: 'linear-gradient(135deg, #ca8a04, #fde047, #ca8a04)',
      glow: 'rgba(234,179,8,0.55)',
      glowSize: 16,
      pulse: true,
    },
  },
  {
    slug: 'foco-laser',
    name: 'Foco Laser',
    description: '30 dias consecutivos.',
    tier: 'gold',
    criteria: { type: 'streak', value: 30 },
    style: {
      ring: 'linear-gradient(135deg, #f59e0b, #fef3c7, #f59e0b)',
      glow: 'rgba(245,158,11,0.55)',
      glowSize: 16,
      pulse: true,
    },
  },
  {
    slug: 'veterano',
    name: 'Veterano',
    description: 'Atingiu o Nível 8.',
    tier: 'gold',
    criteria: { type: 'level', value: 8 },
    style: {
      ring: 'linear-gradient(135deg, #b45309, #fbbf24, #b45309)',
      glow: 'rgba(251,191,36,0.55)',
      glowSize: 18,
      pulse: true,
    },
  },
  {
    slug: 'cirurgico',
    name: 'Cirúrgico',
    description: '85%+ de acerto em 300 questões.',
    tier: 'gold',
    criteria: { type: 'accuracy', value: 85, minQuestions: 300 },
    style: {
      ring: 'linear-gradient(135deg, #047857, #34d399, #047857)',
      glow: 'rgba(52,211,153,0.55)',
      glowSize: 16,
      pulse: true,
    },
  },

  // ── PLATINUM — elite ──
  {
    slug: 'aprovado',
    name: 'Aprovado',
    description: '1000 questões respondidas.',
    tier: 'platinum',
    criteria: { type: 'questions', value: 1000 },
    style: {
      ring: 'conic-gradient(from 0deg, #a855f7, #ec4899, #06b6d4, #a855f7)',
      glow: 'rgba(168,85,247,0.65)',
      glowSize: 22,
      rotate: true,
      width: 4,
    },
  },
  {
    slug: 'inabalavel',
    name: 'Inabalável',
    description: '60 dias consecutivos.',
    tier: 'platinum',
    criteria: { type: 'streak', value: 60 },
    style: {
      ring: 'conic-gradient(from 0deg, #f97316, #fbbf24, #ec4899, #f97316)',
      glow: 'rgba(249,115,22,0.65)',
      glowSize: 22,
      rotate: true,
      width: 4,
    },
  },
  {
    slug: 'lendario',
    name: 'Lendário',
    description: 'Atingiu o Nível 10 — o topo.',
    tier: 'platinum',
    criteria: { type: 'level', value: 10 },
    style: {
      ring: 'conic-gradient(from 0deg, #fbbf24, #f97316, #ec4899, #a855f7, #fbbf24)',
      glow: 'rgba(251,191,36,0.70)',
      glowSize: 24,
      rotate: true,
      width: 4,
    },
  },

  // ── DIAMOND — supremo ──
  {
    slug: 'diamante',
    name: 'Diamante',
    description: '95%+ acerto em 500 questões. Para os mais precisos.',
    tier: 'diamond',
    criteria: { type: 'accuracy', value: 95, minQuestions: 500 },
    style: {
      ring: 'conic-gradient(from 0deg, #67e8f9, #a78bfa, #f0abfc, #67e8f9)',
      glow: 'rgba(167,139,250,0.75)',
      glowSize: 28,
      rotate: true,
      sparkle: true,
      width: 4,
    },
  },
  {
    slug: 'maratonista',
    name: 'Maratonista',
    description: '100 dias consecutivos. A jornada da aprovação.',
    tier: 'diamond',
    criteria: { type: 'streak', value: 100 },
    style: {
      ring: 'conic-gradient(from 0deg, #fde047, #fbbf24, #f97316, #ec4899, #a855f7, #06b6d4, #fde047)',
      glow: 'rgba(253,224,71,0.80)',
      glowSize: 30,
      rotate: true,
      sparkle: true,
      width: 4,
    },
  },
  {
    slug: 'foco-federal',
    name: 'Foco Federal',
    description: 'Sua farda. Conquistada por aprovados que cumprem todas as etapas.',
    tier: 'diamond',
    criteria: { type: 'medals', value: 18 },
    style: {
      ring: 'conic-gradient(from 0deg, #10b981, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #fbbf24, #10b981)',
      glow: 'rgba(16,185,129,0.85)',
      glowSize: 32,
      rotate: true,
      sparkle: true,
      width: 5,
    },
  },
];

export const BORDER_BY_SLUG: Record<string, BorderDef> = Object.fromEntries(
  BORDERS.map(b => [b.slug, b])
);

export function getBorder(slug: string | null | undefined): BorderDef {
  if (!slug) return BORDERS[0];
  return BORDER_BY_SLUG[slug] ?? BORDERS[0];
}

// Cores dos tiers (para badges/labels)
export const TIER_COLOR: Record<BorderTier, { color: string; bg: string; border: string; label: string }> = {
  bronze:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.30)',  label: 'Bronze' },
  silver:   { color: '#cbd5e1', bg: 'rgba(203,213,225,0.10)', border: 'rgba(203,213,225,0.30)', label: 'Prata' },
  gold:     { color: '#fde047', bg: 'rgba(253,224,71,0.10)',  border: 'rgba(253,224,71,0.30)',  label: 'Ouro' },
  platinum: { color: '#a855f7', bg: 'rgba(168,85,247,0.10)',  border: 'rgba(168,85,247,0.30)',  label: 'Platina' },
  diamond:  { color: '#67e8f9', bg: 'rgba(103,232,249,0.10)', border: 'rgba(103,232,249,0.40)', label: 'Diamante' },
};

// Stats do usuário usados para avaliar critérios
export interface UserBorderStats {
  level: number;
  streak: number;
  totalAnswered: number;
  accuracy: number;
  totalSessions: number;
  medals: number;
}

// Verifica se um critério foi atingido
export function meetsCriteria(border: BorderDef, stats: UserBorderStats): boolean {
  const c = border.criteria;
  switch (c.type) {
    case 'level':     return stats.level >= c.value;
    case 'streak':    return stats.streak >= c.value;
    case 'questions': return stats.totalAnswered >= c.value;
    case 'accuracy':  return stats.accuracy >= c.value && stats.totalAnswered >= (c.minQuestions ?? 0);
    case 'sessions':  return stats.totalSessions >= c.value;
    case 'medals':    return stats.medals >= c.value;
    case 'special':   return border.slug === 'recruta'; // recruta é grátis, demais 'special' precisam unlock manual
  }
}

// Texto descritivo do critério (para UI)
export function describeCriteria(border: BorderDef): string {
  const c = border.criteria;
  switch (c.type) {
    case 'level':     return `Atingir nível ${c.value}`;
    case 'streak':    return `${c.value} dias consecutivos`;
    case 'questions': return `Responder ${c.value} questões`;
    case 'accuracy':  return `${c.value}% de acerto em ${c.minQuestions}+ questões`;
    case 'sessions':  return `Completar ${c.value} sessões`;
    case 'medals':    return `Desbloquear ${c.value} medalhas`;
    case 'special':   return border.slug === 'recruta' ? 'Bem-vindo!' : 'Conquista especial';
  }
}
