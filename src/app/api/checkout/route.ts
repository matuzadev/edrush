import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { createCheckoutSession } from '@/lib/stripe';

// Inicia uma sessão de checkout do Stripe.
// IMPORTANTE: userId e userEmail vêm da SESSION, nunca do body — antes era
// possível um usuário forjar o pagamento de outro mandando email/userId
// arbitrários. Hoje aceitamos apenas o planId do client.
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const userId = (session.user as { id?: string }).id;
    const userEmail = session.user.email;
    if (!userId) {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });
    }

    const { planId } = await request.json().catch(() => ({ planId: undefined }));
    if (!planId || typeof planId !== 'string') {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const checkoutSession = await createCheckoutSession(
      userId,
      planId,
      userEmail,
      baseUrl,
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    // Não vazar mensagem do Stripe (pode conter price IDs/info de planos privados).
    console.error('Erro ao criar checkout:', error);
    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 },
    );
  }
}
