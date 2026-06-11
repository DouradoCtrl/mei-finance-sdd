# Implementation Plan: Importação de Extrato e Classificação PF/PJ (Laravel + Next.js)

**Branch**: `002-importacao-extrato` | **Date**: 2026-06-11 | **Spec**: [spec.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato/spec.md)

**Input**: Feature specification from `/specs/002-importacao-extrato/spec.md`

## Summary

Implementação do sistema de importação de extrato via colagem de texto bruto e classificação rápida de transações entre PF (Pessoal) e PJ (Negócio) para o **MEI Finance**. A extração estruturada será centralizada no backend Laravel através de serviços baseados em Regex, e o frontend Next.js gerenciará o estado dinâmico dos totais em tempo real antes da persistência final.

## Technical Context

**Language/Version**: PHP 8.5.0 (Laravel 11+), Node.js v20.18.1 (Next.js 16+)

**Primary Dependencies**:
- **Backend:** Laravel Framework, Laravel Sanctum
- **Frontend:** React 19, Next.js 16, NextAuth, Shadcn/ui (Tailwind CSS v4)

**Storage**: PostgreSQL 16 (rodando localmente via Docker Compose na porta 5433)

**Testing**: PHPUnit (Backend), TypeScript type-checking (Frontend)

**Target Platform**: Web browsers modernos

**Project Type**: Web Application (API Backend + SPA/SSR Frontend)

**Performance Goals**:
- Tempo de resposta para Parsing de Extrato < 200ms (SC-002)
- Resumo mensal atualizado em menos de 100ms no cliente React (SC-003)

**Constraints**: Prevenção de duplicidades baseada em hash/chave composta no banco de dados.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Princípio I (Service Layer):** A lógica de parsing residirá em `App\Services\BankStatementParserService` e a persistência em `App\Services\TransactionService`. Os controllers serão magros e usarão Form Requests para validação. (APROVADO)
- **Princípio II (Respostas JSON):** Utilização da trait `ApiResponse` e de API Resources (`TransactionResource`) para estruturar todas as transações de retorno. (APROVADO)
- **Princípio III (Banco de Dados Docker):** A tabela `transactions` será persistida no PostgreSQL 16 já configurado via compose. (APROVADO)
- **Princípio IV (Frontend modular):** Utilização do NextAuth para injetar o token de acesso PJ nas requisições HTTP através do wrapper centralizado `apiFetch`. (APROVADO)
- **Princípio V (Versionamento Rastreável):** Commit de arquivos de forma atômica seguindo Conventional Commits em português. (APROVADO)

## Project Structure

Dividido em dois subprojetos principais na raiz:

```text
backend/                 # Projeto Laravel
├── app/
│   ├── Http/
│   │   ├── Controllers/ # TransactionController
│   │   ├── Requests/    # ParseRequest, ConfirmTransactionsRequest
│   │   ├── Resources/   # TransactionResource
│   ├── Models/          # Transaction
│   └── Services/        # BankStatementParserService, TransactionService
├── database/
│   └── migrations/      # Migration de criação da tabela 'transactions'
├── routes/
│   └── api.php          # Rotas /api/transactions/... protegidas
└── tests/
    └── Feature/         # Testes de integração (TransactionTest)

frontend/                # Projeto Next.js
├── src/
│   ├── app/
│   │   └── dashboard/
│   │       └── importacao/ # Tela de importação de extrato
│   ├── components/      # Componentes e resumos dinâmicos
│   ├── lib/             # api.ts (apiFetch)
│   └── services/        # transaction.service.ts
```

**Structure Decision**: Estrutura desmembrada em `backend/` (Laravel) e `frontend/` (Next.js) para independência de deploys e desenvolvimento.

## Complexity Tracking

*Sem violações identificadas nesta fase.*
