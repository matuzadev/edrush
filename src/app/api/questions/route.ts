import { NextRequest, NextResponse } from 'next/server';
import { lsClient as rawClient } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const disciplina = searchParams.get('disciplina');
    const capitulo = searchParams.get('capitulo');
    const dificuldade = searchParams.get('dificuldade');
    const concursoId = searchParams.get('concurso_id');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') ?? '100');
    let effectiveLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 100;
    // Anti-farm: por padrão, exclui questões que o usuário já acertou.
    // Pode ser desligado via ?includeAnswered=1 (preview, admin, manage-questions).
    const includeAnswered = searchParams.get('includeAnswered') === '1';

    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
    // Build raw SQL query to ensure new material columns are fetched
    const conditions: string[] = [];
    const args: (string | number)[] = [];

    if (disciplina) {
      conditions.push('disciplina = ?');
      args.push(disciplina);
    }
    if (capitulo) {
      conditions.push('capitulo = ?');
      args.push(capitulo);
    }
    if (dificuldade) {
      const DIFF_VARIANTS: Record<string, string[]> = {
        'fácil':   ['fácil', 'facil'],
        'facil':   ['fácil', 'facil'],
        'médio':   ['médio', 'medio'],
        'medio':   ['médio', 'medio'],
        'difícil': ['difícil', 'dificil'],
        'dificil': ['difícil', 'dificil'],
      };
      const variants = DIFF_VARIANTS[dificuldade.toLowerCase()];
      if (variants) {
        conditions.push(`dificuldade IN (${variants.map(() => '?').join(', ')})`);
        args.push(...variants);
      } else {
        conditions.push('dificuldade = ?');
        args.push(dificuldade);
      }
    }
    if (concursoId) {
      conditions.push('concurso_id = ?');
      args.push(parseInt(concursoId));
    }
    if (search) {
      conditions.push('enunciado LIKE ?');
      args.push(`%${search}%`);
    }

    // Modo revisão: se a (disciplina, capítulo) já está marcado como completo
    // para este usuário, libera todas as questões — inclusive já acertadas.
    // Detecta de duas formas (qualquer uma libera): (1) user_chapter_progress
    // com is_completed=1; (2) qualquer sessão em study_sessions com ≥80% para
    // o par (subject, chapter_id) — passa a funcionar para TODAS as matérias
    // sem precisar seedar a tabela chapters.
    const subjectParam = searchParams.get('subject');
    const chapterIdParam = searchParams.get('chapterId');
    let chapterCompleted = false;
    if (userId && disciplina && capitulo) {
      try {
        const completedRs = await rawClient.execute({
          sql: `SELECT 1 FROM chapters c
                JOIN user_chapter_progress p ON p.chapter_id = c.id
                WHERE c.disciplina = ? AND c.titulo = ?
                  AND p.user_id = ? AND p.is_completed = 1
                LIMIT 1`,
          args: [disciplina, capitulo, userId],
        });
        chapterCompleted = completedRs.rows.length > 0;
      } catch { /* segue normal */ }
    }
    if (!chapterCompleted && userId && subjectParam && chapterIdParam) {
      try {
        const chId = parseInt(chapterIdParam, 10);
        if (Number.isFinite(chId)) {
          const rs2 = await rawClient.execute({
            sql: `SELECT 1 FROM study_sessions
                  WHERE user_id = ? AND subject = ? AND chapter_id = ?
                    AND questions_answered > 0
                    AND (correct_answers * 100.0 / questions_answered) >= 80
                  LIMIT 1`,
            args: [userId, subjectParam, chId],
          });
          chapterCompleted = rs2.rows.length > 0;
        }
      } catch { /* segue normal */ }
    }

    // Anti-farm: exclui questões já acertadas por esse usuário (qualquer resposta sua com acertou=1).
    // Desativado quando o capítulo está em modo revisão (completado) ou via ?includeAnswered=1.
    let excludedCount = 0;
    const skipAntiFarm = includeAnswered || chapterCompleted;
    if (userId && !skipAntiFarm) {
      conditions.push(`id NOT IN (
        SELECT DISTINCT question_id FROM user_responses
        WHERE user_id = ? AND acertou = 1 AND question_id > 0
      )`);
      args.push(userId);

      // Conta quantas seriam excluídas (para retornar como métrica)
      try {
        const baseFilters: string[] = [];
        const baseArgs: (string | number)[] = [];
        if (disciplina) { baseFilters.push('disciplina = ?'); baseArgs.push(disciplina); }
        if (capitulo)   { baseFilters.push('capitulo = ?');   baseArgs.push(capitulo); }
        const wf = baseFilters.length > 0 ? `WHERE ${baseFilters.join(' AND ')} AND ` : 'WHERE ';
        const countSql = `SELECT COUNT(*) AS n FROM questions ${wf} id IN (
          SELECT DISTINCT question_id FROM user_responses
          WHERE user_id = ? AND acertou = 1 AND question_id > 0
        )`;
        const countRs = await rawClient.execute({ sql: countSql, args: [...baseArgs, userId] });
        excludedCount = Number((countRs.rows[0] as unknown as { n: number })?.n ?? 0);
      } catch { /* não bloqueia se falhar */ }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT id, titulo, disciplina, capitulo, tipo, enunciado, explicacao, dica, opcoes,
      resposta_correta, dificuldade, fonte, concurso_id, ano,
      material_resumo, material_topicos, material_estrategia, material_referencias, material_conteudo
      FROM questions ${whereClause} LIMIT ?`;
    args.push(effectiveLimit);

    const rs = await rawClient.execute({ sql, args });
    const resultado = rs.rows;
    // Transform to match expected format (resultado is raw libsql rows)
    const transformedQuestions = resultado.map((q: any) => {
      let studyMaterial: {
        summary: string | null;
        topics: string[];
        strategy: string | null;
        references: { title: string; type: string; author: string }[];
        fullContent: string | null;
      } | null = null;

      if (q.material_resumo || q.material_topicos || q.material_estrategia || q.material_referencias || q.material_conteudo) {
        studyMaterial = {
          summary: q.material_resumo ?? null,
          topics: q.material_topicos
            ? (typeof q.material_topicos === 'string' ? JSON.parse(q.material_topicos) : q.material_topicos)
            : [],
          strategy: q.material_estrategia ?? null,
          references: q.material_referencias
            ? (typeof q.material_referencias === 'string' ? JSON.parse(q.material_referencias) : q.material_referencias)
            : [],
          fullContent: q.material_conteudo ?? null,
        };
      }

      return {
        id: String(q.id),
        question: q.enunciado,
        subject: q.disciplina,
        chapter: q.capitulo,
        type: q.tipo,
        correctAnswer: q.resposta_correta,
        explanation: q.explicacao,
        hint: q.dica,
        difficulty: q.dificuldade,
        options: q.opcoes ? (typeof q.opcoes === 'string' ? JSON.parse(q.opcoes) : q.opcoes) : null,
        source: q.fonte,
        year: q.ano,
        studyMaterial,
      };
    });

    return NextResponse.json({
      success: true,
      questions: transformedQuestions,
      count: transformedQuestions.length,
      excludedAlreadyCorrect: excludedCount, // questões filtradas por anti-farm
      reviewMode: chapterCompleted,          // capítulo já completado: tudo liberado
      dailyLimitReached: false,
      dailyLimit,
      answeredToday,
      questionsRemainingToday: dailyLimit === null ? null : Math.max(0, dailyLimit - answeredToday),
    });
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar questões',
      message: error instanceof Error ? error.message : 'Erro interno'
    }, { status: 500 });
  }
}
