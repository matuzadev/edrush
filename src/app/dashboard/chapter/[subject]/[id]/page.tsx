"use client";

import { useEffect, useState, use, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import subjects from "@/data/subjects.json";
import studyTips from "@/data/study-tips.json";
import { LevelUpModal } from "@/components/LevelUpModal";
import { ShareResultModal } from "@/components/ShareResultModal";

const SLUG_MAP: Record<string, string> = {
  portugues: "lingua-portuguesa",
};

const MAX_LIVES = 3;

interface StudyMaterial {
  summary: string | null;
  topics: string[];
  strategy: string | null;
  references: { title: string; type: string; author: string }[];
  fullContent: string | null;
}

interface DBQuestion {
  id: string;
  question: string;
  subject: string;
  chapter: string;
  type: string;
  correctAnswer: string;
  explanation?: string;
  hint?: string;
  difficulty: string;
  options?: string[] | null;
  studyMaterial?: StudyMaterial | null;
}

interface StudyTip {
  quickReview: string;
  keyTopics: string[];
  references: { title: string; type: string; author: string }[];
  strategy: string;
}

type Difficulty = "todos" | "fácil" | "médio" | "difícil";
type Phase = "loading" | "lobby" | "fetching" | "playing" | "feedback" | "finished";

const DIFF_OPTIONS: { value: Difficulty; label: string; color: string; bg: string; border: string; icon: string }[] = [
  { value: "todos",   label: "Todos",   color: "text-slate-300", bg: "bg-slate-800",       border: "border-slate-600",      icon: "🎲" },
  { value: "fácil",  label: "Fácil",   color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/40", icon: "🟢" },
  { value: "médio",  label: "Médio",   color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/40",  icon: "🟡" },
  { value: "difícil",label: "Difícil", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/40",     icon: "🔴" },
];

const REF_ICONS: Record<string, string> = {
  livro: "📚",
  lei: "⚖️",
  apostila: "📄",
  video: "🎬",
  site: "🌐",
};

function playSound(type: "correct" | "wrong") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === "correct") {
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function extractLetter(option: string): string {
  const m = option.match(/^([A-E])\)/);
  return m ? m[1] : option;
}

const DIFFICULTY_CONFIG = {
  fácil:   { label: "Fácil",   cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  facil:   { label: "Fácil",   cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  médio:   { label: "Médio",   cls: "bg-yellow-500/15  text-yellow-400  border-yellow-500/30" },
  medio:   { label: "Médio",   cls: "bg-yellow-500/15  text-yellow-400  border-yellow-500/30" },
  difícil: { label: "Difícil", cls: "bg-red-500/15     text-red-400     border-red-500/30" },
  dificil: { label: "Difícil", cls: "bg-red-500/15     text-red-400     border-red-500/30" },
} as Record<string, { label: string; cls: string }>;

const LETTER_LABELS = ["A", "B", "C", "D", "E"];

export default function ChapterPage({
  params,
}: {
  params: Promise<{ subject: string; id: string }>;
}) {
  const { subject, id } = use(params);
  const router = useRouter();

  // Meta
  const [chapterTitle, setChapterTitle] = useState("");
  const [subjectTitle, setSubjectTitle] = useState("");
  const [tip, setTip] = useState<StudyTip | null>(null);
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>("todos");

  // Quiz state
  const [questions, setQuestions] = useState<DBQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [selected, setSelected] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [showComboFlair, setShowComboFlair] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);
  const [showStudyPanel, setShowStudyPanel] = useState(false);
  const [showShareResult, setShowShareResult] = useState(false);
  const questionStartTime = useRef<number>(Date.now());
  const [levelUpData, setLevelUpData] = useState<{
    level: number;
    levelInfo: { name: string; color: string; bg: string; border: string };
    xpEarned: number;
  } | null>(null);

  // Load metadata (no questions yet)
  useEffect(() => {
    const subj = (subjects as any)[subject];
    if (!subj) { router.replace("/dashboard"); return; }
    const chap = subj.chapters.find((c: any) => String(c.id) === String(id));
    setChapterTitle(chap?.title ?? "");
    setSubjectTitle(subj.title);

    const tipData = (studyTips as any)[subject] ?? (studyTips as any)[SLUG_MAP[subject]] ?? null;
    setTip(tipData);

    setPhase("lobby");
  }, [subject, id, router]);

  // Fetch questions — receives chapTitle as arg so it's stable (no stale closure on chapterTitle)
  const fetchQuestions = useCallback(async (diff: Difficulty, chapTitle: string) => {
    setPhase("fetching");
    const dbSlug = SLUG_MAP[subject] || subject;
    const diffParam = diff !== "todos" ? `&dificuldade=${encodeURIComponent(diff)}` : "";

    try {
      let res = await fetch(
        `/api/questions?disciplina=${encodeURIComponent(dbSlug)}&capitulo=${encodeURIComponent(chapTitle)}&limit=20${diffParam}`
      );
      let data = res.ok ? await res.json() : { questions: [] };

      // Fallback: whole discipline (same difficulty)
      if (!data.questions?.length) {
        res = await fetch(
          `/api/questions?disciplina=${encodeURIComponent(dbSlug)}&limit=60${diffParam}`
        );
        data = res.ok ? await res.json() : { questions: [] };
      }

      const pool: DBQuestion[] = data.questions ?? [];
      setQuestions(shuffle(pool).slice(0, 20));
    } catch {
      setQuestions([]);
    }

    setPhase("playing");
    questionStartTime.current = Date.now();
  }, [subject]);

  const handleStart = () => {
    setCurrent(0); setScore(0); setLives(MAX_LIVES); setCombo(0);
    setMaxCombo(0); setXp(0); setSelected(""); setShowHint(false);
    fetchQuestions(selectedDiff, chapterTitle);
  };

  const q = questions[current];
  const progress = questions.length ? current / questions.length : 0;

  const getOptions = useCallback(() => {
    if (!q) return [];
    const t = q.type;
    if (t === "verdadeiro_falso" || t === "verdadeiro-falso") return ["Verdadeiro", "Falso"];
    return q.options ?? [];
  }, [q]);

  const checkAnswer = useCallback((answer: string): boolean => {
    if (!q) return false;
    const t = q.type;
    if (t === "verdadeiro_falso" || t === "verdadeiro-falso") return answer === q.correctAnswer;
    return extractLetter(answer) === q.correctAnswer;
  }, [q]);

  const handleSelect = (opt: string) => {
    if (phase !== "playing") return;
    setSelected(opt);
  };

  const handleConfirm = useCallback(() => {
    if (!selected || phase !== "playing") return;
    const correct = checkAnswer(selected);
    const elapsedMs = Date.now() - questionStartTime.current;
    setIsCorrect(correct);

    if (correct) {
      const newCombo = combo + 1;
      const earnedXp = 20 + (newCombo >= 3 ? 10 : 0);
      setScore(s => s + 1);
      setCombo(newCombo);
      setMaxCombo(m => Math.max(m, newCombo));
      setXp(x => x + earnedXp);
      if (newCombo >= 3) {
        setShowComboFlair(true);
        setTimeout(() => setShowComboFlair(false), 1200);
      }
      if (soundEnabled) playSound("correct");
    } else {
      setCombo(0);
      setLives(l => Math.max(0, l - 1));
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
      if (soundEnabled) playSound("wrong");
    }

    fetch("/api/questions/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: q.id,
        resposta_dada: selected,
        acertou: correct,
        tempo_resposta_ms: elapsedMs,
        disciplina: q.subject,
        capitulo: q.chapter,
      }),
    }).catch(() => {});

    setPhase("feedback");
  }, [selected, phase, combo, soundEnabled, checkAnswer, q]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && phase === "playing" && selected) handleConfirm();
      if (e.key === "Enter" && phase === "feedback") handleNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, selected, handleConfirm]);

  const saveSession = useCallback(async (finalScore: number, total: number) => {
    try {
      const dbDisciplina = SLUG_MAP[subject] || subject;
      const res = await fetch("/api/study/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionsAnswered: total,
          correctAnswers: finalScore,
          subject,
          // Disciplina + título do capítulo permitem ao backend marcar
          // is_completed em user_chapter_progress quando ≥80% de acerto,
          // habilitando o "modo revisão" depois.
          disciplina: dbDisciplina,
          chapter: chapterTitle,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.leveledUp && data.levelInfo) {
          setLevelUpData({
            level: data.newLevel,
            levelInfo: data.levelInfo,
            xpEarned: data.xpEarned,
          });
          return; // Modal vai chamar setPhase("finished") via onClose
        }
      }
    } catch {
      // fire-and-forget se falhar
    }
  }, [subject, chapterTitle]);

  const handleNext = () => {
    if (lives <= 0 && !isCorrect) {
      saveSession(score, current + 1).then(() => setPhase("finished"));
      return;
    }
    if (current + 1 >= questions.length) {
      saveSession(score, questions.length).then(() => setPhase("finished"));
    } else {
      setCurrent(i => i + 1);
      setSelected("");
      setShowHint(false);
      setPhase("playing");
      setQuestionKey(k => k + 1);
      questionStartTime.current = Date.now();
    }
  };

  const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0;

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-800 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // ── Lobby (difficulty + study tips) ─────────────────────────────────────────
  if (phase === "lobby") {
    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col overflow-y-auto">
        <style>{`
          @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
          .anim-up{animation:slideUp 0.25s ease-out forwards;}
        `}</style>

        {/* Header */}
        <div className="shrink-0 flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/5">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.22 3.22a.75.75 0 011.06 0L8 6.94l3.72-3.72a.75.75 0 111.06 1.06L9.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L8 9.06l-3.72 3.72a.75.75 0 01-1.06-1.06L6.94 8 3.22 4.28a.75.75 0 010-1.06z"/>
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest truncate">{subjectTitle}</p>
            <p className="text-white font-bold text-sm truncate">{chapterTitle}</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-auto w-full px-4 py-6 flex flex-col gap-6">

          {/* Difficulty selector */}
          <div>
            <h2 className="text-white font-black text-lg mb-1">Escolha a dificuldade</h2>
            <p className="text-slate-500 text-sm mb-4">Selecione o nível das questões que serão apresentadas.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {DIFF_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedDiff(opt.value)}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 font-bold text-sm transition-all ${
                    selectedDiff === opt.value
                      ? `${opt.bg} ${opt.border} ${opt.color} scale-[1.02] shadow-lg`
                      : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div className="text-left">
                    <p className="font-black">{opt.label}</p>
                    <p className="text-xs opacity-60 font-normal">
                      {opt.value === "todos" ? "todas as questões" :
                       opt.value === "fácil" ? "conceitos básicos" :
                       opt.value === "médio" ? "nível intermediário" : "questões avançadas"}
                    </p>
                  </div>
                  {selectedDiff === opt.value && (
                    <span className="ml-auto text-base">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Study tips toggle */}
          {tip && (
            <div className="rounded-2xl border border-white/8 overflow-hidden">
              <button
                onClick={() => setShowStudyPanel(s => !s)}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-900 hover:bg-slate-800/80 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📖</span>
                  <span className="font-bold text-white text-sm">Material de estudos</span>
                  <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    {tip.references.length} refs
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-500 transition-transform ${showStudyPanel ? "rotate-180" : ""}`}
                  viewBox="0 0 16 16" fill="currentColor"
                >
                  <path d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"/>
                </svg>
              </button>

              {showStudyPanel && (
                <div className="bg-slate-900/50 border-t border-white/5 px-4 py-4 space-y-5 anim-up">

                  {/* Quick review */}
                  <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-3">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1.5">Resumo rápido</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{tip.quickReview}</p>
                  </div>

                  {/* Key topics */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">Tópicos mais cobrados</p>
                    <div className="flex flex-wrap gap-2">
                      {tip.keyTopics.map((t, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Strategy */}
                  <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-3">
                    <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1.5">💡 Estratégia de estudo</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{tip.strategy}</p>
                  </div>

                  {/* References */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">Referências</p>
                    <div className="space-y-2">
                      {tip.references.map((ref, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2.5"
                        >
                          <span className="text-lg shrink-0 mt-0.5">{REF_ICONS[ref.type] ?? "📌"}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-200 leading-snug">{ref.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{ref.author} · <span className="capitalize">{ref.type}</span></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Start button */}
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-base transition active:scale-[0.98] shadow-lg shadow-emerald-500/25"
          >
            Começar sessão →
          </button>
        </div>
      </div>
    );
  }

  // ── Fetching ─────────────────────────────────────────────────────────────────
  // NOTE: only check phase === "fetching", never block on !q —
  // empty questions must reach the "no questions" screen below.
  if (phase === "fetching") {
    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-800 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-slate-500 text-sm tracking-wide">Carregando questões…</p>
      </div>
    );
  }

  // ── No questions ─────────────────────────────────────────────────────────────
  if ((phase === "playing" || phase === "feedback") && !questions.length) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-4xl">📭</div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Nenhuma questão disponível</h2>
          <p className="text-slate-500 text-sm">
            {selectedDiff !== "todos"
              ? `Não há questões de nível "${selectedDiff}" cadastradas para este capítulo. Tente outra dificuldade.`
              : "Este capítulo ainda não tem questões cadastradas."}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {selectedDiff !== "todos" && (
            <button
              onClick={() => { setSelectedDiff("todos"); setPhase("lobby"); }}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-2xl font-bold text-slate-950 transition active:scale-95"
            >
              Tentar com todos os níveis
            </button>
          )}
          <button onClick={() => setPhase("lobby")} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-slate-300 transition active:scale-95">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // ── Finished ─────────────────────────────────────────────────────────────────
  if (phase === "finished") {
    const stars = accuracy >= 80 ? 3 : accuracy >= 50 ? 2 : 1;
    const medal = stars === 3 ? "🏆" : stars === 2 ? "🎯" : "💪";
    const headline = accuracy >= 80 ? "Excelente!" : accuracy >= 50 ? "Bom trabalho!" : "Continue praticando!";

    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center px-5 overflow-y-auto">
        <div className="w-full max-w-sm flex flex-col items-center gap-7 py-10">
          <div className="relative">
            <div className={`absolute inset-0 blur-3xl rounded-full opacity-40 ${stars === 3 ? "bg-yellow-400" : stars === 2 ? "bg-emerald-500" : "bg-blue-500"}`} />
            <div className="relative text-7xl">{medal}</div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black text-white">{headline}</h1>
            <p className="text-slate-400 mt-1 text-sm">{subjectTitle} — {chapterTitle}</p>
            {selectedDiff !== "todos" && (
              <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full border ${
                selectedDiff === "fácil"   ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                selectedDiff === "médio"  ? "bg-yellow-500/15  text-yellow-400  border-yellow-500/30" :
                                            "bg-red-500/15     text-red-400     border-red-500/30"
              }`}>
                Nível {selectedDiff}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <span key={s} className={`text-3xl transition-all ${s <= stars ? "opacity-100 scale-110" : "opacity-20 grayscale"}`}>⭐</span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <ResultStat label="Acertos" value={`${score}/${questions.length}`} color="emerald" icon="✓" />
            <ResultStat label="Precisão" value={`${accuracy}%`} color={accuracy >= 80 ? "emerald" : accuracy >= 50 ? "yellow" : "red"} icon="%" />
            <ResultStat label="XP Ganho" value={`+${xp}`} color="blue" icon="⚡" />
            <ResultStat label="Melhor combo" value={`×${maxCombo}`} color="purple" icon="🔥" />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base transition active:scale-[0.98] shadow-lg shadow-emerald-500/25"
            >
              Praticar novamente
            </button>
            <button
              onClick={() => setShowShareResult(true)}
              className="w-full py-4 rounded-2xl font-black text-base transition active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: '#ffffff',
                boxShadow: '0 10px 30px -8px rgba(6,182,212,0.40)',
              }}
            >
              📊 Compartilhar com amigo
            </button>
            <button
              onClick={() => setPhase("lobby")}
              className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-base transition active:scale-[0.98]"
            >
              Mudar dificuldade
            </button>
            <button
              onClick={() => router.back()}
              className="w-full py-3 text-slate-600 hover:text-slate-400 font-semibold text-sm transition"
            >
              Voltar ao capítulo
            </button>
          </div>
        </div>

        <ShareResultModal
          isOpen={showShareResult}
          onClose={() => setShowShareResult(false)}
          result={{
            accuracy,
            total: questions.length,
            correct: score,
            subject: subjectTitle || subject,
          }}
        />
      </div>
    );
  }

  // ── Playing / Feedback ────────────────────────────────────────────────────────
  const options = getOptions();
  const isTrueFalse = q.type === "verdadeiro_falso" || q.type === "verdadeiro-falso";
  const diffCfg = DIFFICULTY_CONFIG[q.difficulty?.toLowerCase()] ?? { label: q.difficulty, cls: "bg-slate-700 text-slate-300 border-slate-600" };

  return (
    <div className={`fixed inset-0 bg-[#020617] flex flex-col select-none ${shakeWrong ? "animate-shake" : ""}`}>
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
        .animate-shake{animation:shake 0.4s ease-in-out;}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .animate-slide-up{animation:slideUp 0.25s ease-out forwards;}
        @keyframes popIn{0%{opacity:0;transform:scale(0.85) translateY(8px)}70%{transform:scale(1.04)}100%{opacity:1;transform:scale(1) translateY(0)}}
        .animate-pop{animation:popIn 0.3s ease-out forwards;}
        @keyframes comboPop{0%{opacity:0;transform:scale(0.5) translateY(20px)}50%{opacity:1;transform:scale(1.3) translateY(-8px)}100%{opacity:0;transform:scale(1) translateY(-24px)}}
        .animate-combo-flair{animation:comboPop 1.1s ease-out forwards;}
        @keyframes xpBump{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
      `}</style>

      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-4 pt-4 pb-3">
        <button
          onClick={() => setPhase("lobby")}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition"
          aria-label="Fechar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.22 3.22a.75.75 0 011.06 0L8 6.94l3.72-3.72a.75.75 0 111.06 1.06L9.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L8 9.06l-3.72 3.72a.75.75 0 01-1.06-1.06L6.94 8 3.22 4.28a.75.75 0 010-1.06z"/>
          </svg>
        </button>
        <div className="flex-1 relative h-3.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(1, progress * 100)}%` }}
          />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} className={`text-base leading-none transition-all ${i < lives ? "opacity-100" : "opacity-20 grayscale"}`}>❤️</span>
          ))}
        </div>
        <button
          onClick={() => setSoundEnabled(s => !s)}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-400 transition"
        >
          {soundEnabled
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          }
        </button>
      </div>

      {/* Question area */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="max-w-xl mx-auto w-full flex flex-col gap-5 pt-4 pb-4" key={questionKey}>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
              Questão {current + 1} de {questions.length}
            </span>
            <div className="flex items-center gap-3">
              {combo >= 2 && (
                <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/25 px-2.5 py-0.5 rounded-full">
                  🔥 ×{combo}
                </span>
              )}
              <span
                key={xp}
                className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2.5 py-0.5 rounded-full"
                style={{ animation: xp > 0 ? 'xpBump 0.4s ease-out' : undefined }}
              >
                ⚡ {xp} XP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${diffCfg.cls}`}>
              {diffCfg.label}
            </span>
            {q.chapter && <span className="text-slate-600 text-xs truncate max-w-[180px]">{q.chapter}</span>}
          </div>

          <div className="animate-slide-up">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">{q.question}</h2>
          </div>

          {/* Hint */}
          {q.hint && (
            <div>
              <button
                onClick={() => setShowHint(h => !h)}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition"
              >
                <span>💡</span> {showHint ? "Ocultar dica" : "Ver dica"}
              </button>
              {showHint && (
                <p className="mt-2 text-yellow-300/80 text-sm bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-3 leading-relaxed animate-slide-up">
                  {q.hint}
                </p>
              )}
            </div>
          )}

          {/* Study material shortcut during quiz — question-specific */}
          {phase === "playing" && (q?.studyMaterial || tip) && (
            <button
              onClick={() => setShowStudyPanel(s => !s)}
              className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              {showStudyPanel ? "Ocultar material" : "Ver material de estudos"}
            </button>
          )}

          {showStudyPanel && phase === "playing" && (
            <div className="relative rounded-2xl border border-white/8 overflow-hidden animate-slide-up">
              {/* top gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-cyan-400" />
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/40 p-4 space-y-3">
                {q?.studyMaterial ? (
                  <>
                    {/* Summary */}
                    {q.studyMaterial.summary && (
                      <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl px-3 py-2.5">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Conceito</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{q.studyMaterial.summary}</p>
                      </div>
                    )}

                    {/* Topics chips */}
                    {q.studyMaterial.topics?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {q.studyMaterial.topics.map((t: string, i: number) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Strategy */}
                    {q.studyMaterial.strategy && (
                      <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-3 py-2.5">
                        <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">Estratégia para a prova</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{q.studyMaterial.strategy}</p>
                      </div>
                    )}

                    {/* Full content expandable */}
                    {q.studyMaterial.fullContent && (
                      <details className="group">
                        <summary className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-300 cursor-pointer transition list-none">
                          <svg className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06L7.28 12.78a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"/>
                          </svg>
                          Conteúdo completo
                        </summary>
                        <div className="mt-2 text-xs text-slate-400 leading-relaxed whitespace-pre-line pl-1 border-l-2 border-slate-700 pl-3">
                          {q.studyMaterial.fullContent}
                        </div>
                      </details>
                    )}

                    {/* References */}
                    {q.studyMaterial.references?.length > 0 && (
                      <div className="pt-1 border-t border-white/5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Referências</p>
                        <div className="space-y-1.5">
                          {q.studyMaterial.references.map((ref: { title: string; type: string; author: string }, i: number) => (
                            <div key={i} className="flex items-start gap-2 bg-slate-800/50 rounded-lg px-2.5 py-2">
                              <span className="text-base shrink-0">{REF_ICONS[ref.type] ?? "📌"}</span>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-300 leading-snug">{ref.title}</p>
                                <p className="text-xs text-slate-500">{ref.author} · <span className="capitalize">{ref.type}</span></p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : tip ? (
                  /* Fallback to discipline-level tip if no question-specific material */
                  <>
                    <p className="text-xs text-slate-500 italic">Material geral da disciplina</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{tip.quickReview}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tip.keyTopics.map((t: string, i: number) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* Options */}
          <div className={`flex flex-col gap-2.5 ${isTrueFalse ? "grid grid-cols-2" : ""}`}>
            {options.map((opt, idx) => {
              const isSelected = selected === opt;
              const isAnswered = phase === "feedback";
              const isThisCorrect = isTrueFalse ? opt === q.correctAnswer : extractLetter(opt) === q.correctAnswer;
              const isThisWrong = isAnswered && isSelected && !isThisCorrect;
              const letter = isTrueFalse ? null : LETTER_LABELS[idx];

              let stateClass = "";
              if (isAnswered) {
                if (isThisCorrect) stateClass = "bg-emerald-500/15 border-emerald-500 text-emerald-200 shadow-[0_0_20px_-4px_rgba(16,185,129,0.35)]";
                else if (isThisWrong) stateClass = "bg-red-500/15 border-red-500 text-red-300";
                else stateClass = "bg-slate-800/40 border-slate-700/50 text-slate-600";
              } else if (isSelected) {
                stateClass = "bg-blue-500/15 border-blue-400 text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.35)] scale-[1.01]";
              } else {
                stateClass = "bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500 active:scale-[0.99]";
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={isAnswered}
                  className={`w-full rounded-2xl border-2 text-left font-semibold text-sm sm:text-base transition-all duration-150 animate-pop flex items-center gap-3 ${
                    isTrueFalse ? "py-5 justify-center text-center" : "py-3.5 px-4"
                  } ${stateClass}`}
                  style={{ animationDelay: `${idx * 45}ms` }}
                >
                  {letter && (
                    <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                      isAnswered ? isThisCorrect ? "bg-emerald-500 text-slate-950" : isThisWrong ? "bg-red-500 text-white" : "bg-slate-700 text-slate-500"
                        : isSelected ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-400"
                    }`}>
                      {letter}
                    </span>
                  )}
                  <span className="leading-snug">{opt}</span>
                  {isAnswered && isThisCorrect && <span className="ml-auto text-emerald-400 text-lg">✓</span>}
                  {isAnswered && isThisWrong && <span className="ml-auto text-red-400 text-lg">✕</span>}
                </button>
              );
            })}
          </div>
          <div className="h-4" />
        </div>
      </div>

      {/* Bottom */}
      <div className="shrink-0 px-4 pb-6 pt-3 max-w-xl mx-auto w-full">
        {phase === "playing" && (
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={`w-full py-4 rounded-2xl font-black text-base transition-all duration-150 ${
              selected
                ? "bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
            }`}
          >
            Confirmar
          </button>
        )}

        {phase === "feedback" && (
          <div className={`rounded-2xl border-2 p-4 animate-slide-up ${isCorrect ? "bg-emerald-950/70 border-emerald-500/50" : "bg-red-950/70 border-red-500/50"}`}>
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${isCorrect ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                {isCorrect ? "✅" : "❌"}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-black text-base ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                  {isCorrect ? (combo >= 3 ? `🔥 Combo ×${combo}!` : "Correto!") : "Resposta errada"}
                </p>
                {!isCorrect && (
                  <p className="text-slate-300 text-sm mt-0.5">
                    Resposta: <span className="font-bold text-emerald-400">{q.correctAnswer}</span>
                  </p>
                )}
              </div>
              {isCorrect && (
                <span className="text-blue-400 font-bold text-sm bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded-full shrink-0">
                  +{20 + (combo >= 3 ? 10 : 0)} XP
                </span>
              )}
            </div>
            {q.explanation && (
              <p className="text-slate-400 text-sm leading-relaxed mb-3 pl-12">{q.explanation}</p>
            )}
            <button
              onClick={handleNext}
              className={`w-full py-3.5 rounded-xl font-black text-base transition active:scale-[0.98] ${
                isCorrect ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950" : "bg-red-500 hover:bg-red-400 text-white"
              }`}
            >
              {current + 1 >= questions.length ? "Ver resultado" : "Continuar →"}
            </button>
          </div>
        )}
      </div>

      {showComboFlair && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <span className="animate-combo-flair text-5xl font-black text-orange-400 drop-shadow-lg">
            🔥 ×{combo}
          </span>
        </div>
      )}

      {levelUpData && (
        <LevelUpModal
          level={levelUpData.level}
          levelInfo={levelUpData.levelInfo}
          xpEarned={levelUpData.xpEarned}
          onClose={() => {
            setLevelUpData(null);
            setPhase("finished");
          }}
        />
      )}
    </div>
  );
}

function ResultStat({ label, value, color, icon }: {
  label: string; value: string;
  color: "emerald" | "yellow" | "red" | "blue" | "purple"; icon: string;
}) {
  const cfg = {
    emerald: "text-emerald-400 bg-emerald-500/8 border-emerald-500/25",
    yellow:  "text-yellow-400  bg-yellow-500/8  border-yellow-500/25",
    red:     "text-red-400     bg-red-500/8     border-red-500/25",
    blue:    "text-blue-400    bg-blue-500/8    border-blue-500/25",
    purple:  "text-purple-400  bg-purple-500/8  border-purple-500/25",
  };
  return (
    <div className={`rounded-2xl border p-4 ${cfg[color]}`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs opacity-60 mt-0.5 uppercase tracking-wide font-semibold">{label}</p>
    </div>
  );
}
