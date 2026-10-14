'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<{ isPremium: boolean; answeredToday: number; dailyLimit: number | null } | null>(null);

  useEffect(() => {
    fetch('/api/user/subscription')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setPlan(data))
      .catch(() => {});
  }, []);

  return (
    <div className="relative">
      {plan && (
        <div className="flex min-h-10 items-center justify-center gap-2 border-b border-white/5 bg-slate-950 px-4 text-xs text-slate-300">
          {plan.isPremium ? (
            <span className="font-semibold text-emerald-400">EdRush Premium ativo</span>
          ) : (
            <>
              <span>Plano grátis: {plan.answeredToday}/{plan.dailyLimit} questões respondidas hoje.</span>
              <Link href="/assinar" className="font-bold text-emerald-400 underline underline-offset-2">
                Conheça o Premium
              </Link>
            </>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
