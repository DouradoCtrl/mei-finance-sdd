# Research: Identidade Visual Verde e Tema Escuro

## Decisão de Design e Arquitetura

Definimos que a nova identidade visual do MEI Finance será baseada em um tema escuro (Dark Theme) padrão, com tons de verde esmeralda e menta como cores de destaque (Primary e Foco).

Para garantir a preservação da integridade dos componentes do Shadcn UI instalados na aplicação, todas as configurações visuais serão realizadas estritamente através das variáveis de tema expostas no arquivo `nextjs/app/globals.css` mapeadas pelo Tailwind v4.

## Variáveis de Cores (OKLCH) Escolhidas

Utilizaremos o espaço de cores `oklch`, nativo do CSS moderno e utilizado pelo Tailwind v4 no arquivo `globals.css` atual do projeto.

| Variável | Valor Escolhido | Significado Estético |
|---|---|---|
| `--background` | `oklch(0.12 0.015 150)` | Fundo principal da página (Cinza florestal extremamente escuro) |
| `--foreground` | `oklch(0.98 0.01 150)` | Cor de texto padrão da página (Off-white levemente esverdeado) |
| `--card` | `oklch(0.15 0.015 150)` | Fundo dos elementos de card (Cinza florestal escuro, ligeiramente mais claro que o background) |
| `--primary` | `oklch(0.65 0.18 145)` | Cor de destaque primária (Verde esmeralda/menta vibrante com alto contraste) |
| `--primary-foreground` | `oklch(0.10 0.05 145)` | Cor de texto sobre o destaque primário (Verde escuro profundo para máximo contraste) |
| `--secondary` | `oklch(0.22 0.02 150)` | Elementos secundários menos destacados (Cinza médio-escuro com tom verde) |
| `--border` | `oklch(0.22 0.02 150)` | Borda sutil de separação |
| `--ring` | `oklch(0.65 0.18 145)` | Anel de foco dos inputs (Verde primário) |

## Racional da Escolha

1. **Abordagem "Não-Invasiva"**: Alterando apenas as variáveis CSS globais no `globals.css`, os componentes do Shadcn UI (`components/ui/*`) herdam as cores automaticamente sem precisarem ser reescritos ou alterados.
2. **Tema Dark Nativo**: Swapping das configurações para colocar o tema Dark em `:root` no `globals.css` garante que o aplicativo inicialize e renderize no Dark Mode instantaneamente, sem flickering visual.
3. **Contraste Acessível (WCAG)**: A cor primária verde `oklch(0.65 0.18 145)` sob o fundo `oklch(0.12 0.015 150)` possui contraste aprovado para leitura confortável, assim como o texto `oklch(0.10 0.05 145)` sobre o verde primário.
