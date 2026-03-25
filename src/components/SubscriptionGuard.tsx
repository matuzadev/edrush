'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Calendar, Zap, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

interface Subscription {
  id: number;
  user_id: string;
  plan_id: string;
  status: string;
  expiry_date: string;
  active: boolean;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Verificar assinatura do usuário
    const checkSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setSubscription(data);

          // Verificar se a assinatura ainda está ativa
          const expiryDate = new Date(data.expiry_date);
          const today = new Date();
          const subscriptionActive = expiryDate > today && data.active;

          setIsActive(subscriptionActive);

          // Calcular dias restantes
          if (subscriptionActive) {
            const daysLeft = Math.ceil(
              (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            );
            setDaysRemaining(Math.max(0, daysLeft));
          }
        } else {
          setIsActive(false);
          setDaysRemaining(0);
        }
      } catch (error) {
        console.error('Erro ao verificar assinatura:', error);
        setIsActive(false);
      } finally {
        setHasChecked(true);
      }
    };

    checkSubscription();

    // Configurar polling a cada 5 minutos para verificar expiração
    const interval = setInterval(checkSubscription, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, isLoading, router]);

  if (isLoading || !hasChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Verificando sua assinatura...</p>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              Assinatura Expirada
            </h2>

            <p className="text-slate-400 mb-6">
              Sua assinatura expirou. Para continuar usando a plataforma, renove seu plano abaixo.
            </p>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-blue-300">
                <Zap size={16} />
                <span>Renove agora e receba 30 dias de acesso ilimitado</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/pricing"
                className="block w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                Renew Agora
              </Link>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                Voltar para Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se tem assinatura ativa, mostra o dashboard com indicador de expiração
  return (
    <div>
      {isActive && daysRemaining <= 7 && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-yellow-500/50 z-40 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-sm">
            <Calendar size={18} className="text-yellow-400 flex-shrink-0" />
            <span className="text-yellow-200">
              Sua assinatura vence em <strong>{daysRemaining} dias</strong>.
              <Link href="/pricing" className="ml-2 font-semibold text-yellow-300 hover:text-yellow-200">
                Renove agora
              </Link>
            </span>
          </div>
        </div>
      )}

      <div className={isActive && daysRemaining <= 7 ? 'pt-16' : ''}>
        {children}
      </div>
    </div>
  );
}
