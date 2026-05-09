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
    <div className={`flex overflow-x-auto gap-0 border-b border-white/10 scrollbar-hide ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-300
            border-b-2 relative flex items-center gap-2
            ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }
          `}
        >
          {tab.label}
          {tab.badge && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
