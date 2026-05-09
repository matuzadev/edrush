import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
=======
import { createClient } from '@libsql/client';
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
import { db } from '@/lib/db';
import { concursos } from '@/db/schema';
import { eq, and, like, SQL } from 'drizzle-orm';

<<<<<<< HEAD
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status'); // ativo, edital_proximo, finalizado
    const ufId = searchParams.get('ufId');
    const cidadeId = searchParams.get('cidadeId');
    const titulo = searchParams.get('titulo');

    // Aplicar filtros
    const whereConditions: SQL[] = [];
    if (status) whereConditions.push(eq(concursos.status, status));
    if (ufId) whereConditions.push(eq(concursos.uf_id, parseInt(ufId)));
    if (cidadeId) whereConditions.push(eq(concursos.cidade_id, parseInt(cidadeId)));
    if (titulo) whereConditions.push(like(concursos.titulo, `%${titulo}%`));

    const resultado = await db.query.concursos.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        uf: true,
        cidade: true,
      },
      limit: 50,
    });

    // Se não houver resultados no banco (por exemplo em outra máquina),
    // devolvemos um fallback com concursos de exemplo para permitir o fluxo
    // de onboarding/seleção local durante desenvolvimento.
    if (!resultado || resultado.length === 0) {
      const statusFilter = status || 'ativo';
      const fallback = [
        {
          id: 1001,
          titulo: 'Concurso Simulado - Perito Federal',
          organizador: 'Polícia Federal',
          orgao: 'Ministério da Justiça',
          descricao: 'Simulado para desenvolvimento local - área de Informática.',
          vagas_total: 10,
          status: 'ativo',
          data_abertura_inscricoes: null,
          data_fechamento_inscricoes: null,
          banca: 'CESPE',
          logo_url: '/imagens/foco-federal-logo.png',
        },
        {
          id: 1002,
          titulo: 'Concurso Simulado - ESFCEx',
          organizador: 'ESFCEx',
          orgao: 'Exército Brasileiro',
          descricao: 'Simulado para desenvolvimento local - área geral.',
          vagas_total: 5,
          status: 'edital_proximo',
          data_abertura_inscricoes: null,
          data_fechamento_inscricoes: null,
          banca: null,
          logo_url: '/imagens/foco-federal-logo.png',
        },
      ];

      // aplicar filtro de status se informado na querystring
      const filteredFallback = status ? fallback.filter((c) => c.status === status) : fallback;
      return NextResponse.json(filteredFallback);
    }

    return NextResponse.json(resultado);
=======
// Raw client para queries com ORDER BY em colunas novas (destaque) que o drizzle
// schema não tem como orderBy sem recompilar os tipos.
const rawClient = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:data/foco-federal.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

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
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
  } catch (error) {
    console.error('Erro ao buscar concursos:', error);
    return NextResponse.json({ error: 'Erro ao buscar concursos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novoConcurso = await db.insert(concursos).values({
      titulo: body.titulo,
      organizador: body.organizador,
      orgao: body.orgao,
      descricao: body.descricao,
<<<<<<< HEAD
      uf_id: body.uf_id,
      cidade_id: body.cidade_id,
      vagas_total: body.vagas_total,
      status: body.status || 'ativo',
      data_abertura_inscricoes: body.data_abertura_inscricoes,
      data_fechamento_inscricoes: body.data_fechamento_inscricoes,
      data_prova_objetiva: body.data_prova_objetiva,
=======
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
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
      url_edital: body.url_edital,
      url_site_oficial: body.url_site_oficial,
      banca: body.banca,
      remuneracao_inicial: body.remuneracao_inicial,
      nivel_escolaridade: body.nivel_escolaridade,
      fonte_scrape: body.fonte_scrape,
      logo_url: body.logo_url ?? null,
<<<<<<< HEAD
=======
      cargo: body.cargo ?? null,
      area_especialidade: body.area_especialidade ?? null,
      edital_numero: body.edital_numero ?? null,
      edital_ano: body.edital_ano ?? null,
      vagas_cargo: body.vagas_cargo ?? null,
      url_inscricao: body.url_inscricao ?? null,
      requisitos: body.requisitos ? JSON.stringify(body.requisitos) : null,
      destaque: body.destaque ?? 0,
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    });

    return NextResponse.json(novoConcurso, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar concurso:', error);
    return NextResponse.json({ error: 'Erro ao criar concurso' }, { status: 500 });
  }
}
