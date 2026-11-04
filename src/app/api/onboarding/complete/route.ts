import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { users, concursos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { slugify } from '@/lib/slugify';
import { getAreasForConcursoSpecialty, getSpecialtiesForConcurso } from '@/lib/concurso-areas';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: 'Sessão inválida. Entre novamente.' }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Dados de onboarding inválidos.' }, { status: 400 });
    }

    const { concursoId, selectedAreas, selectedSpecialty, concursoTitle } = body as {
      concursoId?: unknown;
      selectedAreas?: unknown;
      selectedSpecialty?: unknown;
      concursoTitle?: unknown;
    };
    const selectedConcursoId = Number(concursoId);

    if (
      !Number.isSafeInteger(selectedConcursoId) ||
      selectedConcursoId <= 0 ||
      !Array.isArray(selectedAreas) ||
      selectedAreas.length === 0 ||
      !selectedAreas.every((area): area is string => typeof area === 'string' && area.length > 0)
    ) {
      return NextResponse.json({ error: 'concursoId e selectedAreas são obrigatórios' }, { status: 400 });
    }

    const concurso = await db.query.concursos.findFirst({
      where: eq(concursos.id, selectedConcursoId),
    });
    const specialties = concurso ? getSpecialtiesForConcurso(concurso.titulo) : [];
    const specialtySlug = typeof selectedSpecialty === 'string' ? selectedSpecialty : null;

    if (specialties.length > 0) {
      const validSpecialty = specialties.some((specialty) => specialty.slug === specialtySlug);
      const allowedAreas = concurso
        ? getAreasForConcursoSpecialty(concurso.titulo, specialtySlug) ?? []
        : [];
      if (!validSpecialty || !selectedAreas.every((area) => allowedAreas.includes(area))) {
        return NextResponse.json(
          { error: 'Selecione uma especialidade válida e matérias correspondentes.' },
          { status: 400 },
        );
      }
    }

    const titleForSlug = concurso?.titulo ?? (
      typeof concursoTitle === 'string' && concursoTitle.trim()
        ? concursoTitle
        : `concurso-${selectedConcursoId}`
    );
    const concursoSlug = concurso?.slug?.trim() || slugify(titleForSlug);
    if (!concursoSlug) {
      return NextResponse.json({ error: 'Não foi possível identificar o concurso selecionado.' }, { status: 400 });
    }

    await db
      .update(users)
      .set({
        onboarding_completed: 1,
        selected_concurso_id: selectedConcursoId,
        selected_concurso_slug: concursoSlug,
        selected_areas: JSON.stringify(selectedAreas),
        selected_specialty: specialties.length > 0 ? specialtySlug : null,
        atualizado_em: new Date().toISOString(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true, concursoSlug });
  } catch (error) {
    console.error('Erro ao salvar onboarding:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
