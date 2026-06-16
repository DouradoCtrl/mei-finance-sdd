# Tarefas: Identidade Visual Verde e Tema Escuro

**Input**: Design documents from `/specs/002-identidade-visual/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Não aplicável (sem testes unitários solicitados).

**Organization**: As tarefas são agrupadas por história de usuário para permitir implementação e testes independentes de cada história.

## Formato: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual história de usuário pertence a tarefa (ex: US1, US2, US3)
- Caminhos exatos de arquivos incluídos nas descrições.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configuração inicial do ambiente de trabalho para a identidade visual.

- [x] T001 Verificar o status do repositório git e garantir uma branch limpa para início em `/home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Nenhuma infraestrutura pesada de dados é necessária. A fundação será a estruturação e compatibilidade das tags base do Next.js.

- [x] T002 Verificar arquivos modificados ou configurações locais do Tailwind no diretório `nextjs/`

**Checkpoint**: Fundação pronta - a implementação das histórias de usuário pode começar.

---

## Phase 3: User Story 1 - Tema Escuro por Padrão (Priority: P1) 🎯 MVP

**Goal**: Fazer com que a aplicação carregue com o fundo escuro por padrão, adaptando as tags semânticas do Next.js para lerem as variáveis de tema.

**Independent Test**: Acessar o sistema localmente no navegador e verificar se o fundo da tela fica escuro e o texto claro, mesmo sem preferências nativas de dark mode no sistema operacional.

### Implementation for User Story 1

- [x] T003 [US1] Adicionar a classe `dark` na tag `<html>` do arquivo `nextjs/app/layout.tsx`
- [x] T004 [US1] Alterar a classe do elemento `<body>` de `bg-slate-950 text-slate-100` para `bg-background text-foreground` no arquivo `nextjs/app/layout.tsx`

**Checkpoint**: Neste ponto, a aplicação possui o tema escuro habilitado por padrão em todas as páginas e lê as variáveis de background/foreground globais do CSS.

---

## Phase 4: User Story 2 - Identidade Visual Verde (Priority: P1)

**Goal**: Definir a cor verde/esmeralda como cor primária e de anel de foco nos inputs da aplicação, aplicando os tons escuros corretos baseados em OKLCH nas variáveis globais.

**Independent Test**: Inspecionar os botões da tela de login/registro e verificar se adotaram a cor verde e se os campos focados apresentam contorno verde.

### Implementation for User Story 2

- [x] T005 [P] [US2] Configurar as variáveis globais de cores escuras com acentos verdes na seção `:root` do arquivo `nextjs/app/globals.css`
- [x] T006 [P] [US2] Mapear as mesmas variáveis de cores verdes e escuras na seção `.dark` do arquivo `nextjs/app/globals.css` para manter total compatibilidade

**Checkpoint**: Neste ponto, os componentes Shadcn UI estarão renderizados com a cor verde esmeralda e fundo escuro automaticamente.

---

## Phase 5: User Story 3 - Preservação dos Componentes Originais (Priority: P2)

**Goal**: Garantir que as alterações de cores foram herdadas com sucesso de forma não-invasiva, sem alteração de arquivos de componentes.

**Independent Test**: Executar a compilação de produção com sucesso e verificar que nenhum arquivo sob `nextjs/components/ui/*` foi modificado.

### Implementation for User Story 3

- [x] T007 [US3] Executar o build do Next.js via comando `npm run build` no diretório `nextjs/`
- [x] T008 [US3] Executar verificação via git diff para garantir que nenhum arquivo na pasta `nextjs/components/ui/` foi alterado

**Checkpoint**: As histórias de usuário 1, 2 e 3 estão concluídas e integradas com sucesso de forma não-invasiva.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificações finais e versionamento.

- [x] T009 [P] Rodar e validar os passos de teste do arquivo `quickstart.md`
- [x] T010 Realizar o commit semântico em português das alterações de identidade visual

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências.
- **Foundational (Phase 2)**: Depende do Setup.
- **User Story 1 (P1)**: Depende de Foundational (Phase 2).
- **User Story 2 (P1)**: Depende do User Story 1 para que o tema escuro padrão esteja estruturado nas tags principais.
- **User Story 3 (P2)**: Depende da implementação completa das cores da identidade visual (US2).
- **Polish (Final Phase)**: Depende de todas as histórias concluídas.

### Parallel Opportunities

- As tarefas T005 e T006 da US2 podem ser editadas em paralelo se desejado, no mesmo arquivo `globals.css` de forma independente.
- A tarefa de Polish T009 pode rodar em paralelo aos preparativos de versionamento.
