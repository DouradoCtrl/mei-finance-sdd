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

### III. Banco de Dados Dockerizado e Isolado
O banco de dados oficial de desenvolvimento é o PostgreSQL 16 executado em container Docker via Docker Compose.
*   O volume físico do PostgreSQL deve ser mapeado na pasta local `./.docker/pgdata/`.
*   A pasta `.docker/` deve estar listada no `.gitignore` do projeto raiz para evitar o commit de binários do banco de dados.
*   Para evitar conflitos com instalações locais no host do desenvolvedor, a porta padrão externa de comunicação no docker-compose deve ser mapeada na porta `5433` (ou outra disponível que não a 5432).

### IV. Arquitetura do Frontend Next.js e Consumo de API
A arquitetura do frontend deve ser modular, desacoplada, segura e alinhada com as melhores práticas do Next.js:
*   **Controle de Sessão com NextAuth:** 
    - Toda a autenticação e controle de sessões do usuário devem ser gerenciados centralizadamente via NextAuth (v4).
    - O provider configurado deve ser o `CredentialsProvider`, conectando-se diretamente à API do backend.
    - O token JWT e os dados do usuário MEI devem ser estendidos na sessão através dos callbacks `jwt` e `session`, garantindo acesso em tempo de execução via `useSession` (cliente) ou `getServerSession` (servidor).
    - As tipagens customizadas para o usuário (ex: `cnpj`), token de acesso (`accessToken`) e mensagens de resposta devem ser formalmente estendidas em `src/next-auth.d.ts`.
*   **Abstração de Requisições HTTP (apiFetch):**
    - Todas as chamadas HTTP devem ser feitas através do wrapper `apiFetch` definido em `src/lib/api.ts`. É proibido usar `fetch` cru em componentes React ou páginas.
    - O `apiFetch` deve descobrir dinamicamente a URL base pelas variáveis de ambiente (`NEXT_API_URL` no servidor e `NEXT_PUBLIC_API_URL` no cliente).
    - O token de autenticação deve ser injetado automaticamente via cabeçalho `Authorization: Bearer <token>` sempre que a opção `accessToken` for fornecida.
    - Respostas não-2xx devem ser encapsuladas em uma instância de `ApiError`, que carrega a resposta estruturada (`ApiResponse`) com as propriedades `success`, `message` e `data`.
*   **Camada de Serviços Desacoplada (Services):**
    - Endpoints da API devem ser mapeados em funções assíncronas isoladas (puras e sem estado) em `src/services/` (ex: `src/services/auth.service.ts`).
    - Estas funções recebem o `accessToken` e os payloads necessários por parâmetro, permitindo chamadas flexíveis tanto no lado cliente quanto no servidor.
*   **Design System & UI Components:**
    - A interface e os componentes de UI devem reaproveitar a estrutura do Shadcn/ui (estilo New York) instalada em `src/components/ui/`.
    - Manter estética premium (Dark-First por padrão, com suporte a transições suaves e design limpo) utilizando Tailwind CSS v4.


### V. Versionamento Rastreável (Git)
*   Os commits devem ser atômicos e, para arquivos customizados, preferencialmente individuais (um commit por arquivo) para garantir a máxima rastreabilidade do histórico.
*   As mensagens de commit devem seguir o padrão Conventional Commits em português (ex: `feat(auth): ...`, `chore(db): ...`, `docs(spec): ...`).

---

## Governance

*   Qualquer plano de implementação (`plan.md`) deve obrigatoriamente validar estes princípios na seção `## Constitution Check`.
*   Caso uma funcionalidade necessite quebrar temporariamente um princípio por razões técnicas justificáveis, a violação deve ser formalmente registrada e justificada na seção `Complexity Tracking` do plano antes da aprovação.

**Version**: 1.0.0 | **Ratified**: 2026-06-10 | **Last Amended**: 2026-06-10
