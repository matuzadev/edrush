'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Calendar, Award, Target, LogOut } from 'lucide-react';

interface AnalyticsData {
  weeklyProgress: { day: string; answered: number }[];
  topicPerformance: { topic: string; score: number }[];
  streakDays: number;
  totalHours: number;
  goalCompletion: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }

    // Mock data
    const mockData: AnalyticsData = {
      weeklyProgress: [
        { day: 'Seg', answered: 12 },
        { day: 'Ter', answered: 18 },
        { day: 'Qua', answered: 15 },
        { day: 'Qui', answered: 22 },
        { day: 'Sex', answered: 19 },
        { day: 'Sab', answered: 25 },
        { day: 'Dom', answered: 14 },
      ],
      topicPerformance: [
        { topic: 'Criptografia', score: 92 },
        { topic: 'Redes', score: 88 },
        { topic: 'Forense Digital', score: 85 },
        { topic: 'SO Linux', score: 91 },
        { topic: 'Análise de Malware', score: 79 },
      ],
      streakDays: 15,
      totalHours: 48,
      goalCompletion: 72,
    };
    setAnalytics(mockData);
  }, [isLoading, user, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading || !user || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando análises...</p>
        </div>
      </div>
    );
  }

  const maxScore = Math.max(...analytics.topicPerformance.map(t => t.score));
  const maxAnswered = Math.max(...analytics.weeklyProgress.map(w => w.answered));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]">
      {/* Navbar */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold text-white hover:text-emerald-400 transition">
                Foco Federal
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition">Dashboard</Link>
                <Link href="/dashboard/spreadsheet" className="text-slate-400 hover:text-white transition">Planilha</Link>
                <Link href="/dashboard/analytics" className="text-emerald-400 font-semibold">Análises</Link>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Suas Análises</h1>
          <p className="text-slate-400">Visualize seu desempenho e progresso em tempo real</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Streak */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-lg p-6 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-300 font-semibold">Sequência</h3>
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-4xl font-bold text-emerald-400">{analytics.streakDays}</p>
            <p className="text-sm text-slate-400 mt-2">dias consecutivos</p>
          </div>

          {/* Total Hours */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/40 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-300 font-semibold">Tempo</h3>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-4xl font-bold text-blue-400">{analytics.totalHours}</p>
            <p className="text-sm text-slate-400 mt-2">horas estudadas</p>
          </div>

          {/* Goal */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/40 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-300 font-semibold">Meta</h3>
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-4xl font-bold text-purple-400">{analytics.goalCompletion}%</p>
            <p className="text-sm text-slate-400 mt-2">conclusão da meta</p>
          </div>

          {/* Trend */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-lg p-6 hover:border-yellow-500/40 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-300 font-semibold">Tendência</h3>
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-4xl font-bold text-yellow-400">+12%</p>
            <p className="text-sm text-slate-400 mt-2">vs semana anterior</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Progress */}
          <div className="bg-[#0f172a] border border-white/5 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Progresso Semanal</h2>
            <div className="space-y-4">
              {analytics.weeklyProgress.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className="w-12 text-sm font-semibold text-slate-400">{day.day}</span>
                  <div className="flex-1 h-8 bg-slate-900/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all"
                      style={{ width: `${(day.answered / maxAnswered) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-sm font-semibold text-emerald-400 text-right">{day.answered}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Performance */}
          <div className="bg-[#0f172a] border border-white/5 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Desempenho por Tópico</h2>
            <div className="space-y-4">
              {analytics.topicPerformance.map((topic) => (
                <div key={topic.topic} className="flex items-center gap-4">
                  <span className="flex-1 text-sm text-slate-300">{topic.topic}</span>
                  <div className="w-24 h-2 bg-slate-900/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all"
                      style={{ width: `${(topic.score / maxScore) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-sm font-semibold text-blue-400 text-right">{topic.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Section */}
        <div className="mt-8 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Meta de Estudo</h2>
              <p className="text-slate-400">Continue com a sequência para manter o progresso</p>
            </div>
            <Target className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          </div>
          <div className="w-full h-4 bg-slate-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all"
              style={{ width: `${analytics.goalCompletion}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            {analytics.goalCompletion}% completado - {100 - analytics.goalCompletion}% para atingir sua meta
          </p>
        </div>
      </main>
    </div>
  );
}
