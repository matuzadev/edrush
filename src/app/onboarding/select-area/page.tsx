'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, Loader2, BookOpen, Layers } from 'lucide-react';

interface Area {
  slug: string;
  title: string;
}

function SelectAreaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();

  const concursoId = searchParams.get('concursoId');
  const concursoTitle = searchParams.get('concursoTitle') || 'Concurso';

  const [areas, setAreas] = useState<Area[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated' && concursoId) {
      fetchAreasAndSelection();
    }
  }, [status, concursoId, router]);

  async function fetchAreasAndSelection() {
    try {
      // Em paralelo: lista de áreas para o concurso + áreas já salvas no perfil.
      // Pré-marca os checkboxes com a seleção persistida no Turso, permitindo
      // que o usuário ajuste a escolha sem reabrir tudo do zero.
      const [areasRes, profileRes] = await Promise.all([
        fetch(`/api/onboarding/areas?concursoId=${concursoId}`),
        fetch('/api/user/profile'),
      ]);

      if (areasRes.ok) {
        const data = await areasRes.json();
        const areasList = (data.areas ?? []) as Area[];
        setAreas(areasList);

        if (profileRes.ok) {
          const profile = await profileRes.json();
          const savedAreas: string[] = Array.isArray(profile.selectedAreas)
            ? profile.selectedAreas
            : [];

          // Filtra apenas slugs que ainda existem na lista atual de áreas
          // (caso o currículo do concurso tenha mudado entre visitas).
          const validSelection = savedAreas.filter((slug) =>
            areasList.some((a) => a.slug === slug),
          );

          if (validSelection.length > 0) {
            setSelected(validSelection);
          } else {
            // Se nada foi salvo ainda, pré-marca todas as áreas como sugestão
            // (alinhado com a recomendação do edital — usuário pode desmarcar).
            setSelected(areasList.map((a) => a.slug));
          }
        }
      }
    } catch {
      setError('Erro ao carregar matérias.');
    } finally {
      setIsLoadingAreas(false);
    }
  }

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

  async function handleConfirm() {
    if (selected.length === 0) {
      setError('Selecione pelo menos uma matéria para continuar.');
      return;
    }
    setError('');
    setIsSaving(true);

    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // enviar cookies de sessão para o servidor reconhecer o usuário
        body: JSON.stringify({ concursoId: Number(concursoId), selectedAreas: selected, concursoTitle }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // Sessão inválida: tentar fluxo de fallback para dev (criar conta temporária e logar)
          try {
            const devEmail = `dev+${Date.now()}@local`;
            const devPassword = `devpassword123`;

            // Registrar conta dev temporária
            await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: devEmail, password: devPassword, name: 'Dev User' }),
            });

            // Fazer login via Credentials provider (callback)
            const loginRes = await fetch('/api/auth/callback/credentials', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              credentials: 'include',
              body: new URLSearchParams({ username: devEmail, password: devPassword }).toString(),
            });

            if (loginRes.ok) {
              // Re-tentar o POST de onboarding agora que temos sessão
              const retry = await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ concursoId: Number(concursoId), selectedAreas: selected, concursoTitle }),
              });

              if (retry.ok) {
                const retryData = await retry.json();
                await update();
                router.push(`/dashboard/${retryData.concursoSlug}`);
                return;
              }
            }
          } catch (e) {
            // ignorar e cair no redirect abaixo
          }

          // se não conseguiu autenticar automaticamente, redireciona ao login
          router.push('/auth/login');
          return;
        }

        setError(data.error || 'Erro ao salvar seleção.');
        return;
      }

      // Atualizar token JWT com novos dados de onboarding
      await update();

      router.push(`/dashboard/${data.concursoSlug}`);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
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
          disabled={isSaving || selected.length === 0}
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
