import { StoreItemPreview, type StoreItemLite } from '@/components/store/StoreItemPreview';

interface Props {
  loadout: {
    border: StoreItemLite | null;
    avatar: StoreItemLite | null;
    badges: StoreItemLite[];
  };
  inventory: Array<{ category: string; items: StoreItemLite[] }>;
  expBuff: { multiplier: number; expiresAt: string } | null;
}

const RARITY_TINT: Record<string, { color: string; label: string }> = {
  common:    { color: '#94a3b8', label: 'Comum' },
  rare:      { color: '#60a5fa', label: 'Raro' },
  epic:      { color: '#c084fc', label: 'Épico' },
  legendary: { color: '#fbbf24', label: 'Lendário' },
  mythic:    { color: '#fb7185', label: 'Mítico' },
};

const CATEGORY_LABELS: Record<string, string> = {
  avatar_orgao: 'Avatares Órgão',
  avatar_vitoria: 'Avatares Vitória',
  borda_perfil: 'Bordas',
  mini_logo_badge: 'Selos',
  exp_buff: 'Buffs (consumidos)',
  plataforma_trial: 'Premium ativado',
};

function formatBuffRemaining(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return 'expirado';
  const hours = Math.floor(ms / 3600000);
  if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

export function ProfileShowcase({ loadout, inventory, expBuff }: Props) {
  const hasLoadout = loadout.border || loadout.avatar || loadout.badges.length > 0;
  const hasInventory = inventory.some((g) => g.items.length > 0);

  if (!hasLoadout && !hasInventory && !expBuff) return null;

  return (
    <div className="space-y-5">
      {/* Loadout em destaque (vitrine principal) */}
      {hasLoadout && (
        <section
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.55))',
            border: '1px solid rgba(168,85,247,0.20)',
            boxShadow: '0 12px 32px -12px rgba(168,85,247,0.20)',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, #a855f7, #06b6d4, transparent)' }}
          />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Vitrine</h2>

          <div className="flex flex-wrap gap-4 items-start">
            {loadout.avatar && (
              <div className="text-center">
                <StoreItemPreview item={loadout.avatar} size={80} />
                <p className="text-xs font-bold text-white mt-2">{loadout.avatar.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Avatar</p>
              </div>
            )}
            {loadout.border && (
              <div className="text-center">
                <StoreItemPreview item={loadout.border} size={80} />
                <p className="text-xs font-bold text-white mt-2">{loadout.border.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Borda</p>
              </div>
            )}
            {loadout.badges.length > 0 && (
              <div className="flex-1 min-w-[200px]">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Selos equipados</p>
                <div className="flex flex-wrap gap-2">
                  {loadout.badges.map((b) => {
                    const tint = RARITY_TINT[b.rarity] ?? RARITY_TINT.common;
                    return (
                      <div
                        key={b.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-xl"
                        style={{
                          background: 'rgba(15,23,42,0.6)',
                          border: `1px solid ${tint.color}33`,
                        }}
                      >
                        <StoreItemPreview item={b} size={28} />
                        <div>
                          <p className="text-xs font-bold text-white">{b.name}</p>
                          <p className="text-[9px] uppercase tracking-widest" style={{ color: tint.color }}>
                            {tint.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Buff ativo */}
          {expBuff && (
            <div
              className="mt-5 px-3 py-2 rounded-xl flex items-center gap-3"
              style={{
                background: 'rgba(16,185,129,0.10)',
                border: '1px solid rgba(16,185,129,0.30)',
              }}
            >
              <span className="text-emerald-400 text-lg">⚡</span>
              <p className="text-xs">
                <span className="font-black text-emerald-300">Buff EXP {expBuff.multiplier}x ativo</span>
                <span className="text-slate-500 ml-2">expira em {formatBuffRemaining(expBuff.expiresAt)}</span>
              </p>
            </div>
          )}
        </section>
      )}

      {/* Inventário completo agrupado */}
      {hasInventory && (
        <section
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.55))',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Coleção</h2>
          <div className="space-y-4">
            {inventory.map((group) => (
              <div key={group.category}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                  {CATEGORY_LABELS[group.category] ?? group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const tint = RARITY_TINT[item.rarity] ?? RARITY_TINT.common;
                    return (
                      <div
                        key={item.id}
                        className="rounded-xl p-2"
                        style={{
                          background: 'rgba(15,23,42,0.6)',
                          border: `1px solid ${tint.color}22`,
                        }}
                        title={`${item.name} · ${tint.label}`}
                      >
                        <StoreItemPreview item={item} size={48} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
