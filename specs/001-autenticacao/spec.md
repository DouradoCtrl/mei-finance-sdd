# Feature Specification: Cadastro e Login de Usuário

**Feature Branch**: `001-autenticacao`

**Created**: 2026-06-10

**Status**: Completed

**Input**: User description: "Fluxo de cadastro de conta (com nome, e-mail, CNPJ e senha) e login seguro para acesso ao aplicativo MEI Finance."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastro de Novo Usuário MEI (Priority: P1)

Como um novo microempreendedor, eu quero criar uma conta informando meu nome, e-mail, CNPJ (opcional) e uma senha segura, para que eu possa ter meu próprio painel financeiro isolado.

**Why this priority**: Essencial para garantir a privacidade dos dados de cada MEI e permitir que múltiplos usuários usem o sistema de forma independente.

**Independent Test**: Pode ser testado enviando o formulário de cadastro e confirmando se a requisição chega à API e cria o usuário no banco de dados.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tela de cadastro, **When** ele preenche nome, e-mail válido, CNPJ válido e uma senha forte, e clica em "Cadastrar", **Then** a requisição é enviada à API, o usuário é criado com sucesso (`success: true`) e o frontend o redireciona automaticamente para o painel principal (Dashboard).
2. **Given** que o usuário digita um e-mail que já existe no sistema, **When** ele tenta cadastrar, **Then** a API retorna um erro de validação de e-mail duplicado (`success: false`), e o frontend renderiza a mensagem de erro *"O campo email já está em uso"* diretamente abaixo do input de e-mail.
3. **Given** que o usuário envia campos obrigatórios em branco ou com formato incorreto, **When** a API retorna os erros de Form Request (`success: false`), **Then** o frontend exibe cada respectiva mensagem de erro logo abaixo de seu respectivo campo de entrada na tela.

---

### User Story 2 - Login Seguro (Priority: P1)

Como um MEI já cadastrado, eu quero fazer login informando meu e-mail e senha para acessar minhas informações financeiras com segurança.

**Why this priority**: É a porta de entrada diária/periódica do aplicativo. Impede que pessoas não autorizadas vejam os dados financeiros do negócio.

**Independent Test**: Enviar dados de login e verificar se a API retorna sucesso com o token Sanctum correspondente.

**Acceptance Scenarios**:

1. **Given** um usuário cadastrado, **When** ele digita o e-mail e a senha corretos e clica em "Entrar", **Then** a API valida os dados e retorna o token de acesso (`success: true`), e o frontend inicia a sessão e o redireciona para a tela principal.
2. **Given** um usuário cadastrado, **When** ele insere dados de acesso incorretos e tenta logar, **Then** a API retorna erro de credenciais inválidas (`success: false`, `data: null`, `message: "E-mail ou senha incorretos."`), e o frontend exibe esta mensagem genérica em forma de notificação flutuante (Toast/Sonner).
3. **Given** que o usuário envia o formulário com dados em branco, **When** a API retorna erros de validação estrutural (Form Request), **Then** o frontend exibe as mensagens de erro específicas (ex: *"O campo email é obrigatório."*) diretamente abaixo de cada campo afetado.

---

### User Story 3 - Logout (Priority: P2)

Como um usuário logado, eu quero poder sair da minha conta para garantir que ninguém mexa nos meus dados se eu deixar o computador/celular aberto.

**Why this priority**: Importante para a segurança de computadores compartilhados.

**Independent Test**: Clicar em "Sair" e tentar acessar a página interna digitando a URL diretamente, garantindo que o sistema redirecione de volta para o login.

**Acceptance Scenarios**:

1. **Given** que o usuário está logado na aplicação, **When** ele clica no botão "Sair", **Then** o sistema encerra a sessão ativa e o redireciona para a tela de login.

### Edge Cases

- **CNPJ com formato inválido**: O CNPJ é opcional. Se enviado, a API o validará (Form Request). Em caso de erro, a mensagem será exibida abaixo do input de CNPJ.
- **Senha fraca**: A senha é validada na API (mínimo de 6 caracteres). O erro correspondente é exibido abaixo do input de senha.
- **Tentar acessar página restrita sem login**: Se um usuário não autenticado tentar acessar o dashboard direto pela URL, o sistema deve redirecioná-lo para a tela de login.
- **Conta desativada (active = false)**: Se a conta do usuário for desativada, ele não poderá realizar login (retornando erro 403 da API) e qualquer sessão ativa/token deve ser imediatamente bloqueado nas rotas autenticadas da API.
- **Funções de acesso (role)**: O usuário recém-registrado recebe por padrão a role `default`. O sistema suporta as roles `default` e `admin`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema deve fornecer uma interface gráfica para Cadastro (Nome, E-mail, CNPJ opcional, Senha).
- **FR-002**: O sistema deve fornecer uma interface gráfica para Login (E-mail e Senha).
- **FR-003**: O backend (Laravel API) deve ser o único responsável pela validação dos dados de entrada (obrigatoriedade, formato de e-mail, formato de CNPJ, tamanho da senha). O frontend não deve duplicar validações client-side.
- **FR-004**: O frontend deve exibir mensagens de erro do Form Request da API (ex: validação de formato/obrigatoriedade) diretamente abaixo de seus respectivos campos de input.
- **FR-005**: O frontend deve exibir mensagens de erro de regras de negócio gerais da API (ex: erro de credenciais inválidas) como notificações flutuantes (Toast/Sonner).
- **FR-006**: O backend deve armazenar as senhas de forma criptografada segura (usando hash como bcrypt, nunca em texto puro).
- **FR-007**: O backend deve impedir cadastros duplicados com o mesmo endereço de e-mail.
- **FR-008**: O backend deve gerenciar tokens de acesso de API (Laravel Sanctum) e o frontend deve gerenciar a sessão ativa protegendo as rotas internas contra acessos não autorizados.
- **FR-009**: O backend deve impedir o login e o acesso a recursos se o usuário estiver inativo (`active` = false).
- **FR-010**: O backend deve associar a role `default` ao novo usuário no momento do cadastro.

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
