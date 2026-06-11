# Tasks: Página de Receitas & Importação de Extrato OFX

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
