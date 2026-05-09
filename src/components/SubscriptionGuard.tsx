'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
<<<<<<< HEAD
import { AlertCircle, Clock, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
=======
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9

interface SubscriptionInfo {
  status: string;
  hasAccess: boolean;
  isTrial: boolean;
  isPaid: boolean;
  trialDaysRemaining: number;
  expiresAt: string | null;
<<<<<<< HEAD
=======
  isAdmin?: boolean;
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
}

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

<<<<<<< HEAD
    const checkSubscription = async () => {
      try {
        const res = await fetch('/api/user/subscription');
        if (res.ok) {
          const data = await res.json();
          setSubscription(data);
        } else {
          setSubscription({ status: 'free', hasAccess: false, isTrial: false, isPaid: false, trialDaysRemaining: 0, expiresAt: null });
        }
      } catch {
        setSubscription({ status: 'free', hasAccess: false, isTrial: false, isPaid: false, trialDaysRemaining: 0, expiresAt: null });
      } finally {
        setHasChecked(true);
      }
    };

    checkSubscription();
  }, [user, isLoading, router]);

  // Loading
  if (isLoading || !hasChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Carregando...</p>
        </div>
=======
    fetch('/api/user/subscription')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setSubscription(data);
        else setSubscription({ status: 'free', hasAccess: false, isTrial: false, isPaid: false, trialDaysRemaining: 0, expiresAt: null });
      })
      .catch(() => {
        setSubscription({ status: 'free', hasAccess: false, isTrial: false, isPaid: false, trialDaysRemaining: 0, expiresAt: null });
      })
      .finally(() => setHasChecked(true));
  }, [user, isLoading, router]);

  // Redirect to paywall if no access
  useEffect(() => {
    if (hasChecked && subscription && !subscription.hasAccess) {
      router.push('/assinar');
    }
  }, [hasChecked, subscription, router]);

  if (isLoading || !hasChecked || (hasChecked && subscription && !subscription.hasAccess)) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
      </div>
    );
  }

<<<<<<< HEAD
  // Sem acesso — trial expirado e sem plano pago
  if (subscription && !subscription.hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-amber-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              Período Gratuito Encerrado
            </h2>

            <p className="text-slate-400 mb-6 leading-relaxed">
              Seu período de teste gratuito acabou. Assine agora para continuar estudando e garantir sua aprovação.
            </p>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-emerald-300">
                <Zap size={16} />
                <span>Acesso completo a todas as matérias e questões</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/#offer"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition"
              >
                Ver Planos
                <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-xl transition"
              >
                Voltar para Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Com acesso — mostrar banner de trial se aplicável
  const showTrialBanner = subscription?.isTrial && (subscription.trialDaysRemaining <= 2);

  return (
    <div>
      {showTrialBanner && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/40 z-50 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-400 flex-shrink-0" />
              <span className="text-amber-200">
                {subscription.trialDaysRemaining === 0
                  ? 'Último dia do período gratuito!'
                  : `${subscription.trialDaysRemaining} dia${subscription.trialDaysRemaining > 1 ? 's' : ''} restante${subscription.trialDaysRemaining > 1 ? 's' : ''} no período gratuito.`}
              </span>
            </div>
            <Link href="/#offer" className="flex-shrink-0 text-xs font-bold text-amber-300 hover:text-amber-200 underline transition-colors">
              Assinar agora
            </Link>
          </div>
        </div>
      )}

      <div className={showTrialBanner ? 'pt-11' : ''}>
        {children}
      </div>
    </div>
  );
=======
  return <>{children}</>;
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
}
