'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, Loader2, BookOpen, Layers } from 'lucide-react';

interface Area {
  slug: string;
  title: string;
}

interface Specialty {
  slug: string;
  title: string;
}

function SelectAreaContent() {
  const router = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const { status, update } = useSession();

  const concursoId = searchParams.get('concursoId');
  const concursoTitle = searchParams.get('concursoTitle') || 'Concurso';

  const [areas, setAreas] = useState<Area[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAreasAndSelection = useCallback(async () => {
    try {
      // Em paralelo: lista de áreas para o concurso + áreas já salvas no perfil.
      // Pré-marca os checkboxes com a seleção persistida no Turso, permitindo
      // que o usuário ajuste a escolha sem reabrir tudo do zero.
      const [areasRes, profileRes] = await Promise.all([
        fetch(`/api/onboarding/areas?concursoId=${concursoId}`),
        fetch('/api/user/profile'),
      ]);

      if (!areasRes.ok) {
        throw new Error('Erro ao carregar matérias.');
      }
      const data = await areasRes.json() as {
        areas?: Area[];
        specialties?: Specialty[];
      };
      const options = data.specialties ?? [];
      setSpecialties(options);

      const profile = profileRes.ok ? await profileRes.json() as {
        selectedAreas?: unknown;
        selectedSpecialty?: unknown;
      } : {};
      const savedSpecialty = typeof profile.selectedSpecialty === 'string'
        ? profile.selectedSpecialty
        : '';
      const initialSpecialty = options.some((option) => option.slug === savedSpecialty)
        ? savedSpecialty
        : '';
      setSelectedSpecialty(initialSpecialty);

      let areasList = data.areas ?? [];
      if (initialSpecialty) {
        const params = new URLSearchParams({ concursoId: concursoId ?? '', specialty: initialSpecialty });
        const specialtyRes = await fetch(`/api/onboarding/areas?${params.toString()}`);
        if (!specialtyRes.ok) throw new Error('Erro ao carregar matérias da especialidade.');
        const specialtyData = await specialtyRes.json() as { areas?: Area[] };
        areasList = specialtyData.areas ?? [];
      }
      setAreas(areasList);

      const savedAreas = Array.isArray(profile.selectedAreas)
        ? profile.selectedAreas.filter((area): area is string => typeof area === 'string')
        : [];
      const validSelection = savedAreas.filter((slug) =>
        areasList.some((area) => area.slug === slug),
      );
      setSelected(validSelection.length > 0 ? validSelection : areasList.map((area) => area.slug));
    } catch {
      setError('Erro ao carregar matérias.');
    } finally {
      setIsLoadingAreas(false);
    }
  }, [concursoId]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated' && concursoId) {
      void Promise.resolve().then(fetchAreasAndSelection);
    }
  }, [status, concursoId, fetchAreasAndSelection, router]);

  function toggleArea(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function selectAll() {
    setSelected(areas.map((a) => a.slug));
  }

  function clearAll() {
    setSelected([]);
  }

  async function handleSpecialtyChange(specialtySlug: string) {
    if (!concursoId) return;
    setIsLoadingAreas(true);
    setError('');
    try {
      const params = new URLSearchParams({ concursoId, specialty: specialtySlug });
      const res = await fetch(`/api/onboarding/areas?${params.toString()}`);
      if (!res.ok) throw new Error('Erro ao carregar matérias da especialidade.');
      const data = await res.json() as { areas?: Area[] };
      const areasList = data.areas ?? [];
      setSelectedSpecialty(specialtySlug);
      setAreas(areasList);
      setSelected(areasList.map((area) => area.slug));
    } catch {
      setError('Não foi possível carregar as matérias dessa especialidade. Tente novamente.');
    } finally {
      setIsLoadingAreas(false);
    }
  }

  async function handleConfirm() {
    if (specialties.length > 0 && !selectedSpecialty) {
      setError('Selecione a especialidade que você vai prestar.');
      return;
    }
    if (selected.length === 0) {
      setError('Selecione pelo menos uma matéria para continuar.');
      return;
    }
    setError('');
    setIsSaving(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20_000);

    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify({
          concursoId: Number(concursoId),
          selectedAreas: selected,
          selectedSpecialty: selectedSpecialty || null,
          concursoTitle,
        }),
      });

      const data: unknown = await res.json();
      const result = typeof data === 'object' && data !== null
        ? data as { error?: string; concursoSlug?: string }
        : {};

      if (!res.ok) {
        if (res.status === 401) {
          const loginUrl = `/auth/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
          window.location.replace(loginUrl);
          return;
        }

        setError(result.error || 'Erro ao salvar seleção.');
        return;
      }

      if (!result.concursoSlug) {
        throw new Error('O servidor não retornou o endereço do painel. Tente novamente.');
      }

      const refreshedSession = await update();
      if (
        !refreshedSession?.user?.onboardingCompleted ||
        refreshedSession.user.concursoSlug !== result.concursoSlug
      ) {
        throw new Error('Sua configuração foi salva, mas a sessão não atualizou. Recarregue a página e tente novamente.');
      }

      window.location.replace(`/dashboard/${encodeURIComponent(result.concursoSlug)}`);
    } catch (error) {
      setError(
        error instanceof DOMException && error.name === 'AbortError'
          ? 'A configuração demorou demais. Verifique sua conexão e tente novamente.'
          : error instanceof Error
            ? error.message
            : 'Erro de conexão. Tente novamente.',
      );
    } finally {
      window.clearTimeout(timeoutId);
      setIsSaving(false);
    }
  }

  if (status === 'loading' || isLoadingAreas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-slate-900 to-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Carregando matérias...</p>
        </div>
      </div>
    );
  }

  if (!concursoId) {
    router.push('/onboarding/select-concurso');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-slate-900 to-[#0f172a] px-4 py-12">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-3/4 h-3/4 bg-emerald-500/5 blur-3xl rounded-full" />
        <div className="absolute -bottom-1/3 -right-1/4 w-2/3 h-2/3 bg-blue-500/5 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <button
          onClick={() => router.push('/onboarding/select-concurso')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm">Voltar</span>
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
            <Layers size={14} className="text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Passo 2 de 2
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Quais{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              matérias
            </span>{' '}
            você quer estudar?
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            Selecionando{' '}
            <span className="text-emerald-400 font-semibold">{concursoTitle}</span>. Escolha as
            disciplinas para personalizar sua trilha de estudos.
          </p>
        </div>

        {specialties.length > 0 && (
          <div className="mb-8 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-5">
            <label htmlFor="concurso-specialty" className="mb-2 block text-sm font-bold text-white">
              Escolha sua especialidade
            </label>
            <select
              id="concurso-specialty"
              value={selectedSpecialty}
              onChange={(event) => void handleSpecialtyChange(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            >
              <option value="">Selecione uma área</option>
              {specialties.map((specialty) => (
                <option key={specialty.slug} value={specialty.slug}>{specialty.title}</option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              A trilha inclui os conhecimentos básicos comuns (21 questões) e o conteúdo da área selecionada
              (49 questões). As matérias específicas e o treino discursivo ficam restritos à sua especialidade.
            </p>
          </div>
        )}

        {/* Controles de seleção */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-400">
            {selected.length} de {areas.length} selecionada{selected.length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-3">
            <button
              onClick={selectAll}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              Selecionar todas
            </button>
            {selected.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Grid de áreas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {areas.map((area) => {
            const isSelected = selected.includes(area.slug);
            return (
              <button
                key={area.slug}
                onClick={() => toggleArea(area.slug)}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left group ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'text-emerald-400'
                      : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                >
                  {isSelected ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </div>
                <span
                  className={`font-medium text-sm transition-colors ${
                    isSelected ? 'text-emerald-300' : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {area.title}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Botão de confirmação */}
        <button
          onClick={handleConfirm}
          disabled={isSaving || isLoadingAreas || selected.length === 0 || (specialties.length > 0 && !selectedSpecialty)}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-40 text-white font-black rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/40 flex items-center justify-center gap-2.5"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Configurando seu painel...</span>
            </>
          ) : (
            <>
              <span>Começar a estudar</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function SelectAreaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-slate-900 to-[#0f172a] flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-400" size={32} />
        </div>
      }
    >
      <SelectAreaContent />
    </Suspense>
  );
}
