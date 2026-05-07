import { useState, useEffect, useCallback } from 'react';

import type { Medal } from '@/lib/levels';

export type Achievement = Medal;

export interface ActivityDay {
  date: string;
  completed: boolean;
  chaptersCompletedToday: number;
  questionsAnswered?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  nome: string | null;
  foto_url: string | null;
  avatar_id: number;
  equippedBorder: string;
  birthday?: string | null;
  location?: string | null;
  bio?: string | null;
  criado_em: string;
  // XP & Level
  xp: number;
  level: number;
  levelName: string;
  levelColor: string;
  levelBg: string;
  levelBorder: string;
  xpIntoLevel: number;
  xpNeeded: number;
  xpProgressPct: number;
  // Stats
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  totalSessions: number;
  accuracy: number;
  streak: number;
  medals: number;
  totalMedals: number;
  achievements: Achievement[];
  activityLog: ActivityDay[];
}

const DEFAULT_PROFILE: UserProfile = {
  id: '',
  username: '',
  email: '',
  nome: null,
  foto_url: null,
  avatar_id: 1,
  equippedBorder: 'recruta',
  criado_em: new Date().toISOString(),
  xp: 0,
  level: 1,
  levelName: 'Recruta',
  levelColor: 'text-slate-400',
  levelBg: 'bg-slate-500/15',
  levelBorder: 'border-slate-500/40',
  xpIntoLevel: 0,
  xpNeeded: 150,
  xpProgressPct: 0,
  totalQuestionsAnswered: 0,
  totalQuestionsCorrect: 0,
  totalSessions: 0,
  accuracy: 0,
  streak: 0,
  medals: 0,
  totalMedals: 21,
  achievements: [],
  activityLog: [],
};

export const usUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/user/stats');
      if (!res.ok) throw new Error('Falha ao buscar perfil');
      const data = await res.json();
      setProfile(data as UserProfile);
      setError(null);
    } catch (err) {
      console.error('useProfile fetch error:', err);
      setError('Não foi possível carregar o perfil');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: {
    username?: string;
    bio?: string;
    birthday?: string;
    location?: string;
    avatar_id?: number;
  }) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Erro ao salvar');
      }
      // Atualizar estado local otimisticamente
      setProfile(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error('updateProfile error:', err);
      throw err;
    }
  };

  // Chamado ao finalizar uma sessão de estudo — persiste no banco
  const saveStudySession = async (opts: {
    questionsAnswered: number;
    correctAnswers: number;
    concursoSlug?: string;
    subject?: string;
  }) => {
    try {
      await fetch('/api/study/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts),
      });
      // Atualizar stats localmente (otimista, sem refetch completo)
      setProfile(prev => {
        const newTotal = prev.totalQuestionsAnswered + opts.questionsAnswered;
        const newCorrect = prev.totalQuestionsCorrect + opts.correctAnswers;
        const today = new Date().toISOString().split('T')[0];
        const updatedLog = prev.activityLog.map(day =>
          day.date === today
            ? {
                ...day,
                completed: true,
                chaptersCompletedToday: day.chaptersCompletedToday + 1,
                questionsAnswered: (day.questionsAnswered ?? 0) + opts.questionsAnswered,
              }
            : day
        );
        return {
          ...prev,
          totalQuestionsAnswered: newTotal,
          totalQuestionsCorrect: newCorrect,
          totalSessions: prev.totalSessions + 1,
          accuracy: newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0,
          activityLog: updatedLog,
        };
      });
    } catch (err) {
      console.error('saveStudySession error:', err);
      // Não bloquear o usuário — falha silenciosa no log
    }
  };

  // Mantidos para compatibilidade com study/page.tsx enquanto migração não termina
  const addCorrectAnswer = (_questionId: string) => {
    setProfile(prev => ({
      ...prev,
      totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
      totalQuestionsCorrect: prev.totalQuestionsCorrect + 1,
    }));
  };

  const addIncorrectAnswer = () => {
    setProfile(prev => ({
      ...prev,
      totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
    }));
  };

  const completeChapter = () => {
    // No-op — agora o salvamento real é feito via saveStudySession ao finalizar
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    saveStudySession,
    fetchProfile,
    // compatibilidade legada
    addCorrectAnswer,
    addIncorrectAnswer,
    completeChapter,
  };
};
