'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, UserPlus, Loader, Clock, Users, Sparkles, Circle } from 'lucide-react';

interface SearchUser {
  id: string;
  nome: string | null;
  username: string | null;
  avatar_id: number;
  isOnline?: boolean;
  isNew?: boolean;
  relationship: {
    id: number;
    status: string;
    iAmRequester: boolean;
  } | null;
}

interface AddFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getAvatarLabel(avatarId: number): string {
  const avatars: Record<number, string> = {
    1: '🧑', 2: '👩', 3: '👨‍💼', 4: '👩‍🎓', 5: '🧒',
    6: '👴', 7: '👩‍🏫', 8: '🦸', 9: '🧙', 10: '🥷',
  };
  return avatars[avatarId] ?? '🧑';
}

export function AddFriendsModal({ isOpen, onClose }: AddFriendsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'online' | 'new' | 'search'>('online');
  const [results, setResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const loadUsers = useCallback(async (tab: 'online' | 'new' | 'search', q: string) => {
    const requestId = ++requestIdRef.current;
    if (tab === 'search' && q.trim().length < 2) {
      setResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      const url = tab === 'search'
        ? `/api/users/search?q=${encodeURIComponent(q)}`
        : `/api/users/discover?mode=${tab}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Erro na busca');
      const data = await res.json();
      if (requestId === requestIdRef.current) setResults(data.users ?? []);
    } catch {
      if (requestId === requestIdRef.current) {
        setSearchError('Não foi possível carregar estudantes. Tente novamente.');
        setResults([]);
      }
    } finally {
      if (requestId === requestIdRef.current) setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!isOpen) return;
    debounceRef.current = setTimeout(() => loadUsers(activeTab, searchTerm), activeTab === 'search' ? 350 : 0);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm, activeTab, isOpen, loadUsers]);

  const handleSendRequest = async (userId: string) => {
    setSendingTo(userId);
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: userId }),
      });

      if (res.ok) {
        // Atualizar o status no resultado localmente
        setResults(prev =>
          prev.map(u =>
            u.id === userId
              ? { ...u, relationship: { id: 0, status: 'pending', iAmRequester: true } }
              : u
          )
        );
      } else {
        const data = await res.json().catch(() => null);
        setSearchError(data?.error ?? 'Não foi possível enviar a solicitação.');
      }
    } catch {
      setSearchError('Não foi possível enviar a solicitação. Verifique sua conexão.');
    } finally {
      setSendingTo(null);
    }
  };

  function renderButton(user: SearchUser) {
    const rel = user.relationship;
    const isSending = sendingTo === user.id;

    if (isSending) {
      return (
        <button disabled className="p-2 rounded-lg bg-slate-700 text-slate-400">
          <Loader className="w-4 h-4 animate-spin" />
        </button>
      );
    }

    if (rel?.status === 'accepted') {
      return (
        <span className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          Amigos
        </span>
      );
    }

    if (rel?.status === 'pending' && rel.iAmRequester) {
      return (
        <span className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-800 border border-white/10 rounded-lg flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Pendente
        </span>
      );
    }

    if (rel?.status === 'pending' && !rel.iAmRequester) {
      return (
        <span className="px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          Te enviou pedido
        </span>
      );
    }

    return (
      <button
        onClick={() => handleSendRequest(user.id)}
        className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-emerald-500 hover:text-white transition-all"
        title="Enviar solicitação"
      >
        <UserPlus className="w-4 h-4" />
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white">Encontrar amigos</h2>
            <p className="text-xs text-slate-400 mt-1">Conheça outros concurseiros da plataforma</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 p-2 mx-6 mt-4 rounded-xl bg-slate-800/80">
          <button
            onClick={() => setActiveTab('online')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${activeTab === 'online' ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-400 hover:text-white'}`}
          >
            <Circle className="h-2.5 w-2.5 fill-current" /> Online
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${activeTab === 'new' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
          >
            <Sparkles className="h-3.5 w-3.5" /> Novatos
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${activeTab === 'search' ? 'bg-violet-500/15 text-violet-300' : 'text-slate-400 hover:text-white'}`}
          >
            <Search className="h-3.5 w-3.5" /> Buscar
          </button>
        </div>

        {/* Search Input */}
        {activeTab === 'search' && <div className="p-6 pb-3 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            {isSearching && (
              <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 animate-spin" />
            )}
            <input
              type="text"
              placeholder="Pesquise por nome ou username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
          </div>
          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <p className="text-slate-500 text-xs mt-2">Digite pelo menos 2 caracteres para buscar</p>
          )}
          {searchError && (
            <p className="text-red-400 text-xs mt-2">{searchError}</p>
          )}
        </div>}

        {/* Users List */}
        <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center gap-2 py-8 text-slate-400 text-sm">
              <Loader className="h-4 w-4 animate-spin" /> Procurando estudantes...
            </div>
          ) : searchError ? (
            <div className="text-center py-8 text-red-400 text-sm">{searchError}</div>
          ) : results.length === 0 && activeTab === 'search' && searchTerm.trim().length < 2 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <Users className="mx-auto mb-2 h-6 w-6 opacity-60" />
              Busque por nome ou username de outros concurseiros
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              {activeTab === 'online'
                ? 'Ninguém online neste momento. Que tal conhecer quem chegou recentemente?'
                : activeTab === 'new'
                  ? 'Ainda não há novos estudantes para mostrar. Tente novamente mais tarde.'
                  : `Nenhum usuário encontrado para "${searchTerm}"`}
            </div>
          ) : (
            results.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-slate-800/50 border border-white/5 rounded-lg hover:border-white/10 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white text-lg">
                    {getAvatarLabel(user.avatar_id)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {user.username ?? user.nome ?? 'Concurseiro'}
                    </p>
                    {user.username && user.nome && user.username !== user.nome && (
                      <p className="text-slate-500 text-xs">{user.nome}</p>
                    )}
                    {(user.isOnline || user.isNew) && (
                      <p className={`mt-0.5 flex items-center gap-1 text-[10px] ${user.isOnline ? 'text-emerald-400' : 'text-cyan-300'}`}>
                        {user.isOnline
                          ? <><Circle className="h-1.5 w-1.5 fill-current" /> Online agora</>
                          : '✨ Chegou recentemente'}
                      </p>
                    )}
                  </div>
                </div>
                {renderButton(user)}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
