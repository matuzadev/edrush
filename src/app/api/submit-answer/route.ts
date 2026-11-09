import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/question-token';
import { MOCK_QUESTIONS } from '@/lib/questions';

export async function POST(req: Request) {
  try {
    const { token, questionId, answer } = await req.json();
    if (!token || !questionId) return NextResponse.json({ error: 'missing' }, { status: 400 });

    const ok = verifyToken(token);
    if (!ok || ok.questionId !== questionId) return NextResponse.json({ error: 'invalid token' }, { status: 403 });

    // find question
    const q = MOCK_QUESTIONS.find(q => q.id === questionId);
    if (!q) return NextResponse.json({ error: 'unknown question' }, { status: 404 });

    const normalize = (s?: string) => (s || '').toString().trim().toLowerCase();
    const isCorrect = normalize(answer) === normalize(q.correctAnswer);

    // Return result; client can update local progress accordingly
    return NextResponse.json({ isCorrect });
  } catch (e) {
    console.error('submit error', e);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
