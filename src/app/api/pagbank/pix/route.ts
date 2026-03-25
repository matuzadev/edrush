import { NextRequest, NextResponse } from 'next/server';
import { createPixQRCode, PAGBANK_PLANS } from '@/lib/pagbank';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userEmail, userId } = body;

    // Validar planId
    const plan = PAGBANK_PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      );
    }

    // Validar email e userId
    if (!userEmail || !userId) {
      return NextResponse.json(
        { error: 'Email e User ID são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar QR Code PIX
    const pixData = await createPixQRCode(userEmail, planId, userId);

    // Salvar tentativa de pagamento no banco
    await supabase.from('payment_attempts').insert({
      user_id: userId,
      plan_id: planId,
      transaction_id: pixData.id,
      status: 'pending',
      amount: plan.price,
      created_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      transactionId: pixData.id,
      qrCode: pixData.qr_code,
      copyPaste: pixData.copy_paste,
      expiresAt: pixData.expires_at,
    });
  } catch (error: any) {
    console.error('Erro ao criar PIX:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
