'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/NotificationBell';
import { Settings, Bell, Lock, Download, Trash2, LogOut, Save, Mail, User } from 'lucide-react';

interface UserSettings {
  displayName: string;
  notifications: {
    email: boolean;
    milestones: boolean;
    weekly: boolean;
  };
  preferences: {
    theme: 'dark' | 'light';
    language: 'pt' | 'en';
    dailyGoal: number;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    displayName: '',
    notifications: { email: true, milestones: true, weekly: true },
    preferences: { theme: 'dark', language: 'pt', dailyGoal: 20 },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }

    // Mock load settings
    if (user) {
      setSettings(prev => ({
        ...prev,
        displayName: user.email?.split('@')[0] || 'Usuário',
      }));
    }
  }, [user, isLoading, router]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaveSuccess(true);
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleExportData = () => {
    // Mock export
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-data.json';
    a.click();
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]">
      {/* Navbar */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold text-white hover:text-emerald-400 transition">
                Foco Federal
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition">Dashboard</Link>
                <Link href="/dashboard/spreadsheet" className="text-slate-400 hover:text-white transition">Planilha</Link>
                <Link href="/dashboard/analytics" className="text-slate-400 hover:text-white transition">Análises</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="w-10 h-10 text-emerald-400" />
            Configurações
          </h1>
          <p className="text-slate-400">Gerencie sua conta e preferências</p>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <p className="text-emerald-400 text-sm font-semibold">✓ Configurações salvas com sucesso!</p>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-[#0f172a] border border-white/5 rounded-lg p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              Perfil
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-4 py-2 bg-slate-900/30 border border-white/10 rounded-lg text-slate-400 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-2">Não pode ser alterado</p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Nome de Exibição</label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => setSettings({...settings, displayName: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500/50 text-white placeholder-slate-500 transition"
                />
              </div>

              {/* Daily Goal */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Meta Diária (questões)</label>
                <input
                  type="number"
                  value={settings.preferences.dailyGoal}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: {...settings.preferences, dailyGoal: parseInt(e.target.value)}
                  })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500/50 text-white placeholder-slate-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-[#0f172a] border border-white/5 rounded-lg p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              Notificações
            </h2>

            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-white/5">
                <div>
                  <p className="text-white font-medium">Notificações por Email</p>
                  <p className="text-sm text-slate-400">Receba atualizações importantes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {...settings.notifications, email: e.target.checked}
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Milestones */}
              <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-white/5">
                <div>
                  <p className="text-white font-medium">Marcos Alcançados</p>
                  <p className="text-sm text-slate-400">Celebre seus objetivos completados</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.milestones}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {...settings.notifications, milestones: e.target.checked}
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Weekly Report */}
              <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-white/5">
                <div>
                  <p className="text-white font-medium">Relatório Semanal</p>
                  <p className="text-sm text-slate-400">Receba um resumo de sua semana</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.weekly}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {...settings.notifications, weekly: e.target.checked}
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-[#0f172a] border border-white/5 rounded-lg p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" />
              Preferências
            </h2>

            <div className="space-y-6">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Idioma</label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: {...settings.preferences, language: e.target.value as any}
                  })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500/50 text-white transition"
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Tema</label>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: {...settings.preferences, theme: e.target.value as any}
                  })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500/50 text-white transition"
                >
                  <option value="dark">Escuro (padrão)</option>
                  <option value="light">Claro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Section */}
          <div className="bg-[#0f172a] border border-white/5 rounded-lg p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Download className="w-5 h-5 text-yellow-400" />
              Dados
            </h2>

            <div className="space-y-4">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg transition font-semibold"
              >
                <Download className="w-4 h-4" />
                Exportar Meus Dados
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#0f172a] border border-red-500/20 rounded-lg p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Zona de Risco
            </h2>

            <button className="w-full px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition font-semibold">
              Deletar Conta
            </button>
            <p className="text-xs text-slate-500 mt-3">
              Esta ação não pode ser desfeita. Todos seus dados serão permanentemente removidos.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-12 flex gap-4 justify-end">
          <button className="px-6 py-3 bg-slate-900/50 hover:bg-slate-900 border border-white/10 text-slate-300 rounded-lg transition font-semibold">
            Cancelar
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </main>
    </div>
  );
}
