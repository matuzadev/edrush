'use client';

import { useState, useEffect } from 'react';
import { Question, MOCK_QUESTIONS, getQuestionsForReview } from '@/lib/questions';
import { useAuth } from '@/contexts/AuthContext';

export function useQuestions() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadQuestions();
    }
  }, [user]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      // Em produção, buscar do Supabase
      // const { data, error } = await supabase
      //   .from('questions')
      //   .select('*')
      //   .eq('user_id', user?.id);
      
      // Por enquanto, usar mock data
      setQuestions(MOCK_QUESTIONS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar questões');
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionsToStudy = () => {
    return getQuestionsForReview(questions);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(prev =>
      prev.map(q => q.id === questionId ? { ...q, ...updates } : q)
    );
  };

  const getTotalStats = () => {
    const answered = questions.filter(q => q.attempts > 0).length;
    const avgScore = answered > 0
      ? Math.round(
          questions
            .filter(q => q.isCorrect)
            .reduce((sum, q) => sum + q.attempts, 0) / answered * 10
        )
      : 0;

    return {
      total: questions.length,
      answered,
      avgScore: Math.min(avgScore, 100),
      toReview: getQuestionsToStudy().length,
    };
  };

  return {
    questions,
    isLoading,
    error,
    getQuestionsToStudy,
    updateQuestion,
    getTotalStats,
    loadQuestions,
  };
}
