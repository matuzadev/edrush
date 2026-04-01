import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET não está configurado');
      return NextResponse.json(
        { error: 'Webhook não configurado' },
        { status: 500 }
      );
    }

    // Verificar assinatura do webhook
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Processar eventos de pagamento
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('✅ Checkout completado:', session.id);

      if (session.payment_status === 'paid') {
        const userEmail = session.customer_email;
        const planId = session.metadata?.planId;

        if (userEmail && planId) {
          try {
            // Buscar usuário por email
            const userRecord = await db.query.users.findFirst({
              where: eq(users.email, userEmail),
            });

            if (userRecord) {
              // Calcular data de expiração (30 dias)
              const expiryDate = new Date();
              expiryDate.setDate(expiryDate.getDate() + 30);

              // Atualizar assinatura no banco SQLite
              await db
                .update(users)
                .set({
                  subscription_status: 'active',
                  subscription_expires_at: expiryDate.toISOString(),
                  stripe_customer_id: session.customer as string,
                  atualizado_em: new Date().toISOString(),
                })
                .where(eq(users.id, userRecord.id));

              console.log(`✅ Pagamento processado para usuário ${userEmail}`);
            }
          } catch (error) {
            console.error('❌ Erro ao processar pagamento:', error);
            return NextResponse.json(
              { error: 'Erro ao processar pagamento' },
              { status: 500 }
            );
          }
        }
      }
    }

    // Tratar cancelamento de assinatura
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('❌ Assinatura cancelada:', subscription.id);

      try {
        await db
          .update(users)
          .set({
            subscription_status: 'cancelled',
            atualizado_em: new Date().toISOString(),
          })
          .where(eq(users.stripe_customer_id, subscription.customer as string));

        console.log('✅ Status de cancelamento atualizado');
      } catch (error) {
        console.error('❌ Erro ao cancelar assinatura:', error);
      }
    }

    // Tratar falha de pagamento
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('⚠️ Pagamento falhou:', invoice.id);
      // Aqui poderíamos enviar email para o usuário
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    );
  }
}
