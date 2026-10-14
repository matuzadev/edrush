'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionGuard } from '@/components/SubscriptionGuard';

interface DisciplinaStats {
  disciplina: string;
  answered: number;
  correct: number;
  accuracy: number;
}

interface WeekDay {
  day: string;
  date: string;
  answered: number;
  correct: number;
}

interface Achievement {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
}

interface StatsData {
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  totalSessions: number;
  accuracy: number;
  streak: number;
  medals: number;
  achievements: Achievement[];
  byDisciplina: DisciplinaStats[];
  weeklyProgress: WeekDay[];
  activityLog: { date: string; completed: boolean; questionsAnswered: number }[];
}

export default function AnalyticsPage() {
  return (
    <SubscriptionGuard premiumOnly>
      <AnalyticsContent />
    </SubscriptionGuard>
  );
}

function AnalyticsContent() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push('/auth/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/user/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (isLoading || loading || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400">
        Erro ao carregar dados.
      </div>
    );
  }

  const maxWeekly = Math.max(...stats.weeklyProgress.map(d => d.answered), 1);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#020617]/80 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 transition text-sm">
            ← Dashboard
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-white font-semibold text-sm">Análises</span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard
            label="Questões respondidas"
            value={stats.totalQuestionsAnswered.toLocaleString('pt-BR')}
            sub={`${stats.totalQuestionsCorrect} acertos`}
            color="emerald"
            icon="📝"
          />
          <KpiCard
            label="Taxa de acerto"
            value={`${stats.accuracy}%`}
            sub={stats.accuracy >= 80 ? 'Excelente!' : stats.accuracy >= 60 ? 'Bom trabalho' : 'Continue praticando'}
            color={stats.accuracy >= 80 ? 'emerald' : stats.accuracy >= 60 ? 'yellow' : 'red'}
            icon="🎯"
          />
          <KpiCard
            label="Sequência atual"
            value={`${stats.streak}d`}
            sub={stats.streak >= 7 ? 'Incrível! 🔥' : stats.streak >= 3 ? 'Boa sequência!' : 'Continue hoje'}
            color="orange"
            icon="🔥"
          />
          <KpiCard
            label="Conquistas"
            value={`${stats.medals}`}
            sub={`de ${stats.achievements.length} total`}
            color="purple"
            icon="🏅"
          />
        </div>

        {/* Progresso semanal */}
        <section className="bg-slate-900 border border-white/8 rounded-2xl p-5">
          <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-widest text-slate-400">
            Últimos 7 dias
          </h2>
          <div className="space-y-3">
            {stats.weeklyProgress.map(d => (
              <div key={d.date} className="flex items-center gap-3">
                <span className="w-8 text-xs font-semibold text-slate-500 text-right shrink-0">{d.day}</span>
                <div className="flex-1 h-7 bg-slate-800 rounded-lg overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg transition-all duration-700"
                    style={{ width: `${d.answered > 0 ? Math.max(4, (d.answered / maxWeekly) * 100) : 0}%` }}
                  />
                  {d.answered > 0 && (
                    <span className="absolute inset-y-0 left-3 flex items-center text-xs font-bold text-slate-900 z-10">
                      {d.answered} questões
                    </span>
                  )}
                </div>
                <span className={`w-14 text-xs font-bold text-right shrink-0 ${d.answered > 0 ? 'text-emerald-400' : 'text-slate-700'}`}>
                  {d.answered > 0 ? `${d.answered > 0 ? Math.round((d.correct / d.answered) * 100) : 0}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Por disciplina */}
        {stats.byDisciplina.length > 0 && (
          <section className="bg-slate-900 border border-white/8 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-widest text-slate-400">
              Desempenho por disciplina
            </h2>
            <div className="space-y-4">
              {stats.byDisciplina.map(d => (
                <div key={d.disciplina}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-300 font-medium capitalize truncate max-w-[60%]">
                      {d.disciplina.replace(/-/g, ' ')}
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-500">{d.correct}/{d.answered}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        d.accuracy >= 80 ? 'bg-emerald-500/15 text-emerald-400' :
                        d.accuracy >= 60 ? 'bg-yellow-500/15 text-yellow-400' :
                        'bg-red-500/15 text-red-400'
                      }`}>
                        {d.accuracy}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        d.accuracy >= 80 ? 'bg-emerald-500' :
                        d.accuracy >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${d.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Conquistas */}
        <section className="bg-slate-900 border border-white/8 rounded-2xl p-5">
          <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-widest text-slate-400">
            Conquistas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {stats.achievements.map(a => (
              <div
                key={a.id}
                className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                  a.unlocked
                    ? 'bg-emerald-500/8 border-emerald-500/30'
                    : 'bg-slate-800/40 border-slate-700/50 opacity-50'
                }`}
              >
                <span className={`text-xl shrink-0 ${a.unlocked ? '' : 'grayscale'}`}>
                  {getAchievementIcon(a.id)}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate ${a.unlocked ? 'text-white' : 'text-slate-500'}`}>
                    {a.label}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{a.description}</p>
                </div>
                {a.unlocked && <span className="ml-auto text-emerald-400 text-sm shrink-0">✓</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Calendário de atividade — últimos 30 dias */}
        <section className="bg-slate-900 border border-white/8 rounded-2xl p-5">
          <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-widest text-slate-400">
            Calendário de atividade (30 dias)
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {stats.activityLog.map(d => (
              <div
                key={d.date}
                title={`${d.date}: ${d.questionsAnswered} questões`}
                className={`w-6 h-6 rounded-md transition-all cursor-default ${
                  d.questionsAnswered >= 20 ? 'bg-emerald-400' :
                  d.questionsAnswered >= 10 ? 'bg-emerald-500/70' :
                  d.questionsAnswered >= 1  ? 'bg-emerald-700/70' :
                  'bg-slate-800'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
            <span>Menos</span>
            <div className="w-4 h-4 rounded bg-slate-800" />
            <div className="w-4 h-4 rounded bg-emerald-700/70" />
            <div className="w-4 h-4 rounded bg-emerald-500/70" />
            <div className="w-4 h-4 rounded bg-emerald-400" />
            <span>Mais</span>
          </div>
        </section>

        {/* Sem dados ainda */}
        {stats.totalQuestionsAnswered === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-4xl mb-3">📚</p>
            <p className="font-semibold text-slate-400">Nenhuma questão respondida ainda.</p>
            <p className="text-sm mt-1">Comece a estudar para ver suas análises aqui!</p>
            <Link
              href="/dashboard"
              className="inline-block mt-4 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition text-sm"
            >
              Começar a estudar
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function KpiCard({ label, value, sub, color, icon }: {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: string;
}) {
  const clr = {
    emerald: 'text-emerald-400 bg-emerald-500/8 border-emerald-500/25',
    yellow:  'text-yellow-400  bg-yellow-500/8  border-yellow-500/25',
    red:     'text-red-400     bg-red-500/8     border-red-500/25',
    orange:  'text-orange-400  bg-orange-500/8  border-orange-500/25',
    purple:  'text-purple-400  bg-purple-500/8  border-purple-500/25',
  }[color] ?? 'text-slate-400 bg-slate-800 border-slate-700';

  return (
    <div className={`rounded-2xl border p-4 ${clr}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg">{icon}</span>
      </div>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs opacity-60 mt-0.5 leading-snug">{sub}</p>
      <p className="text-xs opacity-40 mt-1 uppercase tracking-wide font-semibold leading-tight">{label}</p>
    </div>
  );
}

function getAchievementIcon(id: string): string {
  const map: Record<string, string> = {
    first_question: '✏️',
    ten_questions: '📖',
    hundred_questions: '🏅',
    five_hundred_questions: '🎖️',
    first_session: '🚀',
    ten_sessions: '💪',
    accuracy_70: '🎯',
    accuracy_90: '⭐',
    streak_3: '🔥',
    streak_7: '🏆',
  };
  return map[id] ?? '🏅';
}
