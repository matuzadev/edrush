export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-pulse">
        <div className="h-12 w-64 rounded-xl bg-slate-900/60 border border-white/5" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-24 rounded-2xl bg-slate-900/60 border border-white/5" />
          <div className="h-24 rounded-2xl bg-slate-900/60 border border-white/5" />
          <div className="h-24 rounded-2xl bg-slate-900/60 border border-white/5" />
          <div className="h-24 rounded-2xl bg-slate-900/60 border border-white/5" />
        </div>
        <div className="h-80 rounded-2xl bg-slate-900/60 border border-white/5" />
        <div className="h-64 rounded-2xl bg-slate-900/60 border border-white/5" />
      </div>
    </div>
  );
}
