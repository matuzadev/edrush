'use client';

import { useState } from 'react';
import { Bug, ChevronUp } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { BugReportForm } from '@/components/BugReportForm';

export function BugReportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Botão Flutuante */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative flex items-center justify-center"
        >
          {/* Background com pulse */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500 group-hover:blur-xl" />
          
          {/* Botão */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg hover:shadow-emerald-500/50 hover:shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95">
            <Bug className="w-6 h-6 text-white" strokeWidth={2} />
          </div>

          {/* Label ao hover */}
          {isHovered && (
            <div className="absolute right-full mr-4 px-3 py-2 bg-slate-900 border border-white/20 rounded-lg text-xs font-medium text-white whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-200">
              Reportar Bug
              <div className="absolute left-full top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 border-t border-r border-white/20 transform rotate-45 -ml-1" />
            </div>
          )}
        </button>
      </div>

      {/* Modal com Formulário */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Reportar um Bug"
        size="md"
      >
        <BugReportForm
          onClose={() => setIsOpen(false)}
          onSubmit={(report) => {
            console.log('Bug report submitted:', report);
          }}
        />
      </Modal>
    </>
  );
}
