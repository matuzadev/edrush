import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

export async function POST() {
  try {
    const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({ error: 'SUPABASE_DB_URL or DATABASE_URL is not set on the server.' }, { status: 500 });
    }

    const sqlPath = path.join(process.cwd(), 'supabase', 'create_questions_table.sql');
    if (!fs.existsSync(sqlPath)) {
      return NextResponse.json({ error: `SQL file not found at ${sqlPath}` }, { status: 500 });
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    const client = new Client({ connectionString: dbUrl });
    await client.connect();
    // Execute the entire SQL script. If it contains multiple statements this will run them.
    await client.query(sql);
    await client.end();

    return NextResponse.json({ ok: true, message: 'SQL executed. Table should be created (or already existed).' });
  } catch (err) {
    console.error('create-questions-table error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
