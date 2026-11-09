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

  const bioProgress = bioLength / BIO_MAX;
  const bioColor = bioLength > BIO_MAX ? '#f87171' : bioLength > 140 ? '#fbbf24' : '#10b981';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6"
      style={{
        background: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(12px)'
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Editar Perfil"
    >
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .glass-card {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 20px 60px -12px rgba(0, 0, 0, 0.5);
        }
        .glass-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
        }
        .text-gradient {
          background: linear-gradient(135deg, #10b981, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn-gradient {
          background: linear-gradient(135deg, #10b981, #06b6d4);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .input-modern {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .input-modern:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.15);
          background: rgba(255, 255, 255, 0.05);
        }
        .hover-lift {
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        .badge-neon-emerald {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34d399;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
        }
        .divider-gradient {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), rgba(6, 182, 212, 0.5), transparent);
        }
      `}</style>

      <div
        className="relative w-full max-w-5xl max-h-[95vh] flex flex-col lg:flex-row overflow-hidden rounded-[20px] glass-card animate-scale-in"
      >
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px]">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Painel Esquerdo — Preview do Perfil */}
        <div className="hidden lg:flex lg:w-80 xl:w-96 flex-col p-8 relative z-10 border-r border-white/5">
          <div className="absolute top-0 left-0 right-0 h-px divider-gradient" />

          <div className="flex-1 flex flex-col items-center text-center space-y-6">
            {/* Avatar com glow */}
            <div
              className="relative group cursor-pointer animate-float"
              onClick={() => { setActiveTab('avatar'); fileInputRef.current?.click(); }}
            >
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-slate-600" />
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-all">
                <ImagePlus className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Dados do Preview */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gradient">
                {formData.username || 'Seu Nome'}
              </h2>
              {formData.bio && (
                <p className="text-sm text-slate-400 italic px-4 leading-relaxed">
                  "{formData.bio}"
                </p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="w-full grid grid-cols-3 gap-3 pt-4">
              {[
                { label: 'Posts', value: '0' },
                { label: 'Seguidores', value: '0' },
                { label: 'Selos', value: '0' },
              ].map((stat) => (
                <div key={stat.label} className="glass-card rounded-xl p-3 text-center hover-lift">
                  <div className="text-lg font-bold text-gradient">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Painel Direito — Formulário */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <div>
              <h2 className="text-xl font-bold text-gradient">Editar Perfil</h2>
              <p className="text-xs text-slate-500 font-mono tracking-widest mt-1">
                // PERSONALIZE SUA PRESENÇA NO EDRUSH
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 hover-lift transition-all"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-6 pt-4 gap-2 overflow-x-auto border-b border-white/5 pb-0">
            {([
              { key: 'identity', label: 'Identidade', icon: User },
              { key: 'avatar', label: 'Avatar', icon: Smile },
              { key: 'borders', label: 'Bordas', icon: Sparkles },
              { key: 'seals', label: 'Selos', icon: Star },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-250 ${
                  activeTab === key
                    ? 'badge-neon-emerald'
                    : 'border border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Conteúdo Scrollável */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {actionError && (
              <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
                <X className="w-4 h-4" />
                {actionError}
              </div>
            )}

            {activeTab === 'identity' && (
              <div className="space-y-6 max-w-lg animate-scale-in">
                {/* Username */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-emerald-400/80 mb-2">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                    placeholder="como quer ser chamado?"
                    maxLength={30}
                    className="input-modern w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none"
                  />
                  {usernameError && (
                    <p className="text-xs text-red-400 mt-2">{usernameError}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-emerald-400/80">
                      Bio
                    </label>
                    <span className="text-xs font-mono tabular-nums" style={{ color: bioColor }}>
                      {bioLength}/{BIO_MAX}
                    </span>
                  </div>
                  <textarea
                    value={formData.bio ?? ''}
                    onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value.slice(0, BIO_MAX) }))}
                    placeholder="Conte um pouco sobre sua jornada de estudos..."
                    rows={4}
                    className="input-modern w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none resize-none"
                  />
                  <div className="mt-2 h-1 rounded-full overflow-hidden bg-white/5">
                    <div
                      className="h-full transition-all duration-300 ease-out"
                      style={{
                        width: `${Math.min(bioProgress * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                      }}
                    />
                  </div>
                </div>

                {/* Aniversário e Localização */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-emerald-400/80 mb-2">
                      Aniversário
                    </label>
                    <input
                      type="date"
                      value={formData.birthday ?? ''}
                      onChange={(e) => setFormData((p) => ({ ...p, birthday: e.target.value }))}
                      className="input-modern w-full px-4 py-3 rounded-xl text-white outline-none"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-emerald-400/80 mb-2">
                      Localização
                    </label>
                    <select
                      value={selectedUf}
                      onChange={(e) => {
                        setSelectedUf(e.target.value);
                        setSelectedCidade('');
                      }}
                      className="input-modern w-full px-4 py-3 rounded-xl text-white outline-none appearance-none cursor-pointer mb-3"
                      style={{ colorScheme: 'dark' }}
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
                      className="input-modern w-full px-4 py-3 rounded-xl text-white outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ colorScheme: 'dark' }}
                      aria-label="Cidade"
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
                      <p className="text-xs text-red-400 mt-2">{cidadesError}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'avatar' && (
              <div className="space-y-6 max-w-lg animate-scale-in">
                <div className="glass-card rounded-xl p-5 border border-white/5">
                  <h3 className="text-sm font-bold text-white mb-2">Sua foto, seu estilo</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Envie uma foto própria (JPG, PNG ou WebP, até 5 MB) ou escolha um avatar da coleção.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-gradient px-4 py-2 rounded-lg text-sm font-bold text-slate-950 flex items-center gap-2 hover-lift"
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
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 transition-all hover-lift"
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
              <div className="animate-scale-in">
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Conquiste bordas estudando todo dia. Bordas equipadas aparecem para você e seus amigos no chat e nos perfis.
                </p>
                <BordersGallery
                  avatarId={formData.avatar}
                  onEquipped={() => onBorderEquipped?.()}
                />
              </div>
            )}

            {activeTab === 'seals' && (
              <div className="animate-scale-in">
                <SealsGallery onEquipped={onSealsEquipped} />
              </div>
            )}
          </div>

          {/* Footer com Ações */}
          <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-white/5 bg-slate-900/50">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 transition-all hover-lift"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !!usernameError}
              className="btn-gradient px-6 py-3 rounded-xl text-sm font-bold text-slate-950 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
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
    </div>
  );
}