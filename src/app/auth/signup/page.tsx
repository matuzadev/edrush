"use client";

import { useState, FormEvent, useMemo, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  User, Mail, Lock, CheckCircle2, ArrowRight, Loader2,
  Eye, EyeOff, AlertCircle, Gift, BookOpen, BarChart2,
  Zap, Trophy, Target, AtSign, Calendar, MapPin, XCircle
} from 'lucide-react';

// ─── password strength ────────────────────────────────────────────────────────
function calcStrength(pwd: string) {
  let s = 0;
  if (pwd.length >= 8)                                    s++;
  if (/[A-Z]/.test(pwd))                                  s++;
  if (/[a-z]/.test(pwd))                                  s++;
  if (/[0-9]/.test(pwd))                                  s++;
  if (/[!@#$%^&*()\-_+=\[\]{};':"\\|,.<>\/?]/.test(pwd)) s++;
  if (!/(.)\1{2,}/.test(pwd))                             s++;
  if (!/^(password|123|qwerty)/i.test(pwd))               s++;
  if (s <= 2) return { score: 1, label: 'Fraca',      bar: 'bg-red-500',    text: 'text-red-400' };
  if (s <= 4) return { score: 2, label: 'Média',      bar: 'bg-yellow-500', text: 'text-yellow-400' };
  if (s <= 6) return { score: 3, label: 'Forte',      bar: 'bg-blue-500',   text: 'text-blue-400' };
  return            { score: 4, label: 'Muito Forte', bar: 'bg-emerald-500', text: 'text-emerald-400' };
}

const PERKS = [
  { icon: BookOpen,  title: '12.000+ questões comentadas', desc: 'Para todos os concursos do Brasil' },
  { icon: BarChart2, title: 'Analytics por matéria',       desc: 'Acompanhe acertos em tempo real' },
  { icon: Trophy,    title: 'XP, níveis e medalhas',       desc: 'Gamificação que te mantém motivado' },
  { icon: Target,    title: 'Active Recall ciclo 1-7-30',  desc: 'Revisão espaçada automática' },
];

// username status type
type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

function SignupForm() {
  const router       = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();

  // ── fields ──
  const [fullName,            setFullName]            = useState('');
  const [username,            setUsername]            = useState('');
  const [email,               setEmail]               = useState('');
  const [confirmEmail,        setConfirmEmail]        = useState('');
  const [birthday,            setBirthday]            = useState('');
  const [location,            setLocation]            = useState('');
  const [password,            setPassword]            = useState('');
  const [confirmPassword,     setConfirmPassword]     = useState('');
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField,        setFocusedField]        = useState<string | null>(null);
  const [touched,             setTouched]             = useState<Record<string, boolean>>({});
  const [error,               setError]               = useState('');
  const [isSubmitting,        setIsSubmitting]        = useState(false);
  const [isGoogleLoading,     setIsGoogleLoading]     = useState(false);
  const [showSuccess,         setShowSuccess]         = useState(false);
  const [referralCode,        setReferralCode]        = useState<string | null>(null);
  const [usernameStatus,      setUsernameStatus]      = useState<UsernameStatus>('idle');
  const [usernameTimer,       setUsernameTimer]       = useState<ReturnType<typeof setTimeout> | null>(null);

  // ── referral ──
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) { setReferralCode(ref); localStorage.setItem('ff_ref', ref); }
    else { const s = localStorage.getItem('ff_ref'); if (s) setReferralCode(s); }
  }, [searchParams]);

  // ── username debounced check ──
  const checkUsername = useCallback((val: string) => {
    if (usernameTimer) clearTimeout(usernameTimer);
    const trimmed = val.trim();
    if (!trimmed) { setUsernameStatus('idle'); return; }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(trimmed)) { setUsernameStatus('invalid'); return; }
    setUsernameStatus('checking');
    const t = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/users/check-username?username=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setUsernameStatus(data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 500);
    setUsernameTimer(t);
  }, [usernameTimer]);

  // ── derived ──
  const strength    = useMemo(() => calcStrength(password), [password]);
  const emailOk     = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const emailsMatch = email && confirmEmail ? email.toLowerCase() === confirmEmail.toLowerCase() : true;
  const pwdMatch    = password && confirmPassword ? password === confirmPassword : true;

  const usernameOk = usernameStatus === 'available' || usernameStatus === 'idle' || usernameStatus === 'checking';

  const formValid = useMemo(() =>
    fullName.trim().length > 0 &&
    username.trim().length >= 3 &&
    usernameOk &&
    emailOk &&
    email.toLowerCase() === confirmEmail.toLowerCase() &&
    confirmEmail.length > 0 &&
    password.length >= 8 &&
    pwdMatch &&
    strength.score >= 2,
    [fullName, username, usernameOk, emailOk, email, confirmEmail, password, pwdMatch, strength.score]
  );

  const blur = (field: string) => {
    setTouched(t => ({ ...t, [field]: true }));
    setFocusedField(null);
  };

  // ── Google ──
  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/onboarding/select-concurso' });
  };

  // ── submit ──
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim())            { setError('Nome completo é obrigatório'); return; }
    if (usernameStatus === 'taken')   { setError('Este username já está em uso'); return; }
    if (usernameStatus === 'invalid') { setError('Username inválido. Use 3-30 caracteres: letras, números ou _'); return; }
    if (!emailOk)                    { setError('Email inválido'); return; }
    if (email.toLowerCase() !== confirmEmail.toLowerCase()) { setError('Os emails não conferem'); return; }
    if (password.length < 8)         { setError('Senha deve ter pelo menos 8 caracteres'); return; }
    if (!pwdMatch)                   { setError('As senhas não conferem'); return; }
    if (strength.score < 2)          { setError('Senha muito fraca — use letras maiúsculas, números e símbolos'); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email:        email.toLowerCase().trim(),
          password,
          name:         fullName.trim(),
          username:     username.trim() || undefined,
          birthday:     birthday || undefined,
          location:     location.trim() || undefined,
          referralCode: referralCode ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Erro ao criar conta'); return; }

      const login = await signIn('credentials', {
        email:    email.toLowerCase().trim(),
        password,
        redirect: false,
      });
      if (login?.error) { router.push('/auth/login?registered=true'); return; }

      localStorage.removeItem('ff_ref');
      setShowSuccess(true);
      setTimeout(() => router.push('/onboarding/select-concurso'), 2200);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── success screen ──
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="relative text-center space-y-6 max-w-sm">
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-emerald-500/25 blur-2xl scale-150 rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} className="text-emerald-400" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-black text-white mb-2">Conta criada!</h2>
            <p className="text-slate-400">Redirecionando para o onboarding...</p>
          </div>
          <Loader2 className="animate-spin text-emerald-400 mx-auto" size={28} />
        </div>
      </div>
    );
  }

  // ── username icon helper ──
  const UsernameIcon = () => {
    if (usernameStatus === 'checking')  return <Loader2 size={14} className="animate-spin text-slate-400" />;
    if (usernameStatus === 'available') return <CheckCircle2 size={14} className="text-emerald-400" />;
    if (usernameStatus === 'taken')     return <XCircle size={14} className="text-red-400" />;
    if (usernameStatus === 'invalid')   return <XCircle size={14} className="text-red-400" />;
    return null;
  };

  // ── render ──
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">

      {/* bg blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/3 -left-1/4 w-[550px] h-[550px] bg-emerald-500/7 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute -bottom-1/3 -right-1/4 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '13s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ── Left ──────────────────────────────────────────────── */}
          <div className="hidden lg:flex flex-col gap-8 pt-4">
            <Link href="/" className="inline-flex items-center gap-3 w-fit">
              <Image src="/imagens/edrush-logo-removebg.png" alt="EdRush logo" width={44} height={44} />
              <span className="text-2xl font-black text-white">Ed<span className="text-emerald-400">Rush</span></span>
            </Link>

            <div>
              <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">Plataforma de concursos</p>
              <h2 className="text-4xl font-black text-white leading-tight mb-3">
                Tudo que você precisa<br />
                para <span className="text-emerald-400">passar</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Uma plataforma 100% focada em te levar à aprovação, com método, análise e consistência.
              </p>
            </div>

            <div className="space-y-3">
              {PERKS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="flex items-start gap-3.5 p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-emerald-500/20 transition-all">
                    <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{p.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{p.desc}</p>
                    </div>
                    <CheckCircle2 size={14} className="text-emerald-500/50 flex-shrink-0 ml-auto mt-0.5" />
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/6">
              <p className="text-slate-500 text-sm">
                Já tem conta?{' '}
                <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                  Fazer login
                </Link>
              </p>
            </div>
          </div>

          {/* ── Right ─────────────────────────────────────────────── */}
          <div>
            {/* mobile logo */}
            <div className="flex items-center justify-center gap-3 mb-7 lg:hidden">
              <Image src="/imagens/edrush-logo-removebg.png" alt="EdRush logo" width={36} height={36} />
              <span className="text-xl font-black text-white">Ed<span className="text-emerald-400">Rush</span></span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/8 rounded-3xl p-7 shadow-2xl">

              {/* header */}
              <div className="mb-6">
                <h1 className="text-2xl font-black text-white mb-1">Criar conta</h1>
                <p className="text-slate-500 text-sm">Preencha os dados para começar sua jornada</p>
              </div>

              {/* referral banner */}
              {referralCode && (
                <div className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mb-5">
                  <Gift size={16} className="text-emerald-400 flex-shrink-0" />
                  <p className="text-emerald-300 text-sm font-medium">
                    Você foi convidado! Ao assinar, seu amigo ganha{' '}
                    <span className="font-bold text-emerald-400">1 mês grátis</span>.
                  </p>
                </div>
              )}

              {/* error */}
              {error && (
                <div className="flex items-center gap-3 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl mb-5">
                  <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={isGoogleLoading || isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-2xl transition-all font-semibold text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed mb-5"
              >
                {isGoogleLoading ? (
                  <Loader2 size={17} className="animate-spin text-slate-400" />
                ) : (
                  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                )}
                {isGoogleLoading ? 'Redirecionando...' : 'Cadastrar com Google'}
              </button>

              {/* divider */}
              <div className="relative flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-slate-600 text-xs">ou preencha o formulário</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* ── form ── */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* ① Nome completo */}
                <Field label="Nome completo">
                  <div className="relative">
                    <User size={15} className={icon(focusedField === 'name')} />
                    <input
                      type="text" required value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => blur('name')}
                      placeholder="João Silva"
                      autoComplete="name"
                      className={input()}
                    />
                  </div>
                </Field>

                {/* ② Username */}
                <Field label="Username" hint="Letras, números e _ · 3-30 caracteres">
                  <div className="relative">
                    <AtSign size={15} className={icon(focusedField === 'username')} />
                    <input
                      type="text" value={username}
                      onChange={e => { setUsername(e.target.value); checkUsername(e.target.value); }}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => blur('username')}
                      placeholder="joao_silva"
                      autoComplete="username"
                      maxLength={30}
                      className={input(
                        touched.username && usernameStatus === 'taken'   ? 'error' :
                        touched.username && usernameStatus === 'invalid' ? 'error' : ''
                      )}
                    />
                    {/* status icon on right */}
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      <UsernameIcon />
                    </span>
                  </div>
                  {/* username feedback */}
                  {username && usernameStatus === 'available' && (
                    <p className="text-emerald-400 text-xs flex items-center gap-1.5 pt-1">
                      <CheckCircle2 size={11} /> @{username.trim()} está disponível
                    </p>
                  )}
                  {username && usernameStatus === 'taken' && (
                    <p className="text-red-400 text-xs flex items-center gap-1.5 pt-1">
                      <XCircle size={11} /> Este username já está em uso
                    </p>
                  )}
                  {username && usernameStatus === 'invalid' && (
                    <p className="text-red-400 text-xs flex items-center gap-1.5 pt-1">
                      <XCircle size={11} /> Apenas letras, números e _ · mínimo 3 caracteres
                    </p>
                  )}
                </Field>

                {/* ③ Email + Confirmar email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Email">
                    <div className="relative">
                      <Mail size={15} className={icon(focusedField === 'email', touched.email && !emailOk)} />
                      <input
                        type="email" required value={email}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => blur('email')}
                        placeholder="seu@email.com"
                        autoComplete="email"
                        className={input(touched.email && !emailOk ? 'error' : '')}
                      />
                    </div>
                    {touched.email && !emailOk && (
                      <p className="text-red-400 text-xs pt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full flex-shrink-0" /> Email inválido
                      </p>
                    )}
                  </Field>

                  <Field label="Confirmar email">
                    <div className="relative">
                      <Mail size={15} className={icon(focusedField === 'confirmEmail', touched.confirmEmail && !emailsMatch)} />
                      <input
                        type="email" required value={confirmEmail}
                        onChange={e => setConfirmEmail(e.target.value)}
                        onFocus={() => setFocusedField('confirmEmail')}
                        onBlur={() => blur('confirmEmail')}
                        placeholder="seu@email.com"
                        autoComplete="off"
                        className={input(touched.confirmEmail && !emailsMatch ? 'error' : '')}
                      />
                      {touched.confirmEmail && confirmEmail && emailsMatch && email && (
                        <CheckCircle2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                      )}
                    </div>
                    {touched.confirmEmail && !emailsMatch && (
                      <p className="text-red-400 text-xs pt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full flex-shrink-0" /> Emails não conferem
                      </p>
                    )}
                  </Field>
                </div>

                {/* ④ Data de nascimento + Localidade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Data de nascimento" hint="Opcional">
                    <div className="relative">
                      <Calendar size={15} className={icon(focusedField === 'birthday')} />
                      <input
                        type="date" value={birthday}
                        onChange={e => setBirthday(e.target.value)}
                        onFocus={() => setFocusedField('birthday')}
                        onBlur={() => blur('birthday')}
                        max={new Date(Date.now() - 13 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0]}
                        className={input() + ' [color-scheme:dark]'}
                      />
                    </div>
                  </Field>

                  <Field label="Localidade" hint="Opcional · Ex: São Paulo, SP">
                    <div className="relative">
                      <MapPin size={15} className={icon(focusedField === 'location')} />
                      <input
                        type="text" value={location}
                        onChange={e => setLocation(e.target.value)}
                        onFocus={() => setFocusedField('location')}
                        onBlur={() => blur('location')}
                        placeholder="São Paulo, SP"
                        autoComplete="address-level2"
                        className={input()}
                      />
                    </div>
                  </Field>
                </div>

                {/* ⑤ Senha + Confirmar senha */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Senha">
                    <div className="relative">
                      <Lock size={14} className={icon(focusedField === 'password')} />
                      <input
                        type={showPassword ? 'text' : 'password'} required value={password}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => blur('password')}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className={input()}
                      />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-400 transition-colors">
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {password && (
                      <div className="space-y-1 pt-0.5">
                        <div className="flex gap-1">
                          {[1,2,3,4].map(n => (
                            <div key={n} className={`h-1 flex-1 rounded-full transition-all ${n <= strength.score ? strength.bar : 'bg-slate-800'}`} />
                          ))}
                        </div>
                        <p className={`text-xs font-semibold ${strength.text}`}>{strength.label}</p>
                      </div>
                    )}
                  </Field>

                  <Field label="Confirmar senha">
                    <div className="relative">
                      <Lock size={14} className={icon(focusedField === 'confirm', touched.confirm && !pwdMatch)} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField('confirm')}
                        onBlur={() => blur('confirm')}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className={input(touched.confirm && !pwdMatch ? 'error' : '')}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-400 transition-colors">
                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {touched.confirm && !pwdMatch && (
                      <p className="text-red-400 text-xs pt-0.5 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full flex-shrink-0" /> Não conferem
                      </p>
                    )}
                    {touched.confirm && pwdMatch && confirmPassword && (
                      <p className="text-emerald-400 text-xs pt-0.5 flex items-center gap-1">
                        <CheckCircle2 size={11} /> Senhas iguais
                      </p>
                    )}
                  </Field>
                </div>

                {/* submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formValid || isGoogleLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-4 mt-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-sm uppercase tracking-wide rounded-2xl transition-all hover:scale-[1.01] hover:shadow-[0_8px_32px_rgba(16,185,129,0.4)]"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Criando conta...</>
                  ) : (
                    <>Criar minha conta <ArrowRight size={17} /></>
                  )}
                </button>
              </form>

              <p className="text-center text-slate-500 text-sm mt-5">
                Já tem conta?{' '}
                <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                  Fazer login
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── tiny helpers to keep JSX clean ──────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
        {hint && <span className="text-[10px] text-slate-600">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function icon(focused: boolean, error?: boolean) {
  return `absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
    error   ? 'text-red-400' :
    focused ? 'text-emerald-400' :
              'text-slate-600'
  }`;
}

function input(state?: string) {
  const base = 'w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-white text-sm outline-none transition-all placeholder:text-slate-600 ';
  if (state === 'error') return base + 'border-red-500/40 bg-red-500/5';
  return base + 'border-white/8 focus:border-emerald-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-emerald-500/20';
}

// ─── page export ──────────────────────────────────────────────────────────────
export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
      <SignupForm />
    </Suspense>
  );
}
