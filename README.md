# Viva Noronha

Plataforma completa de turismo para Fernando de Noronha — conectando viajantes com atividades, restaurantes, hospedagens, veículos e eventos locais.

## Visão Geral

Viva Noronha é um marketplace onde parceiros de turismo listam seus serviços e viajantes podem explorar, reservar e pagar — tudo em um só lugar. A plataforma inclui dashboards por perfil de acesso para parceiros, funcionários e administradores, chat em tempo real, recomendações com IA e processamento de pagamentos integrado.

### Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TailwindCSS 4, Shadcn/ui |
| Backend | Convex (banco de dados, funções serverless, armazenamento de arquivos) |
| Autenticação | Clerk (com RBAC customizado) |
| Pagamentos | Mercado Pago |
| Email | Resend + React Email |
| IA | OpenAI (recomendações), Convex RAG + Agent plugins |
| Monitoramento | Sentry |
| Deploy | Vercel |

## Funcionalidades

- **Reservas multi-serviço** — Atividades, restaurantes, hospedagens, veículos, eventos e pacotes de viagem
- **Controle de acesso por perfil** — Perfis de Viajante, Parceiro, Funcionário e Master (admin) com permissões granulares
- **Chat em tempo real** — Mensagens entre viajantes e parceiros
- **Recomendações com IA** — Sugestões de viagem com OpenAI e RAG
- **Sistema de cupons** — Descontos percentuais, valor fixo e frete grátis com segmentação por serviço/usuário
- **Geração de vouchers** — Vouchers em PDF com QR code para reservas confirmadas
- **Dashboard de parceiros** — Gestão de serviços, confirmação de reservas, analytics, gestão de funcionários
- **Dashboard do viajante** — Reservas, lista de desejos, recomendações, personalização de perfil

## Primeiros Passos

### Pré-requisitos

- [Bun](https://bun.sh) (v1.0+)
- [Convex CLI](https://docs.convex.dev/getting-started) (`npm install -g convex`)
- Contas em: [Clerk](https://clerk.com), [Convex](https://convex.dev), [Mercado Pago](https://www.mercadopago.com.br/developers)

### Configuração

1. **Clone e instale as dependências**

   ```bash
   git clone https://github.com/Web-Star-Studio/viva-noronha-prod.git
   cd viva-noronha-prod
   bun install
   ```

2. **Configure as variáveis de ambiente**

   ```bash
   cp .env.local.copy .env.local
   ```

   Preencha os valores necessários — veja a seção [Variáveis de Ambiente](#variáveis-de-ambiente) abaixo.

3. **Inicie os servidores de desenvolvimento**

   Execute em terminais separados:

   ```bash
   bun run dev        # Servidor Next.js (Turbopack)
   bunx convex dev    # Backend Convex
   ```

   A aplicação estará disponível em `http://localhost:3000`.

## Variáveis de Ambiente

Copie `.env.local.copy` para `.env.local` e configure:

| Categoria | Variáveis |
|-----------|-----------|
| **Clerk** | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_DOMAIN` |
| **Convex** | `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT` |
| **Mercado Pago** | `MERCADO_PAGO_PUBLIC_KEY`, `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_WEBHOOK_SECRET` |
| **Email (SMTP)** | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` |
| **OpenAI** | `OPENAI_API_KEY` |
| **Google Maps** | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` |
| **Sentry** | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` |
| **URLs da App** | `NEXT_PUBLIC_APP_URL`, `SITE_URL` |

## Scripts

```bash
bun run dev              # Inicia Next.js com Turbopack
bun run build            # Build de produção
bun run lint             # ESLint
bun run typecheck        # Verificação TypeScript (apenas frontend)

# Testes
bun run test:openai      # Integração OpenAI
bun run test:integration # Integração Convex
bun run test:email       # Envio de email
bun run test:webhook     # Webhooks de assinatura
bun run test:mp-webhook  # Webhooks Mercado Pago
```

## Arquitetura

```
src/
├── app/                    # Next.js App Router
│   ├── (protected)/        # Rotas protegidas por autenticação
│   │   ├── admin/          # Dashboards de parceiro e admin
│   │   └── meu-painel/     # Dashboard do viajante
│   ├── atividades/         # Atividades (público)
│   ├── restaurantes/       # Restaurantes (público)
│   ├── veiculos/           # Veículos (público)
│   └── pacotes/            # Pacotes (público)
├── components/             # Componentes React organizados por domínio
│   ├── auth/               # Route gates (AdminRouteGate, ProtectedRouteGate)
│   ├── bookings/           # Formulários de reserva
│   ├── cards/              # Cards de exibição de serviços
│   ├── dashboard/          # Painéis de dashboard
│   └── ui/                 # Componentes Shadcn/ui
├── lib/
│   ├── hooks/              # React hooks
│   └── services/           # Camada de mapeamento de tipos Convex → frontend
convex/
├── domains/                # Backend orientado a domínios
│   ├── activities/         # queries, mutations, types, utils
│   ├── restaurants/
│   ├── bookings/
│   ├── rbac/               # Controle de acesso baseado em perfis
│   ├── mercadoPago/        # Processamento de pagamentos
│   └── ...                 # 15+ domínios de negócio
└── schema.ts               # Schema do banco de dados
```

Cada domínio Convex segue uma estrutura consistente: `queries.ts`, `mutations.ts`, `actions.ts`, `types.ts`, `utils.ts` e `index.ts`.

> [!NOTE]
> O diretório `convex/domains/stripe/` contém stubs deprecados. Todo processamento de pagamento utiliza o Mercado Pago.

### RBAC

Quatro perfis com acesso hierárquico:

- **Viajante** — Navega e reserva serviços
- **Funcionário** — Equipe do parceiro com permissões por serviço (via tabela `assetPermissions`)
- **Parceiro** — Donos de negócio com acesso total aos próprios serviços
- **Master** — Administradores da plataforma com acesso total

As funções do backend utilizam os wrappers `mutationWithRole()` e `queryWithRole()` de `convex/domains/rbac/` para aplicar o controle de acesso.

## Deploy

O projeto é implantado na **Vercel** com builds automáticos a partir da branch `main`. O Convex gerencia o deploy do backend separadamente via `npx convex deploy`.

> [!IMPORTANT]
> Configure todas as variáveis de ambiente tanto na Vercel (para o frontend) quanto no painel do Convex (para funções backend que precisam de chaves de API).
