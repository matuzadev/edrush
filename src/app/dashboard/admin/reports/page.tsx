import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { requireAdmin } from '@/lib/admin';
import { lsClient } from '@/lib/db';
import { CheckCircle, ChevronLeft, Flag, ShieldAlert } from 'lucide-react';
import { AdminReportCard, type AdminReport } from '@/components/admin/AdminReportCard';
import { ReportsListClient } from './ReportsListClient';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = new Set(['pending', 'resolved', 'dismissed']);
const TRUNCATE_LEN = 300;

function getClient() {
  return lsClient;
}

interface ReportRow {
  id: string;
  reporter_id: string;
  target_id: string;
  target_type: string;
  reason: string;
  status: string;
  created_at: string;
}

interface ReporterRow {
  id: string;
  nome: string | null;
  username: string | null;
}

interface PostRow {
  id: string;
  user_id: string;
  content: string;
  likes_count: number | null;
  comments_count: number | null;
  deleted_at: string | null;
  author_nome: string | null;
  author_username: string | null;
  author_avatar_id: number | null;
}

interface CommentRow {
  id: string;
  user_id: string;
  content: string;
  likes_count: number | null;
  deleted_at: string | null;
  author_nome: string | null;
  author_username: string | null;
  author_avatar_id: number | null;
}

function truncate(s: string | null | undefined, len = TRUNCATE_LEN): string {
  if (!s) return '';
  if (s.length <= len) return s;
  return s.slice(0, len) + '…';
}

async function loadReports(status: string): Promise<{
  reports: AdminReport[];
  pendingCount: number;
  ready: boolean;
}> {
  const client = getClient();

  let pendingCount = 0;
  try {
    const countRs = await client.execute({
      sql: `SELECT COUNT(*) AS n FROM reports WHERE status = 'pending'`,
      args: [],
    });
    pendingCount = Number((countRs.rows[0] as unknown as { n: number })?.n ?? 0);
  } catch {
    // Tabela ainda não existe — retorna estado "vazio".
    return { reports: [], pendingCount: 0, ready: false };
  }

  let reportsRows: ReportRow[] = [];
  try {
    const rs = await client.execute({
      sql: `SELECT id, reporter_id, target_id, target_type, reason, status, created_at
            FROM reports WHERE status = ?
            ORDER BY created_at DESC LIMIT 50`,
      args: [status],
    });
    reportsRows = rs.rows as unknown as ReportRow[];
  } catch {
    return { reports: [], pendingCount, ready: false };
  }

  if (reportsRows.length === 0) {
    return { reports: [], pendingCount, ready: true };
  }

  const reporterIds = Array.from(new Set(reportsRows.map((r) => r.reporter_id)));
  const postIds = Array.from(
    new Set(reportsRows.filter((r) => r.target_type === 'post').map((r) => r.target_id))
  );
  const commentIds = Array.from(
    new Set(reportsRows.filter((r) => r.target_type === 'comment').map((r) => r.target_id))
  );

  const reportersById = new Map<string, ReporterRow>();
  if (reporterIds.length > 0) {
    const placeholders = reporterIds.map(() => '?').join(',');
    try {
      const rs = await client.execute({
        sql: `SELECT id, nome, username FROM users WHERE id IN (${placeholders})`,
        args: reporterIds,
      });
      for (const row of rs.rows as unknown as ReporterRow[]) {
        reportersById.set(row.id, row);
      }
    } catch {
      // ignora
    }
  }

  const postsById = new Map<string, PostRow>();
  if (postIds.length > 0) {
    const placeholders = postIds.map(() => '?').join(',');
    try {
      const rs = await client.execute({
        sql: `SELECT p.id, p.user_id, p.content, p.likes_count, p.comments_count, p.deleted_at,
                     u.nome AS author_nome, u.username AS author_username, u.avatar_id AS author_avatar_id
              FROM posts p
              LEFT JOIN users u ON u.id = p.user_id
              WHERE p.id IN (${placeholders})`,
        args: postIds,
      });
      for (const row of rs.rows as unknown as PostRow[]) {
        postsById.set(row.id, row);
      }
    } catch {
      // tabela pode não existir ainda
    }
  }

  const commentsById = new Map<string, CommentRow>();
  if (commentIds.length > 0) {
    const placeholders = commentIds.map(() => '?').join(',');
    try {
      const rs = await client.execute({
        sql: `SELECT c.id, c.user_id, c.content, c.likes_count, c.deleted_at,
                     u.nome AS author_nome, u.username AS author_username, u.avatar_id AS author_avatar_id
              FROM comments c
              LEFT JOIN users u ON u.id = c.user_id
              WHERE c.id IN (${placeholders})`,
        args: commentIds,
      });
      for (const row of rs.rows as unknown as CommentRow[]) {
        commentsById.set(row.id, row);
      }
    } catch {
      // tabela pode não existir ainda
    }
  }

  const reports: AdminReport[] = reportsRows.map((r) => {
    const reporter = reportersById.get(r.reporter_id);
    let target: AdminReport['target'];
    if (r.target_type === 'post') {
      const p = postsById.get(r.target_id);
      target = p
        ? {
            content: truncate(p.content),
            authorId: p.user_id,
            authorName: p.author_nome,
            authorUsername: p.author_username,
            authorAvatarId: p.author_avatar_id,
            likesCount: Number(p.likes_count ?? 0),
            commentsCount: Number(p.comments_count ?? 0),
            deletedAt: p.deleted_at,
            missing: false,
          }
        : {
            content: '(post não encontrado ou removido)',
            authorId: null,
            authorName: null,
            authorUsername: null,
            authorAvatarId: null,
            likesCount: 0,
            commentsCount: 0,
            deletedAt: null,
            missing: true,
          };
    } else {
      const c = commentsById.get(r.target_id);
      target = c
        ? {
            content: truncate(c.content),
            authorId: c.user_id,
            authorName: c.author_nome,
            authorUsername: c.author_username,
            authorAvatarId: c.author_avatar_id,
            likesCount: Number(c.likes_count ?? 0),
            commentsCount: 0,
            deletedAt: c.deleted_at,
            missing: false,
          }
        : {
            content: '(comentário não encontrado ou removido)',
            authorId: null,
            authorName: null,
            authorUsername: null,
            authorAvatarId: null,
            likesCount: 0,
            commentsCount: 0,
            deletedAt: null,
            missing: true,
          };
    }
    return {
      id: r.id,
      reason: r.reason,
      status: r.status as AdminReport['status'],
      createdAt: r.created_at,
      targetType: r.target_type as AdminReport['targetType'],
      targetId: r.target_id,
      reporter: reporter
        ? {
            id: reporter.id,
            nome: reporter.nome,
            username: reporter.username,
          }
        : { id: r.reporter_id, nome: null, username: null },
      target,
    };
  });

  return { reports, pendingCount, ready: true };
}

const TAB_LABELS: Record<string, string> = {
  pending: 'Pendentes',
  resolved: 'Resolvidas',
  dismissed: 'Dispensadas',
};

export default async function AdminReportsPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  if (!userId) {
    redirect('/auth/login');
  }

  const isAdmin = await requireAdmin(userId, session);
  if (!isAdmin) {
    redirect('/dashboard');
  }

  const sp = await props.searchParams;
  const statusRaw = sp?.status ?? 'pending';
  const status = VALID_STATUSES.has(statusRaw) ? statusRaw : 'pending';

  const { reports, pendingCount, ready } = await loadReports(status);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Top bar */}
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
            Moderação
          </span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <header className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 flex-wrap">
              Moderação
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">Denúncias {TAB_LABELS[status]}</span>
              {pendingCount > 0 && (
                <span
                  className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full text-xs font-black tabular-nums"
                  style={{
                    background: 'linear-gradient(135deg, #f43f5e, #be123c)',
                    color: 'white',
                    boxShadow: '0 0 12px rgba(244,63,94,0.40)',
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Decida remover ou dispensar conteúdo denunciado pela comunidade.
            </p>
          </div>
        </header>

        {/* Tabs */}
        <div
          className="flex items-center gap-1 mb-6 p-1 rounded-xl"
          style={{
            background: 'rgba(15,23,42,0.65)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {(['pending', 'resolved', 'dismissed'] as const).map((tab) => {
            const active = tab === status;
            return (
              <Link
                key={tab}
                href={`/dashboard/admin/reports?status=${tab}`}
                className="flex-1 text-center px-3 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition"
                style={
                  active
                    ? {
                        background:
                          'linear-gradient(135deg, rgba(244,63,94,0.25), rgba(244,63,94,0.10))',
                        color: '#fda4af',
                        border: '1px solid rgba(244,63,94,0.40)',
                        boxShadow: '0 0 12px rgba(244,63,94,0.20)',
                      }
                    : {
                        color: '#94a3b8',
                      }
                }
              >
                {TAB_LABELS[tab]}
                {tab === 'pending' && pendingCount > 0 && (
                  <span
                    className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black tabular-nums"
                    style={{
                      background: active ? 'rgba(244,63,94,0.40)' : 'rgba(244,63,94,0.15)',
                      color: active ? 'white' : '#fda4af',
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Aviso quando a tabela ainda não foi criada pelo outro engenheiro */}
        {!ready && (
          <div
            className="mb-6 px-4 py-3 rounded-2xl flex items-start gap-3"
            style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.30)',
            }}
          >
            <Flag size={16} className="text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-300">
                Tabelas de moderação ainda não disponíveis
              </p>
              <p className="text-xs text-amber-200/70 mt-0.5">
                A tabela <code>reports</code> (e/ou <code>posts</code>/<code>comments</code>) ainda
                está sendo provisionada. Esta página vai começar a popular assim que estiverem
                prontas.
              </p>
            </div>
          </div>
        )}

        {/* Lista / Empty state */}
        {reports.length === 0 ? (
          <EmptyState status={status} ready={ready} />
        ) : (
          <ReportsListClient initialReports={reports} status={status} />
        )}
      </main>
    </div>
  );
}

function EmptyState({ status, ready }: { status: string; ready: boolean }) {
  if (!ready) {
    return null;
  }
  if (status === 'pending') {
    return (
      <div
        className="text-center py-20 rounded-2xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.40))',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: 'rgba(16,185,129,0.10)',
            border: '1px solid rgba(16,185,129,0.30)',
            boxShadow: '0 0 24px rgba(16,185,129,0.20)',
          }}
        >
          <CheckCircle size={32} className="text-emerald-400" />
        </div>
        <p className="text-base font-black text-white">
          Tudo limpo! Nenhuma denúncia pendente.
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Nova denúncia chega aqui automaticamente.
        </p>
      </div>
    );
  }
  return (
    <div
      className="text-center py-20 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.40))',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: 'rgba(100,116,139,0.10)',
          border: '1px solid rgba(100,116,139,0.30)',
        }}
      >
        <Flag size={28} className="text-slate-500" />
      </div>
      <p className="text-base font-black text-white">
        Nenhuma denúncia {status === 'resolved' ? 'resolvida' : 'dispensada'}.
      </p>
      <p className="text-sm text-slate-500 mt-1">
        O histórico aparecerá aqui após decisões de moderação.
      </p>
    </div>
  );
}
