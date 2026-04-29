import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET não está configurado');
    return NextResponse.json({ error: 'Webhook não configurado' }, { status: 500 });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';
    const stripe = getStripe();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === 'paid') {
        const userEmail = session.customer_email;
        const planId = session.metadata?.planId;

        if (userEmail && planId) {
          const userRecord = await db.query.users.findFirst({
            where: eq(users.email, userEmail),
          });

          if (userRecord) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);

            await db
              .update(users)
              .set({
                subscription_status: 'active',
                subscription_expires_at: expiryDate.toISOString(),
                stripe_customer_id: session.customer as string,
                atualizado_em: new Date().toISOString(),
              })
              .where(eq(users.id, userRecord.id));

            console.log(`✅ Pagamento processado para ${userEmail}`);
          }
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;

      await db
        .update(users)
        .set({ subscription_status: 'cancelled', atualizado_em: new Date().toISOString() })
        .where(eq(users.stripe_customer_id, subscription.customer as string));
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook Stripe:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
