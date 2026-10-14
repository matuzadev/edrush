'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Building2, Users, Calendar, ChevronRight, Filter } from 'lucide-react';
import { getOrgaoConfig } from '@/lib/orgao-config';

interface Concurso {
  id: number;
  titulo: string;
  organizador: string;
  orgao: string;
  banca: string | null;
  vagas_total: number | null;
  descricao: string | null;
  status: string;
  remuneracao_inicial: number | null;
  nivel_escolaridade: string | null;
  data_prova_objetiva: string | null;
  data_fechamento_inscricoes: string | null;
  logo_url: string | null;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'ativo', label: 'Ativos' },
  { value: 'edital_proximo', label: 'Edital Próximo' },
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

function statusBadge(status: string) {
  if (status === 'ativo') return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ativo</span>;
  if (status === 'edital_proximo') return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Edital Próximo</span>;
  return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-slate-700/60 text-slate-400 border border-white/5">Encerrado</span>;
}

export default function ConcursosPage() {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [filtered, setFiltered] = useState<Concurso[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ativo');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set('status', statusFilter);
        const res = await fetch(`/api/concursos?${params.toString()}`);
        if (res.ok) setConcursos(await res.json());
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [statusFilter]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? concursos.filter(c =>
            c.titulo.toLowerCase().includes(q) ||
            c.organizador.toLowerCase().includes(q) ||
            (c.banca ?? '').toLowerCase().includes(q)
          )
        : concursos
    );
  }, [search, concursos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-slate-900 to-[#0f172a]">
      {/* Navbar */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          EDRUSH
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm text-slate-400 hover:text-white transition">Entrar</Link>
          <Link href="/auth/signup" className="text-sm px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition">
            Cadastrar
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-3">
            Concursos{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Públicos Federais
            </span>
          </h1>
          <p className="text-slate-400 text-lg">Acompanhe os principais concursos federais abertos e próximos.</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, órgão ou banca..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 transition text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400 flex-shrink-0" />
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    statusFilter === opt.value
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:border-emerald-500/40'
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
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Nenhum concurso encontrado.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(c => (
              <div key={c.id} className="bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 rounded-2xl p-5 transition-all">
                <div className="flex items-start gap-4">
                  <OrgaoLogo concurso={c} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-base leading-snug">{c.titulo}</h3>
                      {statusBadge(c.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1"><Building2 size={11} />{c.organizador}</span>
                      {c.banca && <span className="text-slate-500">Banca: <span className="text-slate-400">{c.banca}</span></span>}
                      {c.nivel_escolaridade && <span>{c.nivel_escolaridade}</span>}
                    </div>
                    {c.descricao && <p className="text-xs text-slate-500 line-clamp-1 mb-3">{c.descricao}</p>}
                    <div className="flex flex-wrap items-center gap-3">
                      {c.vagas_total != null && (
                        <span className="flex items-center gap-1 text-xs text-slate-300 bg-slate-800/60 border border-white/5 rounded-lg px-2 py-1">
                          <Users size={10} />{c.vagas_total.toLocaleString('pt-BR')} vagas
                        </span>
                      )}
                      {c.remuneracao_inicial != null && (
                        <span className="text-xs text-emerald-400 font-semibold">
                          R$ {c.remuneracao_inicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                      {c.data_prova_objetiva && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar size={10} />Prova: {new Date(c.data_prova_objetiva + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      {c.data_fechamento_inscricoes && c.status === 'ativo' && (
                        <span className="text-xs text-amber-400">
                          Inscrições até {new Date(c.data_fechamento_inscricoes + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href="/auth/signup"
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 px-3 py-2 rounded-xl transition font-semibold"
                  >
                    Estudar <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-10">
          <h2 className="text-2xl font-black text-white mb-3">Prepare-se com o EdRush</h2>
          <p className="text-slate-400 mb-6">Questões comentadas, plano de estudos personalizado e simulados para cada concurso.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black rounded-xl transition">
            Começar Gratuitamente
          </Link>
        </div>
      </main>
    </div>
  );
}
