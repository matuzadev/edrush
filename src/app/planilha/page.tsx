import { ArrowRight, X, CheckCircle, Zap } from 'lucide-react';

export default function Planilha() {
  return (
    <main className="min-h-screen bg-[#020617] text-[#f8fafc] font-['Inter']">
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-red-500 font-bold tracking-[0.3em] uppercase text-xs animate-pulse">
            Atenção Concurseiro
          </span>
          <h1 className="text-4xl md:text-6xl font-black mt-6 mb-8 leading-tight">
            Só passa no Concurso Público
            <span className="text-cyan-500 underline decoration-cyan-500/50 underline-offset-4"> Quem</span> estuda certo!
          </h1>

          <p className="text-xl text-slate-400 leading-relaxed mb-12 max-w-3xl mx-auto">
            A verdade dói: Estudar sem um software de gestão é como tentar cavar um túnel com uma colher. Enquanto você gasta 3 horas decidindo o que revisar, seu concorrente já revisou 10 matérias com a nossa planilha. Que além de organizar seus estudos, aplica técnicas de memorização comprovadas para garantir que você realmente aprenda o conteúdo. Pare de perder tempo estudando do jeito errado e comece a estudar de forma inteligente, invista no seu futuro!
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left mb-16">
            <div className="bg-slate-900 p-8 rounded-3xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <X className="w-6 h-6 text-red-400" />
                <h3 className="text-red-400 font-bold">O Caos do Amador</h3>
              </div>
              <ul className="text-sm space-y-3 text-slate-500 italic">
                <li>- "Acho que lembro disso..."</li>
                <li>- Cadernos de revisão bagunçados.</li>
                <li>- Ansiedade por não ver progresso.</li>
                <li>- Mais um ano ganhando pouco.</li>
              </ul>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-cyan-400" />
                <h3 className="text-cyan-400 font-bold">A Elite com Software</h3>
              </div>
              <ul className="text-sm space-y-3 text-slate-200">
                <li>+ Active Recall automatizado (1-7-30).</li>
                <li>+ Veredito em tempo real: "REFORÇAR".</li>
                <li>+ Foco total na aprovação (R$ 20k+).</li>
                <li>+ O fim da procrastinação mental.</li>
              </ul>
            </div>
          </div>

          <div className="bg-cyan-950/20 border border-cyan-500/30 p-10 rounded-[40px] mb-12 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 italic text-cyan-300">
              "Eu não vendo uma planilha. Eu vendo a sua liberdade."
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Cada dia que você passa sem organizar seus estudos é um dia a mais na vida que você odeia.
              Organize seus estudos com todos os recursos gratuitos do EdRush, sem mensalidade ou cobranças para acessar a plataforma.
            </p>
          </div>

          <a href="/#oferta" className="inline-flex items-center gap-3 bg-white text-black font-black px-10 py-5 rounded-2xl hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-white/20 uppercase tracking-widest text-sm group">
            Eu quero sair da média agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <p className="mt-8 text-slate-500 text-xs uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            EdRush: acesso gratuito, sem lotes ou reajustes.
          </p>
        </div>
      </section>
    </main>
  );
}