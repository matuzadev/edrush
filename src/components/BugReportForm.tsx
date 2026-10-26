'use client';

import { useState, useRef } from 'react';
import { X, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BugReport, SEVERITY_COLORS, captureUserEnvironment, generateBugReportId } from '@/lib/bug-report';

interface BugReportFormProps {
  onClose: () => void;
}

export function BugReportForm({ onClose }: BugReportFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'baixa' | 'média' | 'alta' | 'crítica'>('média');
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshot(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Título e descrição são obrigatórios');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const env = captureUserEnvironment();
      
      const report: BugReport = {
        id: generateBugReportId(),
        title: title.trim(),
        description: description.trim(),
        severity,
        email: email.trim() || undefined,
        page: env.url,
        userAgent: env.userAgent,
        timestamp: env.timestamp,
        screenshot: screenshot || undefined,
      };

      // Enviar para API
      const response = await fetch('/api/bugs/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar relatório');
      }

      setSubmitted(true);
      
      // Fechar após 3 segundos
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError('Erro ao enviar relatório. Tente novamente.');
      console.error('Bug report error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Relatório Enviado!</h3>
        <p className="text-sm text-slate-400 text-center">
          Obrigado por ajudar a melhorar o EdRush. Fecharemos em breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Título */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          Título do Bug
        </label>
        <Input
          type="text"
          placeholder="Descreva brevemente o problema"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500"
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          Descrição Detalhada
        </label>
        <textarea
          placeholder="Explique o que está acontecendo, passo a passo para reproduzir o problema..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          rows={4}
          className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-white placeholder:text-slate-500 resize-none focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      {/* Severidade */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          Nível de Severidade
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(['baixa', 'média', 'alta', 'crítica'] as const).map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverity(sev)}
              disabled={isLoading}
              className={`
                py-2 px-2 rounded-lg text-xs font-medium capitalize transition-all
                border-2 cursor-pointer
                ${
                  severity === sev
                    ? `${SEVERITY_COLORS[sev]} border-current`
                    : 'border-white/10 text-slate-400 hover:border-white/20'
                }
              `}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* E-mail (opcional) */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          Seu E-mail <span className="text-slate-500">(opcional)</span>
        </label>
        <Input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="bg-slate-900 border-white/10 text-white placeholder:text-slate-500"
        />
      </div>

      {/* Screenshot */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          Print da Tela <span className="text-slate-500">(opcional)</span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-slate-900 border border-white/10 hover:border-white/20 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors disabled:opacity-50"
          >
            Fazer Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        {screenshot && (
          <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-white/10 bg-slate-900">
            <img
              src={screenshot}
              alt="Screenshot"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setScreenshot(null)}
              className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 rounded text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !title.trim() || !description.trim()}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Relatório'
          )}
        </Button>
      </div>
    </form>
  );
}
