import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { questions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import subjects from '@/data/subjects.json';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const concursoId = request.nextUrl.searchParams.get('concursoId');

  let areas: { slug: string; title: string }[] = [];

  if (concursoId) {
    // Buscar disciplinas únicas das questões deste concurso
    const rows = await db
      .selectDistinct({ disciplina: questions.disciplina })
      .from(questions)
      .where(eq(questions.concurso_id, parseInt(concursoId)));

    if (rows.length > 0) {
      areas = rows.map((r) => ({
        slug: r.disciplina.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        title: r.disciplina,
      }));
    }
  }

  // Fallback: usar subjects.json se não houver questões vinculadas ao concurso
  if (areas.length === 0) {
    areas = Object.entries(subjects as Record<string, { title: string }>).map(
      ([slug, subj]) => ({ slug, title: subj.title })
    );
  }

  return NextResponse.json({ areas });
}
