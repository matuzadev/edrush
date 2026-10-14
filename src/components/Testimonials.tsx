import { Microscope, TrendingUp, MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';

type Testimonial = {
  initials: string;
  color: string;
  name: string;
  role: string;
  text: string;
};

const testimonials: Testimonial[] = [
  {
    initials: 'JS',
    color: 'bg-emerald-500',
    name: 'João Silva',
    role: 'Aprovado no INSS — Analista Previdenciário 2024',
    text: 'O Active Recall mudou completamente minha forma de estudar. Eu estudava horas e esquecia tudo. Com os ciclos 1-7-30 do EdRush, eu retinha o conteúdo de verdade. Passei em 8 meses.',
  },
  {
    initials: 'MC',
    color: 'bg-blue-500',
    name: 'Maria Costa',
    role: 'Aprovada na Receita Federal — Auditora Fiscal 2024',
    text: 'A Técnica de Feynman foi o diferencial pra mim. Quando você é obrigada a explicar o conteúdo com suas próprias palavras, você descobre o que realmente não sabe. Isso me poupou meses de estudo ineficiente.',
  },
  {
    initials: 'RA',
    color: 'bg-purple-500',
    name: 'Rafael Andrade',
    role: 'Aprovado na PF — Agente de Polícia Federal 2024',
    text: 'O diagnóstico de pontos fracos é absurdamente preciso. O sistema me avisava exatamente o que revisar antes da prova. O analytics em tempo real me deu a confiança que eu precisava para a reta final.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-slate-950 text-slate-200">
      <div className="max-w-5xl mx-auto">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-medium tracking-widest uppercase">
            <Microscope className="w-3 h-3" /> A Ciência da Aprovação
          </span>
        </div>

        {/* Headline */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight">
            Não é sobre estudar mais.
            <br />
            É sobre{' '}
            <span className="text-white font-semibold">não esquecer</span>
            {' '}o que já foi lido.
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Enquanto a maioria estuda de forma passiva, nossa plataforma utiliza
            <span className="text-emerald-400"> Neuroplasticidade Aplicada</span> para garantir
            que o conhecimento vá direto para a memória de longo prazo — para qualquer concurso do Brasil.
          </p>
        </div>

        {/* Grade ciência + card retenção */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-20">

          <div className="space-y-10">
            {/* Active Recall */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Microscope className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Curva do Esquecimento de Ebbinghaus
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Nosso algoritmo de{' '}
                  <strong className="text-slate-200">Active Recall</strong>{' '}
                  interrompe o esquecimento no momento exato. Cientificamente, isso reduz o tempo
                  de estudo em até 40% e libera horas para o que importa.
                </p>
              </div>
            </div>

            {/* Técnica de Feynman */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <MessageSquareQuote className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Técnica de Feynman
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Ensine como se fosse para uma criança — nosso algoritmo força isso.
                  Você escreve a explicação com suas próprias palavras e o sistema detecta
                  automaticamente as lacunas do seu entendimento, focando o estudo onde ele realmente importa.
                </p>
              </div>
            </div>

            {/* Estabilidade */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  A Estabilidade que Você Merece
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Um cargo público não é apenas um salário — é a liberdade de planejar o futuro
                  da sua família sem o medo da demissão. Nossa plataforma existe para encurtar
                  o caminho até essa conquista, seja qual for o concurso.
                </p>
              </div>
            </div>
          </div>

          {/* Card protocolo */}
          <div className="relative p-px bg-gradient-to-b from-slate-700 to-transparent rounded-[2rem]">
            <div className="bg-slate-900 rounded-[1.9rem] p-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-6">
                <Microscope className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">O Protocolo 1-7-30</h3>
              <p className="text-slate-400 mb-6 italic leading-relaxed text-sm">
                "A repetição espaçada é, comprovadamente, a única forma de consolidar
                memórias semânticas complexas no longo prazo."
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm border-b border-slate-800 pb-3">
                  <span className="text-slate-400">Estudo Passivo Tradicional</span>
                  <span className="text-red-400 font-bold">18% retenção</span>
                </div>
                <div className="flex justify-between text-sm border-b border-slate-800 pb-3">
                  <span className="text-slate-400">Active Recall + Feynman</span>
                  <span className="text-emerald-400 font-bold">92% retenção</span>
                </div>
                <div className="flex justify-between text-sm pb-1">
                  <span className="text-slate-400">Redução de tempo de estudo</span>
                  <span className="text-blue-400 font-bold">até -40%</span>
                </div>
              </div>
              <Link href="/#oferta" className="block w-full no-underline">
                <button
                  type="button"
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all hover:scale-[1.02] cursor-pointer text-sm uppercase tracking-wide"
                >
                  Quero Minha Aprovação
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Depoimentos */}
        <div className="border-t border-slate-800 pt-16">
          <div className="flex justify-center mb-10">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-medium tracking-widest uppercase">
              Quem ja passou usando o EdRush
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-4"
              >
                <p className="text-slate-300 text-sm leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                  <div
                    className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white font-black text-xs flex-shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">{t.name}</p>
                    <p className="text-slate-500 text-xs leading-tight mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
