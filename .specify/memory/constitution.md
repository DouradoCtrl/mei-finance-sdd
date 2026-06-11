<!--
SYNC IMPACT REPORT
- Version Change: 1.0.0 -> 1.1.0 (MINOR)
- Bump Rationale: Redefining UI components architecture to enforce a custom library (GlowUI) and remove Shadcn UI dependency. Correcting Next.js frontend folder prefix paths from `src/` to `frontend/`.
- Modified Principles:
  * IV. Arquitetura do Frontend Next.js e Consumo de API (Updated Next.js path structures and replaced Shadcn UI rules with custom GlowUI library design systems).
- Added Sections: None.
- Removed Sections: None.
- Templates requiring updates:
  * .specify/templates/plan-template.md (✅ updated - verified)
  * .specify/templates/spec-template.md (✅ updated - verified)
  * .specify/templates/tasks-template.md (✅ updated - verified)
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

### IV. Arquitetura do Frontend Next.js e Consumo de API
A arquitetura do frontend deve ser modular, desacoplada, segura e alinhada com as melhores práticas do Next.js:
*   **Controle de Sessão com NextAuth:** 
    - Toda a autenticação e controle de sessões do usuário devem ser gerenciados centralizadamente via NextAuth (v4).
    - O provider configurado deve ser o `CredentialsProvider`, conectando-se diretamente à API do backend.
    - O token JWT e os dados do usuário MEI devem ser estendidos na sessão através dos callbacks `jwt` e `session`, garantindo acesso em tempo de execução via `useSession` (cliente) ou `getServerSession` (servidor).
    - As tipagens customizadas para o usuário (ex: `cnpj`), token de acesso (`accessToken`) e mensagens de resposta devem ser formalmente estendidas em `frontend/next-auth.d.ts`.
*   **Abstração de Requisições HTTP (apiFetch):**
    - Todas as chamadas HTTP devem ser feitas através do wrapper `apiFetch` definido em `frontend/lib/api.ts`. É proibido usar `fetch` cru em componentes React ou páginas.
    - O `apiFetch` deve descobrir dinamicamente a URL base pelas variáveis de ambiente (`NEXT_API_URL` no servidor e `NEXT_PUBLIC_API_URL` no cliente).
    - O token de autenticação deve ser injetado automaticamente via cabeçalho `Authorization: Bearer <token>` sempre que a opção `accessToken` for fornecida.
    - Respostas não-2xx devem ser encapsuladas em uma instância de `ApiError`, que carrega a resposta estruturada (`ApiResponse`) com as propriedades `success`, `message` e `data`.
*   **Camada de Serviços Desacoplada (Services):**
    - Endpoints da API devem ser mapeados em funções assíncronas isoladas (puras e sem estado) em `frontend/services/` (ex: `frontend/services/auth.service.ts`).
    - Estas funções recebem o `accessToken` e os payloads necessários por parâmetro, permitindo chamadas flexíveis tanto no lado cliente quanto no servidor.
*   **Design System & UI Components (GlowUI):**
    - A interface e os componentes de UI devem ser 100% customizados, desacoplados e independentes de frameworks de terceiros como Shadcn UI.
    - Os componentes atômicos customizados residem em `frontend/components/custom/` (ex: `GlowUI.tsx` para botões/cards/inputs, `GlowDialog.tsx` para modais com portal, `GlowTable.tsx` para tabelas responsivas).
    - A estética inegociável é premium e glassmorphic (Dark-First por padrão, com cantos arredondados `rounded-2xl`, fundos `bg-white/80` / `bg-zinc-950/80` com `backdrop-blur-md` e bordas finas semi-transparentes).
    - Os botões e cards devem utilizar animações fluidas (`transition-all duration-300`), pequenas translações de subida no hover (`hover:-translate-y-0.5`), e sombras brilhantes (glows) com cores específicas e dinâmicas coerentes com seu contexto (ex: verde para positivo/entradas e vermelho/rose para negativo/despesas).
    - Elementos interativos em listas e tabelas devem usar componentes do tipo controle segmentado em cápsula (`inline-flex bg-zinc-100/80 dark:bg-zinc-900/60 p-0.5 rounded-lg border`) para deixar clara a interatividade e permitir operações rápidas em um clique.

### V. Versionamento Rastreável (Git)
*   Os commits devem ser atômicos e, para arquivos customizados, preferencialmente individuais (um commit por arquivo) para garantir a máxima rastreabilidade do histórico.
*   As mensagens de commit devem seguir o padrão Conventional Commits em português (ex: `feat(auth): ...`, `chore(db): ...`, `docs(spec): ...`).

---

## Governance

*   Qualquer plano de implementação (`plan.md`) deve obrigatoriamente validar estes princípios na seção `## Constitution Check`.
*   Caso uma funcionalidade necessite quebrar temporariamente um princípio por razões técnicas justificáveis, a violação deve ser formalmente registrada e justificada na seção `Complexity Tracking` do plano antes da aprovação.

**Version**: 1.1.0 | **Ratified**: 2026-06-10 | **Last Amended**: 2026-06-11
