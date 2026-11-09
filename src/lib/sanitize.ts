// Helpers para mascarar dados sensíveis em logs e respostas.
//
// Regra: sempre que precisar logar/mostrar e-mail, ID de usuário, telefone,
// CPF, etc, passe pelos helpers daqui. Reduz vazamento via stdout/Vercel logs
// e telas compartilhadas.

export function maskEmail(email: string | null | undefined): string {
  if (!email) return '';
  const at = email.indexOf('@');
  if (at < 1) return '***';
  const local = email.slice(0, at);
  const domain = email.slice(at);
  if (local.length <= 2) return `${local[0]}***${domain}`;
  return `${local[0]}${local[1]}***${local[local.length - 1]}${domain}`;
}

export function maskUserId(id: string | null | undefined): string {
  if (!id) return '';
  if (id.length <= 8) return `${id.slice(0, 2)}***`;
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
}

export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '***';
  return `***${digits.slice(-4)}`;
}

// Hash bcrypt "dummy" para usar em comparação anti-timing quando o usuário
// não existe — evita oracle de tempo entre "user not found" vs "wrong password".
// Esse hash é de uma senha aleatória que ninguém usa.
export const DUMMY_BCRYPT_HASH =
  '$2a$12$Lt8vM8uZx6cR4qXJGjP4u.GZMXl9N4U3GZ2vC2.Xr6q2DjF5x6Pse';
