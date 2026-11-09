// GET /api/study-materials/[concursoSlug]/[disciplina]/download
//
// Comportamento:
//   - 401 se não autenticado
//   - 404 se material não existe ou não publicado
//   - 404 se material não existe ou não publicado
//   - 202 se status='generating' (cliente exibe "em preparação")
//   - 302 redirect ao Vercel Blob se 'published'
//
// Loga download em study_material_downloads (não-bloqueante).

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import {
  getMaterialByDisciplina,
  logDownload,
} from '@/lib/study-materials';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ concursoSlug: string; disciplina: string }> },
) {
  const { concursoSlug, disciplina } = await params;

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const decoded = decodeURIComponent(disciplina);
  const material = await getMaterialByDisciplina(concursoSlug, decoded);
  if (!material) {
    return NextResponse.json({ error: 'Material não encontrado' }, { status: 404 });
  }

  if (material.status === 'generating') {
    return NextResponse.json(
      { status: 'generating', message: 'PDF em preparação. Tente novamente em alguns minutos.' },
      { status: 202 },
    );
  }

  if (material.status !== 'published' || !material.blob_url) {
    return NextResponse.json(
      { error: 'Material ainda não publicado', status: material.status },
      { status: 404 },
    );
  }

  // Loga download (não bloqueia)
  logDownload(userId, material.id).catch(() => {});

  return NextResponse.redirect(material.blob_url, 302);
}
