'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Check, UserPlus, UserCheck, Trophy, Megaphone, X } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  read: number;
  related_id: string | null;
  criado_em: string;
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

function NotifIcon({ type }: { type: string }) {
  switch (type) {
    case 'friend_request':
      return <UserPlus className="w-4 h-4 text-cyan-400 flex-shrink-0" />;
    case 'friend_accepted':
      return <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
    case 'achievement':
      return <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />;
    default:
      return <Megaphone className="w-4 h-4 text-violet-400 flex-shrink-0" />;
  }
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // ignorar erros de rede silenciosamente
    }
  }, []);

  // Carregar na montagem e polling a cada 30s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  const markAllRead = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/notifications/read', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      setNotifications(prev => prev.map(n => ({ ...n, read: 1 })));
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const markOneRead = async (id: number) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: 1 } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // ignorar
    }
  };

  const handleFriendRequestAction = async (notificationId: number, friendshipId: string | null, action: 'accept' | 'reject') => {
    if (!friendshipId) return;
    setActionLoadingId(notificationId);

    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        return;
      }

      const title = action === 'accept' ? 'Solicitação Aceita' : 'Solicitação Rejeitada';
      const bodyText = action === 'accept'
        ? 'Você aceitou a solicitação de amizade.'
        : 'Você rejeitou a solicitação de amizade.';

      setNotifications(prev => prev.map(n => n.id === notificationId ? {
        ...n,
        read: 1,
        title,
        body: bodyText,
        type: action === 'accept' ? 'friend_accepted' : 'admin_message',
      } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
        aria-label="Notificações"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <span className="text-white font-semibold text-sm">Notificações</span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  disabled={isLoading}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Marcar tudo
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-sm">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition cursor-default ${
                    notif.read === 0 ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  <div className="mt-0.5">
                    <NotifIcon type={notif.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${notif.read === 0 ? 'text-white' : 'text-slate-300'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.body}</p>
                    <p className="text-xs text-slate-600 mt-1">{timeAgo(notif.criado_em)}</p>

                    {notif.type === 'friend_request' && notif.related_id && notif.read === 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleFriendRequestAction(notif.id, notif.related_id, 'accept')}
                          disabled={actionLoadingId === notif.id}
                          className="rounded-full bg-emerald-500 text-white text-xs px-3 py-2 hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoadingId === notif.id ? 'Aguarde...' : 'Aceitar'}
                        </button>
                        <button
                          onClick={() => handleFriendRequestAction(notif.id, notif.related_id, 'reject')}
                          disabled={actionLoadingId === notif.id}
                          className="rounded-full bg-slate-700 text-slate-200 text-xs px-3 py-2 hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoadingId === notif.id ? 'Aguarde...' : 'Rejeitar'}
                        </button>
                      </div>
                    )}
                  </div>
                  {notif.read === 0 && (
                    <button
                      onClick={() => markOneRead(notif.id)}
                      className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-emerald-500 hover:bg-emerald-400 transition"
                      title="Marcar como lida"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
