import { NextRequest, NextResponse } from 'next/server';
import { BugReport } from '@/lib/bug-report';
import { maskEmail } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';
// import { saveBugReportToDatabase } from '@/lib/db-bug-reports';
// import { sendBugReportEmail } from '@/lib/email-bug-report';

/**
 * POST /api/bugs/report
 * 
 * Recebe, valida e processa relatórios de bugs
 * 
 * Passos para integração completa:
 * 1. Descomentar as importações acima
 * 2. Instalar @sendgrid/mail: npm install @sendgrid/mail
 * 3. Adicionar SENDGRID_API_KEY e BUG_REPORT_EMAIL ao .env.local
 * 4. Descomentar as linhas de salvamento no banco e envio de email abaixo
 */
export async function POST(request: NextRequest) {
  const limited = rateLimit(request);
  if (limited) return limited;

  try {
    const body: BugReport = await request.json();

    // ============ VALIDAÇÕES ============
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      );
    }

    if (!body.description || !body.description.trim()) {
      return NextResponse.json(
        { error: 'Descrição é obrigatória' },
        { status: 400 }
      );
    }

    if (!['baixa', 'média', 'alta', 'crítica'].includes(body.severity)) {
      return NextResponse.json(
        { error: 'Severidade inválida' },
        { status: 400 }
      );
    }

    if (body.email && !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    if (body.screenshot && body.screenshot.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Screenshot muito grande (máximo 5MB)' },
        { status: 400 }
      );
    }

    // Validar formato base64 do screenshot — só PNG/JPEG/WebP.
    if (body.screenshot && !/^data:image\/(png|jpeg|webp);base64,/.test(body.screenshot)) {
      return NextResponse.json(
        { error: 'Formato de screenshot inválido' },
        { status: 400 }
      );
    }

    // ============ LOG (PII mascarada) ============
    console.log('Bug Report Received:', {
      id: body.id,
      severity: body.severity,
      page: body.page,
      email: maskEmail(body.email),
      hasScreenshot: !!body.screenshot,
      // Título e descrição NÃO são logados — podem conter PII (nome, dados de
      // tela com e-mail, dados de outros usuários, etc).
    });

    // ============ SALVAMENTO NO BANCO (OPCIONAL) ============
    // Descomente quando tiver banco configurado:
    // await saveBugReportToDatabase(body);

    // ============ ENVIO DE EMAIL (OPCIONAL) ============
    // Descomente quando tiver SendGrid configurado:
    // try {
    //   await sendBugReportEmail(body);
    // } catch (emailError) {
    //   console.error('Email send failed:', emailError);
    //   // Não falhe a requisição se o email falhar
    // }

    // ============ RESPOSTA ============
    return NextResponse.json(
      {
        success: true,
        id: body.id,
        message: 'Relatório de bug recebido com sucesso! Obrigado por ajudar a melhorar o Foco Federal.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Bug report error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar relatório. Tente novamente.' },
      { status: 500 }
    );
  }
}

/**
 * Validar formato de email de forma simples
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

