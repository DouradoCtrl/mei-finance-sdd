# Implementation Plan: Cadastro e Login de Usuário (Laravel Sanctum + Next.js)

**Branch**: `001-autenticacao` | **Date**: 2026-06-11 | **Spec**: [spec.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/001-autenticacao/spec.md)

**Input**: Feature specification from `/specs/001-autenticacao/spec.md`

## Summary

Refatoração das telas de cadastro (`/register`) e login (`/login`) no Next.js para remover qualquer lógica de validação no lado do cliente (client-side validation). Toda a validação será delegada para a API Laravel (via Form Requests). O frontend consumirá os erros estruturados da API (422) e os renderizará diretamente abaixo de cada input afetado, enquanto erros gerais de regra de negócio serão exibidos via toasts flutuantes com a biblioteca `sonner`.

## Technical Context

**Language/Version**: PHP 8.2+ (Laravel 11+), Node.js v20+ (Next.js 16.2.9)

**Primary Dependencies**:
- **Backend:** Laravel Framework, Laravel Sanctum (tokens de acesso pessoal)
- **Frontend:** React, Next.js, NextAuth, Sonner (notificações toast), GlowUI (componentes de UI customizados)

**Storage**: PostgreSQL 16 (rodando localmente via Docker Compose mapeado em `./.docker/pgdata`)

**Testing**: Pest/PHPUnit (Backend)

**Target Platform**: Web browsers modernos

**Project Type**: Web Application (API Backend + SPA/SSR Frontend)

**Performance Goals**: Latência da API de login < 300ms

**Constraints**: Criptografia de senhas usando o mecanismo nativo do Laravel (`Hash::make` via bcrypt). Tokens JWT/Sanctum de curta duração para segurança.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Princípio I (Foco no Teste):** Utilizar recursos de testes integrados do Laravel/Next. (APROVADO)
- **Princípio II (Segurança):** Laravel Sanctum gerencia tokens de forma segura e as senhas usam Bcrypt por padrão. (APROVADO)
- **Princípio III (Simplicidade):** Banco PostgreSQL 16 rodando localmente via Docker Compose, mantendo o ambiente limpo e reprodutível. (APROVADO)
- **Princípio IV (Frontend modular):** Consumo dos endpoints com `apiFetch` passando o `accessToken` do NextAuth. (APROVADO)
- **Princípio V (Versionamento Rastreável):** Commit de arquivos de forma atômica seguindo Conventional Commits em português. (APROVADO)

## Project Structure

```text
backend/                 # Projeto Laravel
├── app/
│   ├── Http/
│   │   ├── Controllers/ # AuthController
│   │   ├── Requests/    # LoginRequest, RegisterRequest (centralizam a validação)
│   │   ├── Resources/   # UserResource
│   ├── Models/          # User
│   └── Services/        # AuthService
└── database/
    └── migrations/      # Migrations

frontend/                # Projeto Next.js
├── app/
│   ├── login/           # Página de Login (exibe erros abaixo dos inputs ou via toast)
│   │   └── page.tsx
│   ├── register/        # Página de Cadastro (exibe erros abaixo dos inputs ou via toast)
│   │   └── page.tsx
│   ├── auth.ts          # Configuração NextAuth
│   └── dashboard/       # Painel interno protegido
└── components/
    └── custom/          # Custom GlowUI e componentes de estilos
```

## Proposed Changes

### Frontend Components

#### [MODIFY] [page.tsx (login)](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend/app/login/page.tsx)
- Remover atributo `required` dos inputs para permitir que o formulário em branco seja enviado e validado exclusivamente pela API.
- Adicionar estado local `fieldErrors` do tipo `Record<string, string[]>` para armazenar erros específicos de campos enviados pela API.
- Ajustar `handleSubmit` para chamar diretamente o serviço de `login` da API e verificar se retorna erros HTTP 422 de validação.
- Se a validação for bem-sucedida, disparar o login do NextAuth (`signIn`).
- Renderizar mensagens de erro dinâmicas em vermelho abaixo de cada input (`email` e `password`).
- Disparar mensagens gerais de erro usando `toast.error` (da biblioteca `sonner`).

#### [MODIFY] [page.tsx (register)](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend/app/register/page.tsx)
- Remover validação manual local de senha (comprimento mínimo de 6 dígitos) e atributos `required` dos inputs de formulário.
- Adicionar estado local `fieldErrors` para capturar os erros da API.
- Renderizar mensagens de erro individuais abaixo de cada input correspondente (`name`, `email`, `cnpj`, `password`).
- Disparar mensagens de erro de regras de negócio gerais via toast flutuante (`sonner`).

## Verification Plan

### Automated Tests
Para validar que o backend continua funcionando e validando corretamente:
- `docker compose exec backend php artisan test --filter=AuthAttributesTest`

### Manual Verification
1. **Verificar login em branco**: Tentar fazer login sem preencher e-mail e senha. Validar se mensagens de obrigatoriedade aparecem abaixo dos inputs.
2. **Verificar credenciais incorretas**: Tentar fazer login com senha incorreta. Validar se a mensagem de erro geral aparece via Toast (Sonner).
3. **Verificar cadastro duplicado**: Tentar cadastrar um usuário com e-mail já existente no banco. Validar se o erro de e-mail duplicado aparece abaixo do campo de e-mail.
4. **Verificar CNPJ inválido**: Tentar cadastrar um CNPJ com formato errado (ex: menos dígitos). Validar se a mensagem de erro específica aparece abaixo do input do CNPJ.
