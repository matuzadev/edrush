import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import path from 'path';

const dbUrl = process.env.TURSO_DATABASE_URL ?? `file:${path.resolve(process.cwd(), 'data/foco-federal.db')}`;
const rawClient = createClient({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const disciplina = searchParams.get('disciplina');
    const capitulo = searchParams.get('capitulo');
    const dificuldade = searchParams.get('dificuldade');
    const concursoId = searchParams.get('concurso_id');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') ?? '100');

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

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT id, titulo, disciplina, capitulo, tipo, enunciado, explicacao, dica, opcoes,
      resposta_correta, dificuldade, fonte, concurso_id, ano,
      material_resumo, material_topicos, material_estrategia, material_referencias, material_conteudo
      FROM questions ${whereClause} LIMIT ?`;
    args.push(limit);

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
      count: transformedQuestions.length 
    });
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar questões',
      message: error instanceof Error ? error.message : 'Erro interno'
    }, { status: 500 });
  }
}
