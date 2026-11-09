'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, CheckCircle, XCircle, SkipForward } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  subject: string;
}

interface QuestionApiResult {
  id: string;
  question: string;
  subject: string;
  type: string;
  options: unknown;
  correctAnswer: string;
}

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function toSimuladoQuestion(question: QuestionApiResult): Question | null {
  const rawOptions = Array.isArray(question.options)
    ? question.options
    : ['verdadeiro_falso', 'true_false'].includes(question.type.toLowerCase())
      ? ['Verdadeiro', 'Falso']
      : [];
  if (rawOptions.length < 2) return null;
  const options = rawOptions.map(String);
  const answer = question.correctAnswer.trim();
  const letter = answer.match(/^([A-E])(?:[).]\s*|$)/i)?.[1]?.toUpperCase();
  let correctAnswer = letter ? letter.charCodeAt(0) - 65 : -1;

  if (correctAnswer < 0 || correctAnswer >= options.length) {
    const normalizedAnswer = normalizeAnswer(answer);
    correctAnswer = options.findIndex((option, index) => {
      const normalizedOption = normalizeAnswer(option).replace(/^[a-e][).]\s*/, '');
      return normalizedOption === normalizedAnswer ||
        normalizeAnswer(option).startsWith(`${normalizedAnswer}) `);
    });
  }

  if (correctAnswer < 0 || correctAnswer >= options.length) return null;
  return {
    id: question.id,
    text: question.question,
    options,
    correctAnswer,
    subject: question.subject,
  };
}

export default function SimuladoPlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const disciplineId = searchParams.get('discipline') ?? '';
  const contestId = searchParams.get('concurso_id');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const startedAtRef = useRef<string>(new Date().toISOString());
  const startedTsRef = useRef<number>(Date.now());
  const questionStartRef = useRef<number>(Date.now());
  const finishedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!disciplineId) {
      router.replace('/dashboard/simulado');
      return;
    }
    const controller = new AbortController();
    const params = new URLSearchParams({
      disciplina: disciplineId,
      limit: '100',
      includeAnswered: '1',
      random: '1',
    });
    if (contestId) params.set('concurso_id', contestId);

    setIsLoading(true);
    setLoadError(null);
    fetch(`/api/questions?${params.toString()}`, { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? 'Não foi possível carregar as questões.');
        const loaded = (result.questions as QuestionApiResult[])
          .map(toSimuladoQuestion)
          .filter((question): question is Question => question !== null);
        if (loaded.length === 0) {
          throw new Error('Não há questões válidas cadastradas para esta disciplina.');
        }
        setQuestions(loaded);
        setCurrentIndex(0);
        setUserAnswers([]);
        setShowResult(false);
        setIsFinished(false);
        setSaveError(null);
        startedAtRef.current = new Date().toISOString();
        startedTsRef.current = Date.now();
        questionStartRef.current = Date.now();
        finishedRef.current = false;
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar as questões.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [disciplineId, contestId, router]);

  // Reinicia o cronômetro a cada questão
  useEffect(() => {
    questionStartRef.current = Date.now();
  }, [currentIndex]);

  const persistAnswer = async (questionIndex: number, optionIndex: number) => {
    const q = questions[questionIndex];
    if (!q) return;
    const correct = optionIndex === q.correctAnswer;
    const skipped = optionIndex === -1;
    const tempo_resposta_ms = Date.now() - questionStartRef.current;
    const response = await fetch('/api/questions/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: q.id,
        resposta_dada: skipped ? '__skipped__' : (q.options[optionIndex] ?? ''),
        acertou: correct,
        tempo_resposta_ms,
        disciplina: q.subject,
        subject: q.subject,
        origem: 'simulado',
      }),
    });
    if (!response.ok) throw new Error('Não foi possível salvar sua resposta.');
  };

  const finishSimulado = async (allAnswers: number[]) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const correct = allAnswers.filter((ans, idx) => ans === questions[idx]?.correctAnswer).length;
    const skipped = allAnswers.filter(a => a === -1).length;
    try {
      const response = await fetch('/api/simulado/finish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discipline: questions[0]?.subject ?? disciplineId,
        totalQuestions: questions.length,
        correctAnswers: correct,
        skipped,
        durationMs: Date.now() - startedTsRef.current,
        startedAt: startedAtRef.current,
      }),
      });
      if (!response.ok) throw new Error('O resultado não pôde ser salvo no banco de dados.');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'O resultado não pôde ser salvo.');
    } finally {
      setIsFinished(true);
    }
  };

  const handleAnswer = async (optionIndex: number) => {
    if (showResult || isSavingAnswer) return;
    const newAnswers = [...userAnswers, optionIndex];
    setUserAnswers(newAnswers);
    setShowResult(true);
    setIsSavingAnswer(true);
    try {
      await persistAnswer(currentIndex, optionIndex);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Sua resposta não foi salva.');
    } finally {
      setIsSavingAnswer(false);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
    } else {
      await finishSimulado(userAnswers);
    }
  };

  const handleSkip = async () => {
    if (isSavingAnswer) return;
    const newAnswers = [...userAnswers, -1];
    setUserAnswers(newAnswers);
    setIsSavingAnswer(true);
    try {
      await persistAnswer(currentIndex, -1);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Sua resposta não foi salva.');
    } finally {
      setIsSavingAnswer(false);
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
    } else {
      await finishSimulado(newAnswers);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  if (loadError || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] px-4 flex items-center justify-center text-center">
        <div>
          <p className="text-slate-200">{loadError ?? 'Nenhuma questão disponível.'}</p>
          <Button variant="secondary" className="mt-5" onClick={() => router.push('/dashboard/simulado')}>
            Voltar aos simulados
          </Button>
        </div>
      </div>
    );
  }
  const currentQuestion = questions[currentIndex];
  const currentAnswer = userAnswers[currentIndex];
  const isAnswerCorrect = currentAnswer === currentQuestion.correctAnswer;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const correctCount = userAnswers.filter((ans, idx) => ans === questions[idx]?.correctAnswer).length;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        {/* Header */}
        <div className="px-4 py-4 md:px-6">
          <Link 
            href="/dashboard/simulado"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar ao Simulado
          </Link>
        </div>

        {/* Resultado Final */}
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-2">Simulado Finalizado!</h1>
            <p className="text-slate-400 mb-8">Confira seu desempenho abaixo</p>

            {/* Pontuação */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-white/10 rounded-lg p-8 mb-8">
              <p className="text-slate-400 text-sm mb-2">Sua Pontuação</p>
              <p className="text-5xl font-bold text-emerald-400 mb-4">
                {correctCount}/{questions.length}
              </p>
              <p className="text-slate-300 text-sm">
                {Math.round((correctCount / questions.length) * 100)}% de acerto
              </p>
            </div>

            {/* Análise */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-emerald-400 text-2xl font-bold">{correctCount}</p>
                <p className="text-xs text-slate-400 mt-1">Corretas</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-red-400 text-2xl font-bold">{questions.length - correctCount}</p>
                <p className="text-xs text-slate-400 mt-1">Incorretas</p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => router.push('/dashboard/simulado')}
              >
                Voltar
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setCurrentIndex(0);
                  setUserAnswers([]);
                  setShowResult(false);
                  setIsFinished(false);
                  startedAtRef.current = new Date().toISOString();
                  startedTsRef.current = Date.now();
                  questionStartRef.current = Date.now();
                  finishedRef.current = false;
                }}
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-12">
      {/* Header com Progresso */}
      <div className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-sm border-b border-white/10 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/dashboard/simulado"
              className="text-slate-400 hover:text-emerald-400 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm font-medium text-slate-400">
              Questão {currentIndex + 1} de {questions.length}
            </span>
            <div className="w-6 h-6"></div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questão */}
      <div className="px-4 md:px-6 max-w-4xl mx-auto pt-12">
        {/* Enunciado */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Opções */}
        <div className="space-y-3 mb-12">
          {currentQuestion.options.map((option, index) => {
            const isSelected = currentAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showCorrect = showResult && isCorrect;
            const showIncorrect = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className={`
                  w-full p-4 rounded-lg text-left font-medium transition-all duration-300
                  border-2 flex items-start gap-3
                  ${
                    showCorrect
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : showIncorrect
                      ? 'bg-red-500/20 border-red-500 text-red-300'
                      : isSelected && !showResult
                      ? 'bg-slate-700 border-emerald-500 text-white'
                      : 'bg-slate-900/50 border-white/10 hover:border-white/30 text-slate-200 hover:text-white'
                  }
                  ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mt-0.5">
                  {showCorrect && <CheckCircle className="w-4 h-4" />}
                  {showIncorrect && <XCircle className="w-4 h-4" />}
                  {!showResult && <span className="text-xs">{String.fromCharCode(65 + index)}</span>}
                </div>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Resultado e Explicação */}
        {showResult && (
          <div className="mb-12 p-6 rounded-lg bg-white/5 border border-white/10 animate-in fade-in">
            <div className="flex items-center gap-3 mb-3">
              {isAnswerCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <span className="font-semibold text-emerald-400">Resposta correta!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-400" />
                  <span className="font-semibold text-red-400">Resposta incorreta</span>
                </>
              )}
            </div>
            <p className="text-slate-300 text-sm">
              A resposta correta é: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
            </p>
          </div>
        )}

        {/* Botões de Ação */}
        {saveError && (
          <p role="alert" className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-200">
            {saveError}
          </p>
        )}
        <div className="flex gap-3">
          {!showResult ? (
            <>
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={handleSkip}
                disabled={isSavingAnswer}
              >
                <SkipForward className="w-4 h-4" />
                Pular
              </Button>
              <Button 
                className="flex-1"
                disabled
              >
                Selecione uma alternativa
              </Button>
            </>
          ) : (
            <Button 
              className="w-full"
              onClick={handleNext}
              disabled={isSavingAnswer}
            >
              {currentIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}