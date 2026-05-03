/**
 * Exemplos de Uso do Sistema de Bug Report
 * 
 * Use estes exemplos em seus componentes/páginas para criar fluxos
 * customizados de reportagem de bugs
 */

// ============================================
// 1. Reportar Bug Programaticamente
// ============================================

import { BugReport, generateBugReportId, captureUserEnvironment } from '@/lib/bug-report';

export async function reportBugProgrammatically(
  title: string,
  description: string,
  severity: 'baixa' | 'média' | 'alta' | 'crítica' = 'média'
) {
  const env = captureUserEnvironment();

  const report: BugReport = {
    id: generateBugReportId(),
    title,
    description,
    severity,
    page: env.url,
    userAgent: env.userAgent,
    timestamp: env.timestamp,
  };

  try {
    const response = await fetch('/api/bugs/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });

    if (!response.ok) throw new Error('Falha ao enviar');

    const data = await response.json();
    console.log('✅ Bug reportado:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Erro ao reportar bug:', error);
    throw error;
  }
}

// Exemplo de uso:
// import { reportBugProgrammatically } from '@/lib/bug-report-examples';
// 
// await reportBugProgrammatically(
//   'Checkout não funciona a partir de 100 reais',
//   'Quando tento fazer checkout com valor > 100, o botão fica travado',
//   'alta'
// );

// ============================================
// 2. Hook React para Error Boundary
// ============================================

'use client';

import { useEffect } from 'react';
import { reportBugProgrammatically } from './bug-report-examples';

export function useErrorReporting() {
  useEffect(() => {
    // Capturar erros não tratados
    const handleError = async (event: ErrorEvent) => {
      console.error('Erro capturado:', event.error);

      try {
        await reportBugProgrammatically(
          `Erro JavaScript: ${event.error?.message || 'Desconhecido'}`,
          `Stack: ${event.error?.stack || 'Não disponível'}\n\nArquivo: ${event.filename}:${event.lineno}:${event.colno}`,
          'alta'
        );
      } catch (err) {
        console.error('Falha ao reportar erro:', err);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
}

// Usar em um componente cliente:
// 'use client';
// import { useErrorReporting } from '@/lib/bug-report-examples';
// export default function MyComponent() {
//   useErrorReporting();
//   return <div>Meu conteúdo</div>;
// }

// ============================================
// 3. Reportar Bug ao Capturar uma Imagem
// ============================================

export async function reportBugWithScreenshot(
  title: string,
  description: string,
  screenshot: string,
  severity: 'baixa' | 'média' | 'alta' | 'crítica' = 'média'
) {
  const env = captureUserEnvironment();

  const report: BugReport = {
    id: generateBugReportId(),
    title,
    description,
    severity,
    page: env.url,
    userAgent: env.userAgent,
    timestamp: env.timestamp,
    screenshot, // base64
  };

  const response = await fetch('/api/bugs/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  });

  if (!response.ok) throw new Error('Falha ao enviar');
  return response.json();
}

// ============================================
// 4. Botão Report Bug Inline (sem modal)
// ============================================

'use client';

import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';
import { reportBugProgrammatically } from '@/lib/bug-report-examples';
import { useState } from 'react';

interface InlineBugReportProps {
  title: string;
  description: string;
  severity?: 'baixa' | 'média' | 'alta' | 'crítica';
  onSent?: () => void;
}

export function InlineBugReportButton({
  title,
  description,
  severity = 'média',
  onSent,
}: InlineBugReportProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await reportBugProgrammatically(title, description, severity);
      onSent?.();
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant="ghost"
      size="sm"
      className="gap-2"
    >
      <AlertTriangle className="w-4 h-4" />
      {isLoading ? 'Enviando...' : 'Reportar Problema'}
    </Button>
  );
}

// Usar assim:
// <InlineBugReportButton
//   title="Página de checkout lenta"
//   description="A página demora muito para carregar quando tem muitos items"
//   severity="média"
//   onSent={() => alert('Obrigado pelo reporte!')}
// />

// ============================================
// 5. Context Provider para Múltiplos Reports
// ============================================

'use client';

import { createContext, useContext, useCallback } from 'react';
import { BugReport } from '@/lib/bug-report';

interface BugReportContextType {
  reportBug: (
    title: string,
    description: string,
    severity?: 'baixa' | 'média' | 'alta' | 'crítica'
  ) => Promise<void>;
  reportBugWithScreenshot: (
    title: string,
    description: string,
    screenshot: string,
    severity?: 'baixa' | 'média' | 'alta' | 'crítica'
  ) => Promise<void>;
}

const BugReportContext = createContext<BugReportContextType | undefined>(undefined);

export function BugReportProvider({ children }: { children: React.ReactNode }) {
  const reportBug = useCallback(
    async (
      title: string,
      description: string,
      severity: 'baixa' | 'média' | 'alta' | 'crítica' = 'média'
    ) => {
      await reportBugProgrammatically(title, description, severity);
    },
    []
  );

  const reportBugWithScreenshot = useCallback(
    async (
      title: string,
      description: string,
      screenshot: string,
      severity: 'baixa' | 'média' | 'alta' | 'crítica' = 'média'
    ) => {
      await fetch('/api/bugs/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `bug_${Date.now()}`,
          title,
          description,
          severity,
          screenshot,
          page: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });
    },
    []
  );

  return (
    <BugReportContext.Provider value={{ reportBug, reportBugWithScreenshot }}>
      {children}
    </BugReportContext.Provider>
  );
}

export function useBugReport(): BugReportContextType {
  const context = useContext(BugReportContext);
  if (!context) {
    throw new Error('useBugReport deve ser usado dentro de BugReportProvider');
  }
  return context;
}

// Usar em componentes:
// 'use client';
// import { useBugReport } from '@/lib/bug-report-examples';
// 
// export function MyComponent() {
//   const { reportBug } = useBugReport();
//   
//   return (
//     <button onClick={() => reportBug('Erro', 'Algo deu errado')}>
//       Reportar
//     </button>
//   );
// }

// ============================================
// 6. Integração com Componente de Erro
// ============================================

'use client';

import { useEffect } from 'react';
import { reportBugProgrammatically } from '@/lib/bug-report-examples';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string;
}

export function ErrorBoundary({ children, componentName = 'Desconhecido' }: ErrorBoundaryProps) {
  useEffect(() => {
    const handleError = async (event: ErrorEvent) => {
      await reportBugProgrammatically(
        `Erro em ${componentName}`,
        `${event.error?.message || ''}\n\n${event.error?.stack || ''}`,
        'alta'
      );
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [componentName]);

  return children;
}

// ============================================
// 7. Relatórios Periódicos de Performance
// ============================================

export function reportPerformanceIssues() {
  if (typeof window === 'undefined') return;

  // Usar Web Vitals para detectar performance issues
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Se LCP > 2.5s, reportar como possível issue
      if (entry.name === 'largest-contentful-paint' && entry.startTime > 2500) {
        reportBugProgrammatically(
          'Performance: Largest Contentful Paint lento',
          `LCP demorou ${Math.round(entry.startTime)}ms (limite recomendado: 2.5s)`,
          'média'
        );
      }

      // Se FID > 100ms, reportar
      if (entry.name === 'first-input' && entry.processingDuration > 100) {
        reportBugProgrammatically(
          'Performance: First Input Delay alto',
          `FID: ${Math.round(entry.processingDuration)}ms`,
          'média'
        );
      }
    }
  });

  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
}

// ============================================
// 8. Exemplo Completo em um Componente
// ============================================

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, ChevronDown } from 'lucide-react';

export function QuickBugReportSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
      >
        <AlertTriangle className="w-5 h-5" />
        Encontrou um erro nesta página?
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-4 space-y-2">
          <Button
            onClick={() =>
              reportBugProgrammatically(
                'Erro na página',
                'Encontrei um problema nesta página',
                'alta'
              )
            }
            size="sm"
            className="w-full"
          >
            Reportar Erro
          </Button>
        </div>
      )}
    </div>
  );
}
