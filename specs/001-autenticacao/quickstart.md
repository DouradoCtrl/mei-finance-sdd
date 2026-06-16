# Quickstart Guide: Autenticação, Cadastro e Sessão

Este guia fornece os passos práticos para preparar o ambiente de desenvolvimento, executar a aplicação e validar a funcionalidade de autenticação, cadastro e controle de sessão ponta a ponta.

---

## Pré-requisitos

1. **Docker** e **Docker Compose** instalados e em execução.
2. **PHP 8.3+** e **Composer** instalados localmente (ou via container).
3. **Node.js 18+** e **NPM** instalados localmente.

---

## 1. Configuração do Ambiente

### 1.1. Inicializar o Banco de Dados (Docker)
Na raiz do projeto, execute o PostgreSQL no container mapeado na porta `5433`:
```bash
docker compose up -d
```

### 1.2. Configuração e Inicialização do Backend (Laravel)
Navegue até o diretório `laravel/`, instale as dependências, configure o ambiente e execute as migrations/seeders:
```bash
cd laravel
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --port=8000
```
*Nota: A sementeira (`--seed`) criará automaticamente o usuário administrador padrão (`admin@meifinance.com` / `admin123`).*

### 1.3. Configuração e Inicialização do Frontend (Next.js)
Navegue até o diretório `nextjs/`, instale as dependências e inicie o servidor de desenvolvimento:
```bash
cd ../nextjs
cp .env.example .env
npm install
npm run dev
```

---

## 2. Cenários de Validação Manual

### Cenário 1: Fluxo de Cadastro de Contador (Público)
1. Abra o navegador e acesse a URL da página pública de cadastro: `http://localhost:3000/register`.
2. Preencha os campos com dados de teste válidos:
   - **Nome**: `Contador de Teste`
   - **E-mail**: `contador@teste.com`
   - **CRC**: `RS-999999/O`
   - **Nome do Escritório**: `Escritório RS Contábil`
   - **Senha**: `senha12345`
3. Submeta o formulário. O sistema deve registrar a conta no banco, exibir um alerta de sucesso e redirecioná-lo para `http://localhost:3000/login`.
4. *Validação no Banco*: O registro correspondente na tabela `users` deve conter `role = 'accountant'` e `active = true`.

### Cenário 2: Login Unificado (Contador e Administrador)
1. Acesse `http://localhost:3000/login`.
2. **Teste com Contador**: Insira `contador@teste.com` e a senha `senha12345`.
   - *Resultado esperado*: Login bem-sucedido, redirecionamento para `http://localhost:3000/dashboard`, e o cabeçalho deve exibir o Nome e o Escritório do contador.
3. **Teste com Administrador**: Faça logout, retorne a `/login` e insira as credenciais semeadas `admin@meifinance.com` e `admin123`.
   - *Resultado esperado*: Login bem-sucedido, redirecionamento para `/dashboard`, e o cabeçalho não deve quebrar ou exibir dados de escritório vazios.

### Cenário 3: Proteção de Rota do Painel (Dashboard)
1. Estando deslogado, tente acessar diretamente: `http://localhost:3000/dashboard` ou `http://localhost:3000/dashboard/qualquer-subrota`.
2. *Resultado esperado*: O Next.js deve barrar o acesso antes de renderizar a página e redirecionar o navegador de forma instantânea de volta para `http://localhost:3000/login`.

### Cenário 4: Encerramento de Sessão (Logout)
1. Estando logado no dashboard, clique no botão de "Sair" (Logout).
2. *Resultado esperado*: O usuário é desconectado no NextAuth (frontend) e o token Sanctum correspondente é revogado no banco do Laravel (backend). O navegador é redirecionado para `/login`. Pressionar o botão "voltar" do navegador não deve recarregar os dados do dashboard.

---

## 3. Execução dos Testes Automatizados

### Backend (Pest PHP)
Para rodar os testes unitários e de integração no backend:
```bash
cd laravel
./vendor/bin/pest
```

### Frontend (Vitest / Jest)
Para executar os testes do frontend:
```bash
cd nextjs
npm run test
```
