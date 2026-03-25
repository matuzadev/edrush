import { useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: number;
  birthday?: string;
  location?: string;
  bio?: string;
  createdAt: string;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  medals: number;
  completedChapters: number;
  correctQuestionsIds: string[]; // IDs das questões acertadas
  activityLog: ActivityDay[];
}

export interface ActivityDay {
  date: string;
  completed: boolean;
  chaptersCompletedToday: number;
}

// Mock data - em produção viriam do banco de dados
export const usUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user_123abc',
    username: 'FedExplorer',
    email: 'usuario@exemplo.com',
    avatar: 1,
    birthday: '1995-05-20',
    location: 'São Paulo, SP',
    bio: 'Estudante dedicado buscando a aprovação no Concurso Federal',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 dias atrás
    totalQuestionsAnswered: 245,
    totalQuestionsCorrect: 198,
    medals: 5,
    completedChapters: 12,
    correctQuestionsIds: [], // IDs das questões acertadas
    activityLog: generateActivityLog(),
  });

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addCorrectAnswer = (questionId: string) => {
    setProfile(prev => {
      if (!prev.correctQuestionsIds.includes(questionId)) {
        return {
          ...prev,
          correctQuestionsIds: [...prev.correctQuestionsIds, questionId],
          totalQuestionsCorrect: prev.totalQuestionsCorrect + 1,
          totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        };
      }
      return {
        ...prev,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
      };
    });
  };

  const addIncorrectAnswer = () => {
    setProfile(prev => ({
      ...prev,
      totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
    }));
  };

  const completeChapter = () => {
    const today = new Date().toISOString().split('T')[0];
    const existingActivity = profile.activityLog.find(a => a.date === today);
    
    if (existingActivity) {
      existingActivity.chaptersCompletedToday++;
    } else {
      profile.activityLog.push({
        date: today,
        completed: true,
        chaptersCompletedToday: 1,
      });
    }
    
    setProfile(prev => ({
      ...prev,
      completedChapters: prev.completedChapters + 1,
    }));
  };

  return { profile, updateProfile, addCorrectAnswer, addIncorrectAnswer, completeChapter };
};

function generateActivityLog(): ActivityDay[] {
  const log: ActivityDay[] = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    log.push({
      date: date.toISOString().split('T')[0],
      completed: Math.random() > 0.3, // 70% de chance de ter completado
      chaptersCompletedToday: Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0,
    });
  }
  
  return log;
}
