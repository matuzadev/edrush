'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  CheckCircle2, Zap, Lock, RefreshCw, Shield, Users, Star,
  ArrowRight, Loader2, BookOpen, Target, BarChart2, MapPin, Crown, Gift
} from 'lucide-react';

const FEATURES = [
  { icon: BookOpen,  text: '12.000+ questões comentadas', sub: 'Todos os concursos do Brasil' },
  { icon: Zap,       text: 'Active Recall ciclo 1-7-30',   sub: 'Revisão espaçada automática' },
  { icon: BarChart2, text: 'Analytics por matéria',        sub: 'Acompanhe sua evolução' },
  { icon: MapPin,    text: 'Mapa de concursos Brasil',      sub: 'Editais e datas atualizados' },
  { icon: Crown,     text: 'XP, níveis e medalhas',        sub: 'Gamificação motivadora' },
  { icon: Target,    text: 'Perfil público compartilhável', sub: 'Mostre sua evolução' },
];

const TRUST = [
  { icon: Shield,     label: 'Stripe 256-bit SSL' },
  { icon: RefreshCw,  label: 'Cancele quando quiser' },
  { icon: Zap,        label: 'Acesso imediato' },
];

export default function AssinarPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  // If already subscribed, go to dashboard
  useEffect(() => {
    if (!user || isLoading) return;
    fetch('/api/user/subscription')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.hasAccess) router.push('/dashboard');
      })
      .catch(() => {});
  }, [user, isLoading, router]);

  const handleCTA = () => {
    if (isLoading) return;
    setRedirecting(true);
    if (!user) {
      router.push('/auth/login?redirect=/assinar');
    } else {
      router.push('/checkout?plan=starter');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">

      {/* Animated bg blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '11s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '15s' }} />
      </div>

      {/* Minimal nav */}
      <nav className="relative z-10 border-b border-white/5 bg-[#020617]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image src="/imagens/foco-federal-logo-removebg.png" alt="Logo" width={32} height={32} />
            <span className="font-black text-white text-lg">Foco<span className="text-emerald-400">Federal</span></span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <span className="text-slate-500 text-sm hidden sm:block">{user.email}</span>
            ) : (
              <Link href="/auth/login" className="text-slate-400 hover:text-white text-sm transition">
                Já tenho conta
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-20">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Acesso exclusivo por assinatura</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            Plataforma 100% focada<br />
            na sua <span className="text-emerald-400">aprovação</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Acesso completo a todas as ferramentas, questões e analytics por um preço que cabe no seu bolso.
          </p>
        </div>

        {/* Main grid: features + pricing card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Feature list */}
          <div className="space-y-4">
            <h2 className="text-white font-black text-xl mb-6">Tudo que você precisa para passar</h2>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{f.text}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{f.sub}</p>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald-500/60 flex-shrink-0 ml-auto mt-0.5" />
                </div>
              );
            })}

            {/* Referral note */}
            <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
              <Gift size={18} className="text-emerald-400 flex-shrink-0" />
              <p className="text-slate-300 text-sm">
                Indique um amigo e ganhe <strong className="text-emerald-400">1 mês grátis</strong> quando ele assinar.
              </p>
            </div>
          </div>

          {/* Pricing card */}
          <div className="sticky top-8">
            <div className="relative rounded-3xl p-px bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent">
              <div className="rounded-3xl bg-slate-900 p-8 overflow-hidden relative">

                {/* Glow inside card */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-3 py-1 mb-5">
                    <Star size={12} className="text-emerald-400 fill-emerald-400" />
                    <span className="text-emerald-400 text-xs font-bold">Plano Único — Acesso Total</span>
                  </div>

                  {/* Price */}
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 mb-6">
                    <p className="text-slate-500 text-sm line-through mb-1">De R$ 49,90/mês</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-slate-400 text-lg">R$</span>
                      <span className="text-emerald-400 font-black" style={{ fontSize: '4rem', lineHeight: 1 }}>9</span>
                      <span className="text-emerald-400 text-2xl font-bold">,90</span>
                      <span className="text-slate-400 text-sm">/mês</span>
                    </div>
                    <p className="text-slate-300 text-xs font-semibold">
                      Assinatura mensal recorrente — cancele quando quiser
                    </p>
                  </div>

                  {/* Mini checklist */}
                  <div className="space-y-2.5 mb-7">
                    {[
                      { icon: Zap, text: 'Ativação imediata após o pagamento', color: 'text-amber-400' },
                      { icon: Lock, text: 'Pagamento 100% seguro via Stripe', color: 'text-emerald-400' },
                      { icon: RefreshCw, text: 'Cancele a qualquer momento, sem burocracia', color: 'text-blue-400' },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                          <Icon size={15} className={`${item.color} flex-shrink-0`} />
                          {item.text}
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA button */}
                  <button
                    onClick={handleCTA}
                    disabled={isLoading || redirecting}
                    className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-black text-base uppercase tracking-wide rounded-2xl transition-all hover:scale-[1.02] hover:shadow-[0_12px_48px_rgba(16,185,129,0.45)] flex items-center justify-center gap-2.5"
                  >
                    {isLoading || redirecting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        GARANTIR MEU ACESSO AGORA
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  {/* Social proof */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="flex -space-x-2">
                      {['#10b981','#3b82f6','#f59e0b','#ef4444'].map((c, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center" style={{ backgroundColor: c + '33', borderColor: c + '66' }}>
                          <Users size={10} style={{ color: c }} />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span><strong className="text-white">847 estudantes</strong> ativos agora</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs text-center mt-4">
                    Garantia de satisfação de 7 dias. Suporte via email 24h.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {TRUST.map((t, i) => {
                const Icon = t.icon;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-center">
                    <Icon size={14} className="text-slate-500" />
                    <span className="text-slate-500 text-xs">{t.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAQ strip */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { q: 'Como cancelo?', a: 'A qualquer momento pelo portal Stripe, sem multa ou burocracia. O acesso continua até o fim do período pago.' },
            { q: 'Quando tenho acesso?', a: 'Imediatamente após a confirmação do pagamento. Você recebe um email com os detalhes.' },
            { q: 'Quais formas de pagamento?', a: 'Cartão de crédito, débito ou boleto bancário via Stripe — a plataforma de pagamentos mais segura do mundo.' },
          ].map((item, i) => (
            <div key={i} className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
              <p className="font-bold text-white text-sm mb-2">{item.q}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
