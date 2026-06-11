# Implementation Plan: Página de Receitas & Importação de Extrato OFX

**Branch**: `002-importacao-extrato` | **Date**: 2026-06-11 | **Spec**: [spec.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato/spec.md)

---

## Summary

Refatoração do módulo de transações para integrar a funcionalidade de importação de extratos diretamente na nova página de **Receitas** (`/dashboard/receitas`). A página conterá abas para filtrar transações por PJ/PF e por Conta Corrente/Cartão, além de cards de KPI (Faturamento, Gastos, Lucro Líquido) e listagem histórica. A importação de extrato suportará apenas o formato OFX. Adicionalmente, o sistema permitirá excluir transações salvas e alterar a classificação (PJ/PF/Neutro) diretamente a partir da tabela de histórico na tela.

---

## Project Structure

```text
backend/                 # Projeto Laravel
├── app/
│   ├── Http/
│   │   ├── Controllers/ # TransactionController (index, parse, confirm, destroy, classify)
│   │   ├── Requests/    # ParseRequest, ConfirmTransactionsRequest, ClassifyRequest
│   │   ├── Resources/   # TransactionResource
│   ├── Models/          # Transaction
│   └── Services/        # BankStatementParserService, TransactionService (métodos delete e updateClassify)
├── database/
│   └── migrations/      # Migration de criação da tabela 'transactions'
└── routes/
    └── api.php          # GET /transactions, POST /transactions/parse, POST /transactions/confirm,
                         # DELETE /transactions/{id}, PATCH /transactions/{id}/classify

frontend/                # Projeto Next.js
├── src/
│   ├── app/
│   │   └── dashboard/
│   │       └── receitas/ # Página Unificada de Receitas com histórico editável e deletável
│   ├── components/      # Componentes de Cards KPI, Histórico, Modal de Importação OFX
│   ├── lib/             # api.ts (apiFetch)
│   └── services/        # transaction.service.ts (GET history, POST parse, POST confirm, DELETE tx, PATCH classify)
```

---

## Constitution Check

- **Princípio I (Service Layer):** A lógica de leitura reside em `BankStatementParserService` e o gerenciamento/salvamento/exclusão/reclassificação em `TransactionService`. Os controllers apenas delegam e retornam respostas. (APROVADO)
- **Princípio II (Respostas JSON):** Utilização da trait `ApiResponse` e do resource `TransactionResource` para formatar o payload enviado ao frontend. (APROVADO)
- **Princípio III (Banco de Dados Docker):** A tabela `transactions` será persistida no PostgreSQL 16 na porta `5433`. (APROVADO)
- **Princípio IV (Frontend modular):** Consumo dos endpoints com `apiFetch` passando o `accessToken` do NextAuth. (APROVADO)
- **Princípio V (Versionamento Rastreável):** Commit de arquivos de forma atômica seguindo Conventional Commits em português. (APROVADO)

---

## Implementation Steps

### Phase 1: Backend Updates (GET Endpoint & OFX-only cleanup)
1. Adicionar o método `index` em `TransactionController` e expor a rota `GET /api/transactions` protegida por autenticação.
2. Atualizar o `ParseRequest` para remover a validação de `raw_text` e aceitar apenas o arquivo OFX.
3. Simplificar o `BankStatementParserService` e remover o suporte a parsing de texto bruto.

### Phase 2: Backend Deletion & Reclassification
1. Criar `ClassifyRequest` para validar o campo `classification` no endpoint de reclassificação.
2. Implementar os métodos `deleteTransaction` e `updateClassification` no `TransactionService` garantindo a propriedade do usuário logado.
3. Adicionar as rotas `DELETE /api/transactions/{id}` e `PATCH /api/transactions/{id}/classify` no Laravel controller e `routes/api.php`.

### Phase 3: Frontend Service Updates
1. Atualizar `transaction.service.ts` adicionando:
   - `getTransactions` para buscar o histórico do banco.
   - `deleteTransaction` chamando a exclusão.
   - `updateTransactionClassification` chamando a reclassificação.
2. Simplificar `parseStatement` para aceitar apenas upload de arquivos OFX via FormData.

### Phase 4: Frontend Receitas UI & Layout
1. Criar a página `/dashboard/receitas/page.tsx` com o sistema de abas duplas:
   - Abas principais: Pessoa Jurídica (PJ) vs Pessoa Física (PF).
   - Abas secundárias: Conta Corrente vs Cartão de Crédito.
2. Adicionar os cards de KPI (Faturamento, Gastos, Lucro Líquido) calculados dinamicamente a partir dos lançamentos correspondentes aos filtros ativos.
3. Adicionar a tabela de histórico de transações que busca dados do backend através do novo endpoint.
4. Incluir botões rápidos de troca de classificação (PJ, PF, Neutro) e um botão de lixeira (deletar) para cada linha do histórico.
5. Integrar o Modal/Painel de Importação de Extrato OFX na tela de Receitas.
6. Limpar e remover o diretório obsoleto `/dashboard/importar`.

### Phase 5: Verification & Tests
1. Ajustar e estender a suite de testes `TransactionTest.php` no backend para cobrir a listagem histórica (`GET /api/transactions`), a reclassificação (`PATCH /api/transactions/{id}/classify`) e a exclusão (`DELETE /api/transactions/{id}`).
2. Rodar os testes automatizados locais para certificar que tudo continua verde.
3. Rodar checagem de tipos com `npx tsc --noEmit`.
