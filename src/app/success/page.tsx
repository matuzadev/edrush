'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, ArrowRight, Zap, BookOpen, BarChart2, Target, Loader2 } from 'lucide-react';

interface SubscriptionInfo {
  status: string;
  hasAccess: boolean;
  isPaid: boolean;
  expiresAt: string | null;
}

export default function SuccessPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth/login'); return; }
    if (user) {
      fetch('/api/user/subscription')
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setSubscription(data); })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const nextBilling = subscription?.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Processando...';

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-blue-500/6 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/5 bg-[#020617]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Image src="/imagens/edrush-logo-removebg.png" alt="EdRush logo" width={28} height={28} />
          <span className="font-black text-white">Ed<span className="text-emerald-400">Rush</span></span>
        </div>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-16">

        {/* Success icon */}
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl scale-150 animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/30 to-emerald-400/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Assinatura Ativada!</h1>
          <p className="text-slate-400 text-lg">
            Bem-vindo ao EdRush. Sua jornada para a aprovação começa agora.
          </p>
        </div>

        {/* Subscription details */}
        <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-7 mb-6">
          <h2 className="text-white font-bold text-lg mb-5">Detalhes da assinatura</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/6">
              <span className="text-slate-400 text-sm">Status</span>
              <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                {subscription?.isPaid ? 'Ativo' : 'Processando...'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/6">
              <span className="text-slate-400 text-sm">Próxima cobrança</span>
              <span className="text-white font-semibold text-sm">{nextBilling}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/6">
              <span className="text-slate-400 text-sm">Plano</span>
              <span className="text-white font-semibold text-sm">EdRush — R$9,90/mês</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Email</span>
              <span className="text-white font-semibold text-sm">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-slate-900 border border-white/8 rounded-2xl p-7 mb-8">
          <h3 className="text-white font-bold text-base mb-4">Próximos passos</h3>
          <div className="space-y-3">
            {[
              { icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10', text: 'Escolha seu concurso e comece a estudar com questões comentadas' },
              { icon: Target,   color: 'text-blue-400',    bg: 'bg-blue-500/10',    text: 'Configure suas metas e o sistema de Active Recall entra em ação' },
              { icon: BarChart2,color: 'text-purple-400',  bg: 'bg-purple-500/10',  text: 'Acompanhe sua evolução nos Analytics por matéria' },
              { icon: Zap,      color: 'text-amber-400',   bg: 'bg-amber-500/10',   text: 'Ganhe XP, suba de nível e desbloqueie medalhas conforme estuda' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 ${step.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon size={15} className={step.color} />
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base uppercase tracking-wide rounded-2xl transition-all hover:scale-[1.01] hover:shadow-[0_8px_32px_rgba(16,185,129,0.4)]"
        >
          Acessar o Dashboard
          <ArrowRight size={20} />
        </Link>
        <Link href="/" className="block text-center text-slate-500 hover:text-slate-400 text-sm mt-4 transition">
          Voltar para a página inicial
        </Link>
      </main>
    </div>
  );
}
