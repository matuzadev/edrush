import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { concursos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import subjects from '@/data/subjects.json';
import { getAreasForConcurso } from '@/lib/concurso-areas';

export async function GET(request: NextRequest) {
  const concursoId = request.nextUrl.searchParams.get('concursoId');

  let areas: { slug: string; title: string }[] = [];

  if (concursoId) {
    const concurso = await db.query.concursos.findFirst({
      where: eq(concursos.id, parseInt(concursoId)),
      columns: { titulo: true },
    });

    if (concurso) {
      const slugs = getAreasForConcurso(concurso.titulo);
      if (slugs) {
        const subjectsMap = subjects as Record<string, { title: string }>;
        areas = slugs
          .filter((slug) => subjectsMap[slug])
          .map((slug) => ({ slug, title: subjectsMap[slug].title }));
      }
    }
  }

  // Fallback: todas as matérias do subjects.json
  if (areas.length === 0) {
    areas = Object.entries(subjects as Record<string, { title: string }>).map(
      ([slug, subj]) => ({ slug, title: subj.title })
    );
  }

  return NextResponse.json({ areas });
}
