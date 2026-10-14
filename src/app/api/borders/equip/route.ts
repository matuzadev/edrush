import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { equipBorder } from '@/lib/borders';
import { isUserPremium } from '@/lib/freemium';

// PATCH /api/borders/equip
// Body: { slug: string }
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  if (!(await isUserPremium(userId, session.user.email))) {
    return NextResponse.json({ error: 'premium_required' }, { status: 403 });
  }

  let body: { slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const slug = body.slug?.trim();
  if (!slug) {
    return NextResponse.json({ error: 'slug obrigatório' }, { status: 400 });
  }

  const result = await equipBorder(userId, slug);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, equipped: slug });
}
