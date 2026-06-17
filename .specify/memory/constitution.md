<!--
SYNC IMPACT REPORT
- Version Change: 1.3.3 -> 1.4.0 (MINOR)
- Bump Rationale: Habilitação formal do padrão Feature-Driven Architecture (arquitetura orientada a features) no frontend Next.js.
- Modified Principles:
  * IV. Desenvolvimento Frontend Next.js e Segurança (BFF & Shadcn UI)
- Added Sections: Feature-Driven Architecture (Arquitetura Baseada em Features) dentro do Princípio IV.
- Removed Sections: None.
- Templates requiring updates: ✅ .specify/templates/plan-template.md (atualizado)
- Follow-up TODOs: None.
-->

# MEI Finance Constitution

Esta constituição define as regras arquiteturais, princípios de engenharia de software e diretrizes de desenvolvimento inegociáveis para o projeto MEI Finance. Qualquer decisão técnica ou plano de implementação (plan.md) deve estar em total conformidade com estas diretrizes.

---

## Core Principles

### I. Arquitetura de Camadas (Service Layer) no Backend
A lógica de negócios e as regras de negócio devem ser mantidas isoladas fora dos Controllers e Models do Laravel.
*   **Controllers:** Devem ser magros (thin controllers). Suas responsabilidades limitam-se a receber a requisição (sendo obrigatório o uso de **Form Requests** customizados para qualquer validação de dados de entrada), acionar a classe de serviço correspondente e retornar a resposta JSON padronizada. É terminantemente proibido realizar validações inline nos controllers utilizando `$request->validate()` ou o facade `Validator`.
*   **Services:** Toda a lógica de negócios (operações, cálculos, interações com banco) deve residir em classes de serviço específicas dentro de `app/Services/`.
*   **Models:** Devem ser usados puramente para definição de relacionamentos, escopos locais e casts de atributos.

### II. Respostas JSON Padronizadas e Uso da Trait `ApiResponse`
Toda resposta enviada pela API do backend para o Next.js deve seguir uma estrutura JSON uniforme para facilitar o tratamento de estados no frontend, utilizando obrigatoriamente a trait `App\Traits\ApiResponse` nos Controllers.
*   **API Resources:** É obrigatório o uso de **Laravel API Resources** (`App\Http\Resources`) para formatar e filtrar qualquer dado de entidade/model antes de enviá-lo na resposta. É proibido retornar o model puro do banco de dados para evitar vazamento de atributos internos (como hashes ou colunas desnecessárias).
*   **Métodos da Trait:**
    - `successResponse($data, ?string $message, int $code)`: retorna `{ "success": true, "message": $message, "data": $data }`
    - `errorResponse(string $message, int $code, $data)`: retorna `{ "success": false, "message": $message, "data": $data }`
*   **Formatos das Respostas:**
    - **Sucesso:**
      ```json
      {
        "success": true,
        "message": "Mensagem em português",
        "data": { ... }
      }
      ```
    - **Erro:**
      ```json
      {
        "success": false,
        "message": "Mensagem de erro em português"
      }
      ```
*   **Tratamento de Exceções Global no Bootstrap:**
    - Toda exceção sob a rota `/api/*` que resulte em erro HTTP deve ser capturada no arquivo `bootstrap/app.php` e formatada usando a trait `ApiResponse` via classe anônima.
    - Exceções de validação (`ValidationException`) devem retornar status `422` com as mensagens detalhadas de validação populadas no campo `data`.
    - Exceções de autenticação (`AuthenticationException`) devem retornar status `401` com a mensagem `"Usuário não autenticado."`.
    - Exceções de autorização (`AccessDeniedHttpException`) devem retornar status `403` com a mensagem `"Esta ação não é autorizada."`.
    - Exceções de recursos não encontrados (`ModelNotFoundException`) devem ser traduzidas dinamicamente baseando-se no nome da classe do model Eloquent (ex: `User` -> `Usuário`) e retornar status `404` com a mensagem `"{Entidade} não encontrado."`.

### III. Banco de Dados Dockerizado e Isolado
O banco de dados oficial de desenvolvimento é o PostgreSQL 16 executado em container Docker via Docker Compose.
*   O volume físico do PostgreSQL deve ser mapeado na pasta local `./.docker/pgdata/`.
*   O diretório `.docker/` deve estar listado no `.gitignore` do projeto raiz para evitar o commit de binários do banco de dados.
*   Para evitar conflitos com instalações locais no host do desenvolvedor, a porta padrão externa de comunicação no docker-compose deve ser mapeada na porta `5433` (ou outra disponível que não a 5432).

### IV. Desenvolvimento Frontend Next.js e Segurança (BFF & Shadcn UI)
O desenvolvimento da camada de frontend em Next.js deve obrigatoriamente seguir as seguintes diretrizes:
*   **Desacoplamento de Componentes (UI):** O visual do frontend deve ser construído de forma estritamente desacoplada em componentes reutilizáveis, sendo **estritamente necessário** desenvolver utilizando componentes oficiais do **Shadcn UI** (baseados em **Radix UI**) para preservar a consistência e o design UX.
*   **Segurança de Tokens:** Devem ser rigorosamente mantidos os mecanismos de segurança implementados (como Cookies HttpOnly) para evitar a exposição e o vazamento do token de API (`auth_token`) no ambiente do cliente (frontend).
*   **Camada de Serviços (Services):** É estritamente proibido realizar chamadas HTTP diretas (como `fetch`, `axios`, etc.) dentro de arquivos de página (`page.tsx`). Toda comunicação entre o frontend e o backend ou APIs externas deve ser encapsulada e orquestrada de forma exclusiva dentro das classes de serviço correspondentes (`services/`), com as páginas consumindo apenas esses serviços.
*   **Fluxo de Comunicação Unidirecional (BFF):** A arquitetura de comunicação deve seguir estritamente o fluxo sequencial: `Página (page.tsx)` ➔ `Serviço (service)` ➔ `API do Next.js (BFF / Route Handler)` ➔ `API do Laravel`.
*   **Validação Delegada ao Laravel:** A API do Next.js (BFF) atua apenas como um proxy seguro. Não é necessário realizar validações adicionais de dados ou de resposta na camada da API do Next.js, pois a validação de regras de negócio e de entrada é responsabilidade exclusiva da API do Laravel. As respostas do Laravel (mensagens de erro, validações e dados) devem ser retornadas e repassadas diretamente pelo BFF para o frontend sem alterações.
*   **Tratamento de Validação e Feedback Visual:** No frontend, as mensagens de erro de validação de formulários vindas das requests do Laravel (status 422) devem ser exibidas diretamente abaixo de seus respectivos inputs. Mensagens de feedback globais ou erros gerais da API devem ser exibidas na forma de alertas flutuantes temporários (toasts) utilizando o componente Toast do Shadcn UI.
*   **Feature-Driven Architecture (Arquitetura Baseada em Features):**
    - A organização do frontend Next.js deve seguir o padrão de arquitetura orientada a features.
    - Componentes, hooks, serviços (API/BFF clients) e tipos que pertencem exclusivamente a uma funcionalidade de negócio específica devem ser agrupados dentro de subpastas dedicadas em `features/` (ex: `nextjs/features/auth/`, `nextjs/features/incidents/`).
    - Cada pasta de feature deve expor sua interface pública através de um arquivo de entrada `index.ts` (ou `server.ts` para componentes de servidor se aplicável).
    - Outros módulos, páginas ou features devem interagir com uma feature importando apenas através do seu ponto de entrada exposto (ex: `import { LoginForm } from '@/features/auth'`), sendo terminantemente proibido realizar importações internas profundas (ex: `import LoginForm from '@/features/auth/components/LoginForm'`).
    - **Camada de Rotas (`app/`):** Os arquivos de rotas do Next.js (ex: `nextjs/app/login/page.tsx`) devem agir como wrappers finos (thin wrappers) cuja única responsabilidade é importar e renderizar o componente principal/view exposto pela feature respectiva.
    - **Elementos Globais:** Componentes visuais genéricos compartilhados e dependências externas (como botões fundamentais, inputs e os componentes nativos do Shadcn UI) permanecem em `nextjs/components/` ou `nextjs/components/ui/`. Serviços, utilitários e tipos genuinamente globais permanecem em `nextjs/services/`, `nextjs/lib/` ou `nextjs/types/`.
*   **Identidade Visual e Guia de Estilo (Multitema com Fundo Discord e Verde Esmeralda):**
    - A aplicação possui suporte a multitema gerenciado por `next-themes`, com tema escuro habilitado por padrão inicial.
    - O Dark Mode utiliza a cor de fundo cinza escuro do Discord (`#313338` / `oklch(0.27 0.008 240)`) e os cartões de dados (Cards) seguem o estilo de vidro translúcido baseado na sidebar do Discord (`#2b2d31` com opacidade/blur) de forma minimalista.
    - Toda a estilização e destaque primário devem seguir a paleta verde esmeralda financeiro (`oklch(0.48 0.15 160)` no claro e `oklch(0.78 0.12 160)` no escuro), aplicando-se consistentemente em botões principais, links ativos, estados de foco de inputs, indicador ativo do Dock e nome do usuário logado no cabeçalho.
    - É terminantemente proibido o uso de tons e matizes de azul, ciano ou índigo na interface gráfica, com exceção do matiz cinza-azulado do Discord apenas para fundo e vidro.
    - Os blobs coloridos flutuantes de background do Light Mode devem ser ocultados no Dark Mode (usando a classe `dark:opacity-0`) para manter um visual escuro limpo e focado.
    - Toasts globais (Sonner Toaster) devem utilizar desfoque de vidro e herdar o fundo cinza Discord em modo escuro com bordas e ícone de sucesso em verde esmeralda.


### V. Desenvolvimento Orientado a Especificações (SDD)
Nenhuma funcionalidade pode ser implementada diretamente no código. O desenvolvimento deve seguir estritamente o ciclo do Spec Kit (Especificação -> Planejamento Técnico -> Tarefas -> Implementação). As especificações guiarão a implementação arquitetural e toda a documentação técnica deve ser sempre escrita em **Português**.

### VI. Fluxo de Trabalho Git e Padrões de Commit
*   **Momento do Commit (Ciclo Completo):** Os commits só devem ser realizados após a conclusão de todo o ciclo de desenvolvimento da funcionalidade: especificação (SDD), planejamento técnico, definição de tarefas, implementação do código, realização completa de testes e aprovação da usabilidade. Nenhuma alteração deve ser comitada antes de garantir uma entrega eficiente e funcional.
*   **Granularidade por Contexto (Commit por Contexto/Funcionalidade):** As alterações devem ser comitadas de forma agregada por contexto lógico ou funcionalidade, agrupando os arquivos relacionados à mesma modificação em um único commit coerente, otimizando o histórico de alterações e facilitando revisões.
*   **Commits Semânticos em Português:** Todas as mensagens de commit devem seguir os padrões do Conventional Commits, escritas inteiramente em português e com descrição curta. Exemplos:
    - `feat: criar UserService.php`
    - `fix: corrigir validação de cpf`
    - `refactor: extrair logica de token para Service`
    - `docs: adicionar spec.md`
    - `test: implementar UserRepositoryTest.php`
    - `chore: ajustar rotas no api.php`

---

## Governance

*   Qualquer plano de implementação (`plan.md`) deve obrigatoriamente validar estes princípios na seção `## Constitution Check`.
*   Caso uma funcionalidade necessite quebrar temporariamente um princípio por razões técnicas justificáveis, a violação deve ser formalmente registrada e justificada na seção `Complexity Tracking` do plano antes da aprovação.
*   Toda alteração de arquitetura base, como a introdução de um novo padrão que viole a estrutura Service/Controller/Model da aplicação, exigirá a atualização formal prévia deste documento.
*   Todas as implementações devem estar em conformidade com as restrições acima, e os testes integrados deverão ser desenvolvidos de forma a validar as funcionalidades isoladas nessas camadas.
*   As revisões de código devem usar esta constituição como *checkpoint* para evitar vazamento de lógica de negócio para Controllers ou Models.

**Version**: 1.4.0 | **Ratified**: 2026-06-10 | **Last Amended**: 2026-06-16
