# Implementation Plan: Página de Receitas, Importação de Extrato OFX & Controle de Transações

**Branch**: `002-importacao-extrato` | **Date**: 2026-06-12 | **Spec**: [spec.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato/spec.md)

---

## Summary

Evolução do módulo de transações e da página de Fluxo de Caixa (`/dashboard/receitas`). As melhorias incluem:
1. Identificação automática da instituição financeira (banco) a partir do arquivo OFX.
2. Filtros de período globais no cabeçalho (mês atual, mês passado, trimestre, semestre, ano e personalizado).
3. Tabela unificada no frontend com filtros cruzados dinâmicos (por classificação, tipo e banco).
4. Possibilidade de associar um apelido (`alias`) individual por transação diretamente na tabela.

Como o projeto está em ambiente de desenvolvimento, as colunas `bank_name` e `alias` serão adicionadas diretamente na migration existente de criação da tabela `transactions`.

---

## Technical Context

**Language/Version**: PHP 8.5+ (Laravel 11+), Node.js v20+ (Next.js 16.2.9)

**Primary Dependencies**:
- **Backend:** Laravel Framework, Laravel Sanctum, PHP OFX Parser (ou parser nativo em XML)
- **Frontend:** React, Next.js, NextAuth, Sonner (notificações toast), GlowUI (componentes customizados)

**Storage**: PostgreSQL 16 (porta 5433, volume persistido em `./.docker/pgdata`)

---

## Constitution Check

- **Princípio I (Service Layer):** A lógica de leitura reside em `BankStatementParserService` e o gerenciamento/salvamento/exclusão/reclassificação em `TransactionService`. Os controllers apenas delegam e retornam respostas. (APROVADO)
- **Princípio II (Respostas JSON):** Utilização da trait `ApiResponse` e do resource `TransactionResource` para formatar o payload enviado ao frontend. (APROVADO)
- **Princípio III (Banco de Dados Docker):** A tabela `transactions` será persistida no PostgreSQL 16 na porta `5433`. (APROVADO)
- **Princípio IV (Frontend modular):** Consumo dos endpoints com `apiFetch` passando o `accessToken` do NextAuth. (APROVADO)
- **Princípio V (Versionamento Rastreável):** Commit de arquivos de forma atômica seguindo Conventional Commits em português. (APROVADO)

---

## Project Structure

```text
backend/                 # Projeto Laravel
├── app/
│   ├── Http/
│   │   ├── Controllers/ # TransactionController (index, parse, confirm, destroy, classify, updateAlias)
│   │   ├── Requests/    # ConfirmTransactionsRequest, ClassifyRequest, AliasRequest
│   │   ├── Resources/   # TransactionResource (retorna bank_name e alias)
│   ├── Models/          # Transaction (contém campos bank_name e alias no fillable)
│   └── Services/        # BankStatementParserService (extrai ORG do OFX), TransactionService
├── database/
│   └── migrations/      # Migration modificada para tabela 'transactions'
└── routes/
    └── api.php          # GET /transactions, POST /transactions/parse, POST /transactions/confirm,
                         # DELETE /transactions/{id}, PATCH /transactions/{id}/classify,
                         # PATCH /transactions/{id}/alias

frontend/                # Projeto Next.js
├── app/
│   └── dashboard/
│       └── receitas/    # Página unificada com filtros, cabeçalho de períodos e tabela com apelidos
├── components/          # Custom GlowUI e componentes
└── services/            # transaction.service.ts (GET com datas/bancos, PATCH alias)
```

---

## Proposed Changes

### Database & Models

#### [MODIFY] [2026_06_11_xxxxxx_create_transactions_table.php](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/backend/database/migrations/) (Procurar arquivo de criação da tabela `transactions`)
- Adicionar colunas:
  - `$table->string('bank_name')->nullable();`
  - `$table->string('alias')->nullable();`

#### [MODIFY] [Transaction.php](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/backend/app/Models/Transaction.php)
- Adicionar `bank_name` e `alias` no array `$fillable`.

---

### Backend Services & Controllers

#### [MODIFY] [BankStatementParserService.php](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/backend/app/Services/BankStatementParserService.php)
- Ajustar a lógica de parsing para ler a tag `<ORG>` (dentro de `<FI>`) no arquivo OFX.
- Associar o valor extraído à chave `bank_name` de cada transação gerada na listagem temporária.

#### [MODIFY] [TransactionService.php](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/backend/app/Services/TransactionService.php)
- Implementar o método `updateAlias(int $id, string $alias)` que atualiza o apelido da transação associada ao usuário autenticado.

#### [MODIFY] [TransactionController.php](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/backend/app/Http/Controllers/TransactionController.php)
- Adicionar suporte a parâmetros de query no método `index`: `start_date`, `end_date`, `classification`, `source`, `bank_name` e `search` (para busca no campo descrição ou alias).
- Criar o método `updateAlias(AliasRequest $request, int $id)` que chama o `TransactionService` e expõe a resposta padronizada via `ApiResponse`.

#### [MODIFY] [TransactionResource.php](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/backend/app/Http/Resources/TransactionResource.php)
- Incluir `bank_name` e `alias` no payload retornado para o frontend.

#### [NEW] [AliasRequest.php](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/backend/app/Http/Requests/AliasRequest.php)
- Criar validação para o campo `alias` (string, max 255, nullable).

---

### Frontend Services & Components

#### [MODIFY] [transaction.service.ts](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend/services/transaction.service.ts)
- Atualizar a assinatura de `getTransactions` para aceitar um objeto de filtros (com datas de início e fim, classificação, banco, etc.).
- Adicionar o método `updateTransactionAlias(id: number, alias: string)` chamando `PATCH /transactions/{id}/alias`.

#### [MODIFY] [page.tsx (receitas)](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/frontend/app/dashboard/receitas/page.tsx)
- **Cabeçalho de Período**: Adicionar dropdown com filtros rápidos de data e modal/inputs de data personalizada (Início e Fim), acionando buscas atualizadas na API.
- **Filtros Dinâmicos na Tabela**: Adicionar cabeçalho de filtros para seleção dinâmica por banco, classificação (PJ/PF/Neutro) e tipo (Extrato / Cartão).
- **Apelido Inline**: Incluir ícone de edição de texto ao lado da descrição. Se houver `alias`, renderizá-lo em destaque e exibir a descrição original em tamanho menor abaixo dele.

---

## Verification Plan

### Automated Tests
- Ajustar os testes em `TransactionTest.php` para validar o comportamento de filtros por datas/bancos na listagem e a reclassificação de apelidos (`PATCH /transactions/{id}/alias`).
- Rodar a suite de testes no backend:
  `docker compose exec backend php artisan test --filter=TransactionTest` (ou localmente).

### Manual Verification
1. **Importação OFX**: Subir arquivo OFX e verificar se o nome do banco é extraído e exibido corretamente.
2. **Definição de Apelido**: Clicar para apelidar uma transação, salvar e verificar se o alias e a descrição original são exibidos conforme a especificação.
3. **Filtros Globais**: Testar a filtragem no header (mês passado, personalizado) e atestar se os dados mudam de forma reativa instantaneamente.
4. **Filtros Cruzados**: Testar filtragem combinada na tabela (ex: classificação PJ + Banco Itaú).
