import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email obrigatório', isActive: false },
        { status: 400 }
      );
    }

    // Buscar user no Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_status, subscription_expires_at')
      .eq('email', userEmail)
      .single();

    if (error || !user) {
      console.error('Erro ao buscar usuário:', error);
      return NextResponse.json({ isActive: false });
    }

    // Verificar se assinatura está ativa
    const isActive =
      user.subscription_status === 'active' &&
      new Date(user.subscription_expires_at) > new Date();

    return NextResponse.json({ isActive });
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar assinatura', isActive: false },
      { status: 500 }
    );
  }
}
