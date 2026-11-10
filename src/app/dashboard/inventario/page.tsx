'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/NotificationBell';
import { UserMenu } from '@/components/UserMenu';
import { StoreItemPreview } from '@/components/store/StoreItemPreview';
import { ChevronLeft, Gem, ShoppingBag, Sparkles } from 'lucide-react';

export default function InventarioPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      <nav className="glass-card border-b border-white/5 sticky top-0 z-50 px-4 sm:px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-400 hover:text-emerald-400 transition hover-lift">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="text-lg font-black text-gradient">EDRUSH</Link>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <UserMenu onLogout={() => {}} />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Meu Inventário</h1>
          <p className="text-slate-400">Gerencie seus itens e personalizações</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="glass-card p-6 rounded-xl hover-lift">
                <StoreItemPreview item={item} />
              </div>
            ))
          ) : (
            <div className="col-span-full glass-card p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Inventário vazio</h3>
              <p className="text-slate-400 mb-6">Visite a loja para adquirir novos itens</p>
              <Link href="/dashboard/loja" className="inline-flex items-center gap-2 btn-gradient px-6 py-3 rounded-xl text-sm font-bold text-slate-950">
                <Gem className="w-4 h-4" />
                Ir à Loja
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}