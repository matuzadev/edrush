import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient as rawClient } from '@/lib/db';

// Limiar mínimo de acerto para considerar um capítulo "completado". Match com
// /api/study/session — quando muda lá, mude aqui.
const COMPLETION_THRESHOLD_PCT = 80;

/**
 * GET /api/user/chapter-completion
 * Retorna pares { subject, chapterId } completados pelo usuário (≥1 sessão com
 * accuracy ≥ COMPLETION_THRESHOLD_PCT). Usado pelo dashboard para liberar
 * automaticamente o próximo capítulo (estilo Duolingo).
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: 'Sem ID' }, { status: 401 });
  }

  try {
    const rs = await rawClient.execute({
      sql: `SELECT DISTINCT subject, chapter_id
            FROM study_sessions
            WHERE user_id = ?
              AND subject IS NOT NULL
              AND chapter_id IS NOT NULL
              AND questions_answered > 0
              AND (correct_answers * 100.0 / questions_answered) >= ?`,
      args: [userId, COMPLETION_THRESHOLD_PCT],
    });

    const completed = rs.rows.map((r) => ({
      subject: String((r as unknown as { subject: string }).subject),
      chapterId: Number((r as unknown as { chapter_id: number }).chapter_id),
    }));

    return NextResponse.json({ completed, threshold: COMPLETION_THRESHOLD_PCT });
  } catch (err) {
    console.error('Erro ao buscar conclusões:', err);
    return NextResponse.json({ completed: [] });
  }
}
