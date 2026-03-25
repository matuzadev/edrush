'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Lado esquerdo - Gradient Background */}
        <div className="auth-gradient-side">
          <div className="auth-content-left">
            <div className="auth-logo">
              <Link href="/" className="no-underline">
                <Image
                  src="/imagens/foco-federal-logo-removebg.png"
                  alt="Foco Federal Logo"
                  width={150}    // Corresponde a w-12 (48px)
                  height={150}   // Mantém a proporção
                  quality={80}  // Comprime sem perda visual perceptível
                  priority      // Carrega instantaneamente (importante para logos)
                  className="mx-auto"
                />
              </Link>
              <h2 className="text-xl font-black text-white mt-3">Foco Federal</h2>
            </div>

            <div className="auth-benefits">
              <h3 className="text-white font-bold text-lg mb-6">Por que usar o Foco Federal?</h3>

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
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.757a1 1 0 01-.940 1.069 60.513 60.513 0 01-3.666.07 1 1 0 00-.995.936v.41a1 1 0 001 1h-.817a1 1 0 001-1v-.410c0 .487.277.921.68.94a60.517 60.517 0 01-3.666-.07 1 1 0 01-.94-1.069v-6.757a3.066 3.066 0 012.812-3.062zM9 13a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Dashboard Personalizado</p>
                  <p className="text-xs text-slate-300">Interface adaptada para seus objetivos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Form */}
        <div className="auth-form-side">
          <div className="auth-form-wrapper">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-white mb-2">Bem-vindo!</h1>
              <p className="text-slate-400 text-sm">Entre em sua conta e continue evoluindo</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

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
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-600 accent-emerald-500" />
                  <span className="text-slate-300">Lembrar de mim</span>
                </label>
                <Link href="#" className="text-emerald-400 hover:text-emerald-300 transition">
                  Esqueci a senha
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="btn-submit w-full"
              >
                {isSubmitting || isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="divider">
              <span>ou</span>
            </div>

            <button className="btn-social w-full">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar com Google
            </button>

            <p className="text-center text-slate-400 text-sm mt-6">
              Não tem conta?{' '}
              <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold transition">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>

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

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          color: #64748b;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(51, 65, 85, 0.5);
        }

        .btn-social {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 12px 24px;
          background: rgba(30, 41, 59, 0.7);
          color: #f8fafc;
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-social:hover {
          background: rgba(30, 41, 59, 1);
          border-color: rgba(16, 185, 129, 0.3);
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
    </div>
  );
}
