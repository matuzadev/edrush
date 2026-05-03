import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { questions } from '@/db/schema';
import { eq, and, like, or, inArray, SQL } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const disciplina = searchParams.get('disciplina');
    const capitulo = searchParams.get('capitulo');
    const dificuldade = searchParams.get('dificuldade');
    const concursoId = searchParams.get('concurso_id');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') ?? '100');

    const where: SQL[] = [];
    if (disciplina) where.push(eq(questions.disciplina, disciplina));
    if (capitulo) where.push(eq(questions.capitulo, capitulo));
    if (dificuldade) {
      // Normalize: DB stores both accented ("fácil") and non-accented ("facil") variants
      const DIFF_VARIANTS: Record<string, string[]> = {
        'fácil':   ['fácil', 'facil'],
        'facil':   ['fácil', 'facil'],
        'médio':   ['médio', 'medio'],
        'medio':   ['médio', 'medio'],
        'difícil': ['difícil', 'dificil'],
        'dificil': ['difícil', 'dificil'],
      };
      const variants = DIFF_VARIANTS[dificuldade.toLowerCase()];
      if (variants) {
        where.push(inArray(questions.dificuldade, variants));
      } else {
        where.push(eq(questions.dificuldade, dificuldade));
      }
    }
    if (concursoId) where.push(eq(questions.concurso_id, parseInt(concursoId)));
    if (search) where.push(like(questions.enunciado, `%${search}%`));

    const resultado = await db.query.questions.findMany({
      where: where.length > 0 ? and(...where) : undefined,
      limit,
      with: { concurso: { columns: { titulo: true, organizador: true } } },
    });

    // Transform to match expected format
    const transformedQuestions = resultado.map((q: any) => ({
      id: String(q.id),
      question: q.enunciado,
      subject: q.disciplina,
      chapter: q.capitulo,
      type: q.tipo,
      correctAnswer: q.resposta_correta,
      explanation: q.explicacao,
      hint: q.dica,
      difficulty: q.dificuldade,
      options: q.opcoes ? (typeof q.opcoes === 'string' ? JSON.parse(q.opcoes) : q.opcoes) : null,
      source: q.fonte,
      year: q.ano
    }));

    return NextResponse.json({ 
      success: true, 
      questions: transformedQuestions,
      count: transformedQuestions.length 
    });
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar questões',
      message: error instanceof Error ? error.message : 'Erro interno'
    }, { status: 500 });
  }
}
