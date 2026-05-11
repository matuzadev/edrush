'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usUserProfile } from '@/hooks/useProfile';
import { AvatarSelector } from '@/components/AvatarSelector';
import { AvatarBorder } from '@/components/AvatarBorder';
import { StoreItemPreview } from '@/components/store/StoreItemPreview';
import { ConcursoBadge } from '@/components/ConcursoBadge';
import { AddFriendsModal } from '@/components/AddFriendsModal';
import { EditProfileModal } from '@/components/EditProfileModal';
import { FriendRequests } from '@/components/FriendRequests';
import { FriendProfileModal } from '@/components/FriendProfileModal';
import { NotificationBell } from '@/components/NotificationBell';
import { TIER_STYLE, MEDAL_CATEGORIES } from '@/lib/levels';
import type { Medal } from '@/lib/levels';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Users,
  Edit,
  BookOpen,
  Target,
  Zap,
  LogOut,
  Copy,
  Check,
  Gift,
  ArrowRight,
  Flame,
  Lock,
  TrendingUp,
  Award,
  Crown,
  AlertCircle,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';

// Mapa de cores por tier — usando style inline para evitar problema de classes dinâmicas no Tailwind v4
const TIER_GLOW: Record<string, string> = {
  bronze:   'rgba(217,119,6,0.35)',
  silver:   'rgba(148,163,184,0.35)',
  gold:     'rgba(234,179,8,0.45)',
  platinum: 'rgba(167,139,250,0.45)',
};

const TIER_GRADIENT: Record<string, string> = {
  bronze:   'linear-gradient(135deg, rgba(120,53,15,0.6), rgba(92,44,10,0.3))',
  silver:   'rgba(51,65,85,0.5)',
  gold:     'linear-gradient(135deg, rgba(113,63,18,0.6), rgba(92,44,10,0.3))',
  platinum: 'linear-gradient(135deg, rgba(76,29,149,0.6), rgba(59,22,120,0.3))',
};

// Cores de acurácia
function accuracyColor(pct: number): string {
  if (pct >= 80) return '#10b981';
  if (pct >= 60) return '#f59e0b';
  return '#ef4444';
}

// Tiers de domínio por disciplina (visual + label)
type MasteryTier = {
  label: string;
  color: string;
  accent: string;
  glow: string;
  Icon: typeof Crown;
};

function getMasteryTier(accuracy: number): MasteryTier {
  if (accuracy >= 85) {
    return { label: 'Domínio',     color: '#10b981', accent: '#34d399', glow: 'rgba(16,185,129,0.35)', Icon: Crown };
  }
  if (accuracy >= 70) {
    return { label: 'Avançado',    color: '#06b6d4', accent: '#22d3ee', glow: 'rgba(6,182,212,0.35)',  Icon: Sparkles };
  }
  if (accuracy >= 55) {
    return { label: 'Em evolução', color: '#eab308', accent: '#facc15', glow: 'rgba(234,179,8,0.35)',  Icon: Target };
  }
  return     { label: 'Foco aqui',  color: '#f43f5e', accent: '#fb7185', glow: 'rgba(244,63,94,0.35)',  Icon: AlertCircle };
}

// Formata "lingua-portuguesa" → "Língua Portuguesa"
function formatDisciplina(raw: string): string {
  return raw
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, error, updateProfile, fetchProfile } = usUserProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddFriendsOpen, setIsAddFriendsOpen] = useState(false);
  const [isFriendsPopupOpen, setIsFriendsPopupOpen] = useState(false);
  const [friendsCount, setFriendsCount] = useState<number | null>(null);

  // Carrega só a contagem de amigos para o badge (leve, ~1 request)
  useEffect(() => {
    if (!user) return;
    fetch('/api/friends')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setFriendsCount(((d.friends as unknown[])?.length ?? 0));
      })
      .catch(() => {});
  }, [user]);
  const [viewingFriend, setViewingFriend] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  const handleSaveProfile = async (data: {
    username: string;
    birthday: string;
    location: string;
    bio: string;
    avatar: number;
  }) => {
    setSaveError(null);
    try {
      const trimmedUsername = (data.username ?? '').trim();
      await updateProfile({
        ...(trimmedUsername.length >= 2 ? { username: trimmedUsername } : {}),
        bio: data.bio,
        birthday: data.birthday || undefined,
        location: data.location,
        avatar_id: data.avatar,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar perfil';
      setSaveError(message);
    }
  };

  const copyProfileUrl = () => {
    const url = `${window.location.origin}/perfil/${encodeURIComponent(profile.username)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatAccountAge = () => {
    if (!profile.criado_em) return '';
    const diffDays = Math.ceil((Date.now() - new Date(profile.criado_em).getTime()) / 86400000);
    if (diffDays < 30) return `${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} mes${Math.floor(diffDays / 30) > 1 ? 'es' : ''}`;
    const y = Math.floor(diffDays / 365);
    return `${y} ano${y > 1 ? 's' : ''}`;
  };

  const formatBirthday = (d?: string | null) =>
    d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não definido';

  const displayName = profile.username || profile.nome || 'Concurseiro';

  const CATEGORIES = ['Todos', ...MEDAL_CATEGORIES];
  const filteredMedals: Medal[] =
    activeCategory === 'Todos'
      ? profile.achievements
      : profile.achievements.filter((m) => m.category === activeCategory);

  // weeklyProgress vem da API (campo adicionado em /api/user/stats)
  const weeklyProgress = (profile as unknown as {
    weeklyProgress?: { day: string; date: string; answered: number; correct: number }[];
  }).weeklyProgress ?? [];

  const maxWeeklyAnswered = Math.max(...weeklyProgress.map((d) => d.answered), 1);

  // byDisciplina vem da API
  const byDisciplina = (profile as unknown as {
    byDisciplina?: { disciplina: string; answered: number; correct: number; accuracy: number }[];
  }).byDisciplina ?? [];

  const maxDisciplinaAnswered = Math.max(...byDisciplina.map((d) => d.answered), 1);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Navbar */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50 px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
          >
            FOCO FEDERAL
          </Link>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="hidden sm:inline text-sm text-slate-400 font-medium">Meu Perfil</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <button
            onClick={() => { signOut(); router.push('/'); }}
            className="text-slate-400 hover:text-red-400 transition"
            aria-label="Sair da conta"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {profileLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-32 text-slate-400">{error}</div>
        ) : (
          <div className="space-y-6">

            {/* ── Hero ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-white/8 rounded-2xl">
              {/* Glow de fundo */}
              <div
                className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #10b981, #06b6d4)' }}
              />
              {/* Faixa de gradiente no topo */}
              <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, #10b981, #06b6d4, transparent)' }}
              />
              {/* Banner decorativo */}
              <div className="h-24 bg-gradient-to-br from-emerald-900/40 via-cyan-900/20 to-transparent" />

              <div className="relative px-6 pb-6 -mt-12">
                {/* Avatar + ações */}
                <div className="flex items-end justify-between mb-5">
                  <div className="relative">
                    <AvatarBorder slug={profile.equippedBorder} size={96}>
                      <AvatarSelector selectedId={profile.avatar_id} size="lg" />
                    </AvatarBorder>
                    {/* Badge de nível */}
                    <div
                      className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full text-xs font-black border z-10"
                      style={{
                        backgroundColor: 'rgba(15,23,42,0.95)',
                        borderColor: 'rgba(16,185,129,0.5)',
                        color: '#34d399',
                      }}
                    >
                      Nv {profile.level}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pb-1 flex-wrap justify-end">
                    <button
                      onClick={copyProfileUrl}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/40 rounded-lg px-3 py-1.5 transition"
                      title="Copiar link do perfil"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copiado!' : 'Compartilhar'}
                    </button>
                    <Link
                      href={`/perfil/${encodeURIComponent(displayName)}`}
                      target="_blank"
                      className="text-xs text-slate-400 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/40 rounded-lg px-3 py-1.5 transition"
                    >
                      Ver público
                    </Link>
                  </div>
                </div>

                {/* Nome e bio */}
                <div className="mb-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-black text-white">{displayName}</h1>
                    {profile.equippedBadges && profile.equippedBadges.length > 0 && (
                      <div className="flex items-center gap-1.5" title="Selos equipados">
                        {profile.equippedBadges.map((badge) => (
                          <div key={badge.id} title={badge.name}>
                            <StoreItemPreview item={badge} size={28} />
                          </div>
                        ))}
                      </div>
                    )}
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-black border"
                      style={{
                        background: 'rgba(15,23,42,0.8)',
                        borderColor: 'rgba(16,185,129,0.4)',
                        color: '#34d399',
                      }}
                    >
                      {profile.levelName}
                    </span>
                    {profile.streak > 0 && (
                      <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2.5 py-0.5">
                        <Flame className="w-3.5 h-3.5" />
                        {profile.streak} dias
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">/perfil/{displayName}</p>
                  {profile.bio && (
                    <p className="text-slate-300 text-sm mt-2 leading-relaxed italic max-w-lg">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* Barra de XP */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Progresso de nível
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {profile.xp.toLocaleString('pt-BR')} XP
                    </span>
                  </div>
                  <div className="h-3 bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${profile.xpProgressPct}%`,
                        background: 'linear-gradient(90deg, #059669, #10b981, #34d399)',
                        boxShadow: '0 0 14px rgba(16,185,129,0.5)',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[11px] text-slate-600">
                    <span>{profile.xpIntoLevel.toLocaleString('pt-BR')} / {profile.xpNeeded.toLocaleString('pt-BR')} XP</span>
                    <span>+{(profile.xpNeeded - profile.xpIntoLevel).toLocaleString('pt-BR')} para Nível {profile.level + 1}</span>
                  </div>
                </div>

                {saveError && (
                  <p className="text-red-400 text-xs mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {saveError}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold transition-all text-sm shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_28px_rgba(16,185,129,0.4)]"
                  >
                    <Edit className="w-4 h-4" />
                    Editar Perfil
                  </button>
                  <button
                    onClick={() => setIsFriendsPopupOpen(true)}
                    className="relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white transition-all"
                    style={{
                      background: 'rgba(15,23,42,0.6)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(34,211,238,0.35)';
                      e.currentTarget.style.background = 'rgba(8,47,73,0.55)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = 'rgba(15,23,42,0.6)';
                    }}
                    title="Amigos"
                    aria-label="Abrir lista de amigos"
                  >
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="hidden sm:inline">Amigos</span>
                    {friendsCount !== null && friendsCount > 0 && (
                      <span
                        className="ml-0.5 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center tabular-nums"
                        style={{
                          background: 'rgba(34,211,238,0.15)',
                          color: '#22d3ee',
                          border: '1px solid rgba(34,211,238,0.30)',
                        }}
                      >
                        {friendsCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Programa de Indicação (CTA premium) ── */}
            <Link
              href="/dashboard/referral"
              className="referral-cta relative block overflow-hidden rounded-2xl group"
              style={{
                background: 'linear-gradient(135deg, rgba(6,78,59,0.55) 0%, rgba(15,23,42,0.85) 50%, rgba(8,51,68,0.55) 100%)',
                border: '1px solid rgba(16,185,129,0.30)',
                boxShadow: '0 12px 36px -12px rgba(16,185,129,0.25)',
              }}
            >
              <style>{`
                @keyframes referralShimmer {
                  0%   { transform: translateX(-110%) skewX(-12deg); }
                  100% { transform: translateX(220%)  skewX(-12deg); }
                }
                .referral-cta:hover .referral-shine { animation: referralShimmer 1.2s ease-out; }
                @keyframes referralFloat {
                  0%, 100% { transform: translateY(0) rotate(-8deg); }
                  50%      { transform: translateY(-3px) rotate(-8deg); }
                }
                .referral-cta:hover .referral-gift { animation: referralFloat 1.6s ease-in-out infinite; }
              `}</style>

              {/* Linha de gradient no topo */}
              <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, #10b981, #06b6d4, transparent)' }}
              />

              {/* Brilho sweep no hover */}
              <div
                className="referral-shine absolute top-0 -left-1/3 h-full w-1/3 pointer-events-none opacity-60"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.20), transparent)',
                }}
              />

              {/* Glow blob esquerdo */}
              <div
                className="absolute -left-12 -top-12 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-40"
                style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
              />
              {/* Glow blob direito */}
              <div
                className="absolute -right-16 -bottom-12 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-30"
                style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
              />

              {/* Sparkles decorativos */}
              <Sparkles
                className="absolute top-3 right-12 text-emerald-400/40 pointer-events-none"
                size={12}
              />
              <Sparkles
                className="absolute bottom-4 left-32 text-cyan-400/30 pointer-events-none"
                size={10}
              />

              <div className="relative flex items-center gap-4 px-5 py-4 sm:py-5">
                {/* Ícone Gift com glow */}
                <div
                  className="referral-gift relative shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.30), rgba(6,182,212,0.15))',
                    border: '1px solid rgba(16,185,129,0.40)',
                    boxShadow: '0 0 20px -2px rgba(16,185,129,0.45), inset 0 0 12px rgba(16,185,129,0.15)',
                    transform: 'rotate(-8deg)',
                  }}
                >
                  <Gift size={22} className="text-emerald-300" strokeWidth={2.2} />
                  {/* Pingo de luz */}
                  <span
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                    style={{
                      background: '#fbbf24',
                      boxShadow: '0 0 8px #fbbf24, 0 0 14px rgba(251,191,36,0.6)',
                    }}
                  />
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                        color: '#020617',
                      }}
                    >
                      Bônus Exclusivo
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      · Sem custo
                    </span>
                  </div>
                  <h3
                    className="text-base sm:text-lg font-black leading-tight bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(90deg, #ffffff, #d1fae5)' }}
                  >
                    Programa de Indicação
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                    Convide amigos concurseiros e <span className="font-bold text-emerald-400">ganhe meses grátis</span> a cada inscrição.
                  </p>
                </div>

                {/* CTA */}
                <div
                  className="shrink-0 hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-xs transition-all group-hover:gap-2.5"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    color: '#020617',
                    boxShadow: '0 4px 16px -4px rgba(16,185,129,0.50)',
                  }}
                >
                  Indicar agora
                  <ArrowRight size={14} strokeWidth={3} />
                </div>

                {/* CTA mobile (apenas seta) */}
                <div
                  className="shrink-0 sm:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:translate-x-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    color: '#020617',
                    boxShadow: '0 4px 16px -4px rgba(16,185,129,0.50)',
                  }}
                >
                  <ArrowRight size={16} strokeWidth={3} />
                </div>
              </div>
            </Link>

            {/* ── Concurso em estudo (linha discreta) ── */}
            {profile.concursoSlug && (
              <div className="px-1">
                <ConcursoBadge slug={profile.concursoSlug} variant="inline" />
              </div>
            )}

            {/* ── Info pessoal ── */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <MapPin className="w-4 h-4" />, label: 'Localização', value: profile.location || 'Não definido', color: '#22d3ee' },
                { icon: <Calendar className="w-4 h-4" />, label: 'Aniversário', value: formatBirthday(profile.birthday), color: '#f472b6' },
                { icon: <Zap className="w-4 h-4" />, label: 'Na plataforma', value: formatAccountAge(), color: '#fbbf24' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-white/8 rounded-xl p-3.5 hover:border-white/15 transition-all"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, ${item.color}66, transparent)` }}
                  />
                  <div style={{ color: item.color }}>{item.icon}</div>
                  <p className="text-white font-semibold text-sm mt-2 truncate">{item.value}</p>
                  <p className="text-slate-600 text-xs uppercase tracking-wide mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            {/* ── Stats principais ── */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {([
                {
                  icon: BookOpen,
                  label: 'Respondidas',
                  hint: profile.totalPlatformQuestions
                    ? `de ${profile.totalPlatformQuestions.toLocaleString('pt-BR')} no banco`
                    : profile.totalQuestionsCorrect > 0
                      ? `${profile.totalQuestionsCorrect} corretas`
                      : 'comece agora',
                  value: profile.totalQuestionsAnswered.toLocaleString('pt-BR'),
                  accent: '#10b981',
                  progress: profile.totalPlatformQuestions
                    ? Math.min(100, Math.round((profile.totalQuestionsAnswered / profile.totalPlatformQuestions) * 100))
                    : undefined,
                },
                {
                  icon: Target,
                  label: 'Precisão',
                  hint: profile.accuracy >= 80 ? 'Excelente!' : profile.accuracy >= 60 ? 'Continue' : 'Foco nas revisões',
                  value: profile.totalQuestionsAnswered > 0 ? `${profile.accuracy}%` : '—',
                  accent: accuracyColor(profile.accuracy),
                  progress: profile.totalQuestionsAnswered > 0 ? profile.accuracy : 0,
                },
                {
                  icon: Flame,
                  label: 'Sequência',
                  hint: profile.streak > 0 ? 'dias seguidos' : 'estude hoje!',
                  value: `${profile.streak}d`,
                  accent: '#f97316',
                },
                {
                  icon: Award,
                  label: 'Medalhas',
                  hint: `de ${profile.totalMedals} possíveis`,
                  value: `${profile.medals}/${profile.totalMedals}`,
                  accent: '#eab308',
                  progress: profile.totalMedals > 0
                    ? Math.round((profile.medals / profile.totalMedals) * 100)
                    : 0,
                },
                {
                  icon: Layers,
                  label: 'Banco',
                  hint: profile.coveragePct != null
                    ? `${profile.coveragePct.toFixed(1)}% explorado`
                    : 'questões cadastradas',
                  value: profile.totalPlatformQuestions
                    ? profile.totalPlatformQuestions.toLocaleString('pt-BR')
                    : '—',
                  accent: '#a855f7',
                  progress: profile.coveragePct ?? 0,
                },
              ] as const).map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-white/8 rounded-2xl p-5 group transition-all hover:border-white/20 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                  >
                    <div
                      className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none"
                      style={{ background: metric.accent }}
                    />
                    <div
                      className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                      style={{ background: `linear-gradient(90deg, transparent, ${metric.accent}, transparent)` }}
                    />
                    <div className="relative">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 ring-1 ring-white/5"
                        style={{ background: `${metric.accent}18` }}
                      >
                        <Icon size={17} style={{ color: metric.accent }} />
                      </div>
                      <div className="text-3xl font-black text-white leading-none mb-1 tabular-nums">
                        {metric.value}
                      </div>
                      <div className="text-xs font-semibold text-slate-300 mb-0.5">{metric.label}</div>
                      <div className="text-[11px] text-slate-500">{metric.hint}</div>
                      {'progress' in metric && typeof metric.progress === 'number' && (
                        <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${metric.progress}%`,
                              background: metric.accent,
                              boxShadow: `0 0 10px ${metric.accent}55`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Atividade semanal + Heatmap ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Barras semanais */}
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-white/8 rounded-2xl p-5">
                <div
                  className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }}
                />
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp size={15} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Atividade Semanal</h3>
                    <p className="text-[11px] text-slate-500">Últimos 7 dias</p>
                  </div>
                </div>

                {weeklyProgress.length > 0 ? (
                  <div className="flex items-end gap-2 h-28">
                    {weeklyProgress.map((d) => {
                      const heightPct = maxWeeklyAnswered > 0
                        ? Math.max(4, Math.round((d.answered / maxWeeklyAnswered) * 100))
                        : 4;
                      const isToday = d.date === new Date().toISOString().split('T')[0];
                      return (
                        <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group" title={`${d.day}: ${d.answered} questões`}>
                          <div className="w-full flex-1 flex items-end">
                            <div
                              className="w-full rounded-t-md transition-all duration-500"
                              style={{
                                height: `${heightPct}%`,
                                minHeight: '4px',
                                background: d.answered > 0
                                  ? isToday
                                    ? 'linear-gradient(180deg, #34d399, #10b981)'
                                    : 'linear-gradient(180deg, #059669cc, #065f46cc)'
                                  : 'rgba(255,255,255,0.04)',
                                boxShadow: d.answered > 0 ? '0 0 8px rgba(16,185,129,0.3)' : 'none',
                              }}
                            />
                          </div>
                          <span className={`text-[10px] font-bold ${isToday ? 'text-emerald-400' : 'text-slate-600'}`}>
                            {d.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-28 text-slate-600 text-sm">
                    Sem dados ainda
                  </div>
                )}
              </div>

              {/* Heatmap 30 dias */}
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-white/8 rounded-2xl p-5">
                <div
                  className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)' }}
                />
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Flame size={15} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Heatmap de Atividade</h3>
                    <p className="text-[11px] text-slate-500">Últimos 30 dias</p>
                  </div>
                </div>

                {/* Grade 30 dias — 5 semanas × 7 dias */}
                <div className="overflow-x-auto">
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }, (_, weekIdx) => (
                      <div key={weekIdx} className="flex flex-col gap-1.5">
                        {Array.from({ length: 7 }, (_, dayIdx) => {
                          const idx = weekIdx * 7 + dayIdx;
                          const day = profile.activityLog[idx];
                          if (!day) return <div key={dayIdx} className="w-5 h-5 rounded-sm" style={{ background: 'transparent' }} />;
                          const q = day.questionsAnswered ?? 0;
                          // intensidade por questões respondidas
                          let opacity = 0.08;
                          if (q >= 30) opacity = 1;
                          else if (q >= 15) opacity = 0.75;
                          else if (q >= 5) opacity = 0.5;
                          else if (q >= 1) opacity = 0.3;
                          return (
                            <div
                              key={dayIdx}
                              className="w-5 h-5 rounded-sm cursor-help transition-transform hover:scale-125"
                              style={{
                                background: day.completed
                                  ? `rgba(16,185,129,${opacity})`
                                  : 'rgba(255,255,255,0.04)',
                                boxShadow: day.completed && q >= 5
                                  ? `0 0 6px rgba(16,185,129,${opacity * 0.6})`
                                  : 'none',
                                border: day.completed
                                  ? `1px solid rgba(16,185,129,${opacity * 0.5})`
                                  : '1px solid rgba(255,255,255,0.05)',
                              }}
                              title={`${day.date}: ${q > 0 ? `${q} questões` : 'Sem atividade'}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legenda */}
                <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-600">
                  <span>Menos</span>
                  {[0.08, 0.3, 0.5, 0.75, 1].map((op) => (
                    <div
                      key={op}
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{ background: `rgba(16,185,129,${op})` }}
                    />
                  ))}
                  <span>Mais</span>
                </div>
              </div>
            </div>

            {/* ── Desempenho por disciplina ── */}
            {byDisciplina.length > 0 && (() => {
              const totalAnswered  = byDisciplina.reduce((s, d) => s + d.answered, 0);
              const totalCorrect   = byDisciplina.reduce((s, d) => s + d.correct, 0);
              const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
              const bestDisc = [...byDisciplina].sort((a, b) => b.accuracy - a.accuracy)[0];

              return (
                <div
                  className="relative overflow-hidden rounded-3xl p-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.55) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 12px 40px -16px rgba(0,0,0,0.6)',
                  }}
                >
                  {/* Linha de gradiente no topo */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, #10b981, #06b6d4, #8b5cf6, transparent)' }}
                  />

                  {/* Glow accent superior direito */}
                  <div
                    className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
                  />

                  {/* Header com 3 métricas agregadas */}
                  <div className="relative flex items-start justify-between gap-4 mb-6 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(6,182,212,0.20), rgba(139,92,246,0.10))',
                          border: '1px solid rgba(6,182,212,0.25)',
                          boxShadow: '0 0 20px -4px rgba(6,182,212,0.30)',
                        }}
                      >
                        <TrendingUp size={20} className="text-cyan-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-white text-base leading-tight">Desempenho por disciplina</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Mapa de domínio das suas matérias</p>
                      </div>
                    </div>

                    {/* Métricas resumo */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div
                        className="px-3 py-1.5 rounded-xl flex items-center gap-2"
                        style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.20)' }}
                      >
                        <Target size={11} className="text-cyan-400" />
                        <div className="text-right">
                          <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest leading-none">Média</p>
                          <p className="text-sm font-black tabular-nums leading-tight" style={{ color: accuracyColor(overallAccuracy) }}>
                            {overallAccuracy}%
                          </p>
                        </div>
                      </div>
                      <div
                        className="px-3 py-1.5 rounded-xl flex items-center gap-2"
                        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.20)' }}
                      >
                        <BookOpen size={11} className="text-violet-400" />
                        <div className="text-right">
                          <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest leading-none">Disciplinas</p>
                          <p className="text-sm font-black tabular-nums text-white leading-tight">{byDisciplina.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Destaque "Top disciplina" */}
                  {bestDisc && bestDisc.accuracy >= 70 && (() => {
                    const tier = getMasteryTier(bestDisc.accuracy);
                    return (
                      <div
                        className="mb-5 px-4 py-3 rounded-2xl flex items-center gap-3"
                        style={{
                          background: `linear-gradient(135deg, ${tier.color}18, ${tier.accent}05)`,
                          border: `1px solid ${tier.color}30`,
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${tier.color}22`, border: `1px solid ${tier.color}40` }}
                        >
                          <tier.Icon size={16} style={{ color: tier.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: tier.color }}>
                            Sua matéria mais forte
                          </p>
                          <p className="text-sm font-bold text-white truncate">{formatDisciplina(bestDisc.disciplina)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl font-black tabular-nums" style={{ color: tier.color }}>{bestDisc.accuracy}%</p>
                          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{tier.label}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Grid de cards por disciplina */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
                    {byDisciplina.map((d) => {
                      const tier = getMasteryTier(d.accuracy);
                      const ringProgress = Math.max(0, Math.min(100, d.accuracy));
                      const volumePct = Math.max(4, Math.round((d.answered / maxDisciplinaAnswered) * 100));
                      // SVG ring math
                      const radius = 22;
                      const circumference = 2 * Math.PI * radius;
                      const dashOffset = circumference - (ringProgress / 100) * circumference;

                      return (
                        <div
                          key={d.disciplina}
                          className="relative group rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, rgba(30,41,59,0.55), rgba(15,23,42,0.30))',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = `${tier.color}55`;
                            e.currentTarget.style.boxShadow = `0 12px 30px -12px ${tier.glow}, 0 0 0 1px ${tier.color}22`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {/* Glow lateral subtle por tier */}
                          <div
                            className="absolute -left-8 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity"
                            style={{ background: tier.color }}
                          />

                          <div className="relative flex items-center gap-3">
                            {/* Anel de progresso */}
                            <div className="relative shrink-0">
                              <svg width="56" height="56" viewBox="0 0 56 56" className="transform -rotate-90">
                                <circle
                                  cx="28" cy="28" r={radius}
                                  fill="none"
                                  stroke="rgba(255,255,255,0.06)"
                                  strokeWidth="4"
                                />
                                <circle
                                  cx="28" cy="28" r={radius}
                                  fill="none"
                                  stroke={tier.color}
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                  strokeDasharray={circumference}
                                  strokeDashoffset={dashOffset}
                                  style={{
                                    transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)',
                                    filter: `drop-shadow(0 0 4px ${tier.glow})`,
                                  }}
                                />
                              </svg>
                              {/* Texto centro do anel */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-sm font-black tabular-nums leading-none" style={{ color: tier.color }}>
                                  {d.accuracy}
                                </span>
                                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">%</span>
                              </div>
                            </div>

                            {/* Info à direita */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="text-sm font-bold text-white truncate leading-tight">
                                  {formatDisciplina(d.disciplina)}
                                </p>
                                <div
                                  className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                                  style={{
                                    background: `${tier.color}15`,
                                    border: `1px solid ${tier.color}30`,
                                  }}
                                  title={tier.label}
                                >
                                  <tier.Icon size={9} style={{ color: tier.color }} />
                                  <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: tier.color }}>
                                    {tier.label}
                                  </span>
                                </div>
                              </div>

                              {/* Linha de stats */}
                              <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                                <span><span className="font-bold text-slate-300 tabular-nums">{d.answered}</span> resp.</span>
                                <span className="text-slate-700">·</span>
                                <span><span className="font-bold tabular-nums" style={{ color: tier.accent }}>{d.correct}</span> acertos</span>
                              </div>

                              {/* Barra de volume relativo */}
                              <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                                  style={{
                                    width: `${volumePct}%`,
                                    background: `linear-gradient(90deg, ${tier.color}, ${tier.accent})`,
                                    boxShadow: `0 0 6px ${tier.glow}`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legenda de tiers */}
                  <div className="mt-5 pt-4 flex items-center justify-center gap-3 flex-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {[
                      { label: 'Domínio',     min: '85%+', color: '#10b981' },
                      { label: 'Avançado',    min: '70%+', color: '#06b6d4' },
                      { label: 'Em evolução', min: '55%+', color: '#eab308' },
                      { label: 'Foco aqui',   min: '<55%', color: '#f43f5e' },
                    ].map((t) => (
                      <div key={t.label} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: t.color, boxShadow: `0 0 6px ${t.color}88` }} />
                        <span className="text-[10px] font-semibold text-slate-500">
                          {t.label} <span className="text-slate-600 font-normal">({t.min})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── Medalhas ── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-white/8 rounded-2xl p-5">
              <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, #eab308, transparent)' }}
              />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Award size={15} className="text-yellow-400" />
                  </div>
                  <h3 className="font-bold text-white">Medalhas</h3>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-800/60 border border-white/5 rounded-full px-2.5 py-1">
                  {profile.medals} / {profile.totalMedals} desbloqueadas
                </span>
              </div>

              {/* Filtro por categoria */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_14px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-800/60 text-slate-400 border border-white/5 hover:text-slate-200 hover:border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {filteredMedals.map((m) => {
                  const ts = TIER_STYLE[m.tier];
                  return (
                    <div
                      key={m.id}
                      title={m.description}
                      className="relative flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all overflow-hidden"
                      style={{
                        background: m.unlocked ? TIER_GRADIENT[m.tier] : 'rgba(30,41,59,0.3)',
                        borderColor: m.unlocked
                          ? ts.border.replace('border-', '').replace('/60', '').replace('amber-700', 'rgba(180,83,9,0.6)').replace('slate-400', 'rgba(148,163,184,0.5)').replace('yellow-500', 'rgba(234,179,8,0.5)').replace('violet-400', 'rgba(167,139,250,0.5)')
                          : 'rgba(71,85,105,0.3)',
                        opacity: m.unlocked ? 1 : 0.45,
                        boxShadow: m.unlocked ? `0 0 12px ${TIER_GLOW[m.tier]}` : 'none',
                      }}
                    >
                      <span className={`text-2xl shrink-0 ${m.unlocked ? '' : 'grayscale opacity-40'}`}>
                        {m.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold leading-tight truncate ${m.unlocked ? ts.text : 'text-slate-600'}`}>
                          {m.label}
                        </p>
                        <p className="text-[10px] text-slate-600 capitalize">{ts.label}</p>
                      </div>
                      {m.unlocked ? (
                        <span className={`text-xs font-black shrink-0 ${ts.text}`}>✓</span>
                      ) : (
                        <Lock className="w-3.5 h-3.5 shrink-0 text-slate-700" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        onBorderEquipped={() => fetchProfile()}
        initialData={{
          username: profile.username,
          birthday: profile.birthday ?? '',
          location: profile.location ?? '',
          bio: profile.bio ?? '',
          avatar: profile.avatar_id,
        }}
      />
      <AddFriendsModal
        isOpen={isAddFriendsOpen}
        onClose={() => setIsAddFriendsOpen(false)}
      />

      {/* Popup de Amigos (lista compacta) */}
      {isFriendsPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Amigos"
          onClick={(e) => { if (e.target === e.currentTarget) setIsFriendsPopupOpen(false); }}
        >
          <style>{`
            @keyframes friendsPopupEnter {
              from { opacity: 0; transform: scale(0.96) translateY(8px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
          <div
            className="relative w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.88) 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 20px 60px -12px rgba(0,0,0,0.7)',
              animation: 'friendsPopupEnter 0.2s ease-out',
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, #22d3ee, #3b82f6, transparent)' }}
            />

            {/* Header */}
            <div className="shrink-0 flex items-center gap-3 px-5 pt-5 pb-4 border-b border-white/8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,211,238,0.20), rgba(59,130,246,0.10))',
                  border: '1px solid rgba(34,211,238,0.30)',
                }}
              >
                <Users size={16} className="text-cyan-300" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-white text-base leading-tight">Seus amigos</h3>
                <p className="text-[11px] text-slate-500">
                  {friendsCount === null ? '…' : `${friendsCount} ${friendsCount === 1 ? 'pessoa' : 'pessoas'}`}
                </p>
              </div>
              <button
                onClick={() => { setIsFriendsPopupOpen(false); setIsAddFriendsOpen(true); }}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                  color: '#020617',
                }}
                title="Adicionar amigo"
              >
                <span className="text-base leading-none font-black">+</span>
                <span className="hidden sm:inline">Adicionar</span>
              </button>
              <button
                onClick={() => setIsFriendsPopupOpen(false)}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lista */}
            <div className="overflow-y-auto px-4 py-4">
              <FriendRequests
                onViewProfile={(username) => {
                  setIsFriendsPopupOpen(false);
                  setViewingFriend(username);
                }}
              />
            </div>
          </div>
        </div>
      )}
      <FriendProfileModal
        username={viewingFriend}
        onClose={() => setViewingFriend(null)}
      />
    </div>
  );
}
