import Link from 'next/link';

export default function AssinarPage() {
  return (
    <main className="min-h-screen bg-[#020617] px-4 py-20 text-white">
      <section className="mx-auto max-w-2xl rounded-3xl border border-emerald-500/20 bg-slate-900 p-8 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-emerald-400">
          EdRush gratuito
        </p>
        <h1 className="mb-4 text-3xl font-black">Todos os recursos, sem mensalidade</h1>
        <p className="mb-8 text-slate-300">
          Questões, simulados, materiais, estatísticas e personalização não exigem pagamento.
          Moedas e cosméticos da loja são opcionais e não liberam acesso a funcionalidades.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/auth/signup"
            className="rounded-xl bg-emerald-500 px-6 py-3 font-black text-slate-950 hover:bg-emerald-400"
          >
            Criar conta gratuita
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-slate-700 px-6 py-3 font-bold text-slate-200 hover:bg-white/5"
          >
            Voltar ao início
          </Link>
        </div>
      </section>
    </main>
  );
}
