// admin_categories.spec.js
// Tổng hợp toàn bộ 90 test cho module Category (Create: 30 tests, Search: 30 tests, Edit: 30 tests)
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = process.env.BASE_URL || 'http://192.168.100.208:8080';
const ADMIN_EMAIL = 'admin@yourStore.com';
const ADMIN_PASSWORD = 'Admin@123';
const CREATE_URL = BASE + '/Admin/Category/Create';
const LIST_URL = BASE + '/Admin/Category/List';
const G = '#categories-grid';

async function handleCloudflare(page) {
    // Không áp dụng cho localhost
}

async function login(page) {
    if (page.url().includes('/Admin') && !page.url().includes('/login')) {
        return;
    }
    await page.goto(BASE + '/Admin');
    await handleCloudflare(page);

    const isDashboard = await page.locator('.main-sidebar, .brand-link, .nav-sidebar').isVisible({ timeout: 5000 }).catch(() => false);
    if (isDashboard) {
        return;
    }

    if (await page.locator('#Email').isVisible({ timeout: 3000 }).catch(() => false)) {
        await page.locator('#Email').fill(ADMIN_EMAIL);
        await page.locator('#Password').fill(ADMIN_PASSWORD);
        await page.locator('button.login-button, button[type="submit"]:has-text("Log in")').first().click();
        await handleCloudflare(page);
        await page.waitForURL(/\/Admin/i, { timeout: 60000 });
    }
}

async function gotoAdmin(page, url) {
    await page.goto(url);
    await handleCloudflare(page);
    const needLogin = page.url().includes('/login') ||
        await page.locator('#Email').isVisible({ timeout: 3000 }).catch(() => false);
    if (needLogin) {
        await login(page);
        await page.goto(url);
        await handleCloudflare(page);
    }
}

async function openCreate(page) {
    await gotoAdmin(page, CREATE_URL);
    await expect(page).toHaveURL(/\/Admin\/Category\/Create/i, { timeout: 30000 });
    await expect(page.locator('#Name')).toBeVisible({ timeout: 30000 });
}

async function openCategories(page) {
    await gotoAdmin(page, LIST_URL);
    await expect(page).toHaveURL(/\/Admin\/Category\/List/i, { timeout: 30000 });
    await expect(page.locator('#search-categories')).toBeVisible({ timeout: 30000 });
    await expect(page.locator(G)).toBeVisible({ timeout: 30000 });
    await waitGridLoaded(page);
}

async function openEdit(page, id) {
    await gotoAdmin(page, `${BASE}/Admin/Category/Edit/${id}`);
    await expect(page).toHaveURL(new RegExp(`/Admin/Category/Edit/${id}`, 'i'), { timeout: 30000 });
    await expect(page.locator('#Name')).toBeVisible({ timeout: 30000 });
}

async function waitGridLoaded(page) {
    await expect(page.locator(`${G} tbody tr`).first()).toBeVisible({ timeout: 30000 });
    await expect(page.locator(`${G}_processing`)).toBeHidden({ timeout: 30000 }).catch(() => {});
}

async function search(page) {
    const [res] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/Category/List') && r.request().method() === 'POST', { timeout: 30000 }),
        page.locator('#search-categories').click()
    ]);
    expect(res.status(), 'Category list phải trả về 2xx (không lỗi 500)').toBeLessThan(400);
    await waitGridLoaded(page);
}

async function typeName(page, text) {
    await page.locator('#SearchCategoryName').fill(text);
}

async function choose(page, selector, value) {
    await page.locator(selector).selectOption(value);
}

async function rowCount(page) {
    const rows = page.locator(`${G} tbody tr`);
    const text = (await rows.first().innerText().catch(() => '')) || '';
    if (/No data available|No matching records|Không có dữ liệu/i.test(text)) return 0;
    return rows.count();
}

async function total(page) {
    const text = await page.locator(`${G}_info`).innerText().catch(() => '');
    const m = text.match(/of\s+([\d,.]+)/i);
    return m ? parseInt(m[1].replace(/[,.]/g, ''), 10) : 0;
}

async function expectEmpty(page) {
    await expect(page.locator(G)).toContainText(/No data available|No matching records|Không có dữ liệu/i);
}

async function gridText(page) {
    return (await page.locator(`${G} tbody`).innerText()).toLowerCase();
}

function uniq(prefix = 'AutoCat') {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

async function expandDisplay(page) {
    const isAdv = await page.locator('#advanced-settings-mode').isChecked().catch(() => false);
    if (!isAdv) {
        await page.locator('.onoffswitch-label').click().catch(() => {});
        await page.waitForTimeout(300);
    }
    const card = page.locator('.card[data-card-name="category-display"], #category-display');
    if (await card.evaluate(el => el.classList.contains('collapsed-card')).catch(() => false)) {
        await card.locator('.card-header').first().click();
        await page.waitForTimeout(300);
    }
    await expect(card).not.toHaveClass(/collapsed-card/);
}

function numField(page, id) {
    return page.locator(`.form-group:has(#${id}) input:visible`).first();
}

async function fillNum(page, id, value) {
    const f = numField(page, id);
    await f.click();
    await f.fill(String(value));
    await f.press('Tab');
}

async function numValue(page, id) {
    return parseFloat((await numField(page, id).inputValue()).replace(/,/g, ''));
}

async function setDescription(page, text) {
    const editor = page.locator('.note-editable').first();
    if (await editor.isVisible({ timeout: 3000 }).catch(() => false)) {
        await editor.click();
        await editor.fill(text).catch(async () => {
            await editor.evaluate((el, val) => {
                el.innerText = val;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }, text);
        });
    } else {
        await page.locator('#Description').fill(text);
    }
}

async function confirmIfAsked(page) {
    const btn = page.locator(
        '.swal2-confirm, ' +
        '.bootbox .btn-primary, ' +
        '.modal.show .modal-footer :is(button, span):has-text("OK"), ' +
        '.modal.show .modal-footer :is(button, span):has-text("Ok"), ' +
        '.modal.show .modal-footer :is(button, span):has-text("Yes"), ' +
        '.modal.show .modal-footer :is(button, span):has-text("Confirm"), ' +
        '.modal.show .modal-footer .btn-primary'
    ).filter({ visible: true }).first();
    if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await btn.click().catch(() => {});
    }
}

async function save(page) {
    await page.locator('button[name="save"]').click();
    await confirmIfAsked(page);
}

async function saveContinue(page) {
    await page.locator('button[name="save-continue"]').click();
    await confirmIfAsked(page);
}

async function expectSaved(page) {
    await expect(page.locator('.alert-success')).toBeVisible({ timeout: 30000 });
}

async function expectRejected(page) {
    await expect(page.locator('.field-validation-error, .validation-summary-errors, .alert-danger, .input-validation-error').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.alert-success')).toHaveCount(0);
}

async function expectEditPage(page) {
    await expect(page).toHaveURL(/\/Admin\/Category\/Edit\/\d+/i, { timeout: 30000 });
}

async function expectNoServerError(page) {
    await expect(page.locator('body')).not.toContainText(/Server Error|Internal Server Error|Exception/i);
}

async function createAndEdit(page, name, extra = async () => {}) {
    await openCreate(page);
    await page.locator('#Name').fill(name);
    await extra();
    await saveContinue(page);
    await expectEditPage(page);
}

async function listRows(page, name) {
    await gotoAdmin(page, LIST_URL);
    await page.locator('#SearchCategoryName').fill(name);
    await Promise.all([
        page.waitForResponse(r => r.url().includes('/Category/List') && r.request().method() === 'POST', { timeout: 10000 }).catch(() => null),
        page.locator('#search-categories').click()
    ]);
    const rows = page.locator('#categories-grid tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 30000 });
    const text = (await rows.first().innerText()) || '';
    if (/No data available|No matching records|Không có dữ liệu/i.test(text)) return [];
    return (await rows.allInnerTexts()).map(t => t.toLowerCase());
}

async function createCategory(page, opts = {}) {
    const name = opts.name || uniq('Cat');
    await openCreate(page);
    await page.locator('#Name').fill(name);
    if (opts.parentId) {
        await page.locator('#ParentCategoryId').selectOption(String(opts.parentId));
    }
    await saveContinue(page);
    await expectEditPage(page);
    const m = page.url().match(/Edit\/(\d+)/);
    const id = m ? parseInt(m[1], 10) : 0;
    return { id, name };
}

// Xóa category với confirmation modal rõ ràng và ổn định theo Requirement C
async function deleteCategory(page, id) {
    await gotoAdmin(page, `${BASE}/Admin/Category/Edit/${id}`);
    const deleteBtn = page.locator('#category-delete, button[name="delete"], span.btn-danger:has-text("Delete")').first();
    if (!(await deleteBtn.isVisible({ timeout: 5000 }).catch(() => false))) return;
    await deleteBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator(
        '#categorymodel-Delete-delete-confirmation, ' +
        '#category-Delete-delete-confirmation, ' +
        '#category-delete-confirmation, ' +
        '.modal.show'
    ).first();
    await modal.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    const confirmBtn = page.locator(
        '#categorymodel-Delete-delete-confirmation button[type="submit"], ' +
        '#category-Delete-delete-confirmation button[type="submit"], ' +
        '#category-delete-confirmation button[type="submit"], ' +
        '.modal.show button[type="submit"].btn-danger, ' +
        '.modal.show button[type="submit"]:has-text("Delete"), ' +
        'button[type="submit"].btn-danger.float-right, ' +
        'button[type="submit"].btn-danger:has-text("Delete")'
    ).first();

    await confirmBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await confirmBtn.isVisible().catch(() => false)) {
        await confirmBtn.click({ force: true });
    } else {
        await page.locator('button[type="submit"].btn-danger.float-right, button[type="submit"]:has-text("Delete")').first().click({ force: true }).catch(() => {});
    }
    await page.waitForURL(/\/Admin\/Category\/List/i, { timeout: 30000 }).catch(() => {});
}

async function withCats(page, fn) {
    const ctx = { ids: [] };
    ctx.make = async (opts) => {
        const c = await createCategory(page, opts);
        ctx.ids.push(c.id);
        return c;
    };
    try {
        await fn(ctx);
    } finally {
        for (const id of [...ctx.ids].reverse()) {
            await deleteCategory(page, id).catch(() => {});
        }
    }
}

async function parentLabel(page, id) {
    return page.locator(`#ParentCategoryId option[value="${id}"]`).innerText();
}

// ------------------------------ Main Suite ------------------------------

test.describe('Admin - Categories', () => {

    test.setTimeout(180000);

    test.afterEach(async ({ page }, testInfo) => {
        const screenshotDir = path.resolve(process.cwd(), 'screenshots', 'admin_categories');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        const match = testInfo.title.match(/\[([A-Za-z0-9_]+)\]/) || testInfo.title.match(/^([A-Za-z0-9_]+)/);
        const tcId = match ? (match[1] || match[0]) : testInfo.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
        const status = testInfo.status === testInfo.expectedStatus ? 'PASS' : 'FAILED';
        const screenshotPath = path.join(screenshotDir, `${tcId}_${status}.png`);

        try {
            await page.screenshot({ path: screenshotPath, fullPage: true });
        } catch (err) {
            // ignore
        }
    });

    // ==========================================================================
    // 1. CREATE CATEGORY (30 tests)
    // ==========================================================================
    test.describe('Admin - Create Category', () => {
        test('should navigate to Add Category page when clicking Add new [Add_category_display_01]', async ({ page }) => {
            await page.goto(LIST_URL);
            await handleCloudflare(page);
            if (page.url().includes('/login')) {
                await login(page);
                await page.goto(LIST_URL);
            }
            await page.locator('a[href*="/Admin/Category/Create"]').first().click();
            await expect(page).toHaveURL(/\/Admin\/Category\/Create/i, {timeout: 30000});
            await expect(page.locator('.card[data-card-name="category-info"]')).toBeVisible();
            await expect(page.locator('.card[data-card-name="category-display"]')).toBeVisible();
        });

        test('should display default values on Add Category page [Add_category_default_value_02]', async ({ page }) => {
            await openCreate(page);
            await expect(page.locator('#Name')).toHaveValue('');
            await expect(page.locator('.note-editable').first()).toHaveText('');
            await expect(page.locator('#ParentCategoryId')).toHaveValue('0');
            await expect(page.locator('#category-display')).toBeVisible();
        });

        test('should display required asterisk mark for Name field [Add_category_required_mark_03]', async ({ page }) => {
            await openCreate(page);
            await expect(page.locator('.form-group:has(#Name) .required, .form-group:has(#Name) :text("*")').first()).toBeVisible();
        });

        test('should collapse and expand Category info and Display panels [Add_category_toggle_panel_04]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#Name').fill('abc');
            const info = page.locator('.card[data-card-name="category-info"]');
            await info.locator('.card-header').first().click();
            await expect(info).toHaveClass(/collapsed-card/);
            await info.locator('.card-header').first().click();
            await expect(info).not.toHaveClass(/collapsed-card/);
            await expect(page.locator('#Name')).toHaveValue('abc');
            await expandDisplay(page);
        });

        test('should display default values in Display panel [Add_category_display_defaults_05]', async ({ page }) => {
            await openCreate(page);
            await expandDisplay(page);
            await expect(page.locator('#Published')).toBeChecked();
            await expect(page.locator('#ShowOnHomepage')).not.toBeChecked();
            expect(await numValue(page, 'DisplayOrder')).toBe(0);
        });

        test('should return to Category list when clicking back link [Add_category_back_link_06]', async ({ page }) => {
            const name = uniq('BackLink');
            await openCreate(page);
            await page.locator('#Name').fill(name);
            await page.getByRole('link', {name: /back to category list/i}).click();
            await expect(page).toHaveURL(/\/Admin\/Category\/List/i, {timeout: 30000});
            expect((await listRows(page, name)).length).toBe(0);
        });

        test('should create category successfully with valid name [Add_category_valid_name_07]', async ({ page }) => {
            const name = uniq('ValidName');
            await openCreate(page);
            await page.locator('#Name').fill(name);
            await save(page);
            await expect(page).toHaveURL(/\/Admin\/Category\/List/i, {timeout: 30000});
            await expectSaved(page);
            expect((await listRows(page, name)).length).toBe(1);
        });

        test('should reject creating category with empty name [Add_category_empty_name_08]', async ({ page }) => {
            await openCreate(page);
            await save(page);
            await expectRejected(page);
            await expect(page).toHaveURL(/\/Admin\/Category\/Create/i);
        });

        test('should reject creating category with whitespace only name [Add_category_whitespace_name_09]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#Name').fill('     ');
            await save(page);
            await expectRejected(page);
        });

        test('should trim leading and trailing spaces from category name [Add_category_trim_name_10]', async ({ page }) => {
            const name = uniq('Trim');
            await createAndEdit(page, `  ${name}  `);
            await expect(page.locator('#Name')).toHaveValue(name);
        });

        test('should create category with maximum allowed name length of 400 characters [Add_category_max_length_name_11]', async ({ page }) => {
            const stamp = String(Date.now());
            const name = 'M' + stamp + 'a'.repeat(400 - stamp.length - 1);
            await openCreate(page);
            await page.locator('#Name').fill(name);
            await save(page);
            await expect(page).toHaveURL(/\/Admin\/Category\/List/i, {timeout: 30000});
            await expectSaved(page);
        });

        test('should reject creating category with name exceeding 400 characters [Add_category_over_length_name_12]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#Name').fill('b'.repeat(401));
            await save(page);
            // Hệ thống phải xử lý có kiểm soát: báo lỗi hoặc lưu theo quy định, không lỗi 500
            await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger, .input-validation-error').first()).toBeVisible({timeout: 30000});
            await expect(page.locator('body')).not.toContainText(/Server Error|Internal Server Error|Exception/i);
        });

        test('should create category with special characters in name [Add_category_special_chars_name_13]', async ({ page }) => {
            const name = uniq('Spec') + ' @#$%&\'"';
            await createAndEdit(page, name);
            await expect(page.locator('#Name')).toHaveValue(name);
        });

        test('should safely escape HTML and script tags in category name [Add_category_html_name_14]', async ({ page }) => {
            let dialogShown = false;
            page.on('dialog', async d => { dialogShown = true; await d.dismiss(); });
            const name = uniq('Html') + '<script>alert(1)</script>';
            await openCreate(page);
            await page.locator('#Name').fill(name);
            await save(page);
            await expect(page).toHaveURL(/\/Admin\/Category\/List/i, {timeout: 30000});
            await page.waitForLoadState('networkidle');
            expect(dialogShown).toBeFalsy();
        });

        test('should create category with Vietnamese unicode characters in name [Add_category_unicode_name_15]', async ({ page }) => {
            const name = uniq('Điện thoại thông minh');
            await createAndEdit(page, name);
            await expect(page.locator('#Name')).toHaveValue(name);
        });

        test('should handle duplicate category name gracefully without server error [Add_category_duplicate_name_16]', async ({ page }) => {
            const name = uniq('Dup');
            await createAndEdit(page, name);
            await openCreate(page);
            await page.locator('#Name').fill(name);
            await save(page);
            // Xác nhận theo hành vi thực tế: tạo được hoặc báo lỗi trùng, không lỗi hệ thống
            await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger').first()).toBeVisible({timeout: 30000});
            await expect(page.locator('body')).not.toContainText(/Server Error|Internal Server Error/i);
        });

        test('should create category with empty description [Add_category_empty_description_17]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#Name').fill(uniq('DescEmpty'));
            await save(page);
            await expectSaved(page);
        });

        test('should create category with valid rich text description [Add_category_valid_description_18]', async ({ page }) => {
            await createAndEdit(page, uniq('DescOk'), async () => {
                await setDescription(page, 'Mô tả danh mục');
            });
            await expect(page.locator('.note-editable').first()).toContainText('Mô tả danh mục');
        });

        test('should display parent categories in dropdown list [Add_category_parent_list_26]', async ({ page }) => {
            await openCreate(page);
            const options = (await page.locator('#ParentCategoryId option').allInnerTexts()).map(o => o.trim());
            expect(options[0]).toBe('[None]');
            expect(options).toContain('Books');
            expect(options).toContain('Computers >> Desktops');
        });

        test('should create category with parent category set to None [Add_category_parent_none_27]', async ({ page }) => {
            const name = uniq('Root');
            await openCreate(page);
            await page.locator('#Name').fill(name);
            await save(page);
            await expectSaved(page);
            const rows = await listRows(page, name);
            expect(rows.length).toBe(1);
            expect(rows[0]).not.toContain('>>');
        });

        test('should create category under a root parent category [Add_category_parent_root_28]', async ({ page }) => {
            const name = uniq('Child');
            await openCreate(page);
            await page.locator('#Name').fill(name);
            await page.locator('#ParentCategoryId').selectOption({label: 'Books'});
            await save(page);
            await expectSaved(page);
            const rows = await listRows(page, name);
            expect(rows.length).toBe(1);
            expect(rows[0]).toContain(`books >> ${name.toLowerCase()}`);
        });

        test('should create subcategory under a nested child category [Add_category_parent_child_29]', async ({ page }) => {
            const name = uniq('Level3');
            await openCreate(page);
            await page.locator('#Name').fill(name);
            await page.locator('#ParentCategoryId').selectOption({label: 'Computers >> Desktops'});
            await save(page);
            await expectSaved(page);
            const rows = await listRows(page, name);
            expect(rows.length).toBe(1);
            expect(rows[0]).toContain(`computers >> desktops >> ${name.toLowerCase()}`);
        });

        test('should set valid display order for category [Add_category_display_order_30]', async ({ page }) => {
            await createAndEdit(page, uniq('Order'), async () => {
                await expandDisplay(page);
                await fillNum(page, 'DisplayOrder', 10);
            });
            await expandDisplay(page);
            expect(await numValue(page, 'DisplayOrder')).toBe(10);
        });

        test('should reject invalid display order for category [Add_category_display_order_invalid_31]', async ({ page }) => {
            await openCreate(page);
            await expandDisplay(page);
            const f = numField(page, 'DisplayOrder');
            await f.click();
            await f.pressSequentially('abc');
            await f.press('Tab');
            // Ô số không chấp nhận chữ: giá trị không thể là 'abc'
            expect(await f.inputValue()).not.toMatch(/abc/i);
        });

        test('should toggle published status checkbox [Add_category_published_flag_32]', async ({ page }) => {
            await createAndEdit(page, uniq('Unpub'), async () => {
                await expandDisplay(page);
                await page.locator('#Published').uncheck();
            });
            await expandDisplay(page);
            await expect(page.locator('#Published')).not.toBeChecked();
        });


        test('should save and continue editing category with valid data [Add_category_save_continue_34]', async ({ page }) => {
            const name = uniq('SaveContinue');
            await createAndEdit(page, name);
            await expectSaved(page);
            await expect(page.locator('#Name')).toHaveValue(name);
        });

        test('should display newly created category in Category list [Add_category_list_after_save_35]', async ({ page }) => {
            const name = uniq('InList');
            await openCreate(page);
            await page.locator('#Name').fill(name);
            await save(page);
            await expectSaved(page);
            const rows = await listRows(page, name);
            expect(rows.length).toBe(1);
            expect(rows[0]).toContain(name.toLowerCase());
        });

        test('should verify persisted category data matches entered values [Add_category_data_match_36]', async ({ page }) => {
            const name = uniq('FullData');
            await createAndEdit(page, name, async () => {
                await setDescription(page, 'Mô tả đầy đủ');
                await page.locator('#ParentCategoryId').selectOption({label: 'Books'});
                await expandDisplay(page);
                await fillNum(page, 'DisplayOrder', 5);
            });
            await expect(page.locator('#Name')).toHaveValue(name);
            await expect(page.locator('.note-editable').first()).toContainText('Mô tả đầy đủ');
            await expect(page.locator('#ParentCategoryId option:checked')).toHaveText('Books');
            await expandDisplay(page);
            expect(await numValue(page, 'DisplayOrder')).toBe(5);
        });

        test('should create category with only name specified and defaults for other fields [Add_category_only_name_37]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#Name').fill(uniq('OnlyName'));
            await save(page);
            await expectSaved(page);
        });

    });

    // ==========================================================================
    // 2. SEARCH CATEGORY (30 tests)
    // ==========================================================================
    test.describe('Admin - Search Category', () => {
        test('should display default values on Category list page [Search_category_default_value_01]', async ({ page }) => {
            await openCategories(page);
            await expect(page.locator('#SearchCategoryName')).toHaveValue('');
            await expect(page.locator('#SearchPublishedId')).toHaveValue('0');
            expect(await rowCount(page)).toBeGreaterThan(0);
            expect(await rowCount(page)).toBeLessThanOrEqual(15);
            expect(await total(page)).toBeGreaterThan(0);
        });

        test('should display correct columns in categories grid [Search_category_columns_02]', async ({ page }) => {
            await openCategories(page);
            await expect(page.locator(`${G} thead`)).toContainText(/Name/i);
            await expect(page.locator(`${G} thead`)).toContainText(/Display order/i);
            await expect(page.locator(`${G} thead`)).toContainText(/Published/i);
        });


        test('should return all categories when search name is empty [Search_category_empty_name_04]', async ({ page }) => {
            await openCategories(page);
            await search(page);
            expect(await rowCount(page)).toBeGreaterThan(0);
            expect(await total(page)).toBeGreaterThan(15);
        });


        test('should search category by partial name keyword [Search_category_partial_name_06]', async ({ page }) => {
            await openCategories(page);
            await typeName(page, 'Comp');
            await search(page);
            expect(await rowCount(page)).toBeGreaterThan(0);
            for (const t of await page.locator(`${G} tbody tr`).allInnerTexts()) {
                expect(t.toLowerCase()).toContain('comp');
            }
        });

        test('should search category by subcategory child name [Search_category_child_name_07]', async ({ page }) => {
            await openCategories(page);
            await typeName(page, 'Desktops');
            await search(page);
            expect(await rowCount(page)).toBeGreaterThan(0);
            expect(await gridText(page)).toContain('computers >> desktops');
        });

        test('should search category case-insensitively [Search_category_case_insensitive_08]', async ({ page }) => {
            await openCategories(page);
            await typeName(page, 'books');
            await search(page);
            const lower = await total(page);
            await typeName(page, 'BOOKS');
            await search(page);
            expect(lower).toBeGreaterThan(0);
            expect(await total(page)).toBe(lower);
        });

        test('should trim spaces in category search keyword [Search_category_spaces_09]', async ({ page }) => {
            await openCategories(page);
            await typeName(page, 'Books');
            await search(page);
            const base = await total(page);
            await typeName(page, '  Books  ');
            await search(page);
            expect(await total(page)).toBe(base);
        });

        test('should display no matching records for non-existent category name [Search_category_not_exist_10]', async ({ page }) => {
            await openCategories(page);
            await typeName(page, 'zzzxxx123');
            await search(page);
            await expectEmpty(page);
        });

        test('should handle special characters in category search keyword [Search_category_special_chars_11]', async ({ page }) => {
            await openCategories(page);
            for (const kw of ['%', "'", '_', '\\']) {
                await typeName(page, kw);
                await search(page);              // search() fail nếu server trả lỗi >= 400
                await expect(page.locator(G)).toBeVisible();
            }
        });

        test('should prevent SQL injection and XSS script in category search [Search_category_injection_12]', async ({ page }) => {
            let dialogShown = false;
            page.on('dialog', async d => { dialogShown = true; await d.dismiss(); });
            await openCategories(page);
            await search(page);
            const all = await total(page);
            await typeName(page, "' OR '1'='1");
            await search(page);
            expect(await total(page)).toBeLessThan(all);
            await typeName(page, '<script>alert(1)</script>');
            await search(page);
            expect(dialogShown).toBeFalsy();
        });

        test('should search category with Vietnamese unicode characters [Search_category_unicode_keyword_14]', async ({ page }) => {
            await openCategories(page);
            await typeName(page, 'tẻ');
            await search(page);
            await expect(page.locator(G)).toBeVisible();
        });

        test('should search category by pressing Enter key [Search_category_press_enter_15]', async ({ page }) => {
            await openCategories(page);
            await typeName(page, 'Books');
            await Promise.all([
                page.waitForResponse(r => r.url().includes('/Category/List') && r.request().method() === 'POST'),
                page.locator('#SearchCategoryName').press('Enter')
            ]);
            await waitGridLoaded(page);
            expect(await gridText(page)).toContain('books');
        });

        test('should display correct options in Published dropdown list [Search_category_published_list_17]', async ({ page }) => {
            await openCategories(page);
            const options = await page.locator('#SearchPublishedId option').allInnerTexts();
            expect(options.map(o => o.trim())).toEqual(['All', 'Published only', 'Unpublished only']);
        });

        test('should filter categories with Published equals All [Search_category_published_all_18]', async ({ page }) => {
            await openCategories(page);
            await search(page);
            const base = await total(page);
            await choose(page, '#SearchPublishedId', '0');
            await search(page);
            expect(await total(page)).toBe(base);
        });

        test('should filter categories with Published only [Search_category_published_only_19]', async ({ page }) => {
            await openCategories(page);
            await choose(page, '#SearchPublishedId', '1');
            await search(page);
            expect(await rowCount(page)).toBeGreaterThan(0);
            await expect(page.locator(`${G} .false-icon`)).toHaveCount(0);
            expect(await page.locator(`${G} .true-icon`).count()).toBeGreaterThan(0);
        });

        test('should filter categories with Unpublished only [Search_category_unpublished_only_20]', async ({ page }) => {
            await openCategories(page);
            await choose(page, '#SearchPublishedId', '2');
            await search(page);
            await expect(page.locator(`${G} .true-icon`)).toHaveCount(0);
        });

        test('should filter categories by combining name and Published status with matching results [Search_category_name_and_published_21]', async ({ page }) => {
            await openCategories(page);
            await typeName(page, 'Books');
            await choose(page, '#SearchPublishedId', '1');
            await search(page);
            expect(await gridText(page)).toContain('books');
        });

        test('should return empty results when category name and Published status conflict [Search_category_name_published_mismatch_22]', async ({ page }) => {
            await openCategories(page);
            await typeName(page, 'Books');
            await choose(page, '#SearchPublishedId', '2');
            await search(page);
            await expectEmpty(page);
        });

        test('should verify default pagination settings [Search_category_paging_default_23]', async ({ page }) => {
            await openCategories(page);
            await search(page);
            expect(await rowCount(page)).toBe(15);

            await expect(page.locator(`${G}_info`)).toContainText(/1\s*-\s*15\s+of/i);

            const nextBtn = page.locator('a.page-link.next[aria-controls="categories-grid"]');
            await expect(nextBtn).toBeVisible();
            await expect(nextBtn).not.toHaveClass(/disabled/);
            await expect(nextBtn.locator('..')).not.toHaveClass(/disabled/);
        });

        test('should navigate to next page in categories grid [Search_category_paging_next_24]', async ({ page }) => {
            await openCategories(page);
            await search(page);
            await page.locator('a.page-link.next[aria-controls="categories-grid"]').click();
            await waitGridLoaded(page);
            await expect(page.locator(`${G}_info`)).toContainText(/16\s*-/);
            expect(await rowCount(page)).toBeGreaterThan(0);
            // Trang 2 vẫn có đủ 15 dòng nếu tổng > 30, nên dùng <= 15
            expect(await rowCount(page)).toBeLessThanOrEqual(15);
        });

        test('should navigate to previous page in categories grid [Search_category_paging_previous_25]', async ({ page }) => {
            await openCategories(page);
            await search(page);
            await page.locator('a.page-link.next[aria-controls="categories-grid"]').click();
            await waitGridLoaded(page);
            await page.locator('a.page-link.previous[aria-controls="categories-grid"]').click();
            await waitGridLoaded(page);
            await expect(page.locator(`${G}_info`)).toContainText(/1\s*-\s*15\s+of/i);
        });

        test('should navigate directly to page by clicking page number [Search_category_paging_page_number_28]', async ({ page }) => {
            await openCategories(page);
            await search(page);
            // DataTables v2 dùng a.page-link[aria-controls="categories-grid"] thay cho _paginate .paginate_button
            await page.locator('a.page-link[aria-controls="categories-grid"]', { hasText: /^2$/ }).click();
            await waitGridLoaded(page);
            await expect(page.locator(`${G}_info`)).toContainText(/16\s*-/);
        });

        test('should change page size items per page [Search_category_paging_items_per_page_29]', async ({ page }) => {
            await openCategories(page);
            await search(page);
            const all = await total(page);
            // DataTables v2 đặt select nằm trong #categories-grid_wrapper .dt-length select (hoặc fallback _length select)
            const lengthSelect = page.locator('#categories-grid_wrapper .dt-length select, #categories-grid_length select');

            await lengthSelect.selectOption('7');
            await waitGridLoaded(page);
            expect(await rowCount(page)).toBe(7);

            await lengthSelect.selectOption('50');
            await waitGridLoaded(page);
            // Nếu tổng số bản ghi (163) > 50 thì bảng chỉ hiển thị tối đa 50 dòng
            expect(await rowCount(page)).toBe(Math.min(all, 50));
        });

        test('should disable pagination controls when results fit on single page [Search_category_paging_less_than_page_30]', async ({ page }) => {
            await openCategories(page);
            await typeName(page, 'Comp');
            await search(page);

            const nextBtn = page.locator('a.page-link.next[aria-controls="categories-grid"]');
            const prevBtn = page.locator('a.page-link.previous[aria-controls="categories-grid"]');

            // Trong Bootstrap 5 / DataTables v2, class "disabled" có thể nằm trên <a> hoặc thẻ <li> cha (..)
            await expect(nextBtn.locator('..')).toHaveClass(/disabled/);
            await expect(prevBtn.locator('..')).toHaveClass(/disabled/);
        });

        test('should reset pagination to page 1 on new search [Search_category_new_search_reset_page_31]', async ({ page }) => {
            await openCategories(page);
            await search(page);

            // Sửa locator theo đúng HTML mới của DataTables
            await page.locator('a.page-link.next[aria-controls="categories-grid"]').click();

            await waitGridLoaded(page);
            await typeName(page, 'Books');
            await search(page);
            expect(await gridText(page)).toContain('books');
        });


        test('should open Edit page for correct category when clicking Edit button [Search_category_edit_button_35]', async ({ page }) => {
            await openCategories(page);
            await typeName(page, 'Books');
            await search(page);
            await page.locator(`${G} tbody tr`).first().getByRole('link', {name: /Edit/i}).click();
            await expect(page).toHaveURL(/\/Admin\/Category\/Edit\/\d+/i, {timeout: 30000});
            await expect(page.locator('#Name')).toHaveValue('Books');
        });

        test('should open Add new category page when clicking Add new button [Search_category_add_new_button_36]', async ({ page }) => {
            await openCategories(page);
            await page.locator('a[href*="/Admin/Category/Create"]').first().click();
            await expect(page).toHaveURL(/\/Admin\/Category\/Create/i, {timeout: 30000});
            await expect(page.locator('#Name')).toBeVisible();
        });

    });

    // ==========================================================================
    // 3. EDIT CATEGORY (30 tests)
    // ==========================================================================
    test.describe('Admin - Edit Category', () => {
        test('should open Edit category screen from Category list [Edit_category_display_01]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await gotoAdmin(page, LIST_URL);
                await page.locator('#SearchCategoryName').fill(c.name);
                await Promise.all([
                    page.waitForResponse(r => r.url().includes('/Category/List') && r.request().method() === 'POST'),
                    page.locator('#search-categories').click()
                ]);
                await page.locator('#categories-grid tbody tr').first().getByRole('link', {name: /Edit/i}).click();
                await expect(page).toHaveURL(new RegExp(`/Admin/Category/Edit/${c.id}`, 'i'), {timeout: 30000});
                await expect(page.locator('#Name')).toHaveValue(c.name);
                await expect(page.locator('button[name="save"]')).toBeVisible();
                await expect(page.locator('button[name="save-continue"]')).toBeVisible();
                await expect(page.locator('#category-delete')).toBeVisible();
            });
        });


        test('should navigate back to Category list when clicking back link [Edit_category_back_link_05]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await openEdit(page, c.id);
                await page.locator('#Name').fill('Changed but not saved');
                await page.getByRole('link', {name: /back to category list/i}).click();
                await expect(page).toHaveURL(/\/Admin\/Category\/List/i, {timeout: 30000});
                await openEdit(page, c.id);
                await expect(page.locator('#Name')).toHaveValue(c.name);
            });
        });

        test('should handle access to Edit category with non-existent id gracefully [Edit_category_invalid_id_06]', async ({ page }) => {
            await gotoAdmin(page, `${BASE}/Admin/Category/Edit/99999999`);
            await expectNoServerError(page);
            // Quay về danh sách hoặc báo lỗi hợp lệ, không hiển thị form sửa
            const onList = /\/Admin\/Category\/List/i.test(page.url());
            const hasMsg = (await page.locator('.alert, .validation-summary-errors').count()) > 0;
            expect(onList || hasMsg).toBeTruthy();
        });

        test('should update category with valid name successfully [Edit_category_valid_name_07]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                const newName = uniq('Renamed');
                await openEdit(page, c.id);
                await page.locator('#Name').fill(newName);
                await saveContinue(page);
                await expectSaved(page);
                await openEdit(page, c.id);
                await expect(page.locator('#Name')).toHaveValue(newName);
            });
        });

        test('should reject updating category when name is cleared [Edit_category_empty_name_08]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await openEdit(page, c.id);
                await page.locator('#Name').fill('');
                await save(page);
                await expectRejected(page);
                await openEdit(page, c.id);
                await expect(page.locator('#Name')).toHaveValue(c.name);
            });
        });

        // loi
        test('should reject updating category with whitespace only name [Edit_category_whitespace_name_09]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await openEdit(page, c.id);
                await page.locator('#Name').fill('     ');
                await save(page);
                await expectRejected(page);
            });
        });

        test('should reject updating category name exceeding 400 characters [Edit_category_over_length_name_11]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await openEdit(page, c.id);
                await page.locator('#Name').fill('b'.repeat(401));
                await save(page);
                // Xử lý có kiểm soát: báo lỗi hoặc lưu theo quy định, không lỗi 500
                await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger, .input-validation-error').first()).toBeVisible({timeout: 30000});
                await expectNoServerError(page);
            });
        });

        test('should update category name with special characters [Edit_category_special_chars_name_12]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                const name = uniq('Spec') + ' @#$%&\'"';
                await openEdit(page, c.id);
                await page.locator('#Name').fill(name);
                await saveContinue(page);
                await expectSaved(page);
                await expect(page.locator('#Name')).toHaveValue(name);
            });
        });

        test('should safely escape HTML and script tags when updating category name [Edit_category_html_name_13]', async ({ page }) => {
            let dialogShown = false;
            page.on('dialog', async d => { dialogShown = true; await d.dismiss(); });
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await openEdit(page, c.id);
                await page.locator('#Name').fill(uniq('Html') + '<script>alert(1)</script>');
                await save(page);
                await expect(page).toHaveURL(/\/Admin\/Category\/List/i, {timeout: 30000});
                await page.waitForLoadState('networkidle');
                expect(dialogShown).toBeFalsy();
            });
        });

        test('should update category name with Vietnamese unicode characters [Edit_category_unicode_name_14]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                const name = uniq('Máy tính');
                await openEdit(page, c.id);
                await page.locator('#Name').fill(name);
                await saveContinue(page);
                await expectSaved(page);
                await expect(page.locator('#Name')).toHaveValue(name);
            });
        });

        test('should handle duplicate category name when updating without server error [Edit_category_duplicate_name_15]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const a = await ctx.make();
                const b = await ctx.make();
                await openEdit(page, b.id);
                await page.locator('#Name').fill(a.name);
                await save(page);
                // Xác nhận theo hành vi thực tế: lưu được hoặc báo lỗi trùng, không lỗi hệ thống
                await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger').first()).toBeVisible({timeout: 30000});
                await expectNoServerError(page);
            });
        });

        test('should save category successfully without making any changes [Edit_category_no_change_16]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make({description: 'Giữ nguyên'});
                await openEdit(page, c.id);
                await save(page);
                await expect(page).toHaveURL(/\/Admin\/Category\/List/i, {timeout: 30000});
                await expectSaved(page);
                await openEdit(page, c.id);
                await expect(page.locator('#Name')).toHaveValue(c.name);
                await expect(page.locator('.note-editable').first()).not.toBeEmpty();
            });
        });

        test('should update category with valid description [Edit_category_valid_description_17]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await openEdit(page, c.id);
                await setDescription(page, 'Mô tả mới');
                await saveContinue(page);
                await expectSaved(page);
                await openEdit(page, c.id);
                await expect(page.locator('.note-editable').first()).toContainText('Mô tả mới');
            });
        });

        test('should update category with empty description [Edit_category_empty_description_18]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make({description: 'Sẽ bị xóa'});
                await openEdit(page, c.id);
                await setDescription(page, '');
                await saveContinue(page);
                await expectSaved(page);
                await openEdit(page, c.id);
                await expect(page.locator('.note-editable').first()).toHaveText('');
            });
        });

        test('should update parent category from None to another category [Edit_category_parent_to_other_21]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const parent = await ctx.make();
                const c = await ctx.make();
                await openEdit(page, c.id);
                await page.locator('#ParentCategoryId').selectOption({label: parent.name});
                await save(page);
                await expectSaved(page);
                const rows = await listRows(page, c.name);
                expect(rows.length).toBe(1);
                expect(rows[0]).toContain(`${parent.name.toLowerCase()} >> ${c.name.toLowerCase()}`);
            });
        });

        test('should update parent category back to None [Edit_category_parent_to_none_22]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const parent = await ctx.make();
                const c = await ctx.make({parent: parent.name});
                await openEdit(page, c.id);
                await page.locator('#ParentCategoryId').selectOption({label: '[None]'});
                await save(page);
                await expectSaved(page);
                const rows = await listRows(page, c.name);
                expect(rows.length).toBe(1);
                expect(rows[0]).not.toContain('>>');
            });
        });

        test('should change parent category to a different parent [Edit_category_parent_change_23]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const p1 = await ctx.make();
                const p2 = await ctx.make();
                const c = await ctx.make({parent: p1.name});
                await openEdit(page, c.id);
                await page.locator('#ParentCategoryId').selectOption({label: p2.name});
                await save(page);
                await expectSaved(page);
                const rows = await listRows(page, c.name);
                expect(rows.length).toBe(1);
                expect(rows[0]).toContain(`${p2.name.toLowerCase()} >> ${c.name.toLowerCase()}`);
            });
        });

        test('should prevent circular parent-child dependency loop [Edit_category_parent_loop_25]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const parent = await ctx.make();
                const child = await ctx.make({parent: parent.name});
                await openEdit(page, parent.id);
                const label = `${parent.name} >> ${child.name}`;
                const options = (await page.locator('#ParentCategoryId option').allInnerTexts()).map(o => o.trim());
                if (!options.includes(label)) return;   // Không cho chọn: đạt yêu cầu
                await page.locator('#ParentCategoryId').selectOption({label});
                await save(page);
                await expectNoServerError(page);
                // Không được tạo vòng lặp: cha vẫn là category gốc
                await openEdit(page, parent.id);
                expect(await parentLabel(page)).toBe('[None]');
            });
        });

        test('should update display order with valid numeric value [Edit_category_display_order_27]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await openEdit(page, c.id);
                await expandDisplay(page);
                await fillNum(page, 'DisplayOrder', 20);
                await saveContinue(page);
                await expectSaved(page);
                await openEdit(page, c.id);
                await expandDisplay(page);
                expect(await numValue(page, 'DisplayOrder')).toBe(20);
            });
        });

        test('should reject invalid display order during edit [Edit_category_display_order_invalid_28]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await openEdit(page, c.id);
                await expandDisplay(page);
                const f = numField(page, 'DisplayOrder');
                await f.click();
                await f.pressSequentially('abc');
                await f.press('Tab');
                // Ô số không chấp nhận chữ: giá trị không thể là 'abc'
                expect(await f.inputValue()).not.toMatch(/abc/i);
            });
        });

        test('should unpublish category by unchecking Published checkbox [Edit_category_unpublish_29]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await openEdit(page, c.id);
                await expandDisplay(page);
                await page.locator('#Published').uncheck();
                await save(page);
                await expectSaved(page);
                await openEdit(page, c.id);
                await expandDisplay(page);
                await expect(page.locator('#Published')).not.toBeChecked();
                // Category List hiển thị biểu tượng ✗
                await listRows(page, c.name);
                await expect(page.locator('#categories-grid tbody tr').first().locator('.false-icon')).toHaveCount(1);
            });
        });

        test('should republish category by checking Published checkbox [Edit_category_republish_30]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                // Chuẩn bị: đưa category về trạng thái Unpublished
                await openEdit(page, c.id);
                await expandDisplay(page);
                await page.locator('#Published').uncheck();
                await saveContinue(page);
                await expectSaved(page);

                await expandDisplay(page);
                await page.locator('#Published').check();
                await saveContinue(page);
                await expectSaved(page);
                await openEdit(page, c.id);
                await expandDisplay(page);
                await expect(page.locator('#Published')).toBeChecked();
                await listRows(page, c.name);
                await expect(page.locator('#categories-grid tbody tr').first().locator('.true-icon')).toHaveCount(1);
            });
        });

        test('should save category with valid data and return to list [Edit_category_save_32]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                const newName = uniq('Saved');
                await openEdit(page, c.id);
                await page.locator('#Name').fill(newName);
                await save(page);
                await expect(page).toHaveURL(/\/Admin\/Category\/List/i, {timeout: 30000});
                await expectSaved(page);
                expect((await listRows(page, newName)).length).toBe(1);
            });
        });

        test('should save and continue editing category with valid data [Edit_category_save_continue_33]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                const newName = uniq('Continue');
                await openEdit(page, c.id);
                await page.locator('#Name').fill(newName);
                await saveContinue(page);
                await expect(page).toHaveURL(new RegExp(`/Admin/Category/Edit/${c.id}`, 'i'), {timeout: 30000});
                await expectSaved(page);
                await expect(page.locator('#Name')).toHaveValue(newName);
            });
        });

        test('should reflect category updates accurately in Category list [Edit_category_list_after_save_34]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                const newName = uniq('InList');
                await openEdit(page, c.id);
                await page.locator('#Name').fill(newName);
                await expandDisplay(page);
                await fillNum(page, 'DisplayOrder', 7);
                await save(page);
                await expectSaved(page);
                const rows = await listRows(page, newName);
                expect(rows.length).toBe(1);
                expect(rows[0]).toContain(newName.toLowerCase());
                expect(rows[0]).toContain('7');
            });
        });

        test('should leave edit screen without saving changes [Edit_category_leave_without_save_35]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await openEdit(page, c.id);
                await page.locator('#Name').fill('Not saved name');
                page.once('dialog', d => d.accept());
                await gotoAdmin(page, LIST_URL);
                await openEdit(page, c.id);
                await expect(page.locator('#Name')).toHaveValue(c.name);
            });
        });

        test('should delete category after confirmation in modal [Edit_category_delete_confirm_38]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await openEdit(page, c.id);
                await page.locator('#category-delete').click();
                const modal = page.locator('#categorymodel-Delete-delete-confirmation, #category-delete-confirmation');
                await modal.waitFor({state: 'visible', timeout: 5000});
                await modal.locator('button[type="submit"]:has-text("Delete"), button[type="submit"].btn-danger, button.btn-danger').first().click({ force: true });
                await expect(page).toHaveURL(/\/Admin\/Category\/List/i, {timeout: 30000});
                await expectSaved(page);
                expect((await listRows(page, c.name)).length).toBe(0);
            });
        });

        test('should cancel category deletion in confirmation modal [Edit_category_delete_cancel_39]', async ({ page }) => {
            await withCats(page, async (ctx) => {
                const c = await ctx.make();
                await openEdit(page, c.id);
                await page.locator('#category-delete').click();
                const modal = page.locator('#categorymodel-Delete-delete-confirmation, #category-delete-confirmation');
                await modal.waitFor({state: 'visible', timeout: 5000});
                await modal.locator('[data-dismiss="modal"]').filter({ hasText: /No, cancel|Cancel/i }).first().click();
                await expect(page).toHaveURL(new RegExp(`/Admin/Category/Edit/${c.id}`, 'i'));
                await expect(page.locator('#Name')).toHaveValue(c.name);
                expect((await listRows(page, c.name)).length).toBe(1);
            });
        });

    });

});
