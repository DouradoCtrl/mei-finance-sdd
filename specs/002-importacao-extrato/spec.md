# Feature Specification: Página de Receitas & Importação de Extrato OFX

**Feature Branch**: `002-importacao-extrato`

**Created**: 2026-06-10
**Updated**: 2026-06-11

**Status**: Implemented

**Input**: User description: "A página de importar será uma seção da página de 'Receita', onde haverá faturamento, lucro, gastos, entradas, duas abas separando PJ e PF, e duas abas secundárias separando conta corrente e cartão de crédito. A importação aceitará apenas arquivos OFX (sem input TXT/texto bruto)."

---

## User Scenarios & Testing

### User Story 1 - Página de Receitas com Abas PF/PJ e Conta/Cartão (Priority: P1)
O usuário acessa `/dashboard/receitas` para visualizar a saúde financeira do seu negócio. Ele pode alternar entre abas principais (Pessoa Jurídica vs Pessoa Física) e abas secundárias (Conta Corrente vs Cartão de Crédito) para filtrar o histórico de transações e recalcular as métricas consolidadas.

**Acceptance Scenarios**:
1. **Given** que o usuário está logado e na página `/dashboard/receitas`, **When** ele clica na aba "Pessoa Física (PF)", **Then** o sistema exibe apenas as despesas pessoais e retiradas (pro-labore) do histórico.
2. **Given** que o usuário está visualizando a aba "PJ", **When** ele alterna da aba secundária "Conta Corrente" para "Cartão de Crédito", **Then** a lista de lançamentos e os KPIs (Faturamento, Gastos, Lucro) são atualizados para exibir apenas dados originados do cartão de crédito corporativo.

---

### User Story 2 - Seção de Importação de Extrato OFX Integrada (Priority: P1)
Na própria página de Receitas, o usuário clica em "Importar Extrato". Um modal ou painel expansível é aberto com campo para upload de arquivo `.ofx`. O sistema analisa o arquivo, lista os lançamentos em uma tabela temporária de conciliação para classificação e permite salvar.

**Acceptance Scenarios**:
1. **Given** a seção de importação aberta, **When** o usuário faz o upload de um arquivo `.ofx` válido, **Then** o backend parseia as transações (extraindo data, descrição, valor e `fit_id`) e as exibe na tabela para classificação.
2. **Given** transações importadas temporariamente, **When** o usuário classifica os itens como PJ, PF ou Neutro e clica em "Confirmar Fechamento", **Then** o sistema envia e salva essas transações no banco (vistas como novas entradas históricas), fecha a seção e atualiza os KPIs da dashboard principal.

---

### User Story 3 - Painel de Resumo Financeiro (KPIs) (Priority: P1)
A página exibe três cards de métricas (Faturamento, Gastos e Lucro Líquido) que somam dinamicamente as transações confirmadas no banco do usuário.

**Acceptance Scenarios**:
1. **Given** que o usuário possui transações salvas de Conta Corrente PJ, **When** ele entra na página, **Then** o card "Faturamento" exibe a soma de todas as entradas positivas PJ, "Gastos" exibe a soma das saídas negativas PJ, e "Lucro Líquido" exibe a diferença.

---

## Requirements

### Functional Requirements
- **FR-001**: O sistema deve possuir a rota de frontend `/dashboard/receitas`.
- **FR-002**: A página deve possuir abas principais para alternar o escopo entre PJ e PF, e abas secundárias para filtrar entre Conta Corrente (`checking_account`) e Cartão de Crédito (`credit_card`).
- **FR-003**: A página deve listar o histórico de transações salvas e cards de resumo (Faturamento, Gastos, Lucro) carregados do banco de dados para o usuário autenticado.
- **FR-004**: O sistema deve incluir uma seção de importação de extrato via Modal ou painel retrátil, aceitando **apenas arquivos no formato OFX** (remover suporte a colagem de texto bruto).
- **FR-005**: O backend deve processar o arquivo OFX e retornar uma lista de transações pré-estruturadas identificando duplicidades (comparando pelo `fit_id` do usuário conectado).
- **FR-006**: O backend deve fornecer um endpoint `GET /api/transactions` para recuperar o histórico de transações salvas do usuário conectado, com suporte a filtros de `source` (origem) e `classification` (classificação).
- **FR-007**: As transações devem ser obrigatoriamente associadas ao usuário autenticado (`user_id = auth()->id()`) in all read and write operations.

### Key Entities
- **Transaction**:
  - `user_id` (Identificador do usuário autenticado)
  - `transaction_date` (Data da transação)
  - `description` (Descrição extraída do extrato)
  - `amount` (Valor numérico positivo/negativo)
  - `source` (Origem: `checking_account` ou `credit_card`)
  - `classification` (Classificação: `business_pj`, `personal_pf`, `transfer`)
  - `fit_id` (Identificador único da transação bancária)

---

## Success Criteria
- **SC-001**: As transações importadas devem ser salvas e vinculadas exclusivamente ao ID do usuário conectado.
- **SC-002**: O processamento e retorno do arquivo OFX pelo backend deve ocorrer em menos de 200ms.
- **SC-003**: A alternância de abas (PJ/PF ou Conta/Cartão) deve re-filtrar e re-calcular os KPIs e histórico em menos de 100ms.
