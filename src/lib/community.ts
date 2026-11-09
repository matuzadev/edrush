// Re-exporta o singleton libsql centralizado em @/lib/db. Mantém o nome
// `lsClient` para preservar a API existente (várias rotas de comunidade
// importam `lsClient` de `@/lib/community`).
import { lsClient } from '@/lib/db';
export { lsClient };

/**
 * Gera um ID curto e ordenável aproximado por tempo (não é UUID; suficiente
 * para posts/comments/reports onde colisão é cosmética).
 */
export function generateId(prefix = ''): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}${ts}${rand}`;
}

// ─── Cursor pagination (created_at + id) ────────────────────────────
export interface Cursor {
  created_at: string;
  id: string;
}

export function encodeCursor(c: Cursor): string {
  return Buffer.from(`${c.created_at}|${c.id}`, 'utf8').toString('base64url');
}

export function decodeCursor(cursor: string | null | undefined): Cursor | null {
  if (!cursor) return null;
  try {
    const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
    const [created_at, id] = decoded.split('|');
    if (!created_at || !id) return null;
    return { created_at, id };
  } catch {
    return null;
  }
}

// ─── Validação ─────────────────────────────────────────────────────
export const POST_TYPES = ['text', 'result', 'question', 'news'] as const;
export type PostType = (typeof POST_TYPES)[number];

export const TARGET_TYPES = ['question', 'session'] as const;
export type TargetType = (typeof TARGET_TYPES)[number];

export const REPORT_REASONS = ['spam', 'offensive', 'misinformation', 'other'] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export const POST_MAX_CONTENT = 2000;
export const COMMENT_MAX_CONTENT = 500;

// Lista PT-BR de termos bloqueados em src/lib/blocked-terms.ts (200+ termos
// com normalização NFD). Re-exporta para manter API existente.
export { isContentClean } from './blocked-terms';

export function sanitizeContent(content: string, max: number): string | null {
  const trimmed = content?.trim();
  if (!trimmed || trimmed.length === 0) return null;
  if (trimmed.length > max) return null;
  return trimmed;
}

// ─── Rate limit por user (in-memory, instância única) ──────────────
// Em serverless cada instância tem seu próprio map. Para abuso real,
// upgrade para Vercel KV. No estágio atual, isso já evita spam óbvio.
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export function userRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number,
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const bucket = rateBuckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  if (bucket.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count++;
  return { allowed: true };
}

// ─── Auth helper ────────────────────────────────────────────────────
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

/**
 * Retorna { userId } se autenticado, ou null. Use no início das route handlers.
 */
export async function getAuthedUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const userId = (session.user as unknown as { id: string }).id;
  return userId ?? null;
}

/**
 * Verifica se o user é admin (users.is_admin = 1).
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const rs = await lsClient.execute({
      sql: 'SELECT is_admin FROM users WHERE id = ?',
      args: [userId],
    });
    if (rs.rows.length === 0) return false;
    const r = rs.rows[0] as unknown as { is_admin: number };
    return r.is_admin === 1;
  } catch {
    return false;
  }
}

// ─── Mentions ──────────────────────────────────────────────────────

/**
 * Extrai usernames mencionados (@xxx) de um texto.
 * Retorna lista única, em lowercase, sem o '@'.
 */
export function extractMentions(content: string): string[] {
  if (!content) return [];
  const re = /@(\w+)/g;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const u = m[1]?.toLowerCase();
    if (u && u.length >= 2 && u.length <= 30) {
      set.add(u);
    }
  }
  return [...set];
}

/**
 * Notifica usuários mencionados em um conteúdo. Falhas são logadas e ignoradas
 * (mention notification não pode quebrar a criação do post/comentário).
 */
export async function notifyMentions(params: {
  content: string;
  authorId: string;
  authorUsername: string;
  type: 'mention' | 'mention_comment';
  relatedId: string;
}): Promise<void> {
  const usernames = extractMentions(params.content);
  if (usernames.length === 0) return;

  try {
    const placeholders = usernames.map(() => '?').join(',');
    const rs = await lsClient.execute({
      sql: `SELECT id, username FROM users WHERE LOWER(username) IN (${placeholders})`,
      args: usernames,
    });
    const rows = rs.rows as unknown as { id: string; username: string }[];

    const truncatedBody =
      params.content.length > 80 ? `${params.content.slice(0, 80)}...` : params.content;
    const title = `@${params.authorUsername} te mencionou`;
    const now = new Date().toISOString();

    for (const row of rows) {
      if (!row.id || row.id === params.authorId) continue;
      try {
        await lsClient.execute({
          sql: `INSERT INTO notifications
                (user_id, type, title, body, read, related_id, criado_em)
                VALUES (?, ?, ?, ?, 0, ?, ?)`,
          args: [row.id, params.type, title, truncatedBody, params.relatedId, now],
        });
      } catch (err) {
        console.error('[notifyMentions] insert falhou para', row.id, err);
      }
    }
  } catch (err) {
    console.error('[notifyMentions] erro geral:', err);
  }
}
