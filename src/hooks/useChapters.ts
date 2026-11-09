import { useState, useEffect, useCallback } from 'react';

export interface ChapterData {
  id: number;
  disciplina: string;
  numero: number;
  titulo: string;
  descricao?: string;
  is_primeiro: number;
  progress: {
    is_unlocked: number;
    is_completed: number;
    acertos_total: number;
    questoes_respondidas: number;
    percentual_acerto: number;
    tempo_estudo_ms: number;
  };
}

export interface UseChaptersResult {
  chapters: ChapterData[];
  loading: boolean;
  error: string | null;
  submitProgress: (chapterId: number, acertos: number, questoes: number, tempoMs: number) => Promise<void>;
  getChapterQuestions: (chapterId: number, difficulty?: string) => Promise<any[]>;
}

/**
 * Hook para gerenciar progresso de capítulos
 * Carrega dados de todas as disciplinas e capítulos
 * Permite submeter progresso e obter questões
 */
export function useChapters(): UseChaptersResult {
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar progresso ao montar
  useEffect(() => {
    loadChaptersProgress();
  }, []);

  const loadChaptersProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chapters/progress');
      if (!response.ok) throw new Error('Erro ao buscar capítulos');
      const data = await response.json();
      setChapters(data.chapters);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const submitProgress = useCallback(
    async (chapterId: number, acertos: number, questoes: number, tempoMs: number) => {
      try {
        const response = await fetch('/api/chapters/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chapterId, acertos, questoes, tempoMs }),
        });

        if (!response.ok) throw new Error('Erro ao submeter progresso');

        const result = await response.json();

        if (result.completado) {
          console.log(`✅ Capítulo ${chapterId} completado!`);
          // Recarregar para refletir desbloqueios automáticos
          await loadChaptersProgress();
        }
      } catch (err) {
        console.error('Erro:', err);
        throw err;
      }
    },
    []
  );

  const getChapterQuestions = useCallback(
    async (chapterId: number, difficulty?: string) => {
      try {
        const url = new URL(`/api/chapters/${chapterId}/questions`, window.location.origin);
        if (difficulty) url.searchParams.set('difficulty', difficulty);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Erro ao buscar questões');

        const data = await response.json();
        return data.questions;
      } catch (err) {
        console.error('Erro:', err);
        return [];
      }
    },
    []
  );

  return {
    chapters,
    loading,
    error,
    submitProgress,
    getChapterQuestions,
  };
}
