# MEI Finance

O MEI Finance é um sistema simplificado de controle financeiro projetado especificamente para o Microempreendedor Individual (MEI) brasileiro. Seu foco principal é resolver a dor de separar gastos pessoais (Pessoa Física - PF) de gastos profissionais (Pessoa Jurídica - PJ).

Este projeto foi desenvolvido utilizando a metodologia **Spec-Driven Development (SDD)** com o framework **spec-kit**.

---

## 🛠️ Tecnologias Utilizadas

*   **Backend:** PHP 8.5+ (Laravel 11+), Laravel Sanctum (Tokens de autenticação de API), PostgreSQL 16 (Banco de dados rodando via Docker).
*   **Frontend:** React (Next.js 14+), TypeScript, Tailwind CSS v4.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
*   **Node.js** v20+ e **npm** instalados.
*   **PHP** v8.2+ e **Composer** instalados (ou Laravel Herd/Herd Lite).
*   **Docker** e **Docker Compose** instalados.

---

### Passo 1: Configurar e Executar o Backend (Laravel)

1.  Inicie o banco de dados PostgreSQL 16 via Docker Compose (na raiz do projeto):
    ```bash
    docker compose up -d
    ```
2.  Acesse o diretório do backend:
    ```bash
    cd backend
    ```
3.  Instale as dependências:
    ```bash
    composer install
    ```
4.  Crie o arquivo de configuração `.env` copiando o exemplo:
    ```bash
    cp .env.example .env
    ```
    *(A conexão padrão já estará apontada para o PostgreSQL local do Docker)*
5.  Rode as migrations de banco para criar as tabelas de usuários, sessões e tokens Sanctum:
    ```bash
    php artisan migrate
    ```
6.  Inicie o servidor local da API do Laravel:
    ```bash
    php artisan serve
    ```
    *O backend estará rodando em `http://127.0.0.1:8000`.*

---

### Passo 2: Configurar e Executar o Frontend (Next.js)

1.  Abra um novo terminal e acesse o diretório do frontend:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Execute o servidor Next.js em desenvolvimento:
    ```bash
    npm run dev
    ```
    *O frontend estará rodando em `http://localhost:3000`.*

---

## 📖 Estrutura de Especificação (SDD)

Toda a documentação deste módulo, incluindo especificações de negócio, planos técnicos e checklists de teste, está disponível em:
*   [specs/001-autenticacao/spec.md](specs/001-autenticacao/spec.md)
*   [specs/001-autenticacao/plan.md](specs/001-autenticacao/plan.md)
*   [specs/001-autenticacao/tasks.md](specs/001-autenticacao/tasks.md)
