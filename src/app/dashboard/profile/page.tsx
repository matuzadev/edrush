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
import {
  LogOut,
  ChevronLeft,
  Calendar,
  MapPin,
  Award,
  Users,
  Edit,
  Trophy,
  Zap,
  BookOpen,
  Target,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading, error, updateProfile } = usUserProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddFriendsOpen, setIsAddFriendsOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleSaveProfile = async (data: {
    username: string;
    birthday: string;
    location: string;
    bio: string;
    avatar: number;
  }) => {
    setSaveError(null);
    try {
      await updateProfile({
        username: data.username,
        bio: data.bio,
        birthday: data.birthday || undefined,
        location: data.location,
        avatar_id: data.avatar,
      });
    } catch (err: any) {
      setSaveError(err?.message ?? 'Erro ao salvar perfil');
    }
  };

  const formatAccountAge = () => {
    if (!profile.criado_em) return '';
    const createdDate = new Date(profile.criado_em);
    const today = new Date();
    const diffDays = Math.ceil((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 30) return `${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} mes${Math.floor(diffDays / 30) > 1 ? 'es' : ''}`;
    const years = Math.floor(diffDays / 365);
    return `${years} ano${years > 1 ? 's' : ''}`;
  };

  const formatBirthday = (date?: string | null) => {
    if (!date) return 'Não definido';
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const displayName = profile.username || profile.nome || 'Concurseiro';
  const isLoading = authLoading || profileLoading;

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Header */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            MEU PERFIL
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {profileLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
          </div>
        ) : error ? (
          <div className="text-center py-24 text-slate-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna Esquerda */}
            <div className="md:col-span-1 space-y-6">
              {/* Card Principal */}
              <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <AvatarSelector selectedId={profile.avatar_id} size="lg" />
                </div>

                <h2 className="text-2xl font-black text-white mb-1">{displayName}</h2>
                <p className="text-slate-400 text-sm mb-1">{profile.email || user.email}</p>

                {profile.bio && (
                  <p className="text-slate-300 text-sm mb-4 italic">{profile.bio}</p>
                )}

                {saveError && (
                  <p className="text-red-400 text-xs mb-3">{saveError}</p>
                )}

                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-bold transition flex items-center justify-center gap-2 mb-4"
                >
                  <Edit className="w-4 h-4" />
                  Editar Perfil
                </button>

                <div className="my-6 h-px bg-white/5" />

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-left p-3 bg-slate-800/50 rounded-lg border border-white/5">
                    <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-slate-400 text-xs uppercase tracking-widest">Localização</p>
                      <p className="text-white font-medium">{profile.location || 'Não definido'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-left p-3 bg-slate-800/50 rounded-lg border border-white/5">
                    <Calendar className="w-5 h-5 text-pink-400 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-slate-400 text-xs uppercase tracking-widest">Aniversário</p>
                      <p className="text-white font-medium">{formatBirthday(profile.birthday)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-left p-3 bg-slate-800/50 rounded-lg border border-white/5">
                    <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-slate-400 text-xs uppercase tracking-widest">Na Plataforma</p>
                      <p className="text-white font-medium">{formatAccountAge()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medalhas */}
              <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-white font-bold">
                    Medalhas ({profile.medals}/{profile.achievements.length})
                  </h3>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {profile.achievements.map((achievement, i) => (
                    <div
                      key={achievement.id}
                      title={`${achievement.label}: ${achievement.description}`}
                      className={`aspect-square rounded-lg flex items-center justify-center text-xl cursor-help ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-500 to-amber-600 border-2 border-yellow-400'
                          : 'bg-slate-800 border-2 border-white/5 text-slate-600'
                      }`}
                    >
                      {achievement.unlocked ? '🏅' : '?'}
                    </div>
                  ))}
                </div>
                {profile.achievements.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {profile.achievements
                      .filter(a => a.unlocked)
                      .slice(0, 3)
                      .map(a => (
                        <p key={a.id} className="text-xs text-emerald-400">
                          {a.label} — {a.description}
                        </p>
                      ))}
                  </div>
                )}
              </div>

              {/* Adicionar Amigos */}
              <button
                onClick={() => setIsAddFriendsOpen(true)}
                className="w-full py-3 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 rounded-lg font-bold transition flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Adicionar Amigos
              </button>

              {/* Lista de Amigos e Solicitações */}
              <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-white font-bold">Amigos</h3>
                </div>
                <FriendRequests />
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="md:col-span-2 space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    <span className="text-2xl font-black text-emerald-400">
                      {profile.totalQuestionsAnswered}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm uppercase tracking-widest">Questões Respondidas</p>
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-black text-yellow-400">
                      {profile.totalQuestionsCorrect}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm uppercase tracking-widest">Acertos</p>
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span className="text-2xl font-black text-cyan-400">{profile.accuracy}%</span>
                  </div>
                  <p className="text-slate-400 text-sm uppercase tracking-widest">Taxa de Acerto</p>
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    <span className="text-2xl font-black text-orange-400">{profile.streak}</span>
                  </div>
                  <p className="text-slate-400 text-sm uppercase tracking-widest">
                    {profile.streak === 1 ? 'Dia Seguido' : 'Dias Seguidos'}
                  </p>
                </div>
              </div>

              {/* Histórico de Atividade */}
              <ActivityCalendar
                activityLog={profile.activityLog}
                title="Histórico de Atividades - 30 Dias"
              />

              {/* Dica */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6">
                <p className="text-slate-300 text-sm">
                  <span className="font-bold text-emerald-400">Dica:</span> Continue completando sessoes
                  de estudo para manter sua sequencia e ganhar mais medalhas. Consistencia e o caminho
                  mais rapido para a aprovacao.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <div>
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
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
      </div>
    </div>
  );
}
