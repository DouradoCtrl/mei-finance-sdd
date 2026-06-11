# Data Model: Importação de Extrato e Classificação PF/PJ

**Feature**: [specs/002-importacao-extrato](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato)

Este documento descreve as tabelas do banco de dados (PostgreSQL) necessárias para a persistência das transações financeiras.

## Tabela: `transactions`

Armazena os registros individuais de transações extraídas de extratos bancários.

| Campo | Tipo Laravel | Restrições | Descrição |
|-------|--------------|------------|-----------|
| `id` | bigint | PRIMARY KEY (BIGSERIAL) | Identificador único da transação |
| `user_id` | foreignId | NOT NULL, FOREIGN KEY (`users`.`id`), CASCADE | Usuário proprietário da transação |
| `transaction_date` | date | NOT NULL | Data em que a transação ocorreu |
| `description` | string | NOT NULL | Descrição da transação (conforme extrato) |
| `amount` | decimal (15, 2) | NOT NULL | Valor monetário (positivo p/ receitas, negativo p/ despesas) |
| `classification` | string | NOT NULL, DEFAULT 'pending' | Classificação do item (`pending`, `business_pj`, `personal_pf`) |
| `created_at` | timestamp | NULL | Data de criação do registro |
| `updated_at` | timestamp | NULL | Data da última atualização |

### Índices:
- `user_id`: para busca rápida e isolamento de dados por usuário.
- `transaction_date`: para agrupamento mensal rápido na consolidação do Lucro Líquido.
- Índice composto `unique_transaction_idx` (`user_id`, `transaction_date`, `description`, `amount`): para detecção e prevenção de duplicidades nas importações.

---

## Regras de Validação (Laravel Requests)

### 1. Parsing (`POST /api/transactions/parse`):
- `raw_text`: obrigatório, string, mínimo 5 caracteres.

### 2. Confirmação (`POST /api/transactions/confirm`):
- `transactions`: obrigatório, array.
- `transactions.*.transaction_date`: obrigatório, formato `YYYY-MM-DD` ou `date`.
- `transactions.*.description`: obrigatório, string.
- `transactions.*.amount`: obrigatório, numérico.
- `transactions.*.classification`: obrigatório, string, deve pertencer a [`pending`, `business_pj`, `personal_pf`].
