# Implementation Plan: Controle de Usuários (Administrador)

**Branch**: `003-controle-usuarios` | **Date**: 2026-06-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-controle-usuarios/spec.md`

## Summary

Esta funcionalidade consiste em criar um módulo de gerenciamento administrativo de usuários no sistema MEI Finance. O administrador logado poderá listar, criar, ler, editar e deletar (CRUD) outros usuários do sistema (administradores ou contadores). 

A interface de usuário no frontend será integrada à `NavigationDock` existente, exibindo o ícone de gerenciamento apenas para usuários com perfil `admin`. A página de destino `/dashboard/users` será protegida por controle de rotas no Next.js (BFF Middleware) e os endpoints da API no Laravel serão protegidos por middleware de perfil (`RoleMiddleware` ou similar). O código do frontend seguirá estritamente a nova estrutura de **Feature-Driven Architecture**, residindo em `features/users`.

---

## Technical Context

**Language/Version**: PHP 8.3+, TypeScript/Node.js 18+ (Next.js 15+ / App Router)

**Primary Dependencies**: Laravel Sanctum, NextAuth, Radix UI / Shadcn UI (Table, Dialog, Form components), Lucide React, Tailwind CSS

**Storage**: PostgreSQL 16 (Porta: 5433)

**Testing**: Pest (Laravel backend), Vitest (Next.js frontend)

**Target Platform**: Web Browser (Desktop / Responsive Mobile)

**Project Type**: Web Application

**Performance Goals**: Tempo de carregamento da listagem < 1s, API response time < 200ms

**Constraints**: Autenticação de rotas e segurança ponta a ponta no BFF; controle restrito ao perfil `admin`

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

*   **Princípio I (Service Layer Laravel):** A lógica do CRUD de usuários residirá em `laravel/app/Services/UserService.php`. O controller `UserController` será magro, delegando a lógica ao service e usando `UserStoreRequest` / `UserUpdateRequest` para validação de dados de entrada.
*   **Princípio II (Trait ApiResponse):** Toda resposta da API do Laravel usará os métodos `successResponse` ou `errorResponse` da trait `ApiResponse` nos controllers ou exceções globais.
*   **Princípio III (Banco Dockerizado):** Mapeado na porta `5433` (Postgres 16). Sem alterações estruturais de DB locais.
*   **Princípio IV (Frontend / BFF / Feature-Driven):** 
    *   Toda a lógica e componentes de interface residirão dentro de `nextjs/features/users/`.
    *   A página `/dashboard/users/page.tsx` será apenas um wrapper fino que importa a view principal de `@/features/users`.
    *   Chamadas HTTP diretas a partir da página são proibidas. As requisições serão centralizadas em `nextjs/features/users/services/userService.ts` e passarão pelo proxy do BFF.
    *   A estilização seguirá o Dark Mode (cinza escuro do Discord, vidro translúcido, botões em verde esmeralda, ausência de tons azuis).
*   **Princípio V (SDD):** Planejamento e especificações gerados no ciclo correto do Spec Kit.
*   **Princípio VI (Conventional Commits):** Mensagens de commits escritas em português seguindo padrões semânticos (ex: `feat: criar UserService` ou `refactor: isolar tabela de usuarios`).

*Gate Status: Passed.*

---

## Project Structure

### Documentation (this feature)

```text
specs/003-controle-usuarios/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Research notes
├── data-model.md        # Entities and validations
├── quickstart.md        # Scenario testing and setup guide
└── contracts/
    └── api.md           # API request/response contracts
```

### Source Code (repository root)

Selecionado: **Option 2: Laravel backend + Next.js Feature-Driven frontend**

```text
laravel/                  # Laravel backend
├── app/
│   ├── Http/Controllers/
│   │   └── UserController.php           # [NEW] Controller para CRUD de usuários
│   ├── Http/Requests/
│   │   ├── UserStoreRequest.php         # [NEW] Validação de criação de usuário
│   │   └── UserUpdateRequest.php        # [NEW] Validação de atualização de usuário
│   ├── Http/Resources/
│   │   └── UserResource.php             # [NEW] Recurso de formatação JSON de usuário
│   ├── Services/
│   │   └── UserService.php              # [NEW] Serviço isolado com a lógica de negócio
│   └── Models/
│       └── User.php                     # [MODIFY] Adicionar auxiliares ou escopos (se necessário)
├── routes/
│   └── api.php                          # [MODIFY] Registrar rotas protegidas por Sanctum e Admin
└── tests/
    └── Feature/
        └── UserManagementTest.php       # [NEW] Testes Pest para o CRUD de usuários

nextjs/                   # Next.js frontend (Feature-Driven Architecture)
├── app/
│   └── dashboard/
│       └── users/
│           └── page.tsx                 # [NEW] Página wrapper (thin page router)
├── features/
│   └── users/
│       ├── components/
│       │   ├── user-table.tsx           # [NEW] Tabela de listagem de usuários com Shadcn
│       │   ├── user-dialog.tsx          # [NEW] Modal unificado de criação/edição
│       │   └── delete-confirm.tsx       # [NEW] Modal de confirmação de exclusão
│       ├── services/
│       │   └── userService.ts           # [NEW] Métodos de comunicação com o BFF proxy
│       ├── types/
│       │   └── index.ts                 # [NEW] Tipagens locais (User, Form Payload)
│       └── index.ts                     # [NEW] Ponto de entrada (Public API da feature)
├── components/
│   └── navigation-dock.tsx              # [MODIFY] Habilitar link condicional ao Admin
└── proxy.ts                             # [MODIFY] Adicionar proteção de rota para /dashboard/users
```

**Structure Decision**: A feature de gerenciamento de usuários utilizará uma pasta dedicada `features/users/` no Next.js para encapsular todas as lógicas e componentes visuais de forma desacoplada e modular. O backend Laravel estenderá suas rotas de API protegidas com validação centrada em classes Request e controle em Service dedicada.

---

## Complexity Tracking

Não existem desvios ou violações dos princípios estabelecidos na Constituição. O design técnico respeita 100% da arquitetura de camadas no backend e da Feature-Driven Architecture no frontend Next.js.

---

## Verification Plan

### Automated Tests
*   **Backend (Laravel Pest):**
    *   Executar testes de endpoints: `vendor/bin/pest tests/Feature/UserManagementTest.php`
    *   Testes cobrirão: listagem autorizada/bloqueada, criação com dados corretos/incorretos, limpeza de campos CRC ao mudar perfil, restrição de auto-exclusão e auto-inativação.
*   **Frontend (Vitest):**
    *   Executar testes de renderização: `npm run test features/users`
    *   Testes de UI cobrirão: visibilidade condicional na Dock com base na role e renderização de dados na tabela.

### Manual Verification
*   Seguir o guia detalhado em `specs/003-controle-usuarios/quickstart.md` para testar os 5 cenários manuais de ponta a ponta (acesso restrito, listagem, cadastro, edição e exclusão/bloqueio de auto-exclusão).
