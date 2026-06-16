# Plano de Implementação: Identidade Visual Financeira iPhone Liquid Glass (Multitema Esmeralda e Prata)

**Branch**: `002-identidade-visual` | **Date**: 2026-06-16 | **Spec**: [spec.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-identidade-visual/spec.md)

## Resumo do Objetivo

Este plano descreve o suporte completo a **Light Mode** e **Dark Mode** via `next-themes`, incorporando a identidade financeira verde esmeralda com prata no estilo **Liquid Glass**. Ele inclui a redefinição de variáveis CSS, a criação de um interruptor de temas suspenso em vidro polido, a remoção da classe dark fixa do layout e a atualização dos backgrounds dinâmicos das páginas de navegação, autenticação e dashboard.

---

## Estrutura do Projeto

```text
specs/002-identidade-visual/
├── plan.md              # Este arquivo
├── research.md          # Pesquisa de variáveis OKLCH e escolhas estéticas
├── data-model.md        # Declaração de não aplicabilidade de dados
└── quickstart.md        # Instruções de validação ponta a ponta
```

---

## Modificações Propostas

### 1. Configurações Globais de Tema e Cores
- **[MODIFY] [providers.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/providers.tsx)**: Importar e envolver o aplicativo no `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>` do `next-themes`. Remover o atributo estático `theme="dark"` do `<Toaster />`.
- **[MODIFY] [layout.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/layout.tsx)**: Remover a classe estática `dark` da tag `<html>`.
- **[MODIFY] [globals.css](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/globals.css)**: Redefinir as variáveis do `:root` (Light Mode) e `.dark` (Dark Mode) para a paleta financeira esmeralda e prata, e adicionar as regras globais de vidro e foco.

### 2. Interruptor de Tema (Theme Switcher)
- **[NEW] [theme-toggle.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/components/theme-toggle.tsx)**: Criar um componente do lado do cliente que flutua no topo direito da tela (`fixed top-6 right-6 z-50`) com botão de vidro líquido e ícones dinâmicos de sol/lua.

### 3. Integração das Páginas
- **[MODIFY] [page.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/page.tsx)**: Renderizar o `<ThemeToggle />` e atualizar os blobs de líquido do background para usar verde esmeralda financeiro e prata/azul-celeste.
- **[MODIFY] [login/page.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/login/page.tsx)**: Renderizar o `<ThemeToggle />` e ajustar os blobs para a paleta esmeralda e prata.
- **[MODIFY] [register/page.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/register/page.tsx)**: Renderizar o `<ThemeToggle />` e ajustar os blobs para a paleta esmeralda e prata.
- **[MODIFY] [dashboard/page.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/dashboard/page.tsx)**: Renderizar o `<ThemeToggle />` no topo direito da barra de navegação principal, e ajustar os blobs.
- **[MODIFY] [navigation-dock.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/components/navigation-dock.tsx)**: Atualizar o LED ativo para verde esmeralda brilhante.

---

## Plano de Verificação

### Testes Automatizados
- Executar o build de produção do Next.js:
  ```bash
  npm run build
  ```

### Verificação Manual
- Alternar entre temas claro e escuro em todas as rotas e confirmar a harmonia das cores esmeralda/prata e transparências de vidro líquido.
