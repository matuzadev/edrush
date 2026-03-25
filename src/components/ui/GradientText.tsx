interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <span className={`bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}
