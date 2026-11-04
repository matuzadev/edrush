import { signIn } from 'next-auth/react';

const SIGN_IN_TIMEOUT_MS = 15_000;

export async function startGoogleSignIn(callbackUrl: string): Promise<never> {
  try {
    await signIn('google', { callbackUrl });
  } catch {
    throw new Error('Não foi possível iniciar o acesso com Google. Tente novamente ou entre com e-mail.');
  }

  return new Promise<never>((_, reject) => {
    window.setTimeout(
      () => reject(new Error('O redirecionamento para o Google demorou demais. Tente novamente.')),
      SIGN_IN_TIMEOUT_MS,
    );
  });
}

export function getGoogleSignInErrorMessage(code: string | null): string | null {
  if (!code) return null;

  switch (code) {
    case 'OAuthSignin':
      return 'O Google não conseguiu iniciar o login. Verifique as credenciais OAuth na Vercel.';
    case 'OAuthCallback':
      return 'O Google não conseguiu concluir o login. Confira a URL de retorno autorizada no Google Cloud.';
    case 'OAuthAccountNotLinked':
      return 'Este e-mail já está cadastrado por outro método. Entre com e-mail e senha.';
    case 'AccessDenied':
      return 'O acesso foi cancelado ou negado pelo Google.';
    default:
      return 'Não foi possível entrar com o Google. Tente novamente ou use e-mail e senha.';
  }
}
