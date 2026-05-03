'use client';

import Link from 'next/link';
import { Gift, ArrowRight, Sparkles, Users } from 'lucide-react';

export default function ReferralBanner() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent to-slate-900/30">
      <div className="max-w-4xl mx-auto" data-reveal="bottom">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 via-slate-900/80 to-slate-900/60 p-8 md:p-10">
          {/* Decorative */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-blue-500/8 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Icon */}
            <div className="flex-shrink-0 w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
              <Gift size={28} className="text-emerald-400" />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-3">
                <Sparkles size={12} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Programa de Indicação</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                Indique amigos e ganhe <span className="text-emerald-400">meses grátis</span>
              </h3>
              <p className="text-slate-400 text-sm md:text-base max-w-xl">
                Compartilhe seu link exclusivo. Quando um amigo assinar a plataforma pela primeira vez, você recebe automaticamente <strong className="text-white">30 dias gratuitos</strong>. Sem limite de indicações.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                {[
                  { icon: Users, label: '1 assinatura', sub: '= 1 mês grátis' },
                  { icon: Gift, label: 'Sem limite', sub: 'de indicações' },
                  { icon: Sparkles, label: 'Automático', sub: 'sem burocracia' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-2.5 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-2.5">
                      <Icon size={14} className="text-emerald-400" />
                      <div>
                        <p className="text-white text-xs font-bold">{item.label}</p>
                        <p className="text-slate-500 text-xs">{item.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0 flex flex-col gap-3 w-full md:w-auto">
              <Link
                href="/auth/signup"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/25 whitespace-nowrap"
              >
                <Gift size={16} />
                Criar conta grátis
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold rounded-xl transition-all text-sm"
              >
                Já tenho conta → Ver meu link
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
