import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY não configurada');
    _stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});

export interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Foco Federal',
    price: 9.90,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
    description: 'Acesso completo à plataforma',
    popular: true,
    features: [
      'Acesso a 12.000+ questões comentadas',
      'Active Recall ciclo 1-7-30',
      'Analytics por matéria em tempo real',
      'Mapa de todos os concursos do Brasil',
      'Sistema de XP, níveis e medalhas',
      'Perfil público compartilhável',
      'Suporte por email',
    ],
  },
];

export const createCheckoutSession = async (
  userId: string,
  planId: string,
  userEmail: string,
  baseUrl: string
) => {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) throw new Error('Plano não encontrado');

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/assinar`,
    customer_email: userEmail,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    locale: 'pt-BR',
    metadata: { userId, planId },
  });

  return session;
};

export const verifyPayment = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session.payment_status === 'paid';
};
