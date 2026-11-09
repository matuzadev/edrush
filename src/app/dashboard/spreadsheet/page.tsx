'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedNavbar } from '@/components/UnifiedNavbar';
import { Search, Zap } from 'lucide-react';

interface Question {
  id: number;
  titulo: string;
  disciplina: string;
  capitulo: string;
  dificuldade: 'fácil' | 'médio' | 'difícil';
  enunciado: string;
  fonte: string | null;
  ano: number | null;
  concurso?: { titulo: string; organizador: string } | null;
}

export default function SpreadsheetPage() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'fácil' | 'médio' | 'difícil'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'difficulty' | 'score'>('recent');

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch('/api/questions?limit=200');
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
          setFilteredQuestions(data);
        }
      } catch {
        setQuestions([]);
        setFilteredQuestions([]);
      }
    }
    if (!isLoading && user) fetchQuestions();
  }, [isLoading, user]);

  // Apply filters
  useEffect(() => {
    let filtered = questions;

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(q => q.dificuldade === difficultyFilter);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item => item.enunciado.toLowerCase().includes(q) ||
                item.disciplina.toLowerCase().includes(q) ||
                item.titulo.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'difficulty') {
      const order = { 'fácil': 0, 'médio': 1, 'difícil': 2 };
      filtered = [...filtered].sort((a, b) => order[a.dificuldade] - order[b.dificuldade]);
    }

    setFilteredQuestions(filtered);
  }, [questions, difficultyFilter, searchTerm, sortBy]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando planilha...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: questions.length,
    facil: questions.filter(q => q.dificuldade === 'fácil').length,
    medio: questions.filter(q => q.dificuldade === 'médio').length,
    dificil: questions.filter(q => q.dificuldade === 'difícil').length,
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'fácil':
        return 'text-emerald-400 bg-emerald-500/10';
      case 'médio':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'difícil':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]">
      {/* Navbar */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold text-white hover:text-emerald-400 transition">
                EdRush
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition">Dashboard</Link>
                <Link href="/dashboard/spreadsheet" className="text-emerald-400 font-semibold">Planilha</Link>
                <Link href="/dashboard/analytics" className="text-slate-400 hover:text-white transition">Análises</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Planilha de Questões</h1>
          <p className="text-slate-400">Estude com 4000+ questões organizadas por dificuldade e tópico</p>
        </div>

        {/* CTA Study Button */}
        <div className="mb-8 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Pronto para estudar?</h2>
            <p className="text-slate-400 text-sm">Inicie uma sessão com Active Recall e espaçamento inteligente</p>
          </div>
          <Link
            href="/dashboard/study"
            className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition font-semibold flex items-center gap-2 whitespace-nowrap"
          >
            <Zap className="w-4 h-4" />
            Estudar Agora
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0f172a] border border-white/5 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Total</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-[#0f172a] border border-white/5 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Fácil</p>
            <p className="text-3xl font-bold text-emerald-400">{stats.facil}</p>
          </div>
          <div className="bg-[#0f172a] border border-white/5 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Médio</p>
            <p className="text-3xl font-bold text-yellow-400">{stats.medio}</p>
          </div>
          <div className="bg-[#0f172a] border border-white/5 rounded-lg p-6">
            <p className="text-slate-400 text-sm mb-2">Difícil</p>
            <p className="text-3xl font-bold text-red-400">{stats.dificil}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#0f172a] border border-white/5 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar questão ou tópico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500/50 text-white placeholder-slate-500 transition"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500/50 text-white transition"
            >
              <option value="all">Todas as dificuldades</option>
              <option value="fácil">Fácil</option>
              <option value="médio">Médio</option>
              <option value="difícil">Difícil</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500/50 text-white transition"
            >
              <option value="recent">Mais Recentes</option>
              <option value="difficulty">Por Dificuldade</option>
              <option value="score">Melhor Pontuação</option>
            </select>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-[#0f172a] border border-white/5 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300">Disciplina</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300">Enunciado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300">Dificuldade</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300">Banca / Ano</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q) => (
                    <tr key={q.id} className="border-b border-white/5 hover:bg-slate-900/30 transition">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{q.disciplina}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{q.capitulo}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300 max-w-sm">
                        <span className="line-clamp-2">{q.enunciado}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(q.dificuldade)}`}>
                          {q.dificuldade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {q.fonte && <div>{q.fonte}</div>}
                        {q.ano && <div>{q.ano}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <Link href="/dashboard/study" className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded text-sm transition">
                          Praticar
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="text-slate-400">Nenhuma questão encontrada</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
