'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { X, Loader2, User, MapPin, Calendar, FileText, Smile, Sparkles, Star, ImagePlus, Check, Shield, Settings, MoreVertical, BarChart3, LogOut, Award, Frame } from 'lucide-react';
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
  const bioColor = bioLength > BIO_MAX ? '#f87171' : bioLength > 140 ? '#fbbf24' : '#10b981';

  const tabs = [
    { key: 'identity', label: 'Perfil', icon: User },
    { key: 'avatar', label: 'Avatar', icon: Smile },
    { key: 'borders', label: 'Bordas', icon: Frame },
    { key: 'seals', label: 'Selos', icon: Award },
  ] as const;

  // Calcular origem para animação morph
  const originStyle: React.CSSProperties | undefined = originRect
    ? {
        '--origin-x': `${originRect.left + originRect.width / 2}px`,
        '--origin-y': `${originRect.top + originRect.height / 2}px`,
      }
    : undefined;

  return (
    <>
      <style>{`
        @keyframes modal-expand {
          0% {
            opacity: 0;
            transform: scale(0.2) translate(-50%, -50%);
            filter: blur(8px);
          }
          40% {
            opacity: 1;
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
            filter: blur(0);
          }
        }

        @keyframes backdrop-in {
          0% {
            opacity: 0;
            backdrop-filter: blur(0px);
            -webkit-backdrop-filter: blur(0px);
          }
          100% {
            opacity: 1;
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
          }
        }

        .animate-modal-enter {
          animation: modal-expand 450ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transform-origin: var(--origin-x, 50%) var(--origin-y, 50%);
        }

        .backdrop-layer {
          position: fixed;
          inset: 0;
          background: rgba(15, 81, 50, 0.25);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          animation: backdrop-in 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
          z-index: 50;
        }

        @supports not ((backdrop-filter: blur(16px)) or (-webkit-backdrop-filter: blur(16px))) {
          .backdrop-layer {
            background: rgba(15, 81, 50, 0.85);
          }
        }

        .modal-card {
          background: #ffffff;
          border-radius: 24px;
          box-shadow:
            0 40px 80px -20px rgba(15, 81, 50, 0.35),
            0 0 0 1px rgba(32, 201, 151, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          overflow: hidden;
        }

        .cover-banner {
          height: 120px;
          background: linear-gradient(135deg, #0F5132, #198754);
          position: relative;
        }

        .avatar-container {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 4px solid white;
          outline: 2px solid #198754;
          position: absolute;
          bottom: -50px;
          left: 24px;
          background: white;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .tab-active {
          color: #0A2E1C;
          font-weight: 700;
          border-bottom: 3px solid #198754;
          box-shadow: 0 2px 8px rgba(32, 201, 151, 0.6);
        }

        .tab-inactive {
          color: #6B7280;
          border-bottom: 3px solid transparent;
        }

        .input-edrush {
          background: #F0FFF4;
          border: 1px solid #A7F3D0;
          color: #0A2E1C;
          transition: all 200ms ease;
        }

        .input-edrush:focus {
          border-color: #198754;
          box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.15);
          outline: none;
          background: white;
        }

        .btn-primary {
          background: linear-gradient(135deg, #0F5132, #198754);
          color: white;
          transition: all 200ms ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #198754, #20C997);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: white;
          border: 2px solid #198754;
          color: #0F5132;
          transition: all 200ms ease;
        }

        .btn-secondary:hover {
          background: #F0FFF4;
        }

        .tag-pill {
          background: #F0FFF4;
          color: #0F5132;
          border: 1px solid #A7F3D0;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-modal-enter,
          .backdrop-layer {
            animation: none !important;
          }
        }
      `}</style>

      {/* Layer 2: Backdrop Blur + Overlay */}
      <div className="backdrop-layer" onClick={onClose} />

      {/* Layer 3: Modal Card */}
      <div
        className="fixed inset-0 flex items-center justify-center z-[60] p-4 sm:p-6 animate-modal-enter"
        style={originStyle}
        role="dialog"
        aria-modal="true"
        aria-label="Editar Perfil"
      >
        <div className="relative w-full max-w-[680px] max-h-[90vh] flex flex-col modal-card">
          {/* Cover Banner */}
          <div className="cover-banner">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="absolute top-4 right-16 flex gap-2">
              <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all" aria-label="Estatísticas">
                <BarChart3 className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all" aria-label="Mais opções">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Avatar sobreposto */}
          <div className="avatar-container group cursor-pointer" onClick={() => setActiveTab('avatar')}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
              {photoPreview ? (
                <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#198754] flex items-center justify-center border-2 border-white">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Header Info */}
          <div className="pt-16 px-6 pb-4 border-b border-[#A7F3D0]/30">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold" style={{ color: '#0A2E1C' }}>
                {formData.username || 'Seu Nome'}
              </h2>
              <div className="w-5 h-5 rounded-full bg-[#198754] flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm mb-3" style={{ color: '#6B7280' }}>
              <span>{initialData.email || 'usuario@edrush.com'}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{formattedLocation || 'Localização não definida'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="tag-pill">Concurseiro</span>
              <span className="tag-pill">EdRush</span>
              <span className="tag-pill">Foco Federal</span>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex px-6 border-b border-[#A7F3D0]/30 overflow-x-auto">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === key ? 'tab-active' : 'tab-inactive hover:text-[#0A2E1C]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {actionError && (
              <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {actionError}
              </div>
            )}

            {activeTab === 'identity' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0A2E1C' }}>
                      Primeiro Nome
                    </label>
                    <input
                      type="text"
                      value={formData.username.split(' ')[0] || ''}
                      onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                      placeholder="Primeiro nome"
                      className="input-edrush w-full px-4 py-3 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0A2E1C' }}>
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      value={formData.username.split(' ').slice(1).join(' ') || ''}
                      onChange={(e) => setFormData((p) => ({ ...p, username: `${p.username.split(' ')[0]} ${e.target.value}`.trim() }))}
                      placeholder="Sobrenome"
                      className="input-edrush w-full px-4 py-3 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0A2E1C' }}>
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                      placeholder="username"
                      className="input-edrush w-full pl-8 pr-4 py-3 rounded-xl"
                    />
                    {formData.username.length >= 2 && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#198754]">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#0A2E1C' }}>
                      Bio
                    </label>
                    <span className="text-xs font-mono" style={{ color: bioColor }}>
                      {bioLength}/{BIO_MAX}
                    </span>
                  </div>
                  <textarea
                    value={formData.bio ?? ''}
                    onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value.slice(0, BIO_MAX) }))}
                    placeholder="Conte um pouco sobre sua jornada..."
                    rows={4}
                    className="input-edrush w-full px-4 py-3 rounded-xl resize-none"
                  />
                  <div className="mt-2 h-1 rounded-full overflow-hidden bg-gray-200">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${Math.min(bioProgress * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #198754, #20C997)',
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0A2E1C' }}>
                      Aniversário
                    </label>
                    <input
                      type="date"
                      value={formData.birthday ?? ''}
                      onChange={(e) => setFormData((p) => ({ ...p, birthday: e.target.value }))}
                      className="input-edrush w-full px-4 py-3 rounded-xl"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0A2E1C' }}>
                      Localização
                    </label>
                    <select
                      value={selectedUf}
                      onChange={(e) => {
                        setSelectedUf(e.target.value);
                        setSelectedCidade('');
                      }}
                      className="input-edrush w-full px-4 py-3 rounded-xl appearance-none cursor-pointer mb-3"
                      style={{ colorScheme: 'light' }}
                    >
                      <option value="">UF</option>
                      {BRAZILIAN_STATES.map((uf) => (
                        <option key={uf.sigla} value={uf.sigla}>
                          {uf.sigla} — {uf.nome}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedCidade}
                      onChange={(e) => setSelectedCidade(e.target.value)}
                      disabled={!selectedUf || isLoadingCidades}
                      className="input-edrush w-full px-4 py-3 rounded-xl appearance-none cursor-pointer disabled:opacity-50"
                      style={{ colorScheme: 'light' }}
                    >
                      <option value="">
                        {!selectedUf
                          ? 'Selecione o estado'
                          : isLoadingCidades
                          ? 'Carregando...'
                          : cidades.length === 0
                          ? 'Indisponível'
                          : 'Selecione a cidade'}
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
                    {cidadesError && (
                      <p className="text-xs text-red-600 mt-2">{cidadesError}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'avatar' && (
              <div className="space-y-6">
                <div className="p-5 rounded-xl border-2 border-[#A7F3D0] bg-[#F0FFF4]">
                  <h3 className="text-sm font-bold mb-2" style={{ color: '#0A2E1C' }}>Sua foto, seu estilo</h3>
                  <p className="text-xs mb-4" style={{ color: '#6B7280' }}>
                    Envie uma foto própria (JPG, PNG ou WebP, até 5 MB) ou escolha um avatar da coleção.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                    >
                      <ImagePlus className="w-4 h-4" />
                      Enviar foto
                    </button>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoFile(null);
                          setPhotoPreview(null);
                          setPhotoChanged(true);
                          setActionError(null);
                        }}
                        className="btn-secondary px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        Usar avatar EdRush
                      </button>
                    )}
                  </div>
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
                </div>
                <AvatarSelector
                  selectedId={formData.avatar}
                  onSelect={(id) => setFormData((p) => ({ ...p, avatar: id }))}
                  size="lg"
                  imageUrl={photoPreview}
                />
              </div>
            )}

            {activeTab === 'borders' && (
              <div>
                <p className="text-xs mb-6" style={{ color: '#6B7280' }}>
                  Conquiste bordas estudando todo dia. Bordas equipadas aparecem para você e seus amigos no chat e nos perfis.
                </p>
                <BordersGallery
                  avatarId={formData.avatar}
                  onEquipped={() => onBorderEquipped?.()}
                />
              </div>
            )}

            {activeTab === 'seals' && (
              <div>
                <SealsGallery onEquipped={onSealsEquipped} />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-[#A7F3D0]/30 bg-white">
            <button
              onClick={onClose}
              className="btn-secondary px-6 py-3 rounded-xl text-sm font-semibold"
            >
              Descartar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !!usernameError}
              className="btn-primary px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}