# API Contracts: Controle de Usuários (Administrador)

Este documento define as rotas da API expostas pelo Laravel para o CRUD de usuários e os formatos das respostas tratadas pelo Next.js (BFF).

---

## 1. Listagem de Usuários

*   **Endpoint:** `GET /api/v1/users`
*   **Autenticação:** Bearer Token (Sanctum) + Role `admin`
*   **Parâmetros de Query (Opcional):**
    *   `search`: String de busca para filtrar por nome ou e-mail.
    *   `page`: Inteiro para controle de paginação.

### Resposta de Sucesso (HTTP 200)

```json
{
  "success": true,
  "message": "Usuários listados com sucesso.",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Administrador Principal",
        "email": "admin@meifinance.com",
        "role": "admin",
        "crc": null,
        "office_name": null,
        "active": true,
        "created_at": "2026-06-10T15:30:00.000000Z"
      },
      {
        "id": 2,
        "name": "Contador João Silva",
        "email": "joao@contabilidade.com",
        "role": "accountant",
        "crc": "RS-123456/O",
        "office_name": "Silva Contadores Associados",
        "active": true,
        "created_at": "2026-06-16T18:45:00.000000Z"
      }
    ],
    "links": {
      "first": "http://localhost:8001/api/v1/users?page=1",
      "last": "http://localhost:8001/api/v1/users?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "from": 1,
      "last_page": 1,
      "per_page": 15,
      "to": 2,
      "total": 2
    }
  }
}
```

---

## 2. Criação de Usuário

*   **Endpoint:** `POST /api/v1/users`
*   **Autenticação:** Bearer Token (Sanctum) + Role `admin`

### Corpo da Requisição (JSON)

*   **Para Administrador:**
    ```json
    {
      "name": "Novo Admin",
      "email": "novo.admin@meifinance.com",
      "password": "senhaSegura123",
      "role": "admin"
    }
    ```
*   **Para Contador:**
    ```json
    {
      "name": "Novo Contador",
      "email": "novo.contador@meifinance.com",
      "password": "senhaSegura123",
      "role": "accountant",
      "crc": "SP-987654/O",
      "office_name": "SP Contabilidade"
    }
    ```

### Resposta de Sucesso (HTTP 201)

```json
{
  "success": true,
  "message": "Usuário criado com sucesso.",
  "data": {
    "id": 3,
    "name": "Novo Contador",
    "email": "novo.contador@meifinance.com",
    "role": "accountant",
    "crc": "SP-987654/O",
    "office_name": "SP Contabilidade",
    "active": true,
    "created_at": "2026-06-16T21:04:00.000000Z"
  }
}
```

---

## 3. Atualização de Usuário

*   **Endpoint:** `PUT /api/v1/users/{id}`
*   **Autenticação:** Bearer Token (Sanctum) + Role `admin`

### Corpo da Requisição (JSON)

```json
{
  "name": "Novo Contador Alterado",
  "email": "contador.alterado@meifinance.com",
  "role": "accountant",
  "crc": "SP-987654/O",
  "office_name": "SP Contabilidade Alterado",
  "active": false
}
```

### Resposta de Sucesso (HTTP 200)

```json
{
  "success": true,
  "message": "Usuário atualizado com sucesso.",
  "data": {
    "id": 3,
    "name": "Novo Contador Alterado",
    "email": "contador.alterado@meifinance.com",
    "role": "accountant",
    "crc": "SP-987654/O",
    "office_name": "SP Contabilidade Alterado",
    "active": false,
    "created_at": "2026-06-16T21:04:00.000000Z"
  }
}
```

---

## 4. Exclusão de Usuário

*   **Endpoint:** `DELETE /api/v1/users/{id}`
*   **Autenticação:** Bearer Token (Sanctum) + Role `admin`

### Resposta de Sucesso (HTTP 200)

```json
{
  "success": true,
  "message": "Usuário excluído com sucesso."
}
```

### Resposta de Erro de Validação (HTTP 422 - Exemplo Auto-Exclusão)

```json
{
  "success": false,
  "message": "Não é permitido excluir o seu próprio usuário logado."
}
```
