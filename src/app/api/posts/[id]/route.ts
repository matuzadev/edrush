import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { lsClient, getAuthedUserId, isUserAdmin } from '@/lib/community';

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * Verifica se a URL aponta para o nosso Vercel Blob storage.
 * Hosts conhecidos têm sufixo `.public.blob.vercel-storage.com` ou
 * contêm `vercel-blob` / `blob.vercel-storage.com`.
 */
function isOwnBlobUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname.endsWith('.public.blob.vercel-storage.com') ||
      u.hostname.endsWith('.blob.vercel-storage.com') ||
      u.hostname.includes('vercel-blob')
    );
  } catch {
    return false;
  }
}

/**
 * DELETE /api/posts/:id — soft delete.
 * Permite: autor do post OU admin.
 *
 * Antes de marcar `deleted_at`, tenta remover o blob de imagem associado
 * (se for nosso). Falha de blob.del é silenciosa: orphan blob é perda
 * aceitável; o soft delete do DB segue normalmente.
 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const userId = await getAuthedUserId();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  try {
    const rs = await lsClient.execute({
      sql: 'SELECT user_id, image_url FROM posts WHERE id = ? AND deleted_at IS NULL',
      args: [id],
    });
    if (rs.rows.length === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    const post = rs.rows[0] as unknown as {
      user_id: string;
      image_url: string | null;
    };
    const isAuthor = post.user_id === userId;
    const isAdmin = isAuthor ? false : await isUserAdmin(userId);
    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    // Cleanup do blob ANTES do soft delete (orphan blob é perda aceitável,
    // mas blob órfão sem post de referência é melhor evitar quando possível).
    if (post.image_url && isOwnBlobUrl(post.image_url)) {
      try {
        await del(post.image_url);
      } catch (err) {
        console.warn('[/api/posts/:id DELETE] blob.del falhou (segue):', err);
      }
    }

    const now = new Date().toISOString();
    await lsClient.execute({
      sql: 'UPDATE posts SET deleted_at = ? WHERE id = ?',
      args: [now, id],
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[/api/posts/:id DELETE] erro:', error);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
