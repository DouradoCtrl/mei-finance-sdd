# Feature Specification: Portal do Contador e Cadastro de Clientes MEI

**Feature Branch**: `002-cadastro-cliente`

**Created**: 2026-06-16
**Updated**: 2026-06-16

**Status**: Ready

**Input**: User description: "O contador pode cadastrar vários clientes. Cada cliente MEI possui seus próprios dados e é armazenado de forma isolada na carteira de cada contador (Isolamento Total por Carteira, permitindo que o mesmo CNPJ seja cadastrado por contadores diferentes na plataforma se necessário). O portal do contador lista estes clientes e permite selecionar um cliente ativo para acessar o painel financeiro."

---

## User Scenarios & Testing

### User Story 1 - Listagem de Clientes (Portal do Contador) (Priority: P1)

Como um contador autenticado, eu quero visualizar a lista de todos os meus clientes MEI cadastrados, para que eu possa gerenciar suas informações e escolher qual painel financeiro acessar.

**Why this priority**: É a página inicial de navegação do contador logado.

**Independent Test**: Logar como contador e certificar-se de que apenas os clientes pertencentes a esse contador são listados na tabela do portal de clientes.

**Acceptance Scenarios**:
1. **Given** que o contador está logado, **When** ele acessa o portal de clientes (`/dashboard/clientes`), **Then** o sistema retorna e exibe a tabela com Nome, CNPJ, E-mail e Status apenas dos clientes que ele cadastrou.
2. **Given** que outro contador está logado, **When** ele acessa a listagem, **Then** ele vê apenas a sua própria lista de clientes, sem cruzamento de dados.

---

### User Story 2 - Cadastro de Novo Cliente MEI pelo Contador (Priority: P1)

Como um contador autenticado, eu quero cadastrar um novo cliente informando Razão Social/Nome, E-mail e CNPJ, para que eu possa gerenciar suas contas.

**Why this priority**: Permite expandir a carteira de clientes do contador.

**Independent Test**: Cadastrar um cliente e verificar se ele é inserido na tabela `clients` com a chave `user_id` apontando para o ID do contador logado.

**Acceptance Scenarios**:
1. **Given** que o contador está na listagem de clientes e clica em "Adicionar Cliente", **When** ele preenche os campos com dados válidos e clica em "Salvar", **Then** o cliente é criado no banco de dados e adicionado imediatamente à tabela.
2. **Given** que o contador tenta cadastrar um CNPJ que já está cadastrado por ele mesmo, **When** ele envia o formulário, **Then** o sistema retorna um erro de validação.
3. **Given** que o Contador A já tem o CNPJ "X" cadastrado, **When** o Contador B tenta cadastrar o mesmo CNPJ "X" em sua própria carteira, **Then** o sistema permite o cadastro com sucesso (Isolamento Total por Carteira).

---

### User Story 3 - Seleção de Cliente e Acesso ao Painel (Priority: P1)

Como um contador autenticado, eu quero selecionar um de meus clientes cadastrados na lista para visualizar seu painel financeiro de forma isolada.

**Why this priority**: Permite que o contador acesse e alterne o contexto de visualização do dashboard.

**Independent Test**: Selecionar um cliente e verificar se o cookie de contexto `selected_client_id` é salvo com o ID correto e se o usuário é redirecionado para a página de fluxo de caixa.

**Acceptance Scenarios**:
1. **Given** que o contador está na listagem de clientes, **When** ele clica em "Acessar Painel" ao lado do Cliente A, **Then** o cookie `selected_client_id` é gravado no navegador com o ID do Cliente A e o contador é redirecionado para `/dashboard/receitas`.
2. **Given** que o contador está em `/dashboard/receitas` e deseja alternar para o Cliente B, **When** ele clica no alternador de clientes (`ClientSwitcher`) na barra superior e seleciona o Cliente B, **Then** o cookie é atualizado para o ID do Cliente B e a página é recarregada exibindo as receitas do Cliente B.
3. **Given** que o contador deseja voltar ao portal geral, **When** ele clica no switcher e seleciona "Portal do Contador", **Then** o cookie de contexto é removido e ele é redirecionado para `/dashboard/clientes`.

---

## Requirements

### Functional Requirements
- **FR-001**: O sistema deve fornecer a rota `/dashboard/clientes` restrita a contadores logados.
- **FR-002**: O sistema deve possuir a tabela `clients` para armazenar os clientes MEI de forma independente de `users`.
- **FR-003**: O endpoint `GET /api/clients` deve listar apenas os registros da tabela `clients` onde `user_id` seja o ID do contador autenticado.
- **FR-004**: O endpoint `POST /api/clients` deve validar os campos Nome, E-mail e CNPJ e persistir o novo cliente associando-o ao ID do contador logado.
- **FR-005**: A regra de unicidade do CNPJ deve ser restrita ao escopo do contador logado (a combinação `user_id` + `cnpj` deve ser única na tabela `clients`, mas o mesmo `cnpj` pode existir sob diferentes `user_id`).
- **FR-006**: O frontend deve fornecer um componente `ClientSwitcher` na barra superior para alternar o ID do cliente ativo no cookie `selected_client_id` ou limpar o contexto para retornar ao portal.
- **FR-007**: Qualquer tentativa de acessar endpoints que dependem de contexto de cliente por um contador que não seja o proprietário desse cliente (verificação de vínculo) deve retornar erro HTTP 403.

### Key Entities

- **Client**:
  - `id` (Identificador único, PK)
  - `user_id` (FK apontando para `users.id` do contador responsável)
  - `name` (Razão Social/Nome do cliente)
  - `cnpj` (CNPJ do cliente, string de 14 dígitos)
  - `email` (E-mail do cliente, string)
  - `active` (Booleano indicando se o cliente está ativo, default true)
  - `created_at` / `updated_at`

---

## Success Criteria

- **SC-001**: A listagem de clientes do contador logado deve carregar em menos de 200ms.
- **SC-002**: A gravação do cookie de contexto ao selecionar um cliente no switcher deve ocorrer de forma instantânea no clique do usuário.
- **SC-003**: Nenhuma informação de clientes de terceiros pode vazar em chamadas de API, retornando 403 em menos de 50ms para acessos não autorizados.

---

## Assumptions
- O contador gerencia as empresas sob o modelo de Isolamento Total por Carteira.
- Os clientes MEI são representados por registros independentes na tabela `clients` vinculados ao contador através da FK `user_id`.
- **Nota de Desenvolvimento (Banco de Dados)**: Como a aplicação está em fase de desenvolvimento e não em produção, todas as alterações no esquema do banco de dados devem ser feitas modificando **diretamente a migration original de criação correspondente**, em vez de criar novas migrations de alteração/cumulativas.
