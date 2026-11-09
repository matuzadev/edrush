// /dashboard/materiais — lista de materiais (PDFs) por disciplina do concurso do user.
//
// Server component:
//   - Lê selected_concurso_slug do user na sessão (ou banco)
//   - Busca materiais publicados naquele concurso (+ globais)
//   - Renderiza cards com botão "Baixar PDF" para materiais publicados
//   - Materiais ainda não gerados aparecem como "Em breve"

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { lsClient } from '@/lib/db';
import { listMaterialsByConcurso } from '@/lib/study-materials';
import { BookOpen, ChevronLeft, Download, FileText, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface UserInfo {
  selected_concurso_slug: string | null;
  selected_areas: string | null;
}

interface ConcursoInfo {
  titulo: string;
  banca: string | null;
}

async function loadUserInfo(userId: string): Promise<UserInfo | null> {
  const rs = await lsClient.execute({
    sql: `SELECT selected_concurso_slug, selected_areas
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
  const [concurso, materials] = await Promise.all([
    loadConcurso(concursoSlug),
    listMaterialsByConcurso(concursoSlug),
  ]);

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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Navbar inline (server component — sem hooks client-side) */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <Link href={`/dashboard/${concursoSlug}`} className="shrink-0 text-slate-400 transition hover:text-[var(--fg)]">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="text-xl font-bold tracking-tight no-underline shrink-0">
              Ed<span className="text-emerald-500">Rush</span>
            </Link>
            <span className="hidden sm:inline text-slate-600" aria-hidden>·</span>
            <span className="hidden sm:inline-flex text-sm font-medium text-slate-500 truncate items-center gap-1.5">
              <BookOpen size={14} className="text-emerald-500" />
              Materiais de estudo
            </span>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 sm:px-8 py-8 sm:py-10">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Materiais completos por disciplina
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            PDFs detalhados focados em <span className="text-emerald-400 font-semibold">{concurso?.titulo ?? concursoSlug}</span>.
            Baixe e estude no seu ritmo — depois treine no Active Recall.
          </p>
        </header>

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
}: {
  disciplina: string;
  concursoSlug: string;
  pageCount: number | null;
  fileSize: number | null;
  publishedAt: string | null;
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
