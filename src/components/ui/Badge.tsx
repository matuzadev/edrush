interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'emerald' | 'cyan';
  className?: string;
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const variants = {
    success: 'badge-neon emerald',
    warning: 'badge-neon cyan',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    primary: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    emerald: 'badge-neon emerald',
    cyan: 'badge-neon cyan'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
