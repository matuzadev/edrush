// /dashboard/materiais — lista de materiais (PDFs) por disciplina do concurso do user.
//
// Server component:
//   - Lê selected_concurso_slug do user na sessão (ou banco)
//   - Busca materiais publicados naquele concurso (+ globais)
//   - Renderiza cards com botão "Baixar PDF" ou cadeado por gate de subscription
//   - Materiais ainda não gerados aparecem como "Em breve"

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient } from '@/lib/db';
import { listMaterialsByConcurso, userCanDownload } from '@/lib/study-materials';
import { BookOpen, ChevronLeft, Download, Lock, FileText, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface UserInfo {
  selected_concurso_slug: string | null;
  selected_areas: string | null;
  subscription_status: string | null;
  is_admin: number | null;
}

interface ConcursoInfo {
  titulo: string;
  banca: string | null;
}

async function loadUserInfo(userId: string): Promise<UserInfo | null> {
  const rs = await lsClient.execute({
    sql: `SELECT selected_concurso_slug, selected_areas, subscription_status, is_admin
          FROM users WHERE id = ? LIMIT 1`,
    args: [userId],
  });
  if (rs.rows.length === 0) return null;
  return rs.rows[0] as unknown as UserInfo;
}

async function loadConcurso(slug: string): Promise<ConcursoInfo | null> {
  const rs = await lsClient.execute({
    sql: 'SELECT titulo, banca FROM concursos WHERE slug = ? LIMIT 1',
    args: [slug],
  });
  if (rs.rows.length === 0) return null;
  return rs.rows[0] as unknown as ConcursoInfo;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—';
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(0)} KB`;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default async function MateriaisPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!userId) {
    redirect('/auth/login');
  }

  const user = await loadUserInfo(userId);
  if (!user || !user.selected_concurso_slug) {
    redirect('/onboarding/select-concurso');
  }

  const concursoSlug = user.selected_concurso_slug;
  const [concurso, materials, accessCheck] = await Promise.all([
    loadConcurso(concursoSlug),
    listMaterialsByConcurso(concursoSlug),
    userCanDownload(userId),
  ]);

  const isLocked = !accessCheck.allowed;

  // Áreas selecionadas pelo usuário no onboarding (string JSON)
  let userAreas: string[] = [];
  if (user.selected_areas) {
    try {
      const parsed = JSON.parse(user.selected_areas);
      if (Array.isArray(parsed)) userAreas = parsed.filter((x): x is string => typeof x === 'string');
    } catch { /* ignora */ }
  }

  const published = materials.filter((m) => m.status === 'published');
  const publishedSet = new Set(published.map((m) => m.disciplina));

  // Disciplinas "esperadas" = áreas escolhidas no onboarding (placeholder pra futuro)
  const expectedDisciplinas = userAreas.filter((a) => !publishedSet.has(a));

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <nav className="bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-40 px-4 sm:px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/dashboard/${concursoSlug}`} className="text-slate-400 hover:text-white transition shrink-0">
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
            <BookOpen size={14} className="text-emerald-400" />
            Materiais de estudo
          </span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Materiais completos por disciplina
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            PDFs detalhados focados em <span className="text-emerald-400 font-semibold">{concurso?.titulo ?? concursoSlug}</span>.
            Baixe e estude no seu ritmo — depois treine no Active Recall.
          </p>
        </header>

        {isLocked && (
          <div
            className="mb-6 px-5 py-4 rounded-2xl flex items-start gap-3"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.10), rgba(245,158,11,0.04))',
              border: '1px solid rgba(245,158,11,0.30)',
            }}
          >
            <Lock size={18} className="text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-300">
                Materiais completos disponíveis no EdRush Premium
              </p>
              <p className="text-xs text-amber-200/70 mt-1">
                Faça upgrade pra desbloquear todos os PDFs por disciplina, atualizados continuamente.
              </p>
              <Link
                href="/assinar"
                className="inline-flex mt-3 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-amber-50"
                style={{
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  boxShadow: '0 0 16px rgba(245,158,11,0.40)',
                }}
              >
                Ver planos →
              </Link>
            </div>
          </div>
        )}

        {published.length === 0 && expectedDisciplinas.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {published.map((m) => (
              <MaterialCard
                key={m.id}
                disciplina={m.disciplina}
                concursoSlug={m.concurso_slug}
                pageCount={m.page_count}
                fileSize={m.file_size}
                publishedAt={m.published_at}
                locked={isLocked}
              />
            ))}
            {expectedDisciplinas.map((d) => (
              <PendingCard key={d} disciplina={d} />
            ))}
          </div>
        )}

        <footer className="mt-12 text-center">
          <p className="text-xs text-slate-500">
            Material gerado com curadoria e revisão. Atualizado conforme novos editais.
          </p>
        </footer>
      </main>
    </div>
  );
}

function MaterialCard({
  disciplina,
  concursoSlug,
  pageCount,
  fileSize,
  publishedAt,
  locked,
}: {
  disciplina: string;
  concursoSlug: string;
  pageCount: number | null;
  fileSize: number | null;
  publishedAt: string | null;
  locked: boolean;
}) {
  const encoded = encodeURIComponent(disciplina);
  return (
    <div
      className="relative rounded-2xl p-5 group transition"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.40))',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md"
              style={{
                background: 'rgba(16,185,129,0.15)',
                color: '#6ee7b7',
                border: '1px solid rgba(16,185,129,0.30)',
              }}
            >
              Material PDF
            </span>
            {publishedAt && (
              <span className="text-[10px] text-slate-500">
                Atualizado em {formatDate(publishedAt)}
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-white leading-tight">{disciplina}</h3>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(16,185,129,0.10)',
            border: '1px solid rgba(16,185,129,0.30)',
          }}
        >
          <FileText size={20} className="text-emerald-400" />
        </div>
      </div>

      <div className="text-xs text-slate-400 mb-4 flex items-center gap-2 flex-wrap">
        {pageCount && (
          <>
            <span>
              <span className="text-slate-200 font-bold">{pageCount}</span> páginas
            </span>
            <span className="text-slate-700">·</span>
          </>
        )}
        <span>{formatFileSize(fileSize)}</span>
      </div>

      {locked ? (
        <button
          disabled
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold cursor-not-allowed"
          style={{
            background: 'rgba(15,23,42,0.60)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: '#64748b',
          }}
        >
          <Lock size={16} />
          Disponível no EdRush Premium
        </button>
      ) : (
        <a
          href={`/api/study-materials/${concursoSlug}/${encoded}/download`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white transition"
          style={{
            background: 'linear-gradient(135deg, #059669, #047857)',
            boxShadow: '0 0 16px rgba(16,185,129,0.30)',
          }}
        >
          <Download size={16} />
          Baixar PDF completo
        </a>
      )}
    </div>
  );
}

function PendingCard({ disciplina }: { disciplina: string }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.60), rgba(15,23,42,0.30))',
        border: '1px dashed rgba(255,255,255,0.10)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-2 inline-block"
                style={{
                  background: 'rgba(100,116,139,0.10)',
                  color: '#94a3b8',
                  border: '1px solid rgba(100,116,139,0.20)',
                }}
          >
            Em preparação
          </span>
          <h3 className="text-lg font-bold text-slate-300 leading-tight">{disciplina}</h3>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(100,116,139,0.08)',
            border: '1px solid rgba(100,116,139,0.20)',
          }}
        >
          <Clock size={20} className="text-slate-500" />
        </div>
      </div>
      <p className="text-xs text-slate-500">
        O material desta disciplina está sendo preparado.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="text-center py-16 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.40))',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: 'rgba(16,185,129,0.10)',
          border: '1px solid rgba(16,185,129,0.30)',
        }}
      >
        <FileText size={28} className="text-emerald-400" />
      </div>
      <p className="text-base font-black text-white">
        Nenhum material publicado ainda para este concurso.
      </p>
      <p className="text-sm text-slate-500 mt-1">
        Os PDFs aparecerão aqui assim que forem revisados.
      </p>
    </div>
  );
}
