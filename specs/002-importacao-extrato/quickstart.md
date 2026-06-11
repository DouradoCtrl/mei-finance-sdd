# Quickstart Guide: Validando a Importação e Classificação de Extrato (Multibancos e Cartão)

**Feature**: [specs/002-importacao-extrato](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato)

Este guia apresenta o roteiro de validação local para importações de múltiplos formatos (OFX e Texto) e conciliação de faturas de cartão de crédito.

---

## 🚀 Como Executar

### 1. Iniciar os Servidores
- Certifique-se de que o backend Laravel está rodando (`php artisan serve --port=8085`).
- Certifique-se de que o frontend Next.js está rodando (`npm run dev` na porta 3000).

---

## 🧪 Roteiro de Testes Manuais

### Cenário 1: Importação de Conta Corrente via Arquivo OFX
1.  Acesse a Dashboard e clique em **Importar Extrato** (rota `/dashboard/importar`).
2.  No formulário de importação, configure:
    - **Origem**: `Conta Corrente`
    - **Formato**: `OFX (Arquivo)`
3.  Selecione um arquivo `.ofx` de teste do seu computador (pode baixar um extrato real Nubank/BB em OFX ou criar um arquivo de teste rápido com extensão `.ofx`).
4.  Clique em **Processar Extrato**.
5.  **Esperado**: O backend parseia o XML/SGML do OFX, identifica todas as transações perfeitamente (data, descrição, valor exato e o `fit_id`) e as lista na tabela.

### Cenário 2: Importação de Fatura de Cartão de Crédito e Conciliação
1.  No mesmo painel de importação, mude as opções para:
    - **Origem**: `Cartão de Crédito`
    - **Formato**: `Texto Bruto (Colagem)`
2.  Cole um bloco de texto simulando compras no cartão:
    ```text
    10/06/2026 AWS Cloud Services R$ -300,00
    11/06/2026 Restaurante Almoço R$ -120,00
    12/06/2026 Uber Viagem R$ -30,00
    ```
3.  Clique em **Processar Extrato**.
4.  Classifique as compras:
    - `AWS Cloud Services` -> Clique em **PJ (Negócio)**
    - `Restaurante Almoço` -> Clique em **PJ (Negócio)**
    - `Uber Viagem` -> Clique em **PF (Pessoal)**
5.  **Esperado**: O painel de resumo atualiza:
    - *Despesas PJ = R$ 420,00*
    - *Retiradas PF = R$ 30,00*
6.  Em uma linha correspondente ao pagamento da fatura da conta corrente (ex: `PAGAMENTO FATURA CARTAO R$ -450,00`), clique na opção **Neutro / Fatura (Transfer)**.
    - **Esperado**: Essa linha muda de cor, indicando que ela representa apenas a quitação financeira do cartão e **não** é somada às despesas (evitando contar o gasto em dobro, já que as compras individuais do cartão já foram classificadas).

### Cenário 3: Confirmação e Salvamento
1.  Clique em **Confirmar Fechamento**.
2.  **Esperado**: O Next.js envia os registros classificados para o Laravel, que insere as transações no banco de dados vinculando o `fit_id` de cada uma para garantir que nenhuma delas seja importada novamente.
