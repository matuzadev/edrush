// GET  /api/admin/study-materials       — lista todos (qualquer status)
// POST /api/admin/study-materials       — gera material para (concursoSlug, disciplina)
//
// Admin gate: requireAdmin(userId, session).

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { requireAdmin } from '@/lib/admin';
import {
  generateAndStoreMaterial,
  listAllMaterials,
} from '@/lib/study-materials';

export const maxDuration = 300; // 5 min — geração + render + upload

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!userId || !(await requireAdmin(userId, session))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const materials = await listAllMaterials();
    return NextResponse.json({ materials });
  } catch (err) {
    console.error('[admin/study-materials] list error:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!userId || !(await requireAdmin(userId, session))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const { concursoSlug, disciplina } = (body ?? {}) as {
    concursoSlug?: string;
    disciplina?: string;
  };
  if (!concursoSlug || !disciplina) {
    return NextResponse.json(
      { error: 'concursoSlug e disciplina obrigatórios' },
      { status: 400 },
    );
  }

  try {
    const result = await generateAndStoreMaterial({ concursoSlug, disciplina });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[admin/study-materials] generate error:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
