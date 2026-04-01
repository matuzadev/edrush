import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cidades, ufs } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * API para popular tabela de cidades com dados do IBGE
 * GET /api/admin/populate-cities
 *
 * Requer: ADMIN_SECRET em .env.local para segurança
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação simples
    const adminSecret = request.headers.get('x-admin-secret');
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('📍 Iniciando população de cidades do IBGE...');

    // Buscar UFs para iteração
    const ufsList = await db.query.ufs.findMany();
    
    let totalCidades = 0;
    const erros: string[] = [];

    // Para cada UF, buscar cidades da API do IBGE
    for (const uf of ufsList) {
      try {
        console.log(`🔄 Buscando cidades de ${uf.sigla}...`);
        
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf.codigo_ibge}/municipios`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const cidadesData = await response.json();

        // Inserir cidades no banco
        for (const cidade of cidadesData) {
          try {
            await db.insert(cidades).values({
              codigo_ibge: cidade.id,
              nome: cidade.nome,
              uf_id: uf.id,
              criado_em: new Date().toISOString(),
            }).onConflictDoNothing();
            
            totalCidades++;
          } catch (error) {
            // Ignorar cidades duplicadas
            console.log(`  ⏭️ Cidade ${cidade.nome} já existe`);
          }
        }

        console.log(`  ✅ ${cidadesData.length} cidades inseridas para ${uf.sigla}`);

      } catch (error) {
        const errorMsg = `Erro ao buscar cidades de ${uf.sigla}: ${error}`;
        console.error(`  ❌ ${errorMsg}`);
        erros.push(errorMsg);
      }

      // Throttle para não sobrecarregar API do IBGE
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`✅ População concluída! Total: ${totalCidades} cidades inseridas`);

    return NextResponse.json({
      success: true,
      message: `${totalCidades} cidades inseridas com sucesso`,
      erros: erros.length > 0 ? erros : undefined,
    });

  } catch (error) {
    console.error('❌ Erro ao popular cidades:', error);
    return NextResponse.json(
      { error: 'Erro ao popular cidades', details: String(error) },
      { status: 500 }
    );
  }
}
