'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { PLANS } from '@/lib/stripe';
import { CheckCircle2, Loader2, CreditCard, ChevronLeft, Shield, Lock, RefreshCw, Zap, Star } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('plan') || 'starter';
  const { user, isLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = PLANS.find(p => p.id === planId);

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
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, userEmail: user.email, userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao iniciar checkout');
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Decorative bg */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/6 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/6 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/5 bg-[#020617]/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/assinar" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ChevronLeft size={20} className="text-slate-400" />
          </Link>
          <Image src="/imagens/foco-federal-logo-removebg.png" alt="Logo" width={28} height={28} />
          <span className="font-black text-white">Foco<span className="text-emerald-400">Federal</span></span>
          <div className="ml-auto flex items-center gap-1.5 text-slate-500 text-xs">
            <Shield size={12} />
            <span>Checkout seguro via Stripe</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8 items-start">

          {/* Order summary — 2/5 */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-black text-white">Resumo do pedido</h2>

            {plan ? (
              <div className="bg-slate-900 border border-white/8 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5 mb-2">
                      <Star size={10} className="text-emerald-400 fill-emerald-400" />
                      <span className="text-emerald-400 text-xs font-bold">Plano {plan.name}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-400">R${plan.price.toFixed(2)}</p>
                    <p className="text-slate-500 text-xs">/mês</p>
                  </div>
                </div>

                <div className="border-t border-white/6 pt-4 space-y-2">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/6 mt-4 pt-4 flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-semibold">Total mensal</span>
                  <span className="text-emerald-400 text-xl font-black">R${plan.price.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Plano não encontrado.</p>
            )}

            <div className="space-y-2">
              {[
                { icon: Lock,      text: 'Criptografia SSL 256-bit', color: 'text-emerald-400' },
                { icon: Shield,    text: 'Processado com segurança pelo Stripe', color: 'text-blue-400' },
                { icon: RefreshCw, text: 'Cancele a qualquer momento', color: 'text-slate-400' },
                { icon: Zap,       text: 'Acesso imediato após confirmação', color: 'text-amber-400' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-500">
                    <Icon size={13} className={item.color} />
                    {item.text}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment panel — 3/5 */}
          <div className="md:col-span-3">
            <div className="bg-slate-900 border border-white/8 rounded-2xl p-8">
              <h2 className="text-lg font-black text-white mb-6">Finalizar pagamento</h2>

              {/* User info */}
              <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-6">
                <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-400 font-black text-lg">
                  {user.email?.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{user.name || 'Concurseiro'}</p>
                  <p className="text-slate-500 text-xs truncate">{user.email}</p>
                </div>
                <span className="ml-auto flex-shrink-0 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 font-semibold">conta ativa</span>
              </div>

              {/* Stripe info */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
                <p className="text-blue-300 text-sm font-semibold mb-1 flex items-center gap-2">
                  <Shield size={14} />
                  Checkout 100% seguro
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Você será redirecionado ao ambiente seguro do Stripe. A Foco Federal <strong className="text-white">não armazena</strong> dados do seu cartão.
                </p>
              </div>

              {/* Billing note */}
              <div className="flex items-start gap-2.5 p-3 bg-slate-800/50 rounded-xl mb-6 text-xs text-slate-400">
                <RefreshCw size={13} className="flex-shrink-0 mt-0.5 text-slate-500" />
                <span>Assinatura mensal recorrente. Cobrado R${plan?.price.toFixed(2)}/mês automaticamente. Cancele quando quiser, sem burocracia.</span>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading || !plan}
                className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-4 rounded-2xl transition-all hover:scale-[1.01] hover:shadow-[0_8px_32px_rgba(16,185,129,0.4)] text-base uppercase tracking-wide"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Abrindo checkout...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Assinar por R${plan?.price.toFixed(2)}/mês
                  </>
                )}
              </button>

              <p className="text-slate-600 text-xs text-center mt-4">
                Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
