import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient } from '@/lib/db';

export const dynamic = 'force-dynamic';

const ACTIVE_WINDOW_MS = 2 * 60 * 1000;

export async function GET() {
  try {
    const activeSince = new Date(Date.now() - ACTIVE_WINDOW_MS).toISOString();
    const result = await lsClient.execute({
      sql: 'SELECT COUNT(*) AS count FROM student_presence WHERE last_seen >= ?',
      args: [activeSince],
    });

    return NextResponse.json(
      { count: Number(result.rows[0]?.count ?? 0) },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('Erro ao consultar estudantes online:', error);
    return NextResponse.json(
      { error: 'Não foi possível consultar a presença dos estudantes.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

export async function POST() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  try {
    await lsClient.execute({
      sql: `INSERT INTO student_presence (user_id, last_seen)
            VALUES (?, ?)
            ON CONFLICT(user_id) DO UPDATE SET last_seen = excluded.last_seen`,
      args: [userId, new Date().toISOString()],
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao atualizar presença do estudante:', error);
    return NextResponse.json(
      { error: 'Não foi possível atualizar a presença.' },
      { status: 500 },
    );
  }
}
