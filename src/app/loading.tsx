export default function Loading() {
  return (
    <main
      className="flex min-h-[60vh] items-center justify-center px-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span
          className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-500 motion-reduce:animate-none"
          aria-hidden="true"
        />
        <span>Carregando página...</span>
      </div>
      <span className="sr-only">Aguarde enquanto a página é carregada.</span>
    </main>
  );
}
