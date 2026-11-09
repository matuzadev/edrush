import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin, CalendarDays, Flame, Sparkles } from 'lucide-react';
import { CeoBrasao } from '@/components/profile/CeoBrasao';
import { StoreItemPreview } from '@/components/store/StoreItemPreview';
import { AvatarBorder } from '@/components/AvatarBorder';
import { AvatarSelector } from '@/components/AvatarSelector';
import { getProfileData } from '@/lib/profile';
import { PerfilTabs } from './PerfilTabs';

// Cache de rota (ISR): a página fica em cache por 60s por username.
export const revalidate = 60;

const RARITY_GLOW: Record<string, string> = {
  common:    'rgba(100,116,139,0.45)',
  rare:      'rgba(59,130,246,0.55)',
  epic:      'rgba(168,85,247,0.65)',
  legendary: 'rgba(245,158,11,0.75)',
  mythic:    'rgba(244,63,94,0.85)',
};

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfileData(username);
  if (!profile) return { title: 'Perfil não encontrado — EdRush' };
  return {
    title: `${profile.username} · Nível ${profile.level} ${profile.levelName} — EdRush`,
    description: profile.bio ?? `${profile.username} estuda na EdRush. ${profile.totalQuestionsAnswered} questões respondidas, ${profile.accuracy}% de acerto.`,
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const p = await getProfileData(username);
  if (!p) notFound();

  const joinDate = new Date(p.criado_em).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const quickStats = [
    { label: 'Questões',  value: p.totalQuestionsAnswered.toLocaleString('pt-BR'), accent: '#34d399' },
    { label: 'Precisão',  value: `${p.accuracy}%`, accent: p.accuracy >= 80 ? '#34d399' : p.accuracy >= 60 ? '#fbbf24' : '#fb7185' },
    { label: 'Sequência', value: `${p.streak}d`, accent: '#fb923c' },
    { label: 'Medalhas',  value: `${p.medals}/${p.totalMedals}`, accent: '#facc15' },
  ];

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">
      {/* Glow ambiente de fundo */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60rem 40rem at 50% -10%, rgba(16,185,129,0.10), transparent 60%),' +
            'radial-gradient(50rem 30rem at 90% 10%, rgba(6,182,212,0.08), transparent 60%)',
        }}
      />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/70 backdrop-blur-strong">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="text-slate-400 hover:text-white transition shrink-0" aria-label="Início">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="text-lg font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
            >
              EDRUSH
            </Link>
          </div>
          <Link
            href="/auth/login"
            className="text-sm font-bold text-slate-300 hover:text-white border border-white/10 hover:border-white/25 rounded-full px-4 py-1.5 transition"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* ───────── HERO ───────── */}
        <section
          className="relative overflow-hidden rounded-3xl border border-white/10"
          style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.6), rgba(2,6,23,0.9))' }}
        >
          {/* Banner aurora animado */}
          <div className="relative h-36 sm:h-44 overflow-hidden">
            <div className="ff-aurora absolute inset-0" />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, transparent 40%, rgba(2,6,23,0.7) 85%, rgba(2,6,23,1) 100%)',
              }}
            />
            {/* Grid sutil */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                maskImage: 'radial-gradient(70% 100% at 50% 0%, black, transparent)',
              }}
            />
            {/* Buff XP ativo */}
            {p.expBuff && (
              <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black backdrop-blur"
                style={{ background: 'rgba(168,85,247,0.18)', border: '1px solid rgba(168,85,247,0.45)', color: '#d8b4fe' }}>
                <Sparkles size={12} /> {p.expBuff.multiplier}× XP ativo
              </div>
            )}
          </div>

          {/* Conteúdo do hero */}
          <div className="px-5 sm:px-8 pb-7 -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
              {/* Avatar com borda equipada */}
              <div className="shrink-0">
                <AvatarBorder slug={p.equippedBorder} size={84}>
                  <AvatarSelector selectedId={p.avatar_id} size="lg" />
                </AvatarBorder>
              </div>

              {/* Nome + meta */}
              <div className="min-w-0 flex-1 sm:pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight break-words">
                    {p.username}
                  </h1>
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
                </div>

                <div className="mt-2 flex items-center gap-2.5 flex-wrap text-xs text-slate-400">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 font-black ${p.levelBg} ${p.levelBorder} ${p.levelColor}`}>
                    Nv {p.level} · {p.levelName}
                  </span>
                  {p.location && (
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {p.location}</span>
                  )}
                  <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> desde {joinDate}</span>
                  {p.streak > 0 && (
                    <span className="inline-flex items-center gap-1 text-orange-400 font-bold"><Flame size={12} /> {p.streak} dias</span>
                  )}
                </div>

                {p.bio && <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-prose">{p.bio}</p>}
              </div>
            </div>

            {/* Barra de XP */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="text-slate-400 font-semibold">{p.xpIntoLevel.toLocaleString('pt-BR')} XP</span>
                <span className="text-slate-500">{p.xp.toLocaleString('pt-BR')} XP total</span>
              </div>
              <div className="relative h-2.5 rounded-full overflow-hidden bg-slate-800/80">
                <div
                  className="ff-xp absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${p.xpProgressPct}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 mt-1 text-right">
                faltam {p.xpNeeded.toLocaleString('pt-BR')} XP para o próximo nível
              </p>
            </div>

            {/* Quick stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {quickStats.map((s) => (
                <div
                  key={s.label}
                  className="group relative rounded-2xl px-3 py-3 text-center transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -top-px h-px opacity-60"
                    style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)` }}
                  />
                  <p className="text-xl sm:text-2xl font-black tabular-nums" style={{ color: s.accent }}>{s.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
            weeklyProgress: p.weeklyProgress,
            byDisciplina: p.byDisciplina,
            concursoSlug: p.concursoSlug,
            loadout: p.loadout,
            inventory: p.inventory,
            expBuff: p.expBuff,
          }}
        />
      </main>

      {/* Animações (server-rendered, sem JS) */}
      <style>{`
        @keyframes ff-aurora-move {
          0%   { transform: translate3d(-8%, -6%, 0) scale(1.1); }
          50%  { transform: translate3d(8%, 6%, 0) scale(1.25); }
          100% { transform: translate3d(-8%, -6%, 0) scale(1.1); }
        }
        .ff-aurora {
          background:
            radial-gradient(40% 60% at 20% 30%, rgba(16,185,129,0.55), transparent 60%),
            radial-gradient(45% 65% at 80% 20%, rgba(6,182,212,0.50), transparent 60%),
            radial-gradient(50% 70% at 60% 80%, rgba(139,92,246,0.45), transparent 60%),
            radial-gradient(40% 60% at 10% 90%, rgba(236,72,153,0.35), transparent 60%);
          filter: blur(8px) saturate(1.2);
          animation: ff-aurora-move 14s ease-in-out infinite;
        }
        @keyframes ff-xp-flow {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .ff-xp {
          background: linear-gradient(90deg, #059669, #34d399, #22d3ee, #34d399, #059669);
          background-size: 200% 100%;
          box-shadow: 0 0 14px rgba(16,185,129,0.6);
          animation: ff-xp-flow 3s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ff-aurora, .ff-xp { animation: none; }
        }
      `}</style>
    </div>
  );
}
