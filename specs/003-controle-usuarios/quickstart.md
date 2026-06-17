# Quickstart Guide: Controle de Usuários (Administrador)

Este guia fornece as etapas para validar a implementação da funcionalidade de controle de usuários.

---

## 1. Preparação do Ambiente

Certifique-se de que os seguintes pré-requisitos estão atendidos:

1.  **Banco de Dados Iniciado:** `docker compose up -d`
2.  **Servidor Laravel Executando (Porta 8001):** `php artisan serve --port=8001` no diretório `laravel/`.
3.  **Servidor Next.js Executando (Porta 3000):** `npm run dev` no diretório `nextjs/`.
4.  **Banco Seedado:** Rode o comando `php artisan db:seed` ou `php artisan migrate:fresh --seed` no diretório `laravel/` para criar o usuário administrador padrão (`admin@meifinance.com` / `admin123`).

---

## 2. Cenários de Validação Manual

### Cenário 1: Restrição de Acesso (Contador Comum)
1.  Acesse `http://localhost:3000/login`.
2.  Faça login com uma conta de contador (ex: `contador@teste.com` / `senha12345`).
3.  Verifique a Navigation Dock inferior: o ícone/botão de "Controle de Usuários" **não** deve estar visível.
4.  No navegador, tente digitar diretamente a URL: `http://localhost:3000/dashboard/users`.
5.  *Resultado esperado:* O Next.js deve redirecioná-lo instantaneamente de volta para `/dashboard` com um toast de erro ("Acesso não autorizado").

### Cenário 2: Acesso do Administrador e Criação de Contador
1.  Faça logout e logue com a conta do administrador padrão (`admin@meifinance.com` / `admin123`).
2.  Verifique a Navigation Dock: o botão de "Controle de Usuários" deve estar visível.
3.  Clique nele. O navegador deve abrir `/dashboard/users` mostrando a tabela de usuários com os registros existentes.
4.  Clique no botão "Novo Usuário".
5.  No modal aberto, preencha:
    - **Nome:** `Contador Valido`
    - **E-mail:** `valido@contador.com`
    - **Perfil:** `Contador (accountant)`
    - **CRC:** `RS-123456/O`
    - **Nome do Escritório:** `Escritório Valido`
    - **Senha:** `senhaValida123`
6.  Clique em "Salvar".
7.  *Resultado esperado:* Modal fecha, mensagem toast de sucesso é exibida e o novo usuário "Contador Valido" é listado na tabela.

### Cenário 3: Criação de Novo Administrador e Edição de Perfil
1.  Clique em "Novo Usuário".
2.  Preencha com:
    - **Nome:** `Outro Admin`
    - **E-mail:** `outro.admin@meifinance.com`
    - **Perfil:** `Administrador (admin)`
    - **Senha:** `senhaAdmin123`
3.  Clique em "Salvar" e verifique a inserção correta na lista (sem CRC e escritório).
4.  Selecione o usuário "Contador Valido" recém-criado e clique no botão de edição (lápis).
5.  Altere seu perfil para `Administrador (admin)` e mude seu nome para `Contador Promovido`.
6.  Clique em "Salvar".
7.  *Resultado esperado:* O perfil muda para `admin` na tabela, e no banco de dados os campos `crc` e `office_name` deste usuário são definidos como `null` automaticamente.

### Cenário 4: Bloqueio de Auto-Exclusão e Exclusão Efetiva
1.  Na listagem, encontre o registro correspondente ao seu usuário de admin logado (`admin@meifinance.com`).
2.  Tente clicar no ícone de lixeira (excluir).
3.  *Resultado esperado:* O sistema deve bloquear a ação ou exibir uma mensagem de erro ("Não é permitido excluir o próprio usuário logado").
4.  Encontre o registro "Outro Admin" criado no Cenário 3.
5.  Clique no ícone de exclusão e confirme a operação no diálogo de confirmação.
6.  *Resultado esperado:* O registro desaparece da tabela e é deletado fisicamente da tabela `users` do banco de dados.

---

## 3. Testes Automatizados

### Backend (Laravel/Pest)
Para rodar os testes unitários e de integração de rotas e Form Requests no backend:
```bash
cd laravel
./vendor/bin/pest tests/Feature/UserManagementTest.php
```

### Frontend (Next.js/Vitest)
Para rodar os testes de renderização de componentes e lógica de exibição no frontend:
```bash
cd nextjs
npm run test features/users
```
