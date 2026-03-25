import { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconActive?: boolean;
}

export function Input({ 
  label, 
  error, 
  icon: Icon,
  iconActive = false,
  className = '',
  ...props 
}: InputProps) {
  return (
    <div className="space-y-2.5">
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            iconActive ? 'text-emerald-400 scale-110' : 'text-slate-500'
          }`}>
            <Icon size={18} />
          </div>
        )}
        <input
          className={`
            w-full py-3.5 rounded-xl outline-none transition-all duration-300
            bg-white/[0.03] border border-white/10
            placeholder:text-slate-600
            hover:border-white/20
            focus:border-emerald-400/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-emerald-500/20
            ${Icon ? 'pl-12 pr-4' : 'px-4'}
            ${error ? 'border-red-400/50 bg-red-500/5' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1.5">
          <span className="w-1 h-1 bg-red-400 rounded-full flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
