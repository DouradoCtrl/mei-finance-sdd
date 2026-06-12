# Feature Specification: Página de Receitas, Importação de Extrato OFX & Controle de Transações

**Feature Branch**: `002-importacao-extrato`

**Created**: 2026-06-10
**Updated**: 2026-06-12

**Status**: Planning Enhancement

**Input**: User description: "A página de importar será uma seção da página de 'Receita', onde haverá faturamento, lucro, gastos, entradas, quatro cartões bento principais de escopo (Pendentes, PJ, PF e Neutro), e filtros secundários em formato pill (conta corrente e cartão de crédito). A importação aceitará apenas arquivos OFX (sem input TXT). Adicionado suporte para excluir transações (com modal contendo ícone no cabeçalho) e alterar classificação de lançamentos no histórico em formato de cápsula de controle segmentado. Melhoria com identificação do banco emissor, filtros globais de data no cabeçalho (mês, trimestre, semestre, ano, personalizado, mês passado), tabela unificada com filtros dinâmicos cruzados, e possibilidade de definir apelidos/aliases para transações individuais."

---

## User Scenarios & Testing

### User Story 1 - Página de Fluxo de Caixa com Bento Cards, Filtros Globais de Período e Origem (Priority: P1)
O usuário acessa `/dashboard/receitas` (Fluxo de Caixa) para visualizar a saúde financeira. Ele pode filtrar as transações no cabeçalho por períodos predefinidos (Mês Atual, Mês Passado, Trimestre, Semestre, Ano ou Personalizado com data início/fim) e alternar entre os Bento Cards de escopo (Pendentes, PJ, PF e Neutro) e filtros secundários de origem (Conta Corrente vs Cartão) para atualizar os KPIs e o histórico.

**Acceptance Scenarios**:
1. **Given** que o usuário está logado e na página `/dashboard/receitas`, **When** ele seleciona o filtro de data "Mês Passado" no cabeçalho, **Then** o sistema recarrega a tabela e recalcula os KPIs exibindo apenas transações daquele período.
2. **Given** que o usuário seleciona o período "Personalizado" no cabeçalho, **When** ele escolhe um intervalo específico de datas (ex: 15/01/2026 a 22/01/2026), **Then** o sistema exibe apenas as transações desse intervalo de tempo.
3. **Given** que o usuário está visualizando a aba "PJ", **When** ele seleciona o filtro pill "Cartão de Crédito", **Then** a lista de lançamentos e os KPIs são atualizados para exibir apenas dados originados do cartão de crédito corporativo.

---

### User Story 2 - Seção de Importação de Extrato OFX com Identificação do Banco (Priority: P1)
Na própria página de Receitas, o usuário clica em "Importar Extrato". Um modal ou painel expansível é aberto para upload de arquivo `.ofx`. O sistema analisa o arquivo, identifica de qual banco originou o extrato (ex: Itaú, Nubank, etc.), lista os lançamentos em uma tabela temporária de conciliação para classificação e permite salvar.

**Acceptance Scenarios**:
1. **Given** a seção de importação aberta, **When** o usuário faz o upload de um arquivo `.ofx` válido, **Then** o backend parseia as transações (extraindo data, descrição, valor, `fit_id` e o nome da instituição financeira/banco) e as exibe na tabela para classificação.
2. **Given** transações importadas temporariamente, **When** o usuário classifica os itens e clica em "Confirmar Fechamento", **Then** o sistema envia e salva essas transações no banco, incluindo o nome do banco identificado, atualiza o histórico e os KPIs.

---

### User Story 3 - Painel de Resumo Financeiro (KPIs) (Priority: P1)
A página exibe três cards de métricas (Faturamento, Gastos e Lucro Líquido) que somam dinamicamente as transações confirmadas no banco do usuário respeitando os filtros ativos de período, classificação e banco.

**Acceptance Scenarios**:
1. **Given** que o usuário possui transações salvas de Conta Corrente PJ, **When** ele entra na página e filtra pelo mês atual, **Then** o card "Faturamento" exibe a soma de todas as entradas PJ do mês atual, "Gastos" exibe a soma das saídas PJ do mês atual, e "Lucro Líquido" exibe a diferença.

---

### User Story 4 - Exclusão de Transações no Histórico (Priority: P1)
O usuário pode clicar em um botão de excluir ao lado de qualquer transação listada no histórico da página de Receitas para removê-la permanentemente.

**Acceptance Scenarios**:
1. **Given** uma transação listada na tabela de histórico, **When** o usuário clica na lixeira/excluir e confirma no modal de diálogo do GlowDialog, **Then** o sistema remove a transação do banco de dados, remove da tabela na tela e atualiza os KPIs automaticamente.

---

### User Story 5 - Reclassificação de Lançamentos Salvos (Priority: P1)
O usuário pode alterar a classificação (PJ, PF, Neutro) de uma transação diretamente na tabela de histórico.

**Acceptance Scenarios**:
1. **Given** uma transação classificada como PJ no histórico, **When** o usuário clica para alterar sua classificação para PF, **Then** o sistema atualiza a classificação no banco de dados e recalcula dinamicamente os KPIs na tela do usuário.

---

### User Story 6 - Apelido/Alias de Transação (Priority: P2)
O usuário pode renomear transações que possuem nomes genéricos ou repetidos no extrato bancário, atribuindo apelidos amigáveis individuais.

**Acceptance Scenarios**:
1. **Given** uma transação listada no histórico com descrição "SABESP 482937", **When** o usuário clica no ícone de edição da descrição, digita o apelido "Conta de Água" e salva, **Then** o sistema grava o apelido, e a tabela passa a exibir "Conta de Água" com destaque principal e "SABESP 482937" em texto secundário menor.

---

### User Story 7 - Tabela Unificada com Filtros Dinâmicos Cruzados (Priority: P2)
O usuário deseja visualizar todas as transações de forma unificada e filtrá-las dinamicamente por múltiplos critérios na mesma tela (Classificação, Tipo de Lançamento, e Banco Origem).

**Acceptance Scenarios**:
1. **Given** que o usuário está visualizando o histórico unificado, **When** ele clica no filtro dinâmico de banco para selecionar "Nubank" e na classificação "PJ", **Then** a tabela exibe instantaneamente apenas as transações corporativas do Nubank no período selecionado.

---

## Requirements

### Functional Requirements
- **FR-001**: O sistema deve possuir a rota de frontend `/dashboard/receitas`.
- **FR-002**: A página deve possuir quatro Bento Cards de escopo principal para alternar entre Pendentes, PJ, PF e Neutro/Transferências, e filtros pill glassmorphic secundários para selecionar a origem entre Conta Corrente (`checking_account`) e Cartão de Crédito (`credit_card`).
- **FR-003**: A página deve conter filtros globais de período no cabeçalho com as opções: Mês Atual, Mês Passado, Trimestre, Semestre, Ano e Personalizado (data de início e fim).
- **FR-004**: O frontend deve enviar os parâmetros de query `start_date` e `end_date` ao backend ao requisitar transações para manter o histórico alinhado com o filtro de período do cabeçalho.
- **FR-005**: O modal de importação deve suportar upload exclusivamente de arquivos `.ofx`. O parser do backend deve extrair o nome do banco emissor (tag `<ORG>` do arquivo OFX ou mapeamento correspondente) e atribuir ao campo `bank_name` das transações.
- **FR-006**: O sistema deve permitir que o usuário defina ou altere um apelido (`alias`) para qualquer transação individual por meio de uma ação de edição inline ou modal no frontend, salvando através do endpoint `PATCH /api/transactions/{id}/alias`.
- **FR-007**: Se uma transação tiver um apelido cadastrado, a tabela de histórico do frontend deve renderizar o apelido (`alias`) em destaque principal, mantendo a descrição original do extrato em tamanho menor e cor secundária logo abaixo.
- **FR-008**: A tabela de histórico deve conter filtros dinâmicos cruzados no frontend para refiltrar as transações exibidas por Classificação (PJ/PF/Neutro), Banco de Origem (ex: Itaú, Nubank) e Tipo (Extrato / Cartão).
- **FR-009**: O backend deve fornecer o endpoint `GET /api/transactions` que suporta filtros opcionais de query string: `start_date`, `end_date`, `classification`, `source`, `bank_name` e busca por texto (descrição/apelido).
- **FR-010**: O sistema deve permitir a exclusão física de uma transação salva através do endpoint `DELETE /api/transactions/{id}`.
- **FR-011**: O sistema deve permitir a reclassificação de uma transação através do endpoint `PATCH /api/transactions/{id}/classify`.

### Key Entities
- **Transaction**:
  - `user_id` (Identificador do usuário autenticado)
  - `transaction_date` (Data da transação)
  - `description` (Descrição extraída do extrato)
  - `alias` (Apelido amigável opcional, string nullable)
  - `amount` (Valor numérico positivo/negativo)
  - `source` (Origem: `checking_account` ou `credit_card`)
  - `bank_name` (Nome do banco/instituição financeira, string nullable)
  - `classification` (Classificação: `business_pj`, `personal_pf`, `transfer`)
  - `fit_id` (Identificador único da transação bancária)

---

## Success Criteria
- **SC-001**: O processamento e retorno do arquivo OFX com extração automática do nome do banco pelo backend deve ocorrer em menos de 200ms.
- **SC-002**: A busca e filtragem dinâmica de transações na interface Next.js por filtros de data ou cruzados deve atualizar a tabela e recalcular os KPIs consolidados em menos de 150ms.
- **SC-003**: A atualização do apelido (alias) de uma transação deve persistir no banco de dados e refletir na interface do usuário em menos de 100ms.
- **SC-004**: A exclusão e a reclassificação de uma transação devem persistir e refletir na interface do usuário em menos de 100ms.
