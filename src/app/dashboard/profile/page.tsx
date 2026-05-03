'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usUserProfile } from '@/hooks/useProfile';
import { AvatarSelector } from '@/components/AvatarSelector';
import { ActivityCalendar } from '@/components/ActivityCalendar';
import { AddFriendsModal } from '@/components/AddFriendsModal';
import { EditProfileModal } from '@/components/EditProfileModal';
import { FriendRequests } from '@/components/FriendRequests';
import { NotificationBell } from '@/components/NotificationBell';
import { TIER_STYLE, MEDAL_CATEGORIES } from '@/lib/levels';
import type { Medal } from '@/lib/levels';
import { ChevronLeft, MapPin, Calendar, Users, Edit, BookOpen, Target, Zap, LogOut, Copy, Check, Gift, ArrowRight } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, error, updateProfile } = usUserProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddFriendsOpen, setIsAddFriendsOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  const handleSaveProfile = async (data: { username: string; birthday: string; location: string; bio: string; avatar: number }) => {
    setSaveError(null);
    try {
      await updateProfile({ username: data.username, bio: data.bio, birthday: data.birthday || undefined, location: data.location, avatar_id: data.avatar });
    } catch (err: any) {
      setSaveError(err?.message ?? 'Erro ao salvar perfil');
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
  const filteredMedals: Medal[] = activeCategory === 'Todos'
    ? profile.achievements
    : profile.achievements.filter(m => m.category === activeCategory);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Header */}
      <nav className="bg-[#020617]/90 backdrop-blur border-b border-white/5 sticky top-0 z-50 px-4 h-14 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-white">Meu Perfil</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <button onClick={() => { signOut(); router.push('/'); }} className="text-slate-500 hover:text-red-400 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {profileLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-24 text-slate-400">{error}</div>
        ) : (
          <div className="space-y-6">

            {/* ── Hero card ── */}
            <div className="bg-slate-900 border border-white/8 rounded-2xl overflow-hidden">
              <div className="h-20 bg-gradient-to-br from-emerald-900/50 via-slate-900 to-slate-900" />
              <div className="px-5 pb-5 -mt-10">
                <div className="flex items-end justify-between mb-4">
                  <div className="relative">
                    <AvatarSelector selectedId={profile.avatar_id} size="lg" />
                    <div className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-xs font-black border ${profile.levelBg} ${profile.levelBorder} ${profile.levelColor}`}>
                      Nv {profile.level}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pb-1">
                    <button
                      onClick={copyProfileUrl}
                      className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/40 rounded-lg px-2.5 py-1.5 transition"
                      title="Copiar link do perfil"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copiado!' : 'Compartilhar'}
                    </button>
                    <Link
                      href={`/perfil/${encodeURIComponent(displayName)}`}
                      target="_blank"
                      className="text-xs text-slate-500 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/40 rounded-lg px-2.5 py-1.5 transition"
                    >
                      Ver público →
                    </Link>
                  </div>
                </div>

                <h2 className="text-xl font-black text-white">{displayName}</h2>
                <p className="text-slate-500 text-xs">/perfil/{displayName}</p>
                {profile.bio && <p className="text-slate-300 text-sm mt-2 leading-relaxed italic">{profile.bio}</p>}

                {/* Level + XP bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black ${profile.levelColor}`}>{profile.levelName}</span>
                      <span className="text-xs text-slate-600">Nível {profile.level}</span>
                    </div>
                    <span className="text-xs text-slate-500">{profile.xp.toLocaleString('pt-BR')} XP</span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700"
                      style={{ width: `${profile.xpProgressPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-slate-600">
                    <span>{profile.xpIntoLevel} / {profile.xpNeeded} XP</span>
                    <span>+{profile.xpNeeded - profile.xpIntoLevel} para Nível {profile.level + 1}</span>
                  </div>
                </div>

                {saveError && <p className="text-red-400 text-xs mt-2">{saveError}</p>}

                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="mt-4 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Editar Perfil
                </button>
              </div>
            </div>

            {/* ── Info ── */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { icon: <MapPin className="w-4 h-4 text-cyan-400" />, label: 'Localização', value: profile.location || 'Não definido' },
                { icon: <Calendar className="w-4 h-4 text-pink-400" />, label: 'Aniversário', value: formatBirthday(profile.birthday) },
                { icon: <Zap className="w-4 h-4 text-yellow-400" />, label: 'Na plataforma', value: formatAccountAge() },
              ].map(item => (
                <div key={item.label} className="bg-slate-900 border border-white/8 rounded-xl p-3">
                  {item.icon}
                  <p className="text-white font-semibold text-sm mt-1 truncate">{item.value}</p>
                  <p className="text-slate-600 text-xs uppercase tracking-wide mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <BookOpen className="w-4 h-4" />, label: 'Questões', value: profile.totalQuestionsAnswered.toLocaleString('pt-BR'), color: 'text-emerald-400' },
                { icon: <Target className="w-4 h-4" />, label: 'Precisão', value: `${profile.accuracy}%`, color: profile.accuracy >= 80 ? 'text-emerald-400' : profile.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400' },
                { icon: <Zap className="w-4 h-4" />, label: 'Sequência', value: `${profile.streak}d`, color: 'text-orange-400' },
                { icon: <span className="text-sm">🏅</span>, label: 'Medalhas', value: `${profile.medals}/${profile.totalMedals}`, color: 'text-yellow-400' },
              ].map(s => (
                <div key={s.label} className="bg-slate-900 border border-white/8 rounded-2xl p-4">
                  <div className={`mb-1 ${s.color}`}>{s.icon}</div>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-slate-600 text-xs uppercase tracking-wide mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* ── Referral mini card ── */}
            <Link
              href="/dashboard/referral"
              className="flex items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/30 to-slate-900/50 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl px-5 py-4 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Gift size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Programa de Indicação</p>
                  <p className="text-slate-500 text-xs">Indique amigos e ganhe meses grátis</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
            </Link>

            {/* ── Medals ── */}
            <div className="bg-slate-900 border border-white/8 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Medalhas</h3>
                <span className="text-xs text-slate-500">{profile.medals} / {profile.totalMedals} desbloqueadas</span>
              </div>

              {/* Category filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                      activeCategory === cat
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {filteredMedals.map(m => {
                  const ts = TIER_STYLE[m.tier];
                  return (
                    <div
                      key={m.id}
                      title={m.description}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all ${
                        m.unlocked
                          ? `${ts.bg} ${ts.border} shadow-sm`
                          : 'bg-slate-800/40 border-slate-700/50 opacity-45'
                      }`}
                    >
                      <span className={`text-2xl shrink-0 ${m.unlocked ? '' : 'grayscale'}`}>{m.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold leading-tight truncate ${m.unlocked ? ts.text : 'text-slate-600'}`}>{m.label}</p>
                        <p className="text-xs text-slate-600 capitalize">{ts.label}</p>
                      </div>
                      {m.unlocked && <span className={`text-xs font-bold shrink-0 ${ts.text}`}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Activity ── */}
            <ActivityCalendar activityLog={profile.activityLog} title="Histórico de Atividade — 30 dias" />

            {/* ── Friends ── */}
            <div className="bg-slate-900 border border-white/8 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-white">Amigos</h3>
                </div>
                <button
                  onClick={() => setIsAddFriendsOpen(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 rounded-lg px-2.5 py-1 transition"
                >
                  + Adicionar
                </button>
              </div>
              <FriendRequests />
            </div>
          </div>
        )}
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={{ username: profile.username, birthday: profile.birthday ?? '', location: profile.location ?? '', bio: profile.bio ?? '', avatar: profile.avatar_id }}
      />
      <AddFriendsModal isOpen={isAddFriendsOpen} onClose={() => setIsAddFriendsOpen(false)} />
    </div>
  );
}
