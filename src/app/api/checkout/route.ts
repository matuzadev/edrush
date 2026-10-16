import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient } from '@/lib/db';
import { getMercadoPagoAccessToken } from '@/lib/mercadopago';
import { PLANS } from '@/lib/plans';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id;
    const userEmail = session?.user?.email;
    if (!userId || !userEmail) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const plan = PLANS.find((item) => item.id === body?.planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const accessToken = getMercadoPagoAccessToken();
    const baseUrl = process.env.NEXTAUTH_URL
      ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
    if (!baseUrl) {
      throw new Error('NEXTAUTH_URL não está configurada');
    }

    const externalReference = crypto.randomUUID();
    const paymentRecordId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await lsClient.execute({
      sql: `INSERT INTO mercadopago_payments
            (id, external_reference, user_id, amount, status, created_at)
            VALUES (?, ?, ?, ?, 'creating', ?)`,
      args: [paymentRecordId, externalReference, userId, plan.price, createdAt],
    });

    let response: Response;
    try {
      response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': externalReference,
        },
        body: JSON.stringify({
          transaction_amount: plan.price,
          description: `${plan.name} — acesso por 30 dias`,
          payment_method_id: 'pix',
          payer: { email: userEmail },
          external_reference: externalReference,
          notification_url: `${baseUrl.replace(/\/$/, '')}/api/webhooks/mercadopago`,
        }),
      });
    } catch (error) {
      await lsClient.execute({
        sql: "UPDATE mercadopago_payments SET status = 'request_failed' WHERE id = ?",
        args: [paymentRecordId],
      });
      throw error;
    }

    if (!response.ok) {
      await lsClient.execute({
        sql: "UPDATE mercadopago_payments SET status = 'request_failed' WHERE id = ?",
        args: [paymentRecordId],
      });
      console.error('Falha ao criar pagamento PIX no Mercado Pago', response.status);
      return NextResponse.json(
        { error: 'Não foi possível iniciar o pagamento PIX. Tente novamente.' },
        { status: 502 },
      );
    }

    const payment = await response.json();
    await lsClient.execute({
      sql: 'UPDATE mercadopago_payments SET payment_id = ?, status = ? WHERE id = ?',
      args: [String(payment.id), String(payment.status), paymentRecordId],
    });

    const transactionData = payment.point_of_interaction?.transaction_data;
    if (payment.status !== 'approved' && (!transactionData?.qr_code || !transactionData?.qr_code_base64)) {
      console.error('Mercado Pago não retornou os dados do QR Code PIX');
      return NextResponse.json(
        { error: 'O Mercado Pago não retornou o QR Code. Tente novamente.' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      paymentId: String(payment.id),
      status: payment.status,
      qrCode: transactionData?.qr_code ?? null,
      qrCodeBase64: transactionData?.qr_code_base64 ?? null,
      ticketUrl: transactionData?.ticket_url ?? null,
      expiresAt: payment.date_of_expiration ?? null,
    });
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 },
    );
  }
}
