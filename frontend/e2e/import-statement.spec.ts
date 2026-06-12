import { test, expect } from '@playwright/test';

test('login, upload OFX, confirm, and verify May transactions with bank name Nu Pagamentos S.A.', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL || 'user@example.com';
  const password = process.env.TEST_USER_PASSWORD || 'Password123';
  const ofxPath = process.env.TEST_OFX_PATH || 'path/to/extrato.ofx';

  // 1. Ir para a página de login
  console.log('Navegando para a página de login...');
  await page.goto('/login');
  
  // 2. Preencher formulário de login
  console.log('Preenchendo e-mail e senha...');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');

  // 3. Aguardar redirecionamento para o dashboard
  console.log('Aguardando login...');
  await page.waitForURL('**/dashboard');
  console.log('Login efetuado com sucesso!');

  // 4. Ir para a página de Receitas / Fluxo de Caixa
  console.log('Navegando para a página de Receitas...');
  await page.goto('/dashboard/receitas');

  // 5. Clicar em "Importar Extrato OFX"
  console.log('Abrindo modal de importação...');
  await page.click('text=Importar Extrato OFX');

  // 6. Fazer upload do arquivo OFX
  console.log('Selecionando arquivo OFX...');
  await page.setInputFiles('input[type="file"]', ofxPath);

  // 7. Clicar em "Processar Extrato"
  console.log('Processando extrato...');
  await page.click('text=Processar Extrato');

  // 8. Confirmar importação
  console.log('Aguardando processamento e confirmando...');
  // Aguarda carregar a tabela temporária e o botão de confirmação
  await page.waitForSelector('text=Confirmar Fechamento');
  await page.click('text=Confirmar Fechamento');

  // 8.5. Selecionar a aba "Todas"
  console.log('Selecionando a aba "Todas"...');
  await page.click('button:has-text("Todas")');

  // 9. Alterar período para "Mês Passado" no cabeçalho
  console.log('Selecionando "Mês Passado" no filtro de período...');
  await page.selectOption('select:has(option[value="last_month"])', 'last_month');

  // 10. Verificar se as transações de Maio e o badge do banco aparecem
  console.log('Verificando se as transações de Maio foram carregadas...');
  await page.waitForSelector('span:has-text("NU PAGAMENTOS S.A.")');
  const badge = page.locator('span:has-text("NU PAGAMENTOS S.A.")').first();
  await expect(badge).toBeVisible();
  console.log('Sucesso: O badge "NU PAGAMENTOS S.A." está visível no histórico!');

  // 11. Testar Edição de Apelido (Alias) Inline
  console.log('Testando edição de apelido inline...');
  const descCell = page.locator('td.group').first();
  await descCell.hover();

  // Clica no lápis de editar apelido
  await descCell.locator('button[title="Editar Apelido"]').click();

  // Digita o novo apelido
  console.log('Digitando novo apelido...');
  const input = descCell.locator('input[type="text"]');
  await input.fill('Super Pix do Samuel');
  await page.keyboard.press('Enter');

  // Verifica se o apelido foi salvo e renderizado no DOM
  console.log('Verificando persistência visual do apelido...');
  await expect(descCell.locator('text=Super Pix do Samuel')).toBeVisible();
  console.log('Sucesso: Apelido salvo e exibido!');
});
