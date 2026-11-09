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
					<div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all [transition-duration:var(--transition-base)] ${
						iconActive ? 'text-[var(--emerald-400)] scale-110' : 'text-slate-500'
					}`}>
						<Icon size={18} />
					</div>
				)}
				<input
					className={`
						input-modern w-full
						${Icon ? 'pl-12 pr-4' : 'px-4'}
						${error ? 'border-red-400/50 bg-red-500/5 focus:border-red-400 focus:ring-red-500/20' : ''}
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
