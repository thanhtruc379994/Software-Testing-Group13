const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/login');
  if (await page.locator('#Email').isVisible()) {
    await page.fill('#Email', 'admin@yourstore.com');
    await page.fill('#Password', '@Truc27102005');
    await page.click('button.login-button');
    await page.waitForLoadState('networkidle');
  }
  await page.goto('http://localhost:8080/Admin/CustomerRole/Create');
  const roleName = 'FreeShip_TestCheck';
  await page.fill('#Name', roleName);
  await page.check('#FreeShipping');
  await page.click('button[name="save"]');
  await page.waitForLoadState('networkidle');
  console.log('URL after save:', page.url());
  const rows = await page.locator('#customerroles-grid tbody tr').allInnerTexts();
  console.log('ALL ROWS IN GRID:', rows);
  
  // Kiểm tra hàng vừa tạo
  const targetRow = page.locator('#customerroles-grid tbody tr', { hasText: roleName });
  console.log('Target row html:', await targetRow.innerHTML().catch(e => e.message));

  await browser.close();
})();

