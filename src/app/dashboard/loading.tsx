export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-pulse">
        <div className="h-14 rounded-2xl bg-slate-900/60 border border-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 rounded-2xl bg-slate-900/60 border border-white/5" />
          <div className="h-28 rounded-2xl bg-slate-900/60 border border-white/5" />
          <div className="h-28 rounded-2xl bg-slate-900/60 border border-white/5" />
        </div>
        <div className="h-72 rounded-2xl bg-slate-900/60 border border-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 rounded-2xl bg-slate-900/60 border border-white/5" />
          <div className="h-48 rounded-2xl bg-slate-900/60 border border-white/5" />
        </div>
      </div>
    </div>
  );
}
