import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL ? 'vercel' : 'local',
    database: process.env.TURSO_DB_URL ? 'configured' : 'not_configured',
    auth: process.env.NEXTAUTH_SECRET ? 'configured' : 'not_configured',
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
  };

  return NextResponse.json(health, {
    status: health.database === 'configured' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}