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
  - `start_date` (opcional, string): Data inicial do filtro no formato `YYYY-MM-DD`.
  - `end_date` (opcional, string): Data final do filtro no formato `YYYY-MM-DD`.
  - `bank_name` (opcional, string): Filtrar por instituição bancária específica (ex: "Nubank").
  - `search` (opcional, string): Buscar termo na descrição ou no apelido da transação.
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
        "alias": "Faturamento Consultoria",
        "amount": 1500.00,
        "source": "checking_account",
        "bank_name": "Nubank",
        "classification": "business_pj",
        "fit_id": "10293810293"
      },
      {
        "id": 2,
        "transaction_date": "2026-06-11",
        "description": "SABESP 482937",
        "alias": "Conta de Água",
        "amount": -450.00,
        "source": "checking_account",
        "bank_name": "Itaú",
        "classification": "personal_pf",
        "fit_id": null
      }
    ]
  }
  ```

---

## 2. Processar Arquivo de Extrato (Parsing)
Reconhece e estrutura temporariamente as transações contidas em um arquivo OFX antes da persistência final, identificando o banco emissor automaticamente.

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
        "alias": null,
        "amount": 1500.00,
        "source": "checking_account",
        "bank_name": "Nubank",
        "classification": "pending",
        "fit_id": "10293810293",
        "is_duplicate": false
      },
      {
        "transaction_date": "2026-06-11",
        "description": "SABESP 482937",
        "alias": null,
        "amount": -450.00,
        "source": "checking_account",
        "bank_name": "Itaú",
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
        "alias": "Faturamento Consultoria",
        "amount": 1500.00,
        "source": "checking_account",
        "bank_name": "Nubank",
        "classification": "business_pj",
        "fit_id": "10293810293"
      },
      {
        "transaction_date": "2026-06-11",
        "description": "SABESP 482937",
        "alias": "Conta de Água",
        "amount": -450.00,
        "source": "checking_account",
        "bank_name": "Itaú",
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
      "alias": "Faturamento Consultoria",
      "amount": 1500.00,
      "source": "checking_account",
      "bank_name": "Nubank",
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

---

## 6. Apelidar Transação Existente (Alias)
Adiciona ou atualiza o apelido amigável definido pelo usuário para uma transação individual.

- **Endpoint**: `PATCH /api/transactions/{id}/alias`
- **Headers**:
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body**:
  ```json
  {
    "alias": "Conta de Água"
  }
  ```
- **Response (200 OK - Sucesso)**:
  ```json
  {
    "success": true,
    "message": "Apelido da transação atualizado com sucesso.",
    "data": {
      "id": 2,
      "transaction_date": "2026-06-11",
      "description": "SABESP 482937",
      "alias": "Conta de Água",
      "amount": -450.00,
      "source": "checking_account",
      "bank_name": "Itaú",
      "classification": "personal_pf",
      "fit_id": null
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
