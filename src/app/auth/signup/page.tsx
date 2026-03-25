"use client";

import { useState, FormEvent, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Lock, CheckCircle2, ArrowRight, Loader2, Eye, EyeOff, Zap, Shield, Sparkles, TrendingUp, Rocket } from 'lucide-react';

// Calcula a força da senha usando algoritmo sofisticado
const calculatePasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
  let score = 0;
  const checks = {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    numbers: /[0-9]/.test(pwd),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    sequentialChars: !/(.)\1{2,}/.test(pwd),
    commonPatterns: !/^(password|123|qwerty)/i.test(pwd)
  };

  Object.values(checks).forEach(check => { if (check) score++; });

  if (score <= 2) return { score: 1, label: 'Fraca', color: 'bg-red-500' };
  if (score <= 4) return { score: 2, label: 'Média', color: 'bg-yellow-500' };
  if (score <= 6) return { score: 3, label: 'Forte', color: 'bg-blue-500' };
  return { score: 4, label: 'Muito Forte', color: 'bg-emerald-500' };
};

export default function SignupPage() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false });

  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  const emailValidation = useMemo(() => {
    if (!email) return { isValid: false, message: '' };
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: regex.test(email),
      message: regex.test(email) ? '' : 'Email inválido'
    };
  }, [email]);

  const passwordsMatch = password && confirmPassword ? password === confirmPassword : true;

  const isFormValid = useMemo(() => {
    return fullName.trim().length > 0 &&
      emailValidation.isValid &&
      password.length >= 8 &&
      passwordsMatch &&
      passwordStrength.score >= 2;
  }, [fullName, emailValidation.isValid, password, passwordsMatch, passwordStrength.score]);

  const validateForm = () => {
    if (!fullName.trim()) { setError('Nome completo é obrigatório'); return false; }
    if (!emailValidation.isValid) { setError('Email inválido'); return false; }
    if (password.length < 8) { setError('Senha deve ter pelo menos 8 caracteres'); return false; }
    if (!passwordsMatch) { setError('Senhas não conferem'); return false; }
    if (passwordStrength.score < 2) { setError('Senha muito fraca. Use maiúsculas, números e caracteres especiais'); return false; }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    if (!validateForm()) { setIsSubmitting(false); return; }

    try {
      await signUp(email, password);
      setShowSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2500);
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    setFocusedField(null);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-slate-900 to-[#0f172a] flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -left-96 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" style={{animationDuration: '4s'}} />
          <div className="absolute -bottom-96 right-1/3 w-96 h-96 bg-blue-500/15 blur-[120px] rounded-full animate-pulse" style={{animationDuration: '6s'}} />
        </div>
        <div className="text-center space-y-8 animate-in zoom-in duration-700 relative z-10 max-w-md">
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 blur-2xl rounded-full animate-pulse" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-500/40 to-emerald-400/20 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/50">
              <CheckCircle2 size={56} className="text-emerald-300 animate-pulse" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white tracking-tight">Bem-vindo!</h2>
            <p className="text-lg text-slate-300 leading-relaxed">Sua conta elite foi criada com sucesso. Redirecionando...</p>
          </div>
          <Loader2 className="animate-spin text-emerald-400 mx-auto" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-slate-900 to-[#0f172a] overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-emerald-500/15 via-transparent to-transparent blur-3xl rounded-full animate-pulse" style={{animationDuration: '7s'}} />
        <div className="absolute -bottom-1/2 -right-1/3 w-full h-full bg-gradient-to-tl from-blue-500/10 via-transparent to-transparent blur-3xl rounded-full animate-pulse" style={{animationDuration: '9s'}} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 md:py-0">
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left Side - Info Panel */}
          <div className="hidden md:flex flex-col justify-center space-y-8 order-2 md:order-1 animate-in fade-in slide-in-from-left-10 duration-700">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 group w-fit">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-all" />
                <Image 
                  src="/imagens/foco-federal-logo-removebg.png" 
                  alt="Logo" 
                  width={48} 
                  height={48} 
                  className="relative"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Foco<span className="text-emerald-400">Federal</span>
                </h1>
              </div>
            </Link>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">Prepare-se para a Elite</p>
                <h2 className="text-5xl font-black text-white leading-tight mb-4">Comece sua Jornada</h2>
                <p className="text-lg text-slate-300 leading-relaxed">Acesso aos melhores recursos de aprendizado com Active Recall inteligente</p>
              </div>

              {/* Features */}
              <div className="space-y-4 pt-4">
                {[
                  { icon: Shield, label: 'Segurança Avançada', desc: 'Seus dados protegidos com criptografia de ponta' },
                  { icon: TrendingUp, label: 'Análise em Tempo Real', desc: 'Acompanhe seu progresso com métricas detalhadas' },
                  { icon: Rocket, label: 'Performance Máxima', desc: 'Plataforma otimizada para velocidade e confiabilidade' }
                ].map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <div key={i} className="flex gap-4 group cursor-default animate-in fade-in" style={{animationDelay: `${200 + i * 100}ms`}}>
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500/30 to-emerald-500/10 rounded-xl flex items-center justify-center group-hover:from-emerald-500/50 transition-all">
                        <Icon size={20} className="text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{feature.label}</h3>
                        <p className="text-slate-400 text-xs mt-1">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-8 border-t border-white/10">
              <p className="text-slate-500 text-sm">
                Já tem conta?{' '}
                <Link href="/auth/login" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                  Fazer login
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Form Panel */}
          <div className="order-1 md:order-2 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
              {/* Gradient Border */}
              <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/20 via-blue-500/10 to-emerald-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 blur" />
              
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">REGISTRO RÁPIDO</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white">Criar Conta</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Alert */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium backdrop-blur-sm animate-in shake duration-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                      {error}
                    </div>
                  </div>
                )}

                {/* Name Input */}
                <div className="space-y-2.5 animate-in fade-in" style={{animationDelay: '100ms'}}>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome Completo</label>
                  <div className="relative group/input">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'name' ? 'text-emerald-400 scale-110' : 'text-slate-500'}`} size={18} />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => handleFieldBlur('name')}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white outline-none focus:border-emerald-400/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
                      placeholder="João Silva"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2.5 animate-in fade-in" style={{animationDelay: '150ms'}}>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</label>
                  <div className="relative group/input">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'email' ? 'text-emerald-400 scale-110' : 
                      touched.email && !emailValidation.isValid ? 'text-red-400' : 'text-slate-500'
                    }`} size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => handleFieldBlur('email')}
                      className={`w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-white outline-none transition-all duration-300 ${
                        focusedField === 'email' ? 'border-emerald-400/50 bg-white/[0.06] focus:ring-1 focus:ring-emerald-500/20' : 
                        touched.email && !emailValidation.isValid ? 'border-red-400/50 bg-red-500/5' : 
                        'border-white/10 hover:border-white/20 focus:border-emerald-400/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-emerald-500/20'
                      }`}
                      placeholder="seu@email.com"
                    />
                  </div>
                  {touched.email && !emailValidation.isValid && (
                    <p className="text-red-400 text-xs flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-red-400 rounded-full" />
                      {emailValidation.message}
                    </p>
                  )}
                </div>

                {/* Passwords Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-2.5 animate-in fade-in" style={{animationDelay: '200ms'}}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Senha</label>
                    <div className="relative group/input">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'password' ? 'text-emerald-400 scale-110' : 'text-slate-500'}`} size={16} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => handleFieldBlur('password')}
                        className="w-full pl-11 pr-11 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-emerald-400/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {password && (
                      <div className="space-y-2 pt-2">
                        <div className="flex gap-1.5">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i < passwordStrength.score ? passwordStrength.color : 'bg-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-semibold ${
                          passwordStrength.score <= 2 ? 'text-red-400' :
                          passwordStrength.score === 3 ? 'text-blue-400' : 'text-emerald-400'
                        }`}>
                          Força: <span className="capitalize">{passwordStrength.label}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2.5 animate-in fade-in" style={{animationDelay: '250ms'}}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confirmar</label>
                    <div className="relative group/input">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                        focusedField === 'confirm' ? 'text-emerald-400 scale-110' :
                        touched.confirm && !passwordsMatch ? 'text-red-400' : 'text-slate-500'
                      }`} size={16} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField('confirm')}
                        onBlur={() => handleFieldBlur('confirm')}
                        className={`w-full pl-11 pr-11 py-3.5 bg-white/[0.03] border rounded-xl text-white text-sm outline-none transition-all duration-300 ${
                          focusedField === 'confirm' ? 'border-emerald-400/50 bg-white/[0.06] focus:ring-1 focus:ring-emerald-500/20' :
                          touched.confirm && !passwordsMatch ? 'border-red-400/50 bg-red-500/5' :
                          'border-white/10 hover:border-white/20 focus:border-emerald-400/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-emerald-500/20'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors p-1"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {touched.confirm && !passwordsMatch && (
                      <p className="text-red-400 text-xs flex items-center gap-1.5 pt-2">
                        <span className="w-1 h-1 bg-red-400 rounded-full" />
                        As senhas não conferem
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading || !isFormValid}
                  className="w-full py-4 mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-40 text-white font-black rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/40 flex items-center justify-center gap-2.5 group relative overflow-hidden animate-in fade-in" style={{animationDelay: '300ms'}}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {isSubmitting || isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Rocket size={18} />
                      <span>Criar Conta</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-slate-900 text-slate-500">ou</span>
                  </div>
                </div>

                {/* Login Link */}
                <Link
                  href="/auth/login"
                  className="w-full py-3.5 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Já tem conta? Fazer login
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </form>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden mt-8 text-center">
              <Link href="/" className="inline-flex flex-col items-center gap-2 group mb-4">
                <Image 
                  src="/imagens/foco-federal-logo-removebg.png" 
                  alt="Logo" 
                  width={40} 
                  height={40}
                  className="group-hover:scale-110 transition-transform"
                />
                <h1 className="text-xl font-black text-white">Foco<span className="text-emerald-400">Federal</span></h1>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}