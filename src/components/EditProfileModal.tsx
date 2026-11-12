'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { X, Loader2, User, MapPin, Calendar, FileText, Smile, Sparkles, Star, ImagePlus, Check, Shield, Settings, MoreVertical, BarChart3, LogOut, Award, Frame, Upload } from 'lucide-react';
import { AvatarSelector } from './AvatarSelector';
import { BordersGallery } from './BordersGallery';
import { SealsGallery } from './profile/SealsGallery';
import { getAvatar } from '@/data/avatars';
import { BRAZILIAN_STATES, getStateBySigla, DF_REGIOES_ADMINISTRATIVAS } from '@/data/brazilian-states';

const BIO_MAX = 160;

function parseLocation(value?: string): { uf: string; cidade: string } {
  if (!value) return { uf: '', cidade: '' };
  const idx = value.lastIndexOf(',');
  if (idx === -1) return { uf: '', cidade: '' };
  const cidade = value.slice(0, idx).trim();
  const ufRaw = value.slice(idx + 1).trim().toUpperCase();
  const uf = getStateBySigla(ufRaw)?.sigla ?? '';
  return { uf, cidade: uf ? cidade : '' };
}

const cityCache = new Map<string, string[]>();

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    username: string;
    birthday: string;
    location: string;
    bio: string;
    avatar: number;
    foto_url?: string | null;
  }) => Promise<void>;
  onBorderEquipped?: () => void;
  onSealsEquipped?: () => void;
  initialData: {
    username: string;
    email?: string;
    birthday?: string;
    location?: string;
    bio?: string;
    avatar: number;
    foto_url?: string | null;
  };
  originRect?: DOMRect | null;
}

type ModalTab = 'identity' | 'avatar' | 'borders' | 'seals';

export function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  onBorderEquipped,
  onSealsEquipped,
  initialData,
  originRect,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>('identity');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData.foto_url ?? null);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialParsed = useMemo(() => parseLocation(initialData.location), [initialData.location]);
  const [selectedUf, setSelectedUf] = useState<string>(initialParsed.uf);
  const [selectedCidade, setSelectedCidade] = useState<string>(initialParsed.cidade);
  const [cidades, setCidades] = useState<string[]>([]);
  const [isLoadingCidades, setIsLoadingCidades] = useState(false);
  const [cidadesError, setCidadesError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      username: initialData.username,
      birthday: initialData.birthday,
      location: initialData.location,
      bio: initialData.bio,
      avatar: initialData.avatar,
      foto_url: initialData.foto_url,
    });
    setPhotoFile(null);
    setPhotoPreview(initialData.foto_url ?? null);
    setPhotoChanged(false);
    setActionError(null);
    const parsed = parseLocation(initialData.location);
    setSelectedUf(parsed.uf);
    setSelectedCidade(parsed.cidade);
  }, [
    isOpen,
    initialData.username,
    initialData.birthday,
    initialData.location,
    initialData.bio,
    initialData.avatar,
    initialData.foto_url,
  ]);

  useEffect(() => {
    if (!photoPreview?.startsWith('blob:')) return;
    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  useEffect(() => {
    if (!selectedUf) {
      setCidades([]);
      setCidadesError(null);
      return;
    }
    if (selectedUf === 'DF') {
      setCidades(DF_REGIOES_ADMINISTRATIVAS);
      setCidadesError(null);
      setIsLoadingCidades(false);
      return;
    }
    const cached = cityCache.get(selectedUf);
    if (cached) {
      setCidades(cached);
      setCidadesError(null);
      return;
    }
    const state = getStateBySigla(selectedUf);
    if (!state) return;
    const controller = new AbortController();
    setIsLoadingCidades(true);
    setCidadesError(null);
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.codigo_ibge}/municipios?orderBy=nome`,
      { signal: controller.signal }
    )
      .then((r) => {
        if (!r.ok) throw new Error('IBGE indisponível');
        return r.json();
      })
      .then((data: { nome: string }[]) => {
        const names = data.map((m) => m.nome);
        cityCache.set(selectedUf, names);
        setCidades(names);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setCidades([]);
        setCidadesError('Não foi possível carregar as cidades. Tente novamente.');
      })
      .finally(() => setIsLoadingCidades(false));
    return () => controller.abort();
  }, [selectedUf]);

  const formattedLocation = selectedUf && selectedCidade ? `${selectedCidade}, ${selectedUf}` : '';
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
    setActionError(null);
    try {
      let fotoUrl = photoPreview;
      if (photoFile) {
        const uploadData = new FormData();
        uploadData.set('file', photoFile);
        const response = await fetch('/api/posts/upload-image', {
          method: 'POST',
          body: uploadData,
        });
        const result = await response.json();
        if (!response.ok || typeof result.url !== 'string') {
          throw new Error(result.message ?? 'Não foi possível enviar a foto.');
        }
        fotoUrl = result.url;
      }

      await onSave({
        username: usernameTrimmed,
        birthday: formData.birthday ?? '',
        location: formattedLocation,
        bio: formData.bio ?? '',
        avatar: formData.avatar,
        ...(photoChanged ? { foto_url: fotoUrl } : {}),
      });
      onClose();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Não foi possível salvar as alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const bioProgress = bioLength / BIO_MAX;
  const bioColorClass = bioLength > BIO_MAX ? 'text-red-500' : bioLength > 140 ? 'text-yellow-400' : 'text-[#6B8F7B]';
  const bioBarColorClass = bioLength > BIO_MAX ? 'bg-red-500' : bioLength > 140 ? 'bg-yellow-400' : 'bg-gradient-to-r from-[#20C997] to-[#00FF9D]';

  const tabs = [
    { key: 'identity', label: 'Identidade', icon: User },
    { key: 'avatar', label: 'Avatar', icon: Smile },
    { key: 'borders', label: 'Bordas', icon: Frame },
    { key: 'seals', label: 'Selos', icon: Award },
  ] as const;

  const originStyle = originRect
    ? ({
        '--origin-x': `${originRect.left + originRect.width / 2}px`,
        '--origin-y': `${originRect.top + originRect.height / 2}px`,
      } as any)
    : undefined;

  return (
    <>
      <style>{`
        .modal-backdrop {
          background: rgba(5, 15, 10, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }

        .modal-container {
          background-color: #0A2E1C;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0L60 17.32v34.64L30 60 0 51.96V17.32L30 0z' fill='none' stroke='%23198754' stroke-opacity='0.035' stroke-width='1'/%3E%3C/svg%3E");
          border: 1px solid #2D6B4F;
          border-radius: 24px;
          box-shadow:
            0 40px 80px -20px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(32, 201, 151, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .preview-panel {
          background: #0F3D26;
          border-right: 1px solid #2D6B4F;
        }

        .tab-item.active {
          color: #20C997;
        }
        .tab-item.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 12px;
          right: 12px;
          height: 3px;
          background: #20C997;
          border-radius: 3px 3px 0 0;
          box-shadow: 0 0 12px rgba(32, 201, 151, 0.5);
        }

        .form-input, .form-textarea, .form-select {
          background: #0A2E1C;
          border: 1px solid #2D6B4F;
          color: #FFFFFF;
        }
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: #20C997;
          box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.15);
          outline: none;
        }
        .form-input::placeholder, .form-textarea::placeholder {
          color: #6B8F7B;
        }

        .btn-save {
          background: linear-gradient(135deg, #198754 0%, #20C997 100%);
          box-shadow: 0 4px 16px rgba(32, 201, 151, 0.3);
        }
        .btn-save:hover:not(:disabled) {
          background: linear-gradient(135deg, #20C997 0%, #00FF9D 100%);
          box-shadow: 0 6px 24px rgba(0, 255, 157, 0.4);
          transform: translateY(-1px);
        }
        .btn-cancel:hover {
          border-color: #EF4444;
          color: #EF4444;
          background: rgba(239, 68, 68, 0.08);
        }

        @keyframes modal-open {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-enter {
          animation: modal-open 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[960px] max-h-[90vh] flex flex-col modal-container modal-enter"
          style={originStyle}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#2D6B4F]">
            <div>
              <h2 id="modal-title" className="text-2xl font-bold text-white">Editar Perfil</h2>
              <p className="text-sm text-[#A7F3D0] mt-1">Personalize sua presença no EdRush</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-[#A7F3D0] border border-[#2D6B4F] rounded-xl transition-all btn-cancel"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !!usernameError}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl transition-all btn-save disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Salvar Alterações
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 px-6 border-b border-[#2D6B4F]">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors tab-item ${
                  activeTab === key ? 'active' : 'text-[#6B8F7B] hover:text-[#A7F3D0]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel: Preview */}
            <div className="hidden md:flex flex-col items-center w-[35%] preview-panel p-8 text-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-[#0A2E1C] outline-2 outline-[#20C997] overflow-hidden bg-[#122B1D]">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <User className="w-12 h-12 text-[#6B8F7B]" />
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 break-words max-w-full">
                {formData.username || 'Seu Nome'}
              </h3>
              <p className="text-sm text-[#A7F3D0] mb-6 line-clamp-2 max-w-[220px]">
                {formData.bio || 'Sua bio aparecerá aqui...'}
              </p>
              <div className="flex gap-6 pt-6 border-t border-[#2D6B4F] w-full justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-[#20C997] font-mono">0</span>
                  <span className="text-[10px] font-semibold tracking-wider text-[#6B8F7B] uppercase">Posts</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-[#20C997] font-mono">0</span>
                  <span className="text-[10px] font-semibold tracking-wider text-[#6B8F7B] uppercase">Seg</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-[#20C997] font-mono">0</span>
                  <span className="text-[10px] font-semibold tracking-wider text-[#6B8F7B] uppercase">Selos</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Form/Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#122B1D]">
              {actionError && (
                <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-400 border border-red-500/20 rounded-lg bg-red-500/10">
                  <X className="w-4 h-4" />
                  {actionError}
                </div>
              )}

              {activeTab === 'identity' && (
                <div className="space-y-6 animate-[tab-fade-in_250ms_ease_forwards]">
                  <div>
                    <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-[#A7F3D0]">
                      Nome de Usuário
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                      placeholder="Seu nome completo"
                      className="w-full px-4 py-3 text-sm rounded-xl form-input"
                    />
                    {usernameError && <p className="mt-2 text-xs text-red-400">{usernameError}</p>}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold tracking-wider uppercase text-[#A7F3D0]">Bio</label>
                      <span className={`text-xs font-mono ${bioColorClass}`}>{bioLength}/{BIO_MAX}</span>
                    </div>
                    <div className="relative">
                      <textarea
                        value={formData.bio ?? ''}
                        onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value.slice(0, BIO_MAX) }))}
                        placeholder="Conte um pouco sobre sua jornada..."
                        rows={4}
                        className="w-full px-4 py-3 text-sm rounded-xl resize-none form-textarea"
                      />
                    </div>
                    <div className="h-1 mt-2 overflow-hidden rounded-full bg-[#1A4731]">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${bioBarColorClass}`}
                        style={{ width: `${Math.min(bioProgress * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-[#A7F3D0]">
                        Aniversário
                      </label>
                      <input
                        type="date"
                        value={formData.birthday ?? ''}
                        onChange={(e) => setFormData((p) => ({ ...p, birthday: e.target.value }))}
                        className="w-full px-4 py-3 text-sm rounded-xl form-input"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-[#A7F3D0]">
                        Localização
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={selectedUf}
                          onChange={(e) => {
                            setSelectedUf(e.target.value);
                            setSelectedCidade('');
                          }}
                          className="w-full px-4 py-3 text-sm rounded-xl appearance-none cursor-pointer form-select"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="">UF</option>
                          {BRAZILIAN_STATES.map((uf) => (
                            <option key={uf.sigla} value={uf.sigla}>
                              {uf.sigla}
                            </option>
                          ))}
                        </select>
                        <select
                          value={selectedCidade}
                          onChange={(e) => setSelectedCidade(e.target.value)}
                          disabled={!selectedUf || isLoadingCidades}
                          className="w-full px-4 py-3 text-sm rounded-xl appearance-none cursor-pointer disabled:opacity-50 form-select"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="">
                            {!selectedUf
                              ? 'Estado'
                              : isLoadingCidades
                              ? '...'
                              : cidades.length === 0
                              ? 'N/A'
                              : 'Cidade'}
                          </option>
                          {selectedCidade && !cidades.includes(selectedCidade) && (
                            <option value={selectedCidade}>{selectedCidade}</option>
                          )}
                          {cidades.map((nome) => (
                            <option key={nome} value={nome}>
                              {nome}
                            </option>
                          ))}
                        </select>
                      </div>
                      {cidadesError && <p className="mt-2 text-xs text-red-400">{cidadesError}</p>}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'avatar' && (
                <div className="space-y-6 animate-[tab-fade-in_250ms_ease_forwards]">
                  <div className="flex flex-col items-center p-8 border-2 border-dashed rounded-full border-[#2D6B4F] w-52 h-52 mx-auto cursor-pointer transition-all hover:border-[#20C997] hover:bg-[#20C997]/5 group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = '';
                        if (!file) return;
                        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                          setActionError('Escolha uma imagem JPG, PNG ou WebP.');
                          return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          setActionError('A foto deve ter no máximo 5 MB.');
                          return;
                        }
                        setActionError(null);
                        setPhotoFile(file);
                        setPhotoPreview(URL.createObjectURL(file));
                        setPhotoChanged(true);
                      }}
                    />
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mb-3 text-[#6B8F7B] group-hover:text-[#20C997]" />
                        <span className="text-sm font-medium text-[#A7F3D0]">Enviar foto</span>
                        <span className="text-xs text-[#6B8F7B]">JPG, PNG ou WebP (max 5MB)</span>
                      </>
                    )}
                  </div>
                  {photoPreview && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoFile(null);
                          setPhotoPreview(null);
                          setPhotoChanged(true);
                          setActionError(null);
                        }}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remover foto
                      </button>
                    </div>
                  )}
                  <div className="pt-6 border-t border-[#2D6B4F]">
                    <h4 className="mb-4 text-sm font-bold text-[#A7F3D0] uppercase tracking-wider">Ou escolha um avatar</h4>
                    <AvatarSelector
                      selectedId={formData.avatar}
                      onSelect={(id) => {
                        setFormData((p) => ({ ...p, avatar: id }));
                        setPhotoPreview(null);
                        setPhotoChanged(true);
                      }}
                      size="md"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'borders' && (
                <div className="animate-[tab-fade-in_250ms_ease_forwards]">
                  <p className="mb-6 text-sm text-[#6B8F7B]">
                    Conquiste bordas estudando todo dia. Bordas equipadas aparecem para você e seus amigos.
                  </p>
                  <BordersGallery
                    avatarId={formData.avatar}
                    onEquipped={() => onBorderEquipped?.()}
                  />
                </div>
              )}

              {activeTab === 'seals' && (
                <div className="animate-[tab-fade-in_250ms_ease_forwards]">
                  <SealsGallery onEquipped={onSealsEquipped} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}