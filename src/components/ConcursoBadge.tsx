'use client';

import { getConcurso } from '@/data/concursos';
import { Target } from 'lucide-react';

interface ConcursoBadgeProps {
  slug: string | null | undefined;
  // Variantes de tamanho/densidade
  variant?: 'card' | 'pill' | 'compact' | 'inline';
  className?: string;
}

/**
 * Badge "Estudando para" — estilo Duolingo, mostra concurso que o usuário escolheu.
 * Funciona em qualquer página (perfil próprio, perfil público, modal de amigo, lista).
 *
 * Variantes:
 * - card    : card grande com ícone + nome + tagline (perfil principal)
 * - pill    : pill compacta com ícone + nome (lista, header)
 * - compact : ícone + nome em linha (modal de amigo)
 */
export function ConcursoBadge({ slug, variant = 'card', className }: ConcursoBadgeProps) {
  const concurso = getConcurso(slug);

  // Sem concurso definido → estado neutro
  if (!concurso) {
    if (variant === 'pill' || variant === 'compact') {
      return (
        <span className={`inline-flex items-center gap-1.5 text-[11px] text-slate-500 ${className ?? ''}`}>
          <Target size={12} />
          <span>Sem concurso definido</span>
        </span>
      );
    }
    return null;
  }

  if (variant === 'pill') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${className ?? ''}`}
        style={{
          background: `${concurso.cor}12`,
          border: `1px solid ${concurso.cor}40`,
          color: concurso.cor,
        }}
        title={concurso.nomeCompleto}
      >
        <span
          className="inline-block w-3.5 h-3.5"
          dangerouslySetInnerHTML={{ __html: concurso.svg }}
        />
        <span className="truncate max-w-[160px]">
          {concurso.nome}
          {concurso.area && <span className="opacity-70"> · {concurso.area}</span>}
        </span>
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className ?? ''}`}>
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
          style={{
            background: `${concurso.cor}15`,
            border: `1px solid ${concurso.cor}30`,
          }}
        >
          <span
            className="w-5 h-5 inline-block"
            dangerouslySetInnerHTML={{ __html: concurso.svg }}
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest font-bold leading-none" style={{ color: concurso.cor }}>
            Estudando para
          </p>
          <p className="text-xs font-bold text-white truncate leading-tight mt-0.5">
            {concurso.nome}
            {concurso.area && <span className="text-slate-400"> · {concurso.area}</span>}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div
        className={`inline-flex items-center gap-2 ${className ?? ''}`}
        title={concurso.nomeCompleto}
      >
        <span
          className="w-4 h-4 inline-block shrink-0 opacity-80"
          dangerouslySetInnerHTML={{ __html: concurso.svg }}
        />
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600">
          Estudando
        </span>
        <span className="text-slate-700">·</span>
        <span className="text-xs font-semibold text-slate-300 truncate">
          {concurso.nome}
          {concurso.area && (
            <span className="text-slate-500 font-normal"> em {concurso.area}</span>
          )}
        </span>
      </div>
    );
  }

  // variant === 'card' (default)
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className ?? ''}`}
      style={{
        background: `linear-gradient(135deg, ${concurso.cor}14 0%, rgba(15,23,42,0.85) 60%, rgba(15,23,42,0.55) 100%)`,
        border: `1px solid ${concurso.cor}33`,
        boxShadow: `0 8px 28px -12px ${concurso.cor}30`,
      }}
    >
      {/* Linha gradient no topo */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${concurso.cor}, ${concurso.corAccent}, transparent)` }}
      />
      {/* Glow blob */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-25"
        style={{ background: concurso.cor }}
      />

      <div className="relative flex items-center gap-4 px-5 py-4">
        {/* Brasão */}
        <div
          className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${concurso.cor}25, ${concurso.corAccent}10)`,
            border: `1px solid ${concurso.cor}40`,
            boxShadow: `0 0 14px -2px ${concurso.cor}30`,
          }}
        >
          <span
            className="w-10 h-10 inline-block"
            dangerouslySetInnerHTML={{ __html: concurso.svg }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] uppercase tracking-widest font-bold leading-none mb-1"
            style={{ color: concurso.cor }}
          >
            Estudando para
          </p>
          <h3 className="text-base font-black text-white leading-tight truncate">
            {concurso.nome}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
            {concurso.area && (
              <span className="font-semibold" style={{ color: concurso.corAccent }}>
                {concurso.area}
              </span>
            )}
            <span className="text-slate-700">·</span>
            <span className="truncate">{concurso.orgao}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
