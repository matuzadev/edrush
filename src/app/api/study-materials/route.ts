// GET /api/study-materials?concursoSlug=X
// Retorna a lista de materiais publicados (ou em rascunho, com flag) para o concurso.
// Used pela página /dashboard/materiais.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { listMaterialsByConcurso } from '@/lib/study-materials';
import { isUserPremium } from '@/lib/freemium';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id?: string }).id;
  if (!userId || !(await isUserPremium(userId, session.user.email))) {
    return NextResponse.json({ error: 'premium_required' }, { status: 403 });
  }

  const concursoSlug = req.nextUrl.searchParams.get('concursoSlug');
  if (!concursoSlug) {
    return NextResponse.json({ error: 'concursoSlug obrigatório' }, { status: 400 });
  }

  try {
    const materials = await listMaterialsByConcurso(concursoSlug);
    // Para o usuário final só expõe publicados (admin tem rota separada).
    const visible = materials
      .filter((m) => m.status === 'published')
      .map((m) => ({
        id: m.id,
        disciplina: m.disciplina,
        pageCount: m.page_count,
        fileSize: m.file_size,
        publishedAt: m.published_at,
      }));
    return NextResponse.json({ materials: visible });
  } catch (err) {
    console.error('[study-materials] list error:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
