import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { user_responses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * POST /api/chapters/submit-answer
 * Registra resposta do usuário durante estudo
 * Body: { questionId, answer, isCorrect, timeMs, disciplina, capitulo }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  if (!userId) {
    return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
  }

  const body = await request.json();
  const { questionId, answer, isCorrect, timeMs, disciplina, capitulo } = body;

  if (!questionId || answer == null || isCorrect == null) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  try {
    await db.insert(user_responses).values({
      user_id: userId,
      question_id: questionId,
      resposta_dada: answer,
      acertou: isCorrect ? 1 : 0,
      tempo_resposta_ms: timeMs || 0,
      disciplina: disciplina || '',
      capitulo: capitulo || '',
      respondida_em: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Resposta registrada',
    });
  } catch (error) {
    console.error('Erro ao registrar resposta:', error);
    return NextResponse.json({ error: 'Erro ao registrar' }, { status: 500 });
  }
}

/**
 * GET /api/chapters/submit-answer?questionId=X
 * Retorna histórico de respostas para uma questão
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  if (!userId) {
    return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get('questionId');

  if (!questionId) {
    return NextResponse.json({ error: 'questionId obrigatório' }, { status: 400 });
  }

  try {
    const responses = await db
      .select()
      .from(user_responses)
      .where(
        and(
          eq(user_responses.user_id, userId),
          eq(user_responses.question_id, parseInt(questionId))
        )
      );

    return NextResponse.json({
      total: responses.length,
      responses,
      acertos: responses.filter((r) => r.acertou === 1).length,
    });
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    return NextResponse.json({ error: 'Erro ao buscar' }, { status: 500 });
  }
}
