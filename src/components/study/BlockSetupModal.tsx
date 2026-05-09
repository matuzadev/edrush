'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Loader2,
  Play,
  AlertCircle,
  Filter,
  Layers,
  Eye,
  EyeOff,
  XCircle,
  Sparkles,
} from 'lucide-react';

type Difficulty = 'facil' | 'medio' | 'dificil';
type FiltroTipo = 'todas' | 'nao_vistas' | 'erradas';

interface ModuleRow {
  capitulo: string;
  count: number;
}

interface CountResponse {
  total: number;
  byDifficulty: { facil: number; medio: number; dificil: number };
  cached: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Disciplina (nome completo, ex.: "Português") — usada para query do banco. */
  disciplina: string;
  /** Slug da matéria (ex.: "portugues") — usada para o fluxo legacy de localStorage. */
  subjectSlug?: string;
  /** Slug do concurso, para passar adiante na navegação. */
  concursoSlug?: string;
  /** Concurso numérico para filtrar questões (se aplicável). */
  concursoId?: number | null;
}

const QTY_PRESETS = [10, 20, 30, 50] as const;
const DEFAULT_QTY = 20;

const DIFF_LABEL: Record<Difficulty, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};

const DIFF_COLOR: Record<Difficulty, { color: string; bg: string; border: string }> = {
  facil:   { color: '#34d399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.40)' },
  medio:   { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.40)' },
  dificil: { color: '#fb7185', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.45)' },
};

const FILTRO_OPTIONS: { value: FiltroTipo; label: string; Icon: typeof Eye }[] = [
  { value: 'todas',      label: 'Todas',       Icon: Eye },
  { value: 'nao_vistas', label: 'Não vistas',  Icon: EyeOff },
  { value: 'erradas',    label: 'Erradas',     Icon: XCircle },
];

export function BlockSetupModal({
  isOpen,
  onClose,
  disciplina,
  subjectSlug,
  concursoSlug,
  concursoId,
}: Props) {
  const router = useRouter();

  // Filtros
  const [modulo, setModulo] = useState<string>('');
  const [dificuldades, setDificuldades] = useState<Set<Difficulty>>(
    new Set<Difficulty>(['facil', 'medio', 'dificil']),
  );
  const [filtro, setFiltro] = useState<FiltroTipo>('todas');

  // Quantidade
  const [quantidade, setQuantidade] = useState<number>(DEFAULT_QTY);
  const [customMode, setCustomMode] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string>('');

  // Dados
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [count, setCount] = useState<CountResponse | null>(null);
  const [loadingCount, setLoadingCount] = useState<boolean>(false);
  const [loadingModules, setLoadingModules] = useState<boolean>(false);
  const [autoAdjusted, setAutoAdjusted] = useState<boolean>(false);
  const [navigating, setNavigating] = useState<boolean>(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state ao abrir
  useEffect(() => {
    if (!isOpen) return;
    setModulo('');
    setDificuldades(new Set<Difficulty>(['facil', 'medio', 'dificil']));
    setFiltro('todas');
    setQuantidade(DEFAULT_QTY);
    setCustomMode(false);
    setCustomValue('');
    setAutoAdjusted(false);
    setCount(null);
  }, [isOpen]);

  // Buscar módulos quando abrir
  useEffect(() => {
    if (!isOpen || !disciplina) return;
    const ctrl = new AbortController();
    setLoadingModules(true);

    const params = new URLSearchParams({ disciplina });
    if (concursoId != null) params.set('concurso_id', String(concursoId));

    fetch(`/api/questions/modules?${params}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : { modules: [] }))
      .then((d) => setModules(d.modules ?? []))
      .catch(() => {})
      .finally(() => setLoadingModules(false));

    return () => ctrl.abort();
  }, [isOpen, disciplina, concursoId]);

  // Buscar contagem quando filtros mudarem (com debounce)
  useEffect(() => {
    if (!isOpen || !disciplina) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoadingCount(true);

    debounceRef.current = setTimeout(() => {
      const ctrl = new AbortController();
      const params = new URLSearchParams({ disciplina });
      if (modulo) params.set('capitulo', modulo);
      if (concursoId != null) params.set('concurso_id', String(concursoId));
      const diffArr = Array.from(dificuldades);
      if (diffArr.length > 0 && diffArr.length < 3) {
        params.set('dificuldade', diffArr.join(','));
      }
      params.set('filtro', filtro);

      fetch(`/api/questions/count?${params}`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: CountResponse | null) => {
          if (d) setCount(d);
        })
        .catch(() => {})
        .finally(() => setLoadingCount(false));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [isOpen, disciplina, modulo, dificuldades, filtro, concursoId]);

  // Auto-ajuste de quantidade quando o total disponível < quantidade selecionada
  useEffect(() => {
    if (!count) return;
    const total = count.total;
    if (total === 0) {
      setAutoAdjusted(false);
      return;
    }
    if (quantidade > total) {
      // pega o maior preset válido OU o total
      const validPreset = [...QTY_PRESETS].reverse().find((p) => p <= total);
      const newQty = validPreset ?? total;
      setQuantidade(newQty);
      setAutoAdjusted(true);
    } else {
      setAutoAdjusted(false);
    }
  }, [count, quantidade]);

  // Handlers
  function toggleDificuldade(d: Difficulty) {
    setDificuldades((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  }

  function pickPreset(p: number) {
    setCustomMode(false);
    setQuantidade(p);
    setAutoAdjusted(false);
  }

  function startCustom() {
    setCustomMode(true);
    setCustomValue(String(quantidade));
  }

  function applyCustom() {
    const n = parseInt(customValue, 10);
    if (!Number.isFinite(n) || n < 1) return;
    const total = count?.total ?? n;
    setQuantidade(Math.min(Math.max(1, n), total));
    setCustomMode(false);
  }

  function clearFilters() {
    setModulo('');
    setDificuldades(new Set<Difficulty>(['facil', 'medio', 'dificil']));
    setFiltro('todas');
  }

  function handleStart() {
    if (!count || count.total === 0) return;
    setNavigating(true);
    const params = new URLSearchParams({
      // disciplina (título) ativa o modo "fetch da API" no /dashboard/study
      disciplina,
      quantidade: String(quantidade),
      filtro,
    });
    // subject (slug) é mantido para compatibilidade com a base legacy via localStorage
    if (subjectSlug) params.set('subject', subjectSlug);
    if (modulo) params.set('modulo', modulo);
    const diffArr = Array.from(dificuldades);
    if (diffArr.length > 0 && diffArr.length < 3) {
      params.set('dificuldade', diffArr.join(','));
    }
    if (concursoSlug) params.set('concurso', concursoSlug);

    router.push(`/dashboard/study?${params}`);
  }

  // Estimativa de tempo (0.75–1.5 min por questão, arredondado a 5)
  const tempoEstimado = useMemo(() => {
    const minTotal = quantidade * 0.75;
    const maxTotal = quantidade * 1.5;
    const round5 = (n: number) => Math.max(5, Math.round(n / 5) * 5);
    return `${round5(minTotal)}–${round5(maxTotal)} min`;
  }, [quantidade]);

  if (!isOpen) return null;

  const total = count?.total ?? 0;
  const distribuicao = count?.byDifficulty ?? { facil: 0, medio: 0, dificil: 0 };
  const podeIniciar = total > 0 && quantidade > 0 && !navigating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Iniciar bloco de estudo"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.88) 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '1.5rem',
          boxShadow: '0 20px 60px -12px rgba(0,0,0,0.7)',
          animation: 'blockModalEnter 0.2s ease-out',
        }}
      >
        <style>{`
          @keyframes blockModalEnter {
            from { opacity: 0; transform: scale(0.96) translateY(10px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Linha de gradient no topo */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none rounded-t-3xl"
          style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6)' }}
        />

        {/* Header */}
        <div
          className="flex items-center gap-3 px-6 pt-6 pb-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.20), rgba(6,182,212,0.10))',
              border: '1px solid rgba(16,185,129,0.30)',
              boxShadow: '0 0 14px rgba(16,185,129,0.20)',
            }}
          >
            <Play size={16} className="text-emerald-300" fill="currentColor" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-white leading-tight truncate">
              Iniciar bloco
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {disciplina}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}
            aria-label="Fechar"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Módulo */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Módulo
              </label>
            </div>
            <select
              value={modulo}
              onChange={(e) => setModulo(e.target.value)}
              disabled={loadingModules}
              className="w-full px-4 py-3 rounded-xl text-white text-sm transition-all outline-none cursor-pointer disabled:opacity-60"
              style={{
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                colorScheme: 'dark',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#06b6d4';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(6,182,212,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Todos os módulos</option>
              {modules.map((m) => (
                <option key={m.capitulo} value={m.capitulo}>
                  {m.capitulo} ({m.count})
                </option>
              ))}
            </select>
          </div>

          {/* Dificuldade */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Dificuldade
              </label>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['facil', 'medio', 'dificil'] as const).map((d) => {
                const active = dificuldades.has(d);
                const color = DIFF_COLOR[d];
                return (
                  <button
                    key={d}
                    onClick={() => toggleDificuldade(d)}
                    className="px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                    style={{
                      background: active ? color.bg : 'rgba(15,23,42,0.6)',
                      border: `1px solid ${active ? color.border : 'rgba(255,255,255,0.08)'}`,
                      color: active ? color.color : '#64748b',
                      boxShadow: active ? `0 0 12px -4px ${color.color}80` : 'none',
                    }}
                  >
                    {DIFF_LABEL[d]}
                    {count && (
                      <span
                        className="ml-1.5 text-[10px] tabular-nums"
                        style={{ color: active ? color.color : '#475569' }}
                      >
                        {distribuicao[d]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtro */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Filtro
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FILTRO_OPTIONS.map((opt) => {
                const Icon = opt.Icon;
                const active = filtro === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setFiltro(opt.value)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: active ? 'rgba(16,185,129,0.15)' : 'rgba(15,23,42,0.6)',
                      border: `1px solid ${active ? 'rgba(16,185,129,0.45)' : 'rgba(255,255,255,0.08)'}`,
                      color: active ? '#34d399' : '#64748b',
                    }}
                  >
                    <Icon size={12} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumo / contador */}
          <div
            className="px-4 py-3 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.04))',
              border: '1px solid rgba(16,185,129,0.20)',
            }}
          >
            {loadingCount && !count ? (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Loader2 size={12} className="animate-spin" />
                Calculando disponibilidade...
              </div>
            ) : total === 0 ? (
              <div className="flex items-start gap-2.5">
                <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-rose-300">
                    Nenhuma questão com esses filtros
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tente remover o filtro de módulo ou voltar para "Todas".
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                  >
                    Limpar filtros →
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-black text-white">
                  <span className="tabular-nums">{total.toLocaleString('pt-BR')}</span>{' '}
                  <span className="text-slate-400 font-normal">questões disponíveis</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  <span style={{ color: DIFF_COLOR.facil.color }}>
                    {distribuicao.facil} fáceis
                  </span>
                  <span className="mx-1.5 text-slate-700">·</span>
                  <span style={{ color: DIFF_COLOR.medio.color }}>
                    {distribuicao.medio} médias
                  </span>
                  <span className="mx-1.5 text-slate-700">·</span>
                  <span style={{ color: DIFF_COLOR.dificil.color }}>
                    {distribuicao.dificil} difíceis
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Quantidade */}
          {total > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Quantas questões?
                </label>
                {autoAdjusted && (
                  <span className="text-[10px] font-bold text-amber-400">
                    Ajustado para o máximo disponível
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {QTY_PRESETS.map((p) => {
                  const disabled = p > total;
                  const active = !customMode && quantidade === p;
                  return (
                    <button
                      key={p}
                      onClick={() => !disabled && pickPreset(p)}
                      disabled={disabled}
                      className="min-w-[56px] px-3.5 py-2 rounded-xl text-sm font-black tabular-nums transition-all disabled:cursor-not-allowed"
                      style={{
                        background: active ? 'rgba(16,185,129,0.18)' : 'rgba(15,23,42,0.6)',
                        border: `1px solid ${active ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
                        color: active ? '#34d399' : disabled ? '#334155' : '#cbd5e1',
                        opacity: disabled ? 0.4 : 1,
                        boxShadow: active ? '0 0 12px -4px rgba(16,185,129,0.50)' : 'none',
                      }}
                    >
                      {p}
                    </button>
                  );
                })}

                {!customMode ? (
                  <button
                    onClick={startCustom}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: 'rgba(15,23,42,0.6)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#94a3b8',
                    }}
                  >
                    Custom
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={total}
                      value={customValue}
                      autoFocus
                      onChange={(e) => setCustomValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') applyCustom();
                        if (e.key === 'Escape') setCustomMode(false);
                      }}
                      onBlur={applyCustom}
                      className="w-20 px-3 py-2 rounded-xl text-sm font-black text-center text-emerald-300 tabular-nums outline-none"
                      style={{
                        background: 'rgba(16,185,129,0.10)',
                        border: '1px solid rgba(16,185,129,0.40)',
                      }}
                    />
                    <span className="text-[10px] text-slate-500">/ {total}</span>
                  </div>
                )}
              </div>

              {/* Estimativa de tempo */}
              <p className="text-[11px] text-slate-500 mt-2.5">
                Estimativa: <span className="text-slate-300 font-bold">≈ {tempoEstimado}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 py-4 shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)';
              (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
              (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleStart}
            disabled={!podeIniciar}
            className="flex-[2] py-3 rounded-xl text-sm font-black text-slate-950 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              boxShadow: podeIniciar ? '0 0 20px rgba(16,185,129,0.35)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (podeIniciar) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(16,185,129,0.55)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = podeIniciar
                ? '0 0 20px rgba(16,185,129,0.35)'
                : 'none';
            }}
          >
            {navigating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" fill="currentColor" />
                Iniciar bloco · {quantidade} questões
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
