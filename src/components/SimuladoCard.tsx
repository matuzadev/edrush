'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, type Tab } from '@/components/ui/Tabs';
import { Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface SimuladoDiscipline {
  id: string;
  name: string;
  questionsCount: number;
  completedCount: number;
  difficulty: 'fácil' | 'médio' | 'difícil';
  estimatedTime: number; // em minutos
}

interface SimuladoCardProps {
  title: string;
  disciplines: SimuladoDiscipline[];
  onStartSimulado: (disciplineId: string) => void;
}

export function SimuladoCard({ 
  title, 
  disciplines, 
  onStartSimulado 
}: SimuladoCardProps) {
  const [activeTab, setActiveTab] = useState(disciplines[0]?.id || '');

  const tabs: Tab[] = disciplines.map(d => ({
    id: d.id,
    label: d.name,
    badge: d.questionsCount
  }));

  const currentDiscipline = disciplines.find(d => d.id === activeTab);

  const difficultyColors = {
    fácil: 'text-emerald-400 bg-emerald-500/10',
    médio: 'text-yellow-400 bg-yellow-500/10',
    difícil: 'text-red-400 bg-red-500/10'
  };

  const completionPercentage = currentDiscipline 
    ? (currentDiscipline.completedCount / currentDiscipline.questionsCount) * 100 
    : 0;

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-white/10 p-6 hover:border-emerald-500/30 transition-all">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400">
          Teste seus conhecimentos com questões de provas reais
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-white/10">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />
      </div>

      {/* Conteúdo da Aba Ativa */}
      {currentDiscipline && (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300">
                Progresso
              </span>
              <span className="text-xs text-slate-400">
                {currentDiscipline.completedCount} / {currentDiscipline.questionsCount}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Dificuldade */}
            <div className={`p-3 rounded-lg border border-white/5 ${difficultyColors[currentDiscipline.difficulty]}`}>
              <p className="text-xs text-slate-400 mb-1">Dificuldade</p>
              <p className="font-semibold capitalize text-sm">
                {currentDiscipline.difficulty}
              </p>
            </div>

            {/* Tempo Estimado */}
            <div className="p-3 rounded-lg border border-white/5 bg-blue-500/10 text-blue-400">
              <p className="text-xs text-slate-400 mb-1">Tempo Estimado</p>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <p className="font-semibold text-sm">
                  {currentDiscipline.estimatedTime} min
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-start gap-3">
            {completionPercentage > 0 ? (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {Math.round(completionPercentage)}% Concluído
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Você já respondeu {currentDiscipline.completedCount} questões desta disciplina
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Não iniciado
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {currentDiscipline.questionsCount} questões disponíveis
                  </p>
                </div>
              </>
            )}
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => onStartSimulado(currentDiscipline.id)}
            className="w-full justify-center gap-2"
          >
            {completionPercentage > 0 ? 'Continuar Simulado' : 'Iniciar Simulado'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}
