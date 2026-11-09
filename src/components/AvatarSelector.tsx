'use client';

import React, { useState } from 'react';
import { getAvatar, CHARACTER_AVATARS, ORGAO_AVATARS, type AvatarDef } from '@/data/avatars';
import Avatar from './Avatar';

// Mantido para compatibilidade retroativa com código que importe AVATAR_OPTIONS
export const AVATAR_OPTIONS = [
  { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 },
  { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }, { id: 11 }, { id: 12 },
];

interface AvatarSelectorProps {
  selectedId?: number;
  onSelect?: (id: number) => void;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string | null;
}

const SIZE_PX: Record<string, number> = { sm: 32, md: 48, lg: 96 };

function AvatarCircle({ avatar, size, imageUrl }: { avatar: AvatarDef; size: number; imageUrl?: string | null }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${avatar.colors.primary}33, ${avatar.colors.accent}22)`,
        border: `1.5px solid ${avatar.colors.primary}55`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <Avatar avatar={avatar} url={imageUrl} size={Math.round(size * 0.78)} />
    </div>
  );
}

export function AvatarSelector({ selectedId = 1, onSelect, size = 'md', imageUrl }: AvatarSelectorProps) {
  const [tab, setTab] = useState<'character' | 'orgao'>('character');
  const avatar = getAvatar(selectedId);
  const sizePx = SIZE_PX[size] ?? 48;

  if (!onSelect) {
    return <AvatarCircle avatar={avatar} size={sizePx} imageUrl={imageUrl} />;
  }

  const list = tab === 'character' ? CHARACTER_AVATARS : ORGAO_AVATARS;

  return (
    <div className="space-y-4">
      {/* Preview do avatar selecionado */}
      <div className="flex justify-center">
        <AvatarCircle avatar={avatar} size={sizePx} imageUrl={imageUrl} />
      </div>

      {/* Abas */}
      <div className="flex rounded-xl overflow-hidden border border-white/10 bg-slate-900/60">
        {(['character', 'orgao'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 text-xs font-bold transition-all"
            style={{
              background: tab === t ? 'rgba(16,185,129,0.15)' : 'transparent',
              color: tab === t ? '#34d399' : '#94a3b8',
              borderBottom: tab === t ? '2px solid #10b981' : '2px solid transparent',
            }}
          >
            {t === 'character' ? 'Personagens Foco' : 'Órgãos Públicos'}
          </button>
        ))}
      </div>

      {/* Grid de avatares */}
      <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
        {list.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              title={option.name}
              className="group flex flex-col items-center gap-1.5 transition-all"
              aria-label={option.name}
              aria-pressed={isSelected}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: isSelected
                    ? `linear-gradient(135deg, ${option.colors.primary}44, ${option.colors.accent}22)`
                    : 'rgba(30,41,59,0.6)',
                  border: isSelected
                    ? `2px solid ${option.colors.primary}`
                    : '2px solid rgba(255,255,255,0.08)',
                  boxShadow: isSelected
                    ? `0 0 16px ${option.colors.primary}55`
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  transform: isSelected ? 'scale(1.08)' : undefined,
                  transition: 'all 0.15s ease',
                }}
              >
                <Avatar avatar={option} size={40} />
              </div>
              <span
                className="text-[9px] text-center leading-tight max-w-[52px] line-clamp-2 transition-colors"
                style={{ color: isSelected ? option.colors.accent : '#64748b' }}
              >
                {option.name.split(' ').slice(0, 2).join(' ')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
