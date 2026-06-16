# Feature Specification: Identidade Visual Financeira iPhone Liquid Glass (Multitema Esmeralda e Prata)

**Feature Branch**: `002-identidade-visual`

**Created**: 2026-06-16

**Status**: Approved

**Input**: User description: "criar uma identidade visual financeira, no estilo liquid glass do iphone, nas cores verde esmeralda e prata, com suporte a multitema (claro e escuro) gerenciado por next-themes e botão de alternância de tema em vidro, com foco líquido e bordas prateadas selecionadas nos inputs"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Multitema Dinâmico via next-themes (Priority: P1)

Como usuário do MEI Finance, eu quero poder alternar dinamicamente entre os temas Claro (Light Mode) e Escuro (Dark Mode) através de um botão flutuante de vidro, com o aplicativo iniciando em Dark Mode por padrão, para que eu tenha uma experiência personalizada e confortável a qualquer momento.

**Why this priority**: Fundamental para a acessibilidade e preferências do usuário. A flexibilidade de alternar de tema em tempo real enriquece a experiência visual sem quebrar as texturas de vidro líquido.

**Independent Test**: Acessar a aplicação, confirmar que ela carrega em Dark Mode por padrão. Clicar no botão flutuante de alternância de tema no topo direito e confirmar que a classe `dark` é removida da tag `<html>` e a classe `light` é injetada, modificando instantaneamente o esquema de cores para Light Glass.

**Acceptance Scenarios**:

1. **Given** que o usuário acessa a página inicial pela primeira vez, **When** ela carrega, **Then** o tema padrão deve ser Dark Mode (fundo esmeralda-carvão escuro e texto prata off-white).
2. **Given** que a aplicação está carregada, **When** o usuário clica no botão de alternância de tema (Theme Toggle), **Then** os fundos devem mudar para prateado/menta claro, os cartões para vidro branco brilhante e os textos para tons escuros, com transição suave.

---

### User Story 2 - Estética Financeira iPhone Liquid Glass e Foco Líquido (Priority: P1)

Como usuário, eu quero que a plataforma exiba um design "liquid glass" inspirado nos acabamentos dinâmicos do iPhone combinando as cores verde esmeralda (representando o tema financeiro de crescimento e controle) e prata metálico. Isso inclui formas fluidas orgânicas esmeralda e prata no background, cartões com efeito de vidro polido altamente reflexivo (dark smoke glass no tema escuro, light glass no tema claro) e inputs de formulário com bordas prateadas brilhantes e anéis luminosos de foco quando selecionados.

**Why this priority**: Crucial para alinhar a personalidade visual do MEI Finance com o mercado financeiro profissional. A combinação esmeralda/prata e a estética de vidro polido trazem credibilidade, luxo e alta interatividade para a interface.

**Independent Test**: Testar visualmente a aplicação no navegador em ambos os temas, observando os blobs líquidos verdes e prateados flutuando sob os cartões de vidro, e focar nos inputs para certificar-se da borda prateada brilhante.

**Acceptance Scenarios**:

1. **Given** que o botão de login/registro está visível, **When** o usuário passa o mouse ou o pressiona, **Then** ele deve ter acabamento reflexivo de vidro com gradiente metálico brilhante de alta definição.
2. **Given** que o usuário clica ou foca em qualquer campo de texto (Input), **When** o campo recebe o foco, **Then** a sua borda deve se tornar prateada/branca e um anel glow líquido prateado deve iluminar o campo.
3. **Given** que a página é renderizada, **When** o fundo é exibido, **Then** bolhas fluidas e orgânicas esmeraldas e prateadas devem flutuar lentamente.over lentamente em rotações e transições tridimensionais suaves.

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

1. **Given** que o usuário acessa a página raiz, **When** a página rendeira, **Then** devem ser exibidos 3 cartões explicativos contendo botões que redirecionam respectivamente para as páginas de login, cadastro e dashboard.

---

### User Story 5 - Menu Flutuante macOS Navigation Dock (Priority: P1)

Como usuário autenticado, eu quero navegar pela aplicação utilizando um menu suspenso flutuante em formato de Dock semelhante ao do macOS no rodapé centralizado da tela, para que a navegação seja moderna, visualmente limpa (substituindo sidebars rígidas) e contenha micro-animações elegantes.

**Independent Test**: Acessar o Dashboard e verificar a presença do Dock flutuante no rodapé centralizado, inspecionando visualmente se os ícones elevam e aumentam ao passar o mouse (hover) e se o ponto indicador (LED branco) é exibido apenas abaixo da rota correspondente ativa.

**Acceptance Scenarios**:
1. **Given** que o usuário está no Dashboard, **When** ele passa o cursor do mouse sobre os ícones do Dock, **Then** o ícone deve subir (`translateY(-6px)`) e aumentar (`scale(1.15)`) de tamanho de forma suave com um tooltip explicativo aparecendo acima dele.
2. **Given** que o usuário está navegando na rota `/dashboard`, **When** o Dock é renderizado, **Then** deve aparecer um ponto luminoso prateado/branco brilhante (LED neon) centralizado sob o ícone de Dashboard.
3. **Given** que o usuário clica no botão "Sair" do Dock, **When** a ação é disparada, **Then** a sessão deve ser destruída e o usuário redirecionado ao login de forma autônoma.

---

### User Story 6 - Toasts com Glassmorphism iOS e Margem Ampliada (Priority: P2)

Como usuário do sistema, eu quero que as notificações Toasts flutuem no canto inferior direito com um visual glassmorphic (vidro translúcido) e um recuo generoso das bordas da tela, para que tenham um design alinhado ao ecossistema do macOS/iOS e não obstruam conteúdos colados aos limites da tela.

**Independent Test**: Disparar um Toast de aviso e certificar-se de que ele renderiza com cantos redondos de 20px, fundo desfocado semi-transparente, e um distanciamento de 32px das bordas da tela.

**Acceptance Scenarios**:
1. **Given** que um Toast é disparado, **When** ele surge na tela, **Then** ele deve flutuar no canto inferior direito e ter um distanciamento de `32px` tanto da borda direita quanto da borda inferior.
2. **Given** que o Toast está ativo, **When** o fundo da tela se move sob o Toast, **Then** deve ser perceptível o efeito de desfoque de vidro (`backdrop-blur`) com bordas finas com leve glow prateado.

---

### User Story 7 - Mensagens de Feedback Dinâmicas da API (Priority: P1)

Como usuário, eu quero que todas as mensagens exibidas nos Toasts (registro, login, logout) e as validações de campos venham em tempo real do backend Laravel, para que o front-end reflita com precisão o estado de validação de negócios e evite mensagens estáticas/hardcoded.

**Independent Test**: Submeter formulários vazios (sem atributo `required`) e verificar que os Toasts e os textos de erro exibidos abaixo dos campos correspondem exatamente às mensagens do JSON de resposta HTTP retornado pelo Laravel.

**Acceptance Scenarios**:
1. **Given** que a API do Laravel retorna `"Sessão encerrada com sucesso."` no logout, **When** o usuário é redirecionado ao login, **Then** o Toast de login deve exibir essa mensagem exata capturada do backend.
2. **Given** que o usuário tenta submeter o formulário de login em branco, **When** a requisição retorna da API, **Then** os erros de validação do Laravel para e-mail e senha devem ser exibidos sob cada campo correspondente.

---

### Edge Cases

- **Preferências do Sistema Operacional (Prefers Color Scheme)**: Se o usuário tiver uma preferência de cor nativa no sistema operacional, ela deve ser ignorada para forçar o tema escuro padrão do MEI Finance, a menos que uma opção explícita de troca de tema seja implementada futuramente.
- **Contraste de Acessibilidade (WCAG)**: Ao utilizar o tema escuro com prata, as cores de texto sobrepostas ao prata (ex: texto dentro do botão primário) devem ter contraste suficiente para conformidade de leitura (daí o uso de chumbo escuro para o primary-foreground).
- **Duplicação de Toasts no StrictMode**: O front-end deve usar técnicas de limpeza (ex: `window.history.replaceState`) ao ler mensagens de query strings para que remontagens do componente React em modo de desenvolvimento não causem disparos de Toasts duplicados.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST integrar o `next-themes` com suporte a classes de tema (`attribute="class"`), definindo o Dark Mode como padrão inicial.
- **FR-002**: O fundo da aplicação (`--background`) MUST ser configurado com tom carvão-esmeralda escuro no Dark Mode (`oklch(0.08 0.006 160)`) e prata-menta claro no Light Mode (`oklch(0.97 0.003 160)`).
- **FR-003**: A cor primária (`--primary`) MUST ser definida com um tom de prata brilhante (`oklch(0.92 0.005 240)`) para destaques e botões primários.
- **FR-004**: O texto principal MUST ter contraste WCAG em ambos os temas.
- **FR-005**: Os cartões de dados (Cards) MUST ser estilizados globalmente com efeito glassmorphic (vidro escurecido no Dark Mode e vidro branco brilhante no Light Mode) com desfoque de fundo de alta definição e bordas finas refletivas.
- **FR-006**: Todas as reestilizações de cores e temas MUST ser declaradas estritamente nos arquivos de configuração global (`nextjs/app/globals.css`), sem alterar os componentes originais de `nextjs/components/ui/*`.
- **FR-007**: A rota raiz `/` MUST exibir um portal de navegação contendo atalhos e cards elegantes em vidro para as páginas `/login`, `/register` e `/dashboard`.
- **FR-008**: O painel principal (Dashboard) MUST utilizar um menu em formato de Dock flutuante no rodapé centralizado no estilo macOS para navegação interna e logout.
- **FR-009**: O Dock MUST exibir animações de elevação (`translateY(-6px)`) e redimensionamento (`scale(1.15)`) no hover, tooltips superiores e um ponto luminoso LED verde esmeralda sob o item ativo.
- **FR-010**: Os Toasts do sistema MUST possuir design glassmorphic de alta transparência e ser posicionados no canto inferior direito com offset de 32px e padding de `16px 24px`.
- **FR-011**: O front-end MUST delegar a validação ao backend Laravel removendo atributos `required` HTML5 e exibindo dinamicamente as mensagens retornadas nos Toasts ou blocos de erro por campo.
- **FR-012**: O front-end MUST limpar parâmetros da URL como `?message=...` imediatamente após lê-los para evitar Toasts duplicados no StrictMode do React.
- **FR-013**: O sistema MUST exibir formas fluidas orgânicas no background (verde esmeralda e prata metálico/azul-celeste), animadas em câmera lenta (Liquid Wallpaper).
- **FR-014**: Os inputs de formulários MUST adotar uma borda prateada nítida e um anel glow prateado líquido ao receberem o foco ou serem selecionados.
- **FR-015**: O sistema MUST renderizar um botão de vidro flutuante de alternância de tema (Theme Toggle) contendo ícones dinâmicos de sol/lua no canto superior direito de todas as telas.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das páginas da aplicação (`/`, `/login`, `/register`, `/dashboard`, etc.) carregam no tema escuro por padrão na primeira visita.
- **SC-002**: A cor prata definida é exibida consistentemente em todos os botões primários, links ativos e estados de foco de inputs da aplicação.
- **SC-003**: A taxa de conformidade de contraste WCAG AA (mínimo de 4.5:1 para texto normal e 3:1 para elementos gráficos) deve ser atendida em todas as combinações de cores principais.
- **SC-004**: Zero (0) linhas de código nos arquivos da pasta `components/ui/*` são alteradas para aplicar a identidade visual.
- **SC-005**: A navegação da página inicial leva o usuário com sucesso a qualquer uma das páginas com apenas 1 clique.
- **SC-006**: O Dock de navegação flutua centralizado no rodapé do Dashboard, responde a interações de hover de forma responsiva e indica a página ativa de forma inequívoca com um ponto de LED.
- **SC-007**: Os Toasts de sucesso e erro utilizam 100% as mensagens dinâmicas retornadas da API do Laravel.
- **SC-008**: Toasts são disparados uma única vez por fluxo, sem duplicidades na tela de login ou dashboard devido a remontagens de componentes.
- **SC-009**: O Toaster exibe notificações no canto inferior direito com margem (offset) de 32px e padding interno de `16px 24px`, alinhado ao guia visual do macOS/iOS.
- **SC-010**: Os inputs de todas as telas exibem o destaque de borda e ring brilhante de foco ao serem selecionados por teclado ou clique.
- **SC-011**: As formas fluidas no background são renderizadas e animadas continuamente sem causar lags ou problemas de performance na renderização.
- **SC-012**: O usuário consegue alternar o tema do app clicando no botão flutuante, refletindo as alterações no background, cards, textos, inputs e toaster instantaneamente.
- **SC-013**: A paleta de cores verde esmeralda e prata metálico é exibida de forma harmônica e integrada em ambos os temas.
