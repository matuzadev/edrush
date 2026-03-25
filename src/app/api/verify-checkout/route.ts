import { NextRequest, NextResponse } from 'next/server';
// import { stripe, PLANS } from '@/lib/stripe';
import { PLANS } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Stripe não está configurado.' },
    { status: 503 }
  );
  
  // Código comentado enquanto stripe não está instalado
  /*
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID obrigatório' },
        { status: 400 }
      );
    }

    // Buscar sessão de checkout
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      );
    }

    // Buscar plano
    const planId = session.metadata?.planId;
    const plan = PLANS.find((p) => p.id === planId);

    return NextResponse.json({
      status: session.payment_status,
      customer_email: session.customer_email,
      subscription_id: session.subscription,
      plan: plan || null,
    });
  } catch (error) {
    console.error('Erro ao verificar checkout:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar pagamento' },
      { status: 500 }
    );
  }
  */
}
