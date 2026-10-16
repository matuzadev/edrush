import { NextRequest, NextResponse } from 'next/server';
import {
  applyApprovedPixPayment,
  getMercadoPagoPayment,
  verifyMercadoPagoSignature,
} from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const body = await request.json().catch(() => null);
  const paymentId = String(url.searchParams.get('data.id') ?? body?.data?.id ?? '');

  if (!paymentId || !verifyMercadoPagoSignature(
    request.headers.get('x-signature'),
    request.headers.get('x-request-id'),
    paymentId,
  )) {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
  }

  if (body?.type && body.type !== 'payment') {
    return NextResponse.json({ received: true });
  }

  try {
    const payment = await getMercadoPagoPayment(paymentId);
    await applyApprovedPixPayment(payment);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook PIX do Mercado Pago:', error);
    return NextResponse.json({ error: 'Falha ao processar notificação' }, { status: 500 });
  }
}
