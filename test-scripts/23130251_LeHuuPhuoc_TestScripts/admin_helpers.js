// admin_helpers.js for Le Huu Phuoc scripts
const ADMIN_URL = process.env.BASE_URL || 'http://localhost:8080';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yourstore.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

async function loginAdmin(page) {
  if (page.url() === 'about:blank' || page.url().includes('login') || page.url().includes('/Login')) {
    const emailInput = page.locator('#Email, input[name="Email"]').first();
    if (await emailInput.isVisible({ timeout: 8000 }).catch(() => false)) {
      await emailInput.fill(ADMIN_EMAIL);
      await page.locator('#Password, input[name="Password"]').first().fill(ADMIN_PASSWORD);
      const submitBtn = page.locator('button.login-button, button[type="submit"]:has-text("Log in"), button:has-text("LOG IN")').first();
      if (await submitBtn.isVisible().catch(() => false)) {
        await submitBtn.click();
        await page.waitForLoadState('networkidle').catch(() => {});
      }
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
    let formatted = dateStr;
    const parts = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (parts) {
      formatted = `${parts[3]}-${parts[2]}-${parts[1]}`;
    }
    try {
      await el.fill(formatted);
    } catch (e) {
      await el.fill(dateStr).catch(() => {});
    }
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
