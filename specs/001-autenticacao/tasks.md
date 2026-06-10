# Tasks: Cadastro e Login de Usuário (Laravel + Next.js)

**Input**: Design documents from `/specs/001-autenticacao/`

**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/auth-api.md, quickstart.md

**Tests**: Testes manuais integrados conforme guia `quickstart.md`.

---

## Phase 1: Setup (Infraestrutura Compartilhada)

**Purpose**: Inicialização dos subprojetos Frontend e Backend e instalação de dependências.

- [x] T001 Inicializar o projeto Laravel API na pasta `backend/`
- [x] T002 Inicializar o projeto Next.js (com TypeScript e App Router) na pasta `frontend/`

---

## Phase 2: Foundational (Prerequisitos Bloqueantes)

**Purpose**: Configuração do SQLite, migrações e ativação do Laravel Sanctum.

**⚠️ CRITICAL**: Nenhuma tarefa das histórias de usuário pode começar até que esta fase termine.

- [x] T003 Configurar conexão SQLite no arquivo `backend/.env` e ativar as dependências padrão do Laravel Sanctum
- [x] T004 Criar migration para adicionar o campo `cnpj` (opcional) à tabela `users` do Laravel e rodar `php artisan migrate`

**Checkpoint**: Banco de dados e autenticação Sanctum prontos no backend.

---

## Phase 3: User Story 1 - Cadastro de Novo Usuário MEI (Priority: P1) 🎯 MVP

**Goal**: Permitir que novos usuários se cadastrem no sistema fornecendo Nome, E-mail, Senha e CNPJ.

**Independent Test**: Cadastrar um usuário via endpoint POST `/api/register` e verificar se a linha com o hash da senha foi criada na tabela `users` do SQLite e se o token é retornado.

### Implementation for User Story 1

- [x] T005 [US1] Criar validação de dados usando Request Validator do Laravel em `backend/app/Http/Requests/RegisterRequest.php`
- [x] T006 [US1] Criar o controlador de autenticação e implementar o método `register` (criando o usuário com hash de senha e retornando o token do Sanctum) em `backend/app/Http/Controllers/AuthController.php`
- [x] T007 [US1] Mapear a rota pública `/api/register` em `backend/routes/api.php`
- [x] T008 [US1] Criar a página Next.js de cadastro com formulário e validações em `frontend/src/app/register/page.tsx`
- [x] T009 [US1] Implementar no Next.js o envio dos dados do formulário de cadastro para a API e redirecionamento de sucesso em `frontend/src/app/register/page.tsx`

**Checkpoint**: Cadastro de usuário está totalmente funcional e integrado ponta a ponta.

---

## Phase 4: User Story 2 - Login Seguro (Priority: P1)

**Goal**: Autenticar o usuário cadastrado gerando um token do Sanctum e permitindo acesso à Dashboard.

**Independent Test**: Fazer login pelo frontend, salvar o token no cookie/localStorage e verificar se a página `/dashboard` renderiza as informações do usuário.

### Implementation for User Story 2

- [x] T010 [US2] Implementar a validação de login e geração de token Sanctum em `backend/app/Http/Controllers/AuthController.php`
- [x] T011 [US2] Mapear a rota pública `/api/login` em `backend/routes/api.php`
- [x] T012 [US2] Criar a página de login no Next.js em `frontend/src/app/login/page.tsx`
- [x] T013 [US2] Implementar lógica de envio de credenciais no Next.js, salvando o token recebido no cookie/localStorage in `frontend/src/app/login/page.tsx`
- [x] T014 [US2] Criar a página de Dashboard protegida contra acessos não autenticados (verificando o token ativo) em `frontend/src/app/dashboard/page.tsx`

**Checkpoint**: Login e proteção de rotas funcionando em todo o sistema.

---

## Phase 5: User Story 3 - Logout (Priority: P2)

**Goal**: Permitir que o usuário saia de sua conta de forma segura, invalidando o token no backend.

**Independent Test**: Clicar no botão "Sair", verificar se o token é excluído da tabela `personal_access_tokens` do SQLite e garantir que a página `/dashboard` seja inacessível.

### Implementation for User Story 3

- [x] T015 [US3] Implementar o método `logout` (excluindo o token atual do Sanctum) na rota protegida `/api/logout` em `backend/app/Http/Controllers/AuthController.php` e `backend/routes/api.php`
- [x] T016 [US3] Adicionar botão de logout no Next.js que envia a requisição para a API de logout, limpa o token local e redireciona para `/login` em `frontend/src/app/dashboard/page.tsx`

**Checkpoint**: Fluxo de logout completo e seguro.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias de estilo, responsividade, tratamento de erros elegante no Next.js e documentação.

- [x] T017 [P] Estilizar as telas de Login, Cadastro e Dashboard com um tema escuro moderno, transições suaves e alertas de feedback usando CSS Modules em `frontend/src/styles/`
- [x] T018 Criar o arquivo `README.md` na raiz do projeto com as instruções de execução e inicialização do Laravel e do Next.js
- [x] T019 Validar todos os cenários de teste descritos em `specs/001-autenticacao/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Inicia imediatamente.
- **Foundational (Phase 2)**: Depende de Phase 1 (configura pacotes e inicializa banco).
- **User Story 1 (Phase 3)**: Depende de Phase 2.
- **User Story 2 (Phase 4)**: Depende de Phase 3 (precisa de usuários cadastrados para poder logar).
- **User Story 3 (Phase 5)**: Depende de Phase 4.
- **Polish (Phase 6)**: Rodado ao final de todas as histórias.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Concluir Setup e Foundational (T001, T002, T003, T004).
2. Concluir cadastro de usuário (T005 a T009) -> Testar.
3. Concluir login e token Sanctum (T010 a T014) -> Testar.
4. **VALIDAÇÃO MVP:** Testar se um usuário cadastrado consegue logar e ter acesso à página restrita.
5. Finalizar Logout e Estilos.
