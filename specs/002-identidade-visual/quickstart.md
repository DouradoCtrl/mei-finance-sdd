# Guia de Validação Rápida: Identidade Visual Verde e Tema Escuro

Este guia detalha como executar a verificação e validar que a nova identidade visual foi aplicada com sucesso de ponta a ponta na aplicação frontend do Next.js.

## Pré-requisitos
- Node.js instalado (v18 ou superior).
- Dependências do frontend Next.js instaladas.

## Passos para Validação

### 1. Inicializar o servidor de desenvolvimento do Next.js
No diretório `nextjs/`, execute o servidor local:
```bash
npm run dev
```

### 2. Validação Visual do Tema Escuro
1. Abra um navegador (preferencialmente em modo privado ou limpando o cache).
2. Acesse `http://localhost:3000/login`.
3. **Resultado Esperado**:
   - A página deve renderizar instantaneamente em tema escuro (fundo cinza escuro florestal profundo).
   - O contraste do texto principal deve ser nítido e legível (cor clara off-white).

### 3. Validação Visual dos Elementos Verdes
1. Na mesma tela de login ou na de registro (`http://localhost:3000/register`), inspecione o botão de submissão do formulário.
2. **Resultado Esperado**:
   - O botão deve apresentar a cor de fundo verde esmeralda vibrante.
   - Ao passar o mouse por cima (hover), deve sofrer uma mudança sutil na luminosidade do verde.
   - O texto interno do botão (ex: "Entrar" ou "Criar minha conta") deve ser verde-escuro profundo ou branco, garantindo alta legibilidade.
3. Fique focado em um campo de entrada de texto (Input).
4. **Resultado Esperado**:
   - O contorno (ring) do input focado deve mudar para verde.

### 4. Validação da Integridade do Shadcn UI
1. Abra o arquivo do componente de botão `nextjs/components/ui/button.tsx`.
2. Verifique se há alguma classe como `bg-emerald-500` ou `text-green-950` codificada diretamente.
3. **Resultado Esperado**:
   - Nenhuma linha de código deve ter sido adicionada ou modificada nos arquivos internos da pasta `components/ui/*`. Toda a estilização deve ser delegada ao `globals.css`.
