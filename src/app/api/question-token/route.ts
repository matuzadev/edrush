import { NextResponse } from 'next/server';
import crypto from 'crypto';

const SECRET = process.env.QUESTION_SECRET || 'dev-secret-please-change';
const TTL = 1000 * 60 * 30; // 30 min

export async function POST(req: Request) {
  try {
    const { questionId } = await req.json();
    if (!questionId) return NextResponse.json({ error: 'missing' }, { status: 400 });

    const iat = Date.now();
    const exp = iat + TTL;
    const payload = `${questionId}:${iat}:${exp}`;
    const hmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    const token = Buffer.from(`${payload}:${hmac}`).toString('base64');

    return NextResponse.json({ token });
  } catch (e) {
    console.error('token error', e);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}

export function verifyToken(token: string) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [questionId, iatStr, expStr, hmac] = decoded.split(':');
    const payload = `${questionId}:${iatStr}:${expStr}`;
    const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    if (expected !== hmac) return false;
    const now = Date.now();
    if (now > Number(expStr)) return false;
    return { questionId };
  } catch (e) {
    return false;
  }
}
