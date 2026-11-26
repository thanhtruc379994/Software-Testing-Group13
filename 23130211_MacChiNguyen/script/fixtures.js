const { test, expect } = require('../../fixtures');

async function ensureAdvancedMode(page) {
    try {
        const advancedSwitch = page.locator('#advanced-settings-mode');
        if (await advancedSwitch.count() > 0) {
            const isChecked = await advancedSwitch.isChecked().catch(() => false);
            if (!isChecked) {
                await page.locator('.onoffswitch-label').first().click().catch(() => {});
                await page.waitForTimeout(300);
            }
        }
    } catch (e) {}
}

async function ensureDisplayCardExpanded(page) {
    await ensureAdvancedMode(page);
    try {
        const cards = page.locator('.card.collapsed-card');
        const count = await cards.count();
        for (let i = 0; i < count; i++) {
            await cards.nth(i).locator('[data-card-widget="collapse"]').first().click().catch(() => {});
        }
        if (count > 0) {
            await page.waitForTimeout(300);
        }
    } catch (e) {}
}

module.exports = { test, expect, ensureDisplayCardExpanded, ensureAdvancedMode };

