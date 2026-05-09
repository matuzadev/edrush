'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
<<<<<<< HEAD
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
=======
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Suspense } from 'react';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
  BookOpen, BarChart2, Zap, CheckCircle2, AlertCircle
} from 'lucide-react';
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9

const PERKS = [
  { icon: BookOpen,  title: 'Active Recall Automático',   desc: 'Revisão inteligente com ciclo 1-7-30 dias' },
  { icon: BarChart2, title: 'Analytics por matéria',      desc: 'Acompanhe acertos e evolução em tempo real' },
  { icon: Zap,       title: 'XP, níveis e medalhas',      desc: 'Gamificação que mantém você estudando todo dia' },
];

function LoginForm() {
  const router = useRouter();
<<<<<<< HEAD
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
=======
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const justRegistered = searchParams.get('registered') === 'true';

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
<<<<<<< HEAD
        setError('Email ou senha incorretos');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
=======
        setError('Email ou senha incorretos. Verifique seus dados.');
      } else {
        router.push(redirect);
        router.refresh();
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: redirect });
  };

  return (
<<<<<<< HEAD
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Lado esquerdo */}
        <div className="auth-gradient-side">
          <div className="auth-content-left">
            <div className="auth-logo">
              <Link href="/" className="no-underline">
                <Image
                  src="/imagens/foco-federal-logo-removebg.png"
                  alt="Foco Federal Logo"
                  width={150}
                  height={150}
                  quality={80}
                  priority
                  className="mx-auto"
                />
              </Link>
              <h2 className="text-xl font-black text-white mt-3">Foco Federal</h2>
=======
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">

      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/3 -left-1/4 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute -bottom-1/3 -right-1/4 w-[500px] h-[500px] bg-blue-500/7 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '13s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* ── Left side ─────────────────────────────────────────────────── */}
          <div className="hidden lg:flex flex-col gap-10">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 w-fit group">
              <Image src="/imagens/foco-federal-logo-removebg.png" alt="Logo" width={44} height={44} />
              <span className="text-2xl font-black text-white">
                Foco<span className="text-emerald-400">Federal</span>
              </span>
            </Link>

            {/* Headline */}
            <div>
              <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">Plataforma de concursos</p>
              <h2 className="text-4xl font-black text-white leading-tight mb-4">
                Continue sua<br />
                <span className="text-emerald-400">jornada</span> de estudos
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Acesse suas questões, acompanhe seu progresso e continue subindo de nível.
              </p>
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
            </div>

            {/* Perks */}
            <div className="space-y-4">
              {PERKS.map((perk, i) => {
                const Icon = perk.icon;
                return (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-emerald-500/20 transition-all">
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{perk.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{perk.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

<<<<<<< HEAD
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 100-2 4 4 0 00-4 4v9a4 4 0 004 4h12a4 4 0 004-4V5a4 4 0 00-4-4 1 1 0 100 2 2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Active Recall Automático</p>
                  <p className="text-xs text-slate-300">Revisão inteligente baseada em ciência</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Analytics em Tempo Real</p>
                  <p className="text-xs text-slate-300">Acompanhe seu progresso por matéria</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Dashboard Personalizado</p>
                  <p className="text-xs text-slate-300">Interface adaptada para seus objetivos</p>
                </div>
=======
            {/* Social proof */}
            <div className="flex items-center gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="flex -space-x-2 flex-shrink-0">
                {['#10b981','#3b82f6','#f59e0b','#8b5cf6'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] flex items-center justify-center text-xs font-bold" style={{ backgroundColor: c + '30', borderColor: '#020617' }}>
                    <span style={{ color: c }}>✦</span>
                  </div>
                ))}
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
              </div>
              <p className="text-sm text-slate-400">
                <span className="text-white font-bold">847 estudantes</span> ativos na plataforma agora
              </p>
              <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400 font-semibold flex-shrink-0">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                ao vivo
              </span>
            </div>
          </div>

          {/* ── Right side — form ──────────────────────────────────────────── */}
          <div>
            {/* Mobile logo */}
            <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
              <Image src="/imagens/foco-federal-logo-removebg.png" alt="Logo" width={36} height={36} />
              <span className="text-xl font-black text-white">Foco<span className="text-emerald-400">Federal</span></span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/8 rounded-3xl p-8 shadow-2xl">

              {/* Header */}
              <div className="mb-7">
                <h1 className="text-2xl font-black text-white mb-1">Bem-vindo de volta</h1>
                <p className="text-slate-500 text-sm">Entre na sua conta para continuar</p>
              </div>

              {/* Success message */}
              {justRegistered && (
                <div className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-5">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  <p className="text-emerald-300 text-sm font-medium">Conta criada! Faça login para continuar.</p>
                </div>
              )}

<<<<<<< HEAD
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Senha</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex justify-end text-sm">
                <Link href="#" className="text-emerald-400 hover:text-emerald-300 transition">
                  Esqueci a senha
                </Link>
              </div>
=======
              {/* Error message */}
              {error && (
                <div className="flex items-center gap-3 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl mb-5">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm font-medium">{error}</p>
                </div>
              )}
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9

              {/* Google OAuth */}
              <button
<<<<<<< HEAD
                type="submit"
                disabled={isSubmitting}
                className="btn-submit w-full"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
=======
                type="button"
                onClick={handleGoogle}
                disabled={isGoogleLoading || isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-2xl transition-all text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed mb-5"
              >
                {isGoogleLoading ? (
                  <Loader2 size={18} className="animate-spin text-slate-400" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                )}
                {isGoogleLoading ? 'Redirecionando...' : 'Continuar com Google'}
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
              </button>

<<<<<<< HEAD
            <p className="text-center text-slate-400 text-sm mt-6">
              Não tem conta?{' '}
              <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold transition">
                Cadastre-se gratuitamente
              </Link>
            </p>
=======
              {/* Divider */}
              <div className="relative flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-slate-600 text-xs font-medium">ou entre com email</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                        focusedField === 'email' ? 'text-emerald-400' : 'text-slate-600'
                      }`}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="seu@email.com"
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/8 rounded-xl text-white text-sm outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Senha</label>
                    <Link href="#" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">
                      Esqueci a senha
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      size={16}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                        focusedField === 'password' ? 'text-emerald-400' : 'text-slate-600'
                      }`}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full pl-11 pr-12 py-3.5 bg-white/[0.03] border border-white/8 rounded-xl text-white text-sm outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-400 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || isGoogleLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-4 mt-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-sm uppercase tracking-wide rounded-2xl transition-all hover:scale-[1.01] hover:shadow-[0_8px_32px_rgba(16,185,129,0.4)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar na conta
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-slate-500 text-sm mt-6">
                Não tem conta?{' '}
                <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                  Criar conta grátis
                </Link>
              </p>
            </div>
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
          </div>

        </div>
      </div>
<<<<<<< HEAD

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #030712 0%, #0f172a 100%);
          padding: 20px;
        }

        .auth-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(51, 65, 85, 0.3);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          max-width: 650px;
          width: 95%;
        }

        .auth-gradient-side {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
          border-right: 1px solid rgba(51, 65, 85, 0.3);
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .auth-logo {
          text-align: center;
        }

        .auth-benefits {
          margin-top: 40px;
        }

        .benefit-item {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .benefit-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          background: rgba(16, 185, 129, 0.15);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10b981;
        }

        .auth-form-side {
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .auth-form-wrapper {
          width: 100%;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #f8fafc;
        }

        .form-input {
          padding: 12px 16px;
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 10px;
          color: #f8fafc;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-input:focus {
          outline: none;
          background: rgba(30, 41, 59, 1);
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .form-input::placeholder {
          color: #64748b;
        }

        .btn-submit {
          padding: 12px 24px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(16, 185, 129, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .auth-wrapper {
            grid-template-columns: 1fr;
          }

          .auth-gradient-side {
            border-right: none;
            border-bottom: 1px solid rgba(51, 65, 85, 0.3);
            padding: 40px 30px;
          }

          .auth-form-side {
            padding: 40px 30px;
          }

          .auth-benefits {
            margin-top: 20px;
          }
        }
      `}</style>
=======
>>>>>>> c0f05f4d6084f1210efa389d9dad642f1327a8d9
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
      <LoginForm />
    </Suspense>
  );
}
