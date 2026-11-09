import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const c = createClient({
  url: process.env.TURSO_DATABASE_URL || process.env.NEXT_PUBLIC_TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  const overall = await c.execute(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN material_resumo IS NOT NULL AND material_resumo <> '' THEN 1 ELSE 0 END) AS com_resumo,
      SUM(CASE WHEN material_conteudo IS NOT NULL AND material_conteudo <> '' THEN 1 ELSE 0 END) AS com_conteudo
    FROM questions
  `);
  console.log('=== Cobertura global ===');
  console.log(overall.rows[0]);

  const esfcex = await c.execute(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN material_resumo IS NOT NULL AND material_resumo <> '' THEN 1 ELSE 0 END) AS com_resumo,
      SUM(CASE WHEN material_conteudo IS NOT NULL AND material_conteudo <> '' THEN 1 ELSE 0 END) AS com_conteudo
    FROM questions WHERE concurso_id = 5
  `);
  console.log('\n=== EsFCEx (concurso_id=5) ===');
  console.log(esfcex.rows[0]);

  // 2 questões de EsFCEx para inspecionar (capítulos diferentes, conteúdos
  // diferentes — provar que NÃO é tudo igual).
  const samples = await c.execute(`
    SELECT id, disciplina, capitulo,
      substr(enunciado, 1, 80) AS enunciado_preview,
      substr(material_resumo, 1, 200) AS resumo_preview,
      length(material_conteudo) AS tamanho_conteudo
    FROM questions
    WHERE concurso_id = 5
    ORDER BY disciplina, capitulo
    LIMIT 6
  `);
  console.log('\n=== Amostras EsFCEx (devem ser diferentes entre si) ===');
  for (const row of samples.rows) console.log(row);

  // Sanidade: nenhuma questão deve ficar sem resumo
  const semMaterial = await c.execute(`
    SELECT COUNT(*) AS n FROM questions
    WHERE material_resumo IS NULL OR material_resumo = ''
  `);
  console.log('\n=== Questões ainda sem resumo (esperado: 0) ===');
  console.log(semMaterial.rows[0]);
}

main().catch((e) => { console.error(e); process.exit(1); });
