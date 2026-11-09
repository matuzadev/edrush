'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Building2, Users, Calendar, ChevronRight, Filter, RefreshCw, Zap } from 'lucide-react';
import { getOrgaoConfig } from '@/lib/orgao-config';

interface Concurso {
  id: number;
  titulo: string;
  organizador: string;
  orgao: string;
  banca: string | null;
  vagas_total: number | null;
  vagas_cargo: number | null;
  descricao: string | null;
  status: string;
  url_edital: string | null;
  url_site_oficial: string | null;
  cargo: string | null;
  area_especialidade: string | null;
  remuneracao_inicial: number | null;
  nivel_escolaridade: string | null;
  data_prova_objetiva: string | null;
  data_fechamento_inscricoes: string | null;
  logo_url: string | null;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'inscricoes_abertas', label: 'Inscrições abertas' },
  { value: 'inscricoes_encerradas', label: 'Inscrições encerradas' },
  { value: 'edital_proximo', label: 'Edital Próximo' },
  { value: 'aguardando_prova', label: 'Aguardando prova' },
  { value: 'previsto', label: 'Previstos' },
  { value: 'finalizado', label: 'Finalizados' },
];

function OrgaoLogo({ concurso }: { concurso: Concurso }) {
  const [imgError, setImgError] = useState(false);
  if (concurso.logo_url && !imgError) {
    return (
      <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-slate-800 flex items-center justify-center">
        <img src={concurso.logo_url} alt={concurso.organizador} className="w-9 h-9 object-contain" onError={() => setImgError(true)} />
      </div>
    );
  }
  const cfg = getOrgaoConfig(concurso.organizador);
  const fontSize = cfg.initials.length > 3 ? 'text-[9px]' : cfg.initials.length === 3 ? 'text-[10px]' : 'text-xs';
  return (
    <div className={`flex-shrink-0 w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center font-black ${fontSize} tracking-tight`}
      style={{ backgroundColor: cfg.color, color: cfg.textColor }}>
      {cfg.initials}
    </div>
  );
}

function hasRegistrationEnded(concurso: Concurso) {
  if (concurso.status === 'inscricoes_encerradas') return true;
  if (concurso.status !== 'inscricoes_abertas' || !concurso.data_fechamento_inscricoes) {
    return false;
  }

  const closingDate = new Date(`${concurso.data_fechamento_inscricoes}T23:59:59`);
  return !Number.isNaN(closingDate.getTime()) && closingDate.getTime() < Date.now();
}

function statusBadge(concurso: Concurso) {
  const { status } = concurso;
  if (hasRegistrationEnded(concurso)) {
    return (
      <span className="inline-flex items-center rounded-full border border-slate-700/60 bg-slate-700/40 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
        Inscrições encerradas
      </span>
    );
  }

  const labels: Record<string, string> = {
    ativo: 'Ativo',
    previsto: 'Previsto',
    edital_proximo: 'Edital próximo',
    inscricoes_abertas: 'Inscrições abertas',
    inscricoes_encerradas: 'Inscrições encerradas',
    aguardando_prova: 'Aguardando prova',
    finalizado: 'Finalizado',
  };
  const isOpen = status === 'ativo' || status === 'inscricoes_abertas';
  const isUpcoming = status === 'previsto' || status === 'edital_proximo' || status === 'aguardando_prova';
  const tone = isOpen
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : isUpcoming
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : 'bg-slate-700/60 text-slate-400 border-white/5';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tone}`}>
      {labels[status] ?? 'Status não informado'}
    </span>
  );
}

export default function ConcursosPage() {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setLoadError('');
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set('status', statusFilter);
        const res = await fetch(`/api/concursos?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Não foi possível carregar os concursos.');
        const data: unknown = await res.json();
        if (!Array.isArray(data)) throw new Error('A resposta de concursos está indisponível.');
        setConcursos(data as Concurso[]);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        setLoadError('Não foi possível carregar os concursos. Verifique sua conexão e tente novamente.');
        setConcursos([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [statusFilter, retryCount]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const visibleContests = statusFilter === 'inscricoes_abertas'
      ? concursos.filter(concurso => !hasRegistrationEnded(concurso))
      : concursos;

    return q
      ? visibleContests.filter(c =>
          c.titulo.toLowerCase().includes(q) ||
          c.organizador.toLowerCase().includes(q) ||
          (c.banca ?? '').toLowerCase().includes(q) ||
          (c.cargo ?? '').toLowerCase().includes(q) ||
          (c.area_especialidade ?? '').toLowerCase().includes(q)
        )
      : visibleContests;
  }, [search, concursos, statusFilter]);

  return (
    <div className="min-h-screen bg-[#0d1411] text-[#f3f5f1]">
      {/* Navbar */}
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

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-500 sm:text-sm">Encontre sua próxima oportunidade</p>
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Concursos públicos
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[#aeb7b0] sm:text-lg">
            Consulte concursos, conheça as áreas e organize sua preparação em um só lugar.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87938a]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, órgão ou banca..."
              aria-label="Buscar concursos por nome, órgão ou banca"
              className="w-full rounded-xl border border-[#dedbd0]/20 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-[#87938a] focus:border-emerald-500/50 focus:bg-white/[0.06]"
            />
          </div>
          <div className="flex min-w-0 items-start gap-2 sm:items-center">
            <Filter size={14} className="mt-2.5 shrink-0 text-[#87938a] sm:mt-0" aria-hidden="true" />
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar concursos por status">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatusFilter(opt.value)}
                  aria-pressed={statusFilter === opt.value}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    statusFilter === opt.value
                      ? 'bg-emerald-500 text-[#06251b]'
                      : 'bg-white/[0.04] border border-[#dedbd0]/20 text-[#b3bbb5] hover:border-emerald-500/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista */}
        {isLoading ? (
          <div className="space-y-3" role="status" aria-label="Carregando concursos">
            {[0, 1, 2].map(item => (
              <div key={item} className="h-32 animate-pulse rounded-2xl border border-white/5 bg-white/[0.03] motion-reduce:animate-none" />
            ))}
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
            <p className="text-sm text-slate-300">{loadError}</p>
            <button
              type="button"
              onClick={() => setRetryCount(count => count + 1)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5"
            >
              <RefreshCw size={14} aria-hidden="true" />
              Tentar novamente
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <p className="font-medium text-slate-200">Nenhum concurso encontrado</p>
            <p className="mt-2 text-sm text-slate-400">
              Tente alterar os filtros ou buscar por outro termo.
            </p>
          </div>
        ) : (
          <div className="space-y-3" aria-live="polite">
            {filtered.map(c => (
              <article key={c.id} className="rounded-2xl border border-[#dedbd0]/20 bg-white/[0.03] p-5 transition-colors hover:border-emerald-500/30">
                <div className="flex items-start gap-4">
                  <OrgaoLogo concurso={c} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-base leading-snug">{c.titulo}</h3>
                      {statusBadge(c)}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#b3bbb5] mb-2">
                      <span className="flex items-center gap-1"><Building2 size={11} />{c.organizador}</span>
                      {c.banca && <span className="text-[#87938a]">Banca: <span className="text-[#b3bbb5]">{c.banca}</span></span>}
                      {c.nivel_escolaridade && <span>{c.nivel_escolaridade}</span>}
                      {c.url_site_oficial?.startsWith('https://') && (
                        <a href={c.url_site_oficial} target="_blank" rel="noopener noreferrer" className="text-emerald-500 underline-offset-2 hover:underline">
                          Site oficial
                        </a>
                      )}
                      {c.url_edital?.startsWith('https://') && (
                        <a href={c.url_edital} target="_blank" rel="noopener noreferrer" className="text-emerald-500 underline-offset-2 hover:underline">
                          Edital
                        </a>
                      )}
                    </div>
                    {(c.cargo || c.area_especialidade) && (
                      <p className="mb-2 text-sm text-[#d6ddd7]">
                        {[c.cargo, c.area_especialidade].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    {c.descricao && <p className="mb-3 line-clamp-2 text-xs leading-5 text-[#87938a]">{c.descricao}</p>}
                    <div className="flex flex-wrap items-center gap-3">
                      {(c.vagas_cargo ?? c.vagas_total) != null && (
                        <span className="flex items-center gap-1 text-xs text-[#d6ddd7] bg-slate-800/60 border border-[#dedbd0]/10 rounded-lg px-2 py-1">
                          <Users size={10} />
                          {c.vagas_cargo ?? c.vagas_total} vagas
                        </span>
                      )}
                      {c.remuneracao_inicial != null && (
                        <span className="text-xs font-semibold text-emerald-500">
                          R$ {c.remuneracao_inicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                      {c.data_prova_objetiva && (
                        <span className="flex items-center gap-1 text-xs text-[#b3bbb5]">
                          <Calendar size={10} />Data da prova: {new Date(c.data_prova_objetiva + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      {c.data_fechamento_inscricoes && c.status === 'inscricoes_abertas' && !hasRegistrationEnded(c) && (
                        <span className="text-xs text-emerald-500">
                          Inscrições até {new Date(c.data_fechamento_inscricoes + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href="/auth/signup"
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-500/30 px-3 py-2 text-xs font-semibold text-emerald-500 transition hover:bg-emerald-500/10"
                  >
                    Estudar <ChevronRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-[#dedbd0]/20 bg-white/[0.02] p-8 text-center sm:p-10">
          <h2 className="mb-3 text-2xl font-extrabold text-white sm:text-3xl">Prepare-se com o EdRush</h2>
          <p className="mb-6 text-base leading-7 text-[#aeb7b0]">
            Questões, simulados e acompanhamento para apoiar sua rotina de estudos — sem mensalidade.
          </p>
          <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-4 font-bold text-[#06251b] transition hover:bg-emerald-400">
            Criar conta gratuita
          </Link>
        </div>
      </main>
    </div>
  );
}
