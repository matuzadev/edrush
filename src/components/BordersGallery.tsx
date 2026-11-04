'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Lock, Loader2, Check, Sparkles, ShoppingBag } from 'lucide-react';
import { TIER_COLOR, type BorderTier } from '@/data/borders';
import { AvatarBorder } from './AvatarBorder';
import { StoreItemPreview, type StoreItemLite } from '@/components/store/StoreItemPreview';

interface BorderItem {
  slug: string;
  name: string;
  description: string;
  tier: BorderTier;
  criteriaText: string;
  criteriaType: string;
  criteriaValue: number;
  style: {
    ring: string;
    glow: string;
    glowSize?: number;
    pulse?: boolean;
    rotate?: boolean;
    sparkle?: boolean;
    width?: number;
  };
  unlocked: boolean;
  equipped: boolean;
}

interface BordersGalleryProps {
  avatarId: number;
  // chamado quando o usuário equipa/desequipa, para o parent re-fetch o profile
  onEquipped?: (slug: string) => void;
}

interface StoreBorder extends StoreItemLite {
  description: string;
  priceCrystals: number;
  owned: boolean;
  equipped: boolean;
}

const TIER_ORDER: BorderTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'mythic'];

export function BordersGallery({ avatarId, onEquipped }: BordersGalleryProps) {
  const [borders, setBorders] = useState<BorderItem[]>([]);
  const [storeBorders, setStoreBorders] = useState<StoreBorder[]>([]);
  const [stats, setStats] = useState<{ totalUnlocked: number; total: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [equippingSlug, setEquippingSlug] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<BorderTier | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const [avatarItemId, setAvatarItemId] = useState<string | null>(null);
  const [badgeIds, setBadgeIds] = useState<string[]>([]);

  const fetchBorders = useCallback(async () => {
    try {
      const [bordersRes, itemsRes] = await Promise.all([
        fetch('/api/borders', { cache: 'no-store' }),
        fetch('/api/store/items', { cache: 'no-store' }),
      ]);
      const [bordersData, itemsData] = await Promise.all([
        bordersRes.json(),
        itemsRes.json(),
      ]);
      if (!bordersRes.ok) throw new Error(bordersData.error ?? 'Falha ao carregar bordas');
      if (!itemsRes.ok) throw new Error(itemsData.error ?? 'Falha ao carregar itens do inventário');
      const allItems: StoreBorder[] = itemsData.items ?? [];
      setBorders(bordersData.borders ?? []);
      setError(null);
      setStoreBorders(
        allItems
          .filter((item) => item.category === 'borda_perfil' && item.owned)
          .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
      );
      setAvatarItemId(allItems.find(
        (item) =>
          (item.category === 'avatar_orgao' || item.category === 'avatar_vitoria') &&
          item.equipped,
      )?.id ?? null);
      setBadgeIds(allItems
        .filter((item) => item.category === 'mini_logo_badge' && item.equipped)
        .slice(0, 3)
        .map((badge) => badge.id));
      setStats({
        totalUnlocked: bordersData.totalUnlocked ?? 0,
        total: bordersData.total ?? 0,
      });
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Falha ao carregar bordas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load persisted inventory after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBorders();
  }, [fetchBorders]);

  const handleEquip = async (slug: string) => {
    if (equippingSlug) return;
    setEquippingSlug(slug);
    setError(null);
    try {
      const res = await fetch('/api/borders/equip', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Não foi possível equipar a borda');
      setBorders(prev => prev.map(b => ({ ...b, equipped: b.slug === slug })));
      setStoreBorders(prev => prev.map(b => ({ ...b, equipped: false })));
      onEquipped?.(slug);
    } catch (equipError) {
      setError(equipError instanceof Error ? equipError.message : 'Não foi possível equipar a borda');
    } finally {
      setEquippingSlug(null);
    }
  };

  const handleEquipStoreBorder = async (item: StoreBorder) => {
    if (equippingSlug) return;
    setEquippingSlug(item.id);
    setError(null);
    try {
      const res = await fetch('/api/users/me/loadout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ borderItemId: item.id, avatarItemId, badgeIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Não foi possível equipar a borda');
      setError(null);
      setStoreBorders((prev) => prev.map((border) => ({
        ...border,
        equipped: border.id === item.id,
      })));
      setBorders((prev) => prev.map((border) => ({ ...border, equipped: false })));
      onEquipped?.(item.slug);
    } catch (equipError) {
      setError(equipError instanceof Error ? equipError.message : 'Não foi possível equipar a borda');
    } finally {
      setEquippingSlug(null);
    }
  };

  const filtered = activeTier === 'all' ? borders : borders.filter(b => b.tier === activeTier);

  // Agrupar por tier para a vista 'all'
  const grouped: Record<BorderTier, BorderItem[]> = {
    bronze: [], silver: [], gold: [], platinum: [], diamond: [], mythic: [],
  };
  for (const b of filtered) grouped[b.tier].push(b);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
          {error}
        </p>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400" />
            <h3 className="text-xs font-black text-white">Bordas da loja</h3>
            <span className="text-[10px] text-slate-500">{storeBorders.length} adquiridas</span>
          </div>
          <Link
            href="/dashboard/loja?cat=borda_perfil"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-emerald-400 transition"
          >
            <ShoppingBag size={12} /> Loja
          </Link>
        </div>
        {storeBorders.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {storeBorders.map((border) => (
              <button
                type="button"
                key={border.id}
                onClick={() => handleEquipStoreBorder(border)}
                disabled={Boolean(equippingSlug)}
                className="relative rounded-2xl p-4 flex flex-col items-center text-center transition-all disabled:opacity-60"
                style={{
                  background: border.equipped
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.16), rgba(15,23,42,0.7))'
                    : 'linear-gradient(135deg, rgba(30,41,59,0.55), rgba(15,23,42,0.35))',
                  border: `1px solid ${border.equipped ? 'rgba(16,185,129,0.75)' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: border.equipped ? '0 0 16px rgba(16,185,129,0.25)' : undefined,
                }}
              >
                {border.equipped && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check size={12} className="text-slate-950" strokeWidth={3} />
                  </span>
                )}
                <span className="my-2">
                  <StoreItemPreview item={border} size={64} />
                </span>
                <span className="text-xs font-bold text-white">{border.name}</span>
                <span className={`mt-2 text-[10px] font-bold ${border.equipped ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {equippingSlug === border.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : border.equipped ? 'Em uso' : 'Toque para equipar'}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-white/5 bg-slate-900/40 px-4 py-5 text-center text-xs text-slate-500">
            As bordas compradas aparecerão aqui para equipar.
          </p>
        )}
      </div>

      {/* Header com contador + filtro de tiers */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">
            {stats?.totalUnlocked ?? 0} <span className="text-slate-600">/ {stats?.total ?? 0} desbloqueadas</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <TierFilter
            label="Todas"
            active={activeTier === 'all'}
            onClick={() => setActiveTier('all')}
          />
          {TIER_ORDER.map(t => {
            const tc = TIER_COLOR[t];
            return (
              <TierFilter
                key={t}
                label={tc.label}
                color={tc.color}
                bg={tc.bg}
                border={tc.border}
                active={activeTier === t}
                onClick={() => setActiveTier(t)}
              />
            );
          })}
        </div>
      </div>

      {/* Renderiza por tier (todos abertos quando 'all'; senão um único grupo) */}
      {activeTier === 'all' ? (
        TIER_ORDER.map(tier => grouped[tier].length > 0 && (
          <div key={tier} className="mb-5 last:mb-0">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: TIER_COLOR[tier].color, boxShadow: `0 0 6px ${TIER_COLOR[tier].color}` }} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: TIER_COLOR[tier].color }}>
                {TIER_COLOR[tier].label}
              </span>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${TIER_COLOR[tier].border}, transparent)` }} />
            </div>
            <BorderGrid items={grouped[tier]} avatarId={avatarId} onEquip={handleEquip} equippingSlug={equippingSlug} />
          </div>
        ))
      ) : (
        <BorderGrid items={filtered} avatarId={avatarId} onEquip={handleEquip} equippingSlug={equippingSlug} />
      )}
    </div>
  );
}

function TierFilter({
  label, color, bg, border, active, onClick,
}: {
  label: string;
  color?: string;
  bg?: string;
  border?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
      style={{
        background: active
          ? (bg ?? 'rgba(16,185,129,0.15)')
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? (border ?? 'rgba(16,185,129,0.40)') : 'rgba(255,255,255,0.06)'}`,
        color: active ? (color ?? '#10b981') : '#64748b',
      }}
    >
      {label}
    </button>
  );
}

function BorderGrid({
  items, avatarId, onEquip, equippingSlug,
}: {
  items: BorderItem[];
  avatarId: number;
  onEquip: (slug: string) => void;
  equippingSlug: string | null;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map(b => (
        <BorderCard key={b.slug} item={b} avatarId={avatarId} onEquip={onEquip} loading={equippingSlug === b.slug} />
      ))}
    </div>
  );
}

function BorderCard({
  item, avatarId, onEquip, loading,
}: {
  item: BorderItem;
  avatarId: number;
  onEquip: (slug: string) => void;
  loading: boolean;
}) {
  const tier = TIER_COLOR[item.tier];
  const isLocked = !item.unlocked;
  const _ = avatarId;

  return (
    <div
      className="relative rounded-2xl p-4 overflow-hidden transition-all flex flex-col items-center text-center group"
      style={{
        background: item.equipped
          ? `linear-gradient(135deg, ${tier.bg}, rgba(15,23,42,0.50))`
          : 'linear-gradient(135deg, rgba(30,41,59,0.50), rgba(15,23,42,0.30))',
        border: `1px solid ${item.equipped ? tier.border : 'rgba(255,255,255,0.06)'}`,
        opacity: isLocked ? 0.65 : 1,
      }}
    >
      {item.equipped && (
        <div
          className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1"
          style={{ background: tier.color, color: '#020617' }}
        >
          <Check size={9} strokeWidth={3} /> Em uso
        </div>
      )}

      {!isLocked && !item.equipped && item.tier === 'diamond' && (
        <div
          className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1"
          style={{ background: tier.bg, color: tier.color, border: `1px solid ${tier.border}` }}
        >
          <Sparkles size={9} /> Raro
        </div>
      )}

      {!item.equipped && item.tier === 'mythic' && (
        <div
          className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1"
          style={{
            background: 'linear-gradient(90deg, #fde047, #fb923c, #ec4899)',
            color: '#020617',
            boxShadow: '0 0 10px rgba(253,224,71,0.50)',
          }}
        >
          <Sparkles size={9} strokeWidth={3} /> Exclusiva
        </div>
      )}

      {/* Preview da borda envolvendo um mini-disc do avatar */}
      <div className="my-3 relative">
        <AvatarBorder
          slug={item.slug}
          size={44}
          showSparkles={false}
        >
          <div
            className="w-full h-full"
            style={{
              background: isLocked
                ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                : 'linear-gradient(135deg, #475569, #1e293b)',
            }}
          />
        </AvatarBorder>
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-slate-950/80 flex items-center justify-center backdrop-blur-sm">
              <Lock size={14} className="text-slate-400" />
            </div>
          </div>
        )}
      </div>

      <p className="text-[12px] font-black text-white truncate w-full leading-tight">{item.name}</p>
      <p className="text-[9px] uppercase font-bold tracking-widest mt-0.5 truncate w-full" style={{ color: tier.color }}>
        {tier.label}
      </p>
      <p className="text-[10px] text-slate-500 mt-1.5 leading-tight line-clamp-2" title={item.description}>
        {isLocked ? item.criteriaText : item.description}
      </p>

      {!isLocked && !item.equipped && (
        <button
          onClick={() => onEquip(item.slug)}
          disabled={loading}
          className="mt-3 w-full py-1.5 rounded-lg text-[11px] font-black transition disabled:opacity-50"
          style={{
            background: tier.bg,
            color: tier.color,
            border: `1px solid ${tier.border}`,
          }}
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Equipar'}
        </button>
      )}

      {item.equipped && (
        <div className="mt-3 w-full py-1.5 text-[11px] font-black" style={{ color: tier.color }}>
          Equipada ✓
        </div>
      )}
    </div>
  );
}
