# Research: Controle de Usuários (Administrador)

Este documento detalha o estudo técnico, boas práticas e decisões de design para a implementação da funcionalidade de gerenciamento de usuários no MEI Finance.

---

## 1. Autorização e Controle de Acesso (NextAuth + Sanctum)

### Decisão
*   A validação de perfil (`role`) ocorrerá em três camadas:
    1.  **Frontend (UI):** Condicional no componente `navigation-dock.tsx` verificando o perfil contido na sessão do NextAuth.
    2.  **Frontend (Rotas):** Middleware de proxy (`proxy.ts` ou Next.js Middleware) interceptando requisições para `/dashboard/users` e redirecionando usuários não administradores.
    3.  **Backend (Laravel API):** Middleware personalizado do Laravel (`RoleMiddleware` ou Gate/Policy) protegendo as rotas de API `/api/users/*`.
*   **Decisão de Token:** Uso do token Sanctum (injetado via cabeçalho de Authorization no BFF) para autenticação das chamadas de API no Laravel.

### Rationale
*   Garante uma defesa em profundidade (Defense-in-Depth). A proteção de UI melhora a UX escondendo links irrelevantes, enquanto a proteção de rota no Next.js e de API no Laravel previne invasões deliberadas via URL ou requisições manuais.

---

## 2. Estrutura de Pastas do Módulo no Frontend (Feature-Driven Architecture)

### Decisão
*   Criar o diretório `nextjs/features/users/` com a seguinte estrutura:
    *   `components/`:
        *   `user-table.tsx` (Tabela de listagem de usuários usando Shadcn UI)
        *   `user-dialog.tsx` (Modal com formulário unificado de criação/edição)
        *   `delete-confirm-dialog.tsx` (Diálogo de confirmação para exclusão de usuário)
    *   `services/`:
        *   `userService.ts` (Métodos HTTP de listagem, criação, edição e exclusão)
    *   `types/`:
        *   `index.ts` (Declarações das interfaces `User` e formulários)
    *   `index.ts` (Entrypoint exportando a página principal da feature `UserManagementPage` ou componentes auxiliares)

### Rationale
*   Mantém o isolamento de componentes específicos e respeita o Princípio IV da Constituição. As páginas sob `app/dashboard/users/page.tsx` serão apenas wrappers simples que chamam a view principal da feature.

---

## 3. Comportamento e Regras de Integridade do Banco de Dados

### Decisão
*   Ao criar ou alterar um usuário de **Contador** para **Administrador**, os campos `crc` e `office_name` serão definidos como `null` no backend Laravel.
*   **Auto-Exclusão:** A validação no backend rejeitará qualquer requisição `DELETE /api/users/{id}` onde `{id}` seja igual ao do usuário atualmente logado.

### Rationale
*   Evita inconsistências no banco de dados (um administrador não deve possuir CRC cadastrado). O bloqueio de auto-exclusão impede que o administrador remova sua própria conta acidentalmente e tranque o painel administrativo.

---

## 4. Alternativas Consideradas

*   **Exclusão Lógica (Soft Deletes):** Cogitou-se o uso de soft deletes para manter histórico. Contudo, dado que o MVP atual não possui tabelas financeiras ou de lançamentos vinculadas a usuários de forma transacional complexa (apenas contadores/admins), a exclusão física (`hard delete`) simplifica a implementação inicial. Caso necessário futuramente, habilitaremos soft deletes no Model Laravel.
