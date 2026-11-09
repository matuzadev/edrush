import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { questions, user_chapter_progress } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/chapters/[id]/questions
 * Retorna questões de um capítulo (10+ por dificuldade)
 * Query params: difficulty (fácil|médio|difícil) - opcional
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get('difficulty');

  try {
    // Buscar questões do capítulo (filtra por dificuldade quando fornecida)
    const whereClause = difficulty
      ? and(eq(questions.capitulo, id), eq(questions.dificuldade, difficulty))
      : eq(questions.capitulo, id);

    const questionsList = await db.select().from(questions).where(whereClause);

    // Parse de opções JSON
    const parsedQuestions = questionsList.map((q) => ({
      ...q,
      opcoes: q.opcoes ? JSON.parse(q.opcoes) : [],
    }));

    return NextResponse.json({
      total: parsedQuestions.length,
      questions: parsedQuestions,
    });
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    return NextResponse.json({ error: 'Erro ao buscar questões' }, { status: 500 });
  }
}
