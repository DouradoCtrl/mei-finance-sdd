# Feature Specification: Identidade Visual Prata, Cinza Espacial e iPhone Liquid Glass com Tema Escuro

**Feature Branch**: `002-identidade-visual`

**Created**: 2026-06-16

**Status**: Approved

**Input**: User description: "criar uma identidade visual, cor prata/cinza e tema dark como padrao, similar ao de glass do iphone, com gradientes e glows na autenticacao, toaster, registro e dashboard, com portal de navegação na rota raiz e dock do macOS, com foco líquido e bordas prateadas selecionadas nos inputs de formulários"

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

### User Story 2 - Estética iPhone Liquid Glass e Foco Líquido (Priority: P1)

Como usuário, eu quero que a plataforma exiba um design "liquid glass" inspirado nos wallpapers e acabamentos dinâmicos do iPhone, com formas fluidas orgânicas que se movem lentamente no plano de fundo, cartões com efeito de vidro polido altamente transparente e reflexivo, e campos de entrada de formulários (Inputs) que ao serem selecionados revelem uma borda prateada nítida envolta por um glow prateado de luz neon.

**Why this priority**: Crucial para dar a "personalidade" visual premium definida pelo usuário. A estética de vidro líquido e o feedback nítido de foco nos inputs tornam a experiência interativa extremamente fluida e sofisticada.

**Independent Test**: Testar visualmente a aplicação no navegador passando e focando o cursor nos inputs para ver a borda prateada brilhante, e observar os elementos fluidos em câmera lenta flutuando sob os cartões glassmorphic.

**Acceptance Scenarios**:

1. **Given** que o botão de login/registro está visível, **When** o usuário passa o mouse ou o pressiona, **Then** ele deve se comportar como um botão de vidro metálico do iPhone (linear gradient metálico brilhante e sombra reflexiva).
2. **Given** que o usuário clica ou foca em qualquer campo de texto (Input), **When** o campo recebe o foco, **Then** a sua borda deve se tornar prateada/branca brilhante e um anel (ring) de glow sutil prateado deve surgir em volta dele.
3. **Given** que a página é carregada, **When** o usuário visualiza o fundo, **Then** bolhas fluidas e orgânicas (degrade cinza metálico e azul escuro) devem se mover lentamente em rotações e transições tridimensionais suaves.

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

- **FR-001**: O sistema MUST aplicar a classe `.dark` ou configurar as variáveis globais de `:root` de modo que a aplicação seja renderizada em tema escuro por padrão.
- **FR-002**: O fundo da aplicação (`--background`) MUST ser configurado com uma tonalidade escura (ex: oklch ou HSL equivalente a um cinza/charcoal profundo ou azul-gelo metálico extremamente escuro).
- **FR-003**: A cor primária (`--primary`) MUST ser definida com um tom de prata de alto contraste e boa saturação metálica (ex: prata escovado brilhante).
- **FR-004**: O texto sobre o fundo primário (`--primary-foreground`) MUST possuir contraste adequado (ex: chumbo/grafite escuro profundo).
- **FR-005**: As variáveis de borda (`--border`), entrada (`--input`) e anel de foco (`--ring`) MUST ser adaptadas para harmonizar com a paleta escura, chumbo e prata.
- **FR-006**: Todas as reestilizações de cores e temas MUST ser declaradas estritamente nos arquivos de configuração global (`nextjs/app/globals.css` e `nextjs/tailwind.config.ts`), sem alterar os arquivos em `nextjs/components/ui/*`.
- **FR-007**: A rota raiz `/` MUST exibir um portal de navegação contendo atalhos e cards elegantes para as páginas `/login`, `/register` e `/dashboard`.
- **FR-008**: O painel principal (Dashboard) MUST utilizar um menu em formato de Dock flutuante no rodapé centralizado no estilo macOS para navegação interna e logout.
- **FR-009**: O Dock MUST exibir animações de elevação (`translateY(-6px)`) e redimensionamento (`scale(1.15)`) no hover de cada item, tooltips superiores e um ponto luminoso de LED branco prateado sob o ícone ativo.
- **FR-010**: Os Toasts do sistema MUST possuir design glassmorphic de alta transparência com desfoque de fundo (blur) e ser posicionados no canto inferior direito com um distanciamento de `32px` da borda do viewport e padding interno ampliado de `16px 24px`.
- **FR-011**: O front-end MUST delegar a validação ao backend Laravel removendo atributos `required` HTML5 e exibindo dinamicamente as mensagens retornadas nos Toasts ou blocos de erro por campo.
- **FR-012**: O front-end MUST limpar parâmetros da URL como `?message=...` imediatamente após lê-los para evitar Toasts duplicados no StrictMode do React.
- **FR-013**: O sistema MUST exibir formas fluidas orgânicas no background de login, cadastro, home e dashboard, animadas em câmera lenta (Liquid Wallpaper).
- **FR-014**: Os inputs de formulários MUST adotar uma borda prateada nítida e um anel glow prateado líquido ao receberem o foco ou serem selecionados.

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
