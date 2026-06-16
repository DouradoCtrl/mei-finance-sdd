# Feature Specification: Cadastro, Login e Sessão do Contador

**Feature Branch**: `001-autenticacao`

**Created**: 2026-06-10
**Updated**: 2026-06-16

**Status**: Ready

**Input**: User description: "O intuito é que o contador consiga se cadastrar e logar na aplicação. O contador é o usuário autenticado principal que gerencia o escritório de contabilidade."

---

## User Scenarios & Testing

### User Story 1 - Cadastro de Novo Contador (Priority: P1)

Como um profissional de contabilidade, eu quero criar uma conta informando meu nome, e-mail, CRC (Conselho Regional de Contabilidade), nome do escritório e uma senha segura, para que eu possa ter meu próprio espaço de gerenciamento.

**Why this priority**: É o ponto de partida essencial para que o contador possa acessar a aplicação.

**Independent Test**: Pode ser testado enviando o formulário de cadastro de contador e confirmando se o registro é persistido corretamente no banco de dados com a role `accountant` e as informações de CRC/escritório preenchidas.

**Acceptance Scenarios**:
1. **Given** que o contador está na tela de cadastro, **When** ele preenche o nome, e-mail válido, CRC válido, nome do escritório e uma senha forte, e clica em "Cadastrar", **Then** o usuário é criado com a role `accountant`, a sessão é iniciada e o frontend o redireciona para o Portal de Clientes.
2. **Given** que o contador tenta se cadastrar com um e-mail já existente, **When** ele clica em "Cadastrar", **Then** a API retorna um erro de validação de e-mail duplicado e o frontend renderiza a mensagem de erro específica.

---

### User Story 2 - Login Seguro do Contador (Priority: P1)

Como um contador cadastrado, eu quero fazer login com meu e-mail e senha para acessar a plataforma.

**Why this priority**: Permite que o contador acesse suas informações e carteira de forma segura.

**Independent Test**: Enviar dados de login do contador e verificar se a sessão é iniciada com a role `accountant`, redirecionando-o para a tela de gerenciamento de clientes.

**Acceptance Scenarios**:
1. **Given** um contador já cadastrado, **When** ele digita e-mail e senha corretos e clica em "Entrar", **Then** o sistema valida o acesso, inicia a sessão segura e o redireciona para a listagem de clientes.
2. **Given** um contador cadastrado, **When** ele digita e-mail ou senha incorretos, **Then** o sistema retorna erro de autenticação e mantém o usuário na tela de login.

---

### User Story 3 - Login e Acesso do Administrador (Priority: P1)

Como o administrador da plataforma (desenvolvedor/mantenedor), eu quero fazer login com meu e-mail e senha administrativos para realizar a manutenção geral do sistema, sem a necessidade de informar CRC ou nome de escritório.

**Acceptance Scenarios**:
1. **Given** que o administrador já está cadastrado no banco via seeder/migration com a role `admin`, **When** ele digita e-mail e senha corretos na tela de login, **Then** o sistema valida o acesso, inicia a sessão segura com a role `admin`, e o redireciona para o painel de administração geral (ou área de manutenção correspondente).
2. **Given** um usuário administrador logado, **When** ele navega pela plataforma, **Then** ele tem permissões globais de visualização/manutenção e os campos `crc` e `office_name` são tratados como nulos no seu perfil.

---

### User Story 4 - Logout e Proteção de Sessão (Priority: P2)

Como um usuário autenticado (contador ou admin), eu quero poder encerrar minha sessão com segurança para que ninguém acesse meus dados expostos.

**Acceptance Scenarios**:
1. **Given** que o usuário está logado, **When** ele clica em "Sair", **Then** a sessão do NextAuth é destruída, o token Sanctum é revogado no backend e o usuário é redirecionado para a tela de login.
2. **Given** um usuário não autenticado, **When** ele tenta acessar diretamente qualquer URL sob `/dashboard`, **Then** o middleware de sessão bloqueia o acesso e o redireciona imediatamente para a tela de login.

---

## Requirements

### Functional Requirements
- **FR-001**: O sistema deve fornecer uma interface de Cadastro para Contadores contendo os campos: Nome, E-mail, CRC, Nome do Escritório e Senha.
- **FR-002**: O sistema deve fornecer uma interface de Login contendo os campos: E-mail e Senha.
- **FR-003**: O backend deve validar e salvar as informações do contador com a role padrão `accountant` na tabela `users`.
- **FR-004**: O sistema de login deve utilizar Sanctum (Tokens baseados em cookies de sessão/HttpOnly via BFF) para manter o estado autenticado de forma segura.
- **FR-005**: O sistema deve revogar os tokens Sanctum no backend ao realizar logout.
- **FR-006**: O frontend deve bloquear rotas internas (`/dashboard/:path*`) redirecionando tráfego não autenticado para `/login`.
- **FR-007**: O sistema deve permitir a autenticação de usuários com a role `admin`. O cadastro de administradores não é público e ocorre via seeders de banco de dados ou linha de comando.
- **FR-008**: Os campos `crc` e `office_name` devem ser opcionais (`nullable`) para usuários com a role `admin`.

### Key Entities

- **User**:
  - `id` (Identificador único)
  - `name` (Nome do usuário/contador/admin)
  - `email` (E-mail de acesso único)
  - `password` (Senha com hash seguro)
  - `role` (Função: `'accountant'` ou `'admin'`)
  - `crc` (Número do conselho profissional, string - nulo para admin)
  - `office_name` (Nome do escritório de contabilidade, string - nulo para admin)
  - `active` (Booleano indicando conta ativa, default true)
  - `created_at` / `updated_at`

---

## Success Criteria

- **SC-001**: A criação da conta e login seguro com emissão de token devem ser efetuados em menos de 300ms.
- **SC-002**: 100% das páginas internas do painel devem estar inacessíveis para usuários não autenticados.
- **SC-003**: O token de acesso do usuário deve ser completamente inutilizado no backend após a chamada de logout.

---

## Assumptions
- O contador é o usuário administrativo do seu respectivo escritório e carteira.
- O administrador da plataforma (desenvolvedor) é um usuário com `role = 'admin'` criado por meio do seeder inicial do banco de dados para fins de manutenção e suporte.
- O linter e verificadores do TypeScript validarão as tipagens de sessão e rotas.
- **Nota de Desenvolvimento (Banco de Dados)**: Como a aplicação está em fase de desenvolvimento e não em produção, todas as alterações no esquema do banco de dados devem ser feitas modificando **diretamente a migration original de criação correspondente**, em vez de criar novas migrations de alteração/cumulativas.

