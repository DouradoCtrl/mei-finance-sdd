# Feature Specification: Página de Receitas & Importação de Extrato OFX

**Feature Branch**: `002-importacao-extrato`

**Created**: 2026-06-10
**Updated**: 2026-06-11

**Status**: Implemented

**Input**: User description: "A página de importar será uma seção da página de 'Receita', onde haverá faturamento, lucro, gastos, entradas, quatro cartões bento principais de escopo (Pendentes, PJ, PF e Neutro), e filtros secundários em formato pill (conta corrente e cartão de crédito). A importação aceitará apenas arquivos OFX (sem input TXT). Adicionado suporte para excluir transações (com modal contendo ícone no cabeçalho) e alterar classificação de lançamentos no histórico em formato de cápsula de controle segmentado."

---

## User Scenarios & Testing

### User Story 1 - Página de Receitas com Bento Cards de Escopo e Filtros de Origem (Priority: P1)
O usuário acessa `/dashboard/receitas` para visualizar a saúde financeira do seu negócio. Ele pode alternar entre os quatro Bento Cards principais de escopo (Pendentes, Pessoa Jurídica, Pessoa Física e Neutro) e os filtros pill secundários (Conta Corrente vs Cartão de Crédito) para filtrar o histórico de transações e recalcular as métricas consolidadas.

**Acceptance Scenarios**:
1. **Given** que o usuário está logado e na página `/dashboard/receitas`, **When** ele clica no bento card "Pessoa Física (PF)", **Then** o sistema exibe apenas as despesas pessoais e retiradas do histórico.
2. **Given** que o usuário está visualizando a aba "PJ", **When** ele seleciona o filtro pill "Cartão de Crédito", **Then** a lista de lançamentos e os KPIs são atualizados para exibir apenas dados originados do cartão de crédito corporativo.

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

### User Story 4 - Exclusão de Transações no Histórico (Priority: P1)
O usuário pode clicar em um botão de excluir ao lado de qualquer transação listada no histórico da página de Receitas para removê-la permanentemente.

**Acceptance Scenarios**:
1. **Given** uma transação listada na tabela de histórico, **When** o usuário clica na lixeira/excluir e confirma, **Then** o sistema remove a transação do banco de dados, remove da tabela na tela e atualiza os KPIs automaticamente.

---

### User Story 5 - Reclassificação de Lançamentos Salvos (Priority: P1)
O usuário pode alterar a classificação (PJ, PF, Neutro) de uma transação diretamente na tabela de histórico, tendo a visibilidade de lançamentos neutros garantida através de uma aba dedicada.

**Acceptance Scenarios**:
1. **Given** uma transação classificada como PJ no histórico, **When** o usuário clica para alterar sua classificação para PF, **Then** o sistema atualiza a classificação no banco de dados e recalcula dinamicamente os KPIs (Faturamento, Gastos, Lucro) na tela do usuário.

---

## Requirements

### Functional Requirements
- **FR-001**: O sistema deve possuir a rota de frontend `/dashboard/receitas`.
- **FR-002**: A página deve possuir quatro Bento Cards de escopo principal para alternar entre Pendentes, PJ, PF e Neutro/Transferências, e filtros pill glassmorphic secundários para selecionar a origem entre Conta Corrente (`checking_account`) e Cartão de Crédito (`credit_card`).
- **FR-002.1**: A ação de classificar transações nas tabelas deve ser apresentada como um controle segmentado em cápsula contendo os botões PJ, PF e Neutro para evidenciar interatividade.
- **FR-002.2**: O modal de exclusão de transação deve carregar o ícone de alerta e a mensagem principal centralizados em seu cabeçalho (title prop do GlowDialog).
- **FR-003**: A página deve listar o histórico de transações salvas e cards de resumo (Faturamento, Gastos, Lucro) carregados do banco de dados para o usuário autenticado.
- **FR-004**: O sistema deve incluir uma seção de importação de extrato via Modal ou painel retrátil, aceitando **apenas arquivos no formato OFX** (remover suporte a colagem de texto bruto).
- **FR-005**: O backend deve processar o arquivo OFX e retornar uma lista de transações pré-estruturadas identificando duplicidades (comparando pelo `fit_id` do usuário conectado).
- **FR-006**: O backend deve fornecer um endpoint `GET /api/transactions` para recuperar o histórico de transações salvas do usuário conectado, com suporte a filtros de `source` (origem) e `classification` (classificação).
- **FR-007**: As transações devem ser obrigatoriamente associadas ao usuário autenticado (`user_id = auth()->id()`) em todas as operações de leitura e gravação.
- **FR-008**: O sistema deve permitir a exclusão física de uma transação salva através do endpoint `DELETE /api/transactions/{id}`.
- **FR-009**: O sistema deve permitir a reclassificação de uma transação através do endpoint `PATCH /api/transactions/{id}/classify`.

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
- **SC-003**: A alternância de abas (PJ/PF/Neutro ou Conta/Cartão) deve re-filtrar e re-calcular os KPIs e histórico em menos de 100ms.
- **SC-004**: A exclusão e a reclassificação de uma transação devem persistir e refletir na interface do usuário em menos de 100ms.
