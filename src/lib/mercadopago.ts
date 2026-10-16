import crypto from 'crypto';
import { lsClient } from '@/lib/db';
import { processReferralReward } from '@/lib/referral';

const MERCADO_PAGO_API = 'https://api.mercadopago.com';
const PREMIUM_DURATION_DAYS = 30;

export function getMercadoPagoAccessToken(): string {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado');
  return token;
}

export function verifyMercadoPagoSignature(
  signatureHeader: string | null,
  requestId: string | null,
  paymentId: string,
): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret || !signatureHeader || !requestId) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(',').map((part) => {
      const [key, ...value] = part.trim().split('=');
      return [key, value.join('=')];
    }),
  );
  const timestamp = parts.ts;
  const receivedSignature = parts.v1;
  if (!timestamp || !receivedSignature || !/^[a-f0-9]+$/i.test(receivedSignature)) {
    return false;
  }

  const manifest = `id:${paymentId.toLowerCase()};request-id:${requestId};ts:${timestamp};`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex');
  const received = Buffer.from(receivedSignature, 'hex');
  const expected = Buffer.from(expectedSignature, 'hex');

  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

export interface MercadoPagoPayment {
  id: number | string;
  status: string;
  payment_method_id: string;
  transaction_amount: number;
  currency_id: string;
  external_reference: string;
}

export async function applyApprovedPixPayment(payment: MercadoPagoPayment): Promise<void> {
  if (
    payment.status !== 'approved' ||
    payment.payment_method_id !== 'pix' ||
    payment.currency_id !== 'BRL'
  ) {
    return;
  }

  const transaction = await lsClient.transaction('write');
  let rewardedUserId: string | null = null;
  try {
    const result = await transaction.execute({
      sql: `SELECT id, user_id, amount, processed_at
            FROM mercadopago_payments
            WHERE external_reference = ? OR payment_id = ?
            LIMIT 1`,
      args: [payment.external_reference, String(payment.id)],
    });
    const record = result.rows[0];
    if (!record) {
      throw new Error('Pagamento aprovado sem registro local correspondente');
    }

    const paymentAmountCents = Math.round(payment.transaction_amount * 100);
    const expectedAmountCents = Math.round(Number(record.amount) * 100);
    if (paymentAmountCents !== expectedAmountCents) {
      throw new Error('Valor do pagamento aprovado não corresponde ao registro local');
    }

    if (record.processed_at) {
      await transaction.commit();
      return;
    }

    const userId = String(record.user_id);
    const userResult = await transaction.execute({
      sql: 'SELECT subscription_status, subscription_expires_at FROM users WHERE id = ? LIMIT 1',
      args: [userId],
    });
    const user = userResult.rows[0];
    if (!user) {
      throw new Error('Usuário do pagamento aprovado não foi encontrado');
    }

    const now = new Date();
    const previousExpiry = user.subscription_expires_at
      ? new Date(String(user.subscription_expires_at))
      : null;
    const renewalStart =
      user.subscription_status === 'active' &&
      previousExpiry &&
      previousExpiry > now
        ? previousExpiry
        : now;
    const expiresAt = new Date(renewalStart);
    expiresAt.setUTCDate(expiresAt.getUTCDate() + PREMIUM_DURATION_DAYS);
    const nowIso = now.toISOString();

    await transaction.execute({
      sql: `UPDATE users
            SET subscription_status = 'active', subscription_expires_at = ?, atualizado_em = ?
            WHERE id = ?`,
      args: [expiresAt.toISOString(), nowIso, userId],
    });
    await transaction.execute({
      sql: `UPDATE mercadopago_payments
            SET payment_id = ?, status = 'approved', processed_at = ?
            WHERE id = ? AND processed_at IS NULL`,
      args: [String(payment.id), nowIso, String(record.id)],
    });
    await transaction.commit();
    rewardedUserId = userId;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  if (rewardedUserId) {
    await processReferralReward(rewardedUserId).catch((error) => {
      console.error('Falha ao processar recompensa de indicação após pagamento PIX:', error);
    });
  }
}

export async function getMercadoPagoPayment(paymentId: string): Promise<MercadoPagoPayment> {
  const response = await fetch(`${MERCADO_PAGO_API}/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${getMercadoPagoAccessToken()}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Mercado Pago não retornou os dados do pagamento', response.status);
    throw new Error('Não foi possível consultar o pagamento no Mercado Pago');
  }

  return response.json() as Promise<MercadoPagoPayment>;
}
