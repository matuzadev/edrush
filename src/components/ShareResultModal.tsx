'use client';

import { useEffect, useState } from 'react';
import { X, Send, Loader2, Trophy, Check } from 'lucide-react';
import { getAvatar } from '@/data/avatars';

interface FriendOption {
  userId: string;
  nome: string | null;
  username: string | null;
  avatar_id: number;
}

export interface ShareResultPayload {
  accuracy: number;
  total: number;
  correct: number;
  subject?: string;
}

interface ShareResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ShareResultPayload;
  defaultMessage?: string;
}

export function ShareResultModal({ isOpen, onClose, result, defaultMessage }: ShareResultModalProps) {
  const [friends, setFriends] = useState<FriendOption[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState(defaultMessage ?? '');
  const [isSending, setIsSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    setSentTo(null);
    fetch('/api/friends')
      .then(r => r.ok ? r.json() : { friends: [] })
      .then(d => setFriends(d.friends ?? []))
      .catch(() => setFriends([]))
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const accuracy = result.accuracy;
  const accColor = accuracy >= 70 ? '#10b981' : accuracy >= 50 ? '#eab308' : '#ef4444';

  const handleSend = async () => {
    if (!selected || isSending) return;
    setIsSending(true);
    try {
      const summary = `Acabei uma sessão${result.subject ? ` de ${result.subject.replace(/-/g, ' ')}` : ''} — ${result.correct}/${result.total} (${accuracy}%)`;
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selected,
          content: note.trim() || summary,
          type: 'result',
          payload: result,
        }),
      });
      if (res.ok) {
        const friend = friends.find(f => f.userId === selected);
        setSentTo(friend?.username ?? friend?.nome ?? 'amigo');
        setTimeout(() => { onClose(); setSentTo(null); }, 1400);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.97), rgba(15,23,42,0.88))',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 20px 60px -12px rgba(0,0,0,0.7)',
          animation: 'shareEnter 0.2s ease-out',
        }}
      >
        <style>{`
          @keyframes shareEnter {
            from { opacity: 0; transform: scale(0.95) translateY(8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        <div
          className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)' }}
        />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-white/8">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-white">Compartilhar resultado</h3>
            <p className="text-xs text-slate-500">Envie sua sessão para um amigo</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview do resultado */}
        <div className="px-5 py-4">
          <div
            className="rounded-2xl p-4 mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.10), rgba(59,130,246,0.05))',
              border: '1px solid rgba(6,182,212,0.20)',
            }}
          >
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Acerto</p>
                <p className="text-2xl font-black tabular-nums" style={{ color: accColor }}>{accuracy}%</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Corretas</p>
                <p className="text-2xl font-black tabular-nums text-emerald-400">{result.correct}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Total</p>
                <p className="text-2xl font-black tabular-nums text-white">{result.total}</p>
              </div>
            </div>
            {result.subject && (
              <p className="text-[11px] text-slate-400 mt-2 text-center capitalize">
                {result.subject.replace(/-/g, ' ')}
              </p>
            )}
          </div>

          {/* Nota opcional */}
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Adicione uma mensagem (opcional)…"
            rows={2}
            maxLength={200}
            className="w-full resize-none px-3 py-2 rounded-xl bg-slate-800/60 border border-white/8 text-white text-sm placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/15 mb-4"
          />

          {/* Lista de amigos */}
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">
            Para quem?
          </p>
          <div className="max-h-52 overflow-y-auto space-y-1.5 mb-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">
                Você ainda não tem amigos para compartilhar.
              </div>
            ) : (
              friends.map(f => {
                const avatar = getAvatar(f.avatar_id);
                const isSelected = selected === f.userId;
                return (
                  <button
                    key={f.userId}
                    onClick={() => setSelected(f.userId)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition border ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40'
                        : 'bg-slate-800/40 border-transparent hover:bg-slate-800/70'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${avatar.colors.primary}33, ${avatar.colors.accent}11)`,
                        border: `1.5px solid ${avatar.colors.primary}55`,
                      }}
                      dangerouslySetInnerHTML={{ __html: avatar.svg }}
                    />
                    <p className="flex-1 text-sm font-semibold text-white text-left truncate">
                      {f.username ?? f.nome ?? 'Concurseiro'}
                    </p>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Botão enviar */}
          <button
            onClick={handleSend}
            disabled={!selected || isSending || !!sentTo}
            className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: sentTo
                ? 'linear-gradient(135deg, #10b981, #34d399)'
                : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#ffffff',
            }}
          >
            {sentTo ? (
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Enviado para {sentTo}</span>
              </span>
            ) : isSending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando…</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>Enviar resultado</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
