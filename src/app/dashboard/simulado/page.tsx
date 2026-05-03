'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SimuladoCard } from '@/components/SimuladoCard';
import { ChevronLeft } from 'lucide-react';

// Dados de exemplo - substituir por dados reais do BD
const SIMULADOS_DATA = {
  'perito-federal': {
    title: 'Concurso: Perito Federal',
    disciplines: [
      {
        id: 'portugues',
        name: 'Português',
        questionsCount: 45,
        completedCount: 12,
        difficulty: 'médio' as const,
        estimatedTime: 90
      },
      {
        id: 'redes-computadores',
        name: 'Redes de Computadores',
        questionsCount: 40,
        completedCount: 0,
        difficulty: 'difícil' as const,
        estimatedTime: 120
      },
      {
        id: 'lingua-portuguesa',
        name: 'Língua Portuguesa',
        questionsCount: 50,
        completedCount: 25,
        difficulty: 'médio' as const,
        estimatedTime: 100
      },
      {
        id: 'informatica-basica',
        name: 'Informática Básica',
        questionsCount: 35,
        completedCount: 35,
        difficulty: 'fácil' as const,
        estimatedTime: 60
      },
      {
        id: 'direito-penal',
        name: 'Direito Penal e Processo',
        questionsCount: 55,
        completedCount: 8,
        difficulty: 'difícil' as const,
        estimatedTime: 140
      },
      {
        id: 'raciocinio-logico',
        name: 'Raciocínio Lógico',
        questionsCount: 40,
        completedCount: 20,
        difficulty: 'difícil' as const,
        estimatedTime: 110
      }
    ]
  }
};

export default function SimuladoPage() {
  const router = useRouter();
  const [selectedSimulado] = useState('perito-federal');

  const simulado = SIMULADOS_DATA[selectedSimulado as keyof typeof SIMULADOS_DATA];

  const handleStartSimulado = (disciplineId: string) => {
    router.push(`/dashboard/simulado/play?discipline=${disciplineId}`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-12">
      {/* Back Button */}
      <div className="px-4 py-4 md:px-6">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </Link>
      </div>

      {/* Header */}
      <div className="px-4 md:px-6 mb-12">
        <div className="max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {simulado.title}
          </h1>
          <p className="text-slate-400">
            Resolva simulados completos e avalie seu desempenho antes da prova
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 max-w-5xl mx-auto">
        <SimuladoCard
          title="Simulado Completo"
          disciplines={simulado.disciplines}
          onStartSimulado={handleStartSimulado}
        />
      </div>

      {/* Stats Footer */}
      <div className="px-4 md:px-6 mt-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {simulado.disciplines.reduce((acc, d) => acc + d.questionsCount, 0)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Questões Totais</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {simulado.disciplines.reduce((acc, d) => acc + d.completedCount, 0)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Resolvidas</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {Math.round((simulado.disciplines.reduce((acc, d) => acc + d.completedCount, 0) / simulado.disciplines.reduce((acc, d) => acc + d.questionsCount, 0)) * 100)}%
            </p>
            <p className="text-xs text-slate-400 mt-1">Progresso Geral</p>
          </div>
        </div>
      </div>
    </div>
  );
}
