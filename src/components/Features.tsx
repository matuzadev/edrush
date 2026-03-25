import { Target, Brain, Calculator, AlertTriangle } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Target className="w-8 h-8 text-emerald-400" />,
      title: "Metas Inteligentes",
      emoji: "🎯",
      desc: "Sistema de metas adaptativas que aprendem seu ritmo. Acompanhe o progresso com precisão cirúrgica."
    },
    {
      icon: <Brain className="w-8 h-8 text-emerald-400" />,
      title: "Active Recall Automático",
      emoji: "🧠",
      desc: "Ciclos científicos (1-7-30). O sistema revisa suas respostas no momento ideal para máxima retenção."
    },
    {
      icon: <Calculator className="w-8 h-8 text-emerald-400" />,
      title: "Simulador de Nota",
      emoji: "📊",
      desc: "Cálculo precisamente alinhado com a banca (Cebraspe). Veja sua nota real em tempo real."
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-emerald-400" />,
      title: "Diagnóstico por Matéria",
      emoji: "⚡",
      desc: "IA que identifica pontos fracos. Receba alertas automáticos de 'Reforçar' ou 'Consolidado'."
    }
  ];

  return (
    <section id="beneficios" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Funcionalidades da Plataforma
          </h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="group p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="mb-6 inline-block p-3 rounded-xl bg-slate-800 group-hover:bg-emerald-500/10 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3 flex items-center gap-2">
                <span className="text-lg">{f.emoji}</span> {f.title}
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