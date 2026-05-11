import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Medal } from '@/lib/levels';
import { CeoBrasao } from '@/components/profile/CeoBrasao';
import { StoreItemPreview } from '@/components/store/StoreItemPreview';
import { PerfilTabs } from './PerfilTabs';

const RARITY_GLOW: Record<string, string> = {
  common:    'rgba(100,116,139,0.45)',
  rare:      'rgba(59,130,246,0.55)',
  epic:      'rgba(168,85,247,0.65)',
  legendary: 'rgba(245,158,11,0.75)',
  mythic:    'rgba(244,63,94,0.85)',
};

interface ItemRef {
  id: string;
  slug: string;
  name: string;
  rarity: string;
  category: string;
  metadata: unknown;
}

interface ProfileData {
  id: string;
  username: string;
  nome: string | null;
  avatar_id: number;
  isCeo?: boolean;
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
  loadout?: { border: ItemRef | null; avatar: ItemRef | null; badges: ItemRef[] };
  inventory?: Array<{ category: string; items: ItemRef[] }>;
  expBuff?: { multiplier: number; expiresAt: string } | null;
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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Top bar */}
      <div className="border-b border-white/5 bg-[#020617]/80 sticky top-0 z-20 backdrop-blur">
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
            <h1 className="text-2xl font-black text-white flex items-center gap-2 flex-wrap">
              <span>{p.username}</span>
              {p.loadout?.badges && p.loadout.badges.length > 0 && (
                <span className="inline-flex items-center gap-1 align-middle">
                  {p.loadout.badges.slice(0, 3).map((b) => {
                    const glow = RARITY_GLOW[b.rarity] ?? RARITY_GLOW.common;
                    return (
                      <span
                        key={b.id}
                        title={b.name}
                        className="inline-flex items-center justify-center"
                        style={{ width: 26, height: 26, filter: `drop-shadow(0 0 6px ${glow})` }}
                      >
                        <StoreItemPreview item={b} size={26} />
                      </span>
                    );
                  })}
                </span>
              )}
              {p.isCeo && <CeoBrasao />}
            </h1>
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

        {/* Tabs + content */}
        <PerfilTabs
          data={{
            id: p.id,
            username: p.username,
            totalQuestionsAnswered: p.totalQuestionsAnswered,
            totalQuestionsCorrect: p.totalQuestionsCorrect,
            totalSessions: p.totalSessions,
            accuracy: p.accuracy,
            streak: p.streak,
            medals: p.medals,
            totalMedals: p.totalMedals,
            achievements: p.achievements,
            activityLog: p.activityLog,
            concursoSlug: p.concursoSlug,
            loadout: p.loadout,
            inventory: p.inventory,
            expBuff: p.expBuff,
          }}
        />
      </main>
    </div>
  );
}
