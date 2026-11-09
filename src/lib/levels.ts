// ─── Level system ────────────────────────────────────────────────────────────

export interface LevelInfo {
  level: number;
  name: string;
  color: string;       // tailwind text color
  bg: string;          // tailwind bg color
  border: string;      // tailwind border color
  xpStart: number;     // XP required to reach this level
  xpEnd: number;       // XP required for next level (Infinity for last)
  xpIntoLevel: number; // XP earned since this level started
  xpNeeded: number;    // XP needed to reach next level from current level start
  progressPct: number; // 0-100
}

const LEVELS = [
  { level: 1,  name: 'Recruta',      color: 'text-slate-400',  bg: 'bg-slate-500/15',   border: 'border-slate-500/40',   xpStart: 0     },
  { level: 2,  name: 'Estudante',    color: 'text-green-400',  bg: 'bg-green-500/15',   border: 'border-green-500/40',   xpStart: 150   },
  { level: 3,  name: 'Dedicado',     color: 'text-emerald-400',bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', xpStart: 400   },
  { level: 4,  name: 'Focado',       color: 'text-cyan-400',   bg: 'bg-cyan-500/15',    border: 'border-cyan-500/40',    xpStart: 800   },
  { level: 5,  name: 'Analista',     color: 'text-blue-400',   bg: 'bg-blue-500/15',    border: 'border-blue-500/40',    xpStart: 1400  },
  { level: 6,  name: 'Especialista', color: 'text-violet-400', bg: 'bg-violet-500/15',  border: 'border-violet-500/40',  xpStart: 2200  },
  { level: 7,  name: 'Veterano',     color: 'text-purple-400', bg: 'bg-purple-500/15',  border: 'border-purple-500/40',  xpStart: 3200  },
  { level: 8,  name: 'Expert',       color: 'text-pink-400',   bg: 'bg-pink-500/15',    border: 'border-pink-500/40',    xpStart: 4500  },
  { level: 9,  name: 'Mestre',       color: 'text-orange-400', bg: 'bg-orange-500/15',  border: 'border-orange-500/40',  xpStart: 6000  },
  { level: 10, name: 'Lenda',        color: 'text-yellow-400', bg: 'bg-yellow-500/15',  border: 'border-yellow-500/40',  xpStart: 8000  },
  { level: 11, name: 'Elite',        color: 'text-amber-400',  bg: 'bg-amber-500/15',   border: 'border-amber-500/40',   xpStart: 10500 },
  { level: 12, name: 'Imortal',      color: 'text-red-400',    bg: 'bg-red-500/15',     border: 'border-red-500/40',     xpStart: 13500 },
];

export function computeLevel(xp: number): LevelInfo {
  let current = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpStart) {
      current = LEVELS[i];
      break;
    }
  }

  const next = LEVELS.find(l => l.xpStart > current.xpStart);
  const xpEnd    = next?.xpStart ?? current.xpStart + 5000;
  const xpIntoLevel = xp - current.xpStart;
  const xpNeeded    = xpEnd - current.xpStart;

  return {
    ...current,
    xpEnd,
    xpIntoLevel,
    xpNeeded,
    progressPct: Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)),
  };
}

export function xpForSession(correctAnswers: number, totalAnswered: number): number {
  const base = correctAnswers * 20;
  const accuracy = totalAnswered > 0 ? correctAnswers / totalAnswered : 0;
  const bonus = accuracy >= 0.95 ? 50 : accuracy >= 0.9 ? 25 : accuracy >= 0.8 ? 10 : accuracy >= 0.7 ? 5 : 0;
  return base + bonus;
}

// ─── Medal system ─────────────────────────────────────────────────────────────

export type MedalTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Medal {
  id: string;
  label: string;
  description: string;
  icon: string;
  tier: MedalTier;
  category: string;
  unlocked: boolean;
  xpReward: number;
}

export const TIER_STYLE: Record<MedalTier, { bg: string; border: string; text: string; glow: string; label: string }> = {
  bronze:   { bg: 'bg-amber-900/40',   border: 'border-amber-700/60',   text: 'text-amber-400',   glow: 'shadow-amber-700/30',   label: 'Bronze'   },
  silver:   { bg: 'bg-slate-700/40',   border: 'border-slate-400/60',   text: 'text-slate-300',   glow: 'shadow-slate-400/30',   label: 'Prata'    },
  gold:     { bg: 'bg-yellow-900/40',  border: 'border-yellow-500/60',  text: 'text-yellow-400',  glow: 'shadow-yellow-500/30',  label: 'Ouro'     },
  platinum: { bg: 'bg-violet-900/40',  border: 'border-violet-400/60',  text: 'text-violet-300',  glow: 'shadow-violet-400/30',  label: 'Platina'  },
};

interface StatsInput {
  totalAnswered: number;
  totalCorrect: number;
  totalSessions: number;
  streak: number;
  level: number;
  /** Quantas disciplinas distintas o usuário já tocou (para medalhas de polymath). */
  distinctSubjectsTouched?: number;
  /** Acurácia já calculada (%). Repassada para evitar recálculo. */
  accuracy?: number;
}

type MedalDef = Omit<Medal, 'unlocked'> & { check: (s: StatsInput) => boolean };
const MEDAL_DEFS: MedalDef[] = [
  // Primeiros Passos
  { id: 'first_question',    label: 'Primeira Questão',    description: 'Respondeu sua primeira questão',     icon: '✏️',  tier: 'bronze',   category: 'Início',     xpReward: 20,  check: s => s.totalAnswered >= 1 },
  { id: 'ten_questions',     label: 'Primeiros 10',        description: 'Respondeu 10 questões',              icon: '📖',  tier: 'bronze',   category: 'Início',     xpReward: 30,  check: s => s.totalAnswered >= 10 },
  { id: 'fifty_questions',   label: 'Meio Centurião',      description: 'Respondeu 50 questões',              icon: '📚',  tier: 'silver',   category: 'Volume',     xpReward: 75,  check: s => s.totalAnswered >= 50 },
  { id: 'hundred_questions', label: 'Centurião',           description: 'Respondeu 100 questões',             icon: '🏅',  tier: 'gold',     category: 'Volume',     xpReward: 150, check: s => s.totalAnswered >= 100 },
  { id: 'five_hundred',      label: 'Veterano das Provas', description: 'Respondeu 500 questões',             icon: '🎖️', tier: 'gold',     category: 'Volume',     xpReward: 300, check: s => s.totalAnswered >= 500 },
  { id: 'thousand_questions',label: 'Maratonista',         description: 'Respondeu 1000 questões',            icon: '🏆',  tier: 'platinum', category: 'Volume',     xpReward: 600, check: s => s.totalAnswered >= 1000 },
  // Precisão
  { id: 'accuracy_70',       label: 'Bom Aproveitamento',  description: '70% de acertos (mín. 20 questões)',  icon: '🎯',  tier: 'bronze',   category: 'Precisão',   xpReward: 50,  check: s => s.totalAnswered >= 20  && s.totalAnswered > 0 && (s.totalCorrect / s.totalAnswered) >= 0.70 },
  { id: 'accuracy_80',       label: 'Excelência',          description: '80% de acertos (mín. 50 questões)',  icon: '⭐',  tier: 'silver',   category: 'Precisão',   xpReward: 100, check: s => s.totalAnswered >= 50  && s.totalAnswered > 0 && (s.totalCorrect / s.totalAnswered) >= 0.80 },
  { id: 'accuracy_90',       label: 'Precisão de Sniper',  description: '90% de acertos (mín. 100 questões)', icon: '💫',  tier: 'gold',     category: 'Precisão',   xpReward: 200, check: s => s.totalAnswered >= 100 && s.totalAnswered > 0 && (s.totalCorrect / s.totalAnswered) >= 0.90 },
  { id: 'accuracy_95',       label: 'Perfeccionista',      description: '95% de acertos (mín. 100 questões)', icon: '💎',  tier: 'platinum', category: 'Precisão',   xpReward: 400, check: s => s.totalAnswered >= 100 && s.totalAnswered > 0 && (s.totalCorrect / s.totalAnswered) >= 0.95 },
  // Streak
  { id: 'streak_3',          label: 'Chama Acesa',         description: '3 dias seguidos estudando',          icon: '🔥',  tier: 'bronze',   category: 'Sequência',  xpReward: 30,  check: s => s.streak >= 3 },
  { id: 'streak_7',          label: 'Semana Completa',     description: '7 dias seguidos estudando',          icon: '💪',  tier: 'silver',   category: 'Sequência',  xpReward: 80,  check: s => s.streak >= 7 },
  { id: 'streak_14',         label: 'Quinzena de Ferro',   description: '14 dias seguidos estudando',         icon: '⚡',  tier: 'gold',     category: 'Sequência',  xpReward: 180, check: s => s.streak >= 14 },
  { id: 'streak_30',         label: 'Mês Implacável',      description: '30 dias seguidos estudando',         icon: '🌟',  tier: 'platinum', category: 'Sequência',  xpReward: 500, check: s => s.streak >= 30 },
  // Sessões
  { id: 'first_session',     label: 'Primeiro Treino',     description: 'Completou sua primeira sessão',      icon: '🚀',  tier: 'bronze',   category: 'Sessões',    xpReward: 20,  check: s => s.totalSessions >= 1 },
  { id: 'ten_sessions',      label: 'Frequente',           description: 'Completou 10 sessões de estudo',     icon: '💡',  tier: 'silver',   category: 'Sessões',    xpReward: 60,  check: s => s.totalSessions >= 10 },
  { id: 'fifty_sessions',    label: 'Assíduo',             description: 'Completou 50 sessões de estudo',     icon: '🎓',  tier: 'gold',     category: 'Sessões',    xpReward: 200, check: s => s.totalSessions >= 50 },
  // Nível
  { id: 'level_3',           label: 'Em Crescimento',      description: 'Atingiu o Nível 3',                  icon: '🌱',  tier: 'bronze',   category: 'Nível',      xpReward: 0,   check: s => s.level >= 3 },
  { id: 'level_5',           label: 'Consolidado',         description: 'Atingiu o Nível 5',                  icon: '🌿',  tier: 'silver',   category: 'Nível',      xpReward: 0,   check: s => s.level >= 5 },
  { id: 'level_7',           label: 'Experiente',          description: 'Atingiu o Nível 7',                  icon: '🌳',  tier: 'gold',     category: 'Nível',      xpReward: 0,   check: s => s.level >= 7 },
  { id: 'level_10',          label: 'Lendário',            description: 'Atingiu o Nível 10',                 icon: '👑',  tier: 'platinum', category: 'Nível',      xpReward: 0,   check: s => s.level >= 10 },
  // ─── Volume estendido (alta intensidade) ────────────────────────────
  { id: 'two_thousand',      label: 'Hardcore',            description: 'Respondeu 2.000 questões',           icon: '🛡️', tier: 'platinum', category: 'Volume',     xpReward: 1000,check: s => s.totalAnswered >= 2000 },
  { id: 'five_thousand',     label: 'Inabalável',          description: 'Respondeu 5.000 questões',           icon: '⚔️',  tier: 'platinum', category: 'Volume',     xpReward: 2500,check: s => s.totalAnswered >= 5000 },
  { id: 'ten_thousand',      label: 'Lenda Viva',          description: 'Respondeu 10.000 questões',          icon: '🌟',  tier: 'platinum', category: 'Volume',     xpReward: 5000,check: s => s.totalAnswered >= 10000 },
  // ─── Sequência estendida ──────────────────────────────────────────
  { id: 'streak_60',         label: 'Disciplina de Aço',   description: '60 dias seguidos estudando',         icon: '🔱',  tier: 'platinum', category: 'Sequência',  xpReward: 1000,check: s => s.streak >= 60 },
  { id: 'streak_100',        label: 'Centena de Foco',     description: '100 dias seguidos estudando',        icon: '🌌',  tier: 'platinum', category: 'Sequência',  xpReward: 2000,check: s => s.streak >= 100 },
  // ─── Multi-disciplina (Polymath) — categoria nova ────────────────
  { id: 'polymath_3',        label: 'Aprendiz Versátil',   description: 'Estudou em 3 disciplinas diferentes',icon: '🧭',  tier: 'bronze',   category: 'Versatilidade', xpReward: 50,  check: s => (s.distinctSubjectsTouched ?? 0) >= 3 },
  { id: 'polymath_5',        label: 'Generalista',         description: 'Estudou em 5 disciplinas diferentes',icon: '🗺️', tier: 'silver',   category: 'Versatilidade', xpReward: 120, check: s => (s.distinctSubjectsTouched ?? 0) >= 5 },
  { id: 'polymath_10',       label: 'Polímata',            description: 'Estudou em 10 disciplinas diferentes',icon: '🎭', tier: 'gold',     category: 'Versatilidade', xpReward: 300, check: s => (s.distinctSubjectsTouched ?? 0) >= 10 },
  // ─── Sessões estendido ────────────────────────────────────────────
  { id: 'hundred_sessions',  label: 'Rotina Forjada',      description: 'Completou 100 sessões de estudo',    icon: '⚒️', tier: 'platinum', category: 'Sessões',    xpReward: 600, check: s => s.totalSessions >= 100 },
];

export function computeMedals(stats: StatsInput): Medal[] {
  return MEDAL_DEFS.map(({ check, ...def }) => ({
    ...def,
    unlocked: check(stats),
  }));
}

export const MEDAL_CATEGORIES = ['Início', 'Volume', 'Precisão', 'Sequência', 'Versatilidade', 'Sessões', 'Nível'];
