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
  Sparkles,
  Zap,
  Crown,
  Shield,
  Star,
  Loader2,
  Clock,
  ShoppingBag,
  Save,
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

interface Transaction {
  id: string;
  amount: number;
  type: string;
  reason: string;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, { label: string; Icon: typeof Crown }> = {
  avatar_orgao:     { label: 'Avatares Órgão', Icon: Shield },
  avatar_vitoria:   { label: 'Avatares Vitória', Icon: Crown },
  borda_perfil:     { label: 'Bordas', Icon: Sparkles },
  mini_logo_badge:  { label: 'Selos', Icon: Star },
  exp_buff:         { label: 'Buffs EXP', Icon: Zap },
  plataforma_trial: { label: 'Plano Premium', Icon: Gem },
};

const RARITY_TINT: Record<string, { color: string; bg: string; border: string }> = {
  common:    { color: '#94a3b8', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.30)' },
  rare:      { color: '#60a5fa', bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.30)' },
  epic:      { color: '#c084fc', bg: 'rgba(168,85,247,0.10)',  border: 'rgba(168,85,247,0.40)' },
  legendary: { color: '#fbbf24', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.50)' },
  mythic:    { color: '#fb7185', bg: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.55)' },
};

// Slot equipável no loadout
function isEquipableCategory(c: string): boolean {
  return c === 'borda_perfil' || c === 'avatar_orgao' || c === 'avatar_vitoria' || c === 'mini_logo_badge';
}

export default function InventarioPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [items, setItems] = useState<StoreItem[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [expBuff, setExpBuff] = useState<{ multiplier: number; expiresAt: string } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ ok: boolean; text: string } | null>(null);

  // Estado do loadout em edição
  const [borderId, setBorderId] = useState<string | null>(null);
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [badgeIds, setBadgeIds] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [itemsRes, crystalsRes, txRes] = await Promise.all([
        fetch('/api/store/items', { cache: 'no-store' }),
        fetch('/api/users/me/crystals', { cache: 'no-store' }),
        fetch('/api/users/me/transactions?limit=10', { cache: 'no-store' }),
      ]);
      if (!itemsRes.ok) throw new Error('Falha ao carregar inventário');
      const itemsData = await itemsRes.json();
      const allItems: StoreItem[] = (itemsData.items ?? []).filter((i: StoreItem) => i.owned);
      setItems(allItems);

      // Inicializa loadout com itens já equipados (do servidor)
      const equippedBorder = allItems.find((i) => i.category === 'borda_perfil' && i.equipped);
      const equippedAvatar = allItems.find((i) => (i.category === 'avatar_orgao' || i.category === 'avatar_vitoria') && i.equipped);
      const equippedBadges = allItems.filter((i) => i.category === 'mini_logo_badge' && i.equipped);
      setBorderId(equippedBorder?.id ?? null);
      setAvatarId(equippedAvatar?.id ?? null);
      setBadgeIds(equippedBadges.slice(0, 3).map((b) => b.id));

      if (typeof itemsData.balance === 'number') setBalance(itemsData.balance);

      if (crystalsRes.ok) {
        const c = await crystalsRes.json();
        setBalance(typeof c.balance === 'number' ? c.balance : 0);
        setExpBuff(c.expBuff ?? null);
      }

      if (txRes.ok) {
        const t = await txRes.json();
        setTransactions(t.transactions ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadAll();
  }, [user]);

  // Agrupa itens por categoria
  const grouped = useMemo(() => {
    const map = new Map<string, StoreItem[]>();
    for (const it of items) {
      const arr = map.get(it.category) ?? [];
      arr.push(it);
      map.set(it.category, arr);
    }
    return [...map.entries()];
  }, [items]);

  function toggleBadge(id: string) {
    setBadgeIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  async function saveLoadout() {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/users/me/loadout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borderItemId: borderId,
          avatarItemId: avatarId,
          badgeIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveMessage({ ok: false, text: data.error ?? 'Erro ao salvar' });
        return;
      }
      setSaveMessage({ ok: true, text: 'Vitrine atualizada!' });
      // recarrega para atualizar equipped flags
      loadAll();
    } catch (e) {
      setSaveMessage({ ok: false, text: e instanceof Error ? e.message : 'Erro' });
    } finally {
      setSaving(false);
    }
  }

  // Tempo restante do buff (formatado)
  const buffRemaining = useMemo(() => {
    if (!expBuff) return null;
    const ms = new Date(expBuff.expiresAt).getTime() - Date.now();
    if (ms <= 0) return null;
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    return `${hours}h ${minutes}m`;
  }, [expBuff]);

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
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="hidden sm:block text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            FOCO FEDERAL
          </Link>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="text-sm text-slate-400 font-medium truncate">Inventário</span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(59,130,246,0.10))',
              border: '1px solid rgba(168,85,247,0.30)',
              boxShadow: '0 0 14px rgba(168,85,247,0.20)',
            }}
          >
            <Gem size={14} className="text-fuchsia-300" />
            <span className="text-sm font-black text-white tabular-nums">{balance.toLocaleString('pt-BR')}</span>
          </div>
          <NotificationBell />
          <UserMenu onLogout={() => { router.push('/auth/login'); }} />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Meu Inventário</h1>
            <p className="text-sm text-slate-400 mt-1">
              Equipe seus itens favoritos para personalizar seu perfil público.
            </p>
          </div>
          <Link
            href="/dashboard/loja"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black text-slate-950 transition"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 0 14px rgba(16,185,129,0.30)',
            }}
          >
            <ShoppingBag size={14} />
            Ir à loja
          </Link>
        </div>

        {/* Buff ativo */}
        {expBuff && buffRemaining && (
          <div
            className="mb-6 px-4 py-3 rounded-2xl flex items-center gap-3 flex-wrap"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(15,23,42,0.6))',
              border: '1px solid rgba(16,185,129,0.40)',
              boxShadow: '0 0 24px rgba(16,185,129,0.20)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(16,185,129,0.25)', border: '1px solid rgba(16,185,129,0.50)' }}
            >
              <Zap className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase font-black text-emerald-300 tracking-widest">Buff de EXP ativo</p>
              <p className="text-sm font-bold text-white">
                Multiplicador {expBuff.multiplier}x · expira em {buffRemaining}
              </p>
            </div>
          </div>
        )}

        {/* Loading / error */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-32 text-slate-400">{error}</div>
        ) : items.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-300 font-bold mt-4">Seu inventário está vazio</p>
            <p className="text-sm text-slate-500 mt-1">Visite a loja para adquirir seus primeiros itens.</p>
            <Link
              href="/dashboard/loja"
              className="inline-block mt-5 px-6 py-2 rounded-xl text-sm font-black text-slate-950"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 0 14px rgba(16,185,129,0.30)',
              }}
            >
              Visitar loja
            </Link>
          </div>
        ) : (
          <>
            {/* Grupos por categoria */}
            <div className="space-y-6">
              {grouped.map(([category, catItems]) => {
                const cfg = CATEGORY_LABELS[category];
                const Icon = cfg?.Icon ?? ShoppingBag;
                return (
                  <section
                    key={category}
                    className="relative overflow-hidden rounded-2xl p-5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.40))',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Icon size={14} className="text-emerald-400" />
                        </div>
                        <h3 className="font-bold text-white text-sm">{cfg?.label ?? category}</h3>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {catItems.length}
                        </span>
                      </div>
                      {category === 'mini_logo_badge' && (
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {badgeIds.length}/3 equipados
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {catItems.map((item) => {
                        const tint = RARITY_TINT[item.rarity] ?? RARITY_TINT.common;
                        const isEquipable = isEquipableCategory(item.category);
                        let isSelected = false;
                        if (item.category === 'borda_perfil') isSelected = borderId === item.id;
                        else if (item.category === 'avatar_orgao' || item.category === 'avatar_vitoria') isSelected = avatarId === item.id;
                        else if (item.category === 'mini_logo_badge') isSelected = badgeIds.includes(item.id);

                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              if (!isEquipable) return;
                              if (item.category === 'borda_perfil') setBorderId(isSelected ? null : item.id);
                              else if (item.category === 'avatar_orgao' || item.category === 'avatar_vitoria') setAvatarId(isSelected ? null : item.id);
                              else if (item.category === 'mini_logo_badge') toggleBadge(item.id);
                            }}
                            className="relative overflow-hidden rounded-2xl flex flex-col text-left transition-all hover:-translate-y-0.5"
                            style={{
                              background: `linear-gradient(180deg, ${tint.bg}, rgba(15,23,42,0.85))`,
                              border: `1px solid ${isSelected ? '#10b981' : tint.border}`,
                              boxShadow: isSelected
                                ? '0 0 16px rgba(16,185,129,0.40)'
                                : `0 4px 12px -4px ${tint.color}33`,
                            }}
                            disabled={!isEquipable}
                          >
                            <div className="flex items-center justify-center py-4 px-3 relative">
                              <StoreItemPreview item={item} size={80} />
                              {isSelected && (
                                <span
                                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                  style={{ background: '#10b981' }}
                                >
                                  <Check size={12} className="text-slate-950" strokeWidth={3} />
                                </span>
                              )}
                            </div>
                            <div className="px-3 pb-3 border-t border-white/5 pt-2">
                              <p className="text-xs font-bold text-white truncate">{item.name}</p>
                              {item.category === 'exp_buff' || item.category === 'plataforma_trial' ? (
                                <p className="text-[10px] text-slate-500 mt-0.5">Consumível</p>
                              ) : (
                                <p className="text-[10px] mt-0.5" style={{ color: isSelected ? '#34d399' : '#64748b' }}>
                                  {isSelected ? 'Selecionado' : isEquipable ? 'Toque para equipar' : 'Já aplicado'}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Barra de salvar */}
            <div
              className="fixed bottom-4 left-4 right-4 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:mt-8 z-30"
            >
              <div
                className="flex items-center justify-between gap-3 p-4 rounded-2xl flex-wrap"
                style={{
                  background: 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.88) 100%)',
                  border: '1px solid rgba(16,185,129,0.30)',
                  boxShadow: '0 12px 32px -8px rgba(16,185,129,0.20)',
                }}
              >
                <div className="text-sm">
                  <p className="font-bold text-white">Personalize sua vitrine</p>
                  <p className="text-xs text-slate-400">As escolhas aparecem no seu perfil público.</p>
                </div>
                <div className="flex items-center gap-2">
                  {saveMessage && (
                    <span
                      className="text-xs font-bold"
                      style={{ color: saveMessage.ok ? '#34d399' : '#fb7185' }}
                    >
                      {saveMessage.text}
                    </span>
                  )}
                  <button
                    onClick={saveLoadout}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-black text-slate-950 transition disabled:opacity-60"
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      boxShadow: '0 0 14px rgba(16,185,129,0.40)',
                    }}
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Salvar vitrine
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Histórico de transações */}
        {transactions.length > 0 && (
          <section
            className="mt-6 relative overflow-hidden rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.40))',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center">
                <Clock size={14} className="text-fuchsia-400" />
              </div>
              <h3 className="font-bold text-white text-sm">Últimas transações</h3>
            </div>
            <div className="space-y-2">
              {transactions.map((tx) => {
                const isPositive = tx.amount > 0;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2 px-3 rounded-xl"
                    style={{
                      background: isPositive ? 'rgba(16,185,129,0.06)' : 'rgba(244,63,94,0.06)',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-200 truncate">{tx.reason}</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(tx.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <span
                      className="text-sm font-black tabular-nums shrink-0 flex items-center gap-1"
                      style={{ color: isPositive ? '#34d399' : '#fb7185' }}
                    >
                      <Gem size={11} />
                      {isPositive ? '+' : ''}{tx.amount.toLocaleString('pt-BR')}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
