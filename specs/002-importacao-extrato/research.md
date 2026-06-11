# Technical Research: Importação Multibancos (OFX / Texto) e Cartão de Crédito

**Feature**: [specs/002-importacao-extrato](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato)

Este documento analisa as soluções para suportar múltiplos bancos, múltiplos formatos de arquivo (OFX/Texto) e a importação de cartões de crédito sem duplicidade de gastos.

---

## 1. Suporte Multibancos: Por que o padrão OFX é a solução?
Diferentes bancos geram PDFs, planilhas Excel (XLSX) e textos em formatos proprietários e muito variáveis. Escrever parsers para cada PDF/Excel de cada banco é inviável e instável (qualquer alteração no layout do banco quebra o sistema).

### Solução: O Padrão OFX (Open Financial Exchange)
*   **O que é**: É um formato XML/SGML universal de exportação financeira suportado por praticamente **todos** os bancos brasileiros (Nubank, Banco do Brasil, Itaú, Bradesco, Inter, Santander).
*   **Vantagem**: As tags são padronizadas:
    *   `<TRNTYPE>`: Tipo de transação (DEBIT/CREDIT)
    *   `<DTPOSTED>`: Data da transação (formato fixo: AAAAMMDD...)
    *   `<TRNAMT>`: Valor exato (sempre usando ponto decimal, ex: -150.00 ou 1500.00)
    *   `<MEMO>` ou `<NAME>`: Descrição da transação
    *   `<FITID>`: ID único da transação (excelente para evitar duplicidades)
*   **Decisão**: O backend Laravel aceitará arquivos `.ofx` e fará o parsing estruturado usando uma biblioteca nativa leve (ou leitor SGML/XML básico).

### Alternativa de Entrada Rápida: Colagem de Texto (TXT/Fallback)
Caso o usuário não queira baixar o arquivo OFX, mantemos a caixa de texto (textarea) para colagem rápida. O sistema usará as Regexes genéricas como fallback (melhor esforço).

---

## 2. O Problema do Cartão de Crédito (Fatura Unificada vs. Gastos Individuais)
No extrato da Conta Corrente, a fatura do cartão aparece como uma despesa única:
`15/06/2026 PAGAMENTO FATURA CARTAO NUBANK R$ -1500,00`

Se classificarmos essa linha como despesa PJ ou PF diretamente, perdemos o detalhamento dos gastos (uma parte da fatura pode ser PJ e outra PF).

### Solução Proposta (Conciliação de Fatura):
1.  **Origens de Importação (`source`)**: O usuário escolhe a origem ao fazer a importação:
    *   `checking_account` (Conta Corrente)
    *   `credit_card` (Cartão de Crédito)
2.  **Tratamento da Fatura na Conta Corrente**:
    *   O pagamento da fatura (`PAGAMENTO FATURA CARTAO...`) é classificado como `transfer` (Neutro). Ele **não** entra na soma de despesas para evitar duplicidade.
3.  **Importação da Fatura do Cartão**:
    *   O usuário importa o extrato do Cartão de Crédito (via arquivo OFX ou Texto).
    *   Cada compra do cartão (ex: `AWS R$ 300,00`, `Supermercado R$ 200,00`) é listada individualmente e o usuário as classifica individualmente como PJ ou PF.
    *   Essas compras do cartão entram na soma de despesas e retiradas.
    *   O total de gastos no cartão e o pagamento na conta corrente devem se equiparar, oferecendo uma conciliação perfeita.

---

## 3. Arquitetura do Parser no Backend
Criaremos o endpoint `POST /api/transactions/parse`. Ele aceitará:
- `source`: `'checking_account'` ou `'credit_card'`
- `format`: `'ofx'` ou `'text'`
- `file`: (Opcional, arquivo OFX carregado)
- `raw_text`: (Opcional, texto colado)

O backend processa e retorna uma lista estruturada de transações pronta para a classificação.
