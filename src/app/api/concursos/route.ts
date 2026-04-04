import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { concursos } from '@/db/schema';
import { eq, and, like, SQL } from 'drizzle-orm';

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

    return NextResponse.json(resultado);
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
      uf_id: body.uf_id,
      cidade_id: body.cidade_id,
      vagas_total: body.vagas_total,
      status: body.status || 'ativo',
      data_abertura_inscricoes: body.data_abertura_inscricoes,
      data_fechamento_inscricoes: body.data_fechamento_inscricoes,
      data_prova_objetiva: body.data_prova_objetiva,
      url_edital: body.url_edital,
      url_site_oficial: body.url_site_oficial,
      banca: body.banca,
      remuneracao_inicial: body.remuneracao_inicial,
      nivel_escolaridade: body.nivel_escolaridade,
      fonte_scrape: body.fonte_scrape,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    });

    return NextResponse.json(novoConcurso, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar concurso:', error);
    return NextResponse.json({ error: 'Erro ao criar concurso' }, { status: 500 });
  }
}
