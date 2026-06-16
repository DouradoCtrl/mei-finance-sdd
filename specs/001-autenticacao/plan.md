# Implementation Plan: Autenticação, Cadastro e Sessão

**Branch**: `001-autenticacao` | **Date**: 2026-06-16 | **Spec**: [spec.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/001-autenticacao/spec.md)

**Input**: Feature specification from `/specs/001-autenticacao/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementar o sistema de cadastro de contadores, login unificado para contadores e administradores, gerenciamento de sessão seguro via NextAuth + Laravel Sanctum e proteção de rotas privadas do painel. A arquitetura de comunicação seguirá estritamente o fluxo unidirecional BFF (Backend-for-Frontend), onde o token do Laravel Sanctum (`auth_token`) é mantido em cookies seguros (`HttpOnly`) no cliente NextAuth, sendo injetado nas chamadas da API pelo BFF Proxy Route Handler.

## Technical Context

**Language/Version**: PHP 8.3 (Laravel 13), TypeScript (Next.js 16)

**Primary Dependencies**: Laravel Sanctum, NextAuth.js, Shadcn UI (Radix UI)

**Storage**: PostgreSQL 16 (porta Docker mapeada para 5433)

**Testing**: Pest (Laravel backend), Vitest (Next.js frontend)

**Target Platform**: Navegadores Web Modernos

**Project Type**: Web application decoupled (Next.js frontend + Laravel backend API)

**Performance Goals**: < 1s para o proxying de requisições e validação de sessão

**Constraints**: Tokens de API Sanctum nunca devem ser acessados via JavaScript cliente (cookies seguros HttpOnly); a validação de dados de entrada deve ser efetuada no backend através de Laravel Form Requests, com o BFF servindo apenas como proxy transparente.

**Scale/Scope**: Cadastro de Contador (público), Administradores (semeados no banco, sem registro público).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Arquitetura de Camadas (Service Layer)**: As regras de negócio ficarão em `app/Services/` (ex: `UserService.php`). Os controllers serão magros e não executarão validação inline nem lógica de persistência direta.
- [x] **Form Requests**: Toda validação no backend será realizada via Form Requests específicos (ex: `RegisterRequest.php`, `LoginRequest.php`).
- [x] **Respostas JSON Padronizadas**: Uso da trait `ApiResponse` em todos os controllers para respostas unificadas (`successResponse` e `errorResponse`).
- [x] **Uso de API Resources**: Utilização de `App\Http\Resources\UserResource` para expor dados de usuário, evitando o retorno direto de models Eloquent.
- [x] **Tratamento Global de Exceções**: Captura e formatação de exceções no `bootstrap/app.php` utilizando a trait `ApiResponse` (erros 422, 401, 403, 404 padronizados).
- [x] **Segurança de Tokens**: Injeção e gestão de tokens no cookie HttpOnly gerido pelo NextAuth/BFF.
- [x] **Decoupled Components**: Componentes visuais do Shadcn UI baseados em Radix UI.
- [x] **Fluxo Unidirecional (BFF)**: Requisições do frontend passam pela rota `/api/proxy/[...path]` antes de atingir o Laravel. Páginas não realizam `fetch` direto ao backend Laravel.
- [x] **Validação Delegada**: O BFF Next.js atua como proxy direto, sem duplicar regras de validação.

## Project Structure

```text
laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── AuthController.php
│   │   ├── Requests/
│   │   │   ├── LoginRequest.php
│   │   │   └── RegisterRequest.php
│   │   └── Resources/
│   │       └── UserResource.php
│   ├── Services/
│   │   └── UserService.php
│   └── Traits/
│       └── ApiResponse.php
├── database/
│   ├── migrations/
│   │   └── 0001_01_01_000000_create_users_table.php (Modificada)
│   └── seeders/
│       └── DatabaseSeeder.php
└── tests/
    └── Feature/
        └── AuthTest.php

nextjs/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── proxy/
│   │       └── [...path]/
│   │           └── route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   └── ui/
├── proxy.ts
└── services/
    └── auth.ts
```

**Structure Decision**: Decidido pela estrutura de Web Application dividida entre os diretórios `laravel/` e `nextjs/` no repositório, com integração via BFF proxying.

## Complexity Tracking

*Nenhuma violação aos princípios da constituição.*
