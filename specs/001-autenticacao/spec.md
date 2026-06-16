# Feature Specification: Autenticação, Cadastro e Sessão

**Feature Branch**: `001-autenticacao`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Implementar o sistema de cadastro, login e sessão do MEI Finance, suportando perfis de Contador e Administrador. Cadastro de Contador em /register. Usuário Administrador (admin@meifinance.com / admin123). Login Seguro (Unificado) em /login. Gerenciamento de Sessão e BFF (/api/proxy/[...path]). Logout e Proteção de Rotas (/dashboard/:path*)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastro Público de Contador (Priority: P1)

Como um contador interessado em utilizar a plataforma para gerenciar minhas finanças e de meus clientes, quero poder me cadastrar fornecendo minhas informações profissionais e de contato, para que eu possa criar minha conta e começar a usar o sistema.

**Why this priority**: P1. O cadastro público é a porta de entrada indispensável para a aquisição de novos usuários da plataforma (contadores).

**Independent Test**: O usuário acessa a página pública de registro, preenche o formulário com dados válidos, submete e a conta é criada no banco com status ativa e perfil (role) de contador. O e-mail utilizado passa a ser reconhecido na tela de login.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tela de cadastro pública (`/register`), **When** ele preenche Nome, E-mail (único), CRC (registro profissional), Nome do Escritório e Senha válidos e submete o formulário, **Then** a conta é criada com perfil de contador (`role` = `accountant`), marcada como ativa (`active` = `true`) e o usuário é redirecionado para a tela de login com uma mensagem de sucesso.
2. **Given** que o usuário está na tela de cadastro, **When** ele tenta submeter o formulário utilizando um e-mail que já está cadastrado no sistema, **Then** a conta não é criada, o sistema exibe um alerta informando que o e-mail já está em uso e os dados previamente preenchidos (exceto a senha) são mantidos.

---

### User Story 2 - Login Seguro e Unificado (Priority: P1)

Como um usuário cadastrado (contador ou administrador), quero poder me autenticar na plataforma informando minhas credenciais, para acessar o painel administrativo de acordo com as minhas permissões.

**Why this priority**: P1. A autenticação segura protege os dados confidenciais dos usuários e restringe o acesso ao painel apenas para pessoas autorizadas.

**Independent Test**: O usuário digita suas credenciais de login e, se válidas, entra na área restrita com a sessão ativada. Suas informações de perfil são propagadas corretamente no estado da aplicação.

**Acceptance Scenarios**:

1. **Given** que o usuário possui uma conta ativa (contador ou administrador), **When** ele informa o e-mail e senha corretos na tela de login (`/login`), **Then** a sessão é iniciada com sucesso, carregando os dados do perfil (Nome, E-mail, Role, CRC, Nome do Escritório) e o usuário é redirecionado para o painel principal (`/dashboard`).
2. **Given** que o usuário informa credenciais incorretas (e-mail ou senha inválidos), **When** ele tenta autenticar-se, **Then** a autenticação é negada, um aviso de erro amigável é exibido e o usuário permanece na tela de login.

---

### User Story 3 - Sementeira de Administrador (Priority: P2)

Como administrador global do sistema, quero ter uma conta pré-configurada no banco de dados para poder acessar a plataforma para fins de suporte, garantindo que novos administradores não possam ser criados publicamente por terceiros.

**Why this priority**: P2. Necessário para a administração inicial e suporte do sistema, mitigando o risco de segurança ao bloquear registros de administradores pela interface de cadastro padrão.

**Independent Test**: Verificar se as credenciais padrão do administrador estão acessíveis no banco após a execução das sementes de banco (seeder) e se a página de cadastro comum `/register` não oferece nenhuma opção de escolha de perfil.

**Acceptance Scenarios**:

1. **Given** que o banco de dados foi inicializado e semeado, **When** o administrador utiliza o e-mail `admin@meifinance.com` e a senha `admin123` na tela de login, **Then** ele entra com sucesso no painel administrativo e sua role é identificada como `admin` (com CRC e Nome do Escritório nulos).
2. **Given** o formulário de cadastro `/register`, **When** qualquer usuário se registra publicamente por este canal, **Then** ele é obrigatoriamente persistido como contador (`accountant`), sendo impossível obter a role `admin` de forma pública.

---

### User Story 4 - Logout e Proteção de Painel (Priority: P1)

Como um usuário autenticado, quero poder encerrar minha sessão com segurança a qualquer momento e garantir que nenhuma pessoa sem autorização consiga visualizar minhas páginas internas após eu ter saído.

**Why this priority**: P1. Fundamental para a privacidade de dados e segurança operacional, prevenindo acessos indesejados caso o dispositivo seja compartilhado.

**Independent Test**: Tentar acessar diretamente uma rota sob `/dashboard/*` sem estar autenticado e verificar o redirecionamento. Clicar no botão de logout quando logado e tentar voltar à página anterior no navegador.

**Acceptance Scenarios**:

1. **Given** que o usuário não está autenticado no sistema, **When** ele tenta acessar diretamente qualquer página protegida (por exemplo, `/dashboard`, `/dashboard/perfil`), **Then** ele é impedido de visualizar o conteúdo e imediatamente redirecionado para a página de login (`/login`).
2. **Given** que o usuário está autenticado e no painel, **When** ele clica no botão de sair (logout), **Then** as credenciais da sessão são destruídas no cliente e no servidor, e o usuário é redirecionado para `/login`, impossibilitando o acesso às telas internas via botão de retorno do navegador.

### Edge Cases

- **Conta Inativa**: Se um usuário tentar efetuar login com e-mail e senha corretos, mas o campo `active` for falso (por exemplo, conta suspensa), o acesso deve ser negado com mensagem apropriada.
- **Sessão Expirada**: Se o token de autenticação expirar no servidor enquanto o usuário estiver navegando, o próximo clique ou requisição a dados sensíveis deve revogar a sessão no cliente e redirecionar o usuário para a página de login.
- **Navegação com Dados Nulos**: O administrador logado não possui CRC nem Nome do Escritório. Os componentes do painel que exibem informações do escritório do contador devem se comportar adequadamente, ocultando esses campos ou exibindo informações de suporte genéricas ao invés de quebrar a interface.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE disponibilizar uma tela pública de cadastro em `/register`.
- **FR-002**: O cadastro de contadores DEVE exigir e validar os campos: Nome, E-mail, CRC (registro profissional), Nome do Escritório e Senha.
- **FR-003**: O sistema DEVE garantir que o E-mail fornecido no cadastro seja único na base de dados de usuários.
- **FR-004**: Ao registrar um novo contador, o sistema DEVE salvá-lo no banco com a role `accountant` e status de ativo (`active` = `true`).
- **FR-005**: O sistema DEVE impedir a criação de usuários com perfil `admin` através do cadastro público.
- **FR-006**: O sistema DEVE semear um usuário administrador padrão (`admin@meifinance.com` / `admin123`) com a role `admin` e campos CRC e Nome do Escritório definidos como nulos.
- **FR-007**: O sistema DEVE disponibilizar uma tela unificada de login em `/login` que valide as credenciais tanto de contadores quanto de administradores.
- **FR-008**: O sistema DEVE manter uma sessão segura e persistente após o login, armazenando na sessão o Nome, E-mail, Role (contador ou administrador), CRC e Nome do Escritório do usuário autenticado.
- **FR-009**: O sistema DEVE disponibilizar uma rota para expiração segura de sessão (logout) que invalide as credenciais.
- **FR-010**: O sistema DEVE proteger todas as rotas filhas sob o prefixo `/dashboard/` contra acessos de usuários não autenticados.

### Key Entities *(include if feature involves data)*

- **Usuário (User)**: Representa uma pessoa com permissão de acesso ao sistema.
  - *Atributos*:
    - **Nome**: Nome completo do usuário.
    - **E-mail**: Endereço de correio eletrônico único que serve como identificador de login.
    - **Senha**: Hash de segurança da senha do usuário.
    - **Perfil (Role)**: Tipo de conta (`accountant` ou `admin`).
    - **CRC**: Registro profissional do contador (nulo para admin).
    - **Nome do Escritório**: Nome do escritório associado ao contador (nulo para admin).
    - **Status (Active)**: Indicador de conta ativa (verdadeiro/falso).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usuários (contadores) devem ser capazes de preencher o formulário de cadastro e estar autenticados no painel principal em menos de 3 minutos.
- **SC-002**: 100% das tentativas de acesso direto a rotas protegidas sob `/dashboard` por navegadores não autenticados devem ser redirecionadas para a tela de login em menos de 1 segundo.
- **SC-003**: 100% dos registros de contadores efetuados pela interface `/register` devem ser persistidos com a role `accountant` ativa.
- **SC-004**: O logout do usuário deve invalidar a sessão imediatamente, tornando qualquer tentativa subsequente de acessar as páginas internas inválida no backend e no frontend.

## Assumptions

- Os usuários finais possuem navegadores modernos com suporte a cookies persistentes e seguros (HttpOnly).
- A unicidade do e-mail é garantida no nível do banco de dados (chave única) e validada em nível de aplicação antes da persistência.
- O CRC não possui regras rígidas de validação de formato além de ser texto não-nulo para contadores, facilitando testes com diferentes estados regionais.
- O gerenciamento de tokens usa mecanismos de rota segura no BFF Next.js (proxying) de modo que o cliente direto (navegador) nunca tenha contato direto com o token Sanctum cru em formato JavaScript legível.
