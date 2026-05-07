import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TIER_STYLE, MEDAL_CATEGORIES } from '@/lib/levels';
import type { Medal } from '@/lib/levels';
import { ConcursoBadge } from '@/components/ConcursoBadge';

interface ProfileData {
  username: string;
  nome: string | null;
  avatar_id: number;
  bio: string | null;
  location: string | null;
  criado_em: string;
  xp: number;
  level: number;
  levelName: string;
  levelColor: string;
  levelBg: string;
  levelBorder: string;
  xpIntoLevel: number;
  xpNeeded: number;
  xpProgressPct: number;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  totalSessions: number;
  accuracy: number;
  streak: number;
  medals: number;
  totalMedals: number;
  achievements: Medal[];
  activityLog: { date: string; questionsAnswered: number }[];
  concursoSlug?: string | null;
}

async function fetchProfile(username: string): Promise<ProfileData | null> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/profile/${encodeURIComponent(username)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Avatar emoji set (same as AvatarSelector)
const AVATARS = ['🎯','🦅','🛡️','⚡','🔰','🌟','🏆','💎','🦁','🐺','🔥','🌊','🎓','⚔️','🚀','🌙','💪','🦊','🐯','👑'];

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await fetchProfile(username);
  if (!profile) return { title: 'Perfil não encontrado — Foco Federal' };
  return {
    title: `${profile.username} · Nível ${profile.level} ${profile.levelName} — Foco Federal`,
    description: profile.bio ?? `${profile.username} estuda na Foco Federal. ${profile.totalQuestionsAnswered} questões respondidas, ${profile.accuracy}% de acerto.`,
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const p = await fetchProfile(username);
  if (!p) notFound();

  const avatar = AVATARS[(p.avatar_id - 1) % AVATARS.length] ?? '🎯';
  const joinYear = new Date(p.criado_em).getFullYear();

  const medalsByCategory = MEDAL_CATEGORIES.map(cat => ({
    category: cat,
    medals: p.achievements.filter(m => m.category === cat),
  })).filter(g => g.medals.length > 0);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Top bar */}
      <div className="border-b border-white/5 bg-[#020617]/80 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            FOCO FEDERAL
          </Link>
          <Link href="/auth/login" className="text-sm text-slate-400 hover:text-white transition">
            Entrar
          </Link>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        {/* Hero card */}
        <div className="bg-slate-900 border border-white/8 rounded-2xl overflow-hidden">
          {/* Banner gradient */}
          <div className="h-24 bg-gradient-to-br from-emerald-900/60 via-slate-900 to-slate-900" />

          <div className="px-6 pb-6 -mt-10">
            {/* Avatar + level badge */}
            <div className="flex items-end justify-between mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-4xl shadow-xl">
                  {avatar}
                </div>
                <div className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-xs font-black border ${p.levelBg} ${p.levelBorder} ${p.levelColor}`}>
                  Nv {p.level}
                </div>
              </div>
              <div className="text-right pb-1">
                <p className="text-xs text-slate-500">na plataforma desde</p>
                <p className="text-slate-300 font-semibold">{joinYear}</p>
              </div>
            </div>

            {/* Name + username */}
            <h1 className="text-2xl font-black text-white">{p.username}</h1>
            {p.nome && p.nome !== p.username && <p className="text-slate-500 text-sm">{p.nome}</p>}
            {p.bio && <p className="text-slate-300 text-sm mt-2 leading-relaxed">{p.bio}</p>}
            {p.location && <p className="text-slate-500 text-xs mt-1.5">📍 {p.location}</p>}

            {/* Level + XP bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-sm font-black ${p.levelColor}`}>{p.levelName}</span>
                <span className="text-xs text-slate-500">{p.xp.toLocaleString('pt-BR')} XP total</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all bg-gradient-to-r from-emerald-600 to-emerald-400"
                  style={{ width: `${p.xpProgressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-600">{p.xpIntoLevel} XP</span>
                <span className="text-xs text-slate-600">{p.xpNeeded} XP para próximo nível</span>
              </div>
            </div>
          </div>
        </div>

        {/* Concurso em estudo */}
        {p.concursoSlug && (
          <ConcursoBadge slug={p.concursoSlug} variant="card" />
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Questões',  value: p.totalQuestionsAnswered.toLocaleString('pt-BR'), icon: '📝', color: 'text-emerald-400' },
            { label: 'Precisão',  value: `${p.accuracy}%`,           icon: '🎯', color: p.accuracy >= 80 ? 'text-emerald-400' : p.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400' },
            { label: 'Sequência', value: `${p.streak}d`,             icon: '🔥', color: 'text-orange-400' },
            { label: 'Medalhas',  value: `${p.medals}/${p.totalMedals}`, icon: '🏅', color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-white/8 rounded-2xl p-4">
              <span className="text-xl">{s.icon}</span>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-600 uppercase tracking-wide mt-0.5 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Medals by category */}
        <div className="space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Medalhas</h2>
          {medalsByCategory.map(({ category, medals }) => (
            <div key={category} className="bg-slate-900 border border-white/8 rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{category}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {medals.map(m => {
                  const ts = TIER_STYLE[m.tier];
                  return (
                    <div
                      key={m.id}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all ${
                        m.unlocked ? `${ts.bg} ${ts.border} shadow-sm ${ts.glow}` : 'bg-slate-800/40 border-slate-700/50 opacity-40'
                      }`}
                    >
                      <span className={`text-xl shrink-0 ${m.unlocked ? '' : 'grayscale'}`}>{m.icon}</span>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${m.unlocked ? ts.text : 'text-slate-600'}`}>{m.label}</p>
                        <p className="text-xs text-slate-600 truncate capitalize">{ts.label}</p>
                      </div>
                      {m.unlocked && <span className={`ml-auto text-xs font-bold shrink-0 ${ts.text}`}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Activity calendar */}
        <div className="bg-slate-900 border border-white/8 rounded-2xl p-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Atividade (30 dias)</h2>
          <div className="flex flex-wrap gap-1.5">
            {p.activityLog.map(d => (
              <div
                key={d.date}
                title={`${d.date}: ${d.questionsAnswered} questões`}
                className={`w-6 h-6 rounded-md cursor-default ${
                  d.questionsAnswered >= 20 ? 'bg-emerald-400' :
                  d.questionsAnswered >= 10 ? 'bg-emerald-500/70' :
                  d.questionsAnswered >= 1  ? 'bg-emerald-700/70' :
                  'bg-slate-800'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
            <span>Menos</span>
            {['bg-slate-800','bg-emerald-700/70','bg-emerald-500/70','bg-emerald-400'].map(c => (
              <div key={c} className={`w-4 h-4 rounded ${c}`} />
            ))}
            <span>Mais</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-4">
          <p className="text-slate-500 text-sm mb-3">Quer competir com {p.username}?</p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Criar minha conta grátis
          </Link>
        </div>
      </main>
    </div>
  );
}
