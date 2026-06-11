# API Contract: Importação e Classificação de Extrato

**Feature**: [specs/002-importacao-extrato](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato)

Este documento especifica os contratos de API REST atualizados para suportar múltiplos formatos (OFX/Texto) e fontes (Conta Corrente/Cartão).

---

## 1. Processar Texto ou Arquivo (Parsing)
Reconhece e estrutura as transações enviadas.

- **Endpoint**: `POST /api/transactions/parse`
- **Headers**:
  - `Authorization: Bearer {token}`
  - *(Se format = ofx, enviar como Multipart Form Data. Se format = text, pode ser Application/JSON)*
- **Request Body (JSON - para formato Texto)**:
  ```json
  {
    "source": "checking_account",
    "format": "text",
    "raw_text": "10/06/2026 PIX RECEBIDO JOAO R$ 1500,00\n11/06/2026 ALUGUEL R$ -450,00"
  }
  ```
- **Request Body (Multipart Form-Data - para formato OFX)**:
  - `source`: "credit_card"
  - `format`: "ofx"
  - `file`: [Arquivo binário .ofx]

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
        "classification": "business_pj",
        "fit_id": null
      },
      {
        "transaction_date": "2026-06-12",
        "description": "COMPRA SUPERMERCADO (CARTAO)",
        "amount": -200.00,
        "source": "credit_card",
        "classification": "personal_pf",
        "fit_id": "55583921"
      },
      {
        "transaction_date": "2026-06-15",
        "description": "PAGAMENTO FATURA CARTAO NUBANK",
        "amount": -1500.00,
        "source": "checking_account",
        "classification": "transfer",
        "fit_id": "9998822"
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
