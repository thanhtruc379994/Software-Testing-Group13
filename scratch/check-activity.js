// Script debug selector Activity Log - dùng API trực tiếp để login
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login bằng /Admin/Login (đúng URL admin)
  console.log('Going to admin login...');
  await page.goto('http://localhost:8080/Admin/Login', { waitUntil: 'load', timeout: 30000 });
  console.log('URL:', page.url());

  // In toàn bộ HTML form để debug
  const pageTitle = await page.title();
  console.log('Title:', pageTitle);

  // Tìm inputs
  const inputs = await page.$$eval('input', els => els.map(e => ({ id: e.id, name: e.name, type: e.type, placeholder: e.placeholder })));
  console.log('Inputs:', JSON.stringify(inputs, null, 2));

  const buttons = await page.$$eval('button, input[type="submit"]', els => els.map(e => ({ id: e.id, text: (e.innerText || e.value || '').trim(), type: e.type })));
  console.log('Buttons:', JSON.stringify(buttons, null, 2));

  // Thử fill và submit
  try {
    await page.fill('input[name="Email"], #Email', 'admin@yourstore.com');
    await page.fill('input[name="Password"], #Password', '@Truc27102005');
    await page.click('button[type="submit"], input[type="submit"]');
    await page.waitForTimeout(3000);
    console.log('URL after submit:', page.url());
  } catch (e) {
    console.log('Login error:', e.message);
  }

  // Navigate to Activity Log
  await page.goto('http://localhost:8080/Admin/ActivityLog/List', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);
  console.log('Activity Log URL:', page.url());
  console.log('Title:', await page.title());

  // IDs trên trang
  const allIds = await page.$$eval('[id]', els => els.map(e => e.id).filter(Boolean));
  console.log('\nAll IDs on page:', JSON.stringify(allIds, null, 2));

  // Table headers
  const ths = await page.$$eval('th', els => els.map(e => e.innerText.trim()).filter(Boolean));
  console.log('\nTable headers:', JSON.stringify(ths, null, 2));

  await browser.close();
  process.exit(0);
})();
