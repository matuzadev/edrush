export default function PerfilLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-pulse">
        <div className="h-44 rounded-2xl bg-slate-900/60 border border-white/5" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-900/60 border border-white/5" />
          ))}
        </div>
        <div className="h-12 w-full rounded-xl bg-slate-900/60 border border-white/5" />
        <div className="h-72 rounded-2xl bg-slate-900/60 border border-white/5" />
      </div>
    </div>
  );
}
