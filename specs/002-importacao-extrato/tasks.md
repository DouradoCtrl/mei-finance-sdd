# Tasks: Página de Receitas, Importação de Extrato OFX & Controle de Transações

**Input**: Design documents from `/specs/002-importacao-extrato/`

---

## Phase 1: Backend Updates (GET Endpoint & Request Refactoring)

- [x] T001 Implementar o endpoint `GET /api/transactions` no `TransactionController.php` e expor nas rotas protegidas em `routes/api.php`
- [x] T002 Ajustar `ParseRequest.php` para exigir apenas arquivos `.ofx` e remover a validação de `raw_text` / `format`
- [x] T003 Limpar `BankStatementParserService.php` removendo parsing de texto bruto para manter a base de código enxuta

---

## Phase 2: Backend Deletion & Reclassification

- [x] T004 Criar `ClassifyRequest.php` para validar o campo de classificação de transações
- [x] T005 Implementar métodos de reclassificação e exclusão no `TransactionService.php`
- [x] T006 Expor endpoints `DELETE /api/transactions/{id}` e `PATCH /api/transactions/{id}/classify` no `TransactionController.php` e rotas de `routes/api.php`

---

## Phase 3: Frontend Service & UI Updates

- [x] T007 Atualizar `transaction.service.ts` para adicionar chamadas de exclusão e reclassificação
- [x] T008 Atualizar a página `receitas/page.tsx` para adicionar botões de classificação e ícone de lixeira (excluir) na tabela de histórico, atualizando os KPIs em tempo real

---

## Phase 4: Tests & Validation

- [x] T009 Expandir a suite de testes `TransactionTest.php` no backend para cobrir exclusão e reclassificação de lançamentos salvos
- [x] T010 Executar a suite de testes via Docker para certificar que todas as asserções passem com sucesso
- [x] T011 Executar a verificação de tipos do TypeScript com `npx tsc --noEmit` para garantir ausência de erros de build

---

## Phase 5: DB & Model Enhancement (Prerequisites)

**Goal**: Adicionar colunas `bank_name` e `alias` na base de dados e models.

**Independent Test**: Rodar as migrations e verificar a tabela `transactions` no banco com as novas colunas criadas.

- [x] T012 [P] Adicionar colunas `bank_name` e `alias` na migration `backend/database/migrations/2026_06_11_021823_create_transactions_table.php`
- [x] T013 Executar `php artisan migrate:fresh` para recriar as tabelas com os novos atributos
- [x] T014 [P] Incluir `bank_name` e `alias` no array `$fillable` do model `backend/app/Models/Transaction.php`

---

## Phase 6: Parser & Backend Services

**Goal**: Implementar a lógica de extração do banco pelo parser OFX e os endpoints de filtro e edição de apelidos.

**Independent Test**: Fazer uma chamada `GET` e `PATCH` e atestar se os apelidos e o banco são manipulados corretamente.

- [x] T015 [US2] Extrair o nome da instituição bancária (tag `<ORG>` do arquivo OFX) em `backend/app/Services/BankStatementParserService.php` e retornar na lista temporária de transações
- [x] T016 Implementar o método `updateAlias(int $id, string $alias)` em `backend/app/Services/TransactionService.php`
- [x] T017 [P] Criar o Form Request `backend/app/Http/Requests/AliasRequest.php` para validar a edição de apelidos
- [x] T018 [P] Atualizar `backend/app/Http/Resources/TransactionResource.php` para retornar as novas propriedades `bank_name` e `alias`
- [x] T019 Atualizar o controller `backend/app/Http/Controllers/TransactionController.php` com suporte a filtros de busca e datas no método `index` e criar rota de alias `updateAlias` exposta em `routes/api.php`

---

## Phase 7: Frontend Services

**Goal**: Atualizar o consumo da API no Next.js para enviar query parameters e fazer chamadas PATCH de alias.

- [x] T020 [P] Atualizar a chamada do `getTransactions` em `frontend/services/transaction.service.ts` para aceitar novos query parameters de filtros
- [x] T021 [P] Adicionar função `updateTransactionAlias(id: number, alias: string)` chamando `PATCH /api/transactions/{id}/alias` em `frontend/services/transaction.service.ts`

---

## Phase 8: Frontend UI/UX Refactoring

**Goal**: Criar o cabeçalho com filtros rápidos de data, filtros dinâmicos na tabela e possibilitar a edição inline de apelidos.

**Independent Test**: Interagir com os filtros de data no header e apelidar transações na tabela, verificando a renderização correta de subtextos em tempo real.

- [x] T022 [US1] Adicionar dropdown de períodos e datepicker personalizado no header de `frontend/app/dashboard/receitas/page.tsx`
- [x] T023 [US7] Adicionar controles dinâmicos de filtragem rápida (banco, tipo, classificação) no cabeçalho da tabela em `frontend/app/dashboard/receitas/page.tsx`
- [x] T024 [US6] Implementar a edição inline do apelido da transação na tabela, exibindo o `alias` destacado e a descrição original cinza menor abaixo em `frontend/app/dashboard/receitas/page.tsx`

---

## Phase 9: Polish & Verification

**Goal**: Validar todos os testes automatizados e compilação limpa do projeto.

- [x] T025 Atualizar e rodar os testes automatizados em `backend/tests/Feature/TransactionTest.php` cobrindo o novo endpoint de apelido e filtros de listagem
- [x] T026 Executar verificação de tipos do TypeScript com `npx tsc --noEmit` na pasta `frontend`
- [x] T027 Executar linter `npm run lint` na pasta `frontend`
