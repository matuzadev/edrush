# EdRush — Foco Federal

Plataforma web de estudos para concursos públicos, criada para reunir prática de questões, simulados, acompanhamento de desempenho e recursos de comunidade em uma única experiência.

> **Projeto autoral de Matheus** · [@matuzadev](https://github.com/matuzadev)
>
> A inteligência artificial foi usada como ferramenta de apoio durante o desenvolvimento, acelerando a construção e a evolução de funcionalidades e sistemas mais complexos. A concepção do produto, as decisões técnicas e a responsabilidade pelo projeto são do autor.

## Visão geral

O EdRush organiza a preparação em torno dos objetivos de cada estudante. A aplicação inclui autenticação, onboarding por concurso e área, questões com acompanhamento de respostas, sessões de estudo e simulados. A experiência é complementada por perfis, estatísticas, interação entre estudantes e elementos de gamificação.

## Funcionalidades

- Cadastro e login com e-mail/senha ou Google OAuth.
- Onboarding para selecionar concurso e áreas de estudo.
- Catálogo de concursos, disciplinas, capítulos e questões.
- Questões, registro de respostas e sessões de estudo.
- Simulados com persistência de tentativas e resultados.
- Progresso por capítulo e regras de desbloqueio.
- Dashboard, estatísticas e perfis públicos.
- Comunidade: publicações, comentários, curtidas, grupos, amizades e mensagens.
- Gamificação: XP, níveis, cristais, inventário, avatares, bordas e selos.
- Materiais de estudo, administração de conteúdo e relatos de bugs.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Aplicação web | Next.js 16 · App Router e Route Handlers |
| Interface | React 19 · TypeScript · Tailwind CSS 4 |
| Persistência | Turso/libSQL · SQLite · Drizzle ORM |
| Autenticação | NextAuth 4 · Google OAuth · `bcryptjs` |
| Arquivos | Vercel Blob · `sharp` |
| Conteúdo | `pdfkit` · `cheerio` |
| Infraestrutura | Vercel |
| Qualidade | ESLint · TypeScript |
| Automação de conteúdo | Scripts Python e geração assistida por IA, configurável com Anthropic |

As versões exatas das dependências ficam registradas em [`package.json`](./package.json) e [`package-lock.json`](./package-lock.json).

## Arquitetura e organização

```text
src/
├── app/                 # Páginas App Router e endpoints em app/api/
├── components/          # Componentes compartilhados, estudo, perfil e comunidade
├── contexts/            # Contextos de autenticação e tema
├── data/                # Catálogos e dados iniciais da aplicação
├── db/schema.ts         # Schema relacional Drizzle para SQLite/libSQL
├── hooks/               # Hooks de domínio e interface
├── lib/                 # Acesso a dados, autenticação e regras de negócio
└── types/               # Extensões e tipos compartilhados

scripts/                 # Setup, migração, verificação e carga de conteúdo
public/                  # Imagens, ícones, avatares e fontes
```

### Fluxo da aplicação

1. O Next.js entrega páginas e componentes React pelo App Router.
2. Operações de servidor passam por Route Handlers em `src/app/api/`.
3. A autenticação usa NextAuth; credenciais locais são verificadas com `bcryptjs`.
4. As regras de negócio consultam o banco por meio de [`src/lib/db.ts`](./src/lib/db.ts) e do schema Drizzle em [`src/db/schema.ts`](./src/db/schema.ts).
5. Em desenvolvimento, o cliente pode usar SQLite local. Em produção na Vercel, o banco deve ser remoto e persistente, como Turso/libSQL.
6. Imagens enviadas pela comunidade podem ser armazenadas no Vercel Blob.

O schema cobre, entre outros domínios, usuários e perfis, concursos e editais, questões e respostas, sessões e progresso, simulados, comunidade, mensagens, notificações e inventário.

## Inteligência artificial no desenvolvimento

A IA foi uma ferramenta de apoio de engenharia para acelerar a implementação e a evolução de partes mais complexas do sistema. Ela complementa — não substitui — a autoria, a definição dos requisitos, as decisões de arquitetura e a validação do código.

O repositório contém geração assistida de questões com Anthropic e geração de materiais com Ollama local. São ferramentas auxiliares, exigem configuração própria e revisão do conteúdo antes de qualquer uso.

## Executar localmente

### Requisitos

- Node.js 20.9 ou superior, conforme os requisitos do [`package.json`](./package.json).
- npm.
- Python 3 apenas para os scripts auxiliares de dados/IA.

### Instalação

```bash
npm install
```

A configuração inicial usa SQLite local. Integrações externas podem exigir configuração local antes de serem ativadas.

```bash
npm run dev
```

Abra `http://localhost:3000`.

### Comandos

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run lint` | Executa o ESLint |
| `npm run build` | Gera o build de produção do Next.js |
| `npm run start` | Inicia o build de produção |
| `npm run db:setup` | Inicializa o schema e os dados-base no banco configurado |
| `npm run vercel-build` | Prepara o banco remoto e executa o build para deploy |

## Configuração e deploy

Configure integrações e credenciais no ambiente seguro da plataforma de hospedagem. Não inclua segredos em código ou commits.

## Autoria e licenciamento

**Produto e implementação: Matheus ([`@matuzadev`](https://github.com/matuzadev)).** Bibliotecas e serviços de terceiros permanecem sujeitos às respectivas licenças e termos. Este repositório não inclui uma licença de software livre; sua publicação no GitHub, por si só, não concede permissão de uso, redistribuição ou modificação.
