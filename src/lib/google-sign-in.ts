import { signIn } from 'next-auth/react';

const SIGN_IN_TIMEOUT_MS = 15_000;

export async function getGoogleSignInUrl(callbackUrl: string): Promise<string> {
  let timeoutId: number | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(
      () => reject(new Error('O servidor de autenticação não respondeu. Tente novamente.')),
      SIGN_IN_TIMEOUT_MS,
    );
  });

  try {
    const result = await Promise.race([
      signIn('google', { callbackUrl, redirect: false }),
      timeout,
    ]);

    if (result?.error) {
      throw new Error(
        'Não foi possível iniciar o acesso com Google. Verifique a configuração do login ou entre com e-mail.',
      );
    }

    if (!result?.url) {
      throw new Error(
        'O login com Google não retornou um endereço válido. Tente novamente ou entre com e-mail.',
      );
    }

    return result.url;
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  }
}
