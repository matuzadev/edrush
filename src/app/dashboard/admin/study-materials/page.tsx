// /dashboard/admin/study-materials — painel de moderação dos materiais.
//
// Permite ao admin:
//   - Ver todos os materiais (draft / published / failed / generating)
//   - Disparar geração em batch (todos as combinações concurso × disciplina com questões)
//   - Disparar geração individual
//   - Publicar / despublicar materiais
//   - Ver erros de geração

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { requireAdmin } from '@/lib/admin';
import { listAllMaterials } from '@/lib/study-materials';
import { listGeneratableDisciplines, checkOllamaHealth } from '@/lib/study-material-generator';
import { ChevronLeft, BookOpen, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { StudyMaterialsAdminClient } from './StudyMaterialsAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminStudyMaterialsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!userId) redirect('/auth/login');

  const ok = await requireAdmin(userId, session);
  if (!ok) redirect('/dashboard');

  const [materials, generatable, ollamaHealth] = await Promise.all([
    listAllMaterials(),
    listGeneratableDisciplines().catch(() => []),
    checkOllamaHealth().catch((e) => ({ ok: false, error: e instanceof Error ? e.message : String(e) } as { ok: false; error: string; baseUrl?: string; model?: string })),
  ]);

  const existingKeys = new Set(
    materials.map((m) => `${m.concurso_slug}|${m.disciplina}`),
  );
  const missing = generatable.filter(
    (g) => !existingKeys.has(`${g.concursoSlug}|${g.disciplina}`),
  );

  const counts = {
    total: materials.length,
    published: materials.filter((m) => m.status === 'published').length,
    draft: materials.filter((m) => m.status === 'draft').length,
    failed: materials.filter((m) => m.status === 'failed').length,
    generating: materials.filter((m) => m.status === 'generating').length,
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <nav className="bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-40 px-4 sm:px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="hidden sm:block text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
          >
            EDRUSH
          </Link>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="text-sm text-slate-400 font-medium truncate flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-rose-400" />
            Materiais PDF
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 flex-wrap">
              <BookOpen size={24} className="text-emerald-400" />
              Materiais de estudo
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Geração via IA + revisão humana. Materiais só ficam visíveis para usuários
              depois que você clica em <span className="text-emerald-400 font-bold">Publicar</span>.
            </p>
          </div>
        </header>

        {/* Ollama health */}
        <div
          className="mb-6 px-4 py-3 rounded-2xl flex items-start gap-3"
          style={{
            background: ollamaHealth.ok
              ? 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(16,185,129,0.04))'
              : 'linear-gradient(135deg, rgba(245,158,11,0.10), rgba(245,158,11,0.04))',
            border: ollamaHealth.ok
              ? '1px solid rgba(16,185,129,0.30)'
              : '1px solid rgba(245,158,11,0.30)',
          }}
        >
          {ollamaHealth.ok ? (
            <CheckCircle size={18} className="text-emerald-400 mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={18} className="text-amber-400 mt-0.5 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold ${ollamaHealth.ok ? 'text-emerald-300' : 'text-amber-300'}`}>
              {ollamaHealth.ok
                ? `Ollama conectado · modelo ${ollamaHealth.model}`
                : 'Ollama não disponível'}
            </p>
            {!ollamaHealth.ok && 'error' in ollamaHealth && (
              <p className="text-xs text-amber-200/70 mt-1 font-mono">
                {ollamaHealth.error}
              </p>
            )}
            {!ollamaHealth.ok && (
              <div className="text-xs text-amber-200/70 mt-2 space-y-1">
                <p>1. Instale: <code className="text-amber-200">curl -fsSL https://ollama.com/install.sh | sh</code></p>
                <p>2. Inicie: <code className="text-amber-200">ollama serve</code></p>
                <p>3. Baixe o modelo: <code className="text-amber-200">ollama pull llama3.1:8b</code></p>
                <p>4. (opcional) defina <code className="text-amber-200">OLLAMA_MODEL</code> no .env.local</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Stat label="Total" value={counts.total} color="#94a3b8" />
          <Stat label="Publicados" value={counts.published} color="#10b981" />
          <Stat label="Rascunho" value={counts.draft} color="#f59e0b" />
          <Stat label="Gerando" value={counts.generating} color="#3b82f6" />
          <Stat label="Falharam" value={counts.failed} color="#ef4444" />
        </div>

        <StudyMaterialsAdminClient
          initialMaterials={materials}
          missing={missing}
        />
      </main>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: 'rgba(15,23,42,0.65)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <p className="text-[10px] uppercase tracking-widest font-black" style={{ color }}>
        {label}
      </p>
      <p className="text-2xl font-black text-white mt-1 tabular-nums">{value}</p>
    </div>
  );
}
