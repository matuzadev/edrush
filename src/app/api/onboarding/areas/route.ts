import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { concursos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import subjects from '@/data/subjects.json';
import {
  getAreasForConcurso,
  getAreasForConcursoSpecialty,
  getSpecialtiesForConcurso,
} from '@/lib/concurso-areas';

export async function GET(request: NextRequest) {
  const concursoId = request.nextUrl.searchParams.get('concursoId');
  const selectedSpecialty = request.nextUrl.searchParams.get('specialty');

  let areas: { slug: string; title: string }[] = [];
  let specialties: ReturnType<typeof getSpecialtiesForConcurso> = [];

  if (concursoId) {
    const concurso = await db.query.concursos.findFirst({
      where: eq(concursos.id, parseInt(concursoId)),
      columns: { titulo: true },
    });

    if (concurso) {
      specialties = getSpecialtiesForConcurso(concurso.titulo);
      const slugs = specialties.length > 0
        ? getAreasForConcursoSpecialty(concurso.titulo, selectedSpecialty)
        : getAreasForConcurso(concurso.titulo);
      if (slugs) {
        const subjectsMap = subjects as Record<string, { title: string }>;
        areas = slugs
          .filter((slug) => subjectsMap[slug])
          .map((slug) => ({ slug, title: subjectsMap[slug].title }));
      }
    }
  }

  if (specialties.length > 0) {
    return NextResponse.json({ areas, specialties });
  }

  // Fallback: todas as matérias do subjects.json
  if (areas.length === 0) {
    areas = Object.entries(subjects as Record<string, { title: string }>).map(
      ([slug, subj]) => ({ slug, title: subj.title })
    );
  }

  return NextResponse.json({ areas, specialties });
}
