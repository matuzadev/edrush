import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { study_sessions } from '@/db/schema';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  let body: { questionsAnswered: number; correctAnswers: number; concursoSlug?: string; subject?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const { questionsAnswered, correctAnswers, concursoSlug, subject } = body;

  if (
    typeof questionsAnswered !== 'number' ||
    typeof correctAnswers !== 'number' ||
    questionsAnswered < 0 ||
    correctAnswers < 0 ||
    correctAnswers > questionsAnswered
  ) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const now = new Date();
  const sessionDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    await db.insert(study_sessions).values({
      user_id: userId,
      session_date: sessionDate,
      questions_answered: questionsAnswered,
      correct_answers: correctAnswers,
      concurso_slug: concursoSlug ?? null,
      subject: subject ?? null,
      criado_em: now.toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao salvar sessão de estudo:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
