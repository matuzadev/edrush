'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Heart, MessageCircle, Send, X, Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos locais (não importar de /api/feed/ — outro engenheiro está construindo)
// ─────────────────────────────────────────────────────────────────────────────

interface FeedAuthor {
  id: string;
  username?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  level?: number | null;
}

interface FeedPost {
  id: string;
  content: string;
  createdAt?: string | null;
  author?: FeedAuthor | null;
  likeCount?: number;
  commentCount?: number;
  likedByMe?: boolean;
}

interface FeedResponse {
  posts: FeedPost[];
  nextCursor?: string | null;
}

interface PostComment {
  id: string;
  content: string;
  createdAt?: string | null;
  author?: FeedAuthor | null;
  likeCount?: number;
  // estado local opcional p/ UI otimista
  pending?: boolean;
  failed?: boolean;
}

interface CommentsResponse {
  comments: PostComment[];
  nextCursor?: string | null;
}

interface CountResponse {
  count?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export interface QuestionDiscussionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  questionPreview: { titulo: string; enunciado: string };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function formatRelativeTime(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return '';
  const diff = Math.max(0, Date.now() - d);
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'agora';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d`;
  const w = Math.floor(days / 7);
  if (w < 5) return `${w}sem`;
  const months = Math.floor(days / 30);
  return `${months}mes`;
}

function authorDisplayName(a?: FeedAuthor | null): string {
  if (!a) return 'Usuário';
  return a.username || a.name || 'Usuário';
}

function authorInitials(a?: FeedAuthor | null): string {
  const n = authorDisplayName(a);
  const parts = n.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? 'U';
  const second = parts[1]?.[0] ?? '';
  return (first + second).toUpperCase();
}

const MAX_POST_CHARS = 500;
const MAX_COMMENT_CHARS = 500;

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

export function QuestionDiscussionDrawer({
  isOpen,
  onClose,
  questionId,
  questionPreview,
}: QuestionDiscussionDrawerProps) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [composerText, setComposerText] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);

  // Reset estado ao abrir/fechar ou trocar de questão
  useEffect(() => {
    if (!isOpen) return;
    setPosts([]);
    setCursor(null);
    setHasMore(false);
    setError(null);
    setComposerText('');
    setPostError(null);
    setPreviewExpanded(false);
    setExpandedThreads(new Set());
  }, [isOpen, questionId]);

  // Body scroll lock + foco no composer
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => composerRef.current?.focus(), 280);
    return () => {
      document.body.style.overflow = original;
      clearTimeout(t);
    };
  }, [isOpen]);

  // Esc para fechar
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // ─────────────────────────────────────────────────────────────────────────
  // Fetch inicial e paginação
  // ─────────────────────────────────────────────────────────────────────────

  const fetchPage = useCallback(
    async (nextCursor: string | null, append: boolean) => {
      // Cancela requisição anterior
      fetchAbortRef.current?.abort();
      const ctrl = new AbortController();
      fetchAbortRef.current = ctrl;

      if (append) setLoadingMore(true);
      else {
        setLoading(true);
        setError(null);
      }

      try {
        const params = new URLSearchParams({
          target_type: 'question',
          target_id: questionId,
        });
        if (nextCursor) params.set('cursor', nextCursor);

        const res = await fetch(`/api/feed?${params.toString()}`, {
          signal: ctrl.signal,
          credentials: 'same-origin',
        });
        if (!res.ok) throw new Error(`feed ${res.status}`);
        const data = (await res.json()) as FeedResponse;
        const newPosts = Array.isArray(data?.posts) ? data.posts : [];
        setPosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
        setCursor(data?.nextCursor ?? null);
        setHasMore(Boolean(data?.nextCursor));
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
        if (!append) setError('Não conseguimos carregar a discussão');
      } finally {
        if (append) setLoadingMore(false);
        else setLoading(false);
      }
    },
    [questionId],
  );

  useEffect(() => {
    if (!isOpen) return;
    fetchPage(null, false);
    return () => {
      fetchAbortRef.current?.abort();
    };
  }, [isOpen, fetchPage]);

  // Infinite scroll cursor-based
  useEffect(() => {
    if (!isOpen) return;
    const node = sentinelRef.current;
    if (!node) return;
    const root = drawerRef.current ?? null;
    const obs = new IntersectionObserver(
      (entries) => {
        const ent = entries[0];
        if (ent?.isIntersecting && hasMore && !loading && !loadingMore && cursor) {
          fetchPage(cursor, true);
        }
      },
      { root, rootMargin: '120px', threshold: 0.1 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [isOpen, hasMore, loading, loadingMore, cursor, fetchPage]);

  // ─────────────────────────────────────────────────────────────────────────
  // Submit do composer principal
  // ─────────────────────────────────────────────────────────────────────────

  const handleSubmitPost = useCallback(async () => {
    const content = composerText.trim();
    if (!content || posting) return;
    if (content.length > MAX_POST_CHARS) return;

    setPosting(true);
    setPostError(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          content,
          postType: 'question',
          targetType: 'question',
          targetId: questionId,
        }),
      });
      if (!res.ok) throw new Error(`post ${res.status}`);
      setComposerText('');
      // Refetch para ter o post oficial no topo
      await fetchPage(null, false);
    } catch {
      setPostError('Falha ao publicar. Tenta de novo.');
    } finally {
      setPosting(false);
    }
  }, [composerText, posting, questionId, fetchPage]);

  // ─────────────────────────────────────────────────────────────────────────
  // Like otimista
  // ─────────────────────────────────────────────────────────────────────────

  const handleToggleLike = useCallback(async (postId: string) => {
    let prevSnapshot: FeedPost | undefined;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        prevSnapshot = p;
        const wasLiked = !!p.likedByMe;
        return {
          ...p,
          likedByMe: !wasLiked,
          likeCount: Math.max(0, (p.likeCount ?? 0) + (wasLiked ? -1 : 1)),
        };
      }),
    );

    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(postId)}/like`, {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error(`like ${res.status}`);
    } catch {
      // Reverte
      if (prevSnapshot) {
        const snap = prevSnapshot;
        setPosts((prev) => prev.map((p) => (p.id === postId ? snap : p)));
      }
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Expansão de comentários por thread
  // ─────────────────────────────────────────────────────────────────────────

  const toggleThread = useCallback((postId: string) => {
    setExpandedThreads((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  }, []);

  const updatePostCommentCount = useCallback((postId: string, delta: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, commentCount: Math.max(0, (p.commentCount ?? 0) + delta) }
          : p,
      ),
    );
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  const titulo = questionPreview?.titulo?.trim() || 'Discussão';
  const enunciado = questionPreview?.enunciado?.trim() || '';
  const enunciadoPreview = useMemo(() => {
    if (enunciado.length <= 100) return enunciado;
    return enunciado.slice(0, 100).trimEnd() + '…';
  }, [enunciado]);

  const composerRemaining = MAX_POST_CHARS - composerText.length;
  const composerOver = composerRemaining < 0;
  const canSubmit = composerText.trim().length > 0 && !composerOver && !posting;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex"
      role="dialog"
      aria-modal="true"
      aria-label="Discussão da questão"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fechar discussão"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-[8px] animate-in fade-in duration-200"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="relative ml-auto h-full w-full md:w-[480px] flex flex-col text-slate-200 shadow-[0_0_60px_-12px_rgba(0,0,0,0.7)]"
        style={{
          background:
            'linear-gradient(135deg, rgba(15,23,42,0.97), rgba(15,23,42,0.88))',
          animation: 'qdd-slide-in 250ms ease-out forwards',
        }}
      >
        {/* Borda esquerda gradient */}
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{
            background:
              'linear-gradient(180deg, #10b981, #06b6d4, #8b5cf6)',
          }}
        />

        <style>{`
          @keyframes qdd-slide-in {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <header className="shrink-0 flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest font-bold text-cyan-400/80">
              Discussão
            </p>
            <p className="text-sm font-bold text-white truncate" title={titulo}>
              {titulo}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="shrink-0 w-9 h-9 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Body scrollável */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-3 space-y-4">
          {/* Preview da questão (colapsável) */}
          {enunciado && (
            <section className="rounded-xl bg-slate-900/50 border border-white/5 p-3.5">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">
                Questão em discussão
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {previewExpanded ? enunciado : enunciadoPreview}
              </p>
              {enunciado.length > 100 && (
                <button
                  type="button"
                  onClick={() => setPreviewExpanded((s) => !s)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                >
                  {previewExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      Recolher
                    </>
                  ) : (
                    <>
                      Ver completa
                      <span aria-hidden>→</span>
                    </>
                  )}
                </button>
              )}
            </section>
          )}

          {/* Lista de threads */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
              <p className="text-sm text-slate-400">Carregando discussão...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-sm font-bold text-slate-200">
                {error}
              </p>
              <button
                type="button"
                onClick={() => fetchPage(null, false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/15 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center text-2xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(6,182,212,0.18))',
                  border: '1px solid rgba(16,185,129,0.25)',
                }}
              >
                <MessageCircle className="w-7 h-7 text-emerald-300" />
              </div>
              <p className="text-sm font-bold text-white">
                Seja o primeiro a discutir essa questão!
              </p>
              <p className="text-xs text-slate-500 max-w-[280px]">
                Compartilhe sua dúvida ou explicação com a comunidade.
              </p>
              <div
                className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400/80"
                aria-hidden
              >
                <span>Use o composer abaixo</span>
                <span className="text-base leading-none">↓</span>
              </div>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="space-y-3">
              {posts.map((post) => (
                <ThreadCard
                  key={post.id}
                  post={post}
                  expanded={expandedThreads.has(post.id)}
                  onToggleExpand={() => toggleThread(post.id)}
                  onToggleLike={() => handleToggleLike(post.id)}
                  onCommentAdded={() => updatePostCommentCount(post.id, 1)}
                  onCommentRemoved={() => updatePostCommentCount(post.id, -1)}
                />
              ))}

              {/* Sentinela infinite scroll */}
              {hasMore && (
                <div ref={sentinelRef} className="py-4 flex justify-center">
                  {loadingMore && (
                    <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Composer fixo */}
        <footer className="shrink-0 border-t border-white/5 bg-slate-950/40 px-4 pt-3 pb-4">
          {postError && (
            <p className="text-xs text-red-400 mb-2 px-1">{postError}</p>
          )}
          <div className="rounded-2xl bg-slate-900/70 border border-white/10 focus-within:border-emerald-500/40 transition px-3 pt-2.5 pb-2">
            <textarea
              ref={composerRef}
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder="Compartilhe uma dúvida ou explicação..."
              rows={3}
              maxLength={MAX_POST_CHARS + 50}
              className="w-full bg-transparent resize-none text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none leading-relaxed"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  if (canSubmit) handleSubmitPost();
                }
              }}
            />
            <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-white/5">
              <span
                className={classNames(
                  'text-[11px] font-semibold tabular-nums',
                  composerOver ? 'text-red-400' : 'text-slate-500',
                )}
              >
                {composerRemaining} / {MAX_POST_CHARS}
              </span>
              <button
                type="button"
                onClick={handleSubmitPost}
                disabled={!canSubmit}
                className={classNames(
                  'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black transition',
                  canSubmit
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed',
                )}
              >
                {posting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Postar
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ThreadCard — post compacto + comentários inline
// ─────────────────────────────────────────────────────────────────────────────

interface ThreadCardProps {
  post: FeedPost;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleLike: () => void;
  onCommentAdded: () => void;
  onCommentRemoved: () => void;
}

function ThreadCard({
  post,
  expanded,
  onToggleExpand,
  onToggleLike,
  onCommentAdded,
  onCommentRemoved,
}: ThreadCardProps) {
  const author = post.author ?? null;
  const display = authorDisplayName(author);
  const initials = authorInitials(author);
  const commentCount = post.commentCount ?? 0;

  return (
    <article className="bg-slate-900/50 border border-white/5 rounded-xl p-4 transition hover:border-white/10">
      {/* Header autor */}
      <header className="flex items-center gap-3 mb-2.5">
        <Avatar size={32} url={author?.avatarUrl ?? undefined} initials={initials} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white truncate leading-tight">
            {display}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            {typeof author?.level === 'number' && (
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold">
                Lv {author.level}
              </span>
            )}
            <span>{formatRelativeTime(post.createdAt)}</span>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
        {post.content}
      </p>

      {/* Ações */}
      <div className="mt-3 flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={onToggleLike}
          aria-label={post.likedByMe ? 'Descurtir' : 'Curtir'}
          className={classNames(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition',
            post.likedByMe
              ? 'text-pink-400 bg-pink-500/10'
              : 'text-slate-400 hover:text-pink-300 hover:bg-white/5',
          )}
        >
          <Heart
            className="w-3.5 h-3.5"
            fill={post.likedByMe ? 'currentColor' : 'none'}
          />
          <span className="font-bold tabular-nums">{post.likeCount ?? 0}</span>
        </button>

        <button
          type="button"
          onClick={onToggleExpand}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition"
          aria-expanded={expanded}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="font-bold tabular-nums">{commentCount}</span>
          <span className="font-semibold">
            {expanded ? 'Ocultar respostas' : 'Ver respostas'}
          </span>
          {expanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Comentários expandidos */}
      {expanded && (
        <CommentsSection
          postId={post.id}
          onCommentAdded={onCommentAdded}
          onCommentRemoved={onCommentRemoved}
        />
      )}
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Avatar simples
// ─────────────────────────────────────────────────────────────────────────────

function Avatar({
  size,
  url,
  initials,
}: {
  size: number;
  url?: string;
  initials: string;
}) {
  const dim = `${size}px`;
  return (
    <div
      className="rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden"
      style={{ width: dim, height: dim }}
      aria-hidden
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span
          className="font-black text-white"
          style={{ fontSize: Math.max(10, Math.floor(size * 0.38)) }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CommentsSection — lista + composer inline com UI otimista
// ─────────────────────────────────────────────────────────────────────────────

interface CommentsSectionProps {
  postId: string;
  onCommentAdded: () => void;
  onCommentRemoved: () => void;
}

function CommentsSection({
  postId,
  onCommentAdded,
  onCommentRemoved,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);

  const load = useCallback(
    async (nextCursor: string | null, append: boolean) => {
      fetchAbortRef.current?.abort();
      const ctrl = new AbortController();
      fetchAbortRef.current = ctrl;
      setLoading(true);
      if (!append) setError(null);
      try {
        const params = new URLSearchParams();
        if (nextCursor) params.set('cursor', nextCursor);
        const url = `/api/posts/${encodeURIComponent(postId)}/comments${
          params.toString() ? `?${params.toString()}` : ''
        }`;
        const res = await fetch(url, {
          signal: ctrl.signal,
          credentials: 'same-origin',
        });
        if (!res.ok) throw new Error(`comments ${res.status}`);
        const data = (await res.json()) as CommentsResponse;
        const list = Array.isArray(data?.comments) ? data.comments : [];
        setComments((prev) => (append ? [...prev, ...list] : list));
        setCursor(data?.nextCursor ?? null);
        setHasMore(Boolean(data?.nextCursor));
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
        if (!append) setError('Falha ao carregar respostas');
      } finally {
        setLoading(false);
      }
    },
    [postId],
  );

  useEffect(() => {
    load(null, false);
    return () => {
      fetchAbortRef.current?.abort();
    };
  }, [load]);

  const remaining = MAX_COMMENT_CHARS - text.length;
  const over = remaining < 0;
  const canSubmit = text.trim().length > 0 && !over && !posting;

  const handleSubmit = useCallback(async () => {
    const content = text.trim();
    if (!content || posting || over) return;

    const tempId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const optimistic: PostComment = {
      id: tempId,
      content,
      createdAt: new Date().toISOString(),
      author: null,
      likeCount: 0,
      pending: true,
    };
    setComments((prev) => [...prev, optimistic]);
    setText('');
    setPosting(true);
    setPostError(null);
    onCommentAdded();

    try {
      const res = await fetch(
        `/api/posts/${encodeURIComponent(postId)}/comments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ content }),
        },
      );
      if (!res.ok) throw new Error(`comment ${res.status}`);
      const created = (await res.json().catch(() => null)) as PostComment | null;
      setComments((prev) =>
        prev.map((c) =>
          c.id === tempId
            ? created && created.id
              ? { ...created, pending: false }
              : { ...c, pending: false }
            : c,
        ),
      );
    } catch {
      // Reverte
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      setPostError('Não foi possível enviar a resposta.');
      onCommentRemoved();
    } finally {
      setPosting(false);
    }
  }, [text, posting, over, postId, onCommentAdded, onCommentRemoved]);

  return (
    <section className="mt-3 pt-3 border-t border-white/5 space-y-3">
      {loading && comments.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Carregando respostas...
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-2 text-xs text-red-400">
          {error}
          <button
            type="button"
            onClick={() => load(null, false)}
            className="font-bold underline hover:text-red-300"
          >
            tentar de novo
          </button>
        </div>
      )}

      {comments.length > 0 && (
        <ul className="space-y-2.5">
          {comments.map((c) => (
            <li
              key={c.id}
              className={classNames(
                'flex gap-2.5',
                c.pending && 'opacity-60',
              )}
            >
              <Avatar
                size={24}
                url={c.author?.avatarUrl ?? undefined}
                initials={authorInitials(c.author)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-200 truncate">
                    {authorDisplayName(c.author)}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {formatRelativeTime(c.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                  {c.content}
                </p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {c.likeCount ?? 0}
                  </span>
                  <button
                    type="button"
                    className="hover:text-slate-300 font-semibold transition disabled:opacity-50"
                    disabled
                    title="Em breve"
                  >
                    responder
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {hasMore && cursor && !loading && (
        <button
          type="button"
          onClick={() => load(cursor, true)}
          className="text-xs font-bold text-cyan-300 hover:text-cyan-200 transition"
        >
          Ver mais respostas →
        </button>
      )}

      {/* Composer inline */}
      <div className="rounded-xl bg-slate-950/40 border border-white/5 px-3 py-2 focus-within:border-emerald-500/30 transition">
        {postError && (
          <p className="text-[11px] text-red-400 mb-1.5">{postError}</p>
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Responder..."
          rows={2}
          maxLength={MAX_COMMENT_CHARS + 50}
          className="w-full bg-transparent resize-none text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none leading-relaxed"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              if (canSubmit) handleSubmit();
            }
          }}
        />
        <div className="flex items-center justify-between mt-1.5">
          <span
            className={classNames(
              'text-[10px] font-semibold tabular-nums',
              over ? 'text-red-400' : 'text-slate-600',
            )}
          >
            {remaining}
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={classNames(
              'inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-black transition',
              canSubmit
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed',
            )}
          >
            {posting ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
            Enviar
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook auxiliar opcional para contagem (usa /api/posts/count?...)
// ─────────────────────────────────────────────────────────────────────────────

export function useDiscussionCount(questionId: string | undefined): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!questionId) {
      setCount(null);
      return;
    }
    const ctrl = new AbortController();
    const params = new URLSearchParams({
      target_type: 'question',
      target_id: questionId,
    });
    fetch(`/api/posts/count?${params.toString()}`, {
      signal: ctrl.signal,
      credentials: 'same-origin',
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: CountResponse | null) => {
        if (data && typeof data.count === 'number') setCount(data.count);
        else setCount(null);
      })
      .catch((err) => {
        if ((err as Error)?.name === 'AbortError') return;
        setCount(null);
      });
    return () => ctrl.abort();
  }, [questionId]);

  return count;
}

export default QuestionDiscussionDrawer;
