# Tasks: Importação de Extrato e Classificação PF/PJ

**Input**: Design documents from `/specs/002-importacao-extrato/`

**Prerequisites**: [plan.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato/plan.md), [spec.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato/spec.md), [research.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato/research.md), [data-model.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato/data-model.md), [contracts/import-api.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato/contracts/import-api.md)

**Tests**: Contém tarefas de testes de integração automatizados no final para certificar a estabilidade.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparação do ambiente e criação das rotas iniciais de navegação no frontend.

- [x] T001 [P] Configurar caminhos e variáveis locais em `backend/.env` e `frontend/.env.local`
- [x] T002 Criar a página de visualização de importação de extrato vazia no frontend em `frontend/src/app/dashboard/importacao/page.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Estrutura core de persistência no backend (tabela, modelo, recurso e rotas).

- [x] T003 Criar arquivo de migration para a tabela `transactions` em `backend/database/migrations/2026_06_11_021823_create_transactions_table.php` contendo `source`, `classification` e `fit_id`
- [x] T004 Criar o modelo Eloquent `Transaction` com fillable, casts e atributos padrões em `backend/app/Models/Transaction.php`
- [x] T005 Criar a classe `TransactionResource` para serialização padronizada de transações em `backend/app/Http/Resources/TransactionResource.php`
- [x] T006 Configurar as rotas de API `/api/transactions/parse` e `/api/transactions/confirm` dentro do middleware de autenticação em `backend/routes/api.php`

---

## Phase 3: User Story 1 - Colagem e Importação de Extrato (Priority: P1) 🎯 MVP

**Goal**: Permitir o upload de arquivo OFX ou colagem de texto bruto e visualização das transações estruturadas em uma tabela.

- [x] T007 [P] [US1] Criar validador de requisição `ParseRequest` para a API de parsing em `backend/app/Http/Requests/ParseRequest.php`
- [x] T008 [US1] Criar classe de serviço `BankStatementParserService` contendo expressões regulares de leitura de texto e decodificador OFX (SGML/XML) em `backend/app/Services/BankStatementParserService.php`
- [x] T009 [US1] Criar `TransactionController` e implementar o método `parse()` em `backend/app/Http/Controllers/TransactionController.php` chamando o serviço de leitura
- [x] T010 [P] [US1] Criar serviço de chamadas da API de transações no Next.js em `frontend/src/services/transaction.service.ts`
- [x] T011 [US1] Construir o formulário de upload de arquivo OFX e campo textarea de texto bruto em `frontend/src/app/dashboard/importacao/page.tsx`, exibindo as transações retornadas em formato de tabela

---

## Phase 4: User Story 2 - Classificação Rápida PF/PJ (Priority: P1)

**Goal**: Permitir classificar de forma rápida cada transação na tabela entre PJ (Empresa), PF (Pessoal) ou Neutro (Transfer).

- [x] T012 [P] [US2] Implementar botões de seleção de classificação para cada linha da tabela em `frontend/src/app/dashboard/importacao/page.tsx`
- [x] T013 [US2] Vincular estilos CSS diferenciados para cada tipo de classificação (Verde/PJ, Azul/PF, Cinza/Neutro) para feedback visual rápido do usuário na tabela de `frontend/src/app/dashboard/importacao/page.tsx`

---

## Phase 5: User Story 3 - Painel de Resumo Mensal e Confirmação (Priority: P1)

**Goal**: Exibir os somatórios atualizados dinamicamente com base nas classificações e enviar para persistência no banco de dados.

- [x] T014 [P] [US3] Criar validador `ConfirmTransactionsRequest` para recebimento de transações em `backend/app/Http/Requests/ConfirmTransactionsRequest.php`
- [x] T015 [US3] Criar classe de serviço `TransactionService` em `backend/app/Services/TransactionService.php` contendo regras de negócio para ignorar registros duplicados (verificando o index único e `fit_id`) e salvar registros válidos
- [x] T016 [US3] Implementar o método `confirm()` no controller `TransactionController` em `backend/app/Http/Controllers/TransactionController.php` delegando para o serviço e retornando resposta padronizada
- [x] T017 [P] [US3] Implementar o cálculo dinâmico dos somatórios em tempo real (Receita PJ, Despesa PJ, Retiradas PF, Lucro Líquido) no frontend em `frontend/src/app/dashboard/importacao/page.tsx`
- [x] T018 [US3] Integrar chamada de API `confirmTransactions` ao botão "Confirmar Fechamento" no frontend de `frontend/src/app/dashboard/importacao/page.tsx`, limpando a tela de importação e exibindo mensagem de sucesso

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Testes automatizados de validação de parsing e salvamento, limpeza e checagem de tipos.

- [x] T019 Criar suite de testes de integração `TransactionTest` em `backend/tests/Feature/TransactionTest.php` validando parsing de texto/OFX e confirmação de transações
- [x] T020 Rodar testes locais com `php artisan test` e certificar-se de que a suite está verde
- [x] T021 Rodar checagem de tipos do TypeScript com `npx tsc --noEmit` no frontend e certificar que não há erros de tipagem
- [x] T022 Executar o roteiro de testes do `quickstart.md` manualmente e documentar resultados

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup (Phase 1)**: Sem dependências, inicia o ambiente.
2. **Foundational (Phase 2)**: Depende da Phase 1. Prepara tabelas e rotas (bloqueia o desenvolvimento das demais).
3. **User Story 1 (Phase 3)**: Depende da Phase 2. Implementa a extração e exibição das transações.
4. **User Story 2 (Phase 4)**: Depende da Phase 3. Permite classificar itens da lista na tela.
5. **User Story 3 (Phase 5)**: Depende da Phase 4. Exibe resumos e persiste as transações.
6. **Polish (Phase 6)**: Rodar após todas as fases de implementação estarem concluídas.

### Parallel Opportunities
- T001 (Setup env) e T002 (Página frontend vazia) podem ser feitas de forma concorrente.
- T007 (ParseRequest no backend) e T010 (transaction.service.ts no frontend) podem ser criadas em paralelo.
- T014 (ConfirmTransactionsRequest no backend) e T017 (Cálculos de resumo no frontend) podem ser feitas em paralelo.
