# API Contract: Importação e Classificação de Extrato

**Feature**: [specs/002-importacao-extrato](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato)

Este documento especifica os contratos de API REST que o backend Laravel expõe para o Next.js.

---

## 1. Processar Texto do Extrato (Parsing)
Reconhece e estrutura as linhas de texto coladas do internet banking.

- **Endpoint**: `POST /api/transactions/parse`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "raw_text": "10/06/2026 PIX RECEBIDO JOAO R$ 150,00\n11/06/2026 TAR DE CARTAO R$ -15,00"
  }
  ```
- **Response (200 OK - Sucesso)**:
  ```json
  {
    "success": true,
    "message": "Extrato processado com sucesso.",
    "data": [
      {
        "transaction_date": "2026-06-10",
        "description": "PIX RECEBIDO JOAO",
        "amount": 150.00,
        "classification": "pending",
        "is_duplicate": false
      },
      {
        "transaction_date": "2026-06-11",
        "description": "TAR DE CARTAO",
        "amount": -15.00,
        "classification": "pending",
        "is_duplicate": false
      }
    ]
  }
  ```

---

## 2. Confirmar Fechamento (Persistência)
Salva permanentemente as transações classificadas no banco de dados.

- **Endpoint**: `POST /api/transactions/confirm`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "transactions": [
      {
        "transaction_date": "2026-06-10",
        "description": "PIX RECEBIDO JOAO",
        "amount": 150.00,
        "classification": "business_pj"
      },
      {
        "transaction_date": "2026-06-11",
        "description": "TAR DE CARTAO",
        "amount": -15.00,
        "classification": "business_pj"
      }
    ]
  }
  ```
- **Response (201 Created - Sucesso)**:
  ```json
  {
    "success": true,
    "message": "Transações persistidas com sucesso.",
    "data": null
  }
  ```
