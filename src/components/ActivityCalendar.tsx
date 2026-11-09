'use client';

import { ActivityDay } from '@/hooks/useProfile';

interface ActivityCalendarProps {
  activityLog: ActivityDay[];
  title?: string;
}

export function ActivityCalendar({ activityLog, title = 'Histórico de Atividade' }: ActivityCalendarProps) {
  const weeks: ActivityDay[][] = [];
  let currentWeek: ActivityDay[] = [];

  // Agrupar dias em semanas
  for (const day of activityLog) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
      <h3 className="text-white font-bold text-lg mb-6">{title}</h3>
      
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Labels de dias da semana */}
          <div className="flex gap-2 mb-2">
            <div className="w-12" />
            {days.map((day, idx) => (
              <div
                key={idx}
                className="w-6 h-6 flex items-center justify-center text-xs text-slate-500 font-medium"
              >
                {day[0]}
              </div>
            ))}
          </div>

          {/* Grid de atividade */}
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex gap-2 mb-2">
              {weekIdx === 0 && (
                <div className="w-12 flex items-center justify-center text-xs text-slate-500 font-medium">
                  {new Date(week[0].date).toLocaleDateString('pt-BR', { month: 'short' })}
                </div>
              )}
              {weekIdx !== 0 && (
                <div className="w-12 flex items-center justify-center text-xs text-slate-500 font-medium">
                  {new Date(week[0].date).getDate() === 1
                    ? new Date(week[0].date).toLocaleDateString('pt-BR', { month: 'short' })
                    : ''}
                </div>
              )}
              
              {week.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className={`w-6 h-6 rounded-sm border border-slate-700 transition-all cursor-help ${
                    day.completed
                      ? 'bg-emerald-500 border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/50'
                      : 'bg-slate-800/50 hover:bg-slate-700/50'
                  }`}
                  title={`${day.date}: ${day.completed ? `${day.chaptersCompletedToday} capítulo(s) concluído(s)` : 'Sem atividade'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
        <span>Menos</span>
        <div className="flex gap-1">
          {[0, 0.25, 0.5, 0.75, 1].map((opacity, idx) => (
            <div
              key={idx}
              className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-600"
              style={{ opacity }}
            />
          ))}
        </div>
        <span>Mais</span>
      </div>
    </div>
  );
}
