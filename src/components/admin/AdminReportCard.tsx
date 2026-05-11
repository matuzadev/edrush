'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Flag,
  AlertCircle,
  Trash2,
  Check,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Loader2,
  ExternalLink,
  UserX,
} from 'lucide-react';

export interface AdminReport {
  id: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed' | string;
  createdAt: string;
  targetType: 'post' | 'comment' | string;
  targetId: string;
  reporter: {
    id: string;
    nome: string | null;
    username: string | null;
  };
  target: {
    content: string;
    authorId: string | null;
    authorName: string | null;
    authorUsername: string | null;
    authorAvatarId: number | null;
    likesCount: number;
    commentsCount: number;
    deletedAt: string | null;
    missing: boolean;
  };
}

interface Props {
  report: AdminReport;
  onActionComplete?: (reportId: string, action: 'remove' | 'dismiss' | 'delete') => void;
}

const REASON_LABELS: Record<string, string> = {
  spam: 'spam',
  offensive: 'ofensivo',
  misinformation: 'desinformação',
  other: 'outro',
};

const REASON_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  spam: { color: '#fbbf24', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.30)' },
  offensive: { color: '#fb7185', bg: 'rgba(244,63,94,0.10)', border: 'rgba(244,63,94,0.35)' },
  misinformation: { color: '#a78bfa', bg: 'rgba(168,85,247,0.10)', border: 'rgba(168,85,247,0.30)' },
  other: { color: '#94a3b8', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.30)' },
};

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return 'agora';
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `há ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `há ${d}d`;
  const mo = Math.floor(d / 30);
  return `há ${mo}m`;
}

function authorHandle(name: string | null, username: string | null): string {
  if (username) return `@${username}`;
  if (name) return name;
  return 'usuário desconhecido';
}

export function AdminReportCard({ report, onActionComplete }: Props) {
  const [busy, setBusy] = useState<null | 'remove' | 'dismiss' | 'delete'>(null);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [done, setDone] = useState<null | 'remove' | 'dismiss' | 'delete'>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  async function doRemove() {
    if (busy) return;
    const ok = window.confirm(
      `Tem certeza? Isso oculta o ${report.targetType === 'post' ? 'post' : 'comentário'} permanentemente.`
    );
    if (!ok) return;
    setBusy('remove');
    setError(null);
    try {
      const res = await fetch(`/api/admin/reports/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? 'Erro ao remover');
        return;
      }
      setDone('remove');
      onActionComplete?.(report.id, 'remove');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro');
    } finally {
      setBusy(null);
    }
  }

  async function doDismiss() {
    if (busy) return;
    setBusy('dismiss');
    setError(null);
    try {
      const res = await fetch(`/api/admin/reports/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? 'Erro ao dispensar');
        return;
      }
      setDone('dismiss');
      onActionComplete?.(report.id, 'dismiss');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro');
    } finally {
      setBusy(null);
    }
  }

  async function doHardDelete() {
    if (busy) return;
    const ok = window.confirm(
      'Excluir permanentemente esta denúncia (sem afetar o conteúdo)?'
    );
    if (!ok) return;
    setBusy('delete');
    setError(null);
    try {
      const res = await fetch(`/api/admin/reports/${report.id}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? 'Erro ao excluir');
        return;
      }
      setDone('delete');
      onActionComplete?.(report.id, 'delete');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro');
    } finally {
      setBusy(null);
      setMenuOpen(false);
    }
  }

  const reasonKey = report.reason in REASON_LABELS ? report.reason : 'other';
  const reasonTint = REASON_COLORS[reasonKey] ?? REASON_COLORS.other;
  const reporterHandle = authorHandle(report.reporter.nome, report.reporter.username);
  const authorLabel = authorHandle(report.target.authorName, report.target.authorUsername);
  const isResolvedView = report.status !== 'pending';

  if (done) {
    const tint =
      done === 'remove'
        ? { color: '#fb7185', bg: 'rgba(244,63,94,0.10)', label: 'Conteúdo removido' }
        : done === 'dismiss'
          ? { color: '#94a3b8', bg: 'rgba(100,116,139,0.10)', label: 'Denúncia dispensada' }
          : { color: '#94a3b8', bg: 'rgba(100,116,139,0.10)', label: 'Denúncia excluída' };
    return (
      <div
        className="rounded-2xl p-5 flex items-center gap-3"
        style={{
          background: tint.bg,
          border: `1px solid ${tint.color}33`,
        }}
      >
        <Check size={18} style={{ color: tint.color }} />
        <p className="text-sm font-bold" style={{ color: tint.color }}>
          {tint.label}
        </p>
      </div>
    );
  }

  return (
    <article
      className="relative rounded-2xl p-5 transition-all hover:-translate-y-0.5"
      style={{
        background:
          'linear-gradient(135deg, rgba(15,23,42,0.90) 0%, rgba(15,23,42,0.40) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 24px -12px rgba(0,0,0,0.5)',
      }}
    >
      {/* Cabeçalho do report */}
      <header className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: reasonTint.bg,
              border: `1px solid ${reasonTint.border}`,
            }}
          >
            <AlertCircle size={14} style={{ color: reasonTint.color }} />
          </div>
          <span
            className="text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded"
            style={{
              background: reasonTint.bg,
              color: reasonTint.color,
              border: `1px solid ${reasonTint.border}`,
            }}
          >
            <Flag size={10} className="inline -mt-0.5 mr-1" />
            Denúncia · {REASON_LABELS[reasonKey] ?? reasonKey}
          </span>
          <span className="text-[11px] text-slate-500 font-bold">
            {relativeTime(report.createdAt)}
          </span>
          {isResolvedView && (
            <span
              className="text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded"
              style={{
                background:
                  report.status === 'resolved'
                    ? 'rgba(244,63,94,0.10)'
                    : 'rgba(100,116,139,0.10)',
                color: report.status === 'resolved' ? '#fb7185' : '#94a3b8',
                border:
                  report.status === 'resolved'
                    ? '1px solid rgba(244,63,94,0.30)'
                    : '1px solid rgba(100,116,139,0.30)',
              }}
            >
              {report.status === 'resolved' ? 'Resolvida' : 'Dispensada'}
            </span>
          )}
        </div>

        {/* Menu "..." */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-lg hover:bg-white/5 transition text-slate-400 hover:text-white"
            aria-label="Mais opções"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 z-20 min-w-[200px] rounded-xl py-1 shadow-2xl"
              style={{
                background: 'rgba(15,23,42,0.97)',
                border: '1px solid rgba(255,255,255,0.10)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {report.target.authorUsername && (
                <a
                  href={`/dashboard/profile/${report.target.authorUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <ExternalLink size={12} />
                  Ver perfil do autor
                </a>
              )}
              <button
                type="button"
                disabled
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 cursor-not-allowed"
                title="Disponível em breve"
              >
                <UserX size={12} />
                Banir usuário (TODO)
              </button>
              <div className="my-1 border-t border-white/5" />
              <button
                type="button"
                onClick={doHardDelete}
                disabled={busy !== null}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition disabled:opacity-50"
              >
                {busy === 'delete' ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
                Excluir denúncia
              </button>
            </div>
          )}
        </div>
      </header>

      <p className="text-xs text-slate-400 mb-3">
        Denunciado por <span className="text-slate-200 font-bold">{reporterHandle}</span>
      </p>

      {/* Card aninhado com o conteúdo denunciado */}
      <div
        className="rounded-xl p-4 mb-4"
        style={{
          background: 'rgba(2,6,23,0.65)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="text-[9px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded"
            style={{
              background: 'rgba(34,211,238,0.10)',
              color: '#22d3ee',
              border: '1px solid rgba(34,211,238,0.30)',
            }}
          >
            {report.targetType === 'post' ? 'Post' : 'Comentário'}
          </span>
          <span className="text-xs font-bold text-slate-200">{authorLabel}</span>
          {report.target.deletedAt && (
            <span className="text-[10px] uppercase tracking-widest font-black text-rose-400">
              · já removido
            </span>
          )}
          {report.target.missing && (
            <span className="text-[10px] uppercase tracking-widest font-black text-amber-400">
              · indisponível
            </span>
          )}
        </div>
        <p className="text-sm text-slate-200 whitespace-pre-wrap break-words">
          {report.target.content
            ? `"${report.target.content}"`
            : '(conteúdo vazio)'}
        </p>
        <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500 font-bold">
          <span className="inline-flex items-center gap-1">
            <Heart size={11} /> {report.target.likesCount}
          </span>
          {report.targetType === 'post' && (
            <span className="inline-flex items-center gap-1">
              <MessageCircle size={11} /> {report.target.commentsCount}
            </span>
          )}
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div
          className="mb-3 px-3 py-2 rounded-lg text-xs font-bold"
          style={{
            background: 'rgba(244,63,94,0.10)',
            color: '#fb7185',
            border: '1px solid rgba(244,63,94,0.30)',
          }}
        >
          {error}
        </div>
      )}

      {/* Ações (somente quando pendente) */}
      {!isResolvedView && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={doRemove}
            disabled={busy !== null || report.target.missing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #f43f5e, #be123c)',
              boxShadow: '0 0 12px rgba(244,63,94,0.30)',
            }}
          >
            {busy === 'remove' ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
            Remover {report.targetType === 'post' ? 'post' : 'comentário'}
          </button>
          <button
            type="button"
            onClick={doDismiss}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition disabled:opacity-50"
            style={{
              background: 'rgba(100,116,139,0.15)',
              color: '#cbd5e1',
              border: '1px solid rgba(100,116,139,0.35)',
            }}
          >
            {busy === 'dismiss' ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Check size={12} />
            )}
            Dispensar
          </button>
        </div>
      )}
    </article>
  );
}
