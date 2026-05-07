'use client';

import { useState } from 'react';
import { X, Loader2, User, MapPin, Calendar, FileText, Smile } from 'lucide-react';
import { AvatarSelector } from './AvatarSelector';
import { getAvatar } from '@/data/avatars';

const BIO_MAX = 160;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    username: string;
    birthday: string;
    location: string;
    bio: string;
    avatar: number;
  }) => void;
  initialData: {
    username: string;
    birthday?: string;
    location?: string;
    bio?: string;
    avatar: number;
  };
}

type ModalTab = 'identity' | 'avatar';

export function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>('identity');

  const selectedAvatar = getAvatar(formData.avatar);
  const bioLength = (formData.bio ?? '').length;
  const usernameTrimmed = (formData.username ?? '').trim();
  const usernameError =
    usernameTrimmed.length > 0 && (usernameTrimmed.length < 2 || usernameTrimmed.length > 30)
      ? 'O nome de usuário deve ter entre 2 e 30 caracteres'
      : null;

  const handleSave = async () => {
    if (usernameError) {
      setActiveTab('identity');
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSave({
      username: usernameTrimmed,
      birthday: formData.birthday ?? '',
      location: formData.location ?? '',
      bio: formData.bio ?? '',
      avatar: formData.avatar,
    });
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Editar Perfil"
    >
      <div
        className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
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
          {/* Avatar preview grande */}
          <div
            className="relative shrink-0"
            style={{
              filter: `drop-shadow(0 0 12px ${selectedAvatar.colors.primary}66)`,
            }}
          >
            <AvatarSelector selectedId={formData.avatar} size="lg" />
          </div>

          {/* Título */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-white leading-tight">Editar Perfil</h2>
            <p className="text-sm text-slate-400 mt-0.5">Personalize seu painel no Foco Federal</p>
          </div>

          {/* Fechar */}
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}
            aria-label="Fechar modal"
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex px-6 pt-4 gap-1 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {([
            { key: 'identity', label: 'Identidade', icon: User },
            { key: 'avatar',   label: 'Avatar',     icon: Smile },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all"
              style={{
                color: activeTab === key ? '#34d399' : '#64748b',
                borderBottom: activeTab === key ? '2px solid #10b981' : '2px solid transparent',
                background: activeTab === key ? 'rgba(16,185,129,0.08)' : 'transparent',
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'identity' && (
            <div className="space-y-5">
              {/* Username */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Nome de Usuário
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                  placeholder="como quer ser chamado?"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm transition-all outline-none"
                  style={{
                    background: 'rgba(30,41,59,0.6)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.15)'; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Bio */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                      Bio
                    </label>
                  </div>
                  <span
                    className="text-[11px] font-mono tabular-nums"
                    style={{ color: bioLength > BIO_MAX ? '#f87171' : '#64748b' }}
                  >
                    {bioLength}/{BIO_MAX}
                  </span>
                </div>
                <textarea
                  value={formData.bio ?? ''}
                  onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value.slice(0, BIO_MAX) }))}
                  placeholder="Conte um pouco sobre sua jornada de estudos..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm transition-all outline-none resize-none"
                  style={{
                    background: 'rgba(30,41,59,0.6)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(6,182,212,0.15)'; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Birthday */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Aniversário
                  </label>
                </div>
                <input
                  type="date"
                  value={formData.birthday ?? ''}
                  onChange={(e) => setFormData((p) => ({ ...p, birthday: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm transition-all outline-none"
                  style={{
                    background: 'rgba(30,41,59,0.6)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    colorScheme: 'dark',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#f472b6'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(244,114,182,0.15)'; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Location */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Localização
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="São Paulo, SP"
                  value={formData.location ?? ''}
                  onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm transition-all outline-none"
                  style={{
                    background: 'rgba(30,41,59,0.6)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(251,191,36,0.15)'; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
          )}

          {activeTab === 'avatar' && (
            <AvatarSelector
              selectedId={formData.avatar}
              onSelect={(id) => setFormData((p) => ({ ...p, avatar: id }))}
              size="lg"
            />
          )}
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 px-6 py-5 shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)'; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 rounded-xl text-sm font-black text-slate-950 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              boxShadow: '0 0 20px rgba(16,185,129,0.3)',
            }}
            onMouseEnter={(e) => { if (!isSaving) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(16,185,129,0.5)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(16,185,129,0.3)'; }}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar alterações'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
