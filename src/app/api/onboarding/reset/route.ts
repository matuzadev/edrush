import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  try {
    await db
      .update(users)
      .set({
        onboarding_completed: 0,
        selected_concurso_id: null,
        selected_concurso_slug: null,
        selected_areas: null,
        selected_specialty: null,
        atualizado_em: new Date().toISOString(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao resetar onboarding:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
