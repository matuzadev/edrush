import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'ghost';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300';
  
  const variants = {
    default: 'bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-xl hover:border-white/20',
    elevated: 'bg-gradient-to-br from-slate-800/80 to-slate-900/40 backdrop-blur-2xl border border-emerald-500/30 shadow-2xl hover:shadow-emerald-500/20',
    ghost: 'bg-transparent border border-white/5 hover:border-white/10'
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
