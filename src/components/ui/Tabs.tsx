import { ReactNode } from 'react';

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export interface Tab {
  id: string;
  label: string;
  badge?: number | string;
}

export function Tabs({ tabs, activeTab, onTabChange, className = '' }: TabsProps) {
  return (
    <div className={`flex overflow-x-auto gap-0 border-b border-[var(--border)] scrollbar-hide ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-3 text-sm font-medium whitespace-nowrap transition-all [transition-duration:var(--transition-base)]
            border-b-2 relative flex items-center gap-2 focus-modern
            ${
              activeTab === tab.id
                ? 'border-[var(--emerald-500)] text-[var(--emerald-400)]'
                : 'border-transparent text-slate-400 hover:text-[var(--fg)] hover:border-[var(--border-hover)]'
            }
          `}
        >
          {tab.label}
          {tab.badge && (
            <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 text-[10px] font-black rounded-full badge-neon emerald">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
