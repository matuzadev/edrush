import Link from 'next/link';
import { ShieldCheck, Gift } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 pt-12 pb-6 text-slate-400">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Sobre */}
          <div className="space-y-4">
            <h3 className="text-white font-black tracking-tight text-base">
              Ed<span className="text-emerald-400">Rush</span>
            </h3>
            <p className="text-xs leading-relaxed">
              Plataforma de preparação inteligente para todos os concursos públicos do Brasil.
              Combinamos revisão ativa e estratégias práticas para transformar seu estudo em aprovação.
            </p>
          </div>

          {/* Navegação */}
          <div className="space-y-4">
            <h3 className="text-white font-bold tracking-widest uppercase text-xs">
              Navegação
            </h3>
            <ul className="text-xs space-y-2.5">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors no-underline">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/#beneficios" className="hover:text-emerald-400 transition-colors no-underline">
                  Benefícios
                </Link>
              </li>
              <li>
                <Link href="/#oferta" className="hover:text-emerald-400 transition-colors no-underline">
                  Recursos gratuitos
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-emerald-400 transition-colors no-underline">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-emerald-400 transition-colors no-underline">
                  Criar Conta
                </Link>
              </li>
            </ul>
          </div>

          {/* Segurança */}
          <div className="space-y-4">
            <h3 className="text-white font-bold tracking-widest uppercase text-xs">
              Segurança
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Ambiente 100% criptografado</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Gift className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Todos os recursos de estudo são gratuitos</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500 pt-1">
              Moedas e cosméticos são opcionais e não condicionam o acesso à plataforma.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest">
          <p>&copy; 2026 EdRush — Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
