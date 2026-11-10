/**
 * Next.js Instrumentation Hook
 *
 * Silencia warnings conhecidos de dependências em produção para manter
 * os runtime logs da Vercel limpos. Em desenvolvimento, todos os warnings
 * permanecem visíveis para debug.
 *
 * Origem identificada do DEP0169 (url.parse):
 * - openid-client/lib/client.js (6 ocorrências)
 * - Usado internamente pelo next-auth v4 via GoogleProvider
 * - Não é código nosso — só podemos filtrar ou aguardar migração para next-auth v5
 */

// Forçar Node.js runtime — process.emit não existe no Edge Runtime
export const runtime = 'nodejs';

export async function register() {
  if (process.env.NODE_ENV === 'production') {
    const originalEmit = process.emit;

    // Override para filtrar warnings específicos de dependências.
    // O tipo de process.emit aceita overload; usamos cast para evitar
    // erros de tipagem na reatribuição.
    const filteredEmit = function (
      name: string,
      data: unknown,
      ...args: unknown[]
    ) {
      if (
        name === 'warning' &&
        typeof data === 'object' &&
        data !== null &&
        'name' in data &&
        'code' in data &&
        (data as { name: string; code: string }).name === 'DeprecationWarning' &&
        (data as { name: string; code: string }).code === 'DEP0169'
      ) {
        // Silenciar url.parse() deprecation warning de openid-client/next-auth v4
        return false;
      }
      return originalEmit.apply(process, [name, data, ...args] as Parameters<typeof process.emit>);
    };

    process.emit = filteredEmit as typeof process.emit;
  }
}