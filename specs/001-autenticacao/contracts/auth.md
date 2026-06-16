# API Contract: Autenticação e Cadastro

Este documento especifica os contratos de API entre o frontend Next.js (via BFF) e o backend Laravel. Todas as rotas de API do Laravel seguem o padrão JSON especificado na Constituição do projeto (trait `ApiResponse`).

---

## 1. Cadastro de Contador

Cria uma nova conta de contador no sistema.

- **URL**: `/api/register` (Laravel) ➔ Exposta pelo BFF em `/api/proxy/register`
- **Método**: `POST`
- **Cabeçalhos**:
  - `Content-Type: application/json`
  - `Accept: application/json`

### Corpo da Requisição (Payload)
```json
{
  "name": "João da Silva",
  "email": "joao@exemplo.com",
  "crc": "SP-123456/O",
  "office_name": "Silva Contabilidade",
  "password": "senha_segura_123"
}
```

### Resposta de Sucesso (HTTP 201 Created)
```json
{
  "success": true,
  "message": "Cadastro realizado com sucesso.",
  "data": {
    "user": {
      "id": 1,
      "name": "João da Silva",
      "email": "joao@exemplo.com",
      "role": "accountant",
      "crc": "SP-123456/O",
      "office_name": "Silva Contabilidade",
      "active": true
    }
  }
}
```

### Resposta de Erro de Validação (HTTP 422 Unprocessable Entity)
```json
{
  "success": false,
  "message": "Os dados fornecidos são inválidos.",
  "data": {
    "email": [
      "O campo email já está em uso."
    ],
    "password": [
      "O campo senha deve conter pelo menos 8 caracteres."
    ]
  }
}
```

---

## 2. Login de Usuário (Autenticação)

Valida as credenciais do usuário e retorna o token de acesso Sanctum.

- **URL**: `/api/login` (Laravel) ➔ Chamada internamente pelo NextAuth Credentials Provider
- **Método**: `POST`
- **Cabeçalhos**:
  - `Content-Type: application/json`
  - `Accept: application/json`

### Corpo da Requisição (Payload)
```json
{
  "email": "joao@exemplo.com",
  "password": "senha_segura_123"
}
```

### Resposta de Sucesso (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Autenticação realizada com sucesso.",
  "data": {
    "token": "1|sanctum_personal_access_token_hash_here",
    "user": {
      "id": 1,
      "name": "João da Silva",
      "email": "joao@exemplo.com",
      "role": "accountant",
      "crc": "SP-123456/O",
      "office_name": "Silva Contabilidade",
      "active": true
    }
  }
}
```

### Resposta de Erro de Autenticação / Conta Inativa (HTTP 401 Unauthorized)
```json
{
  "success": false,
  "message": "Credenciais inválidas ou conta desativada."
}
```

---

## 3. Logout (Encerrar Sessão)

Revoga o token de acesso atual do Sanctum.

- **URL**: `/api/logout` (Laravel) ➔ Chamada pelo BFF em `/api/proxy/logout` ao realizar signout no NextAuth
- **Método**: `POST`
- **Cabeçalhos**:
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer {token}`

### Resposta de Sucesso (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Sessão encerrada com sucesso.",
  "data": null
}
```

### Resposta de Não Autorizado (HTTP 401 Unauthorized)
```json
{
  "success": false,
  "message": "Usuário não autenticado."
}
```

---

## 4. Obter Dados do Usuário Logado (Me)

Obtém as informações do perfil do usuário atualmente autenticado.

- **URL**: `/api/me` (Laravel) ➔ Exposta pelo BFF em `/api/proxy/me`
- **Método**: `GET`
- **Cabeçalhos**:
  - `Accept: application/json`
  - `Authorization: Bearer {token}`

### Resposta de Sucesso (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Dados do usuário obtidos com sucesso.",
  "data": {
    "user": {
      "id": 1,
      "name": "João da Silva",
      "email": "joao@exemplo.com",
      "role": "accountant",
      "crc": "SP-123456/O",
      "office_name": "Silva Contabilidade",
      "active": true
    }
  }
}
```
