import { NextResponse } from 'next/server';
import { signToken } from '@/lib/question-token';

export async function POST(req: Request) {
  try {
    const { questionId } = await req.json();
    if (!questionId) return NextResponse.json({ error: 'missing' }, { status: 400 });
    return NextResponse.json({ token: signToken(questionId) });
  } catch (e) {
    console.error('token error', e);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
