# Tarefas: Identidade Visual Verde Premium

**Input**: Design documents from `/specs/002-identidade-visual/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

---

## Phase 1: Setup & CSS Foundations

- [x] T001 Verificar arquivos modificados ou configurações locais do Tailwind no diretório `nextjs/`
- [x] T002 Configurar variáveis de cores OKLCH e tema escuro no `nextjs/app/globals.css`
- [x] T003 Adicionar a classe `dark` na tag `<html>` de `nextjs/app/layout.tsx`
- [x] T004 Alterar `<body>` para usar as classes `bg-background text-foreground` semânticas

---

## Phase 2: User Story 2 - Identidade Visual Verde e Glows

- [x] T005 Configurar Toaster (Sonner) com estilo de vidro e glow verde no `globals.css`
- [x] T006 Reestruturar `nextjs/app/login/page.tsx` para layout centralizado com glows e vidro
- [x] T007 Reestruturar `nextjs/app/register/page.tsx` para layout centralizado com glows e vidro
- [x] T008 Estilizar `nextjs/app/dashboard/page.tsx` com navbar transparente, vidro e glows de fundo

---

## Phase 3: User Story 4 - Portal de Navegação Inicial

- [x] T009 Reformular `nextjs/app/page.tsx` como portal de navegação raiz com cards glassmorphic e links rápidos

---

## Phase 4: Polish, Verificação e Documentação

- [x] T010 Executar build de produção do Next.js via `npm run build`
- [x] T011 Garantir integridade de `nextjs/components/ui/*` (sem modificações locais)
- [x] T012 Atualizar documentações oficiais do Spec Kit (`spec.md`, `plan.md`, `tasks.md`)
- [x] T013 Tirar capturas de tela finais da interface utilizando o subagente browser
