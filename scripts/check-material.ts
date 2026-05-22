import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf-8');
  for (const line of env.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const c = createClient({
  url: process.env.TURSO_DATABASE_URL || process.env.NEXT_PUBLIC_TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  const r = await c.execute(`
    SELECT
      disciplina,
      COUNT(*) AS total,
      SUM(CASE WHEN material_resumo IS NOT NULL AND material_resumo <> '' THEN 1 ELSE 0 END) AS com_resumo,
      SUM(CASE WHEN material_conteudo IS NOT NULL AND material_conteudo <> '' THEN 1 ELSE 0 END) AS com_conteudo,
      SUM(CASE WHEN material_estrategia IS NOT NULL AND material_estrategia <> '' THEN 1 ELSE 0 END) AS com_estrategia
    FROM questions
    GROUP BY disciplina
    ORDER BY total DESC
  `);
  console.log('=== Disciplinas vs material ===');
  for (const row of r.rows) console.log(row);

  const c2 = await c.execute(`SELECT id, titulo, slug FROM concursos WHERE titulo LIKE '%sFCEx%' OR titulo LIKE '%FCEX%' OR slug LIKE '%fcex%'`);
  console.log('\n=== Concursos EsFCEx ===');
  for (const row of c2.rows) console.log(row);

  const ids = c2.rows.map((r: any) => r.id).join(',');
  if (ids) {
    const c3 = await c.execute(`
      SELECT id, disciplina, capitulo,
        substr(enunciado, 1, 60) AS enunciado,
        CASE WHEN material_resumo IS NULL OR material_resumo = '' THEN 'NO' ELSE 'YES' END AS resumo,
        CASE WHEN material_conteudo IS NULL OR material_conteudo = '' THEN 'NO' ELSE 'YES' END AS conteudo,
        CASE WHEN material_estrategia IS NULL OR material_estrategia = '' THEN 'NO' ELSE 'YES' END AS estrategia
      FROM questions
      WHERE concurso_id IN (${ids})
      LIMIT 30
    `);
    console.log(`\n=== Sample EsFCEx questions (${c3.rows.length}) ===`);
    for (const row of c3.rows) console.log(row);

    const c4 = await c.execute(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN material_resumo IS NOT NULL AND material_resumo <> '' THEN 1 ELSE 0 END) AS com_resumo,
        SUM(CASE WHEN material_conteudo IS NOT NULL AND material_conteudo <> '' THEN 1 ELSE 0 END) AS com_conteudo
      FROM questions
      WHERE concurso_id IN (${ids})
    `);
    console.log('\n=== EsFCEx summary ===');
    for (const row of c4.rows) console.log(row);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
