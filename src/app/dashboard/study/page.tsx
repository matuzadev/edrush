'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionGuard } from '@/components/SubscriptionGuard';
import { Question, MOCK_QUESTIONS } from '@/lib/questions';
import { QuestionModal } from '@/components/QuestionModal';
import { usUserProfile } from '@/hooks/useProfile';
import { LogOut, ChevronLeft, Trophy, Target, BookOpen, X } from 'lucide-react';

export default function StudyPage() {
  return (
    <SubscriptionGuard>
      <StudyPageContent />
    </SubscriptionGuard>
  );
}

function StudyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signOut, isLoading } = useAuth();
  const { profile, addCorrectAnswer, addIncorrectAnswer, completeChapter } = usUserProfile();
  
  // Pegar Matéria da URL (ex: ?subject=portugues)
  const subject = searchParams.get('subject');

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push('/auth/login');
  }, [user, isLoading, router]);

  // load questions from LocalStorage (local manager)
  useEffect(() => {
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
  }, []);

  // Filtrar questões baseadas na Matéria Escolhida
  useEffect(() => {
    const filtered = allQuestions.filter(q => q.subject === subject);
    setSessionQuestions(filtered);
    setCurrentQuestionIndex(0);
  }, [subject, allQuestions]);

  const handleQuestionSubmit = async (questionId: string, userAnswer: string, isCorrect: boolean, quality: number) => {
    setIsSubmitting(true);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      // Adicionar a questão acertada ao perfil
      addCorrectAnswer(questionId);
    } else {
      addIncorrectAnswer();
    }

    // Simular salvamento
    setTimeout(() => {
      if (currentQuestionIndex < sessionQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        completeChapter();
        setIsFinished(true);
      }
      setIsSubmitting(false);
    }, 400);
  };

  if (isLoading || !user || sessionQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
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
                <p className="text-blue-400 text-3xl font-black">+{sessionQuestions.length * 10}</p>
                <p className="text-slate-500 text-xs uppercase font-bold">XP Ganho</p>
              </div>
            </div>

            <Link 
              href="/dashboard/trilha"
              className="inline-block w-full max-w-sm py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-[0_4px_0_rgb(16,185,129)] active:shadow-none active:translate-y-1 transition-all"
            >
              CONTINUAR
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}