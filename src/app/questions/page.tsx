"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Zap, BookOpen, Trophy, RotateCcw } from 'lucide-react';
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
    <main className="min-h-screen bg-[#0d1411] text-[#f3f5f1]">
      <header className="border-b border-white/10">
        <nav
          aria-label="Navegação principal"
          className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-5 sm:px-8"
        >
          <Link
            href="/"
            aria-label="EdRush — página inicial"
            className="inline-flex items-center gap-2 text-xl font-bold tracking-tight no-underline"
          >
            <Zap className="fill-emerald-500 text-emerald-500" size={23} aria-hidden="true" />
            <span>
              Ed<span className="text-emerald-500">Rush</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-[#d3d8d3] transition hover:text-white"
            >
              Entrar
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold text-[#06251b] transition hover:bg-emerald-400"
            >
              Criar conta
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Questões</h1>
          <div className="flex items-center gap-2 text-sm text-[#b3bbb5]">
            <Trophy className="text-emerald-500" size={16} aria-hidden="true" />
            Pontuação: <span className="font-bold text-emerald-500">{score}</span>
          </div>
        </header>

        <div className="mb-6 h-3 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>

        {!current ? (
          <div className="rounded-2xl border border-[#dedbd0]/20 bg-white/[0.03] p-8 text-center">
            <BookOpen className="mx-auto mb-4 text-[#87938a]" size={32} aria-hidden="true" />
            <p className="text-[#d6ddd7] font-semibold">Sem questões disponíveis.</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#dedbd0]/20 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/[0.05]"
            >
              Voltar ao início
            </Link>
          </div>
        ) : (
          <article className="rounded-2xl border border-[#dedbd0]/20 bg-white/[0.03] p-6 sm:p-8">
            <div className="mb-4 text-sm text-[#b3bbb5]">{current.subject} • Cap. {current.chapter} • {current.difficulty}</div>
            <h2 className="text-lg font-semibold text-white mb-6">{current.question}</h2>

            {current.type === 'multipla' ? (
              <div className="grid grid-cols-1 gap-3">
                {(current.options || []).slice(0,5).map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt)} className="text-left px-4 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-[#dedbd0]/20 hover:border-emerald-500/40 rounded-xl transition">{String.fromCharCode(65+i)}. <span className="ml-2">{opt}</span></button>
                ))}
              </div>
            ) : current.type === 'verdadeiro_falso' ? (
              <div className="flex gap-3">
                <button onClick={() => handleAnswer('Verdadeiro')} className="flex-1 px-4 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-[#dedbd0]/20 hover:border-emerald-500/40 rounded-xl transition">Verdadeiro</button>
                <button onClick={() => handleAnswer('Falso')} className="flex-1 px-4 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-[#dedbd0]/20 hover:border-emerald-500/40 rounded-xl transition">Falso</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input placeholder="Digite sua resposta (discursiva)" className="px-4 py-3.5 bg-white/[0.04] border border-[#dedbd0]/20 rounded-xl outline-none focus:border-emerald-500/50" onKeyDown={(e)=>{ if (e.key==='Enter') handleAnswer((e.target as HTMLInputElement).value); }} />
                <button onClick={() => {/* no-op */}} className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#06251b] font-bold rounded-xl transition">Enviar</button>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button onClick={() => setShowTip(s => !s)} className="text-sm text-[#b3bbb5] hover:text-emerald-500 transition">{showTip ? 'Esconder dica' : 'Mostrar dica'}</button>
              <div className="text-sm text-[#b3bbb5]">{currentIndex + 1} / {questions.length}</div>
            </div>

            {showTip && current.tip && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-sm text-emerald-300">{current.tip}</p>
              </div>
            )}
          </article>
        )}

        <footer className="mt-8 flex justify-between items-center text-sm text-[#b3bbb5]">
          <div>Modo: A,B,C,D,E • V/F</div>
          <div>
            <button
              onClick={() => { setCurrentIndex(0); setScore(0); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-[#dedbd0]/20 rounded-xl transition"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Reiniciar
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
