'use client';

// Componente client com botões de ação. A página server passa state inicial.
// Após cada ação, faz refresh manual via router.refresh() para re-buscar SSR.

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Upload,
  Download,
  AlertTriangle,
  FileText,
  PlayCircle,
} from 'lucide-react';
import type { MaterialRow } from '@/lib/study-materials';

interface MissingTarget {
  concursoSlug: string;
  concursoTitulo: string;
  disciplina: string;
  questionCount: number;
}

const STATUS_THEME: Record<string, { bg: string; color: string; border: string; label: string }> = {
  draft:      { bg: 'rgba(245,158,11,0.10)',  color: '#fbbf24', border: 'rgba(245,158,11,0.30)', label: 'Rascunho' },
  published:  { bg: 'rgba(16,185,129,0.10)',  color: '#34d399', border: 'rgba(16,185,129,0.30)', label: 'Publicado' },
  failed:     { bg: 'rgba(239,68,68,0.10)',   color: '#f87171', border: 'rgba(239,68,68,0.30)',  label: 'Falhou' },
  generating: { bg: 'rgba(59,130,246,0.10)',  color: '#60a5fa', border: 'rgba(59,130,246,0.30)', label: 'Gerando' },
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—';
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export function StudyMaterialsAdminClient({
  initialMaterials,
  missing,
}: {
  initialMaterials: MaterialRow[];
  missing: MissingTarget[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [batchRunning, setBatchRunning] = useState(false);

  async function callAction(url: string, init?: RequestInit) {
    setError(null);
    const res = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
    if (!res.ok) {
      let msg = 'Erro';
      try { const j = await res.json(); msg = j.error ?? msg; } catch { /* ignora */ }
      throw new Error(msg);
    }
    return res.json();
  }

  async function generateOne(concursoSlug: string, disciplina: string) {
    const key = `gen:${concursoSlug}|${disciplina}`;
    setBusyId(key);
    try {
      await callAction('/api/admin/study-materials', {
        method: 'POST',
        body: JSON.stringify({ concursoSlug, disciplina }),
      });
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyId(null);
    }
  }

  async function generateAll() {
    setBatchRunning(true);
    setError(null);
    try {
      await callAction('/api/admin/study-materials/generate-all', { method: 'POST', body: '{}' });
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBatchRunning(false);
    }
  }

  async function publish(materialId: number) {
    const key = `pub:${materialId}`;
    setBusyId(key);
    try {
      await callAction(`/api/admin/study-materials/${materialId}/publish`, { method: 'POST', body: '{}' });
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyId(null);
    }
  }

  async function unpublish(materialId: number) {
    const key = `pub:${materialId}`;
    setBusyId(key);
    try {
      await callAction(`/api/admin/study-materials/${materialId}/publish`, { method: 'DELETE' });
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyId(null);
    }
  }

  async function regenerate(material: MaterialRow) {
    return generateOne(material.concurso_slug, material.disciplina);
  }

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div
        className="rounded-2xl p-5 flex flex-wrap items-center gap-3 justify-between"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.40))',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">Geração em lote via IA</p>
          <p className="text-xs text-slate-400 mt-1">
            Gera material pra TODAS as combinações concurso × disciplina com questões cadastradas.
            Demora alguns minutos. Materiais ficam como rascunho até você publicar.
          </p>
        </div>
        <button
          onClick={generateAll}
          disabled={batchRunning || isPending}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black text-white transition disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #059669, #047857)',
            boxShadow: '0 0 16px rgba(16,185,129,0.30)',
          }}
        >
          {batchRunning ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {batchRunning ? 'Gerando todos...' : 'Gerar todos via IA'}
        </button>
      </div>

      {error && (
        <div
          className="px-4 py-3 rounded-xl flex items-start gap-3"
          style={{
            background: 'rgba(239,68,68,0.10)',
            border: '1px solid rgba(239,68,68,0.30)',
          }}
        >
          <AlertTriangle size={16} className="text-rose-400 mt-0.5 shrink-0" />
          <p className="text-sm text-rose-300">{error}</p>
        </div>
      )}

      {/* Lista de existentes */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">
          Materiais existentes ({initialMaterials.length})
        </h2>
        {initialMaterials.length === 0 ? (
          <div
            className="text-center py-12 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.40))',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <FileText size={28} className="text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              Nenhum material gerado ainda. Clique em "Gerar todos via IA" pra começar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {initialMaterials.map((m) => {
              const theme = STATUS_THEME[m.status] ?? STATUS_THEME.draft;
              const isBusy = busyId?.endsWith(`${m.id}`) || busyId === `gen:${m.concurso_slug}|${m.disciplina}`;
              return (
                <div
                  key={m.id}
                  className="rounded-xl p-4 flex flex-wrap items-center gap-4"
                  style={{
                    background: 'rgba(15,23,42,0.65)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                        style={{
                          background: theme.bg,
                          color: theme.color,
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        {theme.label}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {m.concurso_slug}
                      </span>
                    </div>
                    <p className="text-base font-bold text-white truncate">{m.disciplina}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {m.page_count ? `${m.page_count} págs · ` : ''}
                      {formatFileSize(m.file_size)}
                      {m.generated_at && ` · gerado em ${formatDate(m.generated_at)}`}
                      {m.published_at && ` · publicado em ${formatDate(m.published_at)}`}
                    </p>
                    {m.status === 'failed' && m.error_msg && (
                      <p className="text-xs text-rose-300 mt-2 font-mono">
                        {m.error_msg.slice(0, 200)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {m.blob_url && (
                      <a
                        href={m.blob_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition"
                        style={{
                          background: 'rgba(15,23,42,0.85)',
                          border: '1px solid rgba(255,255,255,0.10)',
                          color: '#cbd5e1',
                        }}
                      >
                        <Download size={14} />
                        PDF
                      </a>
                    )}
                    <button
                      onClick={() => regenerate(m)}
                      disabled={isBusy || isPending || m.status === 'generating'}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition disabled:opacity-50"
                      style={{
                        background: 'rgba(59,130,246,0.10)',
                        border: '1px solid rgba(59,130,246,0.30)',
                        color: '#93c5fd',
                      }}
                    >
                      {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      Regerar
                    </button>
                    {m.status === 'draft' && (
                      <button
                        onClick={() => publish(m.id)}
                        disabled={isBusy || isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black transition disabled:opacity-50 text-white"
                        style={{
                          background: 'linear-gradient(135deg, #059669, #047857)',
                          boxShadow: '0 0 12px rgba(16,185,129,0.25)',
                        }}
                      >
                        {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        Publicar
                      </button>
                    )}
                    {m.status === 'published' && (
                      <button
                        onClick={() => unpublish(m.id)}
                        disabled={isBusy || isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition disabled:opacity-50"
                        style={{
                          background: 'rgba(245,158,11,0.10)',
                          border: '1px solid rgba(245,158,11,0.30)',
                          color: '#fbbf24',
                        }}
                      >
                        {isBusy ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                        Despublicar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Pendentes (nunca foram gerados) */}
      {missing.length > 0 && (
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">
            Pendentes ({missing.length})
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            Combinações concurso × disciplina com questões cadastradas mas sem material gerado.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {missing.map((t) => {
              const key = `gen:${t.concursoSlug}|${t.disciplina}`;
              const isBusy = busyId === key;
              return (
                <div
                  key={key}
                  className="rounded-xl p-4 flex items-center gap-3"
                  style={{
                    background: 'rgba(15,23,42,0.40)',
                    border: '1px dashed rgba(255,255,255,0.10)',
                  }}
                >
                  <Clock size={18} className="text-slate-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-300 truncate">{t.disciplina}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {t.concursoTitulo} · {t.questionCount} questões
                    </p>
                  </div>
                  <button
                    onClick={() => generateOne(t.concursoSlug, t.disciplina)}
                    disabled={isBusy || isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition disabled:opacity-50"
                    style={{
                      background: 'rgba(16,185,129,0.10)',
                      border: '1px solid rgba(16,185,129,0.30)',
                      color: '#6ee7b7',
                    }}
                  >
                    {isBusy ? <Loader2 size={14} className="animate-spin" /> : <PlayCircle size={14} />}
                    Gerar
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
