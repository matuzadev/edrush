# Publicar o EdRush na Vercel

Guia rápido para publicar quando as alterações locais estiverem prontas. **Este guia não publica a aplicação**; siga os passos somente quando decidir entrar online.

## Limitações dos planos gratuitos

- O Vercel Hobby é restrito a projetos pessoais e não comerciais. Como o projeto inclui páginas de assinatura e checkout, confirme que o uso será pessoal e não comercial; para oferecer um serviço comercial, use um plano compatível, como o Pro.
- O Hobby limita a duração de uma função a 300 segundos. A rota `src/app/api/admin/study-materials/generate-all/route.ts` pede 800 segundos; a geração em lote não é compatível com o Hobby sem ser dividida em trabalhos menores ou executada em um plano com limite maior.
- O domínio compartilhado `*.vercel.app` não pode ser colocado atrás do proxy DNS da Cloudflare. Para usar o proxy e o WAF da Cloudflare, é necessário um domínio próprio. A Cloudflare só protege as requisições que passam pelo registro DNS proxied; o alias `*.vercel.app` continua fora dessa proteção.
- Se usar somente `*.vercel.app`, use o Firewall da Vercel: o Hobby inclui mitigação DDoS e permite até 3 regras WAF personalizadas e 10 bloqueios de IP. Esses controles protegem o tráfego web na Vercel, não conexões diretas ao Turso.

## Usar Cloudflare com um domínio próprio

1. Adicione o domínio ao projeto Vercel e copie os registros DNS que a própria Vercel indicar. Depois, configure a zona na Cloudflare e delegue a ela os nameservers do domínio.
2. Crie na Cloudflare os registros A/CNAME apontando para a Vercel e habilite o proxy apenas nos registros de tráfego web. Siga os valores indicados pela Vercel; eles podem variar por projeto.
3. Use SSL/TLS **Full (strict)** e confirme que o certificado do domínio está ativo na Vercel. Não use regras de cache amplo: deixe APIs, autenticação e páginas privadas sem cache compartilhado.
4. Configure `NEXTAUTH_URL` com o domínio HTTPS canônico e atualize as origens/redirect URIs do OAuth Google. Teste login, callback, uploads e chamadas `/api/*` após ativar o proxy.
5. O plano gratuito da Cloudflare inclui regras WAF personalizadas, mas recursos de rate limiting podem ter cobrança ou limites próprios. Confira os limites atuais da conta antes de depender deles. A Cloudflare protege o tráfego web, não as conexões diretas da aplicação com o Turso; mantenha o token do banco somente no servidor e use um banco separado para Preview.

## 1. Preparar o banco Turso

1. No Turso, confirme qual banco contém os dados que devem ir para produção. Um build local com banco temporário não valida a implantação nem o banco de produção.
2. Faça e confirme um backup/snapshot do banco de produção antes de conectá-lo à Vercel. A inicialização cria/ajusta tabelas e insere seeds; não exclui mais concursos nem registros relacionados. Registros existentes de concursos removidos do seed são preservados. Mudanças destrutivas devem ser feitas somente em migração revisada, depois do backup.
3. Copie do painel do Turso a URL `libsql://...` e gere um token de autenticação. Não os coloque no código, em commits, screenshots ou mensagens.
4. Para testar um Preview da Vercel, prefira um banco Turso separado. Não conecte Preview a produção.

## 2. Criar o projeto Vercel

1. Envie as alterações revisadas para o repositório GitHub.
2. Na Vercel, escolha **Add New → Project**, importe o repositório EdRush e confirme **Next.js** como framework.
3. Antes de implantar, abra **Settings → Environment Variables** e cadastre as variáveis abaixo nos ambientes **Production** e **Preview**. Use uma URL/token de Turso separados para Preview; não compartilhe credenciais de produção com esse ambiente.
4. Em **Settings → Build and Deployment → Build Command**, defina exatamente `npm run vercel-build`. Esse comando executa `npm run db:setup` antes de `npm run build`; a configuração explícita evita depender do build padrão do Next.js. O setup exige URL/token Turso remotos e interrompe o deploy se a configuração estiver ausente ou qualquer operação SQL de migração/seed falhar.
5. O Next.js 16 não executa ESLint durante o build; valide o lint localmente com `npm run lint`.

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
| `FOUNDER_EMAIL` | Opcional; e-mail privado da conta fundadora para liberar itens exclusivos. |

Gere **segredos diferentes** no seu computador e cole-os diretamente na Vercel — não compartilhe nem salve os valores neste arquivo:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use a primeira saída para `NEXTAUTH_SECRET` e a segunda para `QUESTION_SECRET`. Cadastre também as credenciais OAuth do Google diretamente na Vercel.

Para Preview, configure `TURSO_DB_URL` e `TURSO_AUTH_TOKEN` no escopo **Preview**, apontando para um banco de teste separado. Cada build Vercel executa o setup no banco configurado para aquele ambiente, então não use o banco de produção em Preview.

## 4. Configurar login Google

1. No Google Cloud Console, selecione/crie um projeto, configure a tela de consentimento OAuth e crie um **OAuth Client ID** do tipo **Web application**.
2. Em **Authorized JavaScript origins**, adicione a origem de produção, sem barra final: `https://seu-dominio`.
3. Em **Authorized redirect URIs**, adicione exatamente: `https://seu-dominio/api/auth/callback/google`.
4. Se o domínio ainda não estiver definido, use inicialmente o domínio HTTPS atribuído pela Vercel. Ao adicionar domínio próprio, atualize a origem, o redirect URI e `NEXTAUTH_URL` para esse domínio.
5. Copie Client ID e Client Secret para as variáveis da Vercel. Para testar Preview, cadastre variáveis próprias no ambiente **Preview**, autorize a origem HTTPS e o redirect URI exatos do domínio de Preview no Google OAuth, e use credenciais/banco separados dos de produção.
6. Endereços em `ADMIN_EMAILS` só recebem acesso administrativo ao entrar pelo Google com o e-mail verificado. O login por e-mail e senha não concede privilégios administrativos.

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

## Validar um Preview com segurança

1. Crie um banco Turso exclusivo para Preview e cadastre sua URL/token somente no ambiente **Preview** da Vercel. Não reutilize o banco nem o token de produção.
2. Cadastre no ambiente **Preview** os segredos de autenticação e credenciais OAuth próprios para teste. No Google Cloud Console, autorize a origem `https://<domínio-preview>` e o redirect URI `https://<domínio-preview>/api/auth/callback/google`.
3. Faça um deploy Preview e teste cadastro/login, login Google, callback, questões, simulado e permissões administrativas usando contas de teste.
4. Confira os logs do deploy e confirme que o Preview aponta ao banco isolado antes de executar qualquer fluxo que grave dados.

As variáveis, a configuração OAuth e o fluxo de Preview precisam ser verificados nos painéis autenticados da Vercel e do Google e em um deploy real. Um build local não valida esses itens.

## Importante

- Nunca use `NEXT_PUBLIC_` para segredos. As variáveis acima devem permanecer somente no servidor.
- Variáveis locais em `.env.local` não são copiadas automaticamente para a Vercel.
- A configuração da hospedagem, as variáveis da Vercel, as credenciais Google e o banco de produção ainda precisam ser verificados nos painéis; um build local não comprova esses itens nem substitui o backup e o teste em Preview.
- Para implantação Vercel, o Build Command deve ser `npm run vercel-build`; rode `npm run lint` e `npx tsc --noEmit` localmente antes de liberar o site.
- `npm run build` continua sendo o build local sem setup antecipado; a inicialização do banco permanece no runtime durante o desenvolvimento local. Para testar o setup isoladamente sem banco externo, use `TURSO_DB_URL=file::memory: npm run db:setup` (PowerShell: `$env:TURSO_DB_URL='file::memory:'; npm run db:setup`).
