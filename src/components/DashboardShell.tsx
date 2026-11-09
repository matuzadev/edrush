'use client';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}
