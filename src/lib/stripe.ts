import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  description: string;
  features: string[];
  daysAccess: number;
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29.90,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
    description: 'Perfeito para começar',
    daysAccess: 30,
    popular: true,
    features: [
      '✓ Acesso a 1000+ questões',
      '✓ Active Recall inteligente',
      '✓ Análises básicas',
      '✓ Suporte por email',
    ],
  },
  // TODO: Adicionar Pro e Enterprise quando tiver os Price IDs
  // {
  //   id: 'pro',
  //   name: 'Pro',
  //   price: 59.90,
  //   priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
  //   description: 'Mais completo e popular',
  //   daysAccess: 30,
  //   popular: true,
  //   features: [
  //     '✓ Acesso a 4000+ questões',
  //     '✓ Active Recall + Spaced Repetition',
  //     '✓ Análises avançadas com IA',
  //     '✓ Simulados completos',
  //     '✓ Comunidade premium',
  //     '✓ Suporte prioritário',
  //     '✓ Certificado ao fim',
  //   ],
  // },
  // {
  //   id: 'enterprise',
  //   name: 'Enterprise',
  //   price: 99.90,
  //   priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || '',
  //   description: 'Para equipes e instituições',
  //   daysAccess: 30,
  //   popular: false,
  //   features: [
  //     '✓ Tudo do Pro',
  //     '✓ Múltiplos usuários (até 10)',
  //     '✓ Dashboard de administração',
  //     '✓ Relatórios avançados',
  //     '✓ Integração com LMS',
  //     '✓ Suporte dedicado 24/7',
  //     '✓ Customização',
  //   ],
  // },
];

// Criar checkout session
export const createCheckoutSession = async (
  userId: string,
  planId: string,
  userEmail: string,
  baseUrl: string
) => {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) throw new Error('Plano não encontrado');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pricing`,
    customer_email: userEmail,
    metadata: {
      userId,
      planId,
    },
  });

  return session;
};

// Verificar pagamento
export const verifyPayment = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session.payment_status === 'paid';
};
//       {
//         price: plan.priceId,
//         quantity: 1,
//       },
//     ],
//     mode: 'subscription',
//     success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${baseUrl}/pricing`,
//     customer_email: userEmail,
//     metadata: {
//       userId,
//       planId,
//     },
//   });
//
//   return session;
// };
//
// // Buscar subscription
// export const getSubscription = async (subscriptionId: string) => {
//   const subscription = await stripe.subscriptions.retrieve(subscriptionId);
//   return subscription;
// };
//
// // Cancelar subscription
// export const cancelSubscription = async (subscriptionId: string) => {
//   const subscription = await stripe.subscriptions.del(subscriptionId);
//   return subscription;
// };
//
// // Obter status do cliente
// export const getCustomerSubscriptions = async (customerId: string) => {
//   const subscriptions = await stripe.subscriptions.list({
//     customer: customerId,
//     limit: 10,
//   });
//   return subscriptions.data;
// };
