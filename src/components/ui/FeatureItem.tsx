import { LucideIcon } from 'lucide-react';

interface FeatureItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureItem({ icon: Icon, title, description, className = '' }: FeatureItemProps) {
  return (
    <div className={`group p-6 rounded-2xl bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 cursor-default ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center transition-all">
          <Icon size={24} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white mb-1 text-sm">{title}</h3>
          <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
