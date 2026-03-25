// Configuração do Pagbank PIX
// Para usar, você precisa:
// 1. Ter uma conta Pagbank ativa
// 2. Gerar as credenciais de API em https://meu.pagbank.com.br/
// 3. Configurar as variáveis de ambiente

export interface PagbankConfig {
  email: string;
  token: string;
  publicKey?: string;
}

export interface PagbankPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  daysAccess: number;
}

export const PAGBANK_PLANS: PagbankPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29.90,
    description: 'Perfeito para começar',
    popular: false,
    daysAccess: 30,
    features: [
      '✓ Acesso a 1000+ questões',
      '✓ Active Recall inteligente',
      '✓ Análises básicas',
      '✓ Suporte por email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 59.90,
    description: 'Mais completo e popular',
    popular: true,
    daysAccess: 30,
    features: [
      '✓ Acesso a 4000+ questões',
      '✓ Active Recall + Spaced Repetition',
      '✓ Análises avançadas com IA',
      '✓ Simulados completos',
      '✓ Comunidade premium',
      '✓ Suporte prioritário',
      '✓ Certificado ao fim',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.90,
    description: 'Para equipes e instituições',
    popular: false,
    daysAccess: 30,
    features: [
      '✓ Tudo do Pro',
      '✓ Múltiplos usuários (até 10)',
      '✓ Dashboard de administração',
      '✓ Relatórios avançados',
      '✓ Integração com LMS',
      '✓ Suporte dedicado 24/7',
      '✓ Customização',
    ],
  },
];

// Criar QR Code PIX para o usuário
export const createPixQRCode = async (
  email: string,
  planId: string,
  userId: string
) => {
  const plan = PAGBANK_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error('Plano não encontrado');

  try {
    const response = await fetch('https://api.pagbank.com.br/pix/qrcodes', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(plan.price * 100), // Converter para centavos
        description: `${plan.name} - ${plan.daysAccess} dias de acesso`,
        metadata: {
          userId,
          planId,
          email,
          daysAccess: plan.daysAccess,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar QR Code PIX');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar PIX:', error);
    throw error;
  }
};

// Verificar status do pagamento
export const checkPixPayment = async (transactionId: string) => {
  try {
    const response = await fetch(
      `https://api.pagbank.com.br/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAGBANK_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao verificar pagamento');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao verificar PIX:', error);
    throw error;
  }
};
