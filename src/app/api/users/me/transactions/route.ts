import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getTransactionHistory } from '@/lib/crystals';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const userId = (session.user as unknown as { id: string }).id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const limitRaw = Number(searchParams.get('limit') ?? '20');
    const offsetRaw = Number(searchParams.get('offset') ?? '0');
    const limit = Number.isFinite(limitRaw) ? limitRaw : 20;
    const offset = Number.isFinite(offsetRaw) ? offsetRaw : 0;

    const transactions = await getTransactionHistory(userId, { limit, offset });

    return NextResponse.json({ transactions, limit, offset });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
