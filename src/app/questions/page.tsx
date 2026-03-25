"use client";

import { useEffect, useMemo, useState } from 'react';
import { MOCK_QUESTIONS, Question } from '@/lib/questions';

const Q_KEY = 'local_questions_v1';
const PROGRESS_KEY = 'local_progress_v1';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [score, setScore] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '0'); } catch { return 0; }
  });

  // optional filters from URL
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const qSubject = searchParams.get('subject');
  const qChapter = searchParams.get('chapter');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(Q_KEY);
      const list = raw ? JSON.parse(raw) : MOCK_QUESTIONS;
      const filtered = list.filter((q: Question) => {
        if (qSubject && q.subject !== qSubject) return false;
        if (qChapter && String(q.chapter) !== String(qChapter)) return false;
        return true;
      });
      setQuestions(filtered.length ? filtered : list);
      if (!raw) localStorage.setItem(Q_KEY, JSON.stringify(MOCK_QUESTIONS));
    } catch (e) {
      setQuestions(MOCK_QUESTIONS);
    }
  }, [qSubject, qChapter]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(score));
  }, [score]);

  const current = questions[currentIndex];

  async function handleAnswer(answer: string) {
    if (!current) return;
    // generate token
    try {
      const tokenRes = await fetch('/api/question-token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionId: current.id }) });
      const tokenJson = await tokenRes.json();
      const token = tokenJson.token;

      const res = await fetch('/api/submit-answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, questionId: current.id, answer }) });
      const json = await res.json();
      if (json.isCorrect) setScore(s => s + 1);
    } catch (e) {
      console.error('answer failed', e);
    }

    // quick feedback: highlight and advance
    setTimeout(() => {
      setShowTip(false);
      setCurrentIndex(i => Math.min(i + 1, questions.length - 1));
    }, 700);
  }

  function normalize(s?: string) {
    return (s || '').toString().trim().toLowerCase();
  }

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((currentIndex) / questions.length) * 100);
  }, [currentIndex, questions.length]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Questões</h1>
          <div className="text-sm text-slate-400">Pontuação: <span className="font-bold text-white">{score}</span></div>
        </header>

        <div className="mb-4 h-3 bg-slate-800 rounded overflow-hidden">
          <div className="h-full bg-emerald-400 transition-all" style={{ width: `${progress}%` }} />
        </div>

        {!current ? (
          <div className="p-8 bg-slate-900/50 rounded-xl text-center">Sem questões disponíveis.</div>
        ) : (
          <article className="p-6 bg-slate-900/60 rounded-xl shadow-md">
            <div className="mb-4 text-sm text-slate-400">{current.subject} • Cap. {current.chapter} • {current.difficulty}</div>
            <h2 className="text-lg font-semibold text-white mb-4">{current.question}</h2>

            {current.type === 'multipla' ? (
              <div className="grid grid-cols-1 gap-3">
                {(current.options || []).slice(0,5).map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt)} className="text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg">{String.fromCharCode(65+i)}. <span className="ml-2">{opt}</span></button>
                ))}
              </div>
            ) : current.type === 'verdadeiro_falso' ? (
              <div className="flex gap-3">
                <button onClick={() => handleAnswer('Verdadeiro')} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg">Verdadeiro</button>
                <button onClick={() => handleAnswer('Falso')} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg">Falso</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input placeholder="Digite sua resposta (discursiva)" className="px-4 py-3 bg-slate-800 rounded-lg" onKeyDown={(e)=>{ if (e.key==='Enter') handleAnswer((e.target as HTMLInputElement).value); }} />
                <button onClick={() => {/* no-op */}} className="px-4 py-2 bg-emerald-500 rounded-lg">Enviar</button>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <button onClick={() => setShowTip(s => !s)} className="text-sm text-slate-400 hover:text-white">{showTip ? 'Esconder dica' : 'Mostrar dica'}</button>
              <div className="text-sm text-slate-400">{currentIndex + 1} / {questions.length}</div>
            </div>

            {showTip && current.tip && (
              <div className="mt-4 p-3 bg-slate-800 rounded">💡 <span className="text-slate-200">{current.tip}</span></div>
            )}
          </article>
        )}

        <footer className="mt-6 flex justify-between items-center text-sm text-slate-400">
          <div>Modo: A,B,C,D,E • V/F</div>
          <div>
            <button onClick={() => { setCurrentIndex(0); setScore(0); }} className="px-3 py-1 bg-slate-800 rounded">Reiniciar</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
