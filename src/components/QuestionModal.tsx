'use client';

import { useState, useEffect, useRef } from 'react';
import { Question } from '@/lib/questions';
import { Volume2, VolumeX, Lightbulb } from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  onClose: () => void;
  onSubmit: (questionId: string, userAnswer: string, isCorrect: boolean, quality: number) => void;
  isLoading: boolean;
}

export function QuestionModal({
  question,
  onClose,
  onSubmit,
  isLoading,
}: QuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const playSound = (type: 'correct' | 'error') => {
    if (!isSoundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      if (type === 'correct') {
        // Som de sucesso - frequências crescentes
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else {
        // Som de erro - frequência única descendente
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (e) {
      console.log('Som não disponível');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return;

    let correct = false;

    if (question.type === 'verdadeiro_falso') {
      correct = selectedAnswer === question.correctAnswer;
    } else if (question.type === 'multipla') {
      correct = selectedAnswer === question.correctAnswer;
    }

    setIsCorrect(correct);
    playSound(correct ? 'correct' : 'error');
    setShowResult(true);

    // Esperar um pouco antes de submeter
    setTimeout(() => {
      onSubmit(question.id, selectedAnswer, correct, correct ? 5 : 0);
    }, 1500);
  };

  const renderOptions = () => {
    if (question.type === 'verdadeiro_falso') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {['Verdadeiro', 'Falso'].map((option) => (
            <button
              key={option}
              onClick={() => !showResult && setSelectedAnswer(option)}
              disabled={showResult}
              className={`py-3 px-4 rounded-lg font-bold transition-all transform ${
                selectedAnswer === option
                  ? 'bg-emerald-500 text-white border-2 border-emerald-600 scale-105'
                  : 'bg-slate-800 text-slate-300 border-2 border-white/10 hover:border-emerald-500'
              } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'} ${
                showResult && option === question.correctAnswer
                  ? 'ring-4 ring-emerald-500/50 bg-emerald-600 animate-pulse'
                  : showResult && selectedAnswer === option && !isCorrect
                    ? 'ring-4 ring-red-500/50 bg-red-600 animate-pulse'
                    : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      );
    }

    if (question.type === 'multipla' && question.options) {
      const letterOptions = ['A', 'B', 'C', 'D', 'E'];
      return (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(option)}
              disabled={showResult}
              className={`w-full p-4 rounded-lg text-left font-medium transition-all transform border-2 ${
                selectedAnswer === option
                  ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                  : 'bg-slate-800 text-slate-300 border-white/10 hover:border-emerald-500'
              } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'} ${
                showResult && option === question.correctAnswer
                  ? 'ring-4 ring-emerald-500/50 bg-emerald-600 animate-pulse'
                  : showResult && selectedAnswer === option && !isCorrect
                    ? 'ring-4 ring-red-500/50 bg-red-600 animate-pulse'
                    : ''
              }`}
            >
              <span className="font-bold mr-3">{letterOptions[index]}.</span>
              {option}
            </button>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header com som */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              question.difficulty === 'fácil' ? 'bg-emerald-500/20 text-emerald-400' :
              question.difficulty === 'médio' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {question.difficulty}
            </span>
            <span className="text-slate-400 text-xs">Capítulo {question.chapter}</span>
          </div>
          <h2 className="text-2xl font-black text-white">{question.question}</h2>
        </div>
        <button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-emerald-400 transition flex-shrink-0"
          title={isSoundEnabled ? 'Som ativado' : 'Som desativado'}
        >
          {isSoundEnabled ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Dica */}
      {question.tip && (
        <div>
          <button
            onClick={() => setShowTip(!showTip)}
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold transition"
          >
            <Lightbulb className="w-4 h-4" />
            {showTip ? 'Ocultar dica' : 'Ver dica'}
          </button>
          {showTip && (
            <div className="mt-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 italic animate-in fade-in duration-200">
              💡 {question.tip}
            </div>
          )}
        </div>
      )}

      {/* Opções */}
      <div className="space-y-4">{renderOptions()}</div>

      {/* Resultado */}
      {showResult && (
        <div
          className={`p-6 rounded-xl font-bold text-lg transition-all animate-in zoom-in-95 duration-300 border-2 ${
            isCorrect
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20'
              : 'bg-red-500/20 border-red-500 text-red-300 shadow-lg shadow-red-500/20'
          }`}
        >
          {isCorrect ? (
            <div>
              <p className="text-2xl mb-2">✓ Parabéns!</p>
              <p className="text-sm font-normal">Você acertou! Resposta: {question.correctAnswer}</p>
            </div>
          ) : (
            <div>
              <p className="text-2xl mb-2">✗ Errou!</p>
              <p className="text-sm font-normal">Sua resposta: {selectedAnswer}</p>
              <p className="text-sm font-normal mt-1">Resposta correta: {question.correctAnswer}</p>
            </div>
          )}
        </div>
      )}

      {/* Botão */}
      <button
        onClick={handleSubmitAnswer}
        disabled={!selectedAnswer || showResult || isLoading}
        className={`w-full py-3 font-bold rounded-lg transition-all transform ${
          showResult
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer active:scale-95 shadow-lg hover:shadow-emerald-500/50'
        }`}
      >
        {isLoading ? 'Carregando...' : showResult ? 'Próxima questão' : 'Responder'}
      </button>
    </div>
  );
}
