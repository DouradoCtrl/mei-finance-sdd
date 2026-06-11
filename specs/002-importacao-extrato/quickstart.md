# Quickstart Guide: Validando a Importação e Classificação de Extrato

**Feature**: [specs/002-importacao-extrato](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato)

Este guia apresenta o roteiro para execução local e validação da importação de extrato com classificação de gastos (PF/PJ).

## 🚀 Como Executar

### 1. Iniciar os Servidores
- Certifique-se de que o backend Laravel está rodando (`php artisan serve --port=8085` com a PATH configurada).
- Certifique-se de que o frontend Next.js está rodando (`npm run dev` na porta 3000).

---

## 🧪 Roteiro de Testes Manuais

### Cenário 1: Colagem de Extrato Bruto e Parsing
1.  Acesse a Dashboard e clique em **Importar Extrato** (ou navegue para `/dashboard/importacao`).
2.  Cole o seguinte texto bruto no campo de texto:
    ```text
    10/06/2026 Venda de Serviço R$ 1500,00
    11/06/2026 Aluguel Escritório R$ -450,00
    12/06/2026 Supermercado Casa R$ -200,00
    ```
3.  Clique em **Processar Extrato**.
4.  **Esperado**: O backend extrai as linhas e exibe uma tabela na tela com as 3 transações identificadas corretamente com suas datas, descrições e valores (entradas em verde, saídas em vermelho).

### Cenário 2: Classificação PF/PJ e Resumo Dinâmico
1.  Na tabela de transações importadas, observe o painel de resumo (deve iniciar zerado).
2.  Clique no botão **PJ (Empresa)** para a transação `Venda de Serviço` de R$ 1500,00.
    - **Esperado**: O resumo atualiza instantaneamente para: *Receitas PJ = R$ 1500,00*, *Despesas PJ = R$ 0,00*, *Retiradas PF = R$ 0,00*, *Lucro Líquido = R$ 1500,00*.
3.  Clique no botão **PJ (Empresa)** para a transação `Aluguel Escritório` de R$ -450,00.
    - **Esperado**: O resumo atualiza para: *Despesas PJ = R$ 450,00*, *Lucro Líquido = R$ 1050,00*.
4.  Clique no botão **PF (Pessoal)** para a transação `Supermercado Casa` de R$ -200,00.
    - **Esperado**: O resumo atualiza para: *Retiradas PF = R$ 200,00*, *Lucro Líquido = R$ 1050,00* (não altera o lucro PJ).

### Cenário 3: Confirmação e Salvamento
1.  Clique em **Confirmar Fechamento**.
2.  **Esperado**: O frontend faz uma chamada autenticada para `POST /api/transactions/confirm` enviando o JSON das transações classificadas. O Laravel persiste no banco de dados e limpa a tela de importação, exibindo um alerta de sucesso.
