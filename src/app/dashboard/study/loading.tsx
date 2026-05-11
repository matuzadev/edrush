export default function StudyLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-9 w-32 rounded-lg bg-slate-900/60 border border-white/5" />
          <div className="h-9 w-20 rounded-lg bg-slate-900/60 border border-white/5" />
        </div>
        <div className="h-3 rounded-full bg-slate-900/60 border border-white/5" />
        <div className="h-72 rounded-2xl bg-slate-900/60 border border-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="h-14 rounded-xl bg-slate-900/60 border border-white/5" />
          <div className="h-14 rounded-xl bg-slate-900/60 border border-white/5" />
          <div className="h-14 rounded-xl bg-slate-900/60 border border-white/5" />
          <div className="h-14 rounded-xl bg-slate-900/60 border border-white/5" />
        </div>
      </div>
    </div>
  );
}
