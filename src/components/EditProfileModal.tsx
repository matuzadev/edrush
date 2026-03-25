'use client';

import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { AvatarSelector } from './AvatarSelector';

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

export function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    onSave({
      username: formData.username,
      birthday: formData.birthday || '',
      location: formData.location || '',
      bio: formData.bio || '',
      avatar: formData.avatar,
    });
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/5 bg-slate-900">
          <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar Selection */}
          <div>
            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest block mb-4">
              Avatar
            </label>
            <AvatarSelector
              selectedId={formData.avatar}
              onSelect={(id) => setFormData(prev => ({ ...prev, avatar: id }))}
              size="lg"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest block mb-2">
              Nome de Usuário
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest block mb-2">
              Aniversário
            </label>
            <input
              type="date"
              value={formData.birthday || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest block mb-2">
              Localização
            </label>
            <input
              type="text"
              placeholder="São Paulo, SP"
              value={formData.location || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest block mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Conte um pouco sobre você..."
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-white/5 bg-slate-900 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
