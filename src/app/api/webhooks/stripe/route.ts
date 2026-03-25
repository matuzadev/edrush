import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    // Verificar assinatura do webhook
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Processar eventos de pagamento
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;

      if (session.payment_status === 'paid') {
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (userId && planId) {
          // Calcular data de expiração (30 dias)
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);

          // Criar/atualizar assinatura no banco
          await supabase.from('subscriptions').upsert({
            user_id: userId,
            plan_id: planId,
            status: 'active',
            payment_date: new Date(),
            expiry_date: expiryDate,
            active: true,
          });

          console.log(`✓ Pagamento processado para usuário ${userId}`);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    );
  }
}
