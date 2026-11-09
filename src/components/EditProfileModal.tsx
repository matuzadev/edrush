'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { X, Loader2, User, MapPin, Calendar, FileText, Smile, Sparkles, Star, ImagePlus } from 'lucide-react';
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

  // Sincroniza estado interno quando o modal reabrir com novo initialData
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

  // Busca cidades quando UF muda — IBGE garante todos os 5570+ municípios do Brasil
  useEffect(() => {
    if (!selectedUf) {
      setCidades([]);
      setCidadesError(null);
      return;
    }
    // DF: o IBGE retorna só "Brasília", mas o usuário pensa em RAs (Planaltina,
    // Sobradinho, Recanto das Emas, etc.) — usamos a lista oficial das 35 RAs.
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
            <AvatarSelector selectedId={formData.avatar} size="lg" imageUrl={photoPreview} />
          </div>

          {/* Título */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-white leading-tight">Editar Perfil</h2>
            <p className="text-sm text-slate-400 mt-0.5">Personalize seu painel no EdRush</p>
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
            { key: 'borders',  label: 'Bordas',     icon: Sparkles },
            { key: 'seals',    label: 'Selos',      icon: Star },
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
                  maxLength={30}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm transition-all outline-none"
                  style={{
                    background: 'rgba(30,41,59,0.6)',
                    border: usernameError ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = usernameError ? '#f87171' : '#10b981';
                    e.currentTarget.style.boxShadow = usernameError
                      ? '0 0 0 2px rgba(248,113,113,0.15)'
                      : '0 0 0 2px rgba(16,185,129,0.15)';
                  }}
                  onBlur={(e)  => {
                    e.currentTarget.style.borderColor = usernameError ? '#f87171' : 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {usernameError && (
                  <p className="text-xs text-red-400 mt-1.5">{usernameError}</p>
                )}
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

              {/* Location — UF + Cidade (sem texto livre) */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Localização
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2">
                  {/* UF */}
                  <select
                    value={selectedUf}
                    onChange={(e) => {
                      setSelectedUf(e.target.value);
                      setSelectedCidade('');
                    }}
                    className="w-full px-3 py-3 rounded-xl text-white text-sm transition-all outline-none appearance-none cursor-pointer"
                    style={{
                      background: 'rgba(30,41,59,0.6)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      colorScheme: 'dark',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(251,191,36,0.15)'; }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                    aria-label="Estado"
                  >
                    <option value="">UF</option>
                    {BRAZILIAN_STATES.map((uf) => (
                      <option key={uf.sigla} value={uf.sigla}>
                        {uf.sigla} — {uf.nome}
                      </option>
                    ))}
                  </select>

                  {/* Cidade */}
                  <select
                    value={selectedCidade}
                    onChange={(e) => setSelectedCidade(e.target.value)}
                    disabled={!selectedUf || isLoadingCidades}
                    className="w-full px-3 py-3 rounded-xl text-white text-sm transition-all outline-none appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background: 'rgba(30,41,59,0.6)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      colorScheme: 'dark',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(251,191,36,0.15)'; }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
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
                    {/* Mantém a cidade salva visível mesmo se ainda não carregou a lista */}
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
                  <p className="text-xs text-red-400 mt-1.5">{cidadesError}</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'avatar' && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-slate-900/50 to-emerald-500/10 p-4">
                <AvatarSelector selectedId={formData.avatar} size="md" imageUrl={photoPreview} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white">Sua foto, seu estilo</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    Envie uma foto própria (JPG, PNG ou WebP, até 5 MB) ou escolha um avatar da coleção.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-200 transition hover:bg-cyan-400/20"
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
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-rose-400/30 hover:text-rose-300"
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
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
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

        {/* Footer */}
        <div
          className="flex gap-3 px-6 py-5 shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {actionError && (
            <p className="absolute bottom-[5.5rem] left-6 right-6 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {actionError}
            </p>
          )}
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
            disabled={isSaving || !!usernameError}
            className="flex-1 py-3 rounded-xl text-sm font-black text-slate-950 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
