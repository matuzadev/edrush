import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient } from '@/lib/db';

interface DisciplineRow {
  discipline: string;
  difficulty: string | null;
  questionsCount: number;
  completedCount: number;
}

const DIFFICULTY_RANK: Record<string, number> = {
  fácil: 1,
  facil: 1,
  médio: 2,
  medio: 2,
  difícil: 3,
  dificil: 3,
};

function normalizeDifficulty(value: string | null): 'fácil' | 'médio' | 'difícil' {
  const normalized = value?.trim().toLowerCase() ?? '';
  if (normalized === 'facil' || normalized === 'fácil') return 'fácil';
  if (normalized === 'dificil' || normalized === 'difícil') return 'difícil';
  return 'médio';
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const userResult = await lsClient.execute({
      sql: 'SELECT selected_concurso_id, selected_concurso_slug, selected_areas FROM users WHERE id = ? LIMIT 1',
      args: [userId],
    });
    const user = userResult.rows[0] as unknown as {
      selected_concurso_id: number | null;
      selected_concurso_slug: string | null;
      selected_areas: string | null;
    } | undefined;

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const parsedAreas: unknown = user.selected_areas ? JSON.parse(user.selected_areas) : [];
    const selectedAreas = Array.isArray(parsedAreas)
      ? parsedAreas.filter((area): area is string => typeof area === 'string')
      : [];

    let concursoId = user.selected_concurso_id ? Number(user.selected_concurso_id) : null;
    let concursoTitle: string | null = null;

    if (concursoId !== null) {
      const contestResult = await lsClient.execute({
        sql: 'SELECT titulo FROM concursos WHERE id = ? LIMIT 1',
        args: [concursoId],
      });
      concursoTitle = contestResult.rows[0]
        ? String((contestResult.rows[0] as unknown as { titulo: string }).titulo)
        : null;
    } else if (user.selected_concurso_slug) {
      const contestResult = await lsClient.execute({
        sql: 'SELECT id, titulo FROM concursos WHERE slug = ? LIMIT 1',
        args: [user.selected_concurso_slug],
      });
      const contest = contestResult.rows[0] as unknown as { id: number; titulo: string } | undefined;
      if (contest) {
        concursoId = Number(contest.id);
        concursoTitle = contest.titulo;
      }
    }

    const conditions: string[] = [];
    const args: (string | number)[] = [userId];
    if (concursoId !== null) {
      conditions.push('q.concurso_id = ?');
      args.push(concursoId);
    }
    if (selectedAreas.length > 0) {
      conditions.push(`q.disciplina IN (${selectedAreas.map(() => '?').join(', ')})`);
      args.push(...selectedAreas);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const rowsResult = await lsClient.execute({
      sql: `SELECT q.disciplina AS discipline,
                   q.dificuldade AS difficulty,
                   COUNT(DISTINCT q.id) AS questionsCount,
                   COUNT(DISTINCT CASE WHEN ur.id IS NOT NULL THEN q.id END) AS completedCount
            FROM questions q
            LEFT JOIN user_responses ur
              ON ur.question_id = q.id
              AND ur.user_id = ?
              AND ur.origem = 'simulado'
            ${whereClause}
            GROUP BY q.disciplina, q.dificuldade
            ORDER BY q.disciplina COLLATE NOCASE`,
      args,
    });

    const rows = rowsResult.rows as unknown as DisciplineRow[];
    const byDiscipline = new Map<string, {
      questionsCount: number;
      completedCount: number;
      difficultyCounts: Map<string, number>;
    }>();

    for (const row of rows) {
      const current = byDiscipline.get(row.discipline) ?? {
        questionsCount: 0,
        completedCount: 0,
        difficultyCounts: new Map<string, number>(),
      };
      current.questionsCount += Number(row.questionsCount);
      current.completedCount += Number(row.completedCount);
      const difficulty = normalizeDifficulty(row.difficulty);
      current.difficultyCounts.set(
        difficulty,
        (current.difficultyCounts.get(difficulty) ?? 0) + Number(row.questionsCount),
      );
      byDiscipline.set(row.discipline, current);
    }

    const disciplines = [...byDiscipline.entries()].map(([name, data]) => {
      const difficulty = [...data.difficultyCounts.entries()]
        .sort((a, b) => b[1] - a[1] || DIFFICULTY_RANK[b[0]] - DIFFICULTY_RANK[a[0]])[0]?.[0] ?? 'médio';

      return {
        id: name,
        name,
        questionsCount: data.questionsCount,
        completedCount: data.completedCount,
        difficulty: difficulty as 'fácil' | 'médio' | 'difícil',
        estimatedTime: data.questionsCount * 2,
      };
    });

    return NextResponse.json({
      title: concursoTitle ? `Concurso: ${concursoTitle}` : 'Simulados disponíveis',
      concursoId,
      disciplines,
    });
  } catch (error) {
    console.error('Erro ao carregar simulados do banco:', error);
    return NextResponse.json({ error: 'Não foi possível carregar os simulados' }, { status: 500 });
  }
}
