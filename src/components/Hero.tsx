"use client"; // Deve ser sempre a primeira linha

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
      <header className="hero !min-h-screen !flex !flex-col bg-[#030712] relative overflow-hidden">
        {/* Barra de Navegação */}
        <nav className="absolute top-0 left-0 w-full z-[100] flex items-center justify-between px-6 md:px-16 py-8">
          <div className="flex-shrink-0">
            <Link href="/" className="no-underline">
            </Link>
          </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link 
                href="/auth/login"
                style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '13px' }}
              >
                Entrar
              </Link>

              <Link 
                href="/auth/signup"
                style={{ backgroundColor: '#10b981', color: '#022c22', padding: '8px 20px', borderRadius: '99px', border: 'none', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', fontSize: '13px', textDecoration: 'none', display: 'inline-block' }}
              >
                Registro
              </Link>
            </div>
        </nav>
        
        {/* Background Decorativo - Agora dentro do header */}
        <div className="hero-bg-overlay">
          <Image
            src="/imagens/imagem.png"
            alt="Background Decor"
            fill
            priority
            className="bg-img-blur opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712] z-0"></div>
        </div>

        {/* Conteúdo Principal - Agora dentro do header */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-5xl w-full">

            {/* Badge flutuante */}
            <div className="badge mb-8 animate-bounce-subtle">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Plataforma Inteligente de Estudos
            </div>

            <h1 className="text-white text-5xl md:text-7xl font-black mb-6">
              Revolucione sua <br />
              <span className="gradient-text">Preparação Policial</span>
            </h1>

            <p className="hero-sub mx-auto max-w-2xl mb-10 text-slate-400">
              A plataforma que combina <strong className="text-white">Active Recall científico</strong> e <strong className="text-white">analytics em tempo real</strong> para maximizar seu desempenho.
            </p>

            <div className="flex flex-row justify-center items-center gap-4 md:gap-6 mt-8">
              <Link href="auth/login" className="btn btn-primary pulse !text-lg !py-3 !px-8 !rounded-full shrink-0 no-underline">
                Começar Agora
              </Link>
              <a href="#beneficios" className="btn btn-secondary !text-lg !py-3 !px-8 !rounded-full shrink-0 no-underline">
                Ver Benefícios
              </a>
            </div>
          </div>
        </div>
      </header>
  );
}