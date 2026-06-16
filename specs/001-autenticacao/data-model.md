# Data Model: Autenticação, Cadastro e Sessão

Este documento descreve o modelo de dados para a entidade `User` e as regras de validação aplicadas no banco de dados e no backend Laravel.

---

## Entidade: Usuário (User)

Representa qualquer pessoa cadastrada com permissões de acesso ao sistema (seja Contador ou Administrador).

### Estrutura da Tabela: `users`

| Coluna | Tipo SQL | Chave | Nulidade | Padrão | Descrição |
|--------|----------|-------|----------|--------|-----------|
| `id` | `BIGINT` | PK | `NOT NULL` | Auto-increment | Identificador único do usuário. |
| `name` | `VARCHAR(255)` | | `NOT NULL` | | Nome completo do usuário. |
| `email` | `VARCHAR(255)` | UK | `NOT NULL` | | Endereço de e-mail exclusivo de acesso. |
| `password` | `VARCHAR(255)` | | `NOT NULL` | | Hash da senha (armazenado com criptografia bcrypt). |
| `role` | `VARCHAR(50)` | | `NOT NULL` | `'accountant'` | Perfil do usuário: `'accountant'` ou `'admin'`. |
| `crc` | `VARCHAR(50)` | | `NULL` | | Registro do CRC (obrigatório apenas para `accountant`). |
| `office_name` | `VARCHAR(255)` | | `NULL` | | Nome do escritório (obrigatório apenas para `accountant`). |
| `active` | `BOOLEAN` | | `NOT NULL` | `TRUE` | Sinaliza se a conta está ativa e com permissão de login. |
| `email_verified_at`| `TIMESTAMP` | | `NULL` | | Data/hora de verificação do e-mail (opcional no MVP). |
| `remember_token` | `VARCHAR(100)`| | `NULL` | | Token de lembrete de sessão do Laravel. |
| `created_at` | `TIMESTAMP` | | `NULL` | | Data/hora de criação do registro. |
| `updated_at` | `TIMESTAMP` | | `NULL` | | Data/hora da última atualização do registro. |

### Relacionamentos
Nesta etapa de autenticação, a entidade `User` não possui relacionamentos adicionais com outras tabelas.

---

## Regras de Validação e Negócio (Laravel Form Requests)

### 1. Cadastro de Contador (`RegisterRequest`)
Estes campos são obrigatórios para a criação de novos contadores na rota pública.

- **`name`**: `required | string | min:3 | max:255`
- **`email`**: `required | string | email | max:255 | unique:users,email`
- **`crc`**: `required | string | min:4 | max:50`
- **`office_name`**: `required | string | min:2 | max:255`
- **`password`**: `required | string | min:8`

*Nota: O backend deve ignorar qualquer tentativa de enviar uma `role` na requisição pública de registro, definindo-a explicitamente como `accountant` e `active` como `true`.*

### 2. Autenticação Unificada (`LoginRequest`)
Utilizada para autenticar tanto contadores quanto administradores.

- **`email`**: `required | string | email`
- **`password`**: `required | string`

### 3. Regra de Negócio: Login de Usuário Inativo
- Se as credenciais (`email` e `password`) forem válidas, mas a coluna `active` for `false`, a autenticação deve ser abortada retornando um erro HTTP 401 informando que a conta está desativada.
