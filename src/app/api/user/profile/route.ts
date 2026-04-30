import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      foto_url: user.foto_url,
      onboardingCompleted: (user.onboarding_completed ?? 0) === 1,
      selectedConcursoId: user.selected_concurso_id,
      selectedConcursoSlug: user.selected_concurso_slug,
      selectedAreas: user.selected_areas ? JSON.parse(user.selected_areas) : [],
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  let body: { username?: string; bio?: string; birthday?: string; location?: string; avatar_id?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  // Validação mínima
  if (body.username !== undefined) {
    const u = body.username.trim();
    if (u.length < 2 || u.length > 30) {
      return NextResponse.json({ error: 'Username deve ter entre 2 e 30 caracteres' }, { status: 400 });
    }
    body.username = u;
  }

  if (body.bio !== undefined && body.bio.length > 160) {
    return NextResponse.json({ error: 'Bio deve ter no máximo 160 caracteres' }, { status: 400 });
  }

  const updates: Record<string, unknown> = { atualizado_em: new Date().toISOString() };
  if (body.username !== undefined) updates.username = body.username;
  if (body.bio !== undefined) updates.bio = body.bio;
  if (body.birthday !== undefined) updates.birthday = body.birthday || null;
  if (body.location !== undefined) updates.location = body.location;
  if (body.avatar_id !== undefined) updates.avatar_id = body.avatar_id;

  try {
    await db.update(users).set(updates).where(eq(users.id, userId));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
