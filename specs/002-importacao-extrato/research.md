# Technical Research: Importação de Extrato e Classificação PF/PJ

**Feature**: [specs/002-importacao-extrato](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-importacao-extrato)

Este documento registra as decisões de design, alternativas avaliadas e decisões arquiteturais para a importação e classificação de extratos.

## 1. Abordagem de Parsing de Extrato Bancário
### Opções Analisadas:
1. **Parsing no Frontend (JavaScript/React)**: O processamento é feito diretamente no navegador do usuário antes de enviar para o backend.
   - *Prós*: Latência zero no processamento (SC-002: <200ms garantido), reduz carga no servidor.
   - *Contras*: Lógica de negócio (reconhecimento de formato de extrato) vazada no frontend, dificulta reaproveitamento em outros clientes (Mobile/CLI).
2. **Parsing no Backend via API (Laravel Service)**: O frontend envia o texto bruto para um endpoint `POST /api/transactions/parse` e o backend retorna o JSON estruturado.
   - *Prós*: Lógica centralizada na camada de serviço (`BankStatementParserService`), fácil manutenção de novas regras de regex para bancos, segue o **Princípio I (Service Layer)**.
   - *Contras*: Requer uma requisição HTTP, mas com latência muito baixa (infra local).

### Decisão:
**Opção 2 (Parsing no Backend via API)**. Criaremos um serviço `BankStatementParserService` no Laravel. O frontend Next.js fará uma chamada de API enviando o texto colado.

### Padrão de Expressões Regulares (Regex) para Bancos Brasileiros:
Utilizaremos um conjunto de regexes para identificar:
1. **Datas**:
   - `\d{2}/\d{2}/\d{4}` (ex: 10/06/2026)
   - `\d{2}/\d{2}` (ex: 10/06 - assume-se o ano corrente)
   - `\d{2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)` (ex: 10 Jun ou 10 jun - Nubank)
2. **Valores**:
   - `(?:R\$)?\s*(-?\s*\d{1,3}(?:\.\d{3})*,\d{2})` (ex: R$ 150,00 ou -R$ 45,50 ou 1.250,00)
   - Identificaremos se a transação é Entrada (positiva) ou Saída (negativa) baseado em palavras-chave ("recebido", "PIX recebido", "crédito") ou na presença do sinal de menos `-`.

---

## 2. Tratamento de Transações Duplicadas
### Abordagem:
Para evitar que o usuário importe a mesma transação duas vezes ao colar o extrato acumulado do mês, calcularemos um hash identificador único temporário (ou chave composta) para cada transação proposta baseado em:
- `user_id`
- `data`
- `descricao` (normalizada, sem espaços extras)
- `valor`

Antes de salvar as transações, o backend buscará no banco de dados se já existem transações idênticas para aquele usuário naquele período. Se existirem, retornará para o frontend uma flag `is_duplicate: true` para aquela linha, permitindo que a interface do Next.js exiba um alerta e dê a opção de desmarcar ou ignorar essas transações na confirmação.

---

## 3. Armazenamento das Transações e Fechamento
### Opções Analisadas:
1. **Calcular Resumos Dinamicamente (On-The-Fly)**: Armazenar apenas as transações individuais na tabela `transactions`. O resumo mensal (Receita PJ, Despesa PJ, Retiradas PF, Lucro Líquido) é calculado dinamicamente via consultas SQL agregadoras (`SUM` agrupado por mês/ano).
2. **Tabela de Fechamento Histórico**: Criar uma tabela física `monthly_closings` que armazena os valores consolidados de cada mês após o usuário clicar em "Confirmar Fechamento".

### Decisão:
**Opção 1 (Calcular Resumos Dinamicamente)** combinada com salvamento em tabela simples. Manteremos as transações na tabela `transactions` com seu status de classificação (`PENDENTE`, `PJ_NEGOCIO`, `PF_PESSOAL`). A soma e o Lucro Líquido serão calculados sob demanda pela API para evitar inconsistência de dados (dupla fonte de verdade). No entanto, para fins históricos, permitiremos persistir o estado de confirmação na tabela de transações.
