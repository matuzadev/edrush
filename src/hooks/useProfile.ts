import { useState, useEffect, useCallback } from 'react';

import type { Medal } from '@/lib/levels';
import type { StoreItemLite } from '@/components/store/StoreItemPreview';

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
  hasWelcomeKit?: boolean;
  avatar_id: number;
  equippedBorder: string;
  concursoSlug: string | null;
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
  // Stats do usuário
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  totalSessions: number;
  accuracy: number;
  streak: number;
  distinctSubjectsTouched?: number;
  // Stats da plataforma (banco inteiro)
  totalPlatformQuestions?: number;
  platformQuestionsByDisciplina?: { disciplina: string; total: number }[];
  /** % de questões da plataforma que o usuário já respondeu (1 casa decimal). */
  coveragePct?: number;
  // Medalhas e atividade
  medals: number;
  totalMedals: number;
  achievements: Achievement[];
  activityLog: ActivityDay[];
  equippedBadges?: StoreItemLite[];
}

const DEFAULT_PROFILE: UserProfile = {
  id: '',
  username: '',
  email: '',
  nome: null,
  foto_url: null,
  avatar_id: 1,
  equippedBorder: 'recruta',
  concursoSlug: null,
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
  equippedBadges: [],
};

// Cache de módulo: deduplica fetches concorrentes (vários componentes
// chamando useProfile() ao mesmo tempo) e revalida só após TTL.
// Sem isso, cada componente que monta useProfile dispara um GET /api/user/stats
// separado, que serializa 7+ queries no Turso.
const PROFILE_TTL_MS = 30_000;
let _profileCache: { data: UserProfile; at: number } | null = null;
let _profileInFlight: Promise<UserProfile> | null = null;
const _profileSubscribers = new Set<(p: UserProfile) => void>();

async function loadProfile(force = false): Promise<UserProfile> {
  const now = Date.now();
  if (!force && _profileCache && now - _profileCache.at < PROFILE_TTL_MS) {
    return _profileCache.data;
  }
  if (_profileInFlight) return _profileInFlight;
  _profileInFlight = (async () => {
    try {
      const res = await fetch('/api/user/stats');
      if (!res.ok) throw new Error('Falha ao buscar perfil');
      const data = (await res.json()) as UserProfile;
      _profileCache = { data, at: Date.now() };
      _profileSubscribers.forEach((cb) => cb(data));
      return data;
    } finally {
      _profileInFlight = null;
    }
  })();
  return _profileInFlight;
}

function patchProfileCache(updater: (p: UserProfile) => UserProfile) {
  if (!_profileCache) return;
  const next = updater(_profileCache.data);
  _profileCache = { data: next, at: _profileCache.at };
  _profileSubscribers.forEach((cb) => cb(next));
}

export const usUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(
    () => _profileCache?.data ?? DEFAULT_PROFILE
  );
  const [isLoading, setIsLoading] = useState(() => !_profileCache);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await loadProfile(true);
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error('useProfile fetch error:', err);
      setError('Não foi possível carregar o perfil');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const sub = (p: UserProfile) => setProfile(p);
    _profileSubscribers.add(sub);

    if (_profileCache) {
      setProfile(_profileCache.data);
      setIsLoading(false);
      // Revalidar em background se passou do TTL
      if (Date.now() - _profileCache.at >= PROFILE_TTL_MS) {
        loadProfile(false).catch(() => {});
      }
    } else {
      loadProfile(false)
        .then((data) => { setProfile(data); setError(null); })
        .catch((err) => { console.error('useProfile fetch error:', err); setError('Não foi possível carregar o perfil'); })
        .finally(() => setIsLoading(false));
    }

    return () => { _profileSubscribers.delete(sub); };
  }, []);

  const updateProfile = async (updates: {
    username?: string;
    bio?: string;
    birthday?: string;
    location?: string;
    avatar_id?: number;
    foto_url?: string | null;
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
      // Atualizar cache de módulo (todos os subscribers veem o update)
      patchProfileCache((prev) => ({ ...prev, ...updates }));
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
      patchProfileCache((prev) => {
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
    patchProfileCache((prev) => ({
      ...prev,
      totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
      totalQuestionsCorrect: prev.totalQuestionsCorrect + 1,
    }));
  };

  const addIncorrectAnswer = () => {
    patchProfileCache((prev) => ({
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
