# Feature Specification: Página de Receitas, Importação de Extrato OFX e Controle de Transações

**Feature Branch**: `003-importacao-extrato`

**Created**: 2026-06-10
**Updated**: 2026-06-16

**Status**: Ready

**Input**: User description: "A página de importar será uma seção da página de 'Receita', onde haverá faturamento, lucro, gastos, entradas, três cartões bento principais de escopo (Pendentes, PJ e PF), e filtros secundários em formato pill (conta corrente e cartão de crédito). A importação aceita apenas arquivos OFX. Suporte para excluir transações e alterar classificação de lançamentos no histórico (PJ/PF). Identificação do banco emissor, filtros de data no cabeçalho, e aliases para transações individuais. Todo o fluxo é isolado por cliente selecionado."

---

## User Scenarios & Testing

### User Story 1 - Página de Fluxo de Caixa com Bento Cards, Filtros Globais de Período e Origem (Priority: P1)

Como um contador autenticado gerenciando um cliente MEI ativo, eu quero acessar a página `/dashboard/receitas` para visualizar os KPIs e histórico financeiro filtrados por data, escopo (Bento Cards: Pendentes, PJ, PF) e origem (Conta Corrente vs Cartão).

**Why this priority**: É a tela de análise financeira principal do cliente selecionado.

**Independent Test**: Selecionar o Cliente A e verificar se as queries trazem apenas dados de transações com `client_id` igual ao do Cliente A, respeitando as datas selecionadas.

**Acceptance Scenarios**:
1. **Given** que o contador selecionou o Cliente A, **When** ele entra em `/dashboard/receitas`, **Then** o sistema exibe os dados financeiros e a lista de transações pertencentes estritamente ao Cliente A.
2. **Given** que o usuário está visualizando a aba "PJ", **When** ele altera o filtro global para "Mês Passado", **Then** a tabela e os KPIs recarregam exibindo apenas transações PJ do mês passado daquele cliente.

---

### User Story 2 - Importação de Extrato OFX e Conciliação (Priority: P1)

Como um contador autenticado gerenciando um cliente MEI ativo, eu quero importar um arquivo `.ofx` para carregar lançamentos temporários na tela, classificá-los (PJ ou PF) e salvá-los no banco do cliente.

**Acceptance Scenarios**:
1. **Given** o modal de importação aberto no contexto do Cliente A, **When** o usuário carrega um arquivo `.ofx` válido, **Then** o backend parseia e exibe as transações temporárias identificando a data, descrição, valor, `fit_id` e o nome do banco.
2. **Given** as transações importadas temporariamente na tela, **When** o usuário seleciona as classificações (PJ ou PF) e confirma o fechamento, **Then** o sistema salva as transações associadas ao `client_id` do Cliente A no banco, limpando os dados temporários e atualizando a página.

---

### User Story 3 - Controle e Reclassificação de Lançamentos Salvos (Priority: P1)

Como um contador, eu quero reclassificar (PJ ou PF) ou excluir transações diretamente da tabela de histórico de lançamentos do cliente selecionado.

**Acceptance Scenarios**:
1. **Given** uma transação do Cliente A listada na tabela de histórico, **When** o contador clica para mudar a classificação de PJ para PF, **Then** o sistema atualiza a classificação no banco e recalcula os KPIs instantaneamente.
2. **Given** uma transação no histórico, **When** o contador clica em excluir e confirma, **Then** a transação é removida fisicamente do banco de dados para o `client_id` ativo.

---

### User Story 4 - Apelidos (Aliases) para Transações (Priority: P2)

Como um contador, eu quero definir apelidos legíveis para transações com descrições genéricas no extrato, para melhor identificação.

**Acceptance Scenarios**:
1. **Given** uma transação na tabela, **When** o contador clica para editar o apelido e insere "Pagamento Internet", **Then** o sistema exibe o apelido em destaque e a descrição original em tamanho menor abaixo, salvando no banco.

---

## Requirements

### Functional Requirements
- **FR-001**: O sistema deve possuir a rota de frontend `/dashboard/receitas`.
- **FR-002**: A página deve possuir **três Bento Cards** principais: Pendentes, PJ e PF, e filtros pill de origem: Conta Corrente (`checking_account`) e Cartão de Crédito (`credit_card`). A aba e o card "Neutro" estão eliminados.
- **FR-003**: A tabela de histórico e os endpoints de transações devem ser isolados sob o cliente ativo através do cabeçalho `X-Selected-Client-Id` (que informa o `client_id`).
- **FR-004**: O backend deve validar se o `client_id` informado no cabeçalho pertence ao contador autenticado (`user_id` do cliente = `id` do contador logado).
- **FR-005**: O parser do arquivo OFX deve extrair a tag `<ORG>` para identificar o banco e armazenar na coluna `bank_name` da transação.
- **FR-006**: O sistema deve expor endpoints `GET /api/transactions` para listagem, `POST /api/transactions/confirm` para conciliação, `DELETE /api/transactions/{id}` para exclusão, `PATCH /api/transactions/{id}/classify` para classificação e `PATCH /api/transactions/{id}/alias` para apelidos. Todos os endpoints devem operar sob a tabela `transactions` filtrando e associando registros à FK `client_id`.
- **FR-007**: A verificação de duplicidade de transações (`fit_id` ou campos de fallback) deve ocorrer sob o escopo do `client_id` selecionado.

### Key Entities

- **Transaction**:
  - `id` (Identificador único, PK)
  - `client_id` (FK apontando para `clients.id` do cliente MEI associado)
  - `transaction_date` (Data da transação)
  - `description` (Descrição original do extrato)
  - `alias` (Apelido legível opcional, string nullable)
  - `amount` (Valor numérico)
  - `source` (Origem: `checking_account` ou `credit_card`)
  - `bank_name` (Nome da instituição financeira, string nullable)
  - `classification` (Classificação: `'business_pj'`, `'personal_pf'` ou `'pending'`)
  - `fit_id` (Identificador único da transação bancária)
  - `created_at` / `updated_at`

---

## Success Criteria

- **SC-001**: O processamento do extrato OFX com identificação do banco deve ocorrer em menos de 200ms.
- **SC-002**: A filtragem e reclassificação de transações na tela devem atualizar a tabela e KPIs em menos de 150ms.
- **SC-003**: O middleware de isolamento de tenant deve interceptar e validar requisições de transações em menos de 50ms, bloqueando 100% de acessos a clientes não autorizados.

---

## Assumptions
- As transações bancárias pertencem exclusivamente à entidade `Client` (MEI) e são associadas pelo `client_id`.
- O isolamento entre clientes é imposto por escopo global no Eloquent.
- **Nota de Desenvolvimento (Banco de Dados)**: Como a aplicação está em fase de desenvolvimento e não em produção, todas as alterações no esquema do banco de dados devem ser feitas modificando **diretamente a migration original de criação correspondente**, em vez de criar novas migrations de alteração/cumulativas.
