'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Newspaper,
  Users,
  TrendingUp,
  ChevronLeft,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/NotificationBell';
import { UserMenu } from '@/components/UserMenu';
import { PostCard } from '@/components/community/PostCard';
import { PostComposer } from '@/components/community/PostComposer';
import type { Post, FeedResponse } from '@/components/community/types';

type FeedTab = 'all' | 'news' | 'results' | 'discussion';

const TAB_CONFIG: Record<FeedTab, { label: string; type?: string }> = {
  all:        { label: 'Tudo' },
  news:       { label: 'Notícias',  type: 'news' },
  results:    { label: 'Resultados',type: 'result' },
  discussion: { label: 'Discussões',type: 'question' },
};

export default function FeedPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [tab, setTab] = useState<FeedTab>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const myAvatarId = (user as unknown as { avatar_id?: number })?.avatar_id ?? 1;

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  // Reset ao trocar tab
  useEffect(() => {
    setPosts([]);
    setCursor(null);
    setHasMore(true);
    setLoading(true);
  }, [tab]);

  // Fetch
  const loadPage = useCallback(async (currentCursor: string | null, replace: boolean) => {
    const params = new URLSearchParams();
    const tabType = TAB_CONFIG[tab].type;
    if (tabType) params.set('type', tabType);
    if (currentCursor) params.set('cursor', currentCursor);
    params.set('limit', '20');

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
  }, [tab]);

  useEffect(() => {
    setLoading(true);
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

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[var(--emerald-500)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Navbar */}
      <nav className="bg-[var(--card)]/80 backdrop-blur-lg border-b border-[var(--border)] sticky top-0 z-40 px-4 sm:px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="text-slate-400 hover:text-[var(--fg)] transition shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="hidden sm:block text-lg font-bold text-gradient">
            EDRUSH
          </Link>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="text-sm text-slate-400 font-medium truncate">Comunidade</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <UserMenu onLogout={() => router.push('/auth/login')} />
        </div>
      </nav>

      {/* Layout 3 colunas no desktop, 1 no mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[224px_1fr_280px] gap-6">
        {/* SIDEBAR ESQUERDA */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-1">
            <SideNavItem href="/dashboard/feed" icon={Newspaper} label="Feed" active />
            <SideNavItem href="/dashboard/feed/grupos" icon={Users} label="Grupos" />
            <SideNavItem href="/dashboard/profile" icon={TrendingUp} label="Meu Perfil" />
          </div>
        </aside>

        {/* COLUNA CENTRAL */}
        <main className="min-w-0 max-w-[680px] mx-auto w-full">
          {/* Header da seção */}
          <div className="mb-5">
            <h1 className="text-2xl font-black text-white">Comunidade</h1>
            <p className="text-sm text-slate-400 mt-1">
              Compartilhe seus estudos, resultados e descobertas com a comunidade.
            </p>
          </div>

          {/* Composer */}
          <div className="mb-4">
            <PostComposer
              myAvatarId={myAvatarId}
              onPosted={(post) => setPosts((prev) => [post, ...prev])}
            />
          </div>

          {/* Tabs */}
          <div
            className="flex gap-1 mb-4 p-1 rounded-xl glass-card"
          >
            {(Object.keys(TAB_CONFIG) as FeedTab[]).map((t) => {
              const cfg = TAB_CONFIG[t];
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition hover-lift"
                  style={{
                    background: active ? 'rgba(16,185,129,0.15)' : 'transparent',
                    color: active ? '#34d399' : '#64748b',
                    boxShadow: active ? 'var(--glow-emerald)' : 'none',
                  }}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Lista de posts */}
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <EmptyFeedState tab={tab} />
          ) : (
            <div className="space-y-4">
              {posts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  onUpdate={(u) => setPosts((prev) => prev.map((x) => (x.id === u.id ? u : x)))}
                  onDelete={(id) => setPosts((prev) => prev.filter((x) => x.id !== id))}
                />
              ))}
              <div ref={sentinelRef} className="h-10 flex items-center justify-center">
                {loadingMore && <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />}
                {!hasMore && posts.length > 0 && (
                  <p className="text-xs text-slate-600">Você chegou ao fim do feed.</p>
                )}
              </div>
            </div>
          )}
        </main>

        {/* SIDEBAR DIREITA */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <RightCard
              title="Grupos sugeridos"
              cta="Ver todos"
              href="/dashboard/feed/grupos"
            >
              <p className="text-xs text-slate-500">
                Descubra grupos de estudo focados no seu concurso.
              </p>
              <Link
                href="/dashboard/feed/grupos"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                Explorar grupos
                <ChevronRight size={12} />
              </Link>
            </RightCard>

            <RightCard title="Sobre o feed">
              <ul className="text-xs text-slate-400 space-y-1.5 leading-relaxed">
                <li>• Compartilhe resultados de blocos</li>
                <li>• Tire dúvidas sobre questões</li>
                <li>• Acompanhe novidades da plataforma</li>
                <li>• Conecte-se com outros concurseiros</li>
              </ul>
            </RightCard>
          </div>
        </aside>
      </div>

      {/* Mobile FAB */}
      <button
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-slate-950 z-30 transition-all hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #10b981, #06b6d4)',
          boxShadow: '0 8px 24px rgba(16,185,129,0.40)',
        }}
        onClick={() => {
          // Scroll para o composer no topo
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Criar post"
      >
        <Newspaper className="w-6 h-6" />
      </button>
    </div>
  );
}

function SideNavItem({
  href, icon: Icon, label, active = false,
}: {
  href: string;
  icon: typeof Newspaper;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition"
      style={{
        background: active ? 'rgba(16,185,129,0.10)' : 'transparent',
        color: active ? '#34d399' : '#94a3b8',
      }}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}

function RightCard({
  title, cta, href, children,
}: {
  title: string;
  cta?: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.55))',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</h3>
        {cta && href && (
          <Link href={href} className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300">
            {cta}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function EmptyFeedState({ tab }: { tab: FeedTab }) {
  const messages: Record<FeedTab, { title: string; sub: string }> = {
    all:        { title: 'Seja o primeiro a postar!', sub: 'Compartilhe um resultado ou tire uma dúvida.' },
    news:       { title: 'Sem notícias por enquanto', sub: 'A equipe EdRush posta updates importantes aqui.' },
    results:    { title: 'Nenhum resultado compartilhado', sub: 'Termine um bloco e compartilhe sua performance.' },
    discussion: { title: 'Nenhuma discussão de questão', sub: 'Tire dúvidas sobre questões direto na sessão de estudo.' },
  };
  const m = messages[tab];
  return (
    <div
      className="rounded-2xl py-12 px-6 text-center"
      style={{
        background: 'rgba(15,23,42,0.50)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.20), rgba(6,182,212,0.10))',
          border: '1px solid rgba(16,185,129,0.30)',
        }}
      >
        <Newspaper className="text-emerald-300 w-7 h-7" />
      </div>
      <p className="text-sm font-black text-white">{m.title}</p>
      <p className="text-xs text-slate-500 mt-1">{m.sub}</p>
    </div>
  );
}