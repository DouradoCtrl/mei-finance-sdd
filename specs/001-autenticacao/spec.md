# Feature Specification: Cadastro e Login de Usuário

**Feature Branch**: `001-autenticacao`

**Created**: 2026-06-10

**Status**: Completed

**Input**: User description: "Fluxo de cadastro de conta (com nome, e-mail, CNPJ e senha) e login seguro para acesso ao aplicativo MEI Finance."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastro de Novo Usuário MEI (Priority: P1)

Como um novo microempreendedor, eu quero criar uma conta informando meu nome, e-mail, CNPJ (opcional) e uma senha segura, para que eu possa ter meu próprio painel financeiro isolado.

**Why this priority**: Essencial para garantir a privacidade dos dados de cada MEI e permitir que múltiplos usuários usem o sistema de forma independente.

**Independent Test**: Pode ser testado preenchendo o formulário de cadastro com dados válidos e confirmando que um novo registro de usuário é criado no banco de dados.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tela de cadastro, **When** ele preenche nome, e-mail válido, CNPJ válido e uma senha forte, e clica em "Cadastrar", **Then** o sistema cria o usuário e o redireciona automaticamente para o painel principal (Dashboard) já autenticado.
2. **Given** que o usuário digita um e-mail que já existe no sistema, **When** ele tenta cadastrar, **Then** o sistema exibe uma mensagem de erro informando que o e-mail já está em uso.
3. **Given** que o usuário deixa campos obrigatórios em branco, **When** ele tenta enviar, **Then** o sistema destaca os campos obrigatórios e não envia os dados.

---

### User Story 2 - Login Seguro (Priority: P1)

Como um MEI já cadastrado, eu quero fazer login informando meu e-mail e senha para acessar minhas informações financeiras com segurança.

**Why this priority**: É a porta de entrada diária/periódica do aplicativo. Impede que pessoas não autorizadas vejam os dados financeiros do negócio.

**Independent Test**: Tentar logar com credenciais corretas e verificar se o sistema redireciona para a tela principal (dashboard) e gera uma sessão ativa.

**Acceptance Scenarios**:

1. **Given** um usuário cadastrado, **When** ele digita o e-mail e a senha corretos e clica em "Entrar", **Then** o sistema inicia a sessão e o redireciona para a tela principal do app.
2. **Given** um usuário cadastrado, **When** ele erra a senha ou digita um e-mail incorreto, **Then** o sistema exibe uma mensagem amigável de "E-mail ou senha inválidos" (sem especificar qual dos dois está errado, por segurança).

---

### User Story 3 - Logout (Priority: P2)

Como um usuário logado, eu quero poder sair da minha conta para garantir que ninguém mexa nos meus dados se eu deixar o computador/celular aberto.

**Why this priority**: Importante para a segurança de computadores compartilhados.

**Independent Test**: Clicar em "Sair" e tentar acessar a página interna digitando a URL diretamente, garantindo que o sistema redirecione de volta para o login.

**Acceptance Scenarios**:

1. **Given** que o usuário está logado na aplicação, **When** ele clica no botão "Sair", **Then** o sistema encerra a sessão ativa e o redireciona para a tela de login.

### Edge Cases

- **CNPJ com formato inválido**: O sistema deve aceitar CNPJ apenas no formato correto (14 dígitos, com ou sem pontuação) e validar o dígito verificador. Caso seja inválido, não permite o cadastro.
- **Senha fraca**: A senha deve conter no mínimo 6 caracteres para ser aceita.
- **Tentar acessar página restrita sem login**: Se um usuário não autenticado tentar acessar o dashboard direto pela URL, o sistema deve redirecioná-lo para a tela de login.
- **Conta desativada (active = false)**: Se a conta do usuário for desativada, ele não poderá realizar login (retornando erro 403) e qualquer sessão ativa/token deve ser imediatamente bloqueado nas rotas autenticadas da API.
- **Funções de acesso (role)**: O usuário recém-registrado recebe por padrão a role `default`. O sistema suporta as roles `default` e `admin`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema deve fornecer uma interface gráfica para Cadastro (Nome, E-mail, CNPJ opcional, Senha).
- **FR-002**: O sistema deve fornecer uma interface gráfica para Login (E-mail e Senha).
- **FR-003**: O sistema deve validar os dados de entrada (e-mail válido, senha com mínimo de 6 caracteres, CNPJ se fornecido).
- **FR-004**: O sistema deve armazenar as senhas de forma criptografada segura (usando hash como bcrypt ou pbkdf2, nunca em texto puro).
- **FR-005**: O sistema deve impedir cadastros duplicados com o mesmo endereço de e-mail.
- **FR-006**: O sistema deve gerenciar sessões de login ativas e proteger as rotas internas contra acessos não autorizados.
- **FR-007**: O sistema deve impedir o login e a navegação em rotas restritas se o usuário estiver inativo (`active` = false).
- **FR-008**: O sistema deve associar a role `default` ao novo usuário no momento do cadastro.

### Key Entities *(include if feature involves data)*

- **User**:
  - `id` (Identificador único)
  - `name` (Nome completo ou fantasia do MEI)
  - `email` (E-mail único de acesso)
  - `password` (Senha criptografada com hash bcrypt)
  - `cnpj` (CNPJ do microempreendedor, opcional)
  - `role` (Função do usuário: 'default' ou 'admin')
  - `active` (Estado de ativação da conta, booleano)
  - `created_at` (Data de criação da conta)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O processo de login ou cadastro (com hash de senha) deve ser concluído em menos de 1.5 segundos.
- **SC-002**: 100% das senhas gravadas no banco de dados devem estar criptografadas.
- **SC-003**: Nenhuma rota interna do sistema deve ser acessível sem um token/sessão ativa.

## Assumptions

- O armazenamento de dados dos usuários será feito de forma persistente.
- A sessão durará até o usuário clicar em Logout ou expirar por inatividade prolongada (ex: 24 horas).
