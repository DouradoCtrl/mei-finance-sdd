# Tasks: Cadastro e Login de Usuário (Refatoração de Validação)

**Input**: Design documents from `/specs/001-autenticacao/`

**Organization**: As tarefas abaixo estão organizadas por histórias de usuário para permitir a refatoração e validação incrementais.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: N/A - O projeto já está inicializado.

- [x] T001 Estrutura do projeto inicializada e configurada

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: N/A - Banco de dados e infraestrutura de rotas de API e middleware já integrados.

- [x] T002 Banco de dados PostgreSQL rodando via Docker
- [x] T003 Rotas de API e middleware Sanctum configurados no backend

---

## Phase 3: User Story 1 - Cadastro de Novo Usuário (Priority: P1) 🎯 MVP

**Goal**: Refatorar a página de Cadastro para remover validações client-side, permitindo que a API do Laravel valide os dados e exiba as mensagens sob os inputs correspondentes ou via toast.

**Independent Test**: Tentar cadastrar um usuário com campos vazios, senhas menores de 6 dígitos ou CNPJ inválido e garantir que as mensagens de erro retornadas pela API aparecem debaixo de cada input específico.

### Implementation for User Story 1

- [x] T004 [P] [US1] Remover validações locais de formato e atributo `required` dos inputs de formulário em `frontend/app/register/page.tsx`
- [x] T005 [US1] Adicionar estado `fieldErrors` para capturar os erros da API em `frontend/app/register/page.tsx`
- [x] T006 [US1] Ajustar o retorno de erros do formulário para exibir mensagens individuais de Form Request (`data.name`, `data.email`, `data.cnpj`, `data.password`) abaixo dos inputs correspondentes em `frontend/app/register/page.tsx`
- [x] T007 [US1] Integrar alertas gerais de erro de cadastro com notificações flutuantes usando a biblioteca `sonner` em `frontend/app/register/page.tsx`

**Checkpoint**: A página de cadastro está totalmente integrada à validação da API e renderizando erros abaixo dos campos de forma responsiva.

---

## Phase 4: User Story 2 - Login Seguro (Priority: P1)

**Goal**: Refatorar a página de Login para remover atributos `required`, delegando a validação para o Laravel Form Request e renderizando erros abaixo dos campos e toasts para falhas gerais de credenciais.

**Independent Test**: Tentar logar com dados vazios e verificar os avisos abaixo dos campos. Tentar logar com credenciais inválidas e verificar o surgimento do toast.

### Implementation for User Story 2

- [x] T008 [P] [US2] Remover atributos `required` dos inputs de formulário em `frontend/app/login/page.tsx`
- [x] T009 [US2] Adicionar estado `fieldErrors` para mapear erros estruturados em `frontend/app/login/page.tsx`
- [x] T010 [US2] Alterar `handleSubmit` em `frontend/app/login/page.tsx` para chamar o serviço direto de `login` da API e interceptar `ApiError` com status 422 (erros de campo) ou 401 (erro de credenciais)
- [x] T011 [US2] Mapear e exibir os erros individuais abaixo dos inputs de e-mail e senha em `frontend/app/login/page.tsx`
- [x] T012 [US2] Exibir o erro de credenciais incorretas (mensagem geral vinda da API) via Toast da biblioteca `sonner` em `frontend/app/login/page.tsx`

**Checkpoint**: O formulário de login está refatorado e exibe erros específicos sob os inputs ou toasters flutuantes para falhas de credenciais gerais.

---

## Phase 5: User Story 3 - Logout (Priority: P2)

**Goal**: Verificar o funcionamento correto do encerramento de sessão.

**Independent Test**: Clicar no botão "Sair" e confirmar redirecionamento com revogação do token.

### Implementation for User Story 3

- [x] T013 [US3] Validar que o fluxo de logout destrói a sessão no NextAuth e realiza a chamada de revogação no backend sem interrupções

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificações de build e testes automatizados.

- [x] T014 Rodar suíte de testes de autenticação no backend: `docker compose exec backend php artisan test --filter=AuthAttributesTest`
- [x] T015 Rodar verificação de tipos estáticos no frontend: `npx tsc --noEmit` na pasta `frontend`
- [x] T016 Rodar linter no frontend: `npm run lint` na pasta `frontend`

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Story 1 (Phase 3)** e **User Story 2 (Phase 4)** dependem apenas da execução das tarefas desta refatoração, sem bloqueio mútuo direto (podem rodar em paralelo ou sequencialmente).
- **Polish (Phase 6)** depende da conclusão da refatoração das telas de cadastro e login.

---

## Parallel Opportunities

- As refatorações de login (`Phase 4`) e de cadastro (`Phase 3`) mexem em arquivos completamente diferentes e isolados, permitindo desenvolvimento em paralelo sem gerar conflitos de merge.
