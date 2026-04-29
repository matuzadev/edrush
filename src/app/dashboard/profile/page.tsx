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
import {
  LogOut,
  ChevronLeft,
  Calendar,
  MapPin,
  Award,
  Users,
  Edit,
  Code,
  Trophy,
  Zap,
  BookOpen,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const { profile, updateProfile, completeChapter } = usUserProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddFriendsOpen, setIsAddFriendsOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleSaveProfile = (data: any) => {
    updateProfile(data);
  };

  const handleAddFriend = (userId: string, username: string) => {
    // Aqui você pode salvar o amigo no banco de dados
    console.log(`Amigo adicionado: ${username} (${userId})`);
  };

  const formatAccountAge = () => {
    const createdDate = new Date(profile.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} dias`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} ano${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
  };

  const formatBirthday = (date?: string) => {
    if (!date) return 'Não definido';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
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

        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-400 transition"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Info Principal */}
          <div className="md:col-span-1 space-y-6">
            {/* Card Principal */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 text-center">
              {/* Avatar */}
              <div className="mb-6 flex justify-center">
                <AvatarSelector selectedId={profile.avatar} size="lg" />
              </div>

              {/* Username */}
              <h2 className="text-2xl font-black text-white mb-1">{profile.username}</h2>

              {/* ID */}
              <p className="text-slate-400 text-sm font-mono mb-4">{profile.id}</p>

              {/* Bio */}
              {profile.bio && (
                <p className="text-slate-300 text-sm mb-6 italic">{profile.bio}</p>
              )}

              {/* Botão Editar */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-bold transition flex items-center justify-center gap-2 mb-4"
              >
                <Edit className="w-4 h-4" />
                Editar Perfil
              </button>

              {/* Divisor */}
              <div className="my-6 h-px bg-white/5" />

              {/* Info Cards */}
              <div className="space-y-3">
                {/* Localização */}
                <div className="flex items-center gap-3 text-left p-3 bg-slate-800/50 rounded-lg border border-white/5">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-slate-400 text-xs uppercase tracking-widest">Localização</p>
                    <p className="text-white font-medium">{profile.location || 'Não definido'}</p>
                  </div>
                </div>

                {/* Aniversário */}
                <div className="flex items-center gap-3 text-left p-3 bg-slate-800/50 rounded-lg border border-white/5">
                  <Calendar className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-slate-400 text-xs uppercase tracking-widest">Aniversário</p>
                    <p className="text-white font-medium">{formatBirthday(profile.birthday)}</p>
                  </div>
                </div>

                {/* Tempo de Conta */}
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
                <h3 className="text-white font-bold">Medalhas ({profile.medals})</h3>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(Math.max(profile.medals, 5))].map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-2xl ${
                      i < profile.medals
                        ? 'bg-gradient-to-br from-yellow-500 to-amber-600 border-2 border-yellow-400'
                        : 'bg-slate-800 border-2 border-white/5 text-slate-600'
                    }`}
                  >
                    {i < profile.medals ? '🏅' : '?'}
                  </div>
                ))}
              </div>
            </div>

            {/* Botão Adicionar Amigos */}
            <button
              onClick={() => setIsAddFriendsOpen(true)}
              className="w-full py-3 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 rounded-lg font-bold transition flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Adicionar Amigos
            </button>
          </div>

          {/* Coluna Direita - Estatísticas e Atividade */}
          <div className="md:col-span-2 space-y-8">
            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-4">
              {/* Total de Questões */}
              <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span className="text-2xl font-black text-emerald-400">{profile.totalQuestionsAnswered}</span>
                </div>
                <p className="text-slate-400 text-sm uppercase tracking-widest">Questões Respondidas</p>
              </div>

              {/* Questões Corretas */}
              <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-black text-yellow-400">{profile.totalQuestionsCorrect}</span>
                </div>
                <p className="text-slate-400 text-sm uppercase tracking-widest">Acertos</p>
              </div>
            </div>

            {/* Histórico de Atividade (GitHub Style) */}
            <ActivityCalendar
              activityLog={profile.activityLog}
              title="Histórico de Atividades - 30 Dias"
            />

            {/* Info Card */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <p className="text-slate-300 text-sm">
                <span className="font-bold text-emerald-400">Dica:</span> Continue completando capítulos para manter sua sequência de estudos e ganhar mais medalhas! Quanto mais consistente, mais rápida será sua aprovação.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modais */}
      <div>
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
          initialData={{
            username: profile.username,
            birthday: profile.birthday,
            location: profile.location,
            bio: profile.bio,
            avatar: profile.avatar,
          }}
        />

        <AddFriendsModal
          isOpen={isAddFriendsOpen}
          onClose={() => setIsAddFriendsOpen(false)}
          onAddFriend={handleAddFriend}
        />
      </div>
    </div>
  );
}
