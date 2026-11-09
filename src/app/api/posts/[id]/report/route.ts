import { NextRequest, NextResponse } from 'next/server';
import {
  lsClient,
  generateId,
  getAuthedUserId,
  userRateLimit,
  REPORT_REASONS,
  type ReportReason,
} from '@/lib/community';

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/posts/:id/report — denúncia
 * Body: { reason: 'spam' | 'offensive' | 'misinformation' | 'other', targetType?: 'post' | 'comment' }
 */
export async function POST(req: NextRequest, { params }: Params) {
  const userId = await getAuthedUserId();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  // 5 reports/hora — anti-flood
  const rl = userRateLimit(`report:${userId}`, 5, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: rl.retryAfter },
      { status: 429 },
    );
  }

  let body: { reason?: string; targetType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const reason = body.reason as ReportReason | undefined;
  if (!reason || !(REPORT_REASONS as readonly string[]).includes(reason)) {
    return NextResponse.json({ error: 'invalid_reason' }, { status: 400 });
  }
  const targetType = body.targetType === 'comment' ? 'comment' : 'post';

  try {
    // Anti-duplicata: mesmo user não denuncia o mesmo target 2x em 24h
    const dupRs = await lsClient.execute({
      sql: `SELECT 1 FROM reports
            WHERE reporter_id = ? AND target_id = ? AND target_type = ?
              AND status = 'pending' AND created_at > datetime('now', '-1 day')`,
      args: [userId, id, targetType],
    });
    if (dupRs.rows.length > 0) {
      return NextResponse.json({ ok: true, alreadyReported: true });
    }

    const reportId = generateId('r_');
    const now = new Date().toISOString();
    await lsClient.execute({
      sql: `INSERT INTO reports (id, reporter_id, target_id, target_type, reason, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      args: [reportId, userId, id, targetType, reason, now],
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[/api/posts/:id/report] erro:', error);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
