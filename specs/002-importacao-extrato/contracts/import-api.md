# API Contract: Importação e Classificação de Extrato

**Feature**: [specs/002-importacao-extrato](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato)

Este documento especifica os contratos de API REST implementados no backend para suporte a importação de extratos (.ofx), gerenciamento, classificação e remoção de transações.

Todas as rotas requerem autenticação via Sanctum e usuário ativo.

---

## 1. Listar Transações (Histórico)
Recupera a lista de transações cadastradas do usuário autenticado com filtros opcionais.

- **Endpoint**: `GET /api/transactions`
- **Headers**:
  - `Authorization: Bearer {token}`
  - `Accept: application/json`
- **Query Parameters**:
  - `source` (opcional, string): Filtrar por origem (`checking_account` ou `credit_card`).
  - `classification` (opcional, string): Filtrar por classificação (`pending`, `business_pj`, `personal_pf`, `transfer`).
- **Response (200 OK - Sucesso)**:
  ```json
  {
    "success": true,
    "message": "Transações recuperadas com sucesso.",
    "data": [
      {
        "id": 1,
        "transaction_date": "2026-06-10",
        "description": "PIX RECEBIDO JOAO",
        "amount": 1500.00,
        "source": "checking_account",
        "classification": "business_pj",
        "fit_id": "10293810293"
      },
      {
        "id": 2,
        "transaction_date": "2026-06-11",
        "description": "ALUGUEL",
        "amount": -450.00,
        "source": "checking_account",
        "classification": "personal_pf",
        "fit_id": null
      }
    ]
  }
  ```

---

## 2. Processar Arquivo de Extrato (Parsing)
Reconhece e estrutura temporariamente as transações contidas em um arquivo OFX antes da persistência final. Identifica transações possivelmente duplicadas em relação às transações já salvas.

- **Endpoint**: `POST /api/transactions/parse`
- **Headers**:
  - `Authorization: Bearer {token}`
  - `Accept: application/json`
  - `Content-Type: multipart/form-data`
- **Request Body (Multipart Form-Data)**:
  - `source` (string, obrigatório): `checking_account` ou `credit_card`
  - `file` (arquivo, obrigatório): Arquivo binário de extrato (.ofx), com tamanho máximo de 5MB.
- **Response (200 OK - Sucesso)**:
  ```json
  {
    "success": true,
    "message": "Extrato processado com sucesso.",
    "data": [
      {
        "transaction_date": "2026-06-10",
        "description": "PIX RECEBIDO JOAO",
        "amount": 1500.00,
        "source": "checking_account",
        "classification": "pending",
        "fit_id": "10293810293",
        "is_duplicate": false
      },
      {
        "transaction_date": "2026-06-11",
        "description": "ALUGUEL",
        "amount": -450.00,
        "source": "checking_account",
        "classification": "pending",
        "fit_id": null,
        "is_duplicate": true
      }
    ]
  }
  ```

---

## 3. Confirmar Fechamento (Persistência em Lote)
Salva permanentemente no banco de dados as transações que foram importadas e classificadas.

- **Endpoint**: `POST /api/transactions/confirm`
- **Headers**:
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body**:
  ```json
  {
    "transactions": [
      {
        "transaction_date": "2026-06-10",
        "description": "PIX RECEBIDO JOAO",
        "amount": 1500.00,
        "source": "checking_account",
        "classification": "business_pj",
        "fit_id": "10293810293"
      },
      {
        "transaction_date": "2026-06-11",
        "description": "ALUGUEL",
        "amount": -450.00,
        "source": "checking_account",
        "classification": "personal_pf",
        "fit_id": null
      }
    ]
  }
  ```
- **Response (201 Created - Sucesso)**:
  ```json
  {
    "success": true,
    "message": "Transações salvas e conciliação efetuada com sucesso.",
    "data": null
  }
  ```

---

## 4. Reclassificar Transação Existente
Atualiza a classificação de uma transação individual que já está salva no banco de dados.

- **Endpoint**: `PATCH /api/transactions/{id}/classify`
- **Headers**:
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body**:
  ```json
  {
    "classification": "transfer"
  }
  ```
  *(Valores válidos: `business_pj`, `personal_pf`, `transfer`)*
- **Response (200 OK - Sucesso)**:
  ```json
  {
    "success": true,
    "message": "Transação reclassificada com sucesso.",
    "data": {
      "id": 1,
      "transaction_date": "2026-06-10",
      "description": "PIX RECEBIDO JOAO",
      "amount": 1500.00,
      "source": "checking_account",
      "classification": "transfer",
      "fit_id": "10293810293"
    }
  }
  ```
- **Response (404 Not Found - Erro)**:
  ```json
  {
    "success": false,
    "message": "Transação não encontrada ou acesso não autorizado.",
    "data": null
  }
  ```

---

## 5. Excluir Transação
Exclui fisicamente uma transação do banco de dados.

- **Endpoint**: `DELETE /api/transactions/{id}`
- **Headers**:
  - `Authorization: Bearer {token}`
  - `Accept: application/json`
- **Response (200 OK - Sucesso)**:
  ```json
  {
    "success": true,
    "message": "Transação excluída com sucesso.",
    "data": null
  }
  ```
- **Response (404 Not Found - Erro)**:
  ```json
  {
    "success": false,
    "message": "Transação não encontrada ou acesso não autorizado.",
    "data": null
  }
  ```
