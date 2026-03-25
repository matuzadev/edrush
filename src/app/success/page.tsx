'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SuccessPage() {
  const router = useRouter();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchSubscription();
    }
  }, [user, authLoading, router]);

  const fetchSubscription = async () => {
    try {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setSubscription(data);
      }
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const planNames: { [key: string]: string } = {
    starter: 'Starter',
    pro: 'Pro',
    enterprise: 'Enterprise',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]">
      <nav className="bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-white hover:text-emerald-400 transition">
              Foco Federal
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-3">Pagamento Confirmado!</h1>
          <p className="text-xl text-slate-400">
            Bem-vindo à plataforma Foco Federal. Sua assinatura está ativa!
          </p>
        </div>

        <div className="bg-[#0f172a] border border-emerald-500/20 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Detalhes da Assinatura</h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-slate-400">Plano:</span>
              <span className="text-white font-semibold">
                {subscription ? planNames[subscription.plan_id] || subscription.plan_id : 'Carregando...'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-slate-400">Status:</span>
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                {subscription?.status || 'Ativo'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-slate-400">Válido até:</span>
              <span className="text-white font-semibold">
                {subscription ? new Date(subscription.expiry_date).toLocaleDateString('pt-BR') : 'Carregando...'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Email:</span>
              <span className="text-white font-semibold">{user?.email}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
            >
              Ir para o Dashboard
            </Link>
            <Link
              href="/"
              className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
            >
              Voltar para Home
            </Link>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Próximos Passos</h3>
          <ul className="text-blue-200 space-y-2 text-sm">
            <li>✓ Acesse o dashboard para começar seus estudos</li>
            <li>✓ Explore questões de Perito PF e ESFCEx</li>
            <li>✓ Configure suas metas e comece o Active Recall</li>
            <li>✓ Acompanhe seu progresso em tempo real</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
