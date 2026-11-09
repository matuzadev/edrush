'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Heart, Loader2, Send, MessageCircle } from 'lucide-react';
import { AvatarSelector } from '@/components/AvatarSelector';
import { MentionAutocomplete } from './MentionAutocomplete';
import { RichContent } from './RichContent';
import { type Comment, relativeTime } from './types';

interface Props {
  postId: string;
  onCommentAdded?: () => void;
}

const COMMENT_MAX = 500;

export function CommentThread({ postId, onCommentAdded }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState('');
  const [posting, setPosting] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Carregamento inicial
  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    fetch(`/api/posts/${postId}/comments?limit=50`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : { comments: [] }))
      .then((data) => setComments(data.comments ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [postId]);

  // Agrupa em árvore: top-level + map de replies
  const { topLevel, replies } = useMemo(() => {
    const top: Comment[] = [];
    const replyMap = new Map<string, Comment[]>();
    for (const c of comments) {
      if (c.parentId) {
        const arr = replyMap.get(c.parentId) ?? [];
        arr.push(c);
        replyMap.set(c.parentId, arr);
      } else {
        top.push(c);
      }
    }
    // Replies em ordem cronológica
    for (const arr of replyMap.values()) {
      arr.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
    }
    return { topLevel: top, replies: replyMap };
  }, [comments]);

  const submitComment = useCallback(async () => {
    const trimmed = newText.trim();
    if (!trimmed || posting) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed, parentId: replyTo?.id ?? null }),
      });
      if (!res.ok) throw new Error('post falhou');
      const data = await res.json();
      setComments((prev) => [...prev, data.comment]);
      setNewText('');
      setReplyTo(null);
      onCommentAdded?.();
    } catch {
      alert('Não conseguimos publicar seu comentário.');
    } finally {
      setPosting(false);
    }
  }, [newText, posting, postId, replyTo, onCommentAdded]);

  return (
    <div>
      {/* Composer */}
      <div className="mb-4">
        {replyTo && (
          <div className="flex items-center gap-2 mb-1.5 text-[11px]">
            <MessageCircle size={11} className="text-cyan-400" />
            <span className="text-slate-500">
              respondendo <span className="text-cyan-300 font-bold">@{replyTo.author.username}</span>
            </span>
            <button
              onClick={() => setReplyTo(null)}
              className="text-slate-500 hover:text-white"
            >
              cancelar
            </button>
          </div>
        )}
        <div className="flex gap-2 items-start">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newText}
              onChange={(e) => setNewText(e.target.value.slice(0, COMMENT_MAX))}
              placeholder={replyTo ? 'Escreva sua resposta...' : 'Comentar...'}
              rows={2}
              className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-slate-600 outline-none resize-none transition"
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitComment();
              }}
            />
            <MentionAutocomplete
              textareaRef={textareaRef}
              value={newText}
              onChange={(next) => setNewText(next.slice(0, COMMENT_MAX))}
            />
          </div>
          <button
            onClick={submitComment}
            disabled={posting || !newText.trim()}
            className="shrink-0 self-stretch px-4 rounded-xl text-xs font-black text-slate-950 transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: posting ? 'none' : '0 0 14px rgba(16,185,129,0.30)',
            }}
            aria-label="Publicar comentário"
          >
            {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
        {newText.length > 0 && (
          <p className="text-[10px] text-slate-600 text-right mt-1 tabular-nums">
            {newText.length}/{COMMENT_MAX}
          </p>
        )}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="py-6 flex items-center justify-center">
          <Loader2 size={16} className="animate-spin text-slate-500" />
        </div>
      ) : topLevel.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4">
          Seja o primeiro a comentar.
        </p>
      ) : (
        <ul className="space-y-3">
          {topLevel.map((comment) => (
            <li key={comment.id}>
              <CommentItem comment={comment} onReply={setReplyTo} />
              {/* Replies (1 nível) */}
              {(replies.get(comment.id) ?? []).length > 0 && (
                <ul className="mt-2 ml-8 space-y-2 border-l border-white/5 pl-3">
                  {(replies.get(comment.id) ?? []).map((reply) => (
                    <li key={reply.id}>
                      <CommentItem comment={reply} onReply={setReplyTo} compact />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CommentItem({
  comment: initial,
  onReply,
  compact = false,
}: {
  comment: Comment;
  onReply: (c: Comment) => void;
  compact?: boolean;
}) {
  const [comment, setComment] = useState(initial);

  const handleLike = useCallback(async () => {
    const prev = { likedByMe: comment.likedByMe, likesCount: comment.likesCount };
    const opt = {
      ...comment,
      likedByMe: !comment.likedByMe,
      likesCount: comment.likesCount + (comment.likedByMe ? -1 : 1),
    };
    setComment(opt);
    try {
      const res = await fetch(`/api/comments/${comment.id}/like`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setComment({ ...opt, likedByMe: data.liked, likesCount: data.likesCount });
    } catch {
      setComment({ ...comment, ...prev });
    }
  }, [comment]);

  return (
    <div className="flex items-start gap-2.5">
      <Link
        href={`/perfil/${encodeURIComponent(comment.author.username)}`}
        className="shrink-0"
      >
        <AvatarSelector selectedId={comment.author.avatarId} size="sm" />
      </Link>
      <div className="flex-1 min-w-0">
        <div
          className="rounded-xl px-3 py-2 inline-block max-w-full"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <Link
            href={`/perfil/${encodeURIComponent(comment.author.username)}`}
            className="text-xs font-bold text-white hover:text-emerald-300 transition"
          >
            {comment.author.username}
          </Link>
          <p className="text-sm text-slate-200 leading-snug mt-0.5">
            <RichContent text={comment.content} />
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1 px-1">
          <span className="text-[10px] text-slate-600">{relativeTime(comment.createdAt)}</span>
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-[10px] font-bold transition"
            style={{ color: comment.likedByMe ? '#fb7185' : '#64748b' }}
          >
            <Heart size={10} fill={comment.likedByMe ? 'currentColor' : 'none'} />
            {comment.likesCount > 0 && <span className="tabular-nums">{comment.likesCount}</span>}
          </button>
          {!compact && (
            <button
              onClick={() => onReply(comment)}
              className="text-[10px] font-bold text-slate-500 hover:text-cyan-300 transition"
            >
              responder
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
