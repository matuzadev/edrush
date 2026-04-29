'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PLANS } from '@/lib/stripe';
import { CheckCircle2, Loader, CreditCard } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('plan') || 'starter';
  const { user, isLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = PLANS.find((p) => p.id === planId);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/auth/login?redirect=/checkout?plan=${planId}`);
    }
  }, [user, isLoading, planId, router]);

  const handleCheckout = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userEmail: user.email,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao iniciar checkout');
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Finalizar Compra</h1>
          <p className="text-slate-400">Você será redirecionado para o checkout seguro do Stripe.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Resumo do plano */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Resumo do Pedido</h2>

            {plan ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400">Plano</p>
                  <p className="text-lg font-semibold text-white">{plan.name}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Descrição</p>
                  <p className="text-white">{plan.description}</p>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <p className="text-sm text-slate-400 mb-2">Inclui:</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <p className="text-sm text-slate-400">Valor Total</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    R$ {plan.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{plan.daysAccess} dias de acesso</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Plano não encontrado.</p>
            )}
          </div>

          {/* Botão de pagamento */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Pagamento</h2>

              <div className="bg-slate-700/50 rounded-lg p-4 mb-6 space-y-2 text-sm text-slate-300">
                <p className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  Checkout 100% seguro via Stripe
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  Cartão de crédito, débito ou boleto
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  Acesso imediato após confirmação
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm mb-4">
                  {error}
                </div>
              )}
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || !plan}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Redirecionando...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Pagar com Stripe
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
