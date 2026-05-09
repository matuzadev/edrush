'use client';

<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, Building2, Users, FileText, ChevronRight, BookOpen } from 'lucide-react';
import { getOrgaoConfig } from '@/lib/orgao-config';

interface Concurso {
  id: number;
  titulo: string;
  organizador: string;
  banca: string | null;
  vagas_total: number | null;
  descricao: string | null;
  status: string;
  logo_url: string | null;
}

function OrgaoLogo({ concurso }: { concurso: Concurso }) {
  const [imgError, setImgError] = useState(false);

  if (concurso.logo_url && !imgError) {
    return (
      <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-slate-800 flex items-center justify-center">
        <img
          src={concurso.logo_url}
          alt={concurso.organizador}
          className="w-8 h-8 object-contain"
=======
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Search,
  Building2,
  Users,
  FileText,
  ChevronRight,
  BookOpen,
  ExternalLink,
  Calendar,
  BadgeCheck,
  Award,
  Clock,
  CheckCircle2,
  Circle,
  MapPin,
  Banknote,
  GraduationCap,
  Filter,
  AlertCircle,
} from 'lucide-react';
import { getOrgaoConfig } from '@/lib/orgao-config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConcursoFull {
  id: number;
  slug: string;
  titulo: string;
  organizador: string;
  orgao: string;
  cargo: string | null;
  area_especialidade: string | null;
  descricao: string | null;
  edital_numero: string | null;
  edital_ano: number | null;
  banca: string | null;
  vagas_total: number | null;
  vagas_cargo: number | null;
  remuneracao_inicial: number | null;
  nivel_escolaridade: string | null;
  data_publicacao_edital: string | null;
  data_abertura_inscricoes: string | null;
  data_fechamento_inscricoes: string | null;
  data_prova_objetiva: string | null;
  data_prova_discursiva: string | null;
  data_resultado_final: string | null;
  url_edital: string | null;
  url_site_oficial: string | null;
  url_inscricao: string | null;
  status: 'previsto' | 'edital_proximo' | 'inscricoes_abertas' | 'aguardando_prova' | 'finalizado';
  fonte_scrape: string | null;
  destaque: boolean;
  logo_url: string | null;
  uf?: { sigla: string; nome: string } | null;
}

type StatusFilter = 'all' | ConcursoFull['status'];

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
}

function formatDateShort(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
}

function isPast(iso: string): boolean {
  const [year, month, day] = iso.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d < new Date();
}

// ─── Status helpers ────────────────────────────────────────────────────────────

interface StatusConfig {
  label: string;
  className: string;
  dotClass?: string;
}

function getStatusConfig(status: ConcursoFull['status'] | string | null | undefined): StatusConfig {
  switch (status) {
    case 'previsto':
      return { label: 'Previsto', className: 'bg-slate-700/60 text-slate-300 border border-slate-600/40' };
    case 'edital_proximo':
      return { label: 'Edital Próximo', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/25' };
    case 'inscricoes_abertas':
      return {
        label: 'Inscrições Abertas',
        className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
        dotClass: 'bg-emerald-400 animate-pulse',
      };
    case 'aguardando_prova':
      return { label: 'Aguardando Prova', className: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' };
    case 'finalizado':
      return { label: 'Finalizado', className: 'bg-slate-800/80 text-slate-500 border border-slate-700/40' };
    case 'ativo':
      // Compat com registros legados anteriores ao novo enum de status.
      return {
        label: 'Ativo',
        className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
        dotClass: 'bg-emerald-400 animate-pulse',
      };
    default:
      return { label: 'Indefinido', className: 'bg-slate-800/80 text-slate-500 border border-slate-700/40' };
  }
}

const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  all: 'Todos',
  previsto: 'Previstos',
  edital_proximo: 'Edital Próximo',
  inscricoes_abertas: 'Inscrições Abertas',
  aguardando_prova: 'Aguardando Prova',
  finalizado: 'Finalizados',
};

// ─── OrgaoLogo ────────────────────────────────────────────────────────────────

function OrgaoLogo({
  concurso,
  size = 'md',
}: {
  concurso: Pick<ConcursoFull, 'logo_url' | 'organizador'>;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  const imgSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };
  const fontSizeStyle = {
    sm: '9px',
    md: '10px',
    lg: '13px',
  };

  if (concurso.logo_url && !imgError) {
    return (
      <div
        className={`flex-shrink-0 ${sizeClasses[size]} rounded-xl overflow-hidden border border-white/10 bg-slate-800 flex items-center justify-center`}
      >
        <img
          src={concurso.logo_url}
          alt={concurso.organizador}
          className={`${imgSizeClasses[size]} object-contain`}
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  const cfg = getOrgaoConfig(concurso.organizador);
<<<<<<< HEAD
  const fontSize = cfg.initials.length > 3 ? 'text-[9px]' : cfg.initials.length === 3 ? 'text-[10px]' : 'text-xs';

  return (
    <div
      className={`flex-shrink-0 w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center font-black ${fontSize} tracking-tight`}
      style={{ backgroundColor: cfg.color, color: cfg.textColor }}
    >
      {cfg.initials}
=======
  const initials = cfg.initials;
  const fs = initials.length > 3 ? 'text-[9px]' : initials.length === 3 ? 'text-[10px]' : 'text-xs';

  return (
    <div
      className={`flex-shrink-0 ${sizeClasses[size]} rounded-xl border border-white/10 flex items-center justify-center font-black ${fs} tracking-tight`}
      style={{
        backgroundColor: cfg.color,
        color: cfg.textColor,
        fontSize: size === 'lg' ? fontSizeStyle.lg : undefined,
      }}
    >
      {initials}
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
    </div>
  );
}

<<<<<<< HEAD
export default function SelectConcursoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [filtered, setFiltered] = useState<Concurso[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
=======
// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ConcursoFull['status'] }) {
  const cfg = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}
    >
      {cfg.dotClass && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />}
      {cfg.label}
    </span>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

interface TimelineStep {
  label: string;
  date: string | null;
}

function ConcursoTimeline({ concurso }: { concurso: ConcursoFull }) {
  const steps: TimelineStep[] = [
    { label: 'Edital', date: concurso.data_publicacao_edital },
    { label: 'Inscrições', date: concurso.data_abertura_inscricoes },
    { label: 'Prova Objetiva', date: concurso.data_prova_objetiva },
    { label: 'Resultado', date: concurso.data_resultado_final },
  ];

  const visibleSteps = steps.filter((s) => s.date !== null);
  if (visibleSteps.length === 0) return null;

  return (
    <div className="mt-5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Cronograma</p>
      <div className="relative">
        {/* connecting line */}
        <div className="absolute top-3 left-3 right-3 h-px bg-white/10 z-0" />
        <div className="relative z-10 flex justify-between gap-2">
          {visibleSteps.map((step, i) => {
            const done = step.date ? isPast(step.date) : false;
            const isLast = i === visibleSteps.length - 1;
            return (
              <div key={i} className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-1.5 transition-colors ${
                    done
                      ? 'bg-emerald-500 border border-emerald-400'
                      : isLast
                      ? 'bg-slate-800 border border-slate-600'
                      : 'bg-slate-800 border border-slate-600'
                  }`}
                >
                  {done ? (
                    <CheckCircle2 size={12} className="text-white" />
                  ) : (
                    <Circle size={10} className="text-slate-500" />
                  )}
                </div>
                <p className={`text-[10px] font-semibold text-center leading-tight mb-0.5 ${done ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-[9px] text-slate-500 text-center leading-tight">
                    {formatDateShort(step.date)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Featured Card ────────────────────────────────────────────────────────────

function FeaturedCard({
  concurso,
  onSelect,
}: {
  concurso: ConcursoFull;
  onSelect: (c: ConcursoFull) => void;
}) {
  return (
    <div className="featured-card relative overflow-hidden rounded-2xl mb-8">
      <style>{`
        @keyframes featuredShimmer {
          0%   { transform: translateX(-110%) skewX(-14deg); }
          100% { transform: translateX(240%)  skewX(-14deg); }
        }
        .featured-card:hover .featured-shine {
          animation: featuredShimmer 1.4s ease-out;
        }
        @keyframes featuredPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 0.9; }
        }
        .featured-glow-pulse {
          animation: featuredPulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(6,78,59,0.45) 0%, rgba(2,6,23,0.90) 45%, rgba(8,51,68,0.40) 100%)',
        }}
      />
      {/* Border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: '1px solid rgba(16,185,129,0.35)' }}
      />
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.8), rgba(6,182,212,0.6), transparent)',
        }}
      />
      {/* Glow blobs */}
      <div
        className="featured-glow-pulse absolute -left-16 -top-16 w-56 h-56 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -right-20 -bottom-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)' }}
      />
      {/* Shimmer sweep */}
      <div
        className="featured-shine absolute top-0 -left-1/3 h-full w-1/3 pointer-events-none opacity-50"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.15), transparent)' }}
      />

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-7">
        {/* Top row: logo + title + destaque badge */}
        <div className="flex items-start gap-4 mb-5">
          <OrgaoLogo concurso={concurso} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: 'linear-gradient(90deg, rgba(234,179,8,0.18), rgba(16,185,129,0.14))',
                  border: '1px solid rgba(234,179,8,0.35)',
                  color: '#fbbf24',
                }}
              >
                <Award size={9} />
                Destaque
              </span>
              <StatusBadge status={concurso.status} />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
              {concurso.cargo ?? concurso.titulo}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">{concurso.organizador}</p>
            {concurso.area_especialidade && (
              <p className="text-xs text-cyan-400 mt-0.5">{concurso.area_especialidade}</p>
            )}
          </div>
        </div>

        {/* Meta chips row */}
        <div className="flex flex-wrap gap-2 mb-5">
          {concurso.edital_numero && (
            <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/8 rounded-lg px-2.5 py-1 text-xs text-slate-300">
              <FileText size={11} className="text-slate-400" />
              {concurso.edital_numero}
              {concurso.edital_ano && ` (${concurso.edital_ano})`}
            </span>
          )}
          {concurso.banca && (
            <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/8 rounded-lg px-2.5 py-1 text-xs text-slate-300">
              <BadgeCheck size={11} className="text-slate-400" />
              {concurso.banca}
            </span>
          )}
          {concurso.nivel_escolaridade && (
            <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/8 rounded-lg px-2.5 py-1 text-xs text-slate-300">
              <GraduationCap size={11} className="text-slate-400" />
              {concurso.nivel_escolaridade}
            </span>
          )}
          {concurso.uf && (
            <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/8 rounded-lg px-2.5 py-1 text-xs text-slate-300">
              <MapPin size={11} className="text-slate-400" />
              {concurso.uf.sigla}
            </span>
          )}
        </div>

        {/* Stats: vagas + salary */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {(concurso.vagas_cargo ?? concurso.vagas_total) && (
            <div
              className="rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Users size={12} className="text-slate-400" />
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Vagas</p>
              </div>
              <p className="text-base font-black text-white leading-none">
                {(concurso.vagas_cargo ?? concurso.vagas_total)!.toLocaleString('pt-BR')}
              </p>
              {concurso.vagas_cargo && concurso.vagas_total && concurso.vagas_cargo !== concurso.vagas_total && (
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {concurso.vagas_total.toLocaleString('pt-BR')} no total
                </p>
              )}
            </div>
          )}
          {concurso.remuneracao_inicial && (
            <div
              className="rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Banknote size={12} className="text-slate-400" />
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Salário Inicial</p>
              </div>
              <p className="text-base font-black text-emerald-400 leading-none">
                {formatBRL(concurso.remuneracao_inicial)}
              </p>
            </div>
          )}
        </div>

        {/* Inscription highlight */}
        {concurso.data_abertura_inscricoes && concurso.status === 'inscricoes_abertas' && (
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.22)',
            }}
          >
            <Clock size={13} className="text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-emerald-300">
              Inscrições abertas até{' '}
              <span className="font-bold">
                {concurso.data_fechamento_inscricoes
                  ? formatDate(concurso.data_fechamento_inscricoes)
                  : 'data a confirmar'}
              </span>
            </p>
          </div>
        )}

        {/* Timeline */}
        <ConcursoTimeline concurso={concurso} />

        {/* Actions */}
        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onSelect(concurso)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #059669, #10b981)',
              boxShadow: '0 4px 20px -6px rgba(16,185,129,0.5)',
            }}
          >
            Selecionar este concurso
            <ChevronRight size={16} />
          </button>
          {concurso.url_edital && (
            <a
              href={concurso.url_edital}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-sm text-slate-300 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <FileText size={14} />
              Ver Edital
              <ExternalLink size={11} className="text-slate-500" />
            </a>
          )}
          {concurso.url_site_oficial && (
            <a
              href={concurso.url_site_oficial}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-sm text-slate-300 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
              Site oficial
            </a>
          )}
        </div>

        {/* Source cite */}
        {concurso.fonte_scrape && (
          <p className="mt-3 text-[10px] text-slate-600 text-right">
            Fonte: {concurso.fonte_scrape}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── List Card ────────────────────────────────────────────────────────────────

function ConcursoCard({
  concurso,
  onSelect,
}: {
  concurso: ConcursoFull;
  onSelect: (c: ConcursoFull) => void;
}) {
  const nextDate = concurso.data_abertura_inscricoes ?? concurso.data_prova_objetiva ?? concurso.data_resultado_final;

  return (
    <button
      onClick={() => onSelect(concurso)}
      className="group text-left w-full bg-white/[0.025] hover:bg-white/[0.055] rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/8"
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(16,185,129,0.30)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
      }}
    >
      <div className="flex items-start gap-3">
        <OrgaoLogo concurso={concurso} size="md" />

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm leading-snug mb-1.5 group-hover:text-emerald-300 transition-colors line-clamp-2">
            {concurso.cargo ?? concurso.titulo}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2.5">
            <Building2 size={11} />
            <span className="truncate">{concurso.organizador}</span>
            {concurso.banca && (
              <>
                <span className="text-slate-700">·</span>
                <span className="text-slate-500 font-medium">{concurso.banca}</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={concurso.status} />

            {(concurso.vagas_cargo ?? concurso.vagas_total) && (
              <span className="inline-flex items-center gap-1 bg-slate-800/60 border border-white/5 rounded-lg px-2 py-0.5 text-[11px] text-slate-300">
                <Users size={10} />
                {(concurso.vagas_cargo ?? concurso.vagas_total)!.toLocaleString('pt-BR')} vagas
              </span>
            )}

            {nextDate && (
              <span className="inline-flex items-center gap-1 bg-slate-800/60 border border-white/5 rounded-lg px-2 py-0.5 text-[11px] text-slate-400">
                <Calendar size={10} />
                {formatDateShort(nextDate)}
              </span>
            )}
          </div>

          {concurso.remuneracao_inicial && (
            <p className="text-xs text-emerald-400 font-semibold mt-2">
              {formatBRL(concurso.remuneracao_inicial)}
            </p>
          )}

          {concurso.fonte_scrape && (
            <p className="text-[10px] text-slate-700 mt-1.5">Fonte: {concurso.fonte_scrape}</p>
          )}
        </div>

        <div className="flex-shrink-0 w-8 h-8 bg-slate-800/70 group-hover:bg-emerald-500/15 border border-white/5 group-hover:border-emerald-500/25 rounded-xl flex items-center justify-center transition-all self-center">
          <ChevronRight
            size={14}
            className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </div>
    </button>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 animate-pulse"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-800 rounded-lg w-3/4" />
          <div className="h-3 bg-slate-800/70 rounded-lg w-1/2" />
          <div className="flex gap-2 mt-1">
            <div className="h-5 bg-slate-800/60 rounded-full w-24" />
            <div className="h-5 bg-slate-800/60 rounded-full w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div
      className="rounded-2xl p-6 mb-8 animate-pulse"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="w-16 h-16 rounded-xl bg-slate-800 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-800 rounded-lg w-1/3" />
          <div className="h-5 bg-slate-800 rounded-lg w-2/3" />
          <div className="h-3 bg-slate-800/70 rounded-lg w-1/2" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-7 bg-slate-800/60 rounded-lg w-36" />
        <div className="h-7 bg-slate-800/60 rounded-lg w-24" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="h-16 bg-slate-800/50 rounded-xl" />
        <div className="h-16 bg-slate-800/50 rounded-xl" />
      </div>
      <div className="h-10 bg-slate-800/50 rounded-xl" />
    </div>
  );
}

// ─── Filter chips ─────────────────────────────────────────────────────────────

function FilterChips({
  active,
  onChange,
  counts,
}: {
  active: StatusFilter;
  onChange: (f: StatusFilter) => void;
  counts: Partial<Record<StatusFilter, number>>;
}) {
  const filters: StatusFilter[] = [
    'all',
    'inscricoes_abertas',
    'aguardando_prova',
    'edital_proximo',
    'previsto',
    'finalizado',
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
      {filters.map((f) => {
        const count = counts[f] ?? 0;
        if (f !== 'all' && count === 0) return null;
        const isActive = active === f;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
            style={
              isActive
                ? {
                    background: 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(16,185,129,0.40)',
                    color: '#34d399',
                  }
                : {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#94a3b8',
                  }
            }
          >
            {f === 'all' ? <Filter size={11} /> : null}
            {STATUS_FILTER_LABELS[f]}
            {f !== 'all' && count > 0 && (
              <span
                className="rounded-full px-1.5 py-px text-[10px]"
                style={
                  isActive
                    ? { background: 'rgba(16,185,129,0.25)', color: '#34d399' }
                    : { background: 'rgba(255,255,255,0.07)', color: '#64748b' }
                }
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SelectConcursoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [concursos, setConcursos] = useState<ConcursoFull[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated') {
      fetchConcursos();
    }
  }, [status, router]);

<<<<<<< HEAD
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
=======
  async function fetchConcursos() {
    try {
      // Sem filtro de status na URL: a API retorna todos os concursos
      // (incluindo "finalizado") para o usuário poder estudar usando edital
      // recente como referência. O filtro por status é feito client-side via
      // os chips de filtro abaixo.
      const res = await fetch('/api/concursos');
      if (res.ok) {
        const data = await res.json();
        setConcursos(data as ConcursoFull[]);
      }
    } catch {
      // silently fail — list will be empty
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
    } finally {
      setIsLoading(false);
    }
  }

<<<<<<< HEAD
  function handleSelect(concurso: Concurso) {
=======
  function handleSelect(concurso: ConcursoFull) {
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
    const params = new URLSearchParams({
      concursoId: String(concurso.id),
      concursoTitle: concurso.titulo,
    });
    router.push(`/onboarding/select-area?${params.toString()}`);
  }

<<<<<<< HEAD
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-slate-900 to-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Carregando concursos...</p>
=======
  const featured = useMemo(
    () => concursos.filter((c) => c.destaque).slice(0, 2),
    [concursos]
  );

  // "Todos os Concursos" inclui os destaques também — o usuário pediu para
  // que concursos em destaque apareçam também na lista completa abaixo, não
  // apenas na seção "Em Destaque". A duplicação visual é intencional.
  const nonFeatured = useMemo(
    () => concursos,
    [concursos]
  );

  const statusCounts = useMemo<Partial<Record<StatusFilter, number>>>(() => {
    const counts: Partial<Record<StatusFilter, number>> = { all: nonFeatured.length };
    for (const c of nonFeatured) {
      counts[c.status] = (counts[c.status] ?? 0) + 1;
    }
    return counts;
  }, [nonFeatured]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return nonFeatured.filter((c) => {
      const matchSearch =
        c.titulo.toLowerCase().includes(q) ||
        c.organizador.toLowerCase().includes(q) ||
        (c.banca ?? '').toLowerCase().includes(q) ||
        (c.cargo ?? '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, nonFeatured, statusFilter]);

  // Loading: show skeletons
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen px-4 py-12" style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 60%, #020617 100%)' }}>
        {/* BG glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-3/4 h-3/4 rounded-full blur-3xl opacity-[0.04]" style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
          <div className="absolute -bottom-1/3 -right-1/4 w-2/3 h-2/3 rounded-full blur-3xl opacity-[0.04]" style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-10">
            <div className="inline-block h-6 w-28 bg-slate-800 rounded-full mb-6 animate-pulse" />
            <div className="h-10 bg-slate-800 rounded-xl w-3/4 mx-auto mb-3 animate-pulse" />
            <div className="h-5 bg-slate-800/60 rounded-lg w-2/3 mx-auto animate-pulse" />
          </div>
          <div className="h-12 bg-slate-800/60 rounded-xl mb-8 animate-pulse" />
          <FeaturedSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div
      className="min-h-screen px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 60%, #020617 100%)' }}
    >
      {/* BG glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/4 w-3/4 h-3/4 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-1/3 -right-1/4 w-2/3 h-2/3 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{
              background: 'linear-gradient(90deg, rgba(16,185,129,0.12), rgba(6,182,212,0.10))',
              border: '1px solid rgba(16,185,129,0.28)',
              boxShadow: '0 0 24px -8px rgba(16,185,129,0.3)',
            }}
          >
            <BookOpen size={13} className="text-emerald-400" />
            <span
              className="text-[11px] font-black uppercase tracking-[0.18em]"
              style={{
                background: 'linear-gradient(90deg, #34d399, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Passo 1 de 2
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
            Qual concurso você está{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #34d399, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              estudando?
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            Selecione o concurso para personalizar seu plano de estudos com as matérias e questões certas.
          </p>
        </div>

        {/* ── Search ── */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
<<<<<<< HEAD
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
                <div className="flex items-start gap-3">
                  {/* Logo do órgão */}
                  <OrgaoLogo concurso={concurso} />

                  {/* Conteúdo */}
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

                  {/* Seta */}
                  <div className="flex-shrink-0 w-9 h-9 bg-slate-800 group-hover:bg-emerald-500/20 border border-white/5 group-hover:border-emerald-500/30 rounded-xl flex items-center justify-center transition-all self-center">
                    <ChevronRight
                      size={16}
                      className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </div>
              </button>
=======
            placeholder="Buscar por cargo, órgão ou banca..."
            className="w-full pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.035)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '14px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = 'rgba(16,185,129,0.45)';
              (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.04)';
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.09)';
              (e.target as HTMLInputElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04)';
            }}
          />
        </div>

        {/* ── Featured concursos ── */}
        {featured.length > 0 && search === '' && statusFilter === 'all' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award size={14} className="text-amber-400" />
              <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Em Destaque</p>
            </div>
            {featured.map((c) => (
              <FeaturedCard key={c.id} concurso={c} onSelect={handleSelect} />
            ))}
          </div>
        )}

        {/* ── Filter chips (only show when there are non-featured) ── */}
        {nonFeatured.length > 0 && (
          <>
            {featured.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={14} className="text-slate-400" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Todos os Concursos</p>
              </div>
            )}
            <FilterChips active={statusFilter} onChange={setStatusFilter} counts={statusCounts} />
          </>
        )}

        {/* ── List / Empty state ── */}
        {filtered.length === 0 && featured.length === 0 ? (
          /* Completely empty */
          <div className="text-center py-20">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <AlertCircle size={32} className="text-slate-600" />
            </div>
            <p className="text-white font-bold text-lg mb-2">Nenhum concurso disponível</p>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Novos concursos são adicionados frequentemente. Volte em breve!
            </p>
          </div>
        ) : filtered.length === 0 ? (
          /* Search/filter returned nothing */
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Search size={24} className="text-slate-600" />
            </div>
            <p className="text-white font-semibold mb-1">Nenhum resultado encontrado</p>
            <p className="text-slate-500 text-sm">Tente outro termo ou mude o filtro de status.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((concurso, i) => (
              <div
                key={concurso.id}
                className="opacity-0 translate-y-2"
                style={{
                  animation: `fadeInUp 0.35s ease-out ${i * 60}ms forwards`,
                }}
              >
                <ConcursoCard concurso={concurso} onSelect={handleSelect} />
              </div>
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
            ))}
          </div>
        )}
      </div>
<<<<<<< HEAD
=======

      <style>{`
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
    </div>
  );
}
