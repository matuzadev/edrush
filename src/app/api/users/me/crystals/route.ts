import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient as client } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const userId = (session.user as unknown as { id: string }).id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const rs = await client.execute({
      sql: `SELECT crystals, exp_buff_multiplier, exp_buff_expires_at
            FROM users WHERE id = ?`,
      args: [userId],
    });
    if (rs.rows.length === 0) {
      return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
    }
    const row = rs.rows[0] as unknown as {
      crystals: number;
      exp_buff_multiplier: number;
      exp_buff_expires_at: string | null;
    };

    const balance = Number(row.crystals ?? 0);
    let expBuff: { multiplier: number; expiresAt: string } | null = null;
    if (row.exp_buff_expires_at) {
      const expiresAt = row.exp_buff_expires_at;
      if (new Date(expiresAt).getTime() > Date.now()) {
        expBuff = {
          multiplier: Number(row.exp_buff_multiplier ?? 1),
          expiresAt,
        };
      }
    }

    return NextResponse.json({ balance, expBuff });
  } catch (error) {
    console.error('Erro ao buscar cristais:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
