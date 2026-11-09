import crypto from 'crypto';

// Sem QUESTION_SECRET o HMAC seria assinado com string pública conhecida,
// e qualquer um forjaria tokens para responder questões.
export function getSecret(): string {
  const secret = process.env.QUESTION_SECRET;
  if (!secret || secret.length < 16 || secret === 'dev-secret-please-change') {
    throw new Error('QUESTION_SECRET ausente ou fraco — gere com `openssl rand -hex 32`');
  }
  return secret;
}

export const QUESTION_TOKEN_TTL = 1000 * 60 * 30; // 30 min

export function signToken(questionId: string): string {
  const iat = Date.now();
  const exp = iat + QUESTION_TOKEN_TTL;
  const payload = `${questionId}:${iat}:${exp}`;
  const hmac = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

export function verifyToken(token: string): false | { questionId: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [questionId, iatStr, expStr, hmac] = decoded.split(':');
    const payload = `${questionId}:${iatStr}:${expStr}`;
    const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
    // Comparação em tempo constante para evitar timing attack do HMAC.
    const a = Buffer.from(expected, 'hex');
    const b = Buffer.from(hmac, 'hex');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
    const now = Date.now();
    if (now > Number(expStr)) return false;
    return { questionId };
  } catch {
    return false;
  }
}
