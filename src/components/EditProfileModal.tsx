'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { X, Loader2, User, MapPin, Calendar, FileText, Smile, Sparkles, Star, ImagePlus, Check } from 'lucide-react';
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
    birthday?: string;
    location?: string;
    bio?: string;
    avatar: number;
    foto_url?: string | null;
  };
}

type ModalTab = 'identity' | 'avatar' | 'borders' | 'seals';

export function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  onBorderEquipped,
  onSealsEquipped,
  initialData,
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
  const bioColor = bioLength > BIO_MAX ? '#dc2626' : bioLength > 140 ? '#d97706' : '#006d5b';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6"
      style={{
        background: 'rgba(245, 242, 237, 0.92)',
        backdropFilter: 'blur(12px)'
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Editar Perfil"
    >
      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes avatarFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes counterPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .input-editorial {
          border: none;
          border-bottom: 1.5px solid #e5e2db;
          background: transparent;
          padding: 12px 0;
          font-size: 15px;
          transition: border-color 0.2s ease;
          outline: none;
        }
        .input-editorial:focus {
          border-bottom-color: #006d5b;
        }
        .tab-pill {
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .tab-pill:hover {
          border-color: #e5e2db;
          background: rgba(0, 109, 91, 0.03);
        }
        .tab-pill.active {
          border-color: #006d5b;
          background: rgba(0, 109, 91, 0.06);
          color: #006d5b;
        }
        .save-btn {
          transition: all 0.2s ease;
        }
        .save-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 109, 91, 0.2);
        }
        .save-btn:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>

      <div
        className="relative w-full max-w-5xl max-h-[95vh] flex flex-col lg:flex-row overflow-hidden"
        style={{
          background: '#faf9f7',
          borderRadius: '24px',
          boxShadow: '0 24px 80px -16px rgba(26, 26, 26, 0.12)',
          animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Painel Esquerdo — Preview Editorial */}
        <div
          className="hidden lg:flex lg:w-80 xl:w-96 flex-col items-center justify-center p-8 relative overflow-hidden shrink-0"
          style={{
            background: 'linear-gradient(180deg, #f5f2ed 0%, #ebe8e1 100%)',
            borderRight: '1px solid #e5e2db',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, #006d5b, #059669)' }}
          />

          <div
            className="relative mb-6"
            style={{
              animation: 'avatarFloat 4s ease-in-out infinite',
            }}
          >
            <div
              className="w-32 h-32 rounded-full overflow-hidden"
              style={{
                boxShadow: '0 8px 32px rgba(0, 109, 91, 0.15)',
                border: '3px solid white',
              }}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: '#e5e2db' }}
                >
                  <User className="w-16 h-16" style={{ color: '#a8a49d' }} />
                </div>
              )}
            </div>

            <button
              onClick={() => { setActiveTab('avatar'); fileInputRef.current?.click(); }}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{
                background: '#006d5b',
                boxShadow: '0 2px 8px rgba(0, 109, 91, 0.3)',
              }}
              aria-label="Alterar foto"
            >
              <ImagePlus className="w-5 h-5 text-white" />
            </button>
          </div>

          <h2
            className="text-2xl font-bold text-center mb-2"
            style={{
              color: '#1a1a1a',
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            {formData.username || 'Seu nome'}
          </h2>

          {formData.bio && (
            <p
              className="text-sm text-center px-4 leading-relaxed"
              style={{ color: '#525252' }}
            >
              {formData.bio}
            </p>
          )}

          <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-xs">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#006d5b' }}>0</div>
              <div className="text-xs uppercase tracking-wider mt-1" style={{ color: '#8a867f' }}>Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#006d5b' }}>0</div>
              <div className="text-xs uppercase tracking-wider mt-1" style={{ color: '#8a867f' }}>Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#006d5b' }}>0</div>
              <div className="text-xs uppercase tracking-wider mt-1" style={{ color: '#8a867f' }}>Selos</div>
            </div>
          </div>
        </div>

        {/* Painel Direito — Formulário */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: '1px solid #e5e2db' }}
          >
            <div>
              <h2
                className="text-xl font-bold"
                style={{
                  color: '#1a1a1a',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                }}
              >
                Editar Perfil
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#8a867f' }}>
                Personalize sua presença no EdRush
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: '#525252',
                  border: '1px solid #e5e2db',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !!usernameError}
                className="save-btn px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: '#006d5b',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(0, 109, 91, 0.15)',
                }}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Salvar
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all ml-2"
                style={{ background: 'transparent', color: '#8a867f' }}
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex px-6 pt-4 gap-2 shrink-0 overflow-x-auto">
            {([
              { key: 'identity', label: 'Identidade', icon: User },
              { key: 'avatar', label: 'Avatar', icon: Smile },
              { key: 'borders', label: 'Bordas', icon: Sparkles },
              { key: 'seals', label: 'Selos', icon: Star },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="tab-pill flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap"
                style={{
                  color: activeTab === key ? '#006d5b' : '#525252',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {actionError && (
              <div
                className="mb-4 p-3 rounded-lg text-sm"
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                }}
              >
                {actionError}
              </div>
            )}

            {activeTab === 'identity' && (
              <div className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#525252' }}>
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                    placeholder="como quer ser chamado?"
                    maxLength={30}
                    className="input-editorial w-full"
                    style={{ color: '#1a1a1a' }}
                  />
                  {usernameError && (
                    <p className="text-xs mt-1.5" style={{ color: '#dc2626' }}>{usernameError}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: '#525252' }}>
                      Bio
                    </label>
                    <span
                      className="text-xs font-mono tabular-nums"
                      style={{
                        color: bioColor,
                        animation: bioLength > 140 ? 'counterPulse 0.3s ease' : 'none',
                      }}
                    >
                      {bioLength}/{BIO_MAX}
                    </span>
                  </div>
                  <textarea
                    value={formData.bio ?? ''}
                    onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value.slice(0, BIO_MAX) }))}
                    placeholder="Conte um pouco sobre sua jornada de estudos..."
                    rows={4}
                    className="input-editorial w-full resize-none"
                    style={{ color: '#1a1a1a' }}
                  />
                  <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: '#e5e2db' }}>
                    <div
                      className="h-full transition-all duration-300 ease-out"
                      style={{
                        width: `${Math.min(bioProgress * 100, 100)}%`,
                        background: bioColor,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#525252' }}>
                    Aniversário
                  </label>
                  <input
                    type="date"
                    value={formData.birthday ?? ''}
                    onChange={(e) => setFormData((p) => ({ ...p, birthday: e.target.value }))}
                    className="input-editorial w-full"
                    style={{ color: '#1a1a1a', colorScheme: 'light' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#525252' }}>
                    Localização
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3">
                    <select
                      value={selectedUf}
                      onChange={(e) => {
                        setSelectedUf(e.target.value);
                        setSelectedCidade('');
                      }}
                      className="input-editorial w-full appearance-none cursor-pointer"
                      style={{ color: '#1a1a1a' }}
                      aria-label="Estado"
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
                      className="input-editorial w-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: '#1a1a1a' }}
                      aria-label="Cidade"
                    >
                      <option value="">
                        {!selectedUf
                          ? 'Selecione o estado primeiro'
                          : isLoadingCidades
                            ? 'Carregando cidades...'
                            : cidades.length === 0
                              ? 'Nenhuma cidade disponível'
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
                  </div>
                  {cidadesError && (
                    <p className="text-xs mt-1.5" style={{ color: '#dc2626' }}>{cidadesError}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'avatar' && (
              <div className="space-y-6 max-w-lg">
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: '#f5f2ed',
                    border: '1px solid #e5e2db',
                  }}
                >
                  <h3 className="text-sm font-bold mb-2" style={{ color: '#1a1a1a' }}>
                    Sua foto, seu estilo
                  </h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: '#525252' }}>
                    Envie uma foto própria (JPG, PNG ou WebP, até 5 MB) ou escolha um avatar da coleção.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all"
                      style={{
                        background: '#006d5b',
                        color: 'white',
                      }}
                    >
                      <ImagePlus className="h-3.5 w-3.5" />
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
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all"
                        style={{
                          border: '1px solid #e5e2db',
                          color: '#525252',
                        }}
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
                <p className="text-xs mb-4 leading-relaxed" style={{ color: '#525252' }}>
                  Conquiste bordas estudando todo dia. Bordas equipadas aparecem para você
                  e seus amigos no chat e nos perfis.
                </p>
                <BordersGallery
                  avatarId={formData.avatar}
                  onEquipped={() => onBorderEquipped?.()}
                />
              </div>
            )}

            {activeTab === 'seals' && (
              <SealsGallery onEquipped={onSealsEquipped} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}