import { ShieldCheck, Microscope, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';
export default function Manifesto() {
  return (
    <section className="py-24 px-6 bg-slate-950 text-slate-200">
      <div className="max-w-5xl mx-auto">

        {/* Badge Emocional */}
        <div className="flex justify-center mb-8">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-medium tracking-widest uppercase">
            <ShieldCheck className="w-3 h-3" /> A Ciência da Aprovação
          </span>
        </div>

        {/* Headline Provocativa */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight">
            Não é sobre estudar mais. <br />
            É sobre <span className="text-white font-semibold">não esquecer</span> o que já foi lido.
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Enquanto a maioria estuda de forma passiva, nossa plataforma utiliza
            <span className="text-emerald-400"> Neuroplasticidade Aplicada</span> para garantir que o
            conhecimento saia da memória de curto prazo direto para o seu longo prazo.
          </p>
        </div>

        {/* Grid de Benefícios Científicos x Emocionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div className="space-y-10">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Microscope className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">Curva do Esquecimento de Ebbinghaus</h4>
                <p className="text-slate-400 leading-relaxed">
                  Nosso algoritmo de <strong>Active Recall</strong> interrompe o esquecimento no momento exato.
                  Cientificamente, isso reduz o tempo de estudo em até 40%, liberando tempo para o que importa.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">A Paz da Estabilidade Federal</h4>
                <p className="text-slate-400 leading-relaxed">
                  Imagine o último dia de insegurança financeira da sua vida. Um cargo público não é apenas um salário;
                  é a liberdade de planejar o futuro da sua família sem o medo da demissão.
                </p>
              </div>
            </div>
          </div>

          {/* Card de Destaque Discreto (The Scientific Edge) */}
          <div className="relative p-1 bg-gradient-to-b from-slate-800 to-transparent rounded-[2rem]">
            <div className="bg-slate-900 rounded-[1.9rem] p-10">
              <Zap className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">O Protocolo 1-7-30</h3>
              <p className="text-slate-400 mb-6 italic leading-relaxed">
                "A repetição espaçada é, comprovadamente, a única forma de consolidar memórias semânticas complexas."
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                  <span>Retenção Tradicional</span>
                  <span className="text-red-400">18%</span>
                </div>
                <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                  <span>Protocolo de Elite</span>
                  <span className="text-emerald-400 font-bold">92%</span>
                </div>
              </div>
              <Link href="auth/login" className="block w-full mt-8">
                <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all hover:scale-[1.02] cursor-pointer">
                  QUERO MINHA ESTABILIDADE
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}