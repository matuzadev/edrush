import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { requireAdmin } from '@/lib/admin';
import { lsClient } from '@/lib/db';

/**
 * PATCH /api/admin/reports/[id]
 *
 * Body: { action: 'remove' | 'dismiss' }
 *
 * - 'remove'  → soft-delete o post/comment alvo (deleted_at = NOW())
 *               e marca o report como 'resolved'.
 * - 'dismiss' → apenas marca o report como 'dismissed'.
 *
 * DELETE /api/admin/reports/[id]
 *
 * Hard delete do report (caso de spam de denúncias).
 *
 * Ambos exigem admin (via `requireAdmin`).
 */

const VALID_ACTIONS = new Set(['remove', 'dismiss']);

function getClient() {
  return lsClient;
}

interface ReportRow {
  id: string;
  reporter_id: string;
  target_id: string;
  target_type: string;
  reason: string;
  status: string;
  created_at: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const adminId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const ok = await requireAdmin(adminId, session);
  if (!ok) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: reportId } = await params;
  if (!reportId || typeof reportId !== 'string') {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const action = (body as { action?: unknown } | null)?.action;
  if (typeof action !== 'string' || !VALID_ACTIONS.has(action)) {
    return NextResponse.json(
      { error: "action deve ser 'remove' ou 'dismiss'" },
      { status: 400 }
    );
  }

  const client = getClient();

  // 1) Carrega o report
  let report: ReportRow | null = null;
  try {
    const rs = await client.execute({
      sql: `SELECT id, reporter_id, target_id, target_type, reason, status, created_at
            FROM reports WHERE id = ? LIMIT 1`,
      args: [reportId],
    });
    if (rs.rows.length === 0) {
      return NextResponse.json({ error: 'Denúncia não encontrada' }, { status: 404 });
    }
    report = rs.rows[0] as unknown as ReportRow;
  } catch (err) {
    console.error('[mod] failed to load report:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }

  if (report.status !== 'pending') {
    return NextResponse.json(
      { error: 'Denúncia já processada', status: report.status },
      { status: 409 }
    );
  }

  const now = new Date().toISOString();

  if (action === 'dismiss') {
    try {
      await client.execute({
        sql: `UPDATE reports SET status = 'dismissed' WHERE id = ?`,
        args: [reportId],
      });
    } catch (err) {
      console.error('[mod] failed to dismiss report:', err);
      return NextResponse.json({ error: 'Erro ao dispensar' }, { status: 500 });
    }
    console.log(
      `[mod] admin=${adminId} action=dismiss target=${report.target_type}:${report.target_id} report=${reportId}`
    );
    return NextResponse.json({ ok: true, status: 'dismissed' });
  }

  // action === 'remove' → soft-delete do conteúdo + resolved no report
  if (report.target_type !== 'post' && report.target_type !== 'comment') {
    return NextResponse.json(
      { error: 'target_type inválido no report' },
      { status: 400 }
    );
  }

  const tableName = report.target_type === 'post' ? 'posts' : 'comments';

  try {
    // Soft delete do conteúdo. Idempotente: não erra se já estava deletado.
    await client.execute({
      sql: `UPDATE ${tableName} SET deleted_at = ? WHERE id = ?`,
      args: [now, report.target_id],
    });
  } catch (err) {
    console.error(`[mod] failed to soft-delete ${tableName}:`, err);
    return NextResponse.json(
      { error: `Erro ao remover ${report.target_type}` },
      { status: 500 }
    );
  }

  try {
    await client.execute({
      sql: `UPDATE reports SET status = 'resolved' WHERE id = ?`,
      args: [reportId],
    });
  } catch (err) {
    // Se o update do report falhou após já termos soft-deletado o conteúdo,
    // registramos e seguimos retornando sucesso parcial — o conteúdo está
    // oculto, e a denúncia pode ser fechada manualmente depois.
    console.error(
      `[mod] content soft-deleted but report status update failed for ${reportId}:`,
      err
    );
    return NextResponse.json(
      {
        ok: true,
        status: 'resolved',
        warning: 'content_deleted_but_report_not_updated',
      },
      { status: 200 }
    );
  }

  console.log(
    `[mod] admin=${adminId} action=remove target=${report.target_type}:${report.target_id} report=${reportId}`
  );
  return NextResponse.json({ ok: true, status: 'resolved' });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const adminId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const ok = await requireAdmin(adminId, session);
  if (!ok) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: reportId } = await params;
  if (!reportId || typeof reportId !== 'string') {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const client = getClient();
  try {
    const rs = await client.execute({
      sql: 'DELETE FROM reports WHERE id = ?',
      args: [reportId],
    });
    if (rs.rowsAffected === 0) {
      return NextResponse.json({ error: 'Denúncia não encontrada' }, { status: 404 });
    }
  } catch (err) {
    console.error('[mod] failed to hard-delete report:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }

  console.log(`[mod] admin=${adminId} action=hard_delete report=${reportId}`);
  return NextResponse.json({ ok: true });
}
