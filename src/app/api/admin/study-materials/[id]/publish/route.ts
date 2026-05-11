// POST  /api/admin/study-materials/[id]/publish   — publica (status: draft → published)
// DELETE /api/admin/study-materials/[id]/publish  — despublica (volta pra draft)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { requireAdmin } from '@/lib/admin';
import { publishMaterial, unpublishMaterial } from '@/lib/study-materials';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!userId || !(await requireAdmin(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const materialId = Number(id);
  if (!Number.isFinite(materialId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    await publishMaterial(materialId, userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[publish] error:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!userId || !(await requireAdmin(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const materialId = Number(id);
  if (!Number.isFinite(materialId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    await unpublishMaterial(materialId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[unpublish] error:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
