import { NextRequest, NextResponse } from 'next/server';
import { getProfileData } from '@/lib/profile';

/**
 * GET /api/profile/[username]
 *
 * Wrapper fino sobre `getProfileData` (src/lib/profile.ts). A página de perfil
 * chama a camada de dados DIRETAMENTE (sem round-trip HTTP); esta rota existe
 * para consumidores externos / client-side.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  if (!username) return NextResponse.json({ error: 'Username inválido' }, { status: 400 });

  try {
    const profile = await getProfileData(username);
    if (!profile) return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Erro ao buscar perfil público:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
