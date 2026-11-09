'use client';

import { useState } from 'react';
import { Question } from '@/lib/questions';

interface QuestionModalProps {
  question: Question;
  onClose: () => void;
  onSubmit: (questionId: string, userAnswer: string, isCorrect: boolean, quality: number) => void;
  isLoading: boolean;
}

const LETTER_LABELS = ['A', 'B', 'C', 'D', 'E'];

function playSound(type: 'correct' | 'error') {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'correct') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.setValueAtTime(140, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch {}
}

export function QuestionModal({ question, onClose, onSubmit, isLoading }: QuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const isTrueFalse = question.type === 'verdadeiro_falso';
  const options = isTrueFalse ? ['Verdadeiro', 'Falso'] : (question.options ?? []);

  const diffCfg = {
    fácil: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    médio: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    difícil: 'bg-red-500/15 text-red-400 border-red-500/30',
  }[question.difficulty ?? ''] ?? 'bg-slate-700/50 text-slate-400 border-slate-600';

  const handleSubmit = () => {
    if (!selectedAnswer || showResult) return;
    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    if (soundEnabled) playSound(correct ? 'correct' : 'error');
    setTimeout(() => {
      onSubmit(question.id, selectedAnswer, correct, correct ? 5 : 0);
    }, 1400);
  };

  return (
    <div className="bg-slate-900 border border-white/8 rounded-2xl overflow-hidden">
      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .anim-up{animation:slideUp 0.22s ease-out forwards;}
      `}</style>

      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${diffCfg}`}>
              {question.difficulty}
            </span>
            {question.chapter && (
              <span className="text-slate-600 text-xs truncate">Cap. {question.chapter}</span>
            )}
          </div>
          <h2 className="text-lg font-bold text-white leading-relaxed">{question.question}</h2>
        </div>
        <button
          onClick={() => setSoundEnabled(s => !s)}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-400 hover:bg-slate-800 transition mt-0.5"
          title={soundEnabled ? 'Desativar som' : 'Ativar som'}
        >
          {soundEnabled ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          )}
        </button>
      </div>

      {/* Tip */}
      {question.tip && (
        <div className="px-5 pb-3">
          <button
            onClick={() => setShowTip(s => !s)}
            className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            💡 {showTip ? 'Ocultar dica' : 'Ver dica'}
          </button>
          {showTip && (
            <p className="mt-2 text-sm text-yellow-300/80 bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-3 leading-relaxed anim-up">
              {question.tip}
            </p>
          )}
        </div>
      )}

      {/* Options */}
      <div className={`px-5 pb-4 ${isTrueFalse ? 'grid grid-cols-2 gap-2.5' : 'flex flex-col gap-2'}`}>
        {options.map((opt, idx) => {
          const letter = isTrueFalse ? null : LETTER_LABELS[idx];
          const isSelected = selectedAnswer === opt;
          const isThisCorrect = opt === question.correctAnswer;
          const isThisWrong = showResult && isSelected && !isThisCorrect;

          let cls = '';
          if (showResult) {
            if (isThisCorrect) cls = 'bg-emerald-500/15 border-emerald-500 text-emerald-200';
            else if (isThisWrong) cls = 'bg-red-500/15 border-red-500 text-red-300';
            else cls = 'bg-slate-800/40 border-slate-700/50 text-slate-600';
          } else if (isSelected) {
            cls = 'bg-blue-500/15 border-blue-400 text-white scale-[1.01]';
          } else {
            cls = 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500 active:scale-[0.99]';
          }

          return (
            <button
              key={opt}
              onClick={() => !showResult && setSelectedAnswer(opt)}
              disabled={showResult}
              className={`w-full rounded-xl border-2 font-semibold text-sm transition-all duration-150 flex items-center gap-3 ${
                isTrueFalse ? 'py-4 justify-center' : 'py-3.5 px-4 text-left'
              } ${cls}`}
            >
              {letter && (
                <span className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                  showResult
                    ? isThisCorrect ? 'bg-emerald-500 text-slate-950' : isThisWrong ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-500'
                    : isSelected ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {letter}
                </span>
              )}
              <span className="leading-snug">{opt}</span>
              {showResult && isThisCorrect && <span className="ml-auto text-emerald-400">✓</span>}
              {showResult && isThisWrong && <span className="ml-auto text-red-400">✕</span>}
            </button>
          );
        })}
      </div>

      {/* Result */}
      {showResult && (
        <div className={`mx-5 mb-4 rounded-xl border-2 p-4 anim-up ${isCorrect ? 'bg-emerald-950/60 border-emerald-500/50' : 'bg-red-950/60 border-red-500/50'}`}>
          <p className={`font-black text-base ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
            {isCorrect ? '✅ Correto!' : '❌ Resposta errada'}
          </p>
          {!isCorrect && (
            <p className="text-slate-300 text-sm mt-1">
              Resposta certa: <span className="font-bold text-emerald-400">{question.correctAnswer}</span>
            </p>
          )}
        </div>
      )}

      {/* Submit button */}
      <div className="px-5 pb-5">
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer || showResult || isLoading}
          className={`w-full py-3.5 font-black rounded-xl transition-all text-base ${
            showResult
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : selectedAnswer && !isLoading
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-[0.98] shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Carregando…' : showResult ? 'Próxima questão…' : 'Confirmar resposta'}
        </button>
      </div>
    </div>
  );
}
