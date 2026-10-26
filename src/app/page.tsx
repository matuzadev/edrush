import Link from 'next/link';
import { ArrowRight, BarChart3, BookOpen, ClipboardCheck } from 'lucide-react';

const studyTools = [
  {
    icon: BookOpen,
    title: 'Questões',
    description: 'Pratique por disciplina e concurso.',
  },
  {
    icon: ClipboardCheck,
    title: 'Simulados',
    description: 'Treine com questões do banco de estudos.',
  },
  {
    icon: BarChart3,
    title: 'Acompanhamento',
    description: 'Veja suas respostas e acompanhe seu progresso.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <header className="border-b border-[var(--border)]">
        <nav
          aria-label="Navegação principal"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
        >
          <Link href="/" className="text-xl font-bold tracking-tight no-underline">
            Ed<span className="text-emerald-500">Rush</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-400 transition hover:text-[var(--fg)] no-underline"
            >
              Entrar
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 no-underline"
            >
              Criar conta
            </Link>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <section className="grid min-h-[440px] items-center gap-12 py-20 md:grid-cols-[1.15fr_0.85fr] md:py-28">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-semibold text-emerald-500">
              Preparação para concursos públicos
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Estude com método. Acompanhe sua evolução.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Organize sua preparação em um só lugar: pratique questões, faça simulados
              e acompanhe seu desempenho. Todos os recursos de estudo são gratuitos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 no-underline"
              >
                Começar a estudar
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/concursos"
                className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:bg-white/5 no-underline"
              >
                Explorar concursos
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Sem mensalidade. Sem cobrança para acessar os recursos de estudo.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2">
            <ul className="divide-y divide-[var(--border)]">
              {studyTools.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-4 p-5 sm:p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-[var(--border)] py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>EdRush — preparação para concursos, acessível a todos.</p>
          <Link href="/auth/login" className="transition hover:text-[var(--fg)] no-underline">
            Já tem uma conta? Entrar
          </Link>
        </footer>
      </div>
    </main>
  );
}
