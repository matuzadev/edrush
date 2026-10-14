import { BarChart2, BookOpen, Clock, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

type Subject = {
  name: string;
  pct: number;
  status: 'consolidado' | 'reforcar' | 'progredindo';
};

type Recall = {
  title: string;
  time: string;
  urgent: boolean;
};

const subjects: Subject[] = [
  { name: 'Direito Constitucional', pct: 91, status: 'consolidado' },
  { name: 'Língua Portuguesa', pct: 65, status: 'reforcar' },
  { name: 'Raciocínio Lógico', pct: 83, status: 'consolidado' },
  { name: 'Administração Pública', pct: 74, status: 'progredindo' },
];

const recalls: Recall[] = [
  { title: 'Princípios Constitucionais', time: 'Hoje às 16h', urgent: false },
  { title: 'Interpretação de Texto', time: 'Amanhã às 10h', urgent: true },
  { title: 'Simulado — Banca Cebraspe', time: 'Em 3 dias', urgent: false },
];

function StatusBadge({ status }: { status: Subject['status'] }) {
  if (status === 'consolidado') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
        <CheckCircle2 className="w-3 h-3" /> Consolidado
      </span>
    );
  }
  if (status === 'reforcar') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold uppercase tracking-wide">
        <AlertTriangle className="w-3 h-3" /> Reforçar
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-bold uppercase tracking-wide">
      <TrendingUp className="w-3 h-3" /> Progredindo
    </span>
  );
}

function barColor(status: Subject['status']) {
  if (status === 'consolidado') return 'bg-gradient-to-r from-emerald-500 to-emerald-400';
  if (status === 'reforcar') return 'bg-gradient-to-r from-amber-500 to-amber-400';
  return 'bg-gradient-to-r from-blue-500 to-blue-400';
}

export default function Showcase() {
  return (
    <section id="dashboard" className="py-24 px-6 bg-[#020617] relative overflow-hidden">

      {/* Glow decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-6">
            Dashboard Inteligente
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
            Acompanhe seu progresso{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              em Tempo Real
            </span>
          </h2>
          <p className="max-w-2xl text-slate-400 text-base md:text-lg leading-relaxed">
            Métricas precisas, alertas inteligentes e revisões no momento certo — tudo em um dashboard feito para aprovação.
          </p>
          <div className="mt-6 h-px w-20 bg-emerald-500 rounded-full" />
        </div>

        {/* Dashboard mock */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-2xl">

          {/* Barra de título tipo app */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-amber-500/60" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-slate-400 text-xs font-medium ml-2">EdRush — Dashboard</span>
            </div>
            <span className="text-slate-500 text-xs">Última atualização: agora</span>
          </div>

          <div className="p-6 md:p-8">

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {/* Questões */}
              <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/15">
                    <BarChart2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-slate-400 text-xs font-medium">Questões Resolvidas</span>
                </div>
                <p className="text-3xl font-black text-emerald-400 leading-none mb-1">4.200</p>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-[87%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                </div>
                <p className="text-slate-500 text-[11px] mt-1.5">87% da meta mensal</p>
              </div>

              {/* Taxa de Acerto */}
              <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/15">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-slate-400 text-xs font-medium">Taxa de Acerto</span>
                </div>
                <p className="text-3xl font-black text-blue-400 leading-none mb-1">84%</p>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-[84%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                </div>
                <p className="text-slate-500 text-[11px] mt-1.5">Acima da média Cebraspe</p>
              </div>

              {/* Sequência */}
              <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/15">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-slate-400 text-xs font-medium">Dias de Sequência</span>
                </div>
                <p className="text-3xl font-black text-amber-400 leading-none mb-1">21</p>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
                </div>
                <p className="text-slate-500 text-[11px] mt-1.5">Recorde pessoal: 45 dias</p>
              </div>
            </div>

            {/* Grid: Desempenho + Active Recall */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Desempenho por Matéria */}
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-5">
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <h4 className="text-slate-200 text-sm font-bold">Desempenho por Matéria</h4>
                </div>
                <div className="flex flex-col gap-4">
                  {subjects.map((s, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-slate-300 text-sm font-medium">{s.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold">{s.pct}%</span>
                          <StatusBadge status={s.status} />
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor(s.status)}`}
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Recall */}
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h4 className="text-slate-200 text-sm font-bold">Próximas Revisões (Active Recall)</h4>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {recalls.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700/40">
                      <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${r.urgent ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      <div>
                        <p className="text-slate-200 text-sm font-semibold leading-tight">{r.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{r.time}</p>
                      </div>
                      {r.urgent && (
                        <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold uppercase tracking-wide flex-shrink-0">
                          Urgente
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Protocolo resumo */}
                <div className="mt-5 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-emerald-400 text-xs font-semibold mb-0.5">Protocolo 1-7-30 ativo</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Revisões programadas nos dias 1, 7 e 30 após cada estudo — retenção de 92%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
