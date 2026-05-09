import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@libsql/client';
import { processReferralReward } from '@/lib/referral';

// Cliente raw para a tabela de dedup (não está no schema do drizzle).
const rawClient = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:data/foco-federal.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Marca o event.id como processado. Retorna true se já estava (deve abortar).
async function eventAlreadyProcessed(eventId: string, eventType: string): Promise<boolean> {
  try {
    const rs = await rawClient.execute({
      sql: 'SELECT event_id FROM processed_stripe_events WHERE event_id = ? LIMIT 1',
      args: [eventId],
    });
    if (rs.rows.length > 0) return true;
    await rawClient.execute({
      sql: 'INSERT OR IGNORE INTO processed_stripe_events (event_id, event_type, processed_at) VALUES (?, ?, ?)',
      args: [eventId, eventType, new Date().toISOString()],
    });
    return false;
  } catch (err) {
    // Se o dedup falhar, prefere processar duas vezes a perder evento.
    console.error('Falha ao registrar event dedup:', err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET não está configurado');
    return NextResponse.json({ error: 'Webhook não configurado' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    // Não logar `error` cru — pode conter trecho do body. Mensagem genérica.
    console.error('Webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Dedup: Stripe re-entrega webhooks. Sem isso, `processReferralReward` e
  // updates de subscription podem rodar 2x.
  if (await eventAlreadyProcessed(event.id, event.type)) {
    return NextResponse.json({ received: true, deduped: true });
  }

  try {
    switch (event.type) {

      // ── Primeira assinatura ativada ────────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status !== 'paid' && session.mode !== 'subscription') break;

        // SEMPRE casar pelo metadata.userId (gravado em createCheckoutSession),
        // nunca pelo customer_email — o e-mail vem do client e pode ser falsificado.
        const userId = session.metadata?.userId;
        if (!userId) {
          console.warn('checkout.session.completed sem metadata.userId — ignorado');
          break;
        }

        const userRecord = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });
        if (!userRecord) break;

        // For subscriptions, get the actual period_end from Stripe
        let expiresAt: string;
        if (session.mode === 'subscription' && session.subscription) {
          const sub = await getStripe().subscriptions.retrieve(
            session.subscription as string,
          ) as Stripe.Subscription;
          expiresAt = new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString();
        } else {
          const fallback = new Date();
          fallback.setDate(fallback.getDate() + 30);
          expiresAt = fallback.toISOString();
        }

        await db.update(users)
          .set({
            subscription_status: 'active',
            subscription_expires_at: expiresAt,
            stripe_customer_id: session.customer as string,
            atualizado_em: new Date().toISOString(),
          })
          .where(eq(users.id, userRecord.id));

        // Log sem e-mail (PII).
        console.log(`Assinatura ativada para userId=${userRecord.id} até ${expiresAt}`);
        processReferralReward(userRecord.id).catch(() => {});
        break;
      }

      // ── Renovação mensal ────────────────────────────────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        // Only process renewals, not the initial payment (handled above)
        if ((invoice as unknown as { billing_reason?: string }).billing_reason === 'subscription_create') break;

        const customerId = invoice.customer as string;
        if (!customerId) break;

        // Get new period end from the first line item
        const periodEnd = (invoice.lines?.data?.[0] as unknown as { period?: { end?: number } } | undefined)?.period?.end;
        if (!periodEnd) break;

        const newExpiry = new Date(periodEnd * 1000).toISOString();

        await db.update(users)
          .set({
            subscription_status: 'active',
            subscription_expires_at: newExpiry,
            atualizado_em: new Date().toISOString(),
          })
          .where(eq(users.stripe_customer_id, customerId));

        console.log(`Assinatura renovada para customer=${customerId} até ${newExpiry}`);
        break;
      }

      // ── Pagamento falhou ────────────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        if (!customerId) break;

        await db.update(users)
          .set({
            subscription_status: 'past_due',
            atualizado_em: new Date().toISOString(),
          })
          .where(eq(users.stripe_customer_id, customerId));

        console.log(`Pagamento falhou para customer=${customerId}`);
        break;
      }

      // ── Assinatura cancelada ────────────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await db.update(users)
          .set({
            subscription_status: 'cancelled',
            atualizado_em: new Date().toISOString(),
          })
          .where(eq(users.stripe_customer_id, subscription.customer as string));

        console.log(`Assinatura cancelada para customer=${subscription.customer}`);
        break;
      }

      // ── Assinatura pausada/atualizada ────────────────────────────────────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const isActive = subscription.status === 'active';
        await db.update(users)
          .set({
            subscription_status: isActive ? 'active' : subscription.status,
            subscription_expires_at: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
            atualizado_em: new Date().toISOString(),
          })
          .where(eq(users.stripe_customer_id, subscription.customer as string));
        break;
      }
    }
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
