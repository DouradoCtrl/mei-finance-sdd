# Research: Estratégia de Validação Unificada (Laravel + Next.js)

**Feature**: [specs/001-autenticacao](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/001-autenticacao)

Este documento registra as pesquisas, decisões técnicas e alternativas consideradas para a implementação da estratégia de validação no fluxo de Cadastro e Login do MEI Finance.

---

## 1. Decisão de Arquitetura: Validação Centralizada no Backend

* **Decisão**: Toda a validação de formato, tipo, regras de negócio e obrigatoriedade é definida e executada exclusivamente na API Laravel (via Form Requests). O frontend Next.js é um consumidor passivo dessas regras de validação.
* **Justificativa**: 
  - **Manutenibilidade**: Evita o esforço de duplicar regras de validação (ex: tamanho mínimo de senha, regex de CNPJ) nos dois lados. Se uma regra mudar, ela é alterada em um único lugar no backend.
  - **Segurança**: A validação no frontend é puramente estética/UX; a validação do backend é a única que garante a integridade dos dados e segurança da aplicação.
  - **Experiência do Desenvolvedor (DX)**: Menos código redundante no frontend Next.js.

---

## 2. Fluxo de Tratamento de Erros e Mapeamento de UI

Para garantir uma boa experiência de usuário (UX) sem validação local no cliente:

### A. Erros de Validação de Formulário (HTTP 422 - Unprocessable Entity)
* **Retorno da API (Laravel Form Request)**:
  ```json
  {
    "success": false,
    "message": "O campo email é obrigatório. (e mais 1 erro)",
    "data": {
      "email": [
        "O campo email é obrigatório."
      ],
      "password": [
        "O campo senha é obrigatório."
      ]
    }
  }
  ```
* **Mapeamento no Frontend**:
  - O frontend intercepta a falha e extrai o objeto `data`.
  - Mapeia as chaves (`email`, `password`, `cnpj`, `name`) para estados locais de erro (`fieldErrors`).
  - Renderiza as mensagens de erro diretamente abaixo de cada respectivo campo de input.

### B. Erros de Autenticação / Regra de Negócio (HTTP 401 / 403)
* **Retorno da API**:
  ```json
  {
    "success": false,
    "message": "E-mail ou senha incorretos.",
    "data": null
  }
  ```
* **Mapeamento no Frontend**:
  - O frontend lê a propriedade `message` e a exibe globalmente como um alerta do tipo Toast flutuante usando a biblioteca `sonner`.

---

## 3. Alternativas Consideradas e Rejeitadas

### Alternativa 1: Validação Duplicada com Zod/React Hook Form no Frontend
* **Por que foi rejeitada**: Embora ofereça feedback instantâneo ao digitar, exige manter esquemas Zod sincronizados manualmente com as regras de validação dos Form Requests do Laravel. Qualquer alteração (ex: tornar CNPJ obrigatório futuramente) exigiria alterar e implantar ambas as aplicações ao mesmo tempo, facilitando a ocorrência de dessincronização e bugs.

### Alternativa 2: Exibir todos os erros de validação em Toasts acumulados
* **Por que foi rejeitada**: Prejudica a acessibilidade e a usabilidade. Quando o usuário comete múltiplos erros em um formulário, exibir 3 ou 4 toasts de uma vez gera poluição visual. Mostrar o erro abaixo de cada input é o padrão de mercado para formulários web modernos.
