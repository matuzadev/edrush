import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <header className="min-h-screen flex flex-col bg-[#030712] relative overflow-hidden">

      {/* Aviso de acesso gratuito */}
      <div className="relative z-50 w-full bg-emerald-500/10 border-b border-emerald-500/20 py-2 px-4 text-center">
        <p className="text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide">
          EdRush é 100% gratuito: todos os recursos, sem mensalidade ou limite diário.
        </p>
      </div>

      {/* Navegação */}
      <nav className="absolute top-8 left-0 w-full z-[100] flex items-center justify-between px-6 md:px-16 pt-8">
        <div className="flex-shrink-0">
          <Link href="/" className="text-white font-black text-lg tracking-tight no-underline">
            Ed<span className="text-emerald-400">Rush</span>
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/auth/login"
            className="text-slate-400 hover:text-white transition-colors font-bold uppercase text-[13px] tracking-wide no-underline"
          >
            Entrar
          </Link>
          <Link
            href="/auth/signup"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase text-[13px] tracking-wide px-5 py-2 rounded-full transition-colors no-underline"
          >
            REGISTRAR GRATUITAMENTE
          </Link>
        </div>
      </nav>

      {/* Background decorativo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/imagens/imagem.png"
          alt="Background Decor"
          fill
          priority
          className="object-cover opacity-[0.12] blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712]/60 to-[#030712]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center pt-32 pb-16">
        <div className="max-w-4xl w-full">

          {/* Badge animado */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Plataforma Inteligente de Estudos
          </div>

          {/* Headline */}
          <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            Passe no seu concurso
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              estudando menos, retendo mais
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-slate-400 text-base md:text-lg mx-auto max-w-2xl mb-4 leading-relaxed">
            A única plataforma com{' '}
            <strong className="text-white">Active Recall automatizado</strong>
            {' '}e{' '}
            <strong className="text-white">Técnica de Feynman</strong>
            {' '}— algoritmos desenvolvidos para consolidar conhecimento e zerar o esquecimento.
          </p>

          <p className="text-slate-500 text-sm mb-10">
            Para todos os concursos do Brasil: Federal, Estadual, Municipal, Policial e mais.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-2">
            <Link
              href="/#oferta"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base sm:text-lg py-3 px-8 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] no-underline text-center"
            >
              Começar gratuitamente
            </Link>
            <Link
              href="/#beneficios"
              className="w-full sm:w-auto border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-base sm:text-lg py-3 px-8 rounded-full transition-colors no-underline text-center"
            >
              Ver como funciona
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-10 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-base">+12.000</span> questões comentadas
            </span>
            <span className="hidden sm:block w-px h-4 bg-slate-700" />
            <span className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-base">847</span> estudando agora
            </span>
            <span className="hidden sm:block w-px h-4 bg-slate-700" />
            <span className="flex items-center gap-2">
              Todos os concursos do Brasil
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
