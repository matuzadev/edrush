import { NextRequest, NextResponse } from 'next/server';
import { lsClient as rawClient } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

// Variantes de dificuldade (com/sem acento) para casar com o que tá no banco
const DIFF_VARIANTS: Record<string, string[]> = {
  facil:   ['fácil',   'facil'],
  medio:   ['médio',   'medio'],
  dificil: ['difícil', 'dificil'],
};

type Filtro = 'todas' | 'nao_vistas' | 'erradas';

interface CountResponse {
  total: number;
  byDifficulty: { facil: number; medio: number; dificil: number };
  cached: boolean;
}

// Cache in-memory simples por chave de params + userId. TTL 60s.
// Em serverless o cache vive na instância quente — bom o suficiente pra reduzir
// fetch repetido de mesma combinação de filtros durante debounce.
const COUNT_CACHE = new Map<string, { value: CountResponse; expiresAt: number }>();
const TTL_MS = 60_000;

function cacheKey(params: Record<string, string | null | undefined>, userId: string | null): string {
  const sorted = Object.entries(params)
    .filter(([, v]) => v != null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return `${userId ?? 'anon'}::${sorted}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const disciplina = searchParams.get('disciplina');
    const capitulo = searchParams.get('capitulo');
    const concursoId = searchParams.get('concurso_id');
    const dificuldadeRaw = searchParams.get('dificuldade'); // "facil,medio,dificil"
    const filtroRaw = (searchParams.get('filtro') ?? 'todas') as Filtro;

    if (!disciplina) {
      return NextResponse.json({ error: 'disciplina é obrigatória' }, { status: 400 });
    }
    const filtro: Filtro =
      filtroRaw === 'nao_vistas' || filtroRaw === 'erradas' ? filtroRaw : 'todas';

    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

    // Para "nao_vistas" e "erradas" precisamos do userId (caso contrário, ignora)
    const effectiveFilter: Filtro = userId ? filtro : 'todas';

    // Cache lookup
    const key = cacheKey(
      { disciplina, capitulo, concursoId, dificuldade: dificuldadeRaw, filtro: effectiveFilter },
      userId,
    );
    const cached = COUNT_CACHE.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({ ...cached.value, cached: true });
    }

    // Builder
    const conditions: string[] = ['disciplina = ?'];
    const args: (string | number)[] = [disciplina];

    if (capitulo) {
      conditions.push('capitulo = ?');
      args.push(capitulo);
    }
    if (concursoId) {
      const idNum = parseInt(concursoId, 10);
      if (Number.isFinite(idNum)) {
        conditions.push('concurso_id = ?');
        args.push(idNum);
      }
    }

    // Lista de dificuldades selecionadas (default: todas)
    const dificuldadesSelecionadas: ('facil' | 'medio' | 'dificil')[] =
      dificuldadeRaw && dificuldadeRaw.trim().length > 0
        ? (dificuldadeRaw
            .split(',')
            .map((d) => d.trim().toLowerCase())
            .filter((d): d is 'facil' | 'medio' | 'dificil' =>
              d === 'facil' || d === 'medio' || d === 'dificil',
            ))
        : ['facil', 'medio', 'dificil'];

    if (dificuldadesSelecionadas.length === 0) {
      // nada selecionado → 0 resultados
      const empty: CountResponse = {
        total: 0,
        byDifficulty: { facil: 0, medio: 0, dificil: 0 },
        cached: false,
      };
      COUNT_CACHE.set(key, { value: empty, expiresAt: Date.now() + TTL_MS });
      return NextResponse.json(empty);
    }

    // Filtro de usuário (não-vistas / erradas)
    if (effectiveFilter === 'nao_vistas' && userId) {
      // questões que o usuário NUNCA respondeu
      conditions.push(`id NOT IN (
        SELECT DISTINCT question_id FROM user_responses
        WHERE user_id = ? AND question_id > 0
      )`);
      args.push(userId);
    } else if (effectiveFilter === 'erradas' && userId) {
      // questões que o usuário errou ao menos uma vez E nunca acertou ainda
      conditions.push(`id IN (
        SELECT DISTINCT question_id FROM user_responses
        WHERE user_id = ? AND acertou = 0 AND question_id > 0
      )`);
      args.push(userId);
      conditions.push(`id NOT IN (
        SELECT DISTINCT question_id FROM user_responses
        WHERE user_id = ? AND acertou = 1 AND question_id > 0
      )`);
      args.push(userId);
    }

    // Faz uma única query agregando por dificuldade — barata
    // SELECT dificuldade, COUNT(*) FROM questions WHERE ... GROUP BY dificuldade
    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const sql = `SELECT dificuldade, COUNT(*) AS n FROM questions ${whereClause} GROUP BY dificuldade`;

    const rs = await rawClient.execute({ sql, args });

    // Normaliza dificuldade (com/sem acento) → bucket
    const buckets = { facil: 0, medio: 0, dificil: 0 };
    for (const row of rs.rows) {
      const r = row as unknown as { dificuldade: string | null; n: number };
      const raw = (r.dificuldade ?? '').toLowerCase();
      const n = Number(r.n) || 0;
      if (DIFF_VARIANTS.facil.includes(raw))   buckets.facil   += n;
      else if (DIFF_VARIANTS.medio.includes(raw))   buckets.medio   += n;
      else if (DIFF_VARIANTS.dificil.includes(raw)) buckets.dificil += n;
      else buckets.medio += n; // fallback (questões sem dificuldade definida)
    }

    // Aplica máscara de dificuldades selecionadas
    const filteredBuckets = {
      facil:   dificuldadesSelecionadas.includes('facil')   ? buckets.facil   : 0,
      medio:   dificuldadesSelecionadas.includes('medio')   ? buckets.medio   : 0,
      dificil: dificuldadesSelecionadas.includes('dificil') ? buckets.dificil : 0,
    };
    const total = filteredBuckets.facil + filteredBuckets.medio + filteredBuckets.dificil;

    const value: CountResponse = {
      total,
      byDifficulty: filteredBuckets,
      cached: false,
    };

    COUNT_CACHE.set(key, { value, expiresAt: Date.now() + TTL_MS });
    return NextResponse.json(value);
  } catch (error) {
    console.error('Erro em /api/questions/count:', error);
    return NextResponse.json(
      { error: 'Erro ao contar questões', message: error instanceof Error ? error.message : 'erro' },
      { status: 500 },
    );
  }
}
