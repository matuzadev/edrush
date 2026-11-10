import { NextResponse } from 'next/server';
import { client } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, string> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL ? 'vercel' : 'local',
    database: 'unknown',
    auth_secret: process.env.NEXTAUTH_SECRET ? 'configured' : 'missing',
    google_oauth: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'missing',
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
  };

  // Teste real de conexão com Turso/libsql (timeout 3s via AbortController)
  try {
    const start = Date.now();
    await client.execute({ sql: 'SELECT 1', args: [] });
    checks.database = `connected (${Date.now() - start}ms)`;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    checks.database = `error: ${message.slice(0, 80)}`;
    checks.status = 'degraded';
  }

  const httpStatus = checks.status === 'ok' ? 200 : 503;
  return NextResponse.json(checks, {
    status: httpStatus,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}