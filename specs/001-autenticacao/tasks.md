# Tasks: Autenticação, Cadastro e Sessão

**Input**: Design documents from `/specs/001-autenticacao/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Pest (Laravel backend) e Vitest (Next.js frontend). Os testes cobrem a validação de regras de negócio de autenticação e fluxos do BFF.

**Organization**: As tarefas estão organizadas por histórias de usuário para permitir implementação e testes independentes de cada entrega incremental.

---

## Path Conventions

- **Next.js frontend**: `nextjs/`
- **Laravel backend**: `laravel/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialização do projeto, configuração de variáveis de ambiente e dependências básicas de autenticação.

- [x] T001 Instalar pacotes de frontend para o NextAuth no arquivo `nextjs/package.json`
- [x] T002 Configurar variáveis de ambiente de banco e autenticação no arquivo `laravel/.env` e `nextjs/.env`
- [x] T003 [P] Atualizar exemplos de variáveis de ambiente no arquivo `laravel/.env.example` e `nextjs/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Estrutura básica do Laravel (ApiResponse, UserResource, migrations de usuários) e base do proxy de BFF no Next.js.

**⚠️ CRITICAL**: Nenhuma tarefa das histórias de usuário pode começar até que esta fase foundational esteja 100% concluída.

- [x] T004 Criar a trait de respostas HTTP em `laravel/app/Traits/ApiResponse.php`
- [x] T005 [P] Criar o recurso de transformação de usuário em `laravel/app/Http/Resources/UserResource.php`
- [x] T006 Modificar a migration original de criação de usuários em `laravel/database/migrations/0001_01_01_000000_create_users_table.php` para incluir as colunas `role`, `crc`, `office_name` e `active`
- [x] T007 Configurar o tratamento global de exceções HTTP da API em `laravel/bootstrap/app.php` utilizando a trait `ApiResponse`
- [x] T008 [P] Implementar o BFF Proxy Route Handler básico em `nextjs/app/api/proxy/[...path]/route.ts` para repassar requisições genéricas

**Checkpoint**: Fundação pronta - a implementação das histórias de usuário pode começar.

---

## Phase 3: User Story 1 - Cadastro Público de Contador (Priority: P1) 🎯 MVP

**Goal**: Permitir que contadores se registrem de forma pública na plataforma fornecendo dados profissionais.

**Independent Test**: Acessar `/register`, submeter dados válidos, verificar a criação do registro com a role `accountant` ativa no banco de dados e redirecionar para a tela de login.

### Tests for User Story 1
- [x] T009 [P] [US1] Criar o teste Pest de integração em `laravel/tests/Feature/RegisterTest.php` para validar o fluxo de registro e regras de obrigatoriedade/unicidade

### Implementation for User Story 1
- [x] T010 [P] [US1] Criar o Form Request para validação de cadastro em `laravel/app/Http/Requests/RegisterRequest.php`
- [x] T011 [US1] Criar a classe de serviço de usuário em `laravel/app/Services/UserService.php` com a lógica de cadastro
- [x] T012 [US1] Implementar o método de registro em `laravel/app/Http/Controllers/AuthController.php` delegando para o `UserService`
- [x] T013 [US1] Registrar a rota de cadastro `/api/register` no arquivo `laravel/routes/api.php`
- [x] T014 [P] [US1] Criar o serviço de autenticação do cliente em `nextjs/services/auth.ts` com o método para chamar a rota `/api/proxy/register`
- [x] T015 [US1] Construir a interface visual do cadastro utilizando Shadcn UI em `nextjs/app/register/page.tsx`

**Checkpoint**: A história 1 de cadastro está completa e pode ser testada e homologada de forma independente.

---

## Phase 4: User Story 2 - Login Seguro e Unificado (Priority: P1)

**Goal**: Permitir a autenticação de contadores e administradores em tela única e gerenciamento de sessão segura.

**Independent Test**: Submeter credenciais válidas em `/login`, verificar redirecionamento para o dashboard e confirmar a inicialização correta da sessão com os dados do usuário.

### Tests for User Story 2
- [x] T016 [P] [US2] Criar o teste Pest em `laravel/tests/Feature/LoginTest.php` validando autenticação com dados corretos, incorretos e tratamento de contas inativas

### Implementation for User Story 2
- [x] T017 [P] [US2] Criar o Form Request para validação de credenciais de login em `laravel/app/Http/Requests/LoginRequest.php`
- [x] T018 [US2] Implementar método de login emitindo tokens em `laravel/app/Http/Controllers/AuthController.php`
- [x] T019 [US2] Registrar a rota `/api/login` no arquivo `laravel/routes/api.php`
- [x] T020 [US2] Configurar o NextAuth e seu CredentialsProvider em `nextjs/app/api/auth/[...nextauth]/route.ts` para persistir dados do usuário (role, crc, office_name) no token da sessão
- [x] T021 [US2] Construir a tela de login unificada utilizando Shadcn UI em `nextjs/app/login/page.tsx`

**Checkpoint**: Login e sessão seguros estão operantes integrando frontend e backend.

---

## Phase 5: User Story 3 - Sementeira de Administrador (Priority: P2)

**Goal**: Criar o usuário administrador inicial no banco via seeder para suporte global.

**Independent Test**: Executar a sementeira do banco e confirmar que as credenciais do administrador padrão realizam login no painel com role `admin`.

### Tests for User Story 3
- [x] T022 [P] [US3] Criar teste Pest em `laravel/tests/Feature/SeederTest.php` validando se o usuário admin padrão é persistido corretamente após rodar a sementeira
- [x] T023 [US3] Atualizar a sementeira padrão do banco de dados em `laravel/database/seeders/DatabaseSeeder.php` para persistir o administrador padrão com dados específicos e CRC/Escritório nulos

**Checkpoint**: Usuário administrativo padrão operacional e testado.

---

## Phase 6: User Story 4 - Logout e Proteção de Painel (Priority: P1)

**Goal**: Invalidar tokens no backend e frontend no encerramento de sessão, protegendo rotas internas.

**Independent Test**: Clicar em logout, verificar invalidação de tokens no banco de dados, redirecionar para `/login`, e tentar acessar `/dashboard` sem sessão (deve ser redirecionado de volta para `/login`).

### Tests for User Story 4
- [x] T024 [P] [US4] Criar teste Pest em `laravel/tests/Feature/LogoutTest.php` validando a revogação de tokens Sanctum no logout
- [x] T025 [US4] Implementar método de logout (revogação de token) em `laravel/app/Http/Controllers/AuthController.php`
- [x] T026 [US4] Registrar a rota protegida por Sanctum `/api/logout` em `laravel/routes/api.php`
- [x] T027 [US4] Atualizar o proxy do BFF em `nextjs/app/api/proxy/[...path]/route.ts` para capturar a sessão NextAuth e injetar o token Sanctum no cabeçalho Authorization das requisições enviadas ao Laravel
- [x] T028 [US4] Implementar a verificação de autenticação e proteção de rotas `/dashboard/:path*` no arquivo `nextjs/proxy.ts`
- [x] T029 [US4] Criar uma tela de dashboard básica para teste em `nextjs/app/dashboard/page.tsx` exibindo informações da sessão ativa e um botão para realizar logout

**Checkpoint**: Fluxo de logout e proteção de rotas da aplicação ativados com segurança.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificações finais e validação de cenários descritos na documentação.

- [x] T030 Executar os cenários de validação manual descritos em `specs/001-autenticacao/quickstart.md`
- [x] T031 [P] Criar o relatório de entrega em `specs/001-autenticacao/walkthrough.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências - pode iniciar imediatamente.
- **Foundational (Phase 2)**: Depende do término da Phase 1. Bloqueia todas as fases subsequentes de histórias de usuário.
- **User Stories (Phases 3 a 6)**: Todas dependem do encerramento da Phase 2.
  - A *User Story 1* (Cadastro) e *User Story 2* (Login) podem prosseguir de forma paralela.
  - A *User Story 3* (Seeder Admin) depende da migration em T006 estar pronta.
  - A *User Story 4* (Logout/Proteção) depende da estrutura do NextAuth em T020 e login em T018 estarem prontos.
- **Polish (Phase 7)**: Depende do término de todas as histórias de usuário.

### Parallel Opportunities

- Tarefas marcadas com **[P]** não possuem dependências mútuas e podem ser distribuídas entre desenvolvedores de forma paralela.
- A criação de testes automatizados (`[P] [USx]`) pode ser realizada de forma simultânea ou anterior à implementação das respectivas regras do controller/serviço.

---

## Parallel Example: User Story 1

```bash
# Executar em paralelo no início da história 1:
# Desenvolvedor A:
Task: "Criar o teste Pest de integração em laravel/tests/Feature/RegisterTest.php"
# Desenvolvedor B:
Task: "Criar o Form Request para validação de cadastro em laravel/app/Http/Requests/RegisterRequest.php"
# Desenvolvedor C:
Task: "Criar o serviço de autenticação do cliente em nextjs/services/auth.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir Phase 1 (Setup) e Phase 2 (Foundational).
2. Concluir Phase 3 (User Story 1 - Cadastro).
3. **Validar Cadastro**: Executar o cadastro localmente e validar no banco de dados se os dados foram gravados de forma correta e sem a possibilidade de burlar a role.

### Incremental Delivery

1. Habilitar cadastro (`US1`).
2. Adicionar Login e Sessão (`US2`) para contadores.
3. Adicionar Sementeira administrativa (`US3`) permitindo que o administrador faça login pela mesma tela.
4. Adicionar Logout e Proteção de rotas (`US4`) fechando a segurança de rotas do painel.
