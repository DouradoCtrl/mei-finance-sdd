# Feature Specification: Identidade Visual Verde Premium com Tema Escuro

**Feature Branch**: `002-identidade-visual`

**Created**: 2026-06-16

**Status**: Approved

**Input**: User description: "criar uma identidade visual, cor verde e tema dark como padrao, similar ao GlowUI anterior com gradientes e glows na autenticacao, toaster, registro e dashboard, com portal de navegação na rota raiz"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tema Escuro por Padrão (Priority: P1)

Como usuário do MEI Finance (visitante ou autenticado), eu quero que a plataforma carregue automaticamente no tema escuro por padrão, para que eu tenha uma experiência visual moderna, confortável para visualização em ambientes de baixa luminosidade e com aparência premium.

**Why this priority**: Crítico para a definição da nova identidade visual base. O tema escuro padrão define toda a atmosfera estética da aplicação e garante consistência visual imediata.

**Independent Test**: Pode ser testado de forma independente acessando qualquer rota da aplicação (`/`, `/login`, `/register`, `/dashboard`) em um navegador limpo e confirmando que a tela é renderizada com fundo escuro e textos claros, mesmo que o sistema operacional do usuário esteja configurado com preferência para tema claro.

**Acceptance Scenarios**:

1. **Given** que o usuário abre o navegador na tela de login, **When** a página carrega, **Then** o fundo da tela deve ser escuro (charcoal/dark gray) e os textos principais devem ser claros (off-white).
2. **Given** que a preferência do sistema operacional do usuário está configurada como "Light Mode", **When** o usuário acessa a plataforma, **Then** o site ainda assim deve renderizar em Dark Mode.

---

### User Story 2 - Identidade Visual Verde e Glows (Priority: P1)

Como usuário, eu quero que os elementos interativos, estados ativos, backgrounds e componentes de destaque utilizem tonalidades de verde e esmeralda com degrades e glows, para que a marca da aplicação seja reconhecível e transmita profissionalismo e modernidade.

**Why this priority**: Crucial para dar a "personalidade" visual ao sistema. A cor verde é a cor principal da identidade visual definida pelo usuário.

**Independent Test**: Pode ser testado inspecionando elementos interativos (como o botão de submissão do formulário, links e inputs focados) e verificando visualmente que eles usam o tom verde/esmeralda definido no guia de estilos.

**Acceptance Scenarios**:

1. **Given** que o botão de login/registro está visível, **When** o usuário olha para o botão, **Then** ele deve ter o fundo verde (Primary color) em gradiente.
2. **Given** que o usuário foca em um campo de texto (Input), **When** o campo recebe o foco, **Then** a borda de foco (ring/outline) deve adotar um contorno verde brilhante/esmeralda.

---

### User Story 3 - Preservação dos Componentes Originais do Shadcn UI (Priority: P2)

Como desenvolvedor/arquiteto, eu quero que as mudanças de cor e tema sejam feitas exclusivamente por meio de variáveis globais de CSS e configuração do Tailwind, para que os componentes originais instalados na pasta `components/ui/*` permaneçam intocados.

**Why this priority**: Importante para manutenibilidade. Evita que atualizações futuras ou adições de novos componentes do Shadcn exijam reestilização manual do código dos componentes.

**Independent Test**: Pode ser testado verificando se os arquivos dentro de `nextjs/components/ui/` não possuem classes Tailwind de cor customizadas codificadas diretamente (hardcoded) e se respondem perfeitamente às variáveis do `globals.css`.

**Acceptance Scenarios**:

1. **Given** um componente Shadcn original (como o Button), **When** alteramos a variável `--primary` no CSS global, **Then** a cor de fundo do botão deve mudar automaticamente sem qualquer alteração no arquivo `button.tsx`.

---

### User Story 4 - Portal de Navegação Inicial (Priority: P2)

Como testador ou usuário, eu quero que a rota inicial `/` sirva como um index contendo cartões e atalhos com design de vidro (glassmorphic) para navegar facilmente para `/login`, `/register` e `/dashboard`, agilizando meus testes de fluxo visual e autenticação.

**Why this priority**: Facilita a navegação rápida e a validação do design em múltiplos dispositivos e navegadores.

**Independent Test**: Acessar o endereço raiz `http://localhost:3000/` e confirmar que a página renderiza cartões com links diretos de redirecionamento funcionando com êxito.

**Acceptance Scenarios**:

1. **Given** que o usuário acessa a página raiz, **When** a página renderiza, **Then** devem ser exibidos 3 cartões explicativos contendo botões que redirecionam respectivamente para as páginas de login, cadastro e dashboard.

---

### Edge Cases

- **Preferências do Sistema Operacional (Prefers Color Scheme)**: Se o usuário tiver uma preferência de cor nativa no sistema operacional, ela deve ser ignorada para forçar o tema escuro padrão do MEI Finance, a menos que uma opção explícita de troca de tema seja implementada futuramente.
- **Contraste de Acessibilidade (WCAG)**: Ao utilizar o tema escuro com verde, as cores de texto sobrepostas ao verde (ex: texto dentro do botão primário) devem ter contraste suficiente para conformidade de leitura.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST aplicar a classe `.dark` ou configurar as variáveis globais de `:root` de modo que a aplicação seja renderizada em tema escuro por padrão.
- **FR-002**: O fundo da aplicação (`--background`) MUST ser configurado com uma tonalidade escura (ex: oklch ou HSL equivalente a um cinza/charcoal profundo ou verde-escuro florestal extremamente escuro).
- **FR-003**: A cor primária (`--primary`) MUST ser definida com um tom de verde de alto contraste e boa saturação (ex: verde esmeralda ou verde menta vibrante).
- **FR-004**: O texto sobre o fundo primário (`--primary-foreground`) MUST possuir contraste adequado (ex: branco ou verde escuro profundo).
- **FR-005**: As variáveis de borda (`--border`), entrada (`--input`) e anel de foco (`--ring`) MUST ser adaptadas para harmonizar com a paleta escura e verde.
- **FR-006**: Todas as reestilizações de cores e temas MUST ser declaradas estritamente nos arquivos de configuração global (`nextjs/app/globals.css` e `nextjs/tailwind.config.ts`), sem alterar os arquivos em `nextjs/components/ui/*`.
- **FR-007**: A rota raiz `/` MUST exibir um portal de navegação contendo atalhos e cards elegantes para as páginas `/login`, `/register` e `/dashboard`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das páginas da aplicação (`/`, `/login`, `/register`, `/dashboard`, etc.) carregam no tema escuro por padrão na primeira visita.
- **SC-002**: A cor verde definida é exibida consistentemente em todos os botões primários, links ativos e estados de foco de inputs da aplicação.
- **SC-003**: A taxa de conformidade de contraste WCAG AA (mínimo de 4.5:1 para texto normal e 3:1 para elementos gráficos) deve ser atendida em todas as combinações de cores principais (ex: texto sobre botão primário verde e texto claro sobre fundo escuro).
- **SC-004**: Zero (0) linhas de código nos arquivos da pasta `components/ui/*` são alteradas para aplicar a identidade visual.
- **SC-005**: A navegação da página inicial leva o usuário com sucesso a qualquer uma das páginas com apenas 1 clique.
