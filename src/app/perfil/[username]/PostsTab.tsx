'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, FileText } from 'lucide-react';
import { PostCard } from '@/components/community/PostCard';
import type { Post, FeedResponse } from '@/components/community/types';

interface Props {
  userId: string;
  username: string;
}

export function PostsTab({ userId, username }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = useCallback(
    async (currentCursor: string | null, replace: boolean) => {
      const params = new URLSearchParams();
      params.set('user_id', userId);
      params.set('limit', '20');
      if (currentCursor) params.set('cursor', currentCursor);

      try {
        const res = await fetch(`/api/feed?${params}`, { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const data: FeedResponse = await res.json();
        setPosts((prev) => (replace ? data.posts : [...prev, ...data.posts]));
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } catch {
        setHasMore(false);
      }
    },
    [userId],
  );

  // Initial load
  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    loadPage(null, true).finally(() => setLoading(false));
  }, [loadPage]);

  // Infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && cursor) {
          setLoadingMore(true);
          loadPage(cursor, false).finally(() => setLoadingMore(false));
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, cursor, loadingMore, loading, loadPage]);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        className="rounded-2xl py-12 px-6 text-center max-w-[680px] mx-auto"
        style={{
          background: 'rgba(15,23,42,0.50)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3"
          style={{
            background: 'rgba(15,23,42,0.85)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <FileText className="w-7 h-7" style={{ color: '#475569' }} />
        </div>
        <p className="text-sm text-slate-500">@{username} ainda não postou nada.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto w-full">
      <div className="space-y-4">
        {posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            onUpdate={(u) =>
              setPosts((prev) => prev.map((x) => (x.id === u.id ? u : x)))
            }
            onDelete={(id) =>
              setPosts((prev) => prev.filter((x) => x.id !== id))
            }
          />
        ))}
        <div ref={sentinelRef} className="h-10 flex items-center justify-center">
          {loadingMore && (
            <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
          )}
          {!hasMore && posts.length > 0 && (
            <p className="text-xs text-slate-600">Fim dos posts.</p>
          )}
        </div>
      </div>
    </div>
  );
}
