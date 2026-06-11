# Implementation Plan: Cadastro e Login de Usuário (Laravel Sanctum + Next.js)

**Branch**: `001-autenticacao` | **Date**: 2026-06-10 | **Spec**: [spec.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/001-autenticacao/spec.md)

**Input**: Feature specification from `/specs/001-autenticacao/spec.md`

## Summary

Implementação do sistema de cadastro e autenticação de usuários para o **MEI Finance** utilizando um backend API REST com **Laravel** e **Laravel Sanctum** para autenticação de tokens seguros. O frontend será uma aplicação web dinâmica construída com **Next.js (React)** consumindo a API. O banco de dados padrão será o PostgreSQL 16 para maior robustez e escalabilidade.

## Technical Context

**Language/Version**: PHP 8.2+ (Laravel 11+), Node.js v20+ (Next.js 14+)

**Primary Dependencies**:
- **Backend:** Laravel Framework, Laravel Sanctum (tokens de acesso pessoal)
- **Frontend:** React, Next.js, Axios ou Fetch API (para requisições http), CSS Modules

**Storage**: PostgreSQL 16 (rodando localmente via Docker Compose com volume persistido em `./.docker/pgdata`)

**Testing**: Pest ou PHPUnit (Backend), Jest ou React Testing Library (Frontend)

**Target Platform**: Web browsers modernos

**Project Type**: Web Application (API Backend + SPA/SSR Frontend)

**Performance Goals**: Latência da API de login < 300ms

**Constraints**: Criptografia de senhas usando o mecanismo nativo do Laravel (`Hash::make` via bcrypt). Tokens JWT/Sanctum de curta duração para segurança.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Princípio I (Foco no Teste):** Utilizar recursos de testes integrados do Laravel/Next. (APROVADO)
- **Princípio II (Segurança):** Laravel Sanctum gerencia tokens de forma segura e as senhas usam Bcrypt por padrão. (APROVADO)
- **Princípio III (Simplicidade):** Banco PostgreSQL 16 rodando localmente via Docker Compose, mantendo o ambiente limpo e reprodutível. (APROVADO)

## Project Structure

Dividido em dois subprojetos principais na raiz:

```text
backend/                 # Projeto Laravel
├── app/
│   ├── Http/
│   │   ├── Controllers/ # AuthController
│   │   ├── Middleware/  # EnsureUserIsActive middleware
│   │   ├── Requests/    # Validações de Cadastro/Login
│   │   ├── Resources/   # API Resources para formatar entidades (UserResource)
│   ├── Models/          # User (incluindo HasApiTokens do Sanctum)
│   └── Services/        # Classes de serviço contendo a regra de negócios (AuthService)
├── database/
│   └── migrations/      # Migrations (incluindo CNPJ, role e active)
├── routes/
│   └── api.php          # Rotas expostas para o Next.js
├── tests/
│   └── Feature/         # Testes de integração (AuthAttributesTest)
└── package.json

frontend/                # Projeto Next.js
├── src/
│   ├── app/             # App Router (pages: login, cadastro, dashboard)
│   ├── components/      # Componentes reutilizáveis (formulários, alertas)
│   └── styles/          # Estilos visuais CSS Modules
├── package.json
└── next.config.js
```

**Structure Decision**: Estrutura desmembrada em `backend/` (Laravel) e `frontend/` (Next.js) para independência de deploys e desenvolvimento.
