export default function PerfilLoading() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Top bar fake */}
      <div className="border-b border-white/5 h-14" />
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-pulse">
        {/* Hero */}
        <div className="rounded-3xl border border-white/10 overflow-hidden bg-slate-900/40">
          <div className="h-36 sm:h-44 bg-gradient-to-br from-emerald-900/40 via-slate-900/60 to-slate-900" />
          <div className="px-5 sm:px-8 pb-7 -mt-16 sm:-mt-20 space-y-4">
            <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-[#020617]" />
            <div className="h-7 w-48 rounded-lg bg-slate-800" />
            <div className="h-3 w-64 rounded bg-slate-800/70" />
            <div className="h-2.5 w-full rounded-full bg-slate-800/70 mt-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-slate-800/60" />
              ))}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="h-12 w-full rounded-2xl bg-slate-900/60 border border-white/5" />
        {/* Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-44 rounded-2xl bg-slate-900/60 border border-white/5" />
          <div className="h-44 rounded-2xl bg-slate-900/60 border border-white/5" />
        </div>
      </div>
    </div>
  );
}
