# Quickstart Guide: Validando a Autenticação (Laravel Sanctum + Next.js)

**Feature**: [specs/001-autenticacao](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/001-autenticacao)

Instruções para executar o Backend (Laravel) e o Frontend (Next.js) para validação local da autenticação.

## 🚀 Como Executar

### 1. Backend (Laravel API)

1.  Iniciar o banco de dados PostgreSQL via Docker Compose (na raiz do projeto):
    ```bash
    docker compose up -d
    ```
2.  Navegar até a pasta do backend:
    ```bash
    cd backend
    ```
3.  Instalar dependências do PHP com Composer:
    ```bash
    composer install
    ```
4.  Configurar o arquivo de ambiente:
    ```bash
    cp .env.example .env
    ```
    *(Garantir que a conexão PostgreSQL está configurada no seu `.env` conforme os defaults)*
5.  Rodar as migrations (criar tabelas de usuários e do Sanctum):
    ```bash
    php artisan migrate
    ```
6.  Iniciar o servidor local do Laravel:
    ```bash
    php artisan serve
    ```
    *O backend estará acessível na porta 8000: `http://127.0.0.1:8000`.*

### 2. Frontend (Next.js App)

1.  Navegar até a pasta do frontend:
    ```bash
    cd frontend
    ```
2.  Instalar dependências de Node.js:
    ```bash
    npm install
    ```
3.  Iniciar o servidor Next.js em desenvolvimento:
    ```bash
    npm run dev
    ```
    *O frontend estará acessível na porta 3000: `http://localhost:3000`.*

---

## 🧪 Roteiro de Testes Manuais

### Cenário 1: Cadastro
1.  Abra o navegador em `http://localhost:3000/register` (ou página de cadastro equivalente no Next.js).
2.  Preencha Nome, E-mail, Senha (mínimo 6 dígitos) e clique em "Criar Conta".
3.  **Esperado:** O cadastro chama `POST http://127.0.0.1:8000/api/register`, o usuário é cadastrado, o token é retornado, salvo localmente (ex: cookies ou localStorage) e redireciona para a Dashboard.

### Cenário 2: Login com Sucesso
1.  Acesse `http://localhost:3000/login`.
2.  Insira o e-mail cadastrado e a senha correta, depois clique em "Entrar".
3.  **Esperado:** A chamada para `POST http://127.0.0.1:8000/api/login` retorna 200 OK com o token. O Next.js salva o token e exibe a Dashboard.

### Cenário 3: Logout
1.  Na Dashboard, clique em "Sair".
2.  **Esperado:** O frontend faz uma chamada autenticada para `POST http://127.0.0.1:8000/api/logout` com o cabeçalho `Authorization: Bearer {token}`. O Laravel revoga o token no banco. O Next.js limpa o token local e redireciona para a página de login.
