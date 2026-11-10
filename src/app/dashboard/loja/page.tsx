'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedNavbar } from '@/components/UnifiedNavbar';
import { StoreItemPreview } from '@/components/store/StoreItemPreview';
import { NotificationBell } from '@/components/NotificationBell';
import { UserMenu } from '@/components/UserMenu';
import { ChevronLeft, Gem, Loader2 } from 'lucide-react';

export default function LojaPage() {
 const router = useRouter();
 const { user, isLoading } = useAuth();
 const [items, setItems] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 if (!isLoading && !user) {
 router.push('/auth/login');
 } else if (user) {
 fetch('/api/store/items').then(res => res.json()).then(data => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
 }
 }, [user, isLoading, router]);

 if (isLoading || loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="w-12 h-12 text-emerald-500 animate-spin" /></div>;
 if (!user) return null;

 return (
 <div className="min-h-screen bg-[#020617]">
 <UnifiedNavbar />
 <main className="max-w-7xl mx-auto px-4 py-8">
 <div className="mb-8">
 <h1 className="text-3xl font-bold text-gradient mb-2">Loja de Cristais</h1>
 <p className="text-slate-400">Adquira itens exclusivos para seu perfil</p>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
 {items.map((item) => (
 <div key={item.id} className="glass-card p-4 rounded-xl hover-lift"><StoreItemPreview item={item} /></div>
 ))}
 </div>
 </main>
 </div>
 );
}