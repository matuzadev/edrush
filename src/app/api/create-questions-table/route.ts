import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    // Este endpoint é para manutenção e não é mais necessário com SQLite
    // A tabela de questões é criada automaticamente via db.ts
    return NextResponse.json({
      message: 'A tabela de questões é criada automaticamente.',
      status: 'ok'
    });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao criar tabela' },
      { status: 500 }
    );
  }
}
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
