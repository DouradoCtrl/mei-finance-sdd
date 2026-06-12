# Data Model: Importação de Extrato e Classificação PF/PJ

**Feature**: [specs/002-importacao-extrato](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato)

Este documento descreve as tabelas do banco de dados (PostgreSQL) preparadas para suportar importações de Conta Corrente e Cartão de Crédito de múltiplos bancos.

## Tabela: `transactions`

Armazena os registros individuais de transações extraídas de extratos bancários de Conta Corrente e Faturas de Cartão de Crédito.

| Campo | Tipo Laravel | Restrições | Descrição |
|-------|--------------|------------|-----------|
| `id` | bigint | PRIMARY KEY (BIGSERIAL) | Identificador único |
| `user_id` | foreignId | NOT NULL, FOREIGN KEY (`users`.`id`), CASCADE | Usuário proprietário |
| `transaction_date` | date | NOT NULL | Data em que a transação ocorreu |
| `description` | string | NOT NULL | Descrição da transação |
| `alias` | string | NULL | Apelido amigável definido pelo usuário |
| `amount` | decimal (15, 2) | NOT NULL | Valor monetário (positivo p/ receitas, negativo p/ despesas) |
| `source` | string | NOT NULL | Origem do registro: `checking_account` ou `credit_card` |
| `bank_name` | string | NULL | Nome da instituição financeira / banco extraído do OFX |
| `classification` | string | NOT NULL, DEFAULT 'pending' | Classificação do item (`pending`, `business_pj`, `personal_pf`, `transfer`) |
| `fit_id` | string | NULL | ID único fornecido no arquivo OFX (FITID) para evitar duplicidades |
| `created_at` | timestamp | NULL | Data de criação do registro |
| `updated_at` | timestamp | NULL | Data de última atualização |

### Índices:
- `user_id`: para busca rápida e isolamento de dados por usuário.
- `fit_id` (Index Único por Usuário): garante que o mesmo FITID do arquivo OFX nunca seja importado duas vezes para o mesmo usuário.

---

## Regras de Validação (Laravel Requests)

### 1. Parsing (`POST /api/transactions/parse`):
- `source`: obrigatório, string, valor deve ser `checking_account` ou `credit_card`.
- `file`: obrigatório, arquivo `.ofx` válido (tamanho máx: 5MB).

### 2. Confirmação (`POST /api/transactions/confirm`):
- `transactions`: obrigatório, array.
- `transactions.*.transaction_date`: obrigatório, formato `YYYY-MM-DD` ou `date`.
- `transactions.*.description`: obrigatório, string.
- `transactions.*.amount`: obrigatório, numérico.
- `transactions.*.source`: obrigatório, string, deve ser `checking_account` ou `credit_card`.
- `transactions.*.classification`: obrigatório, string, deve pertencer a [`pending`, `business_pj`, `personal_pf`, `transfer`].
- `transactions.*.fit_id`: opcional, string.
- `transactions.*.bank_name`: opcional, string, nullable.
- `transactions.*.alias`: opcional, string, nullable.

### 3. Apelido (`PATCH /api/transactions/{id}/alias`):
- `alias`: opcional, string, max 255, nullable.
