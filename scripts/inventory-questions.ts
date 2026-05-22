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
  const r = await c.execute(`
    SELECT disciplina, capitulo, COUNT(*) AS n,
      SUM(CASE WHEN dificuldade IN ('fácil','facil') THEN 1 ELSE 0 END) AS facil,
      SUM(CASE WHEN dificuldade IN ('médio','medio') THEN 1 ELSE 0 END) AS medio,
      SUM(CASE WHEN dificuldade IN ('difícil','dificil') THEN 1 ELSE 0 END) AS dificil
    FROM questions
    GROUP BY disciplina, capitulo
    ORDER BY disciplina, n ASC
  `);

  console.log('Disciplina | Capítulo | total | fácil | médio | difícil');
  console.log('-'.repeat(100));
  for (const row of r.rows as any[]) {
    console.log(`${row.disciplina} | ${row.capitulo} | ${row.n} | ${row.facil} | ${row.medio} | ${row.dificil}`);
  }

  const tot = await c.execute(`SELECT COUNT(*) AS n FROM questions`);
  console.log(`\nTOTAL geral: ${(tot.rows[0] as any).n}`);

  const porDisc = await c.execute(`
    SELECT disciplina, COUNT(*) AS n FROM questions
    GROUP BY disciplina ORDER BY n DESC
  `);
  console.log('\n=== Por disciplina ===');
  for (const row of porDisc.rows as any[]) console.log(`${row.disciplina}: ${row.n}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
