import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { users, concursos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { slugify } from '@/lib/slugify';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  try {
    const { concursoId, selectedAreas } = await request.json();

    if (!concursoId || !Array.isArray(selectedAreas)) {
      return NextResponse.json({ error: 'concursoId e selectedAreas são obrigatórios' }, { status: 400 });
    }

    // Buscar o concurso para obter o slug a partir do titulo
    const concurso = await db.query.concursos.findFirst({
      where: eq(concursos.id, parseInt(concursoId)),
    });

    if (!concurso) {
      return NextResponse.json({ error: 'Concurso não encontrado' }, { status: 404 });
    }

    const concursoSlug = slugify(concurso.titulo);

    await db
      .update(users)
      .set({
        onboarding_completed: 1,
        selected_concurso_id: concurso.id,
        selected_concurso_slug: concursoSlug,
        selected_areas: JSON.stringify(selectedAreas),
        atualizado_em: new Date().toISOString(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true, concursoSlug });
  } catch (error) {
    console.error('Erro ao salvar onboarding:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
