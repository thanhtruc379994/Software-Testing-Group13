// admin_manufacturer.spec.js
// Tổng hợp toàn bộ 40 test cho module Manufacturer (Add Manufacturer: 20 tests, Search Manufacturer: 20 tests)
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = process.env.BASE_URL || 'http://192.168.100.208:8080';
const ADMIN_EMAIL = 'admin@yourStore.com';
const ADMIN_PASSWORD = 'Admin@123';
const CREATE_URL = BASE + '/Admin/Manufacturer/Create';
const LIST_URL = BASE + '/Admin/Manufacturer/List';
const G = '#manufacturers-grid';

// Ảnh png 1x1 dùng để test upload Picture
const PNG_1X1 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
);

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

// Đảm bảo chế độ Advanced Settings được kích hoạt để hiển thị các trường nâng cao (Picture, v.v.)
async function ensureAdvanced(page) {
    const sw = page.locator('#advanced-settings-mode');
    if (await sw.count() > 0) {
        const isChecked = await sw.isChecked().catch(() => false);
        if (!isChecked) {
            await page.locator('label[for="advanced-settings-mode"]').click().catch(async () => {
                await sw.check({ force: true }).catch(() => {});
            });
            await page.waitForTimeout(300);
        }
    }
}

async function openCreate(page) {
    await gotoAdmin(page, CREATE_URL);
    await expect(page).toHaveURL(/\/Admin\/Manufacturer\/Create/i, { timeout: 30000 });
    await expect(page.locator('#Name')).toBeVisible({ timeout: 30000 });
    await ensureAdvanced(page);
}

async function openManufacturers(page) {
    await gotoAdmin(page, LIST_URL);
    await expect(page).toHaveURL(/\/Admin\/Manufacturer\/List/i, { timeout: 30000 });
    await expect(page.locator('#search-manufacturers')).toBeVisible({ timeout: 30000 });
    await expect(page.locator(G)).toBeAttached({ timeout: 30000 });
    await waitGridLoaded(page);
}

async function waitGridLoaded(page) {
    await expect(page.locator(`${G} tbody tr`).first()).toBeVisible({ timeout: 30000 });
    await expect(page.locator(`${G}_processing`)).toBeHidden({ timeout: 30000 }).catch(() => {});
}

async function search(page) {
    const [res] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/Manufacturer/List') && r.request().method() === 'POST', { timeout: 30000 }),
        page.locator('#search-manufacturers').click()
    ]);
    expect(res.status(), 'Manufacturer list phải trả về 2xx (không lỗi 500)').toBeLessThan(400);
    await waitGridLoaded(page);
}

async function rowCount(page) {
    const rows = page.locator(`${G} tbody tr`);
    const count = await rows.count();
    if (count === 0) return 0;
    const text = await rows.first().innerText().catch(() => '');
    if (/No data available|No matching records|Không có dữ liệu/i.test(text)) return 0;
    return rows.count();
}

async function gridText(page) {
    return (await page.locator(`${G} tbody`).innerText().catch(() => '')).toLowerCase();
}

async function total(page) {
    const text = await page.locator(`${G}_info`).innerText().catch(() => '');
    const m = text.match(/of\s+([\d,.]+)/i);
    return m ? parseInt(m[1].replace(/[,.]/g, ''), 10) : 0;
}

function uniq(prefix = 'AutoMF') {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

// Tab ngôn ngữ của trường Name: standard | 1 (English) | 2 (Tiếng Việt)
function nameTab(page, key) {
    return page.locator(`a[data-tab-name="manufacturer-name-localized-${key === 'standard' ? 'standard' : key}-tab"]`);
}

// Description dùng trình soạn thảo Summernote (.note-editable) hoặc textarea #Description fallback
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

// ---- Cửa sổ xác nhận (confirm/modal) khi lưu ----
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

async function expectNoServerError(page) {
    await expect(page.locator('body')).not.toContainText(/Server Error|Internal Server Error|Exception/i);
}

async function expectEditPage(page) {
    await expect(page).toHaveURL(/\/Admin\/Manufacturer\/Edit\/\d+/i, { timeout: 30000 });
}

// Tìm manufacturer theo tên trong Manufacturer list; trả về [{href, text}] của các dòng khớp
async function findRows(page, name) {
    await gotoAdmin(page, LIST_URL);
    await page.locator('#SearchManufacturerName').fill(name);
    await Promise.all([
        page.waitForResponse(r => r.url().includes('/Manufacturer/List') && r.request().method() === 'POST', { timeout: 10000 }).catch(() => null),
        page.locator('#search-manufacturers').click()
    ]);
    const rows = page.locator('#manufacturers-grid tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 30000 });
    const first = (await rows.first().innerText()) || '';
    if (/No data available|No matching records|Không có dữ liệu/i.test(first)) return [];
    const out = [];
    for (let i = 0; i < await rows.count(); i++) {
        const row = rows.nth(i);
        const editLink = row.locator('a[href*="/Manufacturer/Edit/"]').first();
        const href = await editLink.getAttribute('href').catch(() => null);
        if (href) {
            out.push({ href, text: (await row.innerText()).trim() });
        }
    }
    return out;
}

async function findInList(page, name) {
    return (await findRows(page, name)).map(r => r.href);
}

// Xóa manufacturer thử nghiệm với confirmation modal rõ ràng và ổn định theo Requirement C
async function deleteByHref(page, href) {
    if (!href) return;
    await gotoAdmin(page, href.startsWith('http') ? href : BASE + href);
    const deleteBtn = page.locator('#manufacturer-delete, button[name="delete"], span.btn-danger:has-text("Delete")').first();
    if (!(await deleteBtn.isVisible({ timeout: 5000 }).catch(() => false))) return;
    await deleteBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator(
        '#manufacturermodel-Delete-delete-confirmation, ' +
        '#manufacturer-Delete-delete-confirmation, ' +
        '#manufacturer-delete-confirmation, ' +
        '.modal.show'
    ).first();
    await modal.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    // Nút xác nhận xóa trong modal: <button type="submit" class="btn btn-danger float-right"> Delete </button>
    const confirmBtn = page.locator(
        '#manufacturermodel-Delete-delete-confirmation button[type="submit"], ' +
        '#manufacturer-Delete-delete-confirmation button[type="submit"], ' +
        '#manufacturer-delete-confirmation button[type="submit"], ' +
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
    await page.waitForURL(/\/Admin\/Manufacturer\/List/i, { timeout: 30000 }).catch(() => {});
}

async function withMf(page, fn) {
    const ctx = { names: [], track(n) { this.names.push(n); } };
    try {
        await fn(ctx);
    } finally {
        for (const n of ctx.names) {
            const rows = await findRows(page, n).catch(() => []);
            for (const r of rows) {
                const lines = r.text.split(/\s+/);
                if (n.length < 5 && !lines.some(w => w.toLowerCase() === n.toLowerCase())) continue;
                await deleteByHref(page, r.href).catch(() => {});
            }
        }
    }
}

// ------------------------------ Main Suite ------------------------------

test.describe('Admin - Manufacturers', () => {

    test.setTimeout(180000);

    let dialogs = [];

    test.beforeEach(async ({ page }) => {
        dialogs = [];
        page.on('dialog', async d => {
            dialogs.push({ type: d.type(), message: d.message() });
            await d.accept().catch(() => {});
        });
    });

    function xssExecuted() {
        return dialogs.some(d => d.type === 'alert' && d.message === '1');
    }

    test.afterEach(async ({ page }, testInfo) => {
        const screenshotDir = path.resolve(process.cwd(), '23130075_NguyenHuuDuy', 'sreenshots');
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
    // 1. ADD / CREATE MANUFACTURER (20 tests)
    // ==========================================================================
    test.describe('Admin - Add Manufacturer', () => {
        test('should display default values when opening Add Manufacturer page [Add_manufacturer_default_value_01]', async ({ page }) => {
            await openCreate(page);
            await expect(page.locator('#Name')).toHaveValue('');
            const editor = page.locator('.note-editable').first();
            if (await editor.isVisible({timeout: 2000}).catch(() => false)) {
                await expect(editor).toHaveText('');
            } else {
                await expect(page.locator('#Description')).toHaveValue('');
            }
            await expect(page.locator('#PictureId')).toHaveValue('0');
            await expect(page.locator('.form-group:has(#Name) .required, .form-group:has(#Name) :text("*")').first()).toBeVisible();
            // Nhánh ẩn: 3 tab ngôn ngữ, tab Standard đang được chọn
            await expect(nameTab(page, 'standard')).toHaveClass(/active/);
            await expect(nameTab(page, '1')).toContainText('English');
            await expect(nameTab(page, '2')).toContainText('Tiếng Việt');
        });

        test('should save manufacturer with valid name [Add_manufacturer_valid_name_02]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const name = uniq('Valid');
                ctx.track(name);
                await openCreate(page);
                await page.locator('#Name').fill(name);
                await save(page);
                await expect(page).toHaveURL(/\/Admin\/Manufacturer\/List/i, {timeout: 30000});
                await expectSaved(page);
                expect((await findInList(page, name)).length).toBeGreaterThanOrEqual(1);
            });
        });

        test('should reject saving manufacturer with empty name [Add_manufacturer_empty_name_03]', async ({ page }) => {
            await openCreate(page);
            await save(page);
            await expectRejected(page);
            await expect(page).toHaveURL(/\/Admin\/Manufacturer\/Create/i);
        });

        test('should reject saving manufacturer with whitespace only name [Add_manufacturer_whitespace_name_04]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#Name').fill('     ');
            await save(page);
            await expectRejected(page);
        });

        test('should trim leading and trailing spaces from manufacturer name [Add_manufacturer_trim_name_05]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const name = uniq('Trim');
                ctx.track(name);
                await openCreate(page);
                await page.locator('#Name').fill(`  ${name}  `);
                await saveContinue(page);
                await expectEditPage(page);
                const val = (await page.locator('#Name').inputValue()).trim();
                expect(val).toBe(name);
            });
        });

        test('should save manufacturer with 1 character name [Add_manufacturer_single_char_name_06]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const name = 'Q';
                ctx.track(name);
                await openCreate(page);
                await page.locator('#Name').fill(name);
                await save(page);
                await expect(page).toHaveURL(/\/Admin\/Manufacturer\/List/i, {timeout: 30000});
                await expectSaved(page);
            });
        });

        test('should save manufacturer with maximum 400 characters name [Add_manufacturer_max_length_name_07]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const stamp = String(Date.now());
                const name = 'M' + stamp + 'a'.repeat(400 - stamp.length - 1);
                ctx.track(name.slice(0, 30));
                await openCreate(page);
                await page.locator('#Name').fill(name);
                await save(page);
                await expect(page).toHaveURL(/\/Admin\/Manufacturer\/List/i, {timeout: 30000});
                await expectSaved(page);
            });
        });

        test('should reject saving manufacturer with over 400 characters name [Add_manufacturer_over_length_name_08]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#Name').fill('b'.repeat(401));
            await save(page);
            // Phải xử lý có kiểm soát: báo lỗi validation, không lỗi hệ thống
            await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger, .input-validation-error').first()).toBeVisible({timeout: 30000});
            await expectNoServerError(page);
            await expectRejected(page);
        });

        test('should save manufacturer with special characters in name [Add_manufacturer_special_chars_name_09]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const name = uniq('Spec') + ' @#$%&\'"';
                ctx.track(uniq('Spec').slice(0, 5));
                await openCreate(page);
                await page.locator('#Name').fill(name);
                await saveContinue(page);
                await expectEditPage(page);
                await expect(page.locator('#Name')).toHaveValue(name);
            });
        });

        test('should safely escape HTML and script tags in manufacturer name without XSS execution [Add_manufacturer_html_script_name_10]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                ctx.track('Html_');
                await openCreate(page);
                await page.locator('#Name').fill(uniq('Html') + '<script>alert(1)</script>');
                await save(page);
                await expect(page).toHaveURL(/\/Admin\/Manufacturer\/List/i, {timeout: 30000});
                await page.waitForLoadState('networkidle').catch(() => {});
                expect(xssExecuted()).toBeFalsy();
                await expectNoServerError(page);
            });
        });

        test('should save manufacturer with Vietnamese unicode characters in name [Add_manufacturer_unicode_name_11]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const name = uniq('Nhà sản xuất Điện máy');
                ctx.track('Nhà sản xuất Điện máy');
                await openCreate(page);
                await page.locator('#Name').fill(name);
                await saveContinue(page);
                await expectEditPage(page);
                await expect(page.locator('#Name')).toHaveValue(name);
            });
        });

        test('should handle duplicate manufacturer name gracefully without server error [Add_manufacturer_duplicate_name_12]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const name = uniq('Dup');
                ctx.track(name);
                await openCreate(page);
                await page.locator('#Name').fill(name);
                await saveContinue(page);
                await expectEditPage(page);

                await openCreate(page);
                await page.locator('#Name').fill(name);
                await save(page);
                // Xác nhận theo hành vi thực tế: báo lỗi trùng hoặc cho lưu, không lỗi hệ thống
                await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger').first()).toBeVisible({timeout: 30000});
                await expectNoServerError(page);
            });
        });

        test('should save manufacturer with valid description [Add_manufacturer_valid_description_13]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const name = uniq('Desc');
                ctx.track(name);
                await openCreate(page);
                await page.locator('#Name').fill(name);
                await setDescription(page, 'Mô tả hãng sản xuất');
                await saveContinue(page);
                await expectEditPage(page);
                const editor = page.locator('.note-editable').first();
                if (await editor.isVisible({timeout: 3000}).catch(() => false)) {
                    await expect(editor).toContainText('Mô tả hãng sản xuất');
                } else {
                    await expect(page.locator('#Description')).toHaveValue(/Mô tả hãng sản xuất/);
                }
            });
        });

        test('should save manufacturer with empty description [Add_manufacturer_empty_description_14]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const name = uniq('NoDesc');
                ctx.track(name);
                await openCreate(page);
                await page.locator('#Name').fill(name);
                await save(page);
                await expect(page).toHaveURL(/\/Admin\/Manufacturer\/List/i, {timeout: 30000});
                await expectSaved(page);
            });
        });

        test('should safely handle HTML script tags in manufacturer description [Add_manufacturer_html_description_15]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const name = uniq('DescHtml');
                ctx.track(name);
                await openCreate(page);
                await page.locator('#Name').fill(name);
                await setDescription(page, '<script>alert(1)</script>');
                await saveContinue(page);
                await expectEditPage(page);
                await page.waitForLoadState('networkidle').catch(() => {});
                expect(xssExecuted()).toBeFalsy();
                await expectNoServerError(page);
            });
        });

        test('should save localized manufacturer names for English and Vietnamese [Add_manufacturer_localized_names_16]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const name = uniq('Locale');
                ctx.track(name);
                await openCreate(page);
                await page.locator('#Name').fill(name);
                await nameTab(page, '1').click();
                await page.locator('#Locales_0__Name').fill('AutoMF English');
                await nameTab(page, '2').click();
                await page.locator('#Locales_1__Name').fill('Hãng thử nghiệm');
                await saveContinue(page);
                await expectEditPage(page);
                await expectSaved(page);

                await nameTab(page, '1').click();
                await expect(page.locator('#Locales_0__Name')).toHaveValue('AutoMF English');
                await nameTab(page, '2').click();
                await expect(page.locator('#Locales_1__Name')).toHaveValue('Hãng thử nghiệm');
            });
        });

        test('should preserve entered data when switching between localized tabs [Add_manufacturer_localized_tab_switch_17]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#Name').fill('TabKeep');

            await nameTab(page, '1').click();
            await expect(page.locator('#Locales_0__Name')).toBeVisible();
            await expect(page.locator('#Name')).toBeHidden();
            await expect(page.locator('#Locales_1__Name')).toBeHidden();

            await nameTab(page, '2').click();
            await expect(page.locator('#Locales_1__Name')).toBeVisible();
            await expect(page.locator('#Locales_0__Name')).toBeHidden();

            await nameTab(page, 'standard').click();
            await expect(page.locator('#Name')).toBeVisible();
            await expect(page.locator('#Name')).toHaveValue('TabKeep');
        });

        test('should validate length boundary on localized manufacturer name [Add_manufacturer_localized_over_length_18]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const name = uniq('LocaleLong');
                ctx.track(name);
                await openCreate(page);
                await page.locator('#Name').fill(name);
                await nameTab(page, '1').click();
                await page.locator('#Locales_0__Name').fill('c'.repeat(401));
                await save(page);
                // Xử lý có kiểm soát: báo lỗi hoặc lưu theo quy định, không lỗi hệ thống
                await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger, .input-validation-error').first()).toBeVisible({timeout: 30000});
                await expectNoServerError(page);
            });
        });

        test('should upload valid manufacturer picture [Add_manufacturer_picture_valid_19]', async ({ page }) => {
            await withMf(page, async (ctx) => {
                const name = uniq('Pic');
                ctx.track(name);
                await openCreate(page);
                await ensureAdvanced(page);
                const fileInput = page.locator('input[type="file"]').first();
                await fileInput.setInputFiles({
                    name: 'logo.png', mimeType: 'image/png', buffer: PNG_1X1
                });
                // Ảnh được upload thành công: PictureId khác 0
                await expect(page.locator('#PictureId')).not.toHaveValue('0', {timeout: 30000});
                await page.locator('#Name').fill(name);
                await saveContinue(page);
                await expectEditPage(page);
                await expect(page.locator('#PictureId')).not.toHaveValue('0');
            });
        });

        test('should reject invalid file format for manufacturer picture [Add_manufacturer_picture_invalid_type_20]', async ({ page }) => {
            await openCreate(page);
            await ensureAdvanced(page);
            const fileInput = page.locator('input[type="file"]').first();
            await fileInput.setInputFiles({
                name: 'note.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image')
            });
            await page.waitForLoadState('networkidle').catch(() => {});
            await page.waitForTimeout(3000);
            // File không phải ảnh bị từ chối: không có Picture nào được gán, không lỗi hệ thống
            await expect(page.locator('#PictureId')).toHaveValue('0');
            await expectNoServerError(page);
        });

    });

    // ==========================================================================
    // 2. SEARCH MANUFACTURER (20 tests)
    // ==========================================================================
    test.describe('Admin - Search Manufacturer', () => {
        test('should display default values on Manufacturer list page [Search_manufacturer_default_value_01]', async ({ page }) => {
            await openManufacturers(page);
            await expect(page.locator('#SearchManufacturerName')).toHaveValue('');
            await expect(page.locator('#SearchPublishedId')).toHaveValue('0');
            // Nhánh ẩn: trường Store không hiển thị
            await expect(page.locator('.form-group:has(#SearchStoreId)')).toBeHidden();
            expect(await rowCount(page)).toBe(3);
            const text = await gridText(page);
            for (const n of ['apple', 'hp', 'nike']) expect(text).toContain(n);
            await expect(page.locator(`${G}_info`)).toContainText(/1\s*-\s*3\s+of\s+3/i);
        });

        test('should return all manufacturers when search name is empty [Search_manufacturer_empty_name_02]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('');
            await search(page);
            expect(await rowCount(page)).toBe(3);
        });

        test('should search manufacturer by exact name successfully [Search_manufacturer_exact_name_03]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('Apple');
            await search(page);
            expect(await rowCount(page)).toBe(1);
            expect(await gridText(page)).toContain('apple');
            await expect(page.locator(`${G}_info`)).toContainText(/1\s*-\s*1\s+of\s+1/i);
        });

        test('should search manufacturer by partial name successfully [Search_manufacturer_partial_name_04]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('Nik');
            await search(page);
            expect(await rowCount(page)).toBe(1);
            expect(await gridText(page)).toContain('nike');
        });

        test('should search manufacturer by single character keyword [Search_manufacturer_single_char_05]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('p');
            await search(page);
            expect(await rowCount(page)).toBe(2);
            const text = await gridText(page);
            expect(text).toContain('apple');
            expect(text).toContain('hp');
        });

        test('should search manufacturer case-insensitively [Search_manufacturer_case_insensitive_06]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('apple');
            await search(page);
            const lower = await rowCount(page);

            await page.locator('#SearchManufacturerName').fill('APPLE');
            await search(page);
            expect(await rowCount(page)).toBe(lower);

            await page.locator('#SearchManufacturerName').fill('ApPlE');
            await search(page);
            expect(await rowCount(page)).toBe(lower);
            expect(lower).toBe(1);
            expect(await total(page)).toBe(lower);
        });

        test('should trim spaces in manufacturer search keyword [Search_manufacturer_spaces_07]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('Apple');
            await search(page);
            const base = await total(page);

            await page.locator('#SearchManufacturerName').fill('  Apple  ');
            await search(page);
            expect(await total(page)).toBe(base);
        });

        test('should display no matching records for non-existent manufacturer name [Search_manufacturer_not_exist_08]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('KhongTonTai_99999');
            await search(page);
            expect(await rowCount(page)).toBe(0);
            await expect(page.locator(`${G} tbody`)).toContainText(/No data available|No matching records|Không có dữ liệu/i);
        });

        test('should handle special characters in manufacturer search keyword [Search_manufacturer_special_chars_09]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('@#$%&*');
            await search(page);
            expect(await rowCount(page)).toBeLessThan(3);
        });

        test('should prevent SQL injection and XSS script in manufacturer search [Search_manufacturer_injection_10]', async ({ page }) => {
            let dialogShown = false;
            page.on('dialog', async d => { dialogShown = true; await d.dismiss(); });

            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill("' OR '1'='1");
            await search(page);
            expect(dialogShown).toBeFalsy();

            await page.locator('#SearchManufacturerName').fill('<script>alert(1)</script>');
            await search(page);
            expect(dialogShown).toBeFalsy();
        });

        test('should handle length boundary search keywords up to 401 characters [Search_manufacturer_length_boundary_11]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('a'.repeat(400));
            await search(page);

            await page.locator('#SearchManufacturerName').fill('a'.repeat(401));
            await search(page);
        });

        test('should search manufacturer with Vietnamese unicode keyword [Search_manufacturer_unicode_12]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('Hãng điện máy');
            await search(page);
            expect(await rowCount(page)).toBeLessThanOrEqual(3);
        });

        test('should search manufacturer by pressing Enter key [Search_manufacturer_press_enter_13]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('HP');
            const [res] = await Promise.all([
                page.waitForResponse(r => r.url().includes('/Manufacturer/List') && r.request().method() === 'POST', {timeout: 30000}),
                page.locator('#SearchManufacturerName').press('Enter')
            ]);
            expect(res.status()).toBeLessThan(400);
            await waitGridLoaded(page);
            expect(await rowCount(page)).toBe(1);
            expect(await gridText(page)).toContain('hp');
        });

        test('should display correct options in Published dropdown list [Search_manufacturer_published_list_14]', async ({ page }) => {
            await openManufacturers(page);
            const options = (await page.locator('#SearchPublishedId option').allInnerTexts()).map(o => o.trim());
            expect(options).toEqual(['All', 'Published only', 'Unpublished only']);
            await expect(page.locator('#SearchPublishedId')).toHaveValue('0');
        });

        test('should filter manufacturers with Published only option [Search_manufacturer_published_only_15]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchPublishedId').selectOption('1');
            await search(page);
            expect(await rowCount(page)).toBe(3);
            const text = await gridText(page);
            for (const n of ['apple', 'hp', 'nike']) expect(text).toContain(n);
        });

        test('should filter manufacturers with Unpublished only option [Search_manufacturer_unpublished_only_16]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchPublishedId').selectOption('2');
            await search(page);
            await expect(page.locator(`${G} .true-icon, ${G} i.fa-check`)).toHaveCount(0);
        });

        test('should filter manufacturers by combining name and Published status [Search_manufacturer_name_and_published_17]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('Apple');
            await page.locator('#SearchPublishedId').selectOption('1');
            await search(page);
            expect(await rowCount(page)).toBe(1);
            expect(await gridText(page)).toContain('apple');

            await page.locator('#SearchPublishedId').selectOption('2');
            await search(page);
            expect(await rowCount(page)).toBe(0);
            await expect(page.locator(`${G} tbody`)).toContainText(/No data available|No matching records|Không có dữ liệu/i);
        });

        test('should verify pagination boundary when results fit in single page [Search_manufacturer_paging_boundary_18]', async ({ page }) => {
            await openManufacturers(page);
            await page.locator('#SearchManufacturerName').fill('');
            await search(page);
            await page.locator(`${G}_length select`).selectOption('7');
            await expect(page.locator(`${G}_paginate .paginate_button.next`)).toHaveClass(/disabled/);
            await expect(page.locator(`${G}_paginate .paginate_button.previous`)).toHaveClass(/disabled/);
        });

        test('should verify Store filter field is hidden during search [Search_manufacturer_hidden_store_field_19]', async ({ page }) => {
            await openManufacturers(page);
            await expect(page.locator('.form-group:has(#SearchStoreId)')).toBeHidden();
            await expect(page.locator('#SearchStoreId')).toHaveValue('0');
            await page.locator('#SearchManufacturerName').fill('Apple');
            await search(page);
            expect(await rowCount(page)).toBe(1);
            expect(await gridText(page)).toContain('apple');
        });

        test('should persist collapsed search panel state across page reload [Search_manufacturer_collapse_persist_20]', async ({ page }) => {
            await openManufacturers(page);
            const body = page.locator('.search-body');
            await expect(body).toBeVisible();
            try {
                await page.locator('.search-row').click();
                await expect(body).toBeHidden();
                await expect(page.locator(G)).toBeVisible();
                // Đợi trạng thái thu gọn được lưu (ManufacturersPage.HideSearchBlock) rồi tải lại
                await page.waitForLoadState('networkidle');
                await page.reload();
                await waitGridLoaded(page);
                await expect(page.locator('.search-body')).toBeHidden();
            } finally {
                if (await page.locator('.search-body').isHidden()) {
                    await page.locator('.search-row').click();
                    await page.waitForLoadState('networkidle');
                }
            }
            await expect(page.locator('.search-body')).toBeVisible();
        });

    });

});
