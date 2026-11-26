// admin_helpers.js for Le Huu Phuoc scripts
const ADMIN_URL = process.env.BASE_URL || 'http://localhost:8080';

async function loginAdmin(page) {
  if (page.url().includes('login') || page.url().includes('/Login')) {
    const emailInput = page.locator('#Email, input[name="Email"]').first();
    const passInput = page.locator('#Password, input[name="Password"]').first();
    if (await emailInput.isVisible().catch(() => false)) {
      const emailVal = await emailInput.inputValue().catch(() => '');
      if (!emailVal) {
        await emailInput.fill('admin@yourstore.com');
        await passInput.fill('admin');
      }
    }
    const submitBtn = page.locator('button[type="submit"], input[type="submit"], button.login-button').first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      await page.waitForLoadState('domcontentloaded').catch(() => {});
    }
  }
}

async function gotoDiscounts(page) {
  await page.goto(`${ADMIN_URL}/Admin/Discount/List`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await loginAdmin(page);
}

async function fillDate(page, selector, dateStr) {
  const el = page.locator(selector).first();
  if (await el.isVisible().catch(() => false)) {
    await el.fill(dateStr);
  }
}

async function resetSearch(page) {
  const resetBtn = page.locator('#search-discounts, button[id*="search"]').first();
  if (await resetBtn.isVisible().catch(() => false)) {
    await resetBtn.click().catch(() => {});
  }
}

async function gotoAffiliates(page) {
  await page.goto(`${ADMIN_URL}/Admin/Affiliate/List`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await loginAdmin(page);
}

async function resetSearchAffiliates(page) {
  const resetBtn = page.locator('#search-affiliates, button[id*="search"]').first();
  if (await resetBtn.isVisible().catch(() => false)) {
    await resetBtn.click().catch(() => {});
  }
}

module.exports = {
  ADMIN_URL,
  loginAdmin,
  gotoDiscounts,
  fillDate,
  resetSearch,
  gotoAffiliates,
  resetSearchAffiliates
};
