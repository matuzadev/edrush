'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/NotificationBell';
import { UserMenu } from '@/components/UserMenu';
import { StoreItemPreview } from '@/components/store/StoreItemPreview';
import {
  ChevronLeft,
  Gem,
  Check,
  Lock,
  Sparkles,
  Zap,
  Crown,
  Shield,
  Star,
  Loader2,
  ShoppingBag,
} from 'lucide-react';

interface StoreItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  priceCrystals: number;
  rarity: string;
  imageUrl: string | null;
  metadata: unknown;
  stock: number | null;
  owned: boolean;
  equipped: boolean;
}

const CATEGORIES: { value: string; label: string; Icon: typeof Crown }[] = [
  { value: 'all', label: 'Todos', Icon: ShoppingBag },
  { value: 'avatar_orgao', label: 'Avatares Órgão', Icon: Shield },
  { value: 'avatar_vitoria', label: 'Avatares Vitória', Icon: Crown },
  { value: 'borda_perfil', label: 'Bordas', Icon: Sparkles },
  { value: 'mini_logo_badge', label: 'Selos', Icon: Star },
  { value: 'exp_buff', label: 'Buffs EXP', Icon: Zap },
  { value: 'plataforma_trial', label: 'Plano Premium', Icon: Gem },
];

const RARITY_LABEL: Record<string, string> = {
  common: 'Comum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
  mythic: 'Mítico',
};

const RARITY_TINT: Record<string, { color: string; bg: string; border: string }> = {
  common:    { color: '#94a3b8', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.30)' },
  rare:      { color: '#60a5fa', bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.30)' },
  epic:      { color: '#c084fc', bg: 'rgba(168,85,247,0.10)',  border: 'rgba(168,85,247,0.40)' },
  legendary: { color: '#fbbf24', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.50)' },
  mythic:    { color: '#fb7185', bg: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.55)' },
};

function rarityWeight(r: string): number {
  return ({ mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 } as Record<string, number>)[r] ?? 0;
}

export default function LojaPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [items, setItems] = useState<StoreItem[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sort, setSort] = useState<string>('rarity_desc');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [confirmItem, setConfirmItem] = useState<StoreItem | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<{ ok: boolean; message: string; item?: StoreItem } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/store/items?sort=rarity_desc', { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao carregar loja');
      const data = await res.json();
      setItems(data.items ?? []);
      if (typeof data.balance === 'number') setBalance(data.balance);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadItems();
  }, [user]);

  async function handlePurchase(item: StoreItem) {
    setPurchasing(item.id);
    setError(null);
    try {
      const res = await fetch('/api/store/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) {
          setPurchaseResult({
            ok: false,
            message: `Faltam ${data.missing} cristais para adquirir este item.`,
            item,
          });
        } else if (data.error === 'already_owned') {
          setPurchaseResult({ ok: false, message: 'Você já possui este item.', item });
        } else {
          setPurchaseResult({ ok: false, message: data.error ?? 'Erro ao comprar', item });
        }
        return;
      }
      setBalance(data.balance);
      setPurchaseResult({ ok: true, message: `${item.name} adicionado ao seu inventário!`, item });
      // Recarrega para refletir owned/equipped
      loadItems();
    } catch (e) {
      setPurchaseResult({ ok: false, message: e instanceof Error ? e.message : 'Erro' });
    } finally {
      setPurchasing(null);
      setConfirmItem(null);
    }
  }

  // Filtra + ordena em memória
  const visibleItems = useMemo(() => {
    let filtered = items;
    if (activeCategory !== 'all') {
      filtered = filtered.filter((i) => i.category === activeCategory);
    }
    const sorted = [...filtered];
    if (sort === 'price_asc') sorted.sort((a, b) => a.priceCrystals - b.priceCrystals);
    else if (sort === 'price_desc') sorted.sort((a, b) => b.priceCrystals - a.priceCrystals);
    else if (sort === 'rarity_desc') sorted.sort((a, b) => rarityWeight(b.rarity) - rarityWeight(a.rarity) || a.priceCrystals - b.priceCrystals);
    return sorted;
  }, [items, activeCategory, sort]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Navbar */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-40 px-4 sm:px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition shrink-0" aria-label="Voltar">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="hidden sm:block text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            FOCO FEDERAL
          </Link>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="text-sm text-slate-400 font-medium truncate">Loja de Cristais</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Saldo de cristais */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(59,130,246,0.10))',
              border: '1px solid rgba(168,85,247,0.30)',
              boxShadow: '0 0 14px rgba(168,85,247,0.20)',
            }}
            title="Cristais"
          >
            <Gem size={14} className="text-fuchsia-300" />
            <span className="text-sm font-black text-white tabular-nums">{balance.toLocaleString('pt-BR')}</span>
          </div>
          <NotificationBell />
          <UserMenu onLogout={() => { router.push('/auth/login'); }} />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white">Loja de Cristais</h1>
          <p className="text-sm text-slate-400 mt-1">
            Use seus cristais para destacar seu perfil, ganhar EXP em dobro ou estender sua assinatura.
          </p>
          <Link
            href="/dashboard/inventario"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            Ver meu inventário
            <ChevronLeft className="w-3 h-3 rotate-180" />
          </Link>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            const Icon = cat.Icon;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_14px_rgba(16,185,129,0.30)]'
                    : 'bg-slate-900 text-slate-400 border border-white/8 hover:border-white/15 hover:text-slate-200'
                }`}
              >
                <Icon size={12} />
                {cat.label}
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Ordenar</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-slate-900 border border-white/10 text-slate-200 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="rarity_desc">Raridade ↓</option>
              <option value="price_asc">Preço ↑</option>
              <option value="price_desc">Preço ↓</option>
              <option value="newest">Novidades</option>
            </select>
          </div>
        </div>

        {/* Lista de itens */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-32 text-slate-400">{error}</div>
        ) : visibleItems.length === 0 ? (
          <div className="text-center py-32 text-slate-500">Nenhum item nesta categoria.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleItems.map((item) => {
              const tint = RARITY_TINT[item.rarity] ?? RARITY_TINT.common;
              const cantAfford = balance < item.priceCrystals;
              return (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-2xl flex flex-col transition-all hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(180deg, ${tint.bg}, rgba(15,23,42,0.85))`,
                    border: `1px solid ${tint.border}`,
                    boxShadow: `0 8px 24px -8px ${tint.color}33`,
                  }}
                >
                  {/* Faixa de raridade */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                    <span
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: tint.color }}
                    >
                      {RARITY_LABEL[item.rarity] ?? item.rarity}
                    </span>
                    {item.owned && (
                      <span
                        className="flex items-center gap-1 text-[10px] font-bold"
                        style={{ color: '#34d399' }}
                      >
                        <Check size={10} /> Adquirido
                      </span>
                    )}
                  </div>

                  {/* Preview */}
                  <div className="flex items-center justify-center py-6 px-4 relative">
                    <StoreItemPreview item={item} size={96} />
                    {item.equipped && (
                      <span
                        className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                        style={{
                          background: 'rgba(16,185,129,0.15)',
                          color: '#34d399',
                          border: '1px solid rgba(16,185,129,0.40)',
                        }}
                      >
                        Equipado
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="px-3 pb-3 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-white leading-tight mb-1">{item.name}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 flex-1">{item.description}</p>

                    {/* Preço + ação */}
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="flex items-center gap-1 px-2 py-1 rounded-lg"
                        style={{
                          background: 'rgba(168,85,247,0.10)',
                          border: '1px solid rgba(168,85,247,0.20)',
                        }}
                      >
                        <Gem size={11} className="text-fuchsia-300" />
                        <span className="text-xs font-black tabular-nums text-white">
                          {item.priceCrystals.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      {item.owned && item.category !== 'exp_buff' && item.category !== 'plataforma_trial' ? (
                        <Link
                          href="/dashboard/inventario"
                          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 px-2 py-1 transition"
                        >
                          Equipar
                        </Link>
                      ) : (
                        <button
                          onClick={() => setConfirmItem(item)}
                          disabled={purchasing === item.id || cantAfford}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            background: cantAfford
                              ? 'rgba(71,85,105,0.30)'
                              : 'linear-gradient(135deg, #10b981, #059669)',
                            color: cantAfford ? '#94a3b8' : '#020617',
                            boxShadow: cantAfford ? 'none' : '0 0 12px rgba(16,185,129,0.40)',
                          }}
                        >
                          {purchasing === item.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : cantAfford ? (
                            <Lock size={11} />
                          ) : null}
                          {cantAfford ? 'Sem cristais' : item.owned ? 'Comprar +1' : 'Comprar'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de confirmação */}
      {confirmItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmItem(null); }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.88) 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 20px 60px -12px rgba(0,0,0,0.7)',
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }}
            />
            <div className="p-5 flex flex-col items-center">
              <StoreItemPreview item={confirmItem} size={112} />
              <h3 className="text-lg font-black text-white mt-4">{confirmItem.name}</h3>
              <p className="text-xs text-slate-400 text-center mt-1">{confirmItem.description}</p>

              <div
                className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(168,85,247,0.10)', border: '1px solid rgba(168,85,247,0.30)' }}
              >
                <Gem size={14} className="text-fuchsia-300" />
                <span className="text-base font-black text-white tabular-nums">
                  {confirmItem.priceCrystals.toLocaleString('pt-BR')}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">
                  / saldo: {balance.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-5 w-full">
                <button
                  onClick={() => setConfirmItem(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-300 bg-slate-800/60 border border-white/8 hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handlePurchase(confirmItem)}
                  disabled={purchasing === confirmItem.id || balance < confirmItem.priceCrystals}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black text-slate-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    boxShadow: '0 0 16px rgba(16,185,129,0.40)',
                  }}
                >
                  {purchasing === confirmItem.id ? (
                    <Loader2 size={14} className="animate-spin mx-auto" />
                  ) : (
                    'Confirmar compra'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de resultado */}
      {purchaseResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setPurchaseResult(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden p-5 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.88) 100%)',
              border: `1px solid ${purchaseResult.ok ? 'rgba(16,185,129,0.40)' : 'rgba(244,63,94,0.40)'}`,
            }}
          >
            <div className="flex items-center justify-center mb-4">
              {purchaseResult.ok ? (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.50)' }}
                >
                  <Check className="w-7 h-7 text-emerald-400" />
                </div>
              ) : (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(244,63,94,0.15)', border: '2px solid rgba(244,63,94,0.50)' }}
                >
                  <Lock className="w-7 h-7 text-rose-400" />
                </div>
              )}
            </div>
            <h3 className="text-lg font-black text-white">
              {purchaseResult.ok ? 'Compra concluída!' : 'Não foi possível comprar'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">{purchaseResult.message}</p>
            <button
              onClick={() => setPurchaseResult(null)}
              className="mt-5 w-full py-2.5 rounded-xl text-sm font-bold bg-slate-800/60 border border-white/8 text-slate-200 hover:bg-slate-800 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
