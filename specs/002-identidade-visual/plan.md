# Plano de Implementação: Identidade Visual Prata, Cinza Espacial e iPhone Liquid Glass com Tema Escuro

**Branch**: `002-identidade-visual` | **Date**: 2026-06-16 | **Spec**: [spec.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-identidade-visual/spec.md)

## Resumo do Objetivo

Implementação da identidade visual cinza espacial/prata escuro com tema escuro (Dark Mode) padrão e estilo visual premium iPhone Liquid Glass, contendo efeitos de vidro polido altamente transparente (glassmorphism), bolhas líquidas dinâmicas flutuantes no fundo em câmera lenta e destaque prateado/brilhante de foco para inputs de formulários selecionados. 

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
- **[MODIFY] [globals.css](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/globals.css)**: Estilos globais e variáveis de cores OKLCH ajustadas para tema escuro, prata e cinza espacial. Inclusão das animações de bolhas de fluidos dinâmicos (`@keyframes float-liquid`), classe `.liquid-glass-card` (vidro polido altamente reflexivo), classe `.btn-liquid-glass` (botões com degradê metálico) e a definição global de foco de inputs com borda prateada brilhante e anel de brilho suave.

### 2. Portal de Navegação Inicial
- **[MODIFY] [page.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/page.tsx)**: Substituição dos fundos estáticos por bolhas de líquido fluidas animadas no background e atualização dos cartões de atalho para adotar o estilo `.liquid-glass-card` e o botão principal para `.btn-liquid-glass`.

### 3. Telas de Login e Registro
- **[MODIFY] [login/page.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/login/page.tsx)**: Substituição do fundo por bolhas de líquido fluidas animadas, aplicação da classe `.liquid-glass-card` no painel centralizado, botão submeter com `.btn-liquid-glass` e remoção dos overrides de foco inline dos inputs para aplicar o visual global de foco de vidro líquido.
- **[MODIFY] [register/page.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/register/page.tsx)**: Substituição do fundo por bolhas de líquido fluidas animadas, aplicação da classe `.liquid-glass-card`, botão com `.btn-liquid-glass` e remoção dos overrides inline de foco dos inputs.

### 4. Painel pós-autenticação
- **[MODIFY] [dashboard/page.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/dashboard/page.tsx)**: Remoção das referências estáticas esmeralda na tela de carregamento, inclusão de bolhas fluidas animadas no background e aplicação de cartões `.liquid-glass-card` nos painéis de estatísticas e perfil contábil.
- **[MODIFY] [navigation-dock.tsx](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/components/navigation-dock.tsx)**: Refinamento visual da bandeja do Dock para vidro de alta definição com borda fina branca semitransparente refletiva (`border-white/10`) e sombra líquida.

### 5. Sistema de Notificações (Toasts)
- **[MODIFY] [globals.css](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/nextjs/app/globals.css)**: Estilização do Toast `.cn-toast` com design glassmorphic de alta transparência, cantos arredondados (20px), padding de `16px 24px` e offset das bordas do viewport de `32px` via `--toast-viewport-padding`, com glow prateado metálico.

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
