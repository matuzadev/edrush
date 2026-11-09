'use client';

import { useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  X,
  Zap,
} from 'lucide-react';

const options = [
  {
    id: 'a',
    text: 'Fazem três meses que comecei a estudar.',
    explanation:
      'O verbo fazer, indicando tempo decorrido, é impessoal e fica no singular: “Faz três meses”.',
  },
  {
    id: 'b',
    text: 'Houveram mudanças no edital.',
    explanation:
      'O verbo haver, no sentido de existir, é impessoal e fica no singular: “Houve mudanças”.',
  },
  {
    id: 'c',
    text: 'Faltam duas semanas para a prova.',
    explanation:
      'Correto. O verbo faltar concorda com o sujeito “duas semanas”.',
  },
];

const features = [
  {
    id: 'questoes',
    label: 'Questões',
    title: 'Pratique por disciplina e concurso.',
    description:
      'Responda questões e veja a explicação logo depois. Seu progresso fica organizado para você acompanhar.',
    rows: [
      ['Português — Concordância', '12 questões'],
      ['Direito Administrativo — Atos', '18 questões'],
      ['Raciocínio Lógico — Proposições', '9 questões'],
    ],
  },
  {
    id: 'simulados',
    label: 'Simulados',
    title: 'Treine no ritmo da prova.',
    description:
      'Prepare-se com simulados cronometrados e confira o gabarito ao finalizar.',
    rows: [
      ['Tempo', '01:30:00'],
      ['Questões', '40'],
      ['Gabarito', 'Ao finalizar'],
    ],
  },
  {
    id: 'acompanhamento',
    label: 'Acompanhamento',
    title: 'Saiba onde concentrar seus estudos.',
    description:
      'Acompanhe seu desempenho por disciplina e descubra o que precisa de mais revisão.',
    rows: [
      ['Português', '72%'],
      ['Direito Constitucional', '58%'],
      ['Informática', '41%'],
    ],
  },
];

function DemoQuestion() {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const selectedOption = options.find((option) => option.id === selected);
  const isCorrect = selected === 'c';

  function resetQuestion() {
    setSelected(null);
    setChecked(false);
  }

  return (
    <section
      aria-label="Demonstração de questão"
      className="rounded-2xl border border-[#dedbd0] bg-[#f5f3eb] p-5 text-[#202923] shadow-xl sm:p-8"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#dedbd0] pb-4 text-xs sm:text-sm">
        <p>
          <strong>Português</strong>
          <span className="text-[#8b9189]"> · Concordância verbal</span>
        </p>
        <span className="shrink-0 text-[#68736b]">Questão de exemplo</span>
      </div>

      <fieldset className="mt-1">
        <legend className="py-4 text-lg font-bold leading-snug sm:text-xl">
          Qual frase apresenta concordância verbal correta?
        </legend>

        <div className="space-y-2.5">
          {options.map((option, index) => {
            const isSelected = selected === option.id;
            const showCorrect = checked && option.id === 'c';
            const showWrong = checked && isSelected && !isCorrect;

            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition sm:px-4 ${
                  showCorrect
                    ? 'border-emerald-500 bg-emerald-50'
                    : showWrong
                      ? 'border-red-400 bg-red-50'
                      : isSelected
                        ? 'border-emerald-500 bg-white'
                        : 'border-[#dedbd0] hover:border-emerald-500/60 hover:bg-white/70'
                } ${checked ? 'cursor-default' : ''}`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="demo-question"
                  value={option.id}
                  checked={isSelected}
                  disabled={checked}
                  onChange={() => setSelected(option.id)}
                />
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    showCorrect
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : showWrong
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-[#aab0a8] text-[#202923]'
                  }`}
                >
                  {showCorrect ? (
                    <Check size={15} />
                  ) : showWrong ? (
                    <X size={15} />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span className="text-sm leading-6 sm:text-base">{option.text}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 min-h-14" aria-live="polite">
        {checked && selectedOption ? (
          <div
            className={`flex items-start gap-2 rounded-lg p-3 text-sm leading-6 ${
              isCorrect
                ? 'bg-emerald-100 text-emerald-950'
                : 'bg-red-100 text-red-950'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="mt-1 shrink-0" size={17} />
            ) : (
              <X className="mt-1 shrink-0" size={17} />
            )}
            <p>
              <strong>{isCorrect ? 'Resposta certa. ' : 'Resposta incorreta. '}</strong>
              {selectedOption.explanation}
            </p>
          </div>
        ) : (
          <p className="pt-2 text-sm text-[#68736b]">
            {selected ? 'Confira para ver a explicação.' : 'Escolha uma alternativa.'}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <small className="text-xs text-[#68736b]">Exemplo: nada é salvo.</small>
        {checked ? (
          <button
            type="button"
            onClick={resetQuestion}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d5d2c8] px-4 py-2.5 text-sm font-semibold transition hover:bg-white"
          >
            <RotateCcw size={15} aria-hidden="true" />
            Tentar novamente
          </button>
        ) : (
          <button
            type="button"
            disabled={!selected}
            onClick={() => setChecked(true)}
            className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#06251b] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Conferir resposta
          </button>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);
  const feature = features[activeFeature];

  function handleTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let next = activeFeature;

    if (event.key === 'ArrowRight') {
      next = (activeFeature + 1) % features.length;
    } else if (event.key === 'ArrowLeft') {
      next = (activeFeature - 1 + features.length) % features.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = features.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveFeature(next);
    document.getElementById(`feature-tab-${features[next].id}`)?.focus();
  }

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

          <div className="hidden items-center gap-8 text-sm text-[#b3bbb5] sm:flex">
            <Link href="#recursos" className="transition hover:text-white">
              Recursos
            </Link>
            <Link href="/concursos" className="transition hover:text-white">
              Concursos
            </Link>
          </div>

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

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[665px] lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.12em] text-emerald-500 sm:text-sm">
            Preparação para concursos
          </p>
          <h1 className="max-w-xl text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
            Estude respondendo.
            <span className="mt-1 block text-emerald-500">
              Aprenda com cada erro.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#aeb7b0] sm:text-lg sm:leading-8">
            Questões por disciplina, explicação logo após a resposta, simulados e
            acompanhamento do seu desempenho.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-3 rounded-lg bg-emerald-500 px-6 py-4 font-bold text-[#06251b] transition hover:bg-emerald-400"
            >
              Começar a estudar
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/concursos"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 px-6 py-4 font-semibold transition hover:border-white/30 hover:bg-white/5"
            >
              Ver concursos
            </Link>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-[#aeb7b0]">
            <Check size={17} className="text-emerald-500" aria-hidden="true" />
            Recursos de estudo gratuitos.
          </p>
        </div>

        <DemoQuestion />
      </section>

      <section
        id="recursos"
        aria-labelledby="features-title"
        className="border-t border-white/10 bg-[#111a16] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-500">
              Recursos
            </p>
            <h2 id="features-title" className="mt-3 text-3xl font-bold sm:text-4xl">
              Um ciclo de estudo completo.
            </h2>
            <p className="mt-3 leading-7 text-[#aeb7b0]">
              Pratique, teste e acompanhe. Tudo em um só lugar.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Recursos do EdRush"
            onKeyDown={handleTabKeyDown}
            className="mt-8 flex flex-wrap gap-2 border-b border-white/10"
          >
            {features.map((item, index) => {
              const isActive = index === activeFeature;

              return (
                <button
                  key={item.id}
                  id={`feature-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`feature-panel-${item.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveFeature(index)}
                  className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-[#aeb7b0] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div
            id={`feature-panel-${feature.id}`}
            role="tabpanel"
            aria-labelledby={`feature-tab-${feature.id}`}
            className="grid gap-8 rounded-b-2xl border border-t-0 border-white/10 p-5 sm:p-8 md:grid-cols-2 md:items-center"
          >
            <div>
              <h3 className="text-2xl font-bold">{feature.title}</h3>
              <p className="mt-3 max-w-lg leading-7 text-[#aeb7b0]">
                {feature.description}
              </p>
              <Link
                href="/auth/signup"
                className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Começar a estudar
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0d1411] p-4 sm:p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#87938a]">
                {feature.id === 'questoes'
                  ? 'Exemplos de questões'
                  : feature.id === 'simulados'
                    ? 'Seu simulado'
                    : 'Desempenho por disciplina'}
              </p>
              <div className="divide-y divide-white/10">
                {feature.rows.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 py-3 text-sm"
                  >
                    <span className="text-[#d6ddd7]">{label}</span>
                    <span className="shrink-0 font-semibold text-emerald-400">
                      {feature.id === 'questoes' && <BookOpen className="mr-2 inline" size={15} aria-hidden="true" />}
                      {feature.id === 'simulados' && <ClipboardCheck className="mr-2 inline" size={15} aria-hidden="true" />}
                      {feature.id === 'acompanhamento' && <BarChart3 className="mr-2 inline" size={15} aria-hidden="true" />}
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 text-sm text-[#9ba69e] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>EdRush — preparação para concursos, acessível a todos.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacidade" className="transition hover:text-white">
              Privacidade
            </Link>
            <Link href="/termos" className="transition hover:text-white">
              Termos de Serviço
            </Link>
            <Link href="/auth/login" className="transition hover:text-white">
              Entrar
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}