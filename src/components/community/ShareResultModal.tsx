'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Share2, Loader2, Check, ExternalLink, Trophy } from 'lucide-react';
import { PostComposer } from './PostComposer';
import type { Post } from './types';

interface ShareResultData {
  acertos: number;
  total: number;
  disciplina?: string;
  capitulo?: string;
  accuracy: number;
  tempoSegundos?: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: ShareResultData;
  myAvatarId?: number;
}

/**
 * Modal que abre na tela final do bloco de estudo, pré-populando o composer
 * com `postType='result'` + metadata. Usuário edita e publica.
 *
 * Após sucesso: snackbar bottom-center com link "Ver no feed →".
 */
export function ShareResultModal({ isOpen, onClose, result, myAvatarId = 1 }: Props) {
  const router = useRouter();
  const [postedId, setPostedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const accuracyPct = result.accuracy;
  const dpart = result.disciplina ? ` em ${result.disciplina}` : '';
  const cpart = result.capitulo ? ` (cap. ${result.capitulo})` : '';
  const initialText = `Acertei ${result.acertos}/${result.total}${dpart}${cpart} — ${accuracyPct}% de precisão. Foco federal! 🎯`;

  const metadata = {
    acertos: result.acertos,
    total: result.total,
    disciplina: result.disciplina ?? null,
    capitulo: result.capitulo ?? null,
    accuracy: accuracyPct,
    tempoSegundos: result.tempoSegundos ?? null,
  };

  if (postedId) {
    // Snackbar de confirmação após publicação
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(4px)' }}
      >
        <div
          className="relative w-full max-w-md rounded-2xl p-6 text-center pointer-events-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(15,23,42,0.95))',
            border: '1px solid rgba(16,185,129,0.40)',
            boxShadow: '0 12px 40px rgba(16,185,129,0.25)',
          }}
        >
          <div
            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: 'rgba(16,185,129,0.20)',
              border: '1px solid rgba(16,185,129,0.40)',
            }}
          >
            <Check className="text-emerald-300 w-7 h-7" strokeWidth={3} />
          </div>
          <p className="text-lg font-black text-white">Compartilhado!</p>
          <p className="text-xs text-slate-400 mt-1">Seu resultado já está no feed da comunidade.</p>
          <div className="flex gap-2 mt-5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8',
              }}
            >
              Fechar
            </button>
            <button
              onClick={() => router.push('/dashboard/feed')}
              className="flex-1 py-2.5 rounded-xl text-sm font-black text-slate-950 inline-flex items-center justify-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 0 14px rgba(16,185,129,0.35)',
              }}
            >
              <ExternalLink size={14} />
              Ver no feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Compartilhar resultado"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.88) 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 20px 60px -12px rgba(0,0,0,0.7)',
          animation: 'srm-enter 0.2s ease-out',
        }}
      >
        <style>{`
          @keyframes srm-enter {
            from { opacity: 0; transform: scale(0.96) translateY(10px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        <div
          className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none rounded-t-3xl"
          style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4, #fbbf24)' }}
        />

        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 shrink-0 border-b border-white/5">
          <div
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.20), rgba(245,158,11,0.10))',
              border: '1px solid rgba(16,185,129,0.30)',
              boxShadow: '0 0 14px rgba(16,185,129,0.20)',
            }}
          >
            <Trophy size={16} className="text-emerald-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-white leading-tight truncate">
              Compartilhar resultado
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {result.acertos}/{result.total} · {accuracyPct}% de precisão
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

        {/* Composer pre-populated */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Edite a mensagem como preferir. O cartão de resultado é gerado automaticamente abaixo.
          </p>
          <ResultPreviewComposer
            initialText={initialText}
            metadata={metadata}
            myAvatarId={myAvatarId}
            onPosted={(post: Post) => setPostedId(post.id)}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper que pré-popula PostComposer com texto + força modo expandido.
 * Como PostComposer atual não aceita prop de "texto inicial", criamos um
 * wrapper minimal direto que reusa a estética e a lógica de POST.
 */
function ResultPreviewComposer({
  initialText,
  metadata,
  myAvatarId: _myAvatarId,
  onPosted,
}: {
  initialText: string;
  metadata: Record<string, unknown>;
  myAvatarId: number;
  onPosted: (post: Post) => void;
}) {
  const [text, setText] = useState(initialText);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!text.trim() || posting) return;
    setPosting(true);
    setError(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text.trim(),
          postType: 'result',
          metadata,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'falha ao publicar');
      }
      const data = await res.json();
      onPosted(data.post);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'erro');
    } finally {
      setPosting(false);
    }
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 500))}
        rows={4}
        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none resize-none transition"
        style={{
          background: 'rgba(15,23,42,0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#10b981';
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.15)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      <div className="flex items-center justify-between mt-2">
        <p className={`text-[11px] tabular-nums ${text.length > 480 ? 'text-amber-400' : 'text-slate-600'}`}>
          {text.length}/500
        </p>
        {error && <p className="text-[11px] font-bold text-rose-400">{error}</p>}
      </div>

      {/* Card de resultado preview (visual do que vai virar o post) */}
      <div
        className="mt-3 px-4 py-3 rounded-xl flex items-center gap-3"
        style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.25)',
        }}
      >
        <Trophy className="text-emerald-300 shrink-0" size={20} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white">
            {String(metadata.acertos)}/{String(metadata.total)}
            {typeof metadata.disciplina === 'string' && (
              <span className="text-slate-400 font-normal ml-2 text-xs">
                {metadata.disciplina}
              </span>
            )}
          </p>
          <div className="h-1.5 mt-1.5 rounded-full overflow-hidden bg-slate-800">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${metadata.accuracy}%`,
                background: 'linear-gradient(90deg, #10b981, #34d399)',
              }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={submit}
        disabled={posting || !text.trim()}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black text-slate-950 transition disabled:opacity-40"
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          boxShadow: posting ? 'none' : '0 0 14px rgba(16,185,129,0.35)',
        }}
      >
        {posting ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
        {posting ? 'Publicando...' : 'Compartilhar no Feed'}
      </button>
    </div>
  );
}
