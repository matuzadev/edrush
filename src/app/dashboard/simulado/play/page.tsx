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
}

// Mock de questões por disciplina
const QUESTIONS_BY_DISCIPLINE: Record<string, Question[]> = {
  'portugues': [
    {
      id: '1',
      text: 'Qual é o sujeito da oração: "O gato subiu no telhado"?',
      options: ['O gato', 'no telhado', 'subiu', 'gato'],
      correctAnswer: 0
    },
    {
      id: '2',
      text: 'Indique o verbo na frase: "Maria dança graciosamente".',
      options: ['Maria', 'dança', 'graciosamente', 'na'],
      correctAnswer: 1
    }
  ],
  'redes-computadores': [
    {
      id: '1',
      text: 'Qual é a principal função do protocolo TCP?',
      options: ['Roteamento de pacotes', 'Garantir entrega ordenada de dados', 'Resolução de nomes de domínio', 'Encriptação de dados'],
      correctAnswer: 1
    },
    {
      id: '2',
      text: 'Qual camada do modelo OSI é responsável pelo roteamento?',
      options: ['Camada 2', 'Camada 3', 'Camada 4', 'Camada 7'],
      correctAnswer: 1
    }
  ],
  'informatica-basica': [
    {
      id: '1',
      text: 'Qual é a unidade básica de armazenamento de dados?',
      options: ['Bit', 'Byte', 'Megabyte', 'Gigabyte'],
      correctAnswer: 0
    }
  ]
};

export default function SimuladoPlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const disciplineId = searchParams.get('discipline') || 'portugues';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const startedAtRef = useRef<string>(new Date().toISOString());
  const startedTsRef = useRef<number>(Date.now());
  const questionStartRef = useRef<number>(Date.now());
  const finishedRef = useRef<boolean>(false);

  useEffect(() => {
    const disciplineQuestions = QUESTIONS_BY_DISCIPLINE[disciplineId] || QUESTIONS_BY_DISCIPLINE['portugues'];
    setQuestions(disciplineQuestions);
    startedAtRef.current = new Date().toISOString();
    startedTsRef.current = Date.now();
    questionStartRef.current = Date.now();
    finishedRef.current = false;
  }, [disciplineId]);

  // Reinicia o cronômetro a cada questão
  useEffect(() => {
    questionStartRef.current = Date.now();
  }, [currentIndex]);

  const persistAnswer = (questionIndex: number, optionIndex: number) => {
    const q = questions[questionIndex];
    if (!q) return;
    const correct = optionIndex === q.correctAnswer;
    const skipped = optionIndex === -1;
    const tempo_resposta_ms = Date.now() - questionStartRef.current;
    fetch('/api/questions/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: q.id,
        resposta_dada: skipped ? '__skipped__' : (q.options[optionIndex] ?? ''),
        acertou: correct,
        tempo_resposta_ms,
        disciplina: disciplineId,
        subject: disciplineId,
        origem: 'simulado',
        origem: 'simulado',
      }),
    }).catch(err => console.error('Falha ao salvar resposta do simulado:', err));
  };

  const finishSimulado = (allAnswers: number[]) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const correct = allAnswers.filter((ans, idx) => ans === questions[idx]?.correctAnswer).length;
    const skipped = allAnswers.filter(a => a === -1).length;
    fetch('/api/simulado/finish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discipline: disciplineId,
        totalQuestions: questions.length,
        correctAnswers: correct,
        skipped,
        durationMs: Date.now() - startedTsRef.current,
        startedAt: startedAtRef.current,
      }),
    }).catch(err => console.error('Falha ao salvar simulado:', err));
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers, optionIndex];
    setUserAnswers(newAnswers);
    setShowResult(true);
    persistAnswer(currentIndex, optionIndex);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
    } else {
      finishSimulado(userAnswers);
      setIsFinished(true);
    }
  };

  const handleSkip = () => {
    const newAnswers = [...userAnswers, -1];
    setUserAnswers(newAnswers);
    persistAnswer(currentIndex, -1);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
    } else {
      finishSimulado(newAnswers);
      setIsFinished(true);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
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
        <div className="flex gap-3">
          {!showResult ? (
            <>
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={handleSkip}
              >
                <SkipForward className="w-4 h-4" />
                Pular
              </Button>
              <Button 
                className="flex-1"
                onClick={() => {
                  // Simular clique em opção aleatória se não responder
                  setShowResult(true);
                }}
              >
                Responder
              </Button>
            </>
          ) : (
            <Button 
              className="w-full"
              onClick={handleNext}
            >
              {currentIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}