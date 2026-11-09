import { NextRequest, NextResponse } from 'next/server';

// Armazenar requests por IP (em produção usar Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requisições por minuto

/**
 * Middleware de rate limiting por IP
 * Idealmente usar Redis em produção
 */
export function rateLimit(request: NextRequest): null | NextResponse {
  // Obter IP do cliente
  const ip = request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const now = Date.now();
  const userLimit = requestCounts.get(ip);

  if (userLimit && now < userLimit.resetTime) {
    // Dentro da janela de tempo
    if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
      // Limite excedido
      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente mais tarde.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((userLimit.resetTime - now) / 1000)),
          }
        }
      );
    }
    userLimit.count++;
  } else {
    // Criar nova entrada
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
  }

  // Limpar entradas antigas periodicamente
  if (Math.random() < 0.01) {
    for (const [key, value] of requestCounts.entries()) {
      if (now >= value.resetTime) {
        requestCounts.delete(key);
      }
    }
  }

  return null; // Prosseguir com o request
}

/**
 * Rate limiting mais agressivo para endpoints sensíveis
 * (ex: login, signup)
 */
export function strictRateLimit(request: NextRequest): null | NextResponse {
  const ip = request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const key = `strict:${ip}`;
  const now = Date.now();
  const userLimit = requestCounts.get(key);

  const MAX_ATTEMPTS = 5; // 5 tentativas
  const WINDOW = 5 * 60 * 1000; // 5 minutos

  if (userLimit && now < userLimit.resetTime) {
    if (userLimit.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((userLimit.resetTime - now) / 1000)),
          }
        }
      );
    }
    userLimit.count++;
  } else {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + WINDOW,
    });
  }

  return null;
}
