'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, UserPlus, Loader, Check, Clock } from 'lucide-react';

interface SearchUser {
  id: string;
  nome: string | null;
  username: string | null;
  avatar_id: number;
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
  const [results, setResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const [searchError, setSearchError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Erro na busca');
      const data = await res.json();
      setResults(data.users ?? []);
    } catch {
      setSearchError('Erro ao buscar usuários. Tente novamente.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(searchTerm), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm, doSearch]);

  // Resetar ao fechar
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
      setSearchError(null);
      setSentTo(new Set());
    }
  }, [isOpen]);

  const handleSendRequest = async (userId: string) => {
    setSendingTo(userId);
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: userId }),
      });

      if (res.ok || res.status === 409) {
        setSentTo(prev => new Set(prev).add(userId));
        // Atualizar o status no resultado localmente
        setResults(prev =>
          prev.map(u =>
            u.id === userId
              ? { ...u, relationship: { id: 0, status: 'pending', iAmRequester: true } }
              : u
          )
        );
      }
    } catch {
      // ignorar
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
          <h2 className="text-xl font-bold text-white">Adicionar Amigos</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-white/5">
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
        </div>

        {/* Users List */}
        <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
          {searchTerm.length < 2 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Busque por nome ou username de outros concurseiros
            </div>
          ) : results.length === 0 && !isSearching ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Nenhum usuário encontrado para "{searchTerm}"
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
