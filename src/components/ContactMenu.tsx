'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Video } from 'lucide-react';

export default function ContactMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <div className={`flex-col gap-3 mb-4 ${isOpen ? 'flex' : 'hidden'} animate-bounce-subtle`}>
        <a href="https://t.me/mtztech1" target="_blank" className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 p-3 rounded-2xl hover:bg-cyan-500/20 transition-all group">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest hidden group-hover:block">QG do Telegram</span>
          <Send className="w-5 h-5 text-cyan-400" />
        </a>
        <a href="https://www.tiktok.com/@mtztech.shop?_r=1&_t=ZS-9347fqYMXiq" target="_blank" className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-pink-500/30 p-3 rounded-2xl hover:bg-pink-500/20 transition-all group">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest hidden group-hover:block">Dicas diárias</span>
          <Video className="w-5 h-5 text-pink-500" />
        </a>
      </div>

      <button onClick={toggleMenu} className="bg-cyan-500 text-slate-950 p-4 rounded-full shadow-lg shadow-cyan-500/20 hover:scale-110 transition-transform active:scale-95">
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>
    </div>
  );
}