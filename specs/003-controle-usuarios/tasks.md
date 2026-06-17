# Tasks: Controle de Usuários (Administrador)

**Input**: Design documents from `/specs/003-controle-usuarios/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Pest (Laravel backend) e Vitest (Next.js frontend). Testes cobrem validação de autenticação, form requests, integridade de exclusão e visibilidade na dock.

**Organization**: As tarefas estão estruturadas por fases e histórias de usuário para entrega e testes incrementais.

---

## Path Conventions

- **Next.js frontend**: `nextjs/`
- **Laravel backend**: `laravel/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialização da estrutura de diretórios da feature no frontend Next.js.

- [x] T001 Criar a estrutura básica de pastas do módulo de usuários em `nextjs/features/users/` (components, services, types)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura de segurança, middlewares de autorização e proteções de rotas.

**⚠️ CRITICAL**: Nenhuma tarefa das histórias de usuário pode começar até que esta fase foundational esteja concluída.

- [x] T002 Criar o middleware de perfil de administrador em `laravel/app/Http/Middleware/EnsureUserIsAdmin.php`
- [x] T003 Registrar o middleware de administrador no bootstrap global em `laravel/bootstrap/app.php`
- [x] T004 Atualizar as proteções de rotas no middleware/proxy do Next.js em `nextjs/proxy.ts` para bloquear o acesso à rota `/dashboard/users` para a role `accountant`

**Checkpoint**: Fundação pronta - a implementação das histórias de usuário pode iniciar.

---

## Phase 3: User Story 1 - Acesso Restrito na Dock (Priority: P1) 🎯 MVP

**Goal**: Exibir a opção de administração de usuários na Dock somente para administradores e proteger a página correspondente.

**Independent Test**: Logar como contador e validar que o botão de usuários não aparece e o link direto é barrado. Logar como admin e validar que o botão aparece e leva à rota `/dashboard/users`.

### Implementation for User Story 1

- [x] T005 [P] [US1] Modificar o componente de menu em `nextjs/components/navigation-dock.tsx` para renderizar condicionalmente a opção de usuários baseando-se na role do NextAuth
- [x] T006 [P] [US1] Criar a página de rota `/dashboard/users` em `nextjs/app/dashboard/users/page.tsx` atuando como wrapper que importa e renderiza `UserManagementPage`
- [x] T007 [US1] Criar testes unitários em `nextjs/features/users/__tests__/dock-visibility.test.tsx` para cobrir a exibição condicional do menu por perfil de usuário

**Checkpoint**: O acesso restrito e a exibição do menu na Dock estão implementados e testados.

---

## Phase 4: User Story 2 - Listagem e Visualização de Usuários (Priority: P1)

**Goal**: Listar todos os usuários cadastrados em formato de tabela com filtros de busca.

**Independent Test**: Acessar o painel como administrador e verificar se a tabela é renderizada com todos os usuários do banco mostrando Nome, E-mail, CRC, Perfil e Status.

### Implementation for User Story 2

- [x] T008 [P] [US2] Criar o teste de integração Pest em `laravel/tests/Feature/UserManagementTest.php` para cobrir o endpoint de listagem autorizado para admin e bloqueado para contador
- [x] T009 [P] [US2] Criar o API Resource de formatação em `laravel/app/Http/Resources/UserResource.php` para serializar o usuário
- [x] T010 [US2] Implementar método de listagem em `laravel/app/Services/UserService.php` e registrar no `UserController` em `laravel/app/Http/Controllers/UserController.php`
- [x] T011 [US2] Registrar as rotas do CRUD `/api/users` sob o middleware Sanctum e EnsureUserIsAdmin no arquivo `laravel/routes/api.php`
- [x] T012 [P] [US2] Criar arquivo de tipos locais em `nextjs/features/users/types/index.ts` com as tipagens de `User` e `UserFormPayload`
- [x] T013 [US2] Implementar o serviço de busca de usuários em `nextjs/features/users/services/userService.ts` chamando a rota do BFF proxy
- [x] T014 [US2] Criar a tabela visual em `nextjs/features/users/components/user-table.tsx` usando Shadcn UI table
- [x] T015 [US2] Criar o componente container da feature em `nextjs/features/users/components/user-management-page.tsx` coordenando a listagem e filtros
- [x] T016 [US2] Registrar e expor a página de usuários no arquivo de entrada `nextjs/features/users/index.ts`

**Checkpoint**: A listagem de usuários com tabela e busca está operante.

---

## Phase 5: User Story 3 - Criação e Cadastro de Novos Usuários (Priority: P2)

**Goal**: Permitir que o administrador cadastre novos contadores e administradores de forma manual.

**Independent Test**: Clicar em "Novo Usuário", preencher dados válidos de administrador/contador e verificar a adição na tabela.

### Implementation for User Story 3

- [x] T017 [P] [US3] Criar o validador Form Request em `laravel/app/Http/Requests/UserStoreRequest.php` validando dados de criação do usuário
- [x] T018 [US3] Atualizar testes Pest em `laravel/tests/Feature/UserManagementTest.php` cobrindo o fluxo de criação e rejeição de e-mail duplicado
- [x] T019 [US3] Implementar o método de inserção de usuário no service `laravel/app/Services/UserService.php` e chamar no `UserController@store`
- [x] T020 [US3] Adicionar serviço de criação de usuário em `nextjs/features/users/services/userService.ts`
- [x] T021 [US3] Criar o modal de formulário em `nextjs/features/users/components/user-dialog.tsx` para cadastro unificado de usuários com campos condicionais

**Checkpoint**: O cadastro de usuários está funcional no frontend e backend.

---

## Phase 6: User Story 4 - Edição, Atualização e Exclusão de Usuários (Priority: P2)

**Goal**: Permitir edição de dados cadastrais, alternância de status e exclusão de usuários da base (bloqueando a auto-exclusão).

**Independent Test**: Modificar o perfil de um contador para admin e checar se CRC foi limpo no banco. Tentar deletar o próprio admin e validar erro. Deletar outro admin de teste e checar remoção.

### Implementation for User Story 4

- [x] T022 [P] [US4] Criar o validador Form Request em `laravel/app/Http/Requests/UserUpdateRequest.php`
- [x] T023 [US4] Atualizar testes Pest em `laravel/tests/Feature/UserManagementTest.php` cobrindo validação de integridade de edição, anulação de CRC para administrador promovido e restrição de auto-exclusão/auto-inativação
- [x] T024 [US4] Implementar métodos de atualização e deleção no service `laravel/app/Services/UserService.php` e integrá-los aos respectivos métodos do `UserController`
- [x] T025 [US4] Adicionar métodos de atualização e deleção em `nextjs/features/users/services/userService.ts`
- [x] T026 [US4] Criar o modal de confirmação de exclusão em `nextjs/features/users/components/delete-confirm.tsx`
- [x] T027 [US4] Integrar modais de edição e exclusão nas ações da tabela no component `nextjs/features/users/components/user-management-page.tsx`

**Checkpoint**: Todas as operações de edição, inativação e exclusão estão operacionais e seguras.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificação final e documentação.

- [x] T028 Executar testes de compilação total no frontend via `npm run build` na pasta `nextjs/`
- [x] T029 Executar todos os cenários de testes manuais descritos em `specs/003-controle-usuarios/quickstart.md`
- [x] T030 Criar o relatório de walkthrough em `specs/003-controle-usuarios/walkthrough.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** e **Foundational (Phase 2)**: Fases de inicialização. Devem rodar primeiro. A Phase 2 bloqueia o início de qualquer User Story.
- **User Stories (Phases 3 a 6)**: Rodam após o término da Phase 2. Podem prosseguir em paralelo.
- **Polish (Phase 7)**: Executada apenas após a conclusão e homologação de todas as histórias de usuário.

### Parallel Opportunities

- Tarefas marcadas com **[P]** (como a criação de Form Requests, tipos e layouts) não dependem de outros commits de código e podem ser executadas de forma paralela.

---

## Parallel Example: User Story 3

```bash
# Executar em paralelo no início da história 3:
# Desenvolvedor A:
Task: "Criar o validador Form Request em laravel/app/Http/Requests/UserStoreRequest.php"
# Desenvolvedor B:
Task: "Criar o modal de formulário em nextjs/features/users/components/user-dialog.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir Setup (Phase 1) e Foundational (Phase 2).
2. Concluir Acesso Restrito na Dock (Phase 3 - User Story 1).
3. **Validar Acesso:** Garantir que contadores não vejam a opção na dock nem acessem a rota, e admins possuam acesso total.

### Incremental Delivery

1. Habilitar a proteção e acesso à rota de gerenciamento (`US1`).
2. Adicionar a visualização e listagem dos usuários existentes (`US2`).
3. Adicionar formulário de cadastro de novos usuários (`US3`).
4. Adicionar edição e deleção segura com controle de auto-exclusão (`US4`).
