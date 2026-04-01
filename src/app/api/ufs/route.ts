import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const resultado = await db.query.ufs.findMany({
      orderBy: (ufs, { asc }) => asc(ufs.nome),
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar UFs:', error);
    return NextResponse.json({ error: 'Erro ao buscar UFs' }, { status: 500 });
  }
}
