# Research: Autenticação, Cadastro e Sessão

Este documento consolida as pesquisas técnicas, decisões arquiteturais e padrões de implementação definidos para o sistema de autenticação, cadastro e sessão do MEI Finance.

---

## 1. Integração NextAuth.js + Laravel Sanctum no BFF

### Decisão
Utilizar o **NextAuth.js (v4)** com o `CredentialsProvider` no frontend Next.js. O NextAuth gerenciará a sessão do usuário em um cookie criptografado e assinado de forma segura (`HttpOnly`). A API do Laravel usará o **Laravel Sanctum** (autenticação baseada em token clássica / Personal Access Tokens) para gerar os tokens de autenticação.

### Raciocínio (Rationale)
1. **Segurança de Tokens**: Conforme ditado pela Constituição, o token Sanctum (`auth_token`) não deve ser exposto no lado do cliente (JavaScript do navegador). Armazená-lo dentro do JWT/sessão criptografada do NextAuth (que é exposto ao cliente apenas via cookie seguro `HttpOnly`) atende perfeitamente a esse requisito.
2. **Camada BFF**: A API do Next.js (BFF Route Handler em `/api/proxy/[...path]`) interceptará as requisições das páginas Next.js, extrairá o token Sanctum do cookie de sessão e encaminhará na requisição HTTP para o Laravel com o cabeçalho `Authorization: Bearer <token>`.
3. **Simplicidade de Fluxo**: O NextAuth simplifica a validação de rotas com middlewares (`/dashboard/:path*`), o gerenciamento do tempo de expiração do cookie e a renovação da sessão.

### Alternativas Consideradas
- **Next.js com Cookie Direto do Sanctum (Stateful Cookie)**: Usar a autenticação nativa baseada em cookies do Sanctum (via SPA Authentication/CSRF Cookie). 
  - *Por que rejeitado*: Exige configurações complexas de CORS e compartilhamento de domínio de cookie de primeiro nível entre o Next.js e o Laravel, o que pode ser problemático em ambientes de produção com domínios separados e reduz a portabilidade da API. O NextAuth com BFF simplifica isso atuando como proxy.

---

## 2. BFF Proxy Route Handler (`/api/proxy/[...path]`)

### Decisão
Implementar um Route Handler genérico em `nextjs/app/api/proxy/[...path]/route.ts` que captura todas as requisições HTTP enviadas para `/api/proxy/*`, lê a sessão ativa no servidor Next.js usando `getServerSession` (ou `auth()` do NextAuth) e encaminha para a URL da API do Laravel (`LARAVEL_API_URL`) anexando o token Sanctum.

### Raciocínio (Rationale)
1. **Padronização**: Evita a criação manual de rotas duplicadas de API no Next.js para cada recurso do Laravel.
2. **Delegação de Validação**: O BFF atua apenas como um proxy transparente. Ele repassa erros de validação e de negócio do Laravel diretamente para o frontend Next.js (conforme a Constituição, seção IV, evitando dupla validação).
3. **Consistência de Respostas**: O BFF apenas repassa o JSON retornado pelo Laravel, que por sua vez segue a trait padronizada `ApiResponse` do Laravel.

---

## 3. Estrutura de Banco de Dados e Migration de Usuários

### Decisão
Como o projeto está em desenvolvimento ativo, as colunas adicionais serão inseridas diretamente na migration original de usuários: `0001_01_01_000000_create_users_table.php`.

As novas colunas são:
- `role`: string (valores válidos: `accountant`, `admin`), com valor padrão `accountant`.
- `crc`: string (registro profissional), nullable.
- `office_name`: string (nome do escritório), nullable.
- `active`: boolean, com valor padrão `true`.

### Raciocínio (Rationale)
1. Evita a criação desnecessária de múltiplas migrations de alteração de tabela em fase inicial do projeto.
2. Centraliza a definição da entidade `User` num único local.
3. Permite a sementeira limpa de dados (seeders) usando `php artisan migrate:fresh --seed`.

---

## 4. Estrutura de Rotas e Middleware de Proteção

### Decisão
- **Frontend**: Utilizar o middleware nativo do NextAuth para interceptar e proteger o caminho `/dashboard/:path*`. Caso o usuário tente acessar sem uma sessão ativa, ele será redirecionado automaticamente para `/login`.
- **Backend**: Todas as rotas que manipulam dados sensíveis ou requerem autenticação (incluindo o `/logout` e `/me`) serão protegidas pelo middleware `auth:sanctum` do Laravel.

### Raciocínio (Rationale)
1. A proteção em nível de middleware do Next.js é extremamente rápida e impede que a estrutura da página privada seja renderizada para usuários anônimos.
2. A segurança no backend (Sanctum) garante que, mesmo se o middleware do frontend for de alguma forma burlado ou configurado incorretamente, as APIs subjacentes continuarão protegidas.
