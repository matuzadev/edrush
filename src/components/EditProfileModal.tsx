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

  const bioColor = bioLength > BIO_MAX ? '#FF4D00' : bioLength > 140 ? '#E6FF00' : '#FFFFFF';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6"
      style={{
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(4px)'
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Editar Perfil"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap');

        @keyframes modalSlideIn {
          from { opacity: 0; transform: translate(16px, 16px) scale(0.98); }
          to { opacity: 1; transform: translate(0, 0) scale(1); }
        }

        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono-custom { font-family: 'JetBrains Mono', monospace; }

        .brutal-input {
          background: transparent;
          border: 2px solid #333333;
          border-radius: 0px;
          padding: 12px 16px;
          color: #FFFFFF;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          transition: all 0.15s ease;
          outline: none;
          width: 100%;
        }
        .brutal-input:focus {
          border-color: #FF4D00;
          background: rgba(255, 77, 0, 0.05);
        }
        .brutal-input::placeholder {
          color: #666666;
        }

        .brutal-btn {
          border: 2px solid #FFFFFF;
          background: transparent;
          color: #FFFFFF;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 12px 24px;
          border-radius: 0px;
          box-shadow: 4px 4px 0px 0px #FFFFFF;
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .brutal-btn:hover:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px 0px #FFFFFF;
          background: #FFFFFF;
          color: #0A0A0A;
        }
        .brutal-btn:active:not(:disabled) {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0px 0px #FFFFFF;
        }
        .brutal-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: 2px 2px 0px 0px #333333;
          border-color: #333333;
          color: #666666;
        }

        .brutal-btn-primary {
          background: #FF4D00;
          border-color: #FF4D00;
          color: #0A0A0A;
          box-shadow: 4px 4px 0px 0px #E6FF00;
        }
        .brutal-btn-primary:hover:not(:disabled) {
          background: #E6FF00;
          border-color: #E6FF00;
          color: #0A0A0A;
          box-shadow: 2px 2px 0px 0px #FF4D00;
          transform: translate(2px, 2px);
        }
        .brutal-btn-primary:active:not(:disabled) {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0px 0px #FF4D00;
        }

        .tab-zine {
          border: 2px solid #333333;
          background: transparent;
          color: #666666;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 8px 16px;
          border-radius: 0px;
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .tab-zine:hover {
          border-color: #FFFFFF;
          color: #FFFFFF;
        }
        .tab-zine.active {
          background: #FF4D00;
          border-color: #FF4D00;
          color: #0A0A0A;
          box-shadow: 3px 3px 0px 0px #E6FF00;
        }

        .brutal-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23FF4D00' stroke-width='3' stroke-linecap='square' stroke-linejoin='miter'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }

        @media (prefers-reduced-motion: reduce) {
          .brutal-btn, .brutal-btn-primary, .tab-zine, .brutal-input {
            transition: none;
          }
          @keyframes modalSlideIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        }
      `}</style>

      <div
        className="relative w-full max-w-6xl max-h-[95vh] flex flex-col lg:flex-row overflow-hidden"
        style={{
          background: '#0A0A0A',
          border: '2px solid #FFFFFF',
          boxShadow: '8px 8px 0px 0px #FF4D00',
          animation: 'modalSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Painel Esquerdo — Avatar e Stats (Assimétrico) */}
        <div
          className="hidden lg:flex lg:w-96 flex-col p-8 relative"
          style={{
            borderRight: '2px solid #333333',
            background: 'linear-gradient(180deg, #0A0A0A 0%, #111111 100%)',
          }}
        >
          {/* Elemento decorativo de canto */}
          <div className="absolute top-0 left-0 w-16 h-16 border-r-2 border-b-2 border-[#E6FF00]" />

          {/* Avatar Gigante */}
          <div className="relative mb-8 group">
            <div
              className="w-48 h-48 mx-auto relative"
              style={{
                border: '4px solid #E6FF00',
                boxShadow: '6px 6px 0px 0px #FF4D00',
                transition: 'transform 0.2s ease',
              }}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#111111]">
                  <User className="w-20 h-20 text-[#333333]" />
                </div>
              )}
            </div>

            {/* Botão de upload sobreposto */}
            <button
              onClick={() => { setActiveTab('avatar'); fileInputRef.current?.click(); }}
              className="absolute -bottom-4 -right-4 w-12 h-12 flex items-center justify-center border-2 border-[#FFFFFF] bg-[#0A0A0A] hover:bg-[#FF4D00] hover:border-[#FF4D00] transition-all"
              style={{ boxShadow: '3px 3px 0px 0px #E6FF00' }}
              aria-label="Alterar foto"
            >
              <ImagePlus className="w-5 h-5 text-[#FFFFFF] group-hover:text-[#0A0A0A]" />
            </button>
          </div>

          {/* Preview de Dados */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-[#FFFFFF] uppercase tracking-tighter leading-none mb-2">
                {formData.username || 'SEU NOME'}
              </h2>
              {formData.bio && (
                <p className="font-mono-custom text-sm text-[#999999] leading-relaxed border-l-2 border-[#FF4D00] pl-3">
                  {formData.bio}
                </p>
              )}
            </div>

            {/* Stats em estilo terminal */}
            <div className="grid grid-cols-3 gap-0 border-t-2 border-b-2 border-[#333333] py-4">
              <div className="text-center border-r border-[#333333]">
                <div className="font-display text-2xl font-bold text-[#E6FF00]">0</div>
                <div className="font-mono-custom text-[10px] uppercase text-[#666666] mt-1">Posts</div>
              </div>
              <div className="text-center border-r border-[#333333]">
                <div className="font-display text-2xl font-bold text-[#E6FF00]">0</div>
                <div className="font-mono-custom text-[10px] uppercase text-[#666666] mt-1">Seg.</div>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-[#E6FF00]">0</div>
                <div className="font-mono-custom text-[10px] uppercase text-[#666666] mt-1">Selos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Painel Direito — Formulário */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b-2 border-[#333333]">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#FFFFFF] uppercase tracking-tight">
                Editar Perfil
              </h2>
              <p className="font-mono-custom text-xs text-[#666666] mt-1">
                // PERSONALIZE SUA PRESENÇA NO SYSTEMA
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center border-2 border-[#333333] hover:border-[#FF4D00] hover:text-[#FF4D00] transition-all"
              style={{ borderRadius: '0px' }}
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs Zine */}
          <div className="flex px-6 pt-6 gap-3 overflow-x-auto border-b-2 border-[#333333] pb-0">
            {([
              { key: 'identity', label: '01. Identidade', icon: User },
              { key: 'avatar', label: '02. Avatar', icon: Smile },
              { key: 'borders', label: '03. Bordas', icon: Sparkles },
              { key: 'seals', label: '04. Selos', icon: Star },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`tab-zine flex items-center gap-2 whitespace-nowrap ${activeTab === key ? 'active' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Conteúdo Scrollável */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {actionError && (
              <div
                className="mb-6 p-4 border-2 border-[#FF4D00] font-mono-custom text-sm"
                style={{
                  background: 'rgba(255, 77, 0, 0.1)',
                  color: '#FF4D00',
                }}
              >
                [ERRO] {actionError}
              </div>
            )}

            {activeTab === 'identity' && (
              <div className="space-y-6 max-w-xl">
                {/* Username */}
                <div>
                  <label className="block font-mono-custom text-xs font-bold uppercase text-[#E6FF00] mb-2 tracking-wider">
                    Nome de Usuário <span className="text-[#666666]">// 2-30 chars</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                    placeholder="COMO QUER SER CHAMADO?"
                    maxLength={30}
                    className="brutal-input uppercase"
                  />
                  {usernameError && (
                    <p className="font-mono-custom text-xs text-[#FF4D00] mt-2">[!] {usernameError}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-mono-custom text-xs font-bold uppercase text-[#E6FF00] tracking-wider">
                      Bio
                    </label>
                    <span
                      className="font-mono-custom text-xs font-bold"
                      style={{ color: bioColor }}
                    >
                      {bioLength}/{BIO_MAX}
                    </span>
                  </div>
                  <textarea
                    value={formData.bio ?? ''}
                    onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value.slice(0, BIO_MAX) }))}
                    placeholder="CONTE UM POUCO SOBRE SUA JORNADA..."
                    rows={4}
                    className="brutal-input resize-none"
                  />
                  {/* Barra de progresso brutalista */}
                  <div className="mt-2 h-2 bg-[#111111] border border-[#333333]">
                    <div
                      className="h-full transition-all duration-200"
                      style={{
                        width: `${Math.min((bioLength / BIO_MAX) * 100, 100)}%`,
                        background: bioColor,
                      }}
                    />
                  </div>
                </div>

                {/* Aniversário e Localização em Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono-custom text-xs font-bold uppercase text-[#E6FF00] mb-2 tracking-wider">
                      Aniversário
                    </label>
                    <input
                      type="date"
                      value={formData.birthday ?? ''}
                      onChange={(e) => setFormData((p) => ({ ...p, birthday: e.target.value }))}
                      className="brutal-input brutal-select"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>

                  <div>
                    <label className="block font-mono-custom text-xs font-bold uppercase text-[#E6FF00] mb-2 tracking-wider">
                      Localização
                    </label>
                    <select
                      value={selectedUf}
                      onChange={(e) => {
                        setSelectedUf(e.target.value);
                        setSelectedCidade('');
                      }}
                      className="brutal-input brutal-select mb-3"
                      aria-label="Estado"
                    >
                      <option value="">SELECIONE O ESTADO</option>
                      {BRAZILIAN_STATES.map((uf) => (
                        <option key={uf.sigla} value={uf.sigla} className="bg-[#0A0A0A] text-[#FFFFFF]">
                          {uf.sigla} — {uf.nome}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedCidade}
                      onChange={(e) => setSelectedCidade(e.target.value)}
                      disabled={!selectedUf || isLoadingCidades}
                      className="brutal-input brutal-select disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Cidade"
                    >
                      <option value="">
                        {!selectedUf
                          ? 'PRIMEIRO O ESTADO'
                          : isLoadingCidades
                            ? 'CARREGANDO...'
                            : cidades.length === 0
                              ? 'INDISPONÍVEL'
                              : 'SELECIONE A CIDADE'}
                      </option>
                      {selectedCidade && !cidades.includes(selectedCidade) && (
                        <option value={selectedCidade} className="bg-[#0A0A0A] text-[#FFFFFF]">{selectedCidade}</option>
                      )}
                      {cidades.map((nome) => (
                        <option key={nome} value={nome} className="bg-[#0A0A0A] text-[#FFFFFF]">
                          {nome}
                        </option>
                      ))}
                    </select>
                    {cidadesError && (
                      <p className="font-mono-custom text-xs text-[#FF4D00] mt-2">[!] {cidadesError}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'avatar' && (
              <div className="space-y-6 max-w-xl">
                <div
                  className="p-6 border-2 border-[#333333]"
                  style={{ background: '#111111' }}
                >
                  <h3 className="font-display text-lg font-bold text-[#FFFFFF] uppercase mb-2">
                    Sua Foto, Seu Estilo
                  </h3>
                  <p className="font-mono-custom text-xs text-[#666666] leading-relaxed mb-4">
                    // ENVIE UMA FOTO PRÓPRIA (JPG, PNG OU WEBP, ATÉ 5 MB) OU ESCOLHA UM AVATAR DA COLEÇÃO.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="brutal-btn brutal-btn-primary flex items-center gap-2 text-sm"
                    >
                      <ImagePlus className="w-4 h-4" />
                      ENVIAR FOTO
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
                        className="brutal-btn flex items-center gap-2 text-sm"
                      >
                        USAR AVATAR EdRUSH
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
                        setActionError('FORMATO INVÁLIDO. USE JPG, PNG OU WEBP.');
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        setActionError('TAMANHO EXCEDIDO. MÁXIMO 5 MB.');
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
                <p className="font-mono-custom text-xs text-[#666666] mb-6 leading-relaxed">
                  // CONQUISTE BORDAS ESTUDANDO TODO DIA. BORDAS EQUIPADAS APARECEM PARA VOCÊ E SEUS AMIGOS NO CHAT E NOS PERFIS.
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

          {/* Footer com Ações */}
          <div className="flex items-center justify-end gap-4 px-6 py-5 border-t-2 border-[#333333] bg-[#0A0A0A]">
            <button
              onClick={onClose}
              className="brutal-btn text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !!usernameError}
              className="brutal-btn brutal-btn-primary text-sm flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  SALVANDO...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  SALVAR ALTERAÇÕES
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}