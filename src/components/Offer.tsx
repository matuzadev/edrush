import Link from 'next/link';
import { CheckCircle2, Gift, Users } from 'lucide-react';

const benefits: { title: string; desc: string }[] = [
  {
    title: '+12.000 Questões Comentadas',
    desc: 'Base completa para todos os concursos do Brasil, atualizada constantemente.',
  },
  {
    title: 'Active Recall Automático',
    desc: 'Revisões inteligentes no ciclo 1-7-30 para retenção máxima.',
  },
  {
    title: 'Técnica de Feynman',
    desc: 'Explique com suas palavras e o sistema identifica o que você ainda não domina.',
  },
  {
    title: 'Analytics em Tempo Real',
    desc: 'Dashboard completo: acertos por matéria, evolução e projeção de nota.',
  },
  {
    title: 'Mapa de Concursos',
    desc: 'Editais abertos e datas de prova para todo o Brasil em um só lugar.',
  },
];

export default function Offer() {
  return (
    <section id="oferta" className="py-24 bg-[#030712] relative overflow-hidden">

      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Tudo gratuito, sem mensalidade e sem bloqueios por plano.
          </h2>
          <p className="text-slate-400 text-sm">
            Questões, simulados, materiais, estatísticas e personalização estão disponíveis para todos.
          </p>
        </div>

        {/* Corpo da oferta: benefícios + card de preço */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Benefícios */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-xl mb-2">
              Recursos incluídos gratuitamente
            </h3>
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4 items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold text-sm">{b.title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}

            {/* Social proof */}
            <div className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <Users className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-sm text-slate-300">
                <span className="text-white font-black">847 estudantes</span> ativos agora na plataforma
              </p>
              <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                ao vivo
              </span>
            </div>
          </div>

          {/* Acesso gratuito */}
          <div className="relative rounded-2xl p-px bg-gradient-to-b from-emerald-500/40 to-slate-800/20">
            <div className="rounded-2xl bg-[#0b1628] p-8 overflow-hidden relative">

              {/* Reflexo decorativo */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[11px] font-bold uppercase tracking-widest mb-5">
                  EdRush gratuito
                </span>

                <div className="rounded-xl bg-slate-900/70 border border-slate-700/50 p-5 mb-6">
                  <p className="text-emerald-400 text-3xl font-black mb-2">R$ 0,00</p>
                  <p className="text-slate-300 text-sm font-semibold">
                    Sem mensalidade e sem cobrança para acessar os recursos.
                  </p>
                </div>

                <div className="flex flex-col gap-3 mb-7">
                  <div className="flex items-center gap-3 text-slate-200 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Acesso completo após criar sua conta</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200 text-sm">
                    <Gift className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Moedas e cosméticos são opcionais</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/auth/signup"
                  className="block w-full text-center py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base uppercase tracking-wide transition-all hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(16,185,129,0.4)] no-underline"
                >
                  CRIAR CONTA GRATUITA
                </Link>

                <p className="text-slate-500 text-xs text-center mt-4 leading-relaxed">
                  Nenhum pagamento é necessário para usar a plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
