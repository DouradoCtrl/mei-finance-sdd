# Tasks: Página de Receitas & Importação de Extrato OFX

**Input**: Design documents from `/specs/002-importacao-extrato/`

---

## Phase 1: Backend Updates (GET Endpoint & Request Refactoring)

- [x] T001 Implementar o endpoint `GET /api/transactions` no `TransactionController.php` e expor nas rotas protegidas em `routes/api.php`
- [x] T002 Ajustar `ParseRequest.php` para exigir apenas arquivos `.ofx` e remover a validação de `raw_text` / `format`
- [x] T003 Limpar `BankStatementParserService.php` removendo parsing de texto bruto para manter a base de código enxuta

---

## Phase 2: Frontend Service Updates

- [x] T004 Atualizar `transaction.service.ts` para adicionar `getTransactions` e simplificar `parseStatement` (apenas OFX)

---

## Phase 3: Frontend UI: Receitas Page

- [x] T005 Criar a página unificada de receitas em `frontend/src/app/dashboard/receitas/page.tsx` com as abas principais (PJ/PF) e abas secundárias (Conta/Cartão)
- [x] T006 Implementar os Cards de KPI (Faturamento, Gastos, Lucro Líquido) com somatórios baseados no histórico filtrado pelas abas
- [x] T007 Adicionar a tabela de histórico de transações na página de Receitas consumindo dados do backend
- [x] T008 Integrar o fluxo de importação de extrato OFX (com tabela temporária para classificação antes de salvar) como um modal ou seção retrátil nesta mesma página
- [x] T009 Atualizar a barra de navegação lateral (`app-sidebar.tsx`) e breadcrumbs (`header.tsx`) para direcionar para `/dashboard/receitas` em vez de `/dashboard/importar`
- [x] T010 Remover fisicamente a rota obsoleta `frontend/src/app/dashboard/importar` do projeto

---

## Phase 4: Tests & Validation

- [x] T011 Atualizar e expandir a suite de testes `TransactionTest.php` no backend para testar a rota index (`GET /api/transactions`) e remover cenários obsoletos de texto bruto
- [x] T012 Executar a suite de testes via Docker para certificar que todas as asserções passem com sucesso
- [x] T013 Executar a verificação de tipos do TypeScript com `npx tsc --noEmit` para garantir ausência de erros de build
