export default function FeedLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
        <aside className="hidden lg:block lg:col-span-3 space-y-3">
          <div className="h-40 rounded-2xl bg-slate-900/60 border border-white/5" />
          <div className="h-56 rounded-2xl bg-slate-900/60 border border-white/5" />
        </aside>
        <main className="col-span-1 lg:col-span-6 space-y-4">
          <div className="h-32 rounded-2xl bg-slate-900/60 border border-white/5" />
          <div className="h-10 rounded-xl bg-slate-900/60 border border-white/5" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-900/60 border border-white/5" />
          ))}
        </main>
        <aside className="hidden lg:block lg:col-span-3 space-y-3">
          <div className="h-48 rounded-2xl bg-slate-900/60 border border-white/5" />
          <div className="h-32 rounded-2xl bg-slate-900/60 border border-white/5" />
        </aside>
      </div>
    </div>
  );
}
