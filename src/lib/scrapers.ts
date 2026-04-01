import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { db } from '@/lib/db';
import { concursos } from '@/db/schema';

/**
 * Scraper para:
 * - gov.br (PCF - Polícia Civil Federal)
 * - Polícia Federal
 * - CESPE (banca mais comum)
 * - Sites de notícias (G1, Folha)
 * Estratégia:
 * 1. Acessar páginas conhecidas de editais e concursos
 * 2. Extrair links e informações relevantes (título, data, órgão, etc)
 * 3. Validar e normalizar os dados
 * 4. Inserir no banco de dados (SQLite via Drizzle ORM)
 * 5. Agendar para rodar periodicamente (ex: a cada 6 horas)
 */

export async function scraperGovBr() {
  try {
    console.log('🔍 Iniciando scraper de gov.br...');
    
    // URLs conhecidas para concursos federais
    const urls = [
      'https://www.gov.br/pf/pt-br/acesso-a-informacao/edital-de-concursos-publicos',
      'https://www.cespe.unb.br/concursos/concursos-abertos',
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (!response.ok) continue;

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extrair links de editais (estrutura varia por site)
        const links = $('a[href*="edital"], a[href*="concurso"]')
          .map((_, el) => ({
            titulo: $(el).text().trim(),
            url: $(el).attr('href'),
          }))
          .get();

        console.log(`📄 Encontrados ${links.length} editais em ${url}`);
      } catch (error) {
        console.error(`Erro ao fazer scrape de ${url}:`, error);
      }
    }
  } catch (error) {
    console.error('❌ Erro no scraper gov.br:', error);
  }
}

export async function scraperPolicia Federal() {
  try {
    console.log('🔍 Iniciando scraper da Polícia Federal...');
    
    const url = 'https://www.pf.gov.br/importa ntes/editais-e-concursos';
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error('Erro ao acessar PF website');
      return;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Buscar por elementos que contenham editais
    const editais = $('[class*="edital"], [id*="edital"]')
      .map((_, el) => ({
        titulo: $(el).text().trim(),
        link: $(el).find('a').attr('href'),
      }))
      .get();

    console.log(`📄 Encontrados ${editais.length} editais da PF`);

    // Inserir no banco
    for (const edital of editais) {
      try {
        await db.insert(concursos).values({
          titulo: edital.titulo,
          organizador: 'Polícia Federal',
          orgao: 'Ministério da Justiça',
          status: 'ativo',
          url_edital: edital.link,
          url_site_oficial: url,
          banca: 'CESPE/CEBRASPE',
          fonte_scrape: 'pf.gov.br',
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
        });
      } catch (e) {
        // Edital já existe ou erro de validação
      }
    }
  } catch (error) {
    console.error('❌ Erro no scraper Polícia Federal:', error);
  }
}

export async function scraperNoticiasGovBr() {
  try {
    console.log('🔍 Iniciando scraper de notícias de concursos...');
    
    // URLs de notícias que costumam publicar editais
    const urls = [
      'https://www.g1.globo.com/economia/noticia/?s=concurso+publico',
      'https://www1.folha.uol.com.br/?s=concurso+publico',
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (!response.ok) continue;

        const html = await response.text();
        const $ = cheerio.load(html);

        // Buscar notícias com "concurso" no título
        const noticias = $('article, [class*="noticia"]')
          .filter((_, el) => {
            const text = $(el).text().toLowerCase();
            return text.includes('concurso') || text.includes('edital');
          })
          .map((_, el) => {
            const link = $(el).find('a').attr('href');
            const titulo = $(el).find('h2, h3, span[class*="titulo"]').first().text();
            return { titulo: titulo.trim(), link };
          })
          .get()
          .slice(0, 10);

        console.log(`📰 Encontradas ${noticias.length} notícias em ${url}`);
      } catch (error) {
        console.error(`Erro ao fazer scrape de ${url}:`, error);
      }
    }
  } catch (error) {
    console.error('❌ Erro no scraper de notícias:', error);
  }
}

// Executar scrapers periodicamente
export async function runScrapers() {
  await scraperGovBr();
  await scraperPolicia Federal();
  await scraperNoticiasGovBr();
}

// Exportar para cron job
export async function GET() {
  try {
    await runScrapers();
    return Response.json({ success: true, message: 'Scrapers executados com sucesso' });
  } catch (error) {
    console.error('Erro ao executar scrapers:', error);
    return Response.json({ success: false, error: 'Erro ao executar scrapers' }, { status: 500 });
  }
}
