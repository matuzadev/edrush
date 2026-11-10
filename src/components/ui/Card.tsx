import { ReactNode } from 'react';

interface CardProps {
 children: ReactNode;
 className?: string;
 variant?: 'default' | 'elevated' | 'ghost' | 'glass';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
 const baseStyles = 'rounded-[var(--radius-xl)] transition-all [transition-duration:var(--transition-base)]';

 const variants = {
 default: 'bg-[var(--card)]/95 backdrop-blur-xl border border-[var(--border)] shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] hover:border-[var(--border-hover)] hover:-translate-y-[2px]',
 elevated: 'bg-[var(--gradient-card)] backdrop-blur-[20px] border border-[var(--emerald-500)]/30 shadow-[var(--shadow-xl),var(--shadow-glow)] hover:shadow-[var(--glow-emerald)] hover:border-[var(--emerald-400)]/40 hover:-translate-y-[3px]',
 ghost: 'bg-transparent border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-white/[0.03]',
 glass: 'glass-card hover:shadow-[var(--glow-emerald)] hover:-translate-y-[2px]'
 };

 return (
 <div className={`${baseStyles} ${variants[variant]} ${className}`}>
 {children}
 </div>
 );
}