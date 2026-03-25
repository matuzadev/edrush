import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Validar assinatura do webhook (segurança)
function validateWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return hash === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 401 }
      );
    }

    // Validar assinatura do webhook
    const isValid = validateWebhookSignature(
      body,
      signature,
      process.env.PAGBANK_WEBHOOK_SECRET!
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 401 }
      );
    }

    const data = JSON.parse(body);

    // Webhook recebeu confirmação de pagamento
    if (data.status === 'PAID' || data.status === 'paid') {
      const transactionId = data.transaction_id || data.id;

      // Buscar tentativa de pagamento
      const { data: attempt, error: attemptError } = await supabase
        .from('payment_attempts')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();

      if (attemptError || !attempt) {
        return NextResponse.json(
          { error: 'Transação não encontrada' },
          { status: 404 }
        );
      }

      // Calcular data de expiração (30 dias a partir de agora)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      // Criar/atualizar assinatura do usuário
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: attempt.user_id,
          plan_id: attempt.plan_id,
          status: 'active',
          payment_date: new Date(),
          expiry_date: expiryDate,
          active: true,
        });

      if (subscriptionError) {
        console.error('Erro ao atualizar assinatura:', subscriptionError);
        return NextResponse.json(
          { error: 'Erro ao processar assinatura' },
          { status: 500 }
        );
      }

      // Marcar pagamento como confirmado
      await supabase
        .from('payment_attempts')
        .update({ status: 'paid', paid_at: new Date() })
        .eq('transaction_id', transactionId);

      return NextResponse.json({
        success: true,
        message: 'Pagamento confirmado',
      });
    }

    // Outros status
    return NextResponse.json({
      success: true,
      message: 'Webhook recebido',
    });
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}
