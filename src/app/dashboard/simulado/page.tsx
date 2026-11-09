'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SimuladoCard } from '@/components/SimuladoCard';
import { ChevronLeft, Loader2, RefreshCw } from 'lucide-react';

interface SimuladoDiscipline {
  id: string;
  name: string;
  questionsCount: number;
  completedCount: number;
  difficulty: 'fácil' | 'médio' | 'difícil';
  estimatedTime: number;
}

interface SimuladoData {
  title: string;
  concursoId: number | null;
  disciplines: SimuladoDiscipline[];
}

export default function SimuladoPage() {
  const router = useRouter();
  const [data, setData] = useState<SimuladoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSimulados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/simulado', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? 'Não foi possível carregar os simulados.');
      }
      setData(result as SimuladoData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os simulados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSimulados();
  }, [loadSimulados]);

  const handleStartSimulado = (discipline: string) => {
    const params = new URLSearchParams({ discipline });
    if (data?.concursoId) params.set('concurso_id', String(data.concursoId));
    router.push(`/dashboard/simulado/play?${params.toString()}`);
  };

  const totalQuestions = data?.disciplines.reduce((total, discipline) => total + discipline.questionsCount, 0) ?? 0;
  const completedQuestions = data?.disciplines.reduce((total, discipline) => total + discipline.completedCount, 0) ?? 0;
  const progress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#020617] pb-12 text-white">
      <div className="px-4 py-4 md:px-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 transition hover:text-emerald-400">
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Link>
      </div>

      <header className="mb-10 px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            {data?.title ?? 'Simulados'}
          </h1>
          <p className="text-slate-400">Resolva questões do banco de dados e acompanhe seu progresso.</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 md:px-6">
        {loading ? (
          <div className="flex min-h-56 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => void loadSimulados()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/5"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </button>
          </div>
        ) : data && data.disciplines.length > 0 ? (
          <SimuladoCard
            title="Simulado por disciplina"
            disciplines={data.disciplines}
            onStartSimulado={handleStartSimulado}
          />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <h2 className="text-lg font-bold">Ainda não há questões disponíveis</h2>
            <p className="mt-2 text-sm text-slate-400">
              Quando houver questões cadastradas para este concurso, elas aparecerão aqui.
            </p>
          </div>
        )}

        {!loading && !error && data && data.disciplines.length > 0 && (
          <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Questões disponíveis" value={totalQuestions} />
            <StatCard label="Respondidas no simulado" value={completedQuestions} />
            <StatCard label="Progresso geral" value={`${progress}%`} />
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-2xl font-bold text-emerald-400">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}
