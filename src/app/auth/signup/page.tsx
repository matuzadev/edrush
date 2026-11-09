'use client';

export const dynamic = 'force-dynamic';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { getGoogleSignInErrorMessage, startGoogleSignIn } from '@/lib/google-sign-in';
import { Suspense } from 'react';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
  BookOpen, BarChart2, Zap, CheckCircle2, AlertCircle, User, Gift
} from 'lucide-react';

const PERKS = [
  { icon: BookOpen,  title: 'Active Recall Automático',   desc: 'Revisão inteligente com ciclo 1-7-30 dias' },
  { icon: BarChart2, title: 'Analytics por matéria',      desc: 'Acompanhe acertos e evolução em tempo real' },
  { icon: Zap,       title: 'XP, níveis e medalhas',      desc: 'Gamificação que mantém você estudando todo dia' },
];

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard/onboarding';

  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      await startGoogleSignIn(redirect, true); // true indica signup
    } catch (err) {
      console.error('Erro no Google Sign-Up:', err);
      setError('Não foi possível iniciar o login com Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        name,
        redirect: false,
        action: 'signup',
      });

      if (result?.error) {
        setError('Erro ao criar conta. Verifique seus dados ou tente fazer login.');
      } else {
        router.push(`${redirect}?registered=true`);
        router.refresh();
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center gap-2 text-indigo-400 font-bold text-2xl">
              <Zap className="w-8 h-8" />
              <span>Foco Federal</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Crie sua conta</h1>
          <p className="text-slate-400">Comece sua preparação hoje mesmo</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 block">Nome Completo</label>
              <div className={`relative group transition-all duration-200 ${focusedField === 'name' ? 'ring-2 ring-indigo-500/50 rounded-lg' : ''}`}>
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Seu nome"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 block">Email</label>
              <div className={`relative group transition-all duration-200 ${focusedField === 'email' ? 'ring-2 ring-indigo-500/50 rounded-lg' : ''}`}>
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 block">Senha</label>
              <div className={`relative group transition-all duration-200 ${focusedField === 'password' ? 'ring-2 ring-indigo-500/50 rounded-lg' : ''}`}>
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-600/20 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Criar Conta <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-xs text-slate-500 uppercase">ou</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading}
            className="w-full bg-white hover:bg-slate-100 disabled:bg-slate-900 disabled:text-slate-600 text-slate-900 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 border border-slate-200 hover:border-slate-300 active:scale-[0.98]"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M21.35 11.1h-9.18v2.73h5.51c-.24 1.27-.98 2.34-2.09 3.06v2.54h3.39c1.98-1.83 3.13-4.52 3.13-7.61 0-.73-.07-1.44-.2-2.12z"/>
                  <path fill="#34A853" d="M12.17 22c2.83 0 5.21-.94 6.95-2.56l-3.39-2.54c-.94.63-2.15 1-3.56 1-2.74 0-5.06-1.85-5.89-4.33H2.77v2.62C4.5 19.48 8.12 22 12.17 22z"/>
                  <path fill="#FBBC05" d="M6.28 13.57a6.34 6.34 0 0 1 0-4.14L2.77 6.81a10.01 10.01 0 0 0 0 9.38l3.51-2.62z"/>
                  <path fill="#EA4335" d="M12.17 5.9c1.54 0 2.93.53 4.03 1.58l3.01-3.01C17.38 2.7 14.99 1.8 12.17 1.8 8.12 1.8 4.5 4.32 2.77 7.81l3.51 2.62c.83-2.48 3.15-4.33 5.89-4.33z"/>
                </svg>
                Continuar com Google
              </>
            )}
          </button>
        </div>

        {/* Footer Links */}
        <p className="text-center text-slate-400 mt-6">
          Já tem uma conta?{' '}
          <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}