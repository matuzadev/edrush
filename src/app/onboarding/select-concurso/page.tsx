'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, Building2, Users, FileText, ChevronRight, Loader2, BookOpen } from 'lucide-react';

interface Concurso {
  id: number;
  titulo: string;
  organizador: string;
  banca: string | null;
  vagas_total: number | null;
  descricao: string | null;
  status: string;
}

export default function SelectConcursoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [filtered, setFiltered] = useState<Concurso[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated') {
      fetchConcursos();
    }
  }, [status, router]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      concursos.filter(
        (c) =>
          c.titulo.toLowerCase().includes(q) ||
          c.organizador.toLowerCase().includes(q) ||
          (c.banca ?? '').toLowerCase().includes(q)
      )
    );
  }, [search, concursos]);

  async function fetchConcursos() {
    try {
      const res = await fetch('/api/concursos?status=ativo');
      if (res.ok) {
        const data = await res.json();
        setConcursos(data);
        setFiltered(data);
      }
    } catch {
      // ignora — lista ficará vazia
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelect(concurso: Concurso) {
    const params = new URLSearchParams({
      concursoId: String(concurso.id),
      concursoTitle: concurso.titulo,
    });
    router.push(`/onboarding/select-area?${params.toString()}`);
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-slate-900 to-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Carregando concursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-slate-900 to-[#0f172a] px-4 py-12">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-3/4 h-3/4 bg-emerald-500/5 blur-3xl rounded-full" />
        <div className="absolute -bottom-1/3 -right-1/4 w-2/3 h-2/3 bg-blue-500/5 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
            <BookOpen size={14} className="text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Passo 1 de 2
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Qual concurso você está{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              estudando?
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Selecione o concurso para personalizar seu plano de estudos com as matérias certas.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, órgão ou banca..."
            className="w-full pl-12 pr-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
          />
        </div>

        {/* Lista de concursos */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-slate-500" />
            </div>
            <p className="text-slate-400 font-medium">
              {concursos.length === 0
                ? 'Nenhum concurso cadastrado ainda.'
                : 'Nenhum concurso encontrado para essa busca.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((concurso) => (
              <button
                key={concurso.id}
                onClick={() => handleSelect(concurso)}
                className="group text-left bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-base leading-snug mb-1 group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {concurso.titulo}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                      <Building2 size={12} />
                      <span className="truncate">{concurso.organizador}</span>
                      {concurso.banca && (
                        <>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-500 font-medium">{concurso.banca}</span>
                        </>
                      )}
                    </div>

                    {concurso.descricao && (
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {concurso.descricao}
                      </p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      {concurso.vagas_total && (
                        <span className="inline-flex items-center gap-1.5 bg-slate-800/60 border border-white/5 rounded-lg px-2.5 py-1 text-xs text-slate-300">
                          <Users size={11} />
                          {concurso.vagas_total.toLocaleString('pt-BR')} vagas
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          concurso.status === 'ativo'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : concurso.status === 'edital_proximo'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-700/60 text-slate-400 border border-white/5'
                        }`}
                      >
                        {concurso.status === 'ativo'
                          ? 'Ativo'
                          : concurso.status === 'edital_proximo'
                          ? 'Edital Próximo'
                          : 'Encerrado'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-9 h-9 bg-slate-800 group-hover:bg-emerald-500/20 border border-white/5 group-hover:border-emerald-500/30 rounded-xl flex items-center justify-center transition-all">
                    <ChevronRight
                      size={16}
                      className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
