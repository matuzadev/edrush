export interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'baixa' | 'média' | 'alta' | 'crítica';
  page: string;
  userAgent: string;
  timestamp: string;
  email?: string;
  screenshot?: string; // base64
}

export function generateBugReportId(): string {
  return `bug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function captureUserEnvironment() {
  return {
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
    timestamp: new Date().toISOString(),
  };
}

export async function captureScreenshot(): Promise<string | null> {
  try {
    if (typeof window === 'undefined') return null;
    
    const canvas = await (window as any).html2canvas?.(document.body, {
      allowTaint: true,
      useCORS: true,
      scale: 0.5, // 50% para reduzir tamanho
      windowHeight: Math.min(window.innerHeight, 1080),
    });

    return canvas?.toDataURL('image/jpeg', 0.6) || null;
  } catch (error) {
    console.warn('Screenshot capture failed:', error);
    return null;
  }
}

export const SEVERITY_COLORS = {
  baixa: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  média: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  alta: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  crítica: 'text-red-400 bg-red-500/10 border-red-500/30',
};
