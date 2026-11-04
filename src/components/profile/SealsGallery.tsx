'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, Check, Lock, ShoppingBag, Star } from 'lucide-react';
import { StoreItemPreview, type StoreItemLite } from '@/components/store/StoreItemPreview';

interface StoreItemFull extends StoreItemLite {
  description: string;
  priceCrystals: number;
  owned: boolean;
  equipped: boolean;
}

interface SealsGalleryProps {
  // chamado quando o loadout for salvo, para o parent re-fetch perfil
  onEquipped?: () => void;
}

const RARITY_TINT: Record<string, { color: string; label: string; bg: string; border: string }> = {
  common:    { color: '#94a3b8', label: 'Comum',    bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.30)' },
  rare:      { color: '#60a5fa', label: 'Raro',     bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.30)' },
  epic:      { color: '#c084fc', label: 'Épico',    bg: 'rgba(168,85,247,0.10)',  border: 'rgba(168,85,247,0.40)' },
  legendary: { color: '#fbbf24', label: 'Lendário', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.50)' },
  mythic:    { color: '#fb7185', label: 'Mítico',   bg: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.55)' },
};

export function SealsGallery({ onEquipped }: SealsGalleryProps) {
  const [seals, setSeals] = useState<StoreItemFull[]>([]);
  const [equippedIds, setEquippedIds] = useState<string[]>([]);
  // preserva os outros slots do loadout ao salvar
  const [borderItemId, setBorderItemId] = useState<string | null>(null);
  const [avatarItemId, setAvatarItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    try {
      const res = await fetch('/api/store/items', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Falha ao carregar seus selos');
      const all: StoreItemFull[] = data.items ?? [];
      setLoadError(null);

      // só selos
      const sealsList = all
        .filter((i) => i.category === 'mini_logo_badge')
        .sort((a, b) => {
          // owned first; depois preço asc
          if (a.owned !== b.owned) return a.owned ? -1 : 1;
          return a.priceCrystals - b.priceCrystals;
        });
      setSeals(sealsList);

      // estado inicial: o que já está equipado
      setEquippedIds(sealsList.filter((s) => s.equipped).map((s) => s.id));

      // preserva borda/avatar atualmente equipados
      const eqBorder = all.find((i) => i.category === 'borda_perfil' && i.equipped);
      const eqAvatar = all.find(
        (i) => (i.category === 'avatar_orgao' || i.category === 'avatar_vitoria') && i.equipped,
      );
      setBorderItemId(eqBorder?.id ?? null);
      setAvatarItemId(eqAvatar?.id ?? null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Falha ao carregar seus selos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function toggle(id: string) {
    if (saving) return;
    setFeedback(null);
    const previousIds = equippedIds;
    let nextIds: string[];
    if (equippedIds.includes(id)) {
      nextIds = equippedIds.filter((x) => x !== id);
    } else {
      if (equippedIds.length >= 3) return;
      nextIds = [...equippedIds, id];
    }

    setEquippedIds(nextIds);
    setSaving(true);
    try {
      const res = await fetch('/api/users/me/loadout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borderItemId,
          avatarItemId,
          badgeIds: nextIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEquippedIds(previousIds);
        setFeedback({ ok: false, text: data.error ?? 'Erro ao salvar' });
        return;
      }
      setFeedback({ ok: true, text: 'Selos atualizados!' });
      onEquipped?.();
    } catch (e) {
      setEquippedIds(previousIds);
      setFeedback({ ok: false, text: e instanceof Error ? e.message : 'Erro' });
    } finally {
      setSaving(false);
    }
  }

  const ownedCount = seals.filter((s) => s.owned).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div>
      {loadError && (
        <p className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
          {loadError}
        </p>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-xs text-slate-500 leading-relaxed max-w-md">
          Equipe até 3 selos para mostrar ao lado do seu nome no perfil e no chat.
        </p>
        <span
          className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
          style={{
            background: 'rgba(16,185,129,0.10)',
            border: '1px solid rgba(16,185,129,0.30)',
            color: '#34d399',
          }}
        >
          {equippedIds.length}/3 equipados
        </span>
      </div>

      {/* Grid */}
      {seals.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {seals.map((seal) => {
            const tint = RARITY_TINT[seal.rarity] ?? RARITY_TINT.common;
            const isOwned = seal.owned;
            const isEquipped = equippedIds.includes(seal.id);
            const reachedMax = !isEquipped && equippedIds.length >= 3;

            return (
              <button
                key={seal.id}
                onClick={() => isOwned && toggle(seal.id)}
                disabled={saving || !isOwned || (reachedMax && !isEquipped)}
                className="relative overflow-hidden rounded-2xl flex flex-col text-left transition-all enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(180deg, ${tint.bg}, rgba(15,23,42,0.85))`,
                  border: `1px solid ${isEquipped ? '#10b981' : tint.border}`,
                  boxShadow: isEquipped
                    ? '0 0 16px rgba(16,185,129,0.40)'
                    : `0 4px 12px -4px ${tint.color}33`,
                  opacity: isOwned ? 1 : 0.55,
                }}
              >
                <div className="flex items-center justify-center py-4 px-3 relative">
                  <StoreItemPreview item={seal} size={64} />
                  {isEquipped && (
                    <span
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: '#10b981' }}
                    >
                      <Check size={12} className="text-slate-950" strokeWidth={3} />
                    </span>
                  )}
                  {!isOwned && (
                    <span
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-sm"
                      style={{ background: 'rgba(2,6,23,0.85)', border: '1px solid rgba(255,255,255,0.10)' }}
                    >
                      <Lock size={11} className="text-slate-400" />
                    </span>
                  )}
                </div>
                <div className="px-3 pb-3 border-t border-white/5 pt-2">
                  <p className="text-xs font-bold text-white truncate">{seal.name}</p>
                  <p
                    className="text-[9px] uppercase tracking-widest font-black mt-0.5"
                    style={{ color: tint.color }}
                  >
                    {tint.label}
                  </p>
                  <p
                    className="text-[10px] mt-1"
                    style={{ color: isEquipped ? '#34d399' : isOwned ? '#64748b' : '#475569' }}
                  >
                    {isEquipped
                      ? 'Equipado'
                      : isOwned
                        ? reachedMax
                          ? 'Desequipe um para trocar'
                          : 'Toque para equipar'
                        : `${seal.priceCrystals.toLocaleString('pt-BR')} cristais`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 mt-5 flex-wrap">
        <Link
          href="/dashboard/loja?cat=mini_logo_badge"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition"
        >
          <ShoppingBag size={12} />
          {ownedCount === 0 ? 'Comprar selos' : 'Ver mais na loja'}
        </Link>

        <div className="flex items-center gap-3">
          {feedback && (
            <span
              className="text-xs font-bold"
              style={{ color: feedback.ok ? '#34d399' : '#fb7185' }}
            >
              {feedback.text}
            </span>
          )}
          {saving && <Loader2 size={14} className="animate-spin text-emerald-400" aria-label="Salvando selos" />}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-2xl py-10 px-6 text-center"
      style={{ background: 'rgba(15,23,42,0.50)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3"
        style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.20), rgba(59,130,246,0.10))',
          border: '1px solid rgba(168,85,247,0.30)',
        }}
      >
        <Star size={20} className="text-fuchsia-300" />
      </div>
      <p className="text-sm font-bold text-white">Nenhum selo disponível</p>
      <p className="text-xs text-slate-500 mt-1">A loja está sendo populada — tente novamente em instantes.</p>
    </div>
  );
}
