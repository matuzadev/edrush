// Lista PT-BR de termos bloqueados em posts/comentários da comunidade.
//
// Estratégia: substring matching case-insensitive sobre conteúdo NORMALIZADO
// (NFD + strip de diacríticos). False positives são ACEITÁVEIS no MVP — é
// melhor bloquear "assassinato" em "assassino" do que deixar passar.
//
// Categorias:
//   - profanidade direta (palavrões e variações comuns)
//   - ódio/discriminação racial, religiosa, LGBTQ+
//   - ameaças e violência explícita
//   - spam comercial óbvio (cursinho-pirata, cola, gabarito vazado)
//   - assédio sexual/conteúdo adulto explícito
//
// Não inclui termos médicos, palavras de baixa-frequência, ou ambíguos.
// Lista é deliberadamente curta — moderação humana cobre o resto via reports.
//
// Manutenção: adicionar conforme reports recorrentes. Remover se causar
// muitos falsos positivos legítimos.

const BLOCKED_TERMS_RAW = [
  // ─── Palavrões pesados (variações com/sem acento) ─────────────────
  'caralho', 'porra', 'foda-se', 'fodase', 'vai se foder', 'vai tomar no cu',
  'tomar no cu', 'puta que pariu', 'pqp', 'filho da puta', 'fdp', 'arrombado',
  'cuzao', 'cuzão', 'corno', 'cornao', 'cornão', 'desgracado', 'desgraçado',
  'merda', 'bosta', 'cacete',

  // ─── Discriminação racial / religiosa ──────────────────────────────
  'macaco preto', 'preto fedido', 'crioulo', 'criolo', 'negao fedido',
  'judiar', 'judeu fdp', 'judeu sujo', 'macumbeiro', 'crente burro',
  'evangelico burro', 'evangélico burro', 'bicho do mato',

  // ─── Discriminação LGBTQ+ ─────────────────────────────────────────
  'viado', 'viadinho', 'bicha', 'bichinha', 'sapatao', 'sapatão',
  'travecao', 'travecão', 'traveco', 'traveco fedido', 'frutinha',

  // ─── Ameaças e violência ──────────────────────────────────────────
  'vou te matar', 'vou matar voce', 'vou matar você', 'morra', 'va se matar',
  'vá se matar', 'se enforca', 'se mata', 'merece morrer', 'mereces morrer',
  'estuprar', 'estupro', 'violentar', 'queima na fogueira',
  'odeio voce', 'odeio você', 'todo mundo te odeia',

  // ─── Sexual explícito ──────────────────────────────────────────────
  'gostosa', 'puta gostosa', 'cuzinho', 'pintinho', 'piroca', 'piroquinha',
  'rola dura', 'cu apertado', 'mandar nudes', 'mando nudes', 'nudes pf',
  'pelada', 'peladinha', 'siririca', 'sarrar',

  // ─── Spam / fraude / pirataria de conteúdo ────────────────────────
  'comprar gabarito', 'gabarito vazado', 'prova vazada', 'cola na prova',
  'curso pirata', 'pdf pirata', 'compre o curso', 'whatsapp 99', 'whats 99',
  'frete gratis', 'frete grátis', 'venda de prova', 'vendo cola',
  'fraude no concurso', 'fura fila', 'compre vagas',

  // ─── Trolls / harassment ──────────────────────────────────────────
  'retardado', 'retardada', 'mongol', 'mongolol', 'mongoloide',
  'imbecil burro', 'idiota retardado', 'lixo humano', 'verme',
  'aborto fedido', 'erro genetico', 'erro genético',
];

/** Remove diacríticos e normaliza pra comparação case-insensitive. */
export function normalizeForBlock(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

const BLOCKED_NORMALIZED: ReadonlyArray<string> = BLOCKED_TERMS_RAW.map(normalizeForBlock);

/**
 * Retorna true se o conteúdo é "limpo" (não contém termos bloqueados).
 * Match por substring após normalização. False positives são aceitáveis.
 */
export function isContentClean(content: string): boolean {
  if (!content || typeof content !== 'string') return true;
  const normalized = normalizeForBlock(content);
  return !BLOCKED_NORMALIZED.some((term) => normalized.includes(term));
}

/** Quantos termos a lista cobre — útil pra debug/admin. */
export function getBlockedTermsCount(): number {
  return BLOCKED_NORMALIZED.length;
}
