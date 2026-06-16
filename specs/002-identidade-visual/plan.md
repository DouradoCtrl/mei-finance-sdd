# Plano de Implementação: Identidade Visual Verde Premium com Gradientes e Glows

**Branch**: `002-identidade-visual` | **Date**: 2026-06-16 | **Spec**: [spec.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-identidade-visual/spec.md)

## Resumo do Objetivo

Implementação da identidade visual verde esmeralda com tema escuro (Dark Mode) padrão e estilo visual premium (similar ao GlowUI anterior) com efeitos de vidro (glassmorphism), glows e degrades. 

As modificações de design abrangem a página inicial de navegação (`/`), páginas de autenticação (`/login` e `/register`), notificações de toast e o painel pós-autenticação (`/dashboard`). Toda a integridade dos componentes originais do Shadcn UI (`components/ui/*`) será mantida intocada através de reestilização com CSS variáveis e classes utilitárias no Tailwind CSS v4.

---

## Verificação da Constituição

- **Arquitetura de Camadas (BFF / Next.js)**: PASS. Nenhuma chamada direta de API ou lógica de BFF é alterada.
- **Next.js e Shadcn UI (Desacoplamento de UI)**: PASS. Os estilos e glows utilizam variáveis CSS no `globals.css` e classes utilitárias no Tailwind. Os componentes em `components/ui/*` permanecem originais e intactos.
- **Validação de Erros de Campo e Toasts**: PASS. Mantida a exibição de mensagens de erro específicas e toasts globais estilizados.
- **Desenvolvimento Orientado a Especificações (SDD)**: PASS. A especificação `spec.md` foi atualizada.
- **Mensagens de Commit Semânticas**: PASS. Todos os commits serão semânticos e em português.

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

### 1. Configurações Globais
- **[MODIFY] [globals.css](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/globals.css)**: Estilos globais e variáveis de cores OKLCH ajustadas para tema escuro e verde. Inclusão da classe `.cn-toast` com efeito glassmorphic e sombra brilhante verde.

### 2. Portal de Navegação Inicial
- **[MODIFY] [page.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/page.tsx)**: Transformação da página raiz em um portal de navegação premium contendo links rápidos e cartões glassmorphic para as rotas `/login`, `/register` e `/dashboard`.

### 3. Telas de Login e Registro
- **[MODIFY] [login/page.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/login/page.tsx)**: Reestruturação da tela de login para adotar o layout de cartão único centralizado, glows verdes no background e inputs com foco neon verde.
- **[MODIFY] [register/page.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/register/page.tsx)**: Reestruturação da tela de registro para layout de cartão único centralizado, glows verdes no background e inputs com foco neon verde.

### 4. Painel pós-autenticação
- **[MODIFY] [dashboard/page.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/dashboard/page.tsx)**: Header transparente com desfoque de vidro, glows de fundo no painel e cards de dados com animação suave de elevação. Inclusão da área de segurança inferior (`pb-28`) para o Dock.
- **[NEW] [navigation-dock.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/components/navigation-dock.tsx)**: Componente de menu flutuante em formato de Dock no rodapé centralizado no estilo do macOS. Contém elevação interativa e tooltips no hover, ponto luminoso LED esmeralda sob o item da página ativa e botão de logout integrado.

### 5. Sistema de Notificações (Toasts)
- **[MODIFY] [providers.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/providers.tsx)**: Posicionamento do Toaster ajustado para o canto inferior direito (`bottom-right`).
- **[MODIFY] [globals.css](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/globals.css)**: Estilização do Toast `.cn-toast` com design glassmorphic de alta transparência, cantos arredondados (20px), padding de `16px 24px` e offset das bordas do viewport de `32px` via `--toast-viewport-padding`.

---

## Plano de Verificação

### Testes Automatizados
- Execução do build de produção do Next.js:
  ```bash
  npm run build
  ```

### Verificação Manual (no Navegador)
- Confirmar visualmente através de capturas de tela as páginas `/`, `/login`, `/register` e `/dashboard` no tema verde premium.
- Validar se o Dock de navegação flutua corretamente e reflete a página atual, bem como se os Toasts de login, registro e logout do Laravel aparecem de forma única e limpa no estilo macOS no canto inferior direito.
- Confirmar que nenhum arquivo em `nextjs/components/ui/*` foi modificado.
