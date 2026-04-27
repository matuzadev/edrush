import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { questions } from '@/db/schema';
import { eq, and, like, SQL } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const disciplina = searchParams.get('disciplina');
    const dificuldade = searchParams.get('dificuldade');
    const concursoId = searchParams.get('concurso_id');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') ?? '100');

    const where: SQL[] = [];
    if (disciplina) where.push(eq(questions.disciplina, disciplina));
    if (dificuldade) where.push(eq(questions.dificuldade, dificuldade));
    if (concursoId) where.push(eq(questions.concurso_id, parseInt(concursoId)));
    if (search) where.push(like(questions.enunciado, `%${search}%`));

    const resultado = await db.query.questions.findMany({
      where: where.length > 0 ? and(...where) : undefined,
      limit,
      with: { concurso: { columns: { titulo: true, organizador: true } } },
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
