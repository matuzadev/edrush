import type { ReactNode } from 'react';
import { Brain, BookOpen, BarChart2, Map, Target, AlertTriangle } from 'lucide-react';

type Feature = {
  icon: ReactNode;
  title: string;
  desc: string;
  badge?: string;
};

const features: Feature[] = [
  {
    icon: <Brain className="w-7 h-7 text-emerald-400" />,
    title: 'Active Recall Automatizado',
    desc: 'Algoritmo proprietário baseado na Curva de Ebbinghaus. O sistema identifica o momento exato para revisar cada conteúdo, aumentando a retenção de 18% para 92% com ciclos 1-7-30.',
    badge: 'Algoritmo exclusivo',
  },
  {
    icon: <BookOpen className="w-7 h-7 text-emerald-400" />,
    title: 'Técnica de Feynman',
    desc: 'Ensine o conteúdo como se explicasse para uma criança. Nosso algoritmo force-teaches: você digita a explicação com suas próprias palavras e o sistema identifica as lacunas do seu entendimento.',
    badge: 'Algoritmo exclusivo',
  },
  {
    icon: <BarChart2 className="w-7 h-7 text-emerald-400" />,
    title: 'Analytics de Desempenho',
    desc: 'Dashboard com métricas em tempo real: taxa de acerto por matéria, evolução semanal, aproveitamento por banca e projeção de nota. Dados que transformam sua estratégia de estudo.',
  },
  {
    icon: <AlertTriangle className="w-7 h-7 text-emerald-400" />,
    title: 'Diagnóstico de Pontos Fracos',
    desc: 'O sistema monitora cada resposta e gera alertas automáticos: "Reforçar" ou "Consolidado". Você sabe exatamente onde concentrar o esforço para subir nota.',
  },
  {
    icon: <Target className="w-7 h-7 text-emerald-400" />,
    title: 'Simulador Multi-Banca',
    desc: 'Simulados no padrão real de correção das principais bancas: Cebraspe, FGV, VUNESP, FCC e mais. Veja sua nota antes mesmo da prova e calibre seu desempenho.',
  },
  {
    icon: <Map className="w-7 h-7 text-emerald-400" />,
    title: 'Mapa de Concursos',
    desc: 'Acompanhe editais abertos, datas de provas e vagas disponíveis para todos os concursos do Brasil. Nunca perca um edital relevante para o seu perfil.',
  },
];

export default function Features() {
  return (
    <section id="beneficios" className="py-24 px-6 bg-[#020617] relative overflow-hidden">

      {/* Glow decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-4">
            Funcionalidades
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tudo que você precisa para ser aprovado
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Cada funcionalidade foi desenvolvida com base em ciência cognitiva e aplicada ao contexto de concursos públicos.
          </p>
          <div className="h-px w-20 bg-emerald-500 mx-auto rounded-full mt-6" />
        </div>

        {/* Grid 3x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative p-7 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
            >
              {f.badge && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-semibold tracking-wide uppercase">
                  {f.badge}
                </span>
              )}
              <div className="mb-5 inline-flex p-3 rounded-xl bg-slate-800/80 group-hover:bg-emerald-500/10 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">
                {f.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
