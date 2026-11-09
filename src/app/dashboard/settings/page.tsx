'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { NotificationBell } from '@/components/NotificationBell';
import { UserMenu } from '@/components/UserMenu';
import {
  Settings,
  Bell,
  Download,
  Trash2,
  Save,
  Mail,
  User,
  Volume2,
  Play,
  Clock,
  Zap,
  Layout,
  Sun,
  Moon,
  Globe,
  Target,
  ChevronLeft,
} from 'lucide-react';

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
  soundEnabled: boolean;
  autoPlay: boolean;
  showTimer: boolean;
  hardMode: boolean;
  compactUi: boolean;
}

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        checked ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function SettingRow({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl glass-card hover:border-emerald-500/30 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-emerald-400">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-2xl glass-card overflow-hidden hover-lift">
      <div className={`absolute top-0 left-0 right-0 h-px ${accent}`} />
      <div className="px-6 py-5">
        <h2 className="text-base font-bold text-gradient mb-4 uppercase tracking-wide">{title}</h2>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings>({
    displayName: '',
    notifications: { email: true, milestones: true, weekly: true },
    preferences: { theme: 'dark', language: 'pt', dailyGoal: 20 },
    soundEnabled: true,
    autoPlay: false,
    showTimer: true,
    hardMode: false,
    compactUi: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && !settingsLoaded) {
      fetch('/api/user/settings')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setSettings({
              displayName: data.displayName ?? user.email?.split('@')[0] ?? '',
              notifications: data.notifications ?? { email: true, milestones: true, weekly: true },
              preferences: data.preferences ?? { theme: 'dark', language: 'pt', dailyGoal: 20 },
              soundEnabled: data.soundEnabled ?? true,
              autoPlay: data.autoPlay ?? false,
              showTimer: data.showTimer ?? true,
              hardMode: data.hardMode ?? false,
              compactUi: data.compactUi ?? false,
            });
            if (data.preferences?.theme) {
              setTheme(data.preferences.theme as 'dark' | 'light');
            }
          }
        })
        .catch(() => {
          setSettings(prev => ({
            ...prev,
            displayName: user.email?.split('@')[0] || 'Usuário',
          }));
        })
        .finally(() => setSettingsLoaded(true));
    }
  }, [user, isLoading, router, settingsLoaded, setTheme]);

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, theme: newTheme },
    }));
    setTheme(newTheme);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: settings.displayName,
          notifications: settings.notifications,
          preferences: settings.preferences,
          soundEnabled: settings.soundEnabled,
          autoPlay: settings.autoPlay,
          showTimer: settings.showTimer,
          hardMode: settings.hardMode,
          compactUi: settings.compactUi,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? 'Falha ao salvar');
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleExportData = () => {
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meus-dados-edrush.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navbar */}
      <nav className="glass-card border-b border-white/5 sticky top-0 z-50 px-4 sm:px-6 h-16 flex justify-between items-center backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-400 hover:text-emerald-400 transition hover-lift">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="text-lg font-black text-gradient">
            EDRUSH
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <UserMenu onLogout={handleLogout} />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Settings className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black text-gradient">Configurações</h1>
          </div>
          <p className="text-slate-400 text-sm ml-13 font-mono">// GERENCIE SUA CONTA E PREFERÊNCIAS</p>
        </div>

        {/* Feedback messages */}
        {saveSuccess && (
          <div className="mb-6 p-3 glass-card border border-emerald-500/30 bg-emerald-500/10 animate-slide-in-left">
            <p className="text-emerald-400 text-sm font-semibold flex items-center gap-2">
              <Save className="w-4 h-4" /> Configurações salvas com sucesso!
            </p>
          </div>
        )}
        {saveError && (
          <div className="mb-6 p-3 glass-card border border-red-500/30 bg-red-500/10 animate-slide-in-left">
            <p className="text-red-400 text-sm font-semibold">{saveError}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Perfil */}
          <SectionCard title="Perfil" accent="bg-gradient-to-r from-emerald-500 to-cyan-500">
            <SettingRow
              icon={<Mail className="w-4 h-4" />}
              title="Email"
              description="Não pode ser alterado"
            >
              <span className="text-xs text-slate-500 font-mono">{user.email}</span>
            </SettingRow>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                Nome de Exibição
              </label>
              <input
                type="text"
                value={settings.displayName}
                onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                className="w-full px-4 py-2.5 input-modern rounded-xl text-white placeholder-slate-500 transition text-sm outline-none"
                placeholder="Como quer ser chamado?"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Meta Diária (questões)
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={settings.preferences.dailyGoal}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, dailyGoal: parseInt(e.target.value) || 20 },
                  })
                }
                className="w-full px-4 py-2.5 input-modern rounded-xl text-white transition text-sm outline-none"
              />
            </div>
          </SectionCard>

          {/* Aparência */}
          <SectionCard title="Aparência" accent="bg-gradient-to-r from-violet-500 to-fuchsia-500">
            <div>
              <p className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-violet-400" /> : <Sun className="w-4 h-4 text-yellow-400" />}
                Tema
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all hover-lift ${
                    settings.preferences.theme === 'dark'
                      ? 'glass-card border-violet-500/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                      : 'bg-slate-900/30 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  Escuro
                </button>
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all hover-lift ${
                    settings.preferences.theme === 'light'
                      ? 'glass-card border-yellow-500/50 text-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                      : 'bg-slate-900/30 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  Claro
                </button>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Idioma
              </label>
              <select
                value={settings.preferences.language}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, language: e.target.value as 'pt' | 'en' },
                  })
                }
                className="w-full px-4 py-2.5 input-modern rounded-xl text-white transition text-sm outline-none appearance-none cursor-pointer"
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
              </select>
            </div>
          </SectionCard>

          {/* Quiz e Estudo */}
          <SectionCard title="Quiz e Estudo" accent="bg-gradient-to-r from-blue-500 to-cyan-500">
            <SettingRow
              icon={<Volume2 className="w-4 h-4" />}
              title="Sons do Quiz"
              description="Efeitos sonoros ao acertar ou errar"
            >
              <Toggle
                checked={settings.soundEnabled}
                onChange={(v) => setSettings({ ...settings, soundEnabled: v })}
              />
            </SettingRow>
            <SettingRow
              icon={<Play className="w-4 h-4" />}
              title="Avanço Automático"
              description="Passa para a próxima questão 3s após o feedback"
            >
              <Toggle
                checked={settings.autoPlay}
                onChange={(v) => setSettings({ ...settings, autoPlay: v })}
              />
            </SettingRow>
            <SettingRow
              icon={<Clock className="w-4 h-4" />}
              title="Mostrar Cronômetro"
              description="Exibe o tempo decorrido durante o quiz"
            >
              <Toggle
                checked={settings.showTimer}
                onChange={(v) => setSettings({ ...settings, showTimer: v })}
              />
            </SettingRow>
            <SettingRow
              icon={<Zap className="w-4 h-4" />}
              title="Modo Difícil"
              description="Perde 2 vidas ao errar em vez de 1"
            >
              <Toggle
                checked={settings.hardMode}
                onChange={(v) => setSettings({ ...settings, hardMode: v })}
              />
            </SettingRow>
            <SettingRow
              icon={<Layout className="w-4 h-4" />}
              title="Interface Compacta"
              description="Reduz o espaçamento para caber mais conteúdo"
            >
              <Toggle
                checked={settings.compactUi}
                onChange={(v) => setSettings({ ...settings, compactUi: v })}
              />
            </SettingRow>
          </SectionCard>

          {/* Notificações */}
          <SectionCard title="Notificações" accent="bg-gradient-to-r from-yellow-500 to-orange-500">
            <SettingRow
              icon={<Mail className="w-4 h-4" />}
              title="Notificações por Email"
              description="Receba atualizações importantes"
            >
              <Toggle
                checked={settings.notifications.email}
                onChange={(v) =>
                  setSettings({ ...settings, notifications: { ...settings.notifications, email: v } })
                }
              />
            </SettingRow>
            <SettingRow
              icon={<Bell className="w-4 h-4" />}
              title="Marcos Alcançados"
              description="Celebre seus objetivos completados"
            >
              <Toggle
                checked={settings.notifications.milestones}
                onChange={(v) =>
                  setSettings({ ...settings, notifications: { ...settings.notifications, milestones: v } })
                }
              />
            </SettingRow>
            <SettingRow
              icon={<Settings className="w-4 h-4" />}
              title="Relatório Semanal"
              description="Receba um resumo da sua semana"
            >
              <Toggle
                checked={settings.notifications.weekly}
                onChange={(v) =>
                  setSettings({ ...settings, notifications: { ...settings.notifications, weekly: v } })
                }
              />
            </SettingRow>
          </SectionCard>

          {/* Dados */}
          <SectionCard title="Dados" accent="bg-gradient-to-r from-teal-500 to-emerald-500">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 glass-card hover:bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-xl transition text-sm font-semibold hover-lift"
            >
              <Download className="w-4 h-4" />
              Exportar Meus Dados
            </button>
          </SectionCard>

          {/* Zona de Risco */}
          <SectionCard title="Zona de Risco" accent="bg-gradient-to-r from-red-600 to-rose-600">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 glass-card hover:bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl transition text-sm font-semibold hover-lift group">
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Deletar Conta
            </button>
            <p className="text-xs text-slate-500 text-center mt-2 font-mono">
              // AÇÃO IRREVERSÍVEL. TODOS OS DADOS SERÃO PURGADOS.
            </p>
          </SectionCard>
        </div>

        {/* Botão de Salvar */}
        <div className="mt-8 flex gap-3 justify-end animate-fade-in-up">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 glass-card hover:bg-white/5 border border-white/10 text-slate-300 rounded-xl transition text-sm font-semibold hover-lift"
          >
            Cancelar
          </Link>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-black text-slate-950 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover-lift shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}