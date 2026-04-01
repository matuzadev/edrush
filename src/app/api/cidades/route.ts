import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cidades } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ufId = searchParams.get('ufId');

    if (!ufId) {
      return NextResponse.json({ error: 'ufId é obrigatório' }, { status: 400 });
    }

    const resultado = await db.query.cidades.findMany({
      where: eq(cidades.uf_id, parseInt(ufId)),
      orderBy: (cidades, { asc }) => asc(cidades.nome),
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    return NextResponse.json({ error: 'Erro ao buscar cidades' }, { status: 500 });
  }
}
