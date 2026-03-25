export default function Footer() {
  return (
    <footer className="bg-[#0f172a] border-t border-cyan-500/10 pt-12 pb-6 text-slate-400">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          <div className="space-y-4">
            <h3 className="text-white font-bold tracking-widest uppercase text-sm">Foco Federal</h3>
            <p className="text-xs leading-relaxed">
              Especialistas em metodologias avançadas para Perito Criminal Federal e EsFCEx.
              Nossa missão é transformar dados em aprovação através do Active Recall e Inteligência Forense.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-bold tracking-widest uppercase text-sm">Navegação</h3>
            <ul className="text-xs space-y-2">
              <li><a href="#" className="hover:text-cyan-400 transition">Início</a></li>
              <li><a href="planilha.html" className="hover:text-cyan-400 transition">A Planilha</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-bold tracking-widest uppercase text-sm">Segurança</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-500 text-lg">🛡️</span>
              <span>Ambiente 100% Criptografado</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-blue-500 text-lg">💳</span>
              <span>Pagamento Seguro via Kirvano</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-tighter">
          <p>&copy; 2026 Foco Federal - Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Termos de Uso</a>
            <a href="#" className="hover:text-white">Políticas de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}