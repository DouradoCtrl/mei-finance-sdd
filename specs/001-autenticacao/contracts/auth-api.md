# API Contracts: Autenticação de Usuário (Laravel Sanctum)

**Feature**: [specs/001-autenticacao](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/001-autenticacao)

Este documento define os endpoints expostos pela API do Laravel para autenticação.

---

## 1. Cadastro de Usuário

*   **URL:** `/api/register`
*   **Método:** `POST`
*   **Headers:**
    *   `Accept: application/json`
    *   `Content-Type: application/json`

### Request Body

```json
{
  "name": "João Silva MEI",
  "email": "joao@silva.com",
  "password": "senhaSegura123",
  "cnpj": "12345678000190" // opcional
}
```

### Respostas

#### Sucesso (201 Created)

```json
{
  "sucesso": true,
  "mensagem": "Usuário cadastrado com sucesso",
  "token": "1|sanctum_token_value_xyz...",
  "usuario": {
    "id": 1,
    "name": "João Silva MEI",
    "email": "joao@silva.com",
    "cnpj": "12345678000190"
  }
}
```

#### Erro de Validação (422 Unprocessable Entity - Padrão Laravel)

```json
{
  "message": "The email has already been taken. (and/or other errors)",
  "errors": {
    "email": [
      "The email has already been taken."
    ],
    "password": [
      "The password field must be at least 6 characters."
    ]
  }
}
```

---

## 2. Login de Usuário

*   **URL:** `/api/login`
*   **Método:** `POST`
*   **Headers:**
    *   `Accept: application/json`
    *   `Content-Type: application/json`

### Request Body

```json
{
  "email": "joao@silva.com",
  "password": "senhaSegura123"
}
```

### Respostas

#### Sucesso (200 OK)

```json
{
  "sucesso": true,
  "token": "2|sanctum_token_value_abc...",
  "usuario": {
    "id": 1,
    "name": "João Silva MEI",
    "email": "joao@silva.com",
    "cnpj": "12345678000190"
  }
}
```

#### Erro de Validação ou Credenciais Inválidas (422 / 401)

```json
{
  "sucesso": false,
  "erro": "E-mail ou senha incorretos."
}
```

---

## 3. Logout de Usuário (Rota Protegida)

Revoga o token atual enviado na requisição.

*   **URL:** `/api/logout`
*   **Método:** `POST`
*   **Headers:**
    *   `Accept: application/json`
    *   `Authorization: Bearer {token}`

### Respostas

#### Sucesso (200 OK)

```json
{
  "sucesso": true,
  "mensagem": "Token revogado e logout realizado com sucesso."
}
```

#### Não Autenticado (401 Unauthorized)

```json
{
  "message": "Unauthenticated."
}
```
