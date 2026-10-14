/**
 * Serviço de Email Transacional
 * Suporta: Resend, SendGrid, Nodemailer
 * 
 * Por padrão, usa Resend (mais simples para Next.js)
 * Configurar em .env.local:
 * - RESEND_API_KEY=seu_token
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@focofederal.com';

/**
 * Enviar email via Resend (recomendado para produção)
 */
async function sendViaResend(options: EmailOptions) {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.warn('⚠️ RESEND_API_KEY não está configurado');
    console.log('📧 Email simulado:', {
      to: options.to,
      subject: options.subject,
    });
    return true;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: options.from || FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Email enviado via Resend:', data.id);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email via Resend:', error);
    return false;
  }
}

/**
 * Email de confirmação de cadastro
 */
export function emailConfirmacaoCadastro(
  email: string,
  nome: string,
  confirmacaoLink: string
) {
  return {
    to: email,
    subject: '🎉 Bem-vindo ao EdRush! Confirme seu email',
    html: `
      <h2>Olá, ${nome}!</h2>
      <p>Obrigado por se registrar no EdRush.</p>
      <p>Para ativar sua conta, clique no botão abaixo:</p>
      <a href="${confirmacaoLink}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #10b981;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
      ">Confirmar Email</a>
      <p style="margin-top: 20px; color: #666; font-size: 14px;">
        Ou copie este link: ${confirmacaoLink}
      </p>
      <p style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; color: #999; font-size: 12px;">
        EdRush - Preparação para Concursos
      </p>
    `,
  };
}

/**
 * Email de recuperação de senha
 */
export function emailRecuperacaoSenha(
  email: string,
  nome: string,
  resetLink: string
) {
  return {
    to: email,
    subject: '🔐 Recuperar Senha - EdRush',
    html: `
      <h2>Olá, ${nome}!</h2>
      <p>Recebemos uma solicitação para recuperar sua senha.</p>
      <p>Clique no botão abaixo para definir uma nova senha:</p>
      <a href="${resetLink}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #10b981;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
      ">Recuperar Senha</a>
      <p style="margin-top: 20px; color: #d32f2f; font-size: 14px;">
        ⚠️ Este link expira em 24 horas
      </p>
      <p style="margin-top: 20px; color: #999; font-size: 12px;">
        Se você não solicitou recuperação de senha, ignore este email.
      </p>
      <p style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; color: #999; font-size: 12px;">
        EdRush - Preparação para Concursos
      </p>
    `,
  };
}

/**
 * Email de sucesso de pagamento
 */
export function emailConfirmacaoPagamento(
  email: string,
  nome: string,
  plano: string,
  dataExpiracao: string
) {
  return {
    to: email,
    subject: '✅ Pagamento Confirmado - Novo Plano Ativado!',
    html: `
      <h2>🎉 Bem-vindo ao EdRush Premium!</h2>
      <p>Olá, ${nome}!</p>
      <p>Seu pagamento foi processado com sucesso!</p>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Plano:</strong> ${plano}</p>
        <p><strong>Válido até:</strong> ${new Date(dataExpiracao).toLocaleDateString('pt-BR')}</p>
      </div>

      <p>Agora você tem acesso a:</p>
      <ul>
        <li>🎯 Milho + questões em sua disciplina</li>
        <li>📊 Analytics detalhados de performance</li>
        <li>🎓 Simulados completos</li>
        <li>💬 Comunidade de estudos</li>
        <li>📱 Acesso no app mobile</li>
      </ul>

      <a href="https://focofederal.com/dashboard" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #10b981;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        margin-top: 20px;
      ">Ir para o Dashboard</a>

      <p style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; color: #999; font-size: 12px;">
        EdRush - Preparação para Concursos
      </p>
    `,
  };
}

/**
 * Email de novo concurso (notificação)
 */
export function emailNovoConcurso(
  email: string,
  nome: string,
  concursoNome: string,
  uf: string,
  linkConcurso: string
) {
  return {
    to: email,
    subject: `🚀 Novo Concurso em ${uf} - ${concursoNome}`,
    html: `
      <h2>Novo Concurso Disponível!</h2>
      <p>Oi, ${nome}!</p>
      <p>Um novo concurso foi publicado que pode te interessar:</p>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <h3>${concursoNome}</h3>
        <p><strong>Estado:</strong> ${uf}</p>
      </div>

      <a href="${linkConcurso}" style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #10b981;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
      ">Ver Detalhes do Concurso</a>

      <p style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; color: #999; font-size: 12px;">
        EdRush - Preparação para Concursos
      </p>
    `,
  };
}

/**
 * Enviar email genérico
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Usar Resend por padrão
    return await sendViaResend(options);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return false;
  }
}

/**
 * Enviar email de confirmação de cadastro
 */
export async function sendWelcomeEmail(
  email: string,
  nome: string,
  confirmacaoLink: string
): Promise<boolean> {
  const emailOptions = emailConfirmacaoCadastro(email, nome, confirmacaoLink);
  return sendEmail(emailOptions);
}

/**
 * Enviar email de recuperação de senha
 */
export async function sendPasswordResetEmail(
  email: string,
  nome: string,
  resetLink: string
): Promise<boolean> {
  const emailOptions = emailRecuperacaoSenha(email, nome, resetLink);
  return sendEmail(emailOptions);
}

/**
 * Enviar email de confirmação de pagamento
 */
export async function sendPaymentConfirmationEmail(
  email: string,
  nome: string,
  plano: string,
  dataExpiracao: string
): Promise<boolean> {
  const emailOptions = emailConfirmacaoPagamento(email, nome, plano, dataExpiracao);
  return sendEmail(emailOptions);
}

/**
 * Enviar notificação de novo concurso
 */
export async function sendNewCompetitionEmail(
  email: string,
  nome: string,
  concursoNome: string,
  uf: string,
  linkConcurso: string
): Promise<boolean> {
  const emailOptions = emailNovoConcurso(email, nome, concursoNome, uf, linkConcurso);
  return sendEmail(emailOptions);
}
