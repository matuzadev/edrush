'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, ChevronLeft, Send, Loader2, Trophy, User as UserIcon, UserCheck, UserX, Users } from 'lucide-react';
import { getAvatar } from '@/data/avatars';
import { FriendProfileModal } from './FriendProfileModal';

interface Thread {
  friendId: string;
  nome: string | null;
  username: string | null;
  avatar_id: number;
  level: number;
  unreadCount: number;
  isOnline: boolean;
  lastMessage: {
    id: number;
    content: string;
    type: string;
    mine: boolean;
    createdAt: string;
  } | null;
}

interface FriendRequest {
  friendshipId: number;
  userId: string;
  nome: string | null;
  username: string | null;
  avatar_id: number;
}

interface ChatMessage {
  id: number;
  senderId: string;
  receiverId: string;
  type: string;
  content: string;
  payload: { accuracy?: number; total?: number; correct?: number; subject?: string } | null;
  read: boolean;
  createdAt: string;
  mine: boolean;
}

const POLL_OPEN_MS = 3000;
const POLL_CLOSED_MS = 30000;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function FriendsChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [pendingReceived, setPendingReceived] = useState<FriendRequest[]>([]);
  const [pendingSent, setPendingSent] = useState<FriendRequest[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<number>(0);

  // Esconder em /dashboard/simulado e em rotas não-dashboard (auth, landing, onboarding)
  const shouldHide =
    !pathname ||
    pathname.includes('/dashboard/simulado') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/onboarding') ||
    pathname === '/' ||
    pathname.startsWith('/perfil');

  const fetchThreads = useCallback(async () => {
    try {
      const res = await fetch('/api/messages/threads');
      if (!res.ok) return;
      const data = await res.json();
      setThreads(data.threads ?? []);
      setPendingReceived(data.pendingReceived ?? []);
      setPendingSent(data.pendingSent ?? []);
      setTotalUnread(data.totalUnread ?? 0);
    } catch {
      /* silencioso */
    }
  }, []);

  const fetchMessages = useCallback(async (friendId: string, markAsRead = true) => {
    try {
      const res = await fetch(`/api/messages?with=${encodeURIComponent(friendId)}&limit=80`);
      if (!res.ok) return;
      const data = await res.json();
      const msgs: ChatMessage[] = data.messages ?? [];
      setMessages(msgs);
      if (msgs.length > 0) lastMessageIdRef.current = msgs[msgs.length - 1].id;

      if (markAsRead) {
        // Marca como lidas (fire-and-forget)
        fetch('/api/messages/read', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fromUserId: friendId }),
        }).then(() => fetchThreads()).catch(() => {});
      }
    } catch {
      /* silencioso */
    }
  }, [fetchThreads]);

  // Polling de threads (varia conforme aberto/fechado)
  useEffect(() => {
    if (shouldHide) return;
    fetchThreads();
    const interval = setInterval(fetchThreads, open ? POLL_OPEN_MS : POLL_CLOSED_MS);
    return () => clearInterval(interval);
  }, [open, shouldHide, fetchThreads]);

  // Polling da conversa ativa (só quando aberta)
  useEffect(() => {
    if (!open || !activeThread) return;
    const interval = setInterval(() => fetchMessages(activeThread.friendId, true), POLL_OPEN_MS);
    return () => clearInterval(interval);
  }, [open, activeThread, fetchMessages]);

  // Auto-scroll
  useEffect(() => {
    if (activeThread && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeThread]);

  // ESC fecha
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeThread) setActiveThread(null);
        else setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, activeThread]);

  if (shouldHide) return null;

  const openThread = async (t: Thread) => {
    setActiveThread(t);
    setMessages([]);
    setIsLoadingMessages(true);
    await fetchMessages(t.friendId, true);
    setIsLoadingMessages(false);
  };

  const handleFriendRequest = async (friendshipId: number, action: 'accept' | 'reject') => {
    setProcessingRequestId(friendshipId);
    try {
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        console.error('Falha ao processar solicitação de amizade:', res.status);
        return;
      }
      await fetchThreads();
    } catch (error) {
      console.error('Falha ao processar solicitação de amizade:', error);
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeThread || isSending) return;
    const content = input.trim();
    setInput('');
    setIsSending(true);

    // Optimistic
    const tempId = -Date.now();
    const optimistic: ChatMessage = {
      id: tempId,
      senderId: 'me',
      receiverId: activeThread.friendId,
      type: 'text',
      content,
      payload: null,
      read: false,
      createdAt: new Date().toISOString(),
      mine: true,
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: activeThread.friendId, content }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => prev.map(m => m.id === tempId ? data.message : m));
        fetchThreads();
      } else {
        setMessages(prev => prev.filter(m => m.id !== tempId));
        setInput(content);
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setInput(content);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Botão flutuante (acima do BugReport) */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-24 right-6 z-40 group"
        aria-label="Abrir chat de amigos"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-30 blur-lg transition-all" />
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg hover:shadow-cyan-500/50 hover:shadow-2xl transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95">
          <MessageCircle className="w-6 h-6 text-white" />
          {totalUnread > 0 && !open && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-950">
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </div>
      </button>

      {/* Drawer */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-9rem)] flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.97), rgba(15,23,42,0.92))',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 20px 60px -12px rgba(0,0,0,0.7)',
            animation: 'chatEnter 0.18s ease-out',
          }}
        >
          <style>{`
            @keyframes chatEnter {
              from { opacity: 0; transform: translateY(12px) scale(0.98); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* Linha gradient no topo */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, #3b82f6, transparent)' }}
          />

          {/* Header */}
          <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-white/8">
            {activeThread ? (
              <>
                <button
                  onClick={() => setActiveThread(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <ThreadAvatar avatarId={activeThread.avatar_id} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate leading-tight">
                    {activeThread.username ?? activeThread.nome ?? 'Concurseiro'}
                  </p>
                  <p className="text-[10px] text-slate-500">Nv. {activeThread.level}</p>
                </div>
                <button
                  onClick={() => setViewingProfile(activeThread.username ?? activeThread.nome ?? null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                  title="Ver perfil"
                >
                  <UserIcon className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="flex-1 font-black text-white">Mensagens</h3>
                {totalUnread > 0 && (
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                    {totalUnread} novas
                  </span>
                )}
                {pendingReceived.length > 0 && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    {pendingReceived.length} pedidos
                  </span>
                )}
              </>
            )}
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conteúdo */}
          {!activeThread ? (
            <div className="flex-1 overflow-y-auto p-2">
              {threads.length === 0 && pendingReceived.length === 0 && pendingSent.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
                  <MessageCircle className="w-10 h-10 text-slate-700 mb-3" />
                  <p className="text-slate-400 text-sm font-semibold">Nenhuma conversa ainda</p>
                  <p className="text-slate-600 text-xs mt-1">Adicione amigos no seu perfil para começar a conversar.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingReceived.length > 0 && (
                    <section>
                      <h4 className="px-2 pt-2 pb-1 text-[10px] font-black uppercase tracking-widest text-cyan-300">
                        Solicitações recebidas ({pendingReceived.length})
                      </h4>
                      {pendingReceived.map((request) => (
                        <div key={request.friendshipId} className="flex items-center gap-2 rounded-xl p-2.5 hover:bg-white/5">
                          <ThreadAvatar avatarId={request.avatar_id} size={36} />
                          <p className="flex-1 min-w-0 truncate text-sm font-semibold text-slate-200">
                            {request.username ?? request.nome ?? 'Concurseiro'}
                          </p>
                          <button
                            onClick={() => handleFriendRequest(request.friendshipId, 'accept')}
                            disabled={processingRequestId === request.friendshipId}
                            aria-label="Aceitar solicitação"
                            title="Aceitar"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500 hover:text-white disabled:opacity-50"
                          >
                            {processingRequestId === request.friendshipId
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <UserCheck className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleFriendRequest(request.friendshipId, 'reject')}
                            disabled={processingRequestId === request.friendshipId}
                            aria-label="Recusar solicitação"
                            title="Recusar"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white disabled:opacity-50"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </section>
                  )}

                  {pendingSent.length > 0 && (
                    <section>
                      <h4 className="px-2 pt-2 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Solicitações enviadas ({pendingSent.length})
                      </h4>
                      {pendingSent.map((request) => (
                        <div key={request.friendshipId} className="flex items-center gap-2 rounded-xl p-2.5">
                          <ThreadAvatar avatarId={request.avatar_id} size={34} />
                          <p className="flex-1 min-w-0 truncate text-sm text-slate-300">
                            {request.username ?? request.nome ?? 'Concurseiro'}
                          </p>
                          <span className="text-[10px] text-slate-500">Aguardando</span>
                        </div>
                      ))}
                    </section>
                  )}

                  {threads.some((thread) => thread.isOnline) && (
                    <section>
                      <h4 className="flex items-center gap-1.5 px-2 pt-2 pb-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Online ({threads.filter((thread) => thread.isOnline).length})
                      </h4>
                      {threads.filter((thread) => thread.isOnline).map((t) => (
                        <ThreadRow key={t.friendId} thread={t} onOpen={openThread} />
                      ))}
                    </section>
                  )}

                  {threads.some((thread) => !thread.isOnline) && (
                    <section>
                      <h4 className="flex items-center gap-1.5 px-2 pt-2 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Offline ({threads.filter((thread) => !thread.isOnline).length})
                      </h4>
                      {threads.filter((thread) => !thread.isOnline).map((t) => (
                        <ThreadRow key={t.friendId} thread={t} onOpen={openThread} />
                      ))}
                    </section>
                  )}
                  {threads.length === 0 && pendingReceived.length === 0 && pendingSent.length > 0 && (
                    <div className="py-6 text-center text-xs text-slate-500">
                      <Users className="mx-auto mb-2 h-5 w-5" />
                      Seus amigos aparecerão aqui quando aceitarem sua solicitação.
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Lista de mensagens */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {isLoadingMessages && messages.length === 0 ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-sm">
                    Comece a conversa!
                  </div>
                ) : (
                  messages.map((m, i) => {
                    const showTime = i === 0 || (new Date(m.createdAt).getTime() - new Date(messages[i - 1].createdAt).getTime() > 5 * 60 * 1000);
                    return (
                      <div key={m.id}>
                        {showTime && (
                          <div className="text-center text-[10px] text-slate-600 my-2">
                            {timeAgo(m.createdAt)}
                          </div>
                        )}
                        <div className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                          {m.type === 'result' && m.payload ? (
                            <ResultBubble msg={m} />
                          ) : (
                            <div
                              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug break-words whitespace-pre-wrap ${
                                m.mine
                                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-sm'
                                  : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                              }`}
                            >
                              {m.content}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="shrink-0 flex items-end gap-2 p-3 border-t border-white/8">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Mensagem…"
                  rows={1}
                  maxLength={2000}
                  className="flex-1 resize-none px-3 py-2 rounded-xl bg-slate-800/60 border border-white/8 text-white text-sm placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/15 max-h-24"
                  style={{ minHeight: '38px' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isSending}
                  className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center hover:from-cyan-400 hover:to-blue-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal de perfil do amigo (acionado pelo header) */}
      <FriendProfileModal
        username={viewingProfile}
        onClose={() => setViewingProfile(null)}
      />
    </>
  );
}

function ThreadAvatar({ avatarId, size }: { avatarId: number; size: number }) {
  const avatar = getAvatar(avatarId);
  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${avatar.colors.primary}33, ${avatar.colors.accent}11)`,
        border: `1.5px solid ${avatar.colors.primary}55`,
      }}
      dangerouslySetInnerHTML={{ __html: avatar.svg }}
    />
  );
}

function ThreadRow({ thread, onOpen }: { thread: Thread; onOpen: (thread: Thread) => void }) {
  return (
    <button
      onClick={() => onOpen(thread)}
      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition text-left"
    >
      <div className="relative shrink-0">
        <ThreadAvatar avatarId={thread.avatar_id} size={40} />
        {thread.isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
        )}
        {thread.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-cyan-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-900">
            {thread.unreadCount > 9 ? '9+' : thread.unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className={`text-sm truncate ${thread.unreadCount > 0 ? 'font-black text-white' : 'font-semibold text-slate-200'}`}>
            {thread.username ?? thread.nome ?? 'Concurseiro'}
          </p>
          {thread.lastMessage && (
            <span className="text-[10px] text-slate-500 shrink-0">
              {timeAgo(thread.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <p className={`text-xs truncate ${thread.unreadCount > 0 ? 'text-slate-300' : 'text-slate-500'}`}>
          {thread.lastMessage
            ? `${thread.lastMessage.mine ? 'Você: ' : ''}${
                thread.lastMessage.type === 'result' ? '📊 Compartilhou um resultado' : thread.lastMessage.content
              }`
            : <span className="italic text-slate-600">Iniciar conversa</span>}
        </p>
      </div>
    </button>
  );
}

function ResultBubble({ msg }: { msg: ChatMessage }) {
  const p = msg.payload as { accuracy?: number; total?: number; correct?: number; subject?: string } | null;
  if (!p) return null;
  const accuracy = p.accuracy ?? 0;
  const accColor = accuracy >= 70 ? '#10b981' : accuracy >= 50 ? '#eab308' : '#ef4444';

  return (
    <div
      className={`max-w-[85%] rounded-2xl overflow-hidden border ${msg.mine ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
      style={{
        background: msg.mine
          ? 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(59,130,246,0.10))'
          : 'rgba(30,41,59,0.7)',
        borderColor: msg.mine ? 'rgba(6,182,212,0.30)' : 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="px-3 py-2 border-b" style={{ borderColor: msg.mine ? 'rgba(6,182,212,0.20)' : 'rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5" style={{ color: accColor }} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
            Resultado de sessão
          </span>
        </div>
        {p.subject && (
          <p className="text-[11px] text-slate-400 mt-0.5 capitalize truncate">
            {p.subject.replace(/-/g, ' ')}
          </p>
        )}
      </div>
      <div className="px-3 py-2.5 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Acerto</p>
          <p className="text-base font-black tabular-nums" style={{ color: accColor }}>{accuracy}%</p>
        </div>
        <div>
          <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Corretas</p>
          <p className="text-base font-black tabular-nums text-emerald-400">{p.correct ?? 0}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Total</p>
          <p className="text-base font-black tabular-nums text-white">{p.total ?? 0}</p>
        </div>
      </div>
      {msg.content && (
        <p className="px-3 pb-2.5 text-xs text-slate-300 leading-snug">{msg.content}</p>
      )}
    </div>
  );
}
