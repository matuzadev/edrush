import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-[var(--radius-md)] transition-all [transition-duration:var(--transition-base)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover-lift';

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  const variantStyles = {
    // Primary com gradiente animado e glow
    primary: 'btn-gradient shadow-[var(--glow-emerald)]',

    // Secondary com border sutil
    secondary: 'bg-white/[0.03] border border-[var(--border)] text-[var(--fg)] hover:border-[var(--emerald-500)]/40 hover:bg-white/[0.06] hover:shadow-[var(--glow-emerald)]',

    // Ghost minimalista
    ghost: 'text-[var(--fg)] hover:bg-white/[0.08] border border-transparent hover:border-[var(--border)]',

    // Gradient com efeito neon
    gradient: 'relative bg-[var(--gradient-primary)] bg-[length:200%_200%] text-slate-950 font-black overflow-hidden [animation:gradient-shift_3s_ease_infinite] before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] before:[transform:translateX(-100%)_skewX(-12deg)] before:[transition:transform_0.6s_ease] hover:before:[transform:translateX(100%)_skewX(-12deg)] hover:shadow-[var(--glow-emerald),var(--shadow-lg)] hover:-translate-y-[1px] hover:scale-[1.02]'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
