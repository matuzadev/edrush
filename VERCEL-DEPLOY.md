# Publicar o EdRush na Vercel

Guia rápido para publicar quando as alterações locais estiverem prontas. **Este guia não publica a aplicação**; siga os passos somente quando decidir entrar online.

## 1. Preparar o banco Turso

1. No Turso, confirme qual banco contém os dados que devem ir para produção. A aplicação local já foi verificada com um banco remoto Turso.
2. Faça um backup/snapshot antes de conectar a Vercel. A inicialização da aplicação cria/ajusta tabelas e insere seeds; também remove alguns slugs de concursos descontinuados e desvincula as questões associadas. Revise essa inicialização antes de apontar para um banco com dados importantes.
3. Copie do painel do Turso a URL `libsql://...` e gere um token de autenticação. Não os coloque no código, em commits, screenshots ou mensagens.
4. Para testar um Preview da Vercel, prefira um banco Turso separado. Não conecte Preview a produção.

## 2. Criar o projeto Vercel

1. Envie as alterações revisadas para o repositório GitHub.
2. Na Vercel, escolha **Add New → Project**, importe o repositório EdRush e confirme **Next.js** como framework.
3. Antes de implantar, abra **Settings → Environment Variables** e cadastre as variáveis abaixo em **Production**.
4. Em **Settings → Build and Deployment → Build Command**, use `npx next build --no-lint`, que corresponde ao build de produção validado neste projeto. O ESLint ainda não está instalado; não use `npm run build` sem antes resolver essa pendência.

## 3. Cadastrar variáveis de produção

| Variável | Valor |
| --- | --- |
| `NEXTAUTH_URL` | URL canônica HTTPS do site, por exemplo `https://edrush.com.br`. Não inclua caminhos. |
| `NEXTAUTH_SECRET` | Segredo aleatório forte, com pelo menos 32 caracteres. |
| `TURSO_DB_URL` | URL `libsql://...` do banco de produção. |
| `TURSO_AUTH_TOKEN` | Token do banco Turso de produção. |
| `QUESTION_SECRET` | Segredo aleatório separado, com pelo menos 16 caracteres. Gere 32 bytes. |
| `GOOGLE_CLIENT_ID` | Client ID do OAuth Web do Google. |
| `GOOGLE_CLIENT_SECRET` | Client Secret correspondente. |
| `ADMIN_EMAILS` | E-mails de administração separados por vírgula, sem espaços desnecessários. |

Gere **segredos diferentes** no seu computador e cole-os diretamente na Vercel — não compartilhe nem salve os valores neste arquivo:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use a primeira saída para `NEXTAUTH_SECRET` e a segunda para `QUESTION_SECRET`. Cadastre também as credenciais OAuth do Google; elas não estão configuradas no ambiente local verificado.

## 4. Configurar login Google

1. No Google Cloud Console, selecione/crie um projeto, configure a tela de consentimento OAuth e crie um **OAuth Client ID** do tipo **Web application**.
2. Em **Authorized JavaScript origins**, adicione a origem de produção, sem barra final: `https://seu-dominio`.
3. Em **Authorized redirect URIs**, adicione exatamente: `https://seu-dominio/api/auth/callback/google`.
4. Se o domínio ainda não estiver definido, use inicialmente o domínio HTTPS atribuído pela Vercel. Ao adicionar domínio próprio, atualize a origem, o redirect URI e `NEXTAUTH_URL` para esse domínio.
5. Copie Client ID e Client Secret para as variáveis da Vercel. Para testar Preview, configure separadamente os domínios de Preview no OAuth e use um banco de teste.

## 5. Domínio e publicação

1. Em **Settings → Domains**, adicione o domínio desejado e siga as instruções DNS da Vercel.
2. Confirme que o domínio está servindo HTTPS; defina `NEXTAUTH_URL` com esse endereço final.
3. Faça o deploy de produção somente após backup, revisão do banco e configuração das variáveis.
4. Se alterar variáveis, faça um novo deploy para que sejam aplicadas.

## 6. Checklist após o deploy

- A página inicial e `/concursos` carregam e exibem os concursos esperados.
- Criar conta com e-mail e senha, sair e entrar novamente.
- Testar cadastro/login Google e confirmar o callback sem erro.
- Abrir questões, responder uma questão e confirmar que o token é validado.
- Abrir e concluir um simulado; verificar respostas e tentativa no banco.
- Confirmar que o administrador configurado em `ADMIN_EMAILS` consegue acessar funções administrativas e que uma conta comum não consegue.
- Verificar **Vercel → Logs** e corrigir erros de inicialização, autenticação ou conexão com Turso antes de divulgar o endereço.

## Importante

- Nunca use `NEXT_PUBLIC_` para segredos. As variáveis acima devem permanecer somente no servidor.
- Variáveis locais em `.env.local` não são copiadas automaticamente para a Vercel.
- O banco remoto e suas credenciais foram verificados localmente, mas isso não configura a hospedagem nem substitui o backup e o teste de produção.
- O build local validado anteriormente usou `npx next build --no-lint`; ESLint não está instalado no projeto. Considere configurar lint e uma implantação Preview antes de liberar o site.
