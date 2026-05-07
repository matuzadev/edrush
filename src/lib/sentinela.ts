import type { SentinelaMood } from '@/data/sentinelaMessages';

export interface SentinelaContext {
  // Stats agregados
  level: number;
  streak: number;
  totalAnswered: number;
  accuracy: number;        // 0-100, geral
  totalSessions: number;

  // Sinais recentes (lib/borders.getUserBorderStats não cobre; vem de cálculo local)
  recentAccuracy?: number; // accuracy nas últimas N sessões (opcional)
  hoursSinceLastSession?: number; // se >48h → sleeping
  isFirstVisitToday?: boolean;
  pathname?: string;       // pra detectar /study, /chapter, /simulado
  leveledUpRecently?: boolean;
  newBorderRecently?: boolean;
}

export function computeMood(ctx: SentinelaContext): SentinelaMood {
  // Foco — em sessão de estudo: prioridade alta
  if (ctx.pathname && (
    ctx.pathname.includes('/dashboard/study') ||
    ctx.pathname.includes('/dashboard/chapter')
  )) {
    return 'focused';
  }

  // Dormindo — inativo há mais de 48h
  if ((ctx.hoursSinceLastSession ?? 0) >= 48 && ctx.totalSessions > 0) {
    return 'sleeping';
  }

  // Orgulhoso — subiu de nível ou ganhou borda recentemente OU accuracy >= 85
  if (ctx.leveledUpRecently || ctx.newBorderRecently || ctx.accuracy >= 85) {
    return 'proud';
  }

  // Preocupado — accuracy baixa nas últimas sessões (com volume mínimo)
  if (ctx.totalAnswered >= 20 && (ctx.recentAccuracy ?? ctx.accuracy) < 50) {
    return 'concerned';
  }

  // Empolgado — primeiro acesso depois de >=24h
  if ((ctx.hoursSinceLastSession ?? 0) >= 24 && ctx.totalSessions > 0) {
    return 'excited';
  }

  // Animador — primeiro login do dia (qualquer dia)
  if (ctx.isFirstVisitToday) {
    return 'cheering';
  }

  // Feliz — está com sequência ativa e accuracy razoável
  if (ctx.streak >= 3 && ctx.accuracy >= 60) {
    return 'happy';
  }

  return 'awake';
}
