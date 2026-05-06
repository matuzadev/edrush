import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { simulado_attempts, study_sessions } from '@/db/schema';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  let body: {
    discipline: string;
    totalQuestions: number;
    correctAnswers: number;
    skipped?: number;
    durationMs?: number;
    startedAt?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  if (
    typeof body.discipline !== 'string' ||
    typeof body.totalQuestions !== 'number' ||
    typeof body.correctAnswers !== 'number'
  ) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const accuracy = body.totalQuestions > 0
    ? Math.round((body.correctAnswers / body.totalQuestions) * 100)
    : 0;

  try {
    await db.insert(simulado_attempts).values({
      user_id: userId,
      discipline: body.discipline,
      total_questions: body.totalQuestions,
      correct_answers: body.correctAnswers,
      skipped: body.skipped ?? 0,
      accuracy,
      duration_ms: body.durationMs ?? null,
      started_at: body.startedAt ?? now,
      finished_at: now,
      criado_em: now,
    });

    // Também conta como sessão de estudo (alimenta stats globais)
    await db.insert(study_sessions).values({
      user_id: userId,
      session_date: now.split('T')[0],
      questions_answered: body.totalQuestions,
      correct_answers: body.correctAnswers,
      subject: body.discipline,
      criado_em: now,
    });

    return NextResponse.json({ ok: true, accuracy });
  } catch (error) {
    console.error('Erro ao salvar simulado:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
