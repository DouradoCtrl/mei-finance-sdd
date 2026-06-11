# Implementation Plan: Importação de Extrato Multibancos e Conciliação de Cartão de Crédito

**Branch**: `002-importacao-extrato` | **Date**: 2026-06-11 | **Spec**: [spec.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato/spec.md)

**Input**: Feature specification from `/specs/002-importacao-extrato/spec.md` reformulada para suportar múltiplos formatos e fontes.

## Summary

Implementação do sistema de importação flexível de extratos no **MEI Finance**, integrando dois formatos (OFX universal e colagem de texto) e duas origens de dados (Conta Corrente e Cartão de Crédito). O processamento (parsing) do extrato será realizado no backend (com regexes flexíveis para texto e um parser XML/SGML estruturado para arquivos OFX). A interface Next.js permitirá a classificação individual de compras e a conciliação de faturas (despesa neutra de pagamento) para evitar duplicidade de lançamentos.

## Technical Context

**Language/Version**: PHP 8.5.0 (Laravel 11+), Node.js v20.18.1 (Next.js 16+)

**Primary Dependencies**:
- **Backend:** Laravel Framework, Laravel Sanctum, PHP SimpleXML / libxml (para leitura do OFX)
- **Frontend:** React 19, Next.js 16, NextAuth, Shadcn/ui (Tailwind CSS v4)

**Storage**: PostgreSQL 16 (rodando localmente via Docker Compose na porta 5433)

**Testing**: PHPUnit (Backend), TypeScript type-checking (Frontend)

**Target Platform**: Web browsers modernos

**Project Type**: Web Application (API Backend + SPA/SSR Frontend)

**Performance Goals**:
- Tempo de processamento do parser de arquivos OFX < 150ms
- Atualização dinâmica em tempo real do painel de resumo financeiro < 50ms

**Constraints**: Prevenção rígida de duplicidades baseada no `fit_id` (FITID) do arquivo OFX e chave composta em banco de dados para texto bruto.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Princípio I (Service Layer):** A lógica de leitura reside em `App\Services\BankStatementParserService` e o gerenciamento de duplicidades/salvamento em `App\Services\TransactionService`. Os controllers apenas delegam e retornam respostas. (APROVADO)
- **Princípio II (Respostas JSON):** Utilização da trait `ApiResponse` e do resource `TransactionResource` para formatar o payload enviado ao frontend. (APROVADO)
- **Princípio III (Banco de Dados Docker):** A tabela `transactions` será persistida no PostgreSQL 16 na porta `5433`. (APROVADO)
- **Princípio IV (Frontend modular):** Consumo dos endpoints com `apiFetch` passando o `accessToken` do NextAuth. (APROVADO)
- **Princípio V (Versionamento Rastreável):** Commit de arquivos de forma atômica seguindo Conventional Commits em português. (APROVADO)

## Project Structure

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
│   └── migrations/      # Migration de criação da tabela 'transactions' com colunas 'source', 'fit_id'
├── routes/
│   └── api.php          # Rotas expostas protegidas pelo middleware 'auth:sanctum' e 'active'
└── tests/
    └── Feature/         # Testes de integração (TransactionTest)

frontend/                # Projeto Next.js
├── src/
│   ├── app/
│   │   └── dashboard/
│   │       └── importar/ # Tela unificada de importação (Conta Corrente / Cartão)
│   ├── components/      # Componentes React e painel dinâmico
│   ├── lib/             # api.ts (apiFetch)
│   └── services/        # transaction.service.ts
```

**Structure Decision**: Estrutura desmembrada em `backend/` (Laravel) e `frontend/` (Next.js) para independência de deploys e desenvolvimento.

## Complexity Tracking

*Sem violações identificadas nesta fase.*
```
