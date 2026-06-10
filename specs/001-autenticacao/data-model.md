# Data Model: Cadastro e Login de Usuário (Laravel)

**Feature**: [specs/001-autenticacao](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/001-autenticacao)

Este documento descreve as tabelas gerenciadas por migrations do Laravel no PostgreSQL 16.

## Tabela: `users`

Guarda os dados cadastrais e credenciais do MEI.

| Campo | Tipo Laravel | Restrições | Descrição |
|-------|--------------|------------|-----------|
| `id` | bigint | PRIMARY KEY (BIGSERIAL) | Identificador único |
| `name` | string | NOT NULL | Nome do MEI ou nome fantasia |
| `email` | string | UNIQUE, NOT NULL | E-mail de acesso |
| `email_verified_at` | timestamp | NULL | Data de validação de e-mail (gerenciado pelo Laravel) |
| `password` | string | NOT NULL | Senha criptografada com Bcrypt (padrão Laravel Hash) |
| `cnpj` | string | NULL | CNPJ do MEI (14 caracteres numéricos) |
| `remember_token` | string | NULL | Token de persistência de sessão |
| `created_at` | timestamp | NULL | Data de cadastro |
| `updated_at` | timestamp | NULL | Data de última atualização |

## Tabela: `personal_access_tokens` (Sanctum)

Gerenciada automaticamente pelo Laravel Sanctum para controle de sessões e revogação de tokens de API.

| Campo | Tipo Laravel | Descrição |
|-------|--------------|-----------|
| `id` | bigint | Identificador |
| `tokenable_type` | string | Model associado (geralmente `App\Models\User`) |
| `tokenable_id` | bigint | ID do usuário associado |
| `name` | string | Nome identificador do dispositivo/token (ex: "NextJS Token") |
| `token` | string (64) | Hash do token de acesso pessoal |
| `abilities` | text | Permissões do token |
| `last_used_at` | timestamp | Última vez que o token foi usado na API |
| `expires_at` | timestamp | Data de expiração |

## Regras de Validação (Laravel Request)

1. **Cadastro:**
   - `name`: obrigatório, string, max 255.
   - `email`: obrigatório, string, formato email, max 255, único na tabela `users`.
   - `password`: obrigatório, string, mínimo 6 caracteres.
   - `cnpj`: opcional, string, mínimo/máximo de 14 dígitos (se fornecido).
2. **Login:**
   - `email`: obrigatório, string, formato email.
   - `password`: obrigatório, string.
