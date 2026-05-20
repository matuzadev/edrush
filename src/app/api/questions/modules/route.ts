import { NextRequest, NextResponse } from 'next/server';
import { lsClient as rawClient } from '@/lib/db';

interface ModuleRow {
  capitulo: string;
  count: number;
}

// Cache leve por (disciplina, concursoId). Módulos mudam só quando admin
// adiciona questões — TTL de 5 minutos é folgado.
const CACHE = new Map<string, { value: ModuleRow[]; expiresAt: number }>();
const TTL_MS = 5 * 60_000;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const disciplina = searchParams.get('disciplina');
    const concursoId = searchParams.get('concurso_id');

    if (!disciplina) {
      return NextResponse.json({ error: 'disciplina é obrigatória' }, { status: 400 });
    }

    const key = `${disciplina}::${concursoId ?? 'all'}`;
    const cached = CACHE.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({ modules: cached.value, cached: true });
    }

    const conditions: string[] = ['disciplina = ?'];
    const args: (string | number)[] = [disciplina];
    if (concursoId) {
      const idNum = parseInt(concursoId, 10);
      if (Number.isFinite(idNum)) {
        conditions.push('concurso_id = ?');
        args.push(idNum);
      }
    }

    const sql = `SELECT capitulo, COUNT(*) AS n FROM questions
                 WHERE ${conditions.join(' AND ')}
                 GROUP BY capitulo
                 ORDER BY capitulo ASC`;
    const rs = await rawClient.execute({ sql, args });

    const modules: ModuleRow[] = rs.rows
      .map((row) => {
        const r = row as unknown as { capitulo: string | null; n: number };
        return { capitulo: r.capitulo ?? '', count: Number(r.n) || 0 };
      })
      .filter((m) => m.capitulo.trim().length > 0);

    CACHE.set(key, { value: modules, expiresAt: Date.now() + TTL_MS });
    return NextResponse.json({ modules, cached: false });
  } catch (error) {
    console.error('Erro em /api/questions/modules:', error);
    return NextResponse.json(
      { error: 'Erro ao listar módulos', message: error instanceof Error ? error.message : 'erro' },
      { status: 500 },
    );
  }
}
