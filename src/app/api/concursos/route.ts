import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { isAdminSession } from '@/lib/admin';
import { db, lsClient as rawClient } from '@/lib/db';
import { concursos } from '@/db/schema';

// Status válidos — alinhados com os valores usados no seed
const VALID_STATUSES = new Set([
  'previsto',
  'edital_proximo',
  'inscricoes_abertas',
  'aguardando_prova',
  'finalizado',
  'ativo', // legado: compatibilidade com registros antigos
]);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const ufId = searchParams.get('ufId');
    const titulo = searchParams.get('titulo');

    // Monta cláusula WHERE e lista de args para o rawClient
    const conditions: string[] = [];
    const args: (string | number)[] = [];

    if (status && VALID_STATUSES.has(status)) {
      conditions.push('c.status = ?');
      args.push(status);
    }
    if (ufId && !isNaN(parseInt(ufId))) {
      conditions.push('c.uf_id = ?');
      args.push(parseInt(ufId));
    }
    if (titulo) {
      conditions.push('c.titulo LIKE ?');
      args.push(`%${titulo}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await rawClient.execute({
      sql: `
        SELECT
          c.id,
          c.titulo,
          c.organizador,
          c.orgao,
          c.descricao,
          c.slug,
          c.vagas_total,
          c.vagas_por_funcao,
          c.status,
          c.data_publicacao_edital,
          c.data_abertura_inscricoes,
          c.data_fechamento_inscricoes,
          c.data_prova_objetiva,
          c.data_prova_discursiva,
          c.data_resultado_final,
          c.url_edital,
          c.url_site_oficial,
          c.banca,
          c.remuneracao_inicial,
          c.nivel_escolaridade,
          c.fonte_scrape,
          c.logo_url,
          c.cargo,
          c.area_especialidade,
          c.edital_numero,
          c.edital_ano,
          c.vagas_cargo,
          c.url_inscricao,
          c.requisitos,
          c.destaque,
          c.criado_em,
          c.atualizado_em,
          u.sigla AS uf_sigla,
          u.nome  AS uf_nome
        FROM concursos c
        LEFT JOIN ufs u ON c.uf_id = u.id
        ${whereClause}
        ORDER BY c.destaque DESC, c.data_abertura_inscricoes DESC
        LIMIT 100
      `,
      args,
    });

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erro ao buscar concursos:', error);
    return NextResponse.json({ error: 'Erro ao buscar concursos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();

    const novoConcurso = await db.insert(concursos).values({
      titulo: body.titulo,
      organizador: body.organizador,
      orgao: body.orgao,
      descricao: body.descricao,
      slug: body.slug ?? null,
      uf_id: body.uf_id,
      cidade_id: body.cidade_id,
      vagas_total: body.vagas_total,
      status: body.status || 'previsto',
      data_publicacao_edital: body.data_publicacao_edital ?? null,
      data_abertura_inscricoes: body.data_abertura_inscricoes,
      data_fechamento_inscricoes: body.data_fechamento_inscricoes,
      data_prova_objetiva: body.data_prova_objetiva,
      data_prova_discursiva: body.data_prova_discursiva ?? null,
      data_resultado_final: body.data_resultado_final ?? null,
      url_edital: body.url_edital,
      url_site_oficial: body.url_site_oficial,
      banca: body.banca,
      remuneracao_inicial: body.remuneracao_inicial,
      nivel_escolaridade: body.nivel_escolaridade,
      fonte_scrape: body.fonte_scrape,
      logo_url: body.logo_url ?? null,
      cargo: body.cargo ?? null,
      area_especialidade: body.area_especialidade ?? null,
      edital_numero: body.edital_numero ?? null,
      edital_ano: body.edital_ano ?? null,
      vagas_cargo: body.vagas_cargo ?? null,
      url_inscricao: body.url_inscricao ?? null,
      requisitos: body.requisitos ? JSON.stringify(body.requisitos) : null,
      destaque: body.destaque ?? 0,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    });

    return NextResponse.json(novoConcurso, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar concurso:', error);
    return NextResponse.json({ error: 'Erro ao criar concurso' }, { status: 500 });
  }
}
