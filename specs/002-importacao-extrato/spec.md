# Feature Specification: Importação de Extrato e Classificação PF/PJ

**Feature Branch**: `002-importacao-extrato`

**Created**: 2026-06-10

**Status**: Implemented

**Input**: User description: "Importação e colagem de extrato bancário para classificação periódica de gastos e receitas entre PF (Pessoal) e PJ (Negócio), ideal para uso semanal ou mensal por usuários MEI."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Colagem e Importação de Extrato (Priority: P1)

O usuário MEI entra no sistema semanal ou mensalmente e cola o extrato de sua conta bancária em formato de texto (copiado do internet banking) ou importa um arquivo. O sistema analisa o conteúdo e lista todas as transações de forma estruturada.

**Why this priority**: Crítico para resolver o problema de digitação manual diária. Permite carregar dezenas de transações de uma só vez.

**Independent Test**: Pode ser testado colando uma linha de transação (ex: "10/06/2026 PIX RECEBIDO JOAO R$ 150,00") e verificando se ela aparece corretamente estruturada na tela.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tela de importação, **When** ele cola um bloco de texto com 3 transações válidas e clica em "Processar", **Then** o sistema exibe uma tabela contendo as 3 transações com campos separados de Data, Descrição e Valor.
2. **Given** que o usuário tenta processar um texto vazio ou inválido, **When** ele clica em "Processar", **Then** o sistema exibe um alerta amigável pedindo para verificar o texto colado.

---

### User Story 2 - Classificação Rápida PF/PJ (Priority: P1)

Após listar as transações importadas, o sistema oferece botões rápidos de um clique (ex: "PJ - Negócio" e "PF - Pessoal") ao lado de cada item. O usuário pode alternar rapidamente a classificação de cada transação.

**Why this priority**: É a funcionalidade central que ataca a dor de separar os gastos pessoais dos profissionais.

**Independent Test**: O usuário clica no botão "PJ - Negócio" de uma transação e a cor da linha muda, atualizando o status interno da transação para PJ.

**Acceptance Scenarios**:

1. **Given** uma lista de transações importadas e sem classificação, **When** o usuário clica no botão "PJ" da primeira transação, **Then** o sistema marca a transação como PJ e salva temporariamente a decisão.
2. **Given** uma transação previamente marcada como "PJ", **When** o usuário clica no botão "PF", **Then** o sistema altera a classificação para Pessoal e atualiza a interface.

---

### User Story 3 - Painel de Resumo Mensal (Priority: P1)

Na mesma tela de classificação, o sistema exibe um painel de resumo que se atualiza em tempo real. O painel mostra o total de Receitas PJ, Despesas PJ, Retiradas Pessoais (PF) e o Lucro Líquido real do negócio.

**Why this priority**: Dá clareza financeira imediata ao MEI, mostrando se a empresa de fato gerou lucro ou se o dinheiro foi gasto com despesas pessoais.

**Independent Test**: O usuário classifica uma entrada de R$ 1.000 como PJ, uma saída de R$ 200 como PJ e uma saída de R$ 300 como PF. O painel deve exibir exatamente: Receitas PJ = R$ 1.000, Despesas PJ = R$ 200, Retiradas PF = R$ 300 e Lucro Líquido = R$ 800.

**Acceptance Scenarios**:

1. **Given** transações classificadas, **When** o usuário abre a tela de resumo, **Then** o lucro líquido exibido é exatamente o cálculo: (Entradas PJ - Saídas PJ).
2. **Given** que o usuário altera a classificação de um gasto de R$ 50 de PJ para PF, **When** a alteração é feita, **Then** as Despesas PJ diminuem R$ 50 e as Retiradas PF aumentam R$ 50 instantaneamente.

### Edge Cases

- **Formato de data inválido ou não reconhecido**: Se o extrato colado tiver um formato de data estranho, o sistema assume a data atual (do dia do fechamento) e permite ao usuário ajustar manualmente se necessário.
- **Transações duplicadas**: Se o usuário colar transações que já foram importadas e classificadas anteriormente, o sistema deve identificar através da combinação de data, descrição e valor e perguntar se deseja ignorar as duplicatas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema deve disponibilizar um campo de texto (textarea) para o usuário colar o extrato bancário.
- **FR-002**: O sistema deve extrair de cada linha do extrato: a Data da transação, a Descrição e o Valor (identificando entradas/valores positivos e saídas/valores negativos).
- **FR-003**: O sistema deve listar as transações identificadas em uma tabela interativa antes de salvá-las definitivamente.
- **FR-004**: O sistema deve fornecer controle rápido (dois botões ou seletor rápido) para categorizar cada transação como "PJ - Negócio" ou "PF - Pessoal".
- **FR-005**: O sistema deve manter um resumo dinâmico na tela contendo:
  - Total Recebido (Entradas classificadas como PJ)
  - Despesas do Negócio (Saídas classificadas como PJ)
  - Retiradas/Pessoal (Saídas classificadas como PF)
  - Lucro Líquido (Total Recebido PJ - Despesas PJ)
- **FR-006**: O sistema deve salvar permanentemente as transações e suas respectivas classificações no banco de dados ou arquivo local ao clicar em "Confirmar Fechamento".

### Key Entities *(include if feature involves data)*

- **Transacao**:
  - `data` (Data do evento)
  - `descricao` (Texto descritivo do extrato)
  - `valor` (Numérico, positivo ou negativo)
  - `classificacao` (Enumeração: `PENDENTE`, `PJ_NEGOCIO`, `PF_PESSOAL`)
- **FechamentoMensal**:
  - `mes_ano` (Mês e ano de referência, ex: "06/2026")
  - `receita_pj` (Soma das entradas PJ)
  - `despesa_pj` (Soma das saídas PJ)
  - `retirada_pf` (Soma das saídas PF)
  - `lucro_liquido` (Receita PJ - Despesa PJ)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário deve ser capaz de importar e classificar um extrato de até 30 transações em menos de 2 minutos.
- **SC-002**: O processamento do texto colado para identificação de linhas de transação deve levar menos de 200ms.
- **SC-003**: O painel de resumo mensal deve atualizar seus valores em menos de 100ms após o clique de classificação do usuário.

## Assumptions

- O extrato colado virá de bancos populares no Brasil (ex: Nubank, Itaú, Inter, Bradesco) e o sistema usará expressões regulares para identificar padrões comuns de data e valor.
- O armazenamento inicial pode ser feito em memória ou arquivo JSON local simples para viabilizar um MVP rápido, migrando para banco de dados relacional se necessário.
- A moeda padrão do sistema é o Real Brasileiro (R$).
