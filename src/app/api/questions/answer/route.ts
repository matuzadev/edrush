import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { db } from '@/lib/db';
import { user_responses } from '@/db/schema';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  let body: {
    questionId: unknown;
    resposta_dada: string;
    acertou: boolean;
    tempo_resposta_ms?: number;
    disciplina?: string;
    capitulo?: string;
    subject?: string;
    origem?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  if (typeof body.resposta_dada !== 'string' || typeof body.acertou !== 'boolean') {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const rawId = String(body.questionId ?? '');
  const numericId = parseInt(rawId, 10);
  const isNumeric = !isNaN(numericId) && numericId > 0 && String(numericId) === rawId;

  // FK em question_id existe no schema mas o libsql não enforça FOREIGN_KEYS por padrão.
  // Quando id é não-numérico (questão local/mock), gravamos 0 em question_id e o id real em external_id.
  const questionIdToStore = isNumeric ? numericId : 0;
  const externalIdToStore = isNumeric ? null : (rawId || null);

  try {
    await db.insert(user_responses).values({
      user_id: userId,
      question_id: questionIdToStore,
      external_id: externalIdToStore,
      resposta_dada: body.resposta_dada,
      acertou: body.acertou ? 1 : 0,
      tempo_resposta_ms: body.tempo_resposta_ms ?? null,
      disciplina: body.disciplina ?? null,
      capitulo: body.capitulo ?? null,
      subject: body.subject ?? null,
      origem: body.origem ?? null,
      respondida_em: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
