import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Este endpoint é para manutenção e não é mais necessário com SQLite
    // A tabela de questões é criada automaticamente via db.ts
    return NextResponse.json({
      message: 'A tabela de questões é criada automaticamente via db.ts',
      status: 'ok'
    });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao criar tabela' },
      { status: 500 }
    );
  }
}
