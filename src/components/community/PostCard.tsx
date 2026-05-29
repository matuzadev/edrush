'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trophy,
  HelpCircle,
  Megaphone,
  Image as ImageIcon,
  Flag,
  Trash2,
  Loader2,
} from 'lucide-react';
import { AvatarSelector } from '@/components/AvatarSelector';
import { AvatarBorder } from '@/components/AvatarBorder';
import { CommentThread } from './CommentThread';
import { RichContent } from './RichContent';
import { type Post, type PostAuthor, type PostMetadataResult, relativeTime } from './types';

/** Autor "fallback" para posts que cheguem sem o campo author preenchido. */
const FALLBACK_AUTHOR: PostAuthor = {
  id: '',
  username: 'Concurseiro',
  nome: null,
  avatarId: 1,
  equippedBorder: 'recruta',
  xp: 0,
};

interface Props {
  post: Post;
  onUpdate?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  /** Mostrar comentários expandidos por padrão (ex.: dentro do drawer de discussão). */
  defaultExpanded?: boolean;
}

const TYPE_ACCENT: Record<string, { color: string; bg: string; border: string; label: string }> = {
  text:     { color: '#94a3b8', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.30)', label: 'Post' },
  result:   { color: '#34d399', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.40)',  label: 'Resultado' },
  question: { color: '#22d3ee', bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.40)',   label: 'Discussão' },
  news:     { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.40)',  label: 'Foco Federal' },
};

export function PostCard({ post: initial, onUpdate, onDelete, defaultExpanded = false }: Props) {
  const [post, setPost] = useState<Post>(initial);
  const [showComments, setShowComments] = useState(defaultExpanded);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const accent = TYPE_ACCENT[post.postType] ?? TYPE_ACCENT.text;
  const isNews = post.postType === 'news';
  const author = post.author ?? FALLBACK_AUTHOR;

  const handleLike = useCallback(async () => {
    // Otimista
    const prev = { likedByMe: post.likedByMe, likesCount: post.likesCount };
    const optimistic = {
      ...post,
      likedByMe: !post.likedByMe,
      likesCount: post.likesCount + (post.likedByMe ? -1 : 1),
    };
    setPost(optimistic);
    onUpdate?.(optimistic);

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('like falhou');
      const data = await res.json();
      const updated = { ...optimistic, likedByMe: data.liked, likesCount: data.likesCount };
      setPost(updated);
      onUpdate?.(updated);
    } catch {
      // Reverte
      const reverted = { ...post, ...prev };
      setPost(reverted);
      onUpdate?.(reverted);
    }
  }, [post, onUpdate]);

  const handleReport = useCallback(async () => {
    if (reporting) return;
    setReporting(true);
    setMenuOpen(false);
    try {
      const res = await fetch(`/api/posts/${post.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'spam', targetType: 'post' }),
      });
      if (res.ok) {
        // simples toast inline
        alert('Denúncia enviada. Obrigado!');
      } else {
        alert('Não conseguimos enviar a denúncia.');
      }
    } finally {
      setReporting(false);
    }
  }, [post.id, reporting]);

  const handleDelete = useCallback(async () => {
    if (deleting) return;
    if (!confirm('Apagar este post? Essa ação não pode ser desfeita.')) return;
    setDeleting(true);
    setMenuOpen(false);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
      if (res.ok) onDelete?.(post.id);
      else alert('Falha ao apagar.');
    } finally {
      setDeleting(false);
    }
  }, [post.id, deleting, onDelete]);

  // Metadata helpers
  const result =
    post.postType === 'result' && post.metadata && typeof post.metadata === 'object'
      ? (post.metadata as PostMetadataResult)
      : null;

  return (
    <article
      className="relative overflow-hidden rounded-2xl transition-all hover:-translate-y-0.5"
      style={{
        background: isNews
          ? 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(15,23,42,0.85))'
          : 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.55))',
        border: `1px solid ${isNews ? accent.border : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      {/* Linha de gradient no topo (especial para news) */}
      {isNews && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4, #fbbf24, #ec4899)' }}
        />
      )}

      {/* Borda lateral colorida por tipo */}
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r"
        style={{ background: accent.color, opacity: post.postType === 'text' ? 0.3 : 0.7 }}
      />

      <div className="px-5 pt-4 pb-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/perfil/${encodeURIComponent(author.username)}`}
              className="shrink-0"
              aria-label={`Perfil de ${author.username}`}
            >
              <AvatarBorder slug={author.equippedBorder} size={40}>
                <AvatarSelector selectedId={author.avatarId} size="sm" />
              </AvatarBorder>
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/perfil/${encodeURIComponent(author.username)}`}
                  className="text-sm font-bold text-white hover:text-emerald-300 transition truncate"
                >
                  {author.username}
                </Link>
                <span className="text-[10px] text-slate-600">·</span>
                <span className="text-[11px] text-slate-500">{relativeTime(post.createdAt)}</span>
                {post.groupName && (
                  <>
                    <span className="text-[10px] text-slate-600">·</span>
                    <Link
                      href={`/dashboard/feed/grupos/${post.groupSlug}`}
                      className="text-[11px] font-bold transition"
                      style={{ color: post.groupAccentColor ?? '#34d399' }}
                    >
                      #{post.groupName}
                    </Link>
                  </>
                )}
              </div>
              <span
                className="text-[9px] font-black uppercase tracking-widest mt-0.5 inline-flex items-center gap-1"
                style={{ color: accent.color }}
              >
                {post.postType === 'result' && <Trophy size={10} />}
                {post.postType === 'question' && <HelpCircle size={10} />}
                {post.postType === 'news' && <Megaphone size={10} />}
                {post.postType === 'text' && post.imageUrl && <ImageIcon size={10} />}
                {accent.label}
              </span>
            </div>
          </div>

          {/* Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition"
              style={{ color: '#64748b' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLButtonElement).style.color = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
              }}
              aria-label="Mais opções"
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-44 rounded-xl py-1 z-10"
                style={{
                  background: 'rgba(15,23,42,0.97)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={handleReport}
                  disabled={reporting || isNews}
                  className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2 disabled:opacity-50"
                >
                  {reporting ? <Loader2 size={12} className="animate-spin" /> : <Flag size={12} />}
                  Denunciar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full px-3 py-2 text-left text-xs text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 disabled:opacity-50"
                >
                  {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  Apagar (autor/admin)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="text-sm text-slate-200 leading-relaxed mb-3">
          <RichContent text={post.content} />
        </div>

        {/* Variante: resultado de estudo */}
        {result && (
          <div
            className="mb-3 px-4 py-3 rounded-xl flex items-center gap-3"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.25)',
            }}
          >
            <Trophy className="text-emerald-300 shrink-0" size={20} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white">
                {result.acertos ?? '—'}/{result.total ?? '—'}
                {result.disciplina && (
                  <span className="text-slate-400 font-normal ml-2 text-xs">
                    {result.disciplina}
                    {result.capitulo && ` · ${result.capitulo}`}
                  </span>
                )}
              </p>
              {typeof result.accuracy === 'number' && (
                <div className="h-1.5 mt-1.5 rounded-full overflow-hidden bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${result.accuracy}%`,
                      background: 'linear-gradient(90deg, #10b981, #34d399)',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Variante: discussão de questão (preview) */}
        {post.postType === 'question' && post.targetId && (
          <div
            className="mb-3 px-4 py-3 rounded-xl"
            style={{
              background: 'rgba(6,182,212,0.06)',
              border: '1px solid rgba(6,182,212,0.25)',
            }}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1">
              Questão #{post.targetId}
            </p>
            <Link
              href={`/dashboard/study?subject=questao&id=${post.targetId}`}
              className="text-xs text-slate-300 hover:text-cyan-300 transition"
            >
              Ver questão completa →
            </Link>
          </div>
        )}

        {/* Imagem */}
        {post.imageUrl && (
          <div className="mb-3 -mx-1 rounded-xl overflow-hidden border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.imageUrl} alt="" className="w-full h-auto max-h-96 object-cover" />
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-1 pt-2 border-t border-white/5">
          {!isNews && (
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition group"
              style={{
                color: post.likedByMe ? '#fb7185' : '#94a3b8',
                background: post.likedByMe ? 'rgba(244,63,94,0.10)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!post.likedByMe) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#fb7185';
                }
              }}
              onMouseLeave={(e) => {
                if (!post.likedByMe) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
                }
              }}
            >
              <Heart
                size={14}
                fill={post.likedByMe ? 'currentColor' : 'none'}
                className={post.likedByMe ? 'animate-[heart-pop_0.25s_ease-out]' : ''}
              />
              <span className="tabular-nums">{post.likesCount}</span>
            </button>
          )}
          <button
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition"
            style={{ color: showComments ? '#22d3ee' : '#94a3b8' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <MessageCircle size={14} />
            <span className="tabular-nums">{post.commentsCount}</span>
          </button>
          <button
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(`${window.location.origin}/dashboard/feed?post=${post.id}`);
                alert('Link copiado!');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition ml-auto"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {/* Comentários */}
      {showComments && (
        <div className="border-t border-white/5 px-5 py-4 bg-slate-950/40">
          <CommentThread
            postId={post.id}
            onCommentAdded={() => {
              const updated = { ...post, commentsCount: post.commentsCount + 1 };
              setPost(updated);
              onUpdate?.(updated);
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes heart-pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
      `}</style>
    </article>
  );
}
