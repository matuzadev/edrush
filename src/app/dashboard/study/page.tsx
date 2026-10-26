'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionGuard } from '@/components/SubscriptionGuard';
import { Question, MOCK_QUESTIONS } from '@/lib/questions';
import { QuestionModal } from '@/components/QuestionModal';
import { usUserProfile } from '@/hooks/useProfile';
import { LogOut, ChevronLeft, Trophy, Target, BookOpen, X, Share2 } from 'lucide-react';
import { ShareResultModal } from '@/components/community/ShareResultModal';

export default function StudyPage() {
  return (
    <SubscriptionGuard>
      <StudyPageContent />
    </SubscriptionGuard>
  );
}

function StudyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const { user, signOut, isLoading } = useAuth();
  const { profile, addCorrectAnswer, addIncorrectAnswer, completeChapter, saveStudySession } = usUserProfile();

  // Modo bloco rápido (vindo do BlockSetupModal): tem ?disciplina=... + ?quantidade=...
  // Modo legacy: tem só ?subject=... e usa localStorage
  const subject = searchParams.get('subject');
  const disciplina = searchParams.get('disciplina');
  const quantidade = searchParams.get('quantidade');
  const moduloParam = searchParams.get('modulo');
  const dificuldadeParam = searchParams.get('dificuldade');
  const filtroParam = searchParams.get('filtro');
  const isBlockMode = !!(disciplina && quantidade);

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [blockLoading, setBlockLoading] = useState<boolean>(isBlockMode);
  const [shareOpen, setShareOpen] = useState(false);
  const sessionStartRef = useRef<number>(Date.now());
  const questionStartRef = useRef<number>(Date.now());

  // Reset start time quando muda de questão
  useEffect(() => {
    questionStartRef.current = Date.now();
  }, [currentQuestionIndex, sessionQuestions]);

  useEffect(() => {
    if (!isLoading && !user) router.push('/auth/login');
  }, [user, isLoading, router]);

  // MODO BLOCO RÁPIDO — fetch do banco respeitando filtros do modal
  useEffect(() => {
    if (!isBlockMode) return;
    const ctrl = new AbortController();
    setBlockLoading(true);

    const params = new URLSearchParams({ disciplina: disciplina! });
    if (moduloParam) params.set('capitulo', moduloParam);
    if (dificuldadeParam) {
      // /api/questions aceita um único valor de dificuldade — para múltiplos
      // selecionados deixamos sem filtro e cortamos no client após o fetch.
      const arr = dificuldadeParam.split(',').filter(Boolean);
      if (arr.length === 1) params.set('dificuldade', arr[0]);
    }
    // Pede 3x a quantidade pra ter folga após o filtro client-side
    params.set('limit', String(Math.max(50, parseInt(quantidade!, 10) * 3)));

    // "erradas" e "nao_vistas" são tratados client-side a partir do response
    // (a API /api/questions já desliga o anti-farm pra revisão de erradas).
    if (filtroParam === 'erradas') params.set('includeAnswered', '1');

    fetch(`/api/questions?${params}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data || !Array.isArray(data.questions)) {
          setSessionQuestions([]);
          return;
        }
        let qs: Question[] = data.questions;

        // Filtro client-side por múltiplas dificuldades (se selecionou 2)
        if (dificuldadeParam) {
          const set = new Set(
            dificuldadeParam.split(',').map((d) => d.trim().toLowerCase()),
          );
          if (set.size > 0 && set.size < 3) {
            const norm = (s: string | undefined): string =>
              (s ?? '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[̀-ͯ]/g, '');
            qs = qs.filter((q) => set.has(norm(q.difficulty as string)));
          }
        }

        // Embaralha e corta na quantidade pedida
        const desired = parseInt(quantidade!, 10) || 20;
        for (let i = qs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [qs[i], qs[j]] = [qs[j], qs[i]];
        }
        qs = qs.slice(0, desired);
        setSessionQuestions(qs);
        setCurrentQuestionIndex(0);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        console.error('Falha ao carregar bloco rápido:', err);
        setSessionQuestions([]);
      })
      .finally(() => setBlockLoading(false));

    return () => ctrl.abort();
  }, [isBlockMode, disciplina, moduloParam, dificuldadeParam, filtroParam, quantidade]);

  // MODO LEGACY — load questions from LocalStorage
  useEffect(() => {
    if (isBlockMode) return; // pulando no modo bloco
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('local_questions_v1') : null;
      if (raw) {
        setAllQuestions(JSON.parse(raw));
      } else {
        setAllQuestions(MOCK_QUESTIONS);
      }
    } catch (e) {
      console.error('Failed to load local questions for study', e);
      setAllQuestions(MOCK_QUESTIONS);
    }
  }, [isBlockMode]);

  // MODO LEGACY — filtrar questões pela matéria escolhida
  useEffect(() => {
    if (isBlockMode) return;
    const filtered = allQuestions.filter(q => q.subject === subject);
    setSessionQuestions(filtered);
    setCurrentQuestionIndex(0);
  }, [isBlockMode, subject, allQuestions]);

  const handleQuestionSubmit = async (questionId: string, userAnswer: string, isCorrect: boolean, quality: number) => {
    setIsSubmitting(true);
    const tempo_resposta_ms = Date.now() - questionStartRef.current;
    const currentQ = sessionQuestions[currentQuestionIndex];
    try {
      const response = await fetch('/api/questions/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          resposta_dada: userAnswer,
          acertou: isCorrect,
          tempo_resposta_ms,
          disciplina: currentQ?.subject ?? subject ?? null,
          capitulo: currentQ?.chapter != null ? String(currentQ.chapter) : null,
          subject: subject ?? null,
          origem: 'study',
        }),
      });
      if (!response.ok) throw new Error('Falha ao salvar resposta');
    } catch (error) {
      console.error('Falha ao salvar resposta:', error);
      setIsSubmitting(false);
      return;
    }

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      addCorrectAnswer(questionId);
    } else {
      addIncorrectAnswer();
    }

    setTimeout(async () => {
      if (currentQuestionIndex < sessionQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        completeChapter();
        setIsFinished(true);
        await saveStudySession({
          questionsAnswered: sessionQuestions.length,
          correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers,
          subject: subject ?? undefined,
        });
      }
      setIsSubmitting(false);
    }, 400);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  if (isBlockMode && blockLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500 mx-auto mb-4" />
          <p className="text-slate-300 font-bold">Preparando seu bloco</p>
          <p className="text-slate-500 text-sm mt-1">{disciplina} · {quantidade} questões</p>
        </div>
      </div>
    );
  }

  if (sessionQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-slate-500" />
          </div>
          <p className="text-white font-black text-lg">
            Nenhuma questão encontrada
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {isBlockMode
              ? 'Tente reabrir o seletor e ajustar os filtros do bloco.'
              : 'Não há questões cadastradas para esta matéria ainda.'}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-5 px-5 py-2.5 rounded-xl text-sm font-black text-emerald-300 transition"
            style={{
              background: 'rgba(16,185,129,0.10)',
              border: '1px solid rgba(16,185,129,0.30)',
            }}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = sessionQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / sessionQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Header Estilo Duolingo (Barra de Progresso) */}
      <nav className="max-w-4xl mx-auto px-6 py-6 flex items-center gap-6">
        <Link href="/dashboard/trilha">
          <X className="w-6 h-6 text-slate-500 hover:text-white transition" />
        </Link>
        <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Target className="w-5 h-5" />
          {correctAnswers}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {!isFinished ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Info do Capítulo */}
            <div className="flex items-center gap-3 text-slate-400 mb-4">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-widest">
                {subject} • Questão {currentQuestionIndex + 1} de {sessionQuestions.length}
              </span>
            </div>

            <QuestionModal
              question={currentQuestion}
              onClose={() => {}}
              onSubmit={handleQuestionSubmit}
              isLoading={isSubmitting}
            />
          </div>
        ) : (
          /* Tela de Finalização Estilo Duolingo */
          <div className="text-center py-20 space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
              <Trophy className="w-24 h-24 text-yellow-500 relative z-10 mx-auto" />
            </div>
            
            <div>
              <h2 className="text-4xl font-black text-white mb-2">Lição Concluída!</h2>
              <p className="text-slate-400">Você está cada vez mais perto da sua farda.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
                <p className="text-emerald-400 text-3xl font-black">{Math.round((correctAnswers/sessionQuestions.length)*100)}%</p>
                <p className="text-slate-500 text-xs uppercase font-bold">Precisão</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-white/5">
                <p className="text-blue-400 text-3xl font-black">+{sessionQuestions.length * 20}</p>
                <p className="text-slate-500 text-xs uppercase font-bold">XP Ganho</p>
              </div>
            </div>

            {/* CTA: Compartilhar resultado no feed */}
            <button
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center justify-center gap-2 w-full max-w-sm py-3 rounded-2xl text-sm font-black text-emerald-200 transition-all hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.14), rgba(6,182,212,0.06))',
                border: '1px solid rgba(16,185,129,0.40)',
                boxShadow: '0 0 14px -4px rgba(16,185,129,0.40)',
              }}
            >
              <Share2 size={14} />
              Compartilhar no Feed
            </button>

            <Link
              href="/dashboard/trilha"
              className="inline-block w-full max-w-sm py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-[0_4px_0_rgb(16,185,129)] active:shadow-none active:translate-y-1 transition-all"
            >
              CONTINUAR
            </Link>
          </div>
        )}
      </main>

      {/* Modal: Compartilhar resultado no feed */}
      {isFinished && (
        <ShareResultModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          result={{
            acertos: correctAnswers,
            total: sessionQuestions.length,
            disciplina: disciplina ?? subject ?? undefined,
            capitulo: moduloParam ?? undefined,
            accuracy:
              sessionQuestions.length > 0
                ? Math.round((correctAnswers / sessionQuestions.length) * 100)
                : 0,
            tempoSegundos: Math.round((Date.now() - sessionStartRef.current) / 1000),
          }}
          myAvatarId={(profile as unknown as { avatar_id?: number })?.avatar_id ?? 1}
        />
      )}
    </div>
  );
}