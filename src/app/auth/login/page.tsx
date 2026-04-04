'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setError('Email ou senha incorretos');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-submit w-full"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-6">
              Não tem conta?{' '}
              <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold transition">
                Cadastre-se gratuitamente
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
