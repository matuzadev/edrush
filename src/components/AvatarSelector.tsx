'use client';

import React from 'react';

export const AVATAR_OPTIONS = [
  { id: 1, initials: '👨' },
  { id: 2, initials: '👩' },
  { id: 3, initials: '🧔' },
  { id: 4, initials: '👱' },
  { id: 5, initials: '🧒' },
  { id: 6, initials: '👧' },
  { id: 7, initials: '🕺' },
  { id: 8, initials: '💃' },
  { id: 9, initials: '👨‍💼' },
  { id: 10, initials: '👩‍💼' },
  { id: 11, initials: '👨‍🎓' },
  { id: 12, initials: '👩‍🎓' },
];

interface AvatarSelectorProps {
  selectedId?: number;
  onSelect?: (id: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarSelector({ selectedId = 1, onSelect, size = 'md' }: AvatarSelectorProps) {
  const avatar = AVATAR_OPTIONS.find(a => a.id === selectedId) || AVATAR_OPTIONS[0];
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-20 h-20 text-4xl',
  };

  if (!onSelect) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white`}>
        {avatar.initials}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white mx-auto`}>
        {avatar.initials}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {AVATAR_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all border-2 ${
              selectedId === option.id
                ? 'border-emerald-500 scale-105 shadow-lg shadow-emerald-500/50'
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            {option.initials}
          </button>
        ))}
      </div>
    </div>
  );
}
