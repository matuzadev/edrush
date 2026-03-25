'use client';

import { useState } from 'react';
import { X, Search, UserPlus, Loader } from 'lucide-react';

interface AddFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFriend: (userId: string, username: string) => void;
}

// Mock de usuários disponíveis para adicionar como amigos
const MOCK_USERS = [
  { id: 'user_456def', username: 'ConcurseiroAlpha', avatar: '👨‍💼' },
  { id: 'user_789ghi', username: 'EstudanteZeta', avatar: '👩‍🎓' },
  { id: 'user_101jkl', username: 'FocusedStudent', avatar: '🧒' },
  { id: 'user_112mno', username: 'VitóriaNear', avatar: '👩' },
  { id: 'user_131pqr', username: 'CompetidorBeta', avatar: '👨' },
];

export function AddFriendsModal({ isOpen, onClose, onAddFriend }: AddFriendsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);

  const filteredUsers = MOCK_USERS.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFriend = async (userId: string, username: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setAddedFriends(prev => [...prev, userId]);
    onAddFriend(userId, username);
    
    setIsLoading(false);
    
    setTimeout(() => {
      setAddedFriends(prev => prev.filter(id => id !== userId));
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Adicionar Amigos</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Pesquise por nome ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
          </div>
        </div>

        {/* Users List */}
        <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-500 text-sm">Nenhum usuário encontrado</div>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-slate-800/50 border border-white/5 rounded-lg hover:border-white/10 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{user.username}</p>
                    <p className="text-slate-500 text-xs">{user.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddFriend(user.id, user.username)}
                  disabled={addedFriends.includes(user.id) || isLoading}
                  className={`p-2 rounded-lg transition-all ${
                    addedFriends.includes(user.id)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-emerald-500 hover:text-white disabled:opacity-50'
                  }`}
                >
                  {isLoading && addedFriends.includes(user.id) ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : addedFriends.includes(user.id) ? (
                    <span className="text-sm">✓</span>
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
