'use client';

// Modal "Criar Grupo de Estudos" — segue o padrão visual do EditProfileModal:
// gradient line no topo, glass background, accent emerald.
//
// Validação: usa as mesmas regras do server (lib/study-groups.ts) pra evitar
// divergência cliente/servidor.

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2, Users, Globe, Lock, Target, FileText } from 'lucide-react';
import {
  GROUP_NAME_MIN,
  GROUP_NAME_MAX,
  GROUP_DESC_MAX,
  validateGroupInput,
  type GroupListItem,
} from '@/lib/study-groups';
import subjectsData from '@/data/subjects.json';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Slug do concurso atual do usuário, usado pra pré-selecionar. */
  defaultConcursoSlug?: string | null;
  /**
   * Chamado após criar o grupo. Padrão: redireciona pra página do grupo.
   * Permite override se o caller quer atualizar lista in-place sem navegar.
   */
  onCreated?: (group: GroupListItem) => void;
}

// Lista de concursos conhecidos — derivamos só pra UX, mas aceitamos qualquer
// slug livre. Catálogo real vive em src/data/seed-concursos.ts (server-side).
// Aqui usamos uma lista enxuta de prefixos comuns.
const KNOWN_CONCURSOS: { slug: string; label: string }[] = [
  { slug: 'pf', label: 'Polícia Federal' },
  { slug: 'prf', label: 'Polícia Rodoviária Federal' },
  { slug: 'rfb', label: 'Receita Federal' },
  { slug: 'inss', label: 'INSS' },
  { slug: 'esfcex', label: 'EsFCEx' },
  { slug: 'tcu', label: 'TCU' },
  { slug: 'pc', label: 'Polícia Civil' },
];

type SubjectsMap = Record<string, { title: string }>;

export function CreateGroupModal({
  isOpen,
  onClose,
  defaultConcursoSlug,
  onCreated,
}: CreateGroupModalProps) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [concursoSlug, setConcursoSlug] = useState<string>(defaultConcursoSlug ?? '');
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Reset ao abrir.
  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setDescription('');
    setConcursoSlug(defaultConcursoSlug ?? '');
    setIsPrivate(false);
    setServerError(null);
  }, [isOpen, defaultConcursoSlug]);

  // Sugestões combinadas: matérias + concursos conhecidos (deduplicados).
  // Trata subjectsData como mapa de slug→{title}; aceitamos qualquer estrutura
  // similar usando a tipagem above.
  const concursoOptions = useMemo(() => {
    const subjects = subjectsData as unknown as SubjectsMap;
    const fromSubjects = Object.entries(subjects).map(([slug, v]) => ({
      slug,
      label: v.title,
    }));
    const seen = new Set<string>();
    return [...KNOWN_CONCURSOS, ...fromSubjects].filter((opt) => {
      if (seen.has(opt.slug)) return false;
      seen.add(opt.slug);
      return true;
    });
  }, []);

  const validation = validateGroupInput({ name, description });
  const canSubmit = !validation && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          concursoSlug: concursoSlug || null,
          isPrivate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.error ?? 'Erro ao criar grupo');
        setSubmitting(false);
        return;
      }
      const created: GroupListItem = data.group;
      if (onCreated) {
        onCreated(created);
      } else {
        router.push(`/dashboard/feed/grupos/${created.slug}`);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setServerError('Erro de rede. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Criar Grupo de Estudos"
    >
      <div
        className="relative w-full max-w-xl max-h-[95vh] flex flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.88) 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '1.5rem',
          boxShadow: '0 20px 60px -12px rgba(0,0,0,0.7)',
          animation: 'modalEnter 0.2s ease-out',
        }}
      >
        <style>{`
          @keyframes modalEnter {
            from { opacity: 0; transform: scale(0.95) translateY(8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Linha de gradient no topo */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none rounded-t-3xl"
          style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6)' }}
        />

        {/* Header */}
        <div
          className="flex items-center gap-4 px-6 pt-7 pb-5 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              boxShadow: '0 0 20px rgba(16,185,129,0.4)',
            }}
          >
            <Users className="w-6 h-6 text-slate-950" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-white leading-tight">Criar grupo de estudos</h2>
            <p className="text-sm text-slate-400 mt-0.5">Conecte-se com quem foca no mesmo concurso</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}
            aria-label="Fechar"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Nome */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Nome do grupo
                </label>
              </div>
              <span
                className="text-[11px] font-mono tabular-nums"
                style={{ color: name.length > GROUP_NAME_MAX ? '#f87171' : '#64748b' }}
              >
                {name.length}/{GROUP_NAME_MAX}
              </span>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, GROUP_NAME_MAX + 5))}
              placeholder="Ex: PF Perito 2026 — Informática Forense"
              maxLength={GROUP_NAME_MAX + 5}
              className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm transition-all outline-none"
              style={{
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Mínimo {GROUP_NAME_MIN} caracteres.
            </p>
          </div>

          {/* Descrição */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Descrição
                </label>
              </div>
              <span
                className="text-[11px] font-mono tabular-nums"
                style={{ color: description.length > GROUP_DESC_MAX ? '#f87171' : '#64748b' }}
              >
                {description.length}/{GROUP_DESC_MAX}
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, GROUP_DESC_MAX))}
              placeholder="Para que serve este grupo? Quem vai gostar?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm transition-all outline-none resize-none"
              style={{
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#06b6d4';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(6,182,212,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Concurso alvo */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Concurso alvo (opcional)
              </label>
            </div>
            <select
              value={concursoSlug}
              onChange={(e) => setConcursoSlug(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-white text-sm transition-all outline-none appearance-none cursor-pointer"
              style={{
                background: 'rgba(30,41,59,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                colorScheme: 'dark',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#fbbf24';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(251,191,36,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Sem concurso específico</option>
              {concursoOptions.map((opt) => (
                <option key={opt.slug} value={opt.slug}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Privacidade */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lock className="w-3.5 h-3.5 text-violet-400" />
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Privacidade
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className="flex items-start gap-2.5 p-3 rounded-xl text-left transition-all"
                style={{
                  background: !isPrivate ? 'rgba(16,185,129,0.12)' : 'rgba(30,41,59,0.6)',
                  border: !isPrivate ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Globe
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: !isPrivate ? '#34d399' : '#64748b' }}
                />
                <div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: !isPrivate ? '#fff' : '#cbd5e1' }}
                  >
                    Público
                  </div>
                  <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Qualquer um pode entrar e ver o feed.
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className="flex items-start gap-2.5 p-3 rounded-xl text-left transition-all"
                style={{
                  background: isPrivate ? 'rgba(139,92,246,0.12)' : 'rgba(30,41,59,0.6)',
                  border: isPrivate ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Lock
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: isPrivate ? '#a78bfa' : '#64748b' }}
                />
                <div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: isPrivate ? '#fff' : '#cbd5e1' }}
                  >
                    Privado
                  </div>
                  <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    Só por convite. Outros não veem o feed.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Erros */}
          {(validation || serverError) && (
            <div
              className="px-4 py-3 rounded-xl text-sm"
              style={{
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.3)',
                color: '#fca5a5',
              }}
            >
              {serverError ?? validation}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 py-5 shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-3 rounded-xl text-sm font-black text-slate-950 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              boxShadow: '0 0 20px rgba(16,185,129,0.3)',
            }}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar grupo'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
