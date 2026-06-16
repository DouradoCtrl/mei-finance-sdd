# Plano de Implementação: Identidade Visual Verde e Tema Escuro

**Branch**: `002-identidade-visual` | **Date**: 2026-06-16 | **Spec**: [spec.md](file:///home/dourado-dev/Documentos/git-projects/git-sdd/mei-finance-sdd/specs/002-identidade-visual/spec.md)

**Input**: Feature specification from `/specs/002-identidade-visual/spec.md`

## Resumo

Implementação do tema escuro (Dark Mode) como padrão na aplicação Next.js do MEI Finance, adicionando a cor verde esmeralda/menta como cor primária e de destaque visual. A estilização será feita puramente na camada de configuração do Tailwind CSS v4 (`nextjs/app/globals.css` e `nextjs/app/layout.tsx`), alterando as variáveis de tema CSS para que todos os componentes Shadcn UI (`components/ui/*`) herdem as novas cores automaticamente, sem alteração de seus códigos-fonte originais.

## Contexto Técnico

**Language/Version**: TypeScript / Next.js 15 (React 19)

**Primary Dependencies**: Tailwind CSS v4, Radix UI, Shadcn UI

**Storage**: N/A (Não aplicável)

**Testing**: Validação visual de rotas locais e execução bem-sucedida de `npm run build`

**Target Platform**: Navegadores Web (Chrome, Firefox, Safari, Edge)

**Project Type**: Frontend Web Application

**Performance Goals**: Tempo de renderização inicial do tema escuro instantâneo, sem flashes de luz (flicker) ao carregar.

**Constraints**: Garantir conformidade de contraste de cores WCAG AA (mínimo de 4.5:1 para textos legíveis).

**Scale/Scope**: Todas as telas e componentes atuais e futuros do frontend Next.js.

## Verificação da Constituição

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Arquitetura de Camadas (BFF / Next.js)**: PASS. Nenhuma chamada direta de API ou lógica de BFF é alterada.
- **Next.js e Shadcn UI (Desacoplamento de UI)**: PASS. O plano utiliza estritamente variáveis CSS globais no `globals.css` para aplicar o estilo. Os arquivos em `components/ui/*` permanecem originais e intocados.
- **Validação de Erros de Campo e Toast**: PASS. Os componentes herdam o tema mantendo a funcionalidade de erros em blocos de texto vermelhos e toasts globais conforme a versão 1.3.1 da Constituição.
- **Desenvolvimento Orientado a Especificações (SDD)**: PASS. A especificação `spec.md` em português foi devidamente criada.
- **Mensagens de Commit Semânticas**: PASS. Todos os commits serão semânticos e em português.

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/002-identidade-visual/
├── plan.md              # Este arquivo
├── research.md          # Pesquisa de variáveis OKLCH e escolhas estéticas
├── data-model.md        # Declaração de não aplicabilidade de dados
└── quickstart.md        # Instruções de validação ponta a ponta
```

### Código Fonte (diretórios envolvidos)

```text
nextjs/
├── app/
│   ├── globals.css      # Onde as variáveis do tema escuro e verde serão declaradas
│   └── layout.tsx       # Onde o tema escuro (.dark) e classes de body serão ajustados
```

**Decisão de Estrutura**: Modificação pontual e centralizada dos arquivos de configuração visual globais (`globals.css` e `layout.tsx`) na aplicação Next.js.

## Rastreamento de Complexidade

Nenhum desvio ou violação dos princípios da Constituição foi identificado ou é necessário para esta funcionalidade.
