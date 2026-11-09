/**
 * Exemplo de integração com SendGrid
 * 
 * Passos:
 * 1. npm install @sendgrid/mail
 * 2. Criar chave de API no SendGrid
 * 3. Adicionar SENDGRID_API_KEY ao .env.local
 * 4. Importar esta função no endpoint /api/bugs/report
 */

import { BugReport } from '@/lib/bug-report';

// Descomente quando tiver a dependência instalada:
// import sgMail from '@sendgrid/mail';

/**
 * Envia email com o relatório de bug usando SendGrid
 */
export async function sendBugReportEmail(report: BugReport): Promise<void> {
  // Validar chave de API
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY não configurado. Email não enviado.');
    return;
  }

  if (!process.env.BUG_REPORT_EMAIL) {
    console.warn('BUG_REPORT_EMAIL não configurado. Email não enviado.');
    return;
  }

  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const severityEmoji = {
      baixa: '🟢',
      média: '🟡',
      alta: '🟠',
      crítica: '🔴',
    };

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu"; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .card { background: white; border-radius: 8px; padding: 24px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { border-bottom: 3px solid #10b981; padding-bottom: 16px; margin-bottom: 16px; }
    .title { font-size: 24px; font-weight: bold; margin: 0; }
    .subtitle { font-size: 14px; color: #666; margin: 8px 0 0 0; }
    .field { margin-bottom: 16px; }
    .label { font-size: 12px; color: #999; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
    .value { font-size: 14px; color: #333; margin-top: 4px; }
    .severity { 
      display: inline-block; 
      padding: 4px 12px; 
      border-radius: 4px; 
      font-weight: 600; 
      font-size: 12px;
    }
    .severity-baixa { background: #dbeafe; color: #1e40af; }
    .severity-media { background: #fef3c7; color: #b45309; }
    .severity-alta { background: #fed7aa; color: #9a3412; }
    .severity-critica { background: #fee2e2; color: #991b1b; }
    .screenshot { margin-top: 8px; max-width: 100%; border-radius: 4px; border: 1px solid #e5e5e5; }
    .description { white-space: pre-wrap; color: #555; line-height: 1.6; }
    .footer { text-align: center; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h2 class="title">🐛 Novo Bug Report</h2>
        <p class="subtitle">${new Date(report.timestamp).toLocaleString('pt-BR')}</p>
      </div>

      <div class="field">
        <div class="label">Código ID</div>
        <div class="value"><code>${report.id}</code></div>
      </div>

      <div class="field">
        <div class="label">Severidade</div>
        <div class="value">
          <span class="severity severity-${report.severity}">
            ${severityEmoji[report.severity as keyof typeof severityEmoji]} ${report.severity.toUpperCase()}
          </span>
        </div>
      </div>

      <div class="field">
        <div class="label">Título</div>
        <div class="value">${report.title}</div>
      </div>

      <div class="field">
        <div class="label">Descrição</div>
        <div class="value description">${report.description}</div>
      </div>

      <div class="field">
        <div class="label">Página</div>
        <div class="value"><a href="${report.page}" style="color: #10b981;">${report.page}</a></div>
      </div>

      ${report.screenshot ? `
      <div class="field">
        <div class="label">Screenshot</div>
        <img src="${report.screenshot}" alt="Screenshot" class="screenshot" style="max-height: 400px;">
      </div>
      ` : ''}

      <div style="background: #f9fafb; padding: 16px; border-radius: 4px; margin-top: 16px;">
        <div class="field" style="margin-bottom: 8px;">
          <div class="label">User Agent</div>
          <div class="value" style="font-size: 12px; word-break: break-all;">${report.userAgent}</div>
        </div>

        ${report.email ? `
        <div class="field" style="margin-bottom: 0;">
          <div class="label">Contato</div>
          <div class="value"><a href="mailto:${report.email}" style="color: #10b981;">${report.email}</a></div>
        </div>
        ` : `
        <div class="field" style="margin-bottom: 0;">
          <div class="label">Contato</div>
          <div class="value" style="color: #999;">Não fornecido</div>
        </div>
        `}
      </div>
    </div>

    <div class="card footer">
      <p>Este é um email automatizado do sistema EdRush.</p>
      <p style="margin-top: 8px;">Entre em contato com o usuário usando: ${report.email || 'email não fornecido'}</p>
    </div>
  </div>
</body>
</html>
    `;

    const msg = {
      to: process.env.BUG_REPORT_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@focofederal.com.br',
      subject: `${severityEmoji[report.severity as keyof typeof severityEmoji]} [${report.severity.toUpperCase()}] ${report.title}`,
      html,
      replyTo: report.email,
      headers: {
        'X-Priority': report.severity === 'crítica' ? '1' : '3',
        'X-Bug-Report-ID': report.id,
      },
    };

    await sgMail.send(msg);

    console.log(`✅ Bug report email sent: ${report.id}`);
  } catch (error) {
    console.error('❌ Falha ao enviar email de bug report:', error);
    throw error;
  }
}

/**
 * Versão alternativa sem SendGrid (apenas logging)
 * Use isto temporariamente antes de configurar SendGrid
 */
export async function sendBugReportEmailFallback(report: BugReport): Promise<void> {
  console.log('🐛 BUG REPORT RECEIVED:', {
    id: report.id,
    title: report.title,
    severity: report.severity,
    email: report.email,
    page: report.page,
    timestamp: report.timestamp,
    description: report.description.substring(0, 100) + '...',
  });

  // Aqui você pode:
  // - Salvar em arquivo (fs.appendFile)
  // - Enviar para Slack/Discord webhook
  // - Salvar em banco de dados
  // - etc
}
