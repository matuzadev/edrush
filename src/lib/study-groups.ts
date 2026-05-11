// Helpers compartilhados pelo sistema de Grupos de Estudo.
// Mantém regras de slug, cor, validação e cursor centralizadas — qualquer
// rota/UI que mexe em grupos consome daqui pra não divergir.

import { customAlphabet } from 'nanoid';

// Alfabeto sem caracteres ambíguos (0/O, 1/l/I) — slugs são exibidos em URL.
const SLUG_NANOID_ALPHABET = '23456789abcdefghijkmnopqrstuvwxyz';
export const slugNanoid = customAlphabet(SLUG_NANOID_ALPHABET, 6);

// IDs de grupo: 12 chars, alfabeto base62 sem ambíguos.
const ID_NANOID_ALPHABET =
  'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
export const groupIdNanoid = customAlphabet(ID_NANOID_ALPHABET, 12);

// Limites de validação — replicados no client e no server.
export const GROUP_NAME_MIN = 3;
export const GROUP_NAME_MAX = 50;
export const GROUP_DESC_MAX = 200;
export const GROUP_CREATE_LIMIT_PER_USER = 5;

/**
 * Converte um nome arbitrário em slug URL-safe.
 * - Remove acentos (NFD + strip diacríticos)
 * - Lowercase, trim
 * - Substitui qualquer não [a-z0-9] por hífen
 * - Colapsa hífens múltiplos
 * - Remove hífens nas pontas
 * - Trunca em 40 chars (deixa folga p/ -nanoid(6))
 */
export function slugifyName(name: string): string {
  const base = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritical marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base.slice(0, 40) || 'grupo';
}

/**
 * Gera slug único com sufixo nanoid(6).
 * O caller deve verificar unicidade no banco e regenerar se colidir
 * (probabilidade desprezível, mas implementamos retry no POST).
 */
export function buildGroupSlug(name: string): string {
  return `${slugifyName(name)}-${slugNanoid()}`;
}

// Mapa de accent por concurso. Mantém paleta do projeto (emerald/cyan/blue/violet/amber).
// Slugs desconhecidos caem no default emerald.
export type GroupAccent = {
  // Cor sólida principal (usada em badges, CTA secundárias)
  base: string;
  // Cor de glow (rgba) — para box-shadow
  glow: string;
  // Gradiente de header/ícone (de-cor → para-cor)
  gradient: string;
  // Iniciais de fallback do logo (3 letras)
  badge: string;
};

const ACCENT_DEFAULT: GroupAccent = {
  base: '#10b981',
  glow: 'rgba(16,185,129,0.35)',
  gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
  badge: 'GE',
};

const ACCENTS: Record<string, GroupAccent> = {
  // Polícia Federal — emerald
  pf: {
    base: '#10b981',
    glow: 'rgba(16,185,129,0.35)',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    badge: 'PF',
  },
  // Polícia Rodoviária Federal — azul
  prf: {
    base: '#3b82f6',
    glow: 'rgba(59,130,246,0.35)',
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    badge: 'PRF',
  },
  // Receita Federal — amber
  rfb: {
    base: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    badge: 'RFB',
  },
  // INSS — violet
  inss: {
    base: '#8b5cf6',
    glow: 'rgba(139,92,246,0.35)',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    badge: 'INS',
  },
  // EsFCEx — cyan
  esfcex: {
    base: '#06b6d4',
    glow: 'rgba(6,182,212,0.35)',
    gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
    badge: 'EFX',
  },
  // Tribunal de Contas da União — pink/rose
  tcu: {
    base: '#ec4899',
    glow: 'rgba(236,72,153,0.35)',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
    badge: 'TCU',
  },
  // Polícia Civil — slate fria
  pc: {
    base: '#64748b',
    glow: 'rgba(100,116,139,0.35)',
    gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
    badge: 'PC',
  },
};

export function getGroupAccent(concursoSlug: string | null | undefined): GroupAccent {
  if (!concursoSlug) return ACCENT_DEFAULT;
  // Match prefixado: pf-2025 → pf, prf-2024 → prf, etc.
  const head = concursoSlug.split('-')[0]?.toLowerCase() ?? '';
  return ACCENTS[head] ?? ACCENT_DEFAULT;
}

/**
 * Cursor opaco para paginação. Usa created_at + id.
 * Formato: base64(`${createdAtIso}::${id}`).
 * Decode tolerante: cursor inválido → undefined (caller cai no início).
 */
export function encodeGroupCursor(createdAt: string, id: string): string {
  return Buffer.from(`${createdAt}::${id}`, 'utf8').toString('base64url');
}

export function decodeGroupCursor(
  cursor: string | null | undefined,
): { createdAt: string; id: string } | undefined {
  if (!cursor) return undefined;
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8');
    const [createdAt, id] = raw.split('::');
    if (!createdAt || !id) return undefined;
    return { createdAt, id };
  } catch {
    return undefined;
  }
}

/**
 * Validação centralizada do payload de criação. Retorna mensagem de erro
 * (string) ou null se válido. Usar tanto no client (modal) quanto no server.
 */
export function validateGroupInput(input: {
  name?: string;
  description?: string | null;
  isPrivate?: boolean;
}): string | null {
  const name = (input.name ?? '').trim();
  if (name.length < GROUP_NAME_MIN || name.length > GROUP_NAME_MAX) {
    return `Nome deve ter entre ${GROUP_NAME_MIN} e ${GROUP_NAME_MAX} caracteres`;
  }
  const desc = (input.description ?? '').trim();
  if (desc.length > GROUP_DESC_MAX) {
    return `Descrição deve ter no máximo ${GROUP_DESC_MAX} caracteres`;
  }
  return null;
}

// Tipos retornados pelas APIs — exportados pra dar tipagem no client/server.
export type GroupRole = 'owner' | 'moderator' | 'member';

export type GroupListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  concursoSlug: string | null;
  isPrivate: boolean;
  memberCount: number;
  createdAt: string;
  ownerId: string;
  isMember: boolean;
  myRole: GroupRole | null;
  // Metadata enriquecida
  accent: GroupAccent;
};

export type GroupMember = {
  userId: string;
  nome: string | null;
  username: string | null;
  avatarId: number;
  equippedBorder: string | null;
  role: GroupRole;
  joinedAt: string;
};

export type GroupDetail = GroupListItem & {
  topMembers: GroupMember[];
};
