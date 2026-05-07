// Catálogo de bordas. Cada borda é única em estilo, gradient e animação.
// Renderização via CSS puro em src/components/AvatarBorder.tsx.

export type BorderTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'mythic';

export type BorderCriteriaType =
  | 'level' | 'streak' | 'questions' | 'accuracy' | 'sessions' | 'medals' | 'special';

export interface BorderStyle {
  ring: string;
  glow: string;
  glowSize?: number;
  width?: number;
  // Animações combinable
  pulse?: boolean;        // glow respira (lento)
  pulseFast?: boolean;    // glow respira rápido + inset glow
  rotate?: boolean;       // ring gira (sentido horário)
  rotateReverse?: boolean;// ring gira (anti-horário)
  rotateSpeed?: number;   // segundos por volta (default 6)
  breathe?: boolean;      // scale 1↔1.04
  sparkle?: boolean;      // partículas brilhando
  shimmer?: boolean;      // varredura de luz dentro do ring
  rays?: boolean;         // 8 raios externos pulsando
  dualRing?: string;      // segundo ring decorativo (gira em sentido oposto)
}

export interface BorderDef {
  slug: string;
  name: string;
  description: string;
  tier: BorderTier;
  criteria: { type: BorderCriteriaType; value: number; minQuestions?: number };
  style: BorderStyle;
  exclusive?: boolean; // se true, só os e-mails em EXCLUSIVE_OWNERS podem ver/equipar
}

// Bordas exclusivas — slug → e-mails autorizados (lowercased)
export const EXCLUSIVE_OWNERS: Record<string, string[]> = {
  'foco-ceo': ['matheus@gmail.com'],
};

export const BORDERS: BorderDef[] = [
  // ─────────────────────── BRONZE — primeiros passos ───────────────────────
  {
    slug: 'recruta',
    name: 'Recruta',
    description: 'Sua primeira borda. Bem-vindo ao Foco Federal.',
    tier: 'bronze',
    criteria: { type: 'special', value: 0 },
    style: {
      ring: 'linear-gradient(135deg, #475569 0%, #94a3b8 50%, #334155 100%)',
      glow: 'rgba(148,163,184,0.35)',
      glowSize: 8,
      width: 2,
      breathe: true,
    },
  },
  {
    slug: 'estreante',
    name: 'Estreante',
    description: 'Você respondeu suas primeiras 10 questões.',
    tier: 'bronze',
    criteria: { type: 'questions', value: 10 },
    style: {
      ring: 'linear-gradient(45deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%)',
      glow: 'rgba(251,191,36,0.55)',
      glowSize: 12,
      width: 3,
      shimmer: true,
    },
  },
  {
    slug: 'dedicado',
    name: 'Dedicado',
    description: 'Três dias seguidos sem falhar.',
    tier: 'bronze',
    criteria: { type: 'streak', value: 3 },
    style: {
      ring: 'conic-gradient(from 0deg at 50% 50%, #ea580c 0%, #fb923c 25%, #f97316 50%, #fb923c 75%, #ea580c 100%)',
      glow: 'rgba(249,115,22,0.55)',
      glowSize: 14,
      width: 3,
      rotate: true,
      rotateSpeed: 8,
    },
  },
  {
    slug: 'iniciante',
    name: 'Iniciante',
    description: 'Atingiu o Nível 3 — começou a jornada.',
    tier: 'bronze',
    criteria: { type: 'level', value: 3 },
    style: {
      ring: 'linear-gradient(180deg, #b45309 0%, #f59e0b 30%, #fef3c7 50%, #f59e0b 70%, #92400e 100%)',
      glow: 'rgba(180,83,9,0.50)',
      glowSize: 14,
      width: 3,
      pulse: true,
    },
  },

  // ─────────────────────── PRATA — evolução constante ───────────────────────
  {
    slug: 'concurseiro',
    name: 'Concurseiro',
    description: '100 questões respondidas. Está virando rotina.',
    tier: 'silver',
    criteria: { type: 'questions', value: 100 },
    style: {
      ring: 'linear-gradient(135deg, #475569 0%, #cbd5e1 25%, #f1f5f9 50%, #cbd5e1 75%, #475569 100%)',
      glow: 'rgba(226,232,240,0.55)',
      glowSize: 16,
      width: 3,
      shimmer: true,
      breathe: true,
    },
  },
  {
    slug: 'persistente',
    name: 'Persistente',
    description: 'Sequência de 7 dias. Disciplina virou hábito.',
    tier: 'silver',
    criteria: { type: 'streak', value: 7 },
    style: {
      ring: 'conic-gradient(from 0deg, #64748b 0%, #e2e8f0 50%, #64748b 100%)',
      glow: 'rgba(226,232,240,0.55)',
      glowSize: 16,
      width: 3,
      rotate: true,
      rotateSpeed: 10,
      pulse: true,
    },
  },
  {
    slug: 'aspirante',
    name: 'Aspirante',
    description: 'Atingiu o Nível 5 — concurseiro aplicado.',
    tier: 'silver',
    criteria: { type: 'level', value: 5 },
    style: {
      ring: 'linear-gradient(135deg, #1e293b, #94a3b8, #f8fafc, #94a3b8, #1e293b)',
      glow: 'rgba(241,245,249,0.60)',
      glowSize: 18,
      width: 3,
      dualRing: 'conic-gradient(from 90deg, #94a3b8, transparent 30%, transparent 70%, #94a3b8)',
      rotate: true,
      rotateSpeed: 8,
    },
  },
  {
    slug: 'preciso',
    name: 'Preciso',
    description: '70%+ de acerto em 100 questões. Mira afiada.',
    tier: 'silver',
    criteria: { type: 'accuracy', value: 70, minQuestions: 100 },
    style: {
      ring: 'radial-gradient(circle at 30% 30%, #67e8f9, #06b6d4 40%, #0e7490 80%)',
      glow: 'rgba(34,211,238,0.65)',
      glowSize: 16,
      width: 3,
      pulseFast: true,
    },
  },

  // ─────────────────────── OURO — domínio sólido ───────────────────────
  {
    slug: 'estrategista',
    name: 'Estrategista',
    description: '500 questões respondidas. Já sabe onde focar.',
    tier: 'gold',
    criteria: { type: 'questions', value: 500 },
    style: {
      ring: 'conic-gradient(from 0deg, #ca8a04 0%, #fde047 25%, #fef9c3 50%, #fde047 75%, #ca8a04 100%)',
      glow: 'rgba(234,179,8,0.65)',
      glowSize: 18,
      width: 4,
      rotate: true,
      rotateSpeed: 7,
      pulse: true,
    },
  },
  {
    slug: 'foco-laser',
    name: 'Foco Laser',
    description: '30 dias consecutivos. Inabalável.',
    tier: 'gold',
    criteria: { type: 'streak', value: 30 },
    style: {
      ring: 'linear-gradient(45deg, #f59e0b 0%, #fef3c7 25%, #f97316 50%, #fef3c7 75%, #f59e0b 100%)',
      glow: 'rgba(245,158,11,0.70)',
      glowSize: 20,
      width: 4,
      pulseFast: true,
      shimmer: true,
    },
  },
  {
    slug: 'veterano',
    name: 'Veterano',
    description: 'Atingiu o Nível 8 — entre os mais avançados.',
    tier: 'gold',
    criteria: { type: 'level', value: 8 },
    style: {
      ring: 'conic-gradient(from 45deg, #b45309, #fbbf24, #fef3c7, #fbbf24, #b45309)',
      glow: 'rgba(251,191,36,0.75)',
      glowSize: 22,
      width: 4,
      dualRing: 'linear-gradient(135deg, #fbbf24, transparent, #fbbf24)',
      rotate: true,
      rotateSpeed: 5,
    },
  },
  {
    slug: 'cirurgico',
    name: 'Cirúrgico',
    description: '85%+ acerto em 300 questões. Precisão de bisturi.',
    tier: 'gold',
    criteria: { type: 'accuracy', value: 85, minQuestions: 300 },
    style: {
      ring: 'linear-gradient(135deg, #047857 0%, #34d399 30%, #ecfdf5 50%, #34d399 70%, #047857 100%)',
      glow: 'rgba(52,211,153,0.70)',
      glowSize: 20,
      width: 3,
      shimmer: true,
      breathe: true,
      pulse: true,
    },
  },

  // ─────────────────────── PLATINA — elite ───────────────────────
  {
    slug: 'aprovado',
    name: 'Aprovado',
    description: '1000 questões. Você está pronto pra prova.',
    tier: 'platinum',
    criteria: { type: 'questions', value: 1000 },
    style: {
      ring: 'conic-gradient(from 0deg, #a855f7, #ec4899, #06b6d4, #a855f7)',
      glow: 'rgba(168,85,247,0.75)',
      glowSize: 24,
      width: 4,
      rotate: true,
      rotateSpeed: 4,
      pulseFast: true,
    },
  },
  {
    slug: 'inabalavel',
    name: 'Inabalável',
    description: '60 dias consecutivos. A consistência define você.',
    tier: 'platinum',
    criteria: { type: 'streak', value: 60 },
    style: {
      ring: 'conic-gradient(from 0deg, #f97316, #fbbf24, #ec4899, #a855f7, #f97316)',
      glow: 'rgba(249,115,22,0.80)',
      glowSize: 26,
      width: 4,
      rotate: true,
      rotateSpeed: 5,
      dualRing: 'conic-gradient(from 180deg, #fbbf24, transparent 50%, #fbbf24)',
      shimmer: true,
    },
  },
  {
    slug: 'lendario',
    name: 'Lendário',
    description: 'Nível 10 — você é o topo. Sua farda começou a brilhar.',
    tier: 'platinum',
    criteria: { type: 'level', value: 10 },
    style: {
      ring: 'conic-gradient(from 0deg, #fbbf24, #f97316, #ec4899, #a855f7, #06b6d4, #fbbf24)',
      glow: 'rgba(251,191,36,0.85)',
      glowSize: 28,
      width: 5,
      rotate: true,
      rotateSpeed: 6,
      rays: true,
      pulse: true,
    },
  },

  // ─────────────────────── DIAMANTE — supremo ───────────────────────
  {
    slug: 'diamante',
    name: 'Diamante',
    description: '95%+ acerto em 500 questões. Para os mais cirúrgicos.',
    tier: 'diamond',
    criteria: { type: 'accuracy', value: 95, minQuestions: 500 },
    style: {
      ring: 'conic-gradient(from 0deg, #67e8f9, #a78bfa, #f0abfc, #fef3c7, #67e8f9)',
      glow: 'rgba(167,139,250,0.85)',
      glowSize: 30,
      width: 4,
      rotate: true,
      rotateSpeed: 8,
      sparkle: true,
      shimmer: true,
      breathe: true,
    },
  },
  {
    slug: 'maratonista',
    name: 'Maratonista',
    description: '100 dias consecutivos. A jornada do aprovado.',
    tier: 'diamond',
    criteria: { type: 'streak', value: 100 },
    style: {
      ring: 'conic-gradient(from 0deg, #fde047, #fbbf24, #f97316, #ec4899, #a855f7, #06b6d4, #34d399, #fde047)',
      glow: 'rgba(253,224,71,0.90)',
      glowSize: 32,
      width: 5,
      rotate: true,
      rotateSpeed: 10,
      rotateReverse: false,
      sparkle: true,
      rays: true,
    },
  },
  {
    slug: 'foco-federal',
    name: 'Foco Federal',
    description: 'Sua farda de aprovação. A coroa do Foco Federal.',
    tier: 'diamond',
    criteria: { type: 'medals', value: 18 },
    style: {
      ring: 'conic-gradient(from 0deg, #10b981, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #fbbf24, #10b981)',
      glow: 'rgba(16,185,129,0.95)',
      glowSize: 36,
      width: 5,
      rotate: true,
      rotateSpeed: 4,
      dualRing: 'conic-gradient(from 180deg, #fbbf24, #ec4899, #06b6d4, #fbbf24)',
      sparkle: true,
      shimmer: true,
      pulseFast: true,
      rays: true,
    },
  },

  // ─────────────────────── MÍTICA — exclusiva CEO ───────────────────────
  {
    slug: 'foco-ceo',
    name: 'Fundador',
    description: 'Borda mítica do criador do Foco Federal. Única e intransferível.',
    tier: 'mythic',
    criteria: { type: 'special', value: 0 },
    exclusive: true,
    style: {
      // Gradient holográfico inédito — branco-dourado-rosa-violeta-cyan-esmeralda
      ring: 'conic-gradient(from 0deg, #ffffff 0%, #fde047 12%, #f97316 24%, #ec4899 38%, #a855f7 52%, #06b6d4 66%, #10b981 80%, #fde047 92%, #ffffff 100%)',
      glow: 'rgba(253,224,71,1)',
      glowSize: 44,
      width: 6,
      rotate: true,
      rotateSpeed: 3,
      // Anel duplo gira em sentido oposto, criando efeito de "vortex"
      dualRing: 'conic-gradient(from 90deg, #ffffff, #ec4899 25%, #ffffff 50%, #06b6d4 75%, #ffffff)',
      sparkle: true,
      shimmer: true,
      pulseFast: true,
      rays: true,
      breathe: true,
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

export const TIER_COLOR: Record<BorderTier, { color: string; bg: string; border: string; label: string }> = {
  bronze:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.30)',  label: 'Bronze' },
  silver:   { color: '#cbd5e1', bg: 'rgba(203,213,225,0.10)', border: 'rgba(203,213,225,0.30)', label: 'Prata' },
  gold:     { color: '#fde047', bg: 'rgba(253,224,71,0.10)',  border: 'rgba(253,224,71,0.30)',  label: 'Ouro' },
  platinum: { color: '#c084fc', bg: 'rgba(192,132,252,0.10)', border: 'rgba(192,132,252,0.35)', label: 'Platina' },
  diamond:  { color: '#67e8f9', bg: 'rgba(103,232,249,0.10)', border: 'rgba(103,232,249,0.40)', label: 'Diamante' },
  mythic:   { color: '#fde047', bg: 'rgba(253,224,71,0.12)',  border: 'rgba(253,224,71,0.50)',  label: 'Mítica' },
};

export interface UserBorderStats {
  level: number;
  streak: number;
  totalAnswered: number;
  accuracy: number;
  totalSessions: number;
  medals: number;
}

export function meetsCriteria(border: BorderDef, stats: UserBorderStats): boolean {
  const c = border.criteria;
  switch (c.type) {
    case 'level':     return stats.level >= c.value;
    case 'streak':    return stats.streak >= c.value;
    case 'questions': return stats.totalAnswered >= c.value;
    case 'accuracy':  return stats.accuracy >= c.value && stats.totalAnswered >= (c.minQuestions ?? 0);
    case 'sessions':  return stats.totalSessions >= c.value;
    case 'medals':    return stats.medals >= c.value;
    case 'special':   return border.slug === 'recruta';
  }
}

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
