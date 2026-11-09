'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserCheck, UserX, Loader } from 'lucide-react';
import { getAvatar } from '@/data/avatars';

interface FriendEntry {
  friendshipId: number;
  userId: string;
  nome: string | null;
  username: string | null;
  avatar_id: number;
  since: string;
}

interface FriendRequestsProps {
  onViewProfile?: (username: string) => void;
}

export function FriendRequests({ onViewProfile }: FriendRequestsProps = {}) {
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [pendingReceived, setPendingReceived] = useState<FriendEntry[]>([]);
  const [pendingSent, setPendingSent] = useState<FriendEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchFriends = useCallback(async () => {
    try {
      const res = await fetch('/api/friends');
      if (!res.ok) return;
      const data = await res.json();
      setFriends(data.friends ?? []);
      setPendingReceived(data.pendingReceived ?? []);
      setPendingSent(data.pendingSent ?? []);
    } catch {
      // ignorar
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleAction = async (friendshipId: number, action: 'accept' | 'reject') => {
    setProcessingId(friendshipId);
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        // Remover da lista de pendentes
        const entry = pendingReceived.find(p => p.friendshipId === friendshipId);
        setPendingReceived(prev => prev.filter(p => p.friendshipId !== friendshipId));

        if (action === 'accept' && entry) {
          setFriends(prev => [...prev, { ...entry }]);
        }
      }
    } catch {
      // ignorar
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemoveFriend = async (friendshipId: number) => {
    setProcessingId(friendshipId);
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, { method: 'DELETE' });
      if (res.ok) {
        setFriends(prev => prev.filter(f => f.friendshipId !== friendshipId));
        setPendingSent(prev => prev.filter(p => p.friendshipId !== friendshipId));
      }
    } catch {
      // ignorar
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-5 h-5 animate-spin text-emerald-500" />
      </div>
    );
  }

  const totalCount = friends.length + pendingReceived.length + pendingSent.length;

  if (totalCount === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        Nenhum amigo ainda. Use o botão acima para encontrar concurseiros!
      </div>
    );
  }

  function UserCard({ entry, actions, clickable }: { entry: FriendEntry; actions?: React.ReactNode; clickable?: boolean }) {
    const avatar = getAvatar(entry.avatar_id);
    const displayName = entry.username ?? entry.nome ?? 'Concurseiro';
    const profileId = entry.username ?? entry.nome;
    const canClick = clickable && onViewProfile && !!profileId;

    return (
      <div
        onClick={canClick ? () => onViewProfile!(profileId!) : undefined}
        className={`flex items-center justify-between p-3 bg-slate-800/50 border border-white/5 rounded-lg ${
          canClick ? 'cursor-pointer hover:bg-slate-800/80 hover:border-emerald-500/30 transition' : ''
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${avatar.colors.primary}33, ${avatar.colors.accent}11)`,
              border: `1.5px solid ${avatar.colors.primary}55`,
            }}
            dangerouslySetInnerHTML={{ __html: avatar.svg }}
          />
          <div className="min-w-0">
            <p className="text-white font-medium text-sm truncate">{displayName}</p>
            {canClick && (
              <p className="text-[10px] text-slate-500">Toque para ver perfil</p>
            )}
          </div>
        </div>
        {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Solicitações recebidas */}
      {pendingReceived.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Solicitações recebidas ({pendingReceived.length})
          </h4>
          <div className="space-y-2">
            {pendingReceived.map(entry => (
              <UserCard
                key={entry.friendshipId}
                entry={entry}
                actions={
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(entry.friendshipId, 'accept')}
                      disabled={processingId === entry.friendshipId}
                      className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition disabled:opacity-50"
                      title="Aceitar"
                    >
                      {processingId === entry.friendshipId ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleAction(entry.friendshipId, 'reject')}
                      disabled={processingId === entry.friendshipId}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                      title="Recusar"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Amigos aceitos */}
      {friends.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Amigos ({friends.length})
          </h4>
          <div className="space-y-2">
            {friends.map(entry => (
              <UserCard
                key={entry.friendshipId}
                entry={entry}
                clickable
                actions={
                  <button
                    onClick={() => handleRemoveFriend(entry.friendshipId)}
                    disabled={processingId === entry.friendshipId}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                    title="Remover amigo"
                  >
                    {processingId === entry.friendshipId ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserX className="w-4 h-4" />
                    )}
                  </button>
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Solicitações enviadas */}
      {pendingSent.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Solicitações enviadas ({pendingSent.length})
          </h4>
          <div className="space-y-2">
            {pendingSent.map(entry => (
              <UserCard
                key={entry.friendshipId}
                entry={entry}
                actions={
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 italic">Aguardando</span>
                    <button
                      onClick={() => handleRemoveFriend(entry.friendshipId)}
                      disabled={processingId === entry.friendshipId}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 transition disabled:opacity-50"
                      title="Cancelar"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
