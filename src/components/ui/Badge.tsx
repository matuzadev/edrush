interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary';
  className?: string;
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    primary: 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
