"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Question, MOCK_QUESTIONS } from '@/lib/questions';
import subjects from '@/data/subjects.json';

export default function ChapterPage({ params }: { params: { subject: string; id: string } }) {
  const { subject, id } = params as { subject: string; id: string };
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chapterTitle, setChapterTitle] = useState('');
  const router = useRouter();

  useEffect(() => {
    const subj = (subjects as any)[subject];
    if (!subj) {
      router.replace('/dashboard');
      return;
    }
    const chap = subj.chapters.find((c: any) => String(c.id) === String(id));
    if (!chap) { router.replace('/dashboard'); return; }
    setChapterTitle(chap.title);

    // Load from local storage or fallback to MOCK_QUESTIONS
    try {
      const raw = localStorage.getItem('local_questions_v1');
      const list = raw ? JSON.parse(raw) : MOCK_QUESTIONS;
      // Filter by subject and chapter
      const filtered = list.filter(q => q.subject === subj.title && Number(q.chapter) === Number(id));
      setQuestions(filtered);
    } catch (e) {
      setQuestions(MOCK_QUESTIONS.filter(q => q.subject === subj.title && Number(q.chapter) === Number(id)));
    }
  }, [subject, id, router]);

  async function getTokenForQuestion(questionId: string) {
    try {
      const res = await fetch('/api/question-token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionId }) });
      if (!res.ok) throw new Error('token failed');
      const json = await res.json();
      return json.token as string;
    } catch (e) { console.error(e); return null; }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{(subjects as any)[subject].title} — Capítulo {id} • {chapterTitle}</h1>

        {questions.length === 0 ? (
          <div className="p-6 bg-slate-900/60 rounded">Nenhuma questão cadastrada neste capítulo.</div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="p-4 bg-slate-900/50 rounded flex justify-between items-center">
                <div>
                  <div className="text-sm text-slate-400">{q.difficulty} • {q.type}</div>
                  <div className="text-white font-medium">{q.question}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={async () => { const t = await getTokenForQuestion(q.id); alert(`Token: ${t}`); }} className="px-3 py-2 bg-emerald-500 rounded">Gerar Chamada Segura</button>
                  <a href={`/questions`} className="px-3 py-2 bg-slate-800 rounded border">Estudar</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
