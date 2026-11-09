'use client';

// GroupFeed — wrapper que consome /api/feed?group_id=... do feed core
// (mantido pelo outro engenheiro). Implementa:
//   1. Loading state
//   2. Empty state ("Seja o primeiro a postar")
//   3. Erro de rede (incluindo /api/feed inexistente — trata como vazio)
//   4. Render minimalista dos posts.
//
// Não importamos <PostCard> daqui (proibido pelo brief). Quando o eng do
// feed deployar o componente público, basta substituir o `<article>` abaixo
// por `<PostCard post={post} />` e o resto fica idêntico — contrato é igual.

import { useEffect, useState } from 'react';
import { Loader2, MessageCircle, AlertCircle } from 'lucide-react';

interface GroupFeedProps {
  groupId: string;
  /** Cor de accent vinda da página do grupo (gradiente do concurso). */
  accentColor?: string;
}

interface FeedPost {
  id: string | number;
  authorId?: string;
  authorName?: string | null;
  authorUsername?: string | null;
  authorAvatarId?: number | null;
  content?: string;
  body?: string;
  createdAt?: string;
  created_at?: string;
  // O contrato real do feed é do outro eng — aceitamos shape flexível.
  [k: string]: unknown;
}

interface FeedResponse {
  posts: FeedPost[];
  nextCursor?: string | null;
}

export function GroupFeed({ groupId, accentColor = '#10b981' }: GroupFeedProps) {
  const [posts, setPosts] = useState<FeedPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;
    let cancelled = false;
    setPosts(null);
    setError(null);

    fetch(`/api/feed?group_id=${encodeURIComponent(groupId)}`)
      .then(async (r) => {
        if (!r.ok) {
          // Se /api/feed ainda não existe (eng paralelo): trate como vazio em
          // vez de erro vermelho, pra UI não parecer quebrada em dev.
          if (r.status === 404) {
            return { posts: [] } as FeedResponse;
          }
          const data = await r.json().catch(() => ({}));
          throw new Error(data?.error ?? 'Erro ao carregar feed');
        }
        return (await r.json()) as FeedResponse;
      })
      .then((data) => {
        if (!cancelled) setPosts(data.posts ?? []);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  if (error) {
    return (
      <div
        className="flex items-start gap-3 p-5 rounded-2xl"
        style={{
          background: 'rgba(248,113,113,0.06)',
          border: '1px solid rgba(248,113,113,0.25)',
        }}
      >
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-300">Não foi possível carregar o feed</p>
          <p className="text-xs text-red-400/80 mt-0.5">{error}</p>
        </div>
      </div>
    );
  }

  if (posts === null) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: accentColor }} />
        <p className="text-sm text-slate-500">Carregando posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        className="flex flex-col items-center text-center py-12 px-6 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(15,23,42,0.3))',
          border: '1px dashed rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}10)`,
            border: `1px solid ${accentColor}40`,
          }}
        >
          <MessageCircle className="w-7 h-7" style={{ color: accentColor }} />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Sem posts ainda neste grupo</h3>
        <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
          Seja o primeiro a postar — compartilhe uma dúvida, um resumo ou
          comemore uma conquista de estudo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => {
        // Render minimalista — apresenta o post mesmo sem o PostCard core.
        // Quando <PostCard> estiver público (feito pelo outro eng), trocar por
        // `<PostCard key={String(post.id)} post={post} />`.
        const text = post.content ?? post.body ?? '';
        const author = post.authorName ?? post.authorUsername ?? 'Estudante';
        const created = post.createdAt ?? post.created_at ?? null;
        return (
          <article
            key={String(post.id)}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-white/8"
          >
            <header className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-slate-950"
                style={{ background: accentColor }}
              >
                {author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">{author}</p>
                {created && (
                  <p className="text-[11px] text-slate-500">
                    {new Date(created).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            </header>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
              {text}
            </p>
          </article>
        );
      })}
    </div>
  );
}
