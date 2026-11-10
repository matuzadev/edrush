'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/NotificationBell';
import { Search, LogOut, Zap } from 'lucide-react';
import { UnifiedNavbar } from '@/components/UnifiedNavbar';

export default function SpreadsheetPage() {
 const router = useRouter();
 const { user, signOut } = useAuth();
 interface Question {
 id: string;
 titulo: string;
 disciplina: string;
 capitulo: string;
 }
 const [questions, setQuestions] = useState<Question[]>([]);
 const [searchTerm, setSearchTerm] = useState('');

 useEffect(() => {
 if (!user) router.push('/auth/login');
 }, [user, router]);

 if (!user) return null;

 return (
 <div className="min-h-screen bg-[#020617]">
 <UnifiedNavbar />
 <main className="max-w-7xl mx-auto px-4 py-8">
 <div className="flex items-center justify-between mb-8">
 <h1 className="text-3xl font-bold text-gradient">Planilha de Estudos</h1>
 <div className="flex items-center gap-4">
 <NotificationBell />
 <button onClick={() => signOut()} className="p-2 text-slate-400 hover:text-white transition-colors"><LogOut className="w-5 h-5" /></button>
 </div>
 </div>
 <div className="glass-card p-6 rounded-xl mb-6">
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
 <input type="text" placeholder="Buscar questões..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 input-modern rounded-lg text-white placeholder-slate-500 outline-none" />
 </div>
 </div>
 <div className="grid gap-4">
 {questions.filter(q => q.titulo.toLowerCase().includes(searchTerm.toLowerCase())).map((q) => (
 <div key={q.id} className="glass-card p-6 rounded-xl hover-lift">
 <h3 className="text-lg font-bold text-white mb-2">{q.titulo}</h3>
 <div className="flex items-center gap-4 text-sm text-slate-400"><span>{q.disciplina}</span><span>•</span><span>{q.capitulo}</span></div>
 </div>
 ))}
 </div>
 </main>
 </div>
 );
}