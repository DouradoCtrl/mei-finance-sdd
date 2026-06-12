# API Contracts: Autenticação de Usuário (Laravel Sanctum)

**Feature**: [specs/001-autenticacao](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/001-autenticacao)

Este documento define os endpoints expostos pela API do Laravel para autenticação.

---

## 1. Cadastro de Usuário

*   **URL:** `/api/auth/register`
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
  "success": true,
  "message": "Usuário cadastrado com sucesso",
  "data": {
    "token": "1|sanctum_token_value_xyz...",
    "usuario": {
      "id": 1,
      "name": "João Silva MEI",
      "email": "joao@silva.com",
      "cnpj": "12345678000190",
      "created_at": "2026-06-11T00:54:21+00:00"
    }
  }
}
```

#### Erro de Validação (422 Unprocessable Entity - Padrão Global da API)

```json
{
  "success": false,
  "message": "The email has already been taken.",
  "data": {
    "email": [
      "The email has already been taken."
    ]
  }
}
```

---

## 2. Login de Usuário

*   **URL:** `/api/auth/login`
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
  "success": true,
  "message": "Logado com sucesso",
  "data": {
    "token": "2|sanctum_token_value_abc...",
    "usuario": {
      "id": 1,
      "name": "João Silva MEI",
      "email": "joao@silva.com",
      "cnpj": "12345678000190",
      "created_at": "2026-06-11T00:54:21+00:00"
    }
  }
}
```

#### Erro de Validação ou Credenciais Inválidas (422 / 401)

```json
{
  "success": false,
  "message": "E-mail ou senha incorretos.",
  "data": null
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
  "success": true,
  "message": "Token revogado e logout realizado com sucesso.",
  "data": null
}
```

#### Não Autenticado (401 Unauthorized)

```json
{
  "success": false,
  "message": "Usuário não autenticado.",
  "data": null
}
```
