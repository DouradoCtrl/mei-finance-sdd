# Feature Specification: Controle de Usuários (Administrador)

**Feature Branch**: `003-controle-usuarios`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "É necessário na dock mostrar somente para o admin uma opção para controle de usuários, caso clicado ele será redirecionado para uma página onde ele pode gerenciar os contadores e os admins. Para criar, editar, atualizar e excluir usuários."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acesso Restrito ao Controle de Usuários na Dock (Priority: P1)

Como Administrador autenticado na plataforma, eu quero visualizar a opção "Controle de Usuários" na Navigation Dock para que eu possa acessar a página de gerenciamento de forma direta. Como Contador autenticado, eu não devo ver essa opção na Dock e qualquer tentativa de acessar a URL de gerenciamento diretamente deve ser impedida.

**Why this priority**: É a fundação de segurança da funcionalidade. Garante que as permissões de acesso ao nível de rota e UI sejam respeitadas, prevenindo que usuários comuns acessem painéis administrativos.

**Independent Test**:
- Logar com um usuário do tipo `accountant` (contador): verificar que a opção "Controle de Usuários" não é visível na dock e que ao tentar acessar `/dashboard/users` diretamente, o sistema bloqueia e redireciona de volta para `/dashboard` com uma mensagem de permissão negada.
- Logar com um usuário do tipo `admin` (administrador): verificar que a opção é exibida na dock e que ao clicar nela, o usuário é redirecionado para a página de gerenciamento de usuários.

**Acceptance Scenarios**:

1. **Given** que o usuário está autenticado com o perfil `accountant`, **When** ele renderizar o painel principal, **Then** a Navigation Dock não deve conter o botão ou ícone de "Controle de Usuários".
2. **Given** que o usuário está autenticado com o perfil `admin`, **When** ele renderizar o painel principal, **Then** a Navigation Dock deve conter a opção de "Controle de Usuários".
3. **Given** que o usuário está autenticado com o perfil `accountant`, **When** ele tentar digitar diretamente no navegador a rota `/dashboard/users`, **Then** o sistema deve interceptar a rota no nível de middleware/proxy e redirecioná-lo para `/dashboard` exibindo um alerta ("Acesso não autorizado").

---

### User Story 2 - Listagem e Visualização de Usuários (Priority: P1)

Como Administrador, eu quero visualizar uma listagem em tabela de todos os usuários (administradores e contadores) registrados no sistema, com seus nomes, e-mails, registros CRC (se aplicável), perfil e status (ativo/inativo) para controle da base de usuários.

**Why this priority**: É essencial que o administrador consiga visualizar quem está cadastrado no sistema antes de tomar qualquer ação de criação, edição ou exclusão.

**Independent Test**:
- Acessar a página `/dashboard/users` como administrador e certificar-se de que a tabela de usuários carrega todos os dados cadastrados no banco de dados, mostrando corretamente as colunas Nome, E-mail, CRC, Perfil e Status.

**Acceptance Scenarios**:

1. **Given** que o administrador acessou `/dashboard/users`, **When** a página carregar, **Then** o sistema deve listar todos os usuários cadastrados de forma ordenada e paginada, mostrando suas respectivas informações (Nome, E-mail, CRC, Perfil e Status).

---

### User Story 3 - Criação e Cadastro de Novos Usuários (Priority: P2)

Como Administrador, eu quero preencher um formulário contendo os dados de um novo usuário (seja ele contador ou administrador) para registrá-lo manualmente no sistema.

**Why this priority**: Permite que o administrador adicione outros parceiros, administradores ou contadores sem a necessidade de fluxo público de registro externo.

**Independent Test**:
- Clicar em "Novo Usuário" na tela de controle de usuários, preencher com dados válidos, selecionar o perfil `admin`, submeter o formulário e confirmar se o usuário foi listado na tabela e criado no banco de dados.

**Acceptance Scenarios**:

1. **Given** que o administrador está no formulário de criação de usuário, **When** ele submeter dados válidos (Nome, E-mail, Senha e Perfil), **Then** o sistema deve criar o usuário com status ativo, fechar o formulário (ou redirecionar), exibir uma mensagem de sucesso ("Usuário cadastrado com sucesso") e atualizar a listagem.
2. **Given** que o administrador está no formulário de criação de usuário e escolhe o perfil "Contador", **When** ele preencher também o CRC e o Nome do Escritório e salvar, **Then** o sistema deve gravar os dados profissionais corretamente no banco de dados.
3. **Given** que o administrador tenta cadastrar um usuário com um e-mail que já existe no banco, **When** ele submeter o formulário, **Then** o sistema deve rejeitar o envio no backend e exibir a mensagem de validação ("Este endereço de e-mail já está em uso").

---

### User Story 4 - Edição, Atualização e Exclusão de Usuários (Priority: P2)

Como Administrador, eu quero editar os dados cadastrais de um usuário existente, ativar/desativar sua conta e excluí-la de forma definitiva caso necessário.

**Why this priority**: Essencial para manutenção da base de dados, permitindo a correção de dados cadastrais, bloqueio temporário de acesso e expurgo de contas desnecessárias.

**Independent Test**:
- Selecionar um usuário na listagem, abrir a tela de edição, modificar o seu perfil ou nome, salvar e confirmar a persistência dos dados.
- Clicar no botão de exclusão de um usuário, confirmar o aviso de segurança e verificar se ele desapareceu da listagem e do banco de dados.

**Acceptance Scenarios**:

1. **Given** que o administrador escolhou um usuário para editar, **When** ele modificar os campos desejados e salvar, **Then** o sistema grava as alterações no banco de dados e atualiza a exibição em tela instantaneamente com mensagem de sucesso.
2. **Given** que o administrador clica no botão de exclusão de um usuário, **When** ele confirmar a ação na caixa de diálogo de confirmação ("Tem certeza que deseja excluir?"), **Then** o sistema remove o usuário do banco de dados e recarrega a tabela de usuários em tela.

---

### Edge Cases

- **Exclusão de Si Mesmo:** O sistema deve bloquear qualquer tentativa do administrador logado de excluir ou inativar o seu próprio usuário (para evitar que o sistema fique sem nenhum administrador ativo).
- **Mudança de Perfil (Contador para Admin):** Se o administrador editar um usuário do tipo "Contador" mudando seu perfil para "Administrador", o sistema deve remover/anular os dados de `crc` e `office_name` para manter a integridade cadastral.
- **Inativação de Usuário:** Se um usuário for inativado pelo administrador (`active = false`), a sessão ativa dele deve ser invalidada e novas tentativas de login desse usuário devem ser rejeitadas com erro ("Conta inativa").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir o botão "Controle de Usuários" na Navigation Dock apenas se o usuário logado possuir a role `admin`.
- **FR-002**: O sistema MUST impedir acessos diretos à página de gerenciamento de usuários (`/dashboard/users`) por parte de usuários deslogados ou que tenham o perfil `accountant`, redirecionando-os de volta.
- **FR-003**: O backend Laravel MUST proteger todos os endpoints de CRUD sob a rota `/api/users/*` exigindo autenticação via Sanctum e autorização restrita à role `admin`.
- **FR-004**: O sistema MUST permitir a criação de usuários com os perfis `admin` e `accountant`.
- **FR-005**: Ao cadastrar um usuário com perfil `accountant`, os campos `crc` e `office_name` MUST ser opcionais na API, mas validados caso informados.
- **FR-006**: O sistema MUST validar a unicidade do e-mail de usuários durante a criação e atualização de registros.
- **FR-007**: O sistema MUST impedir que o usuário atualmente autenticado realize a auto-exclusão ou auto-inativação.

### Key Entities *(include if feature involves data)*

- **Usuário (User)**: Representa uma pessoa com permissões de acesso ao sistema.
  - *Atributos:* Id, Nome, E-mail, Perfil (`admin` ou `accountant`), CRC (somente contador), Nome do Escritório (somente contador), Status (`active` boolean), Data de Criação.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O administrador consegue criar um novo usuário com perfil básico preenchendo o formulário em menos de 45 segundos.
- **SC-002**: 100% das requisições de API não autorizadas para o CRUD de usuários retornam código HTTP `403` (Forbidden) ou `401` (Unauthorized) no backend.
- **SC-003**: 100% dos contadores que tentam forçar o acesso à rota `/dashboard/users` são bloqueados e redirecionados no frontend em menos de 500ms.
- **SC-004**: O administrador consegue buscar um usuário específico na listagem de forma rápida aplicando filtros visuais (busca por texto de nome/email) em menos de 10 segundos.

## Assumptions

- O controle de rotas no Next.js usará a validação de sessões do NextAuth para interceptar o acesso à página de administração de usuários.
- A exclusão de usuários na base de dados será física (hard delete), visto que não há dependências transacionais no MVP atual.
- O design visual da tela de gerenciamento de usuários e dos formulários (diálogos modais) utilizará os componentes do Shadcn UI seguindo a paleta de cores verde esmeralda e o modo escuro no estilo Discord definidos na constituição.
- A Navigation Dock existente será modificada de forma segura para validar condicionalmente o perfil do usuário ativo antes de exibir o botão correspondente.
