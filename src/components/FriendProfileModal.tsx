'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, Trophy, Target, TrendingUp, Flame, BookOpen } from 'lucide-react';
import { getAvatar } from '@/data/avatars';
import { AvatarBorder } from './AvatarBorder';
import { ConcursoBadge } from './ConcursoBadge';

interface ActivityDay {
  date: string;
  questionsAnswered: number;
}

interface WeeklyProgress {
  day: string;
  date: string;
  answered: number;
  correct: number;
}

interface DisciplinaStat {
  disciplina: string;
  answered: number;
  correct: number;
  accuracy: number;
}

interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
}

interface FriendProfile {
  username: string;
  nome: string | null;
  avatar_id: number;
  equippedBorder?: string;
  concursoSlug?: string | null;
  bio: string | null;
  location: string | null;
  criado_em: string;
  xp: number;
  level: number;
  levelName: string;
  levelColor: string;
  levelBg: string;
  levelBorder: string;
  xpProgressPct: number;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  totalSessions: number;
  accuracy: number;
  streak: number;
  medals: number;
  totalMedals: number;
  achievements: Achievement[];
  activityLog: ActivityDay[];
  weeklyProgress: WeeklyProgress[];
  byDisciplina: DisciplinaStat[];
}

interface FriendProfileModalProps {
  username: string | null;
  onClose: () => void;
}

export function FriendProfileModal({ username, onClose }: FriendProfileModalProps) {
  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setProfile(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetch(`/api/profile/${encodeURIComponent(username)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? 'Não foi possível carregar o perfil');
        }
        return res.json();
      })
      .then((data) => { if (!cancelled) setProfile(data); })
      .catch((err) => { if (!cancelled) setError(err.message ?? 'Erro ao carregar'); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [username]);

  // Fechar com ESC
  useEffect(() => {
    if (!username) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [username, onClose]);

  if (!username) return null;

  const avatar = profile ? getAvatar(profile.avatar_id) : null;
  const maxAnswered = profile ? Math.max(...profile.activityLog.map(d => d.questionsAnswered), 1) : 1;
  const maxWeekly = profile ? Math.max(...profile.weeklyProgress.map(d => d.answered), 1) : 1;
  const unlockedMedals = profile?.achievements.filter(a => a.unlocked) ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-label={`Perfil de ${profile?.username ?? username}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @keyframes fpEnter {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .fp-enter { animation: fpEnter 0.22s ease-out forwards; }
      `}</style>

      <div
        className="fp-enter relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.88) 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 20px 60px -12px rgba(0,0,0,0.7)',
        }}
      >
        {/* Linha de gradient no topo */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none rounded-t-3xl"
          style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6)' }}
        />

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
            <p className="text-slate-500 text-sm">Carregando perfil…</p>
          </div>
        )}

        {/* Erro */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <p className="text-red-400 font-semibold mb-2">{error}</p>
            <p className="text-slate-500 text-sm">O perfil pode estar privado ou não existir.</p>
          </div>
        )}

        {/* Conteúdo */}
        {profile && avatar && (
          <div className="overflow-y-auto flex-1">
            {/* Header */}
            <div
              className="px-6 pt-7 pb-5 relative overflow-hidden"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ background: avatar.colors.primary }}
              />

              <div className="relative flex items-start gap-4">
                {/* Avatar grande com borda equipada + badge de nível */}
                <div className="relative shrink-0">
                  <AvatarBorder slug={profile.equippedBorder} size={72}>
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${avatar.colors.primary}33, ${avatar.colors.accent}11)`,
                      }}
                      dangerouslySetInnerHTML={{ __html: avatar.svg }}
                    />
                  </AvatarBorder>
                  <div
                    className={`absolute -bottom-1 -right-1 z-10 min-w-[26px] h-6 px-1.5 rounded-full flex items-center justify-center font-black text-[11px] ${profile.levelBg} ${profile.levelColor} ${profile.levelBorder} border-2`}
                    style={{ borderColor: 'rgba(2,6,23,1)' }}
                  >
                    {profile.level}
                  </div>
                </div>

                {/* Nome + nível + bio */}
                <div className="flex-1 min-w-0 pr-10">
                  <h2 className="text-xl font-black text-white truncate">{profile.username}</h2>
                  <div className="flex items-center gap-2 mt-1 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${profile.levelBg} ${profile.levelColor} ${profile.levelBorder} border`}>
                      Nv. {profile.level} · {profile.levelName}
                    </span>
                    {profile.streak > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> {profile.streak} {profile.streak === 1 ? 'dia' : 'dias'}
                      </span>
                    )}
                  </div>
                  {profile.bio && (
                    <p className="text-sm text-slate-400 leading-snug line-clamp-2">{profile.bio}</p>
                  )}
                  {profile.location && (
                    <p className="text-xs text-slate-500 mt-1">{profile.location}</p>
                  )}
                </div>
              </div>

              {/* Concurso em estudo */}
              {profile.concursoSlug && (
                <div className="mt-4">
                  <ConcursoBadge slug={profile.concursoSlug} variant="compact" />
                </div>
              )}

              {/* Barra de XP */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                  <span>{profile.xp.toLocaleString('pt-BR')} XP</span>
                  <span>{profile.xpProgressPct}% até nv. {profile.level + 1}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${profile.xpProgressPct}%`,
                      background: `linear-gradient(90deg, ${avatar.colors.primary}, ${avatar.colors.accent})`,
                      boxShadow: `0 0 12px ${avatar.colors.primary}66`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-4 gap-2 mb-5">
                <StatCard icon={<TrendingUp size={14} />} label="Respondidas" value={profile.totalQuestionsAnswered.toLocaleString('pt-BR')} accent="#3b82f6" />
                <StatCard icon={<Target size={14} />} label="Acerto" value={`${profile.accuracy}%`} accent="#8b5cf6" />
                <StatCard icon={<BookOpen size={14} />} label="Sessões" value={String(profile.totalSessions)} accent="#10b981" />
                <StatCard icon={<Trophy size={14} />} label="Medalhas" value={`${profile.medals}/${profile.totalMedals}`} accent="#eab308" />
              </div>

              {/* Atividade Semanal */}
              <Section title="Atividade semanal">
                <div className="flex items-end gap-1.5 h-24 px-1">
                  {profile.weeklyProgress.map((d, i) => {
                    const heightPct = (d.answered / maxWeekly) * 100;
                    const today = new Date().toISOString().split('T')[0];
                    const isToday = d.date === today;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <div className="flex-1 w-full flex items-end">
                          <div
                            className="w-full rounded-t transition-all"
                            style={{
                              height: d.answered > 0 ? `${Math.max(heightPct, 8)}%` : '4px',
                              background: d.answered === 0
                                ? 'rgba(255,255,255,0.04)'
                                : isToday
                                  ? 'linear-gradient(180deg, #34d399, #10b981)'
                                  : 'linear-gradient(180deg, #475569, #334155)',
                              boxShadow: isToday && d.answered > 0 ? '0 0 12px rgba(16,185,129,0.5)' : 'none',
                            }}
                            title={`${d.answered} questões`}
                          />
                        </div>
                        <span className={`text-[10px] font-semibold ${isToday ? 'text-emerald-400' : 'text-slate-600'}`}>
                          {d.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* Heatmap 30 dias */}
              <Section title="Últimos 30 dias">
                <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1">
                  {profile.activityLog.map((d, i) => {
                    const intensity = d.questionsAnswered === 0
                      ? 0
                      : d.questionsAnswered / maxAnswered;
                    const opacity = intensity === 0 ? 0.05 : 0.2 + intensity * 0.8;
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded transition-transform hover:scale-125"
                        style={{
                          background: d.questionsAnswered === 0
                            ? 'rgba(255,255,255,0.04)'
                            : `rgba(16,185,129,${opacity})`,
                        }}
                        title={`${d.date}: ${d.questionsAnswered} ${d.questionsAnswered === 1 ? 'questão' : 'questões'}`}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-600">
                  <span>menos</span>
                  <div className="flex items-center gap-1">
                    {[0.05, 0.3, 0.5, 0.75, 1].map(o => (
                      <div key={o} className="w-2.5 h-2.5 rounded-sm" style={{ background: `rgba(16,185,129,${o})` }} />
                    ))}
                  </div>
                  <span>mais</span>
                </div>
              </Section>

              {/* Top disciplinas */}
              {profile.byDisciplina.length > 0 && (
                <Section title="Top disciplinas">
                  <div className="space-y-2">
                    {profile.byDisciplina.map((d) => {
                      const accColor = d.accuracy >= 70 ? '#10b981' : d.accuracy >= 50 ? '#eab308' : '#ef4444';
                      return (
                        <div key={d.disciplina}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-300 capitalize truncate">{d.disciplina.replace(/-/g, ' ')}</span>
                            <span className="text-slate-500 shrink-0 ml-2">
                              <span className="font-bold" style={{ color: accColor }}>{d.accuracy}%</span>
                              <span className="text-slate-600"> · {d.answered}</span>
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${d.accuracy}%`,
                                background: accColor,
                                boxShadow: `0 0 8px ${accColor}55`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* Medalhas desbloqueadas */}
              {unlockedMedals.length > 0 && (
                <Section title={`Medalhas (${unlockedMedals.length})`}>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {unlockedMedals.slice(0, 8).map((m) => (
                      <div
                        key={m.id}
                        className="rounded-xl p-3 text-center border"
                        style={{
                          background: m.tier === 'platinum' ? 'rgba(168,85,247,0.10)'
                            : m.tier === 'gold' ? 'rgba(234,179,8,0.10)'
                            : m.tier === 'silver' ? 'rgba(148,163,184,0.10)'
                            : 'rgba(180,83,9,0.10)',
                          borderColor: m.tier === 'platinum' ? 'rgba(168,85,247,0.30)'
                            : m.tier === 'gold' ? 'rgba(234,179,8,0.30)'
                            : m.tier === 'silver' ? 'rgba(148,163,184,0.30)'
                            : 'rgba(180,83,9,0.30)',
                        }}
                        title={m.description}
                      >
                        <div className="text-2xl mb-1">{m.icon}</div>
                        <div className="text-[10px] font-bold text-white truncate">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div
      className="relative rounded-xl p-2.5 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.7), rgba(15,23,42,0.3))',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div className="flex items-center gap-1 mb-0.5" style={{ color: accent }}>{icon}<span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span></div>
      <div className="text-base font-black text-white tabular-nums leading-tight">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2.5">{title}</h3>
      {children}
    </div>
  );
}
