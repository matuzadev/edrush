'use client';

import { useEffect, useState, useCallback } from 'react';
import { StoreItemPreview, type StoreItemLite } from '@/components/store/StoreItemPreview';

interface Seal extends StoreItemLite {
  equipped: boolean;
}

interface Props {
  /** Tamanho do selo em px (mini ao lado do nome). */
  size?: number;
  /** Recarrega quando o pai sinalizar update (ex.: após salvar loadout). */
  reloadKey?: number;
  className?: string;
}

const RARITY_GLOW: Record<string, string> = {
  common: 'rgba(100,116,139,0.45)',
  rare: 'rgba(59,130,246,0.55)',
  epic: 'rgba(168,85,247,0.65)',
  legendary: 'rgba(245,158,11,0.75)',
  mythic: 'rgba(244,63,94,0.85)',
};

/**
 * Renderiza inline os selos equipados pelo usuário autenticado.
 * Usado ao lado do nome no perfil/dashboard.
 */
export function EquippedSeals({ size = 24, reloadKey = 0, className = '' }: Props) {
  const [seals, setSeals] = useState<Seal[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/store/items?category=mini_logo_badge', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const equipped: Seal[] = (data.items ?? []).filter((i: Seal) => i.equipped);
      setSeals(equipped.slice(0, 3));
    } catch {
      // silencioso — selos são decorativos
    }
  }, []);

  useEffect(() => { load(); }, [load, reloadKey]);

  if (seals.length === 0) return null;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`} aria-label="Selos equipados">
      {seals.map((seal) => {
        const glow = RARITY_GLOW[seal.rarity] ?? RARITY_GLOW.common;
        return (
          <span
            key={seal.id}
            title={seal.name}
            className="inline-flex items-center justify-center transition-transform hover:scale-110"
            style={{
              width: size,
              height: size,
              filter: `drop-shadow(0 0 6px ${glow})`,
            }}
          >
            <StoreItemPreview item={seal} size={size} />
          </span>
        );
      })}
    </div>
  );
}
