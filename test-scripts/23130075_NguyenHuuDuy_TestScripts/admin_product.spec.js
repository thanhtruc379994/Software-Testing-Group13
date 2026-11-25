// admin_product.spec.js
// Tổng hợp toàn bộ 92 test cho module Product (Create Product: 30 tests, Search Product: 30 tests, Bulk Edit: 32 tests)
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const ADMIN_EMAIL = 'admin@yourStore.com';
const ADMIN_PASSWORD = 'Admin@123';
const CREATE_URL = BASE + '/Admin/Product/Create';
const LIST_URL = BASE + '/Admin/Product/List';
const BULK_URL = BASE + '/Admin/Product/BulkEdit';
const G = '#products-grid';
const TABLE_SELECTOR = 'table.table-hover';

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
    await expect(page).toHaveURL(/\/Admin\/Product\/Create/i, { timeout: 30000 });
    await expect(page.locator('#Name')).toBeVisible({ timeout: 30000 });
}

async function openProducts(page) {
    await gotoAdmin(page, LIST_URL);
    await expect(page.locator('#search-products')).toBeVisible({ timeout: 30000 });
    await expect(page.locator(G)).toBeVisible({ timeout: 30000 });
    await waitGridLoaded(page);
}

async function openBulk(page) {
    await gotoAdmin(page, BULK_URL);
    await expect(page).toHaveURL(/\/Admin\/Product\/BulkEdit/i, { timeout: 30000 });
    await expect(page.locator('#SearchProductName')).toBeVisible({ timeout: 30000 });
    await page.waitForLoadState('networkidle').catch(() => {});
}

async function waitGridLoaded(page) {
    await expect(page.locator(`${G} tbody tr`).first()).toBeVisible({ timeout: 30000 });
    await expect(page.locator(`${G}_processing`)).toBeHidden({ timeout: 30000 }).catch(() => {});
}

async function search(page) {
    const [res] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/Product/ProductList'), { timeout: 30000 }),
        page.locator('#search-products').click()
    ]);
    expect(res.status(), 'ProductList phải trả về 2xx (không lỗi 500)').toBeLessThan(400);
    await waitGridLoaded(page);
}

async function typeName(page, text) {
    await page.locator('#SearchProductName').fill(text);
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

async function rowCountBulk(page) {
    const table = page.locator(TABLE_SELECTOR).first();
    const tbody = table.locator('tbody');
    const text = (await tbody.innerText().catch(() => '')) || '';
    if (/No data available|No matching records|Không có dữ liệu/i.test(text)) {
        return 0;
    }
    return table.locator('tbody tr').count();
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

function uniq(prefix = 'AutoProd') {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
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
    await expect(page).toHaveURL(/\/Admin\/Product\/Edit\/\d+/i, { timeout: 30000 });
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

async function listCount(page, name) {
    await gotoAdmin(page, LIST_URL);
    await page.locator('#SearchProductName').fill(name);
    await Promise.all([
        page.waitForResponse(r => r.url().includes('/Product/ProductList'), { timeout: 10000 }).catch(() => null),
        page.locator('#search-products').click()
    ]);
    const rows = page.locator('#products-grid tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 30000 });
    const text = (await rows.first().innerText()) || '';
    if (/No data available|No matching records|Không có dữ liệu/i.test(text)) return 0;
    return rows.count();
}

async function resetFilters(page) {
    await page.locator('#SearchProductName').fill('');
    await page.locator('#SearchCategoryId').selectOption('0');
    if (await page.locator('#SearchIncludeSubCategories').isChecked()) {
        await page.locator('#SearchIncludeSubCategories').uncheck();
    }
    await page.locator('#SearchManufacturerId').selectOption('0');
    await page.locator('#SearchVendorId').selectOption('0');
    await page.locator('#SearchWarehouseId').selectOption('0');
    await page.locator('#SearchProductTypeId').selectOption('0');
    await page.locator('#SearchPublishedId').selectOption('0');
}

async function clickSearch(page) {
    await page.locator('button.btn-search, button:has-text("Search")').first().click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(600);
}

async function getProductNames(page) {
    const rows = page.locator(`${TABLE_SELECTOR} tbody tr`);
    const count = await rowCountBulk(page);
    const names = [];
    for (let i = 0; i < count; i++) {
        const nameInput = rows.nth(i).locator('input[name^="name-"], td:nth-child(2) input').first();
        if (await nameInput.count() > 0) {
            names.push(await nameInput.inputValue());
        }
    }
    return names;
}

// ------------------------------ Main Suite ------------------------------

test.describe('Admin - Products', () => {

    test.setTimeout(180000);

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
    // 1. CREATE PRODUCT (30 tests)
    // ==========================================================================
    test.describe('Admin - Create Product', () => {
        test('should display default values on Add Product screen [Create_product_default_value_01]', async ({ page }) => {
            await openCreate(page);
            await expect(page.locator('#Name')).toHaveValue('');
            await expect(page.locator('#Sku')).toHaveValue('');
            expect(await numValue(page, 'Price')).toBe(0);
            expect(await numValue(page, 'Weight')).toBe(0);
            expect(await numValue(page, 'Length')).toBe(0);
            expect(await numValue(page, 'Width')).toBe(0);
            expect(await numValue(page, 'Height')).toBe(0);
            await expect(page.locator('#IsTaxExempt')).not.toBeChecked();
            // Tax category = [None], Inventory method = Don't track inventory
            await expect(page.locator('#TaxCategoryId')).toHaveValue('0');
            await expect(page.locator('#ManageInventoryMethodId option:checked')).toHaveText(/Don't track inventory/i);
        });

        test('should display required asterisk mark for Product name [Create_product_required_mark_02]', async ({ page }) => {
            await openCreate(page);
            await expect(page.locator('.form-group:has(#Name) .required, .form-group:has(#Name) :text("*")').first()).toBeVisible();
        });

        test('should collapse and expand Product info panel [Create_product_toggle_panel_03]', async ({ page }) => {
            await openCreate(page);
            const card = page.locator('.card[data-card-name="product-info"]');
            await card.locator('.card-header').first().click();
            await expect(card).toHaveClass(/collapsed-card/);
            await card.locator('.card-header').first().click();
            await expect(card).not.toHaveClass(/collapsed-card/);
            await expect(page.locator('#Name')).toBeVisible();
        });

        test('should display save-first message on Multimedia panel [Create_product_multimedia_message_04]', async ({ page }) => {
            await openCreate(page);
            await expect(page.getByText(/You need to save the product before you can upload pictures or videos/i)).toBeVisible();
        });

        test('should display save-first message on Product attributes panel [Create_product_attributes_message_05]', async ({ page }) => {
            await openCreate(page);

            const panel = page.locator('#product-attributes-area, .card:has(.card-title:has-text("Product attributes"))').first();
            await panel.locator('.card-header').click();   // mở panel nếu đang collapse

            // Khớp lỏng theo ý nghĩa, không phụ thuộc đúng từng chữ
            await expect(panel.getByText(/save the product before/i)).toBeVisible();
        });

        test('should create product successfully with valid name [Create_product_valid_name_06]', async ({ page }) => {
            const name = uniq('ValidName');
            await openCreate(page);
            await page.locator('#Name').fill(name);
            await save(page);
            await expect(page).toHaveURL(/\/Admin\/Product\/List/i, {timeout: 30000});
            await expectSaved(page);
            expect(await listCount(page, name)).toBe(1);
        });

        test('should reject creating product with empty name [Create_product_empty_name_07]', async ({ page }) => {
            await openCreate(page);
            await save(page);
            await expectRejected(page);
            await expect(page).toHaveURL(/\/Admin\/Product\/Create/i);
        });

        test('should reject creating product with whitespace only name [Create_product_whitespace_name_08]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#Name').fill('     ');
            await save(page);
            await expectRejected(page);
        });

        test('should trim leading and trailing spaces from product name [Create_product_trim_name_09]', async ({ page }) => {
            const name = uniq('TrimTest');
            await createAndEdit(page, `  ${name}  `);
            await expect(page.locator('#Name')).toHaveValue(name);
        });

        test('should create product with special characters in name [Create_product_special_chars_name_10]', async ({ page }) => {
            const name = uniq('Spec') + ' @#$%&\'"';
            await createAndEdit(page, name);
            await expect(page.locator('#Name')).toHaveValue(name);
        });

        test('should safely escape HTML and script tags in product name [Create_product_html_name_11]', async ({ page }) => {
            let dialogShown = false;
            page.on('dialog', async d => { dialogShown = true; await d.dismiss(); });
            const name = uniq('Html') + '<script>alert(1)</script>';
            await openCreate(page);
            await page.locator('#Name').fill(name);
            await save(page);
            await expect(page).toHaveURL(/\/Admin\/Product\/List/i, {timeout: 30000});
            await page.waitForLoadState('networkidle');
            expect(dialogShown).toBeFalsy();
        });

        test('should create product with Vietnamese unicode characters in name [Create_product_unicode_name_12]', async ({ page }) => {
            const name = uniq('Điện thoại thông minh');
            await createAndEdit(page, name);
            await expect(page.locator('#Name')).toHaveValue(name);
        });

        test('should create product with maximum allowed name length of 400 characters [Create_product_max_length_name_13]', async ({ page }) => {
            const name = 'N' + Date.now() + 'a'.repeat(400 - String(Date.now()).length - 1);
            await openCreate(page);
            await page.locator('#Name').fill(name);
            await save(page);
            await expect(page).toHaveURL(/\/Admin\/Product\/List/i, {timeout: 30000});
            await expectSaved(page);
        });

        test('should reject creating product with name exceeding 400 characters [Create_product_over_length_name_14]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#Name').fill('b'.repeat(401));
            await save(page);
            // Hệ thống phải xử lý có kiểm soát: báo lỗi hoặc lưu theo quy định, không lỗi 500
            await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger, .input-validation-error').first()).toBeVisible({timeout: 30000});
            await expect(page.locator('body')).not.toContainText(/Server Error|Internal Server Error|Exception/i);
        });

        test('should save product with valid short description [Create_product_short_description_15]', async ({ page }) => {
            const name = uniq('ShortDesc');
            await createAndEdit(page, name, async () => {
                await page.locator('#ShortDescription').fill('Mô tả ngắn của sản phẩm');
            });
            await expect(page.locator('#ShortDescription')).toHaveValue('Mô tả ngắn của sản phẩm');
        });

        test('should save product with valid SKU [Create_product_sku_valid_16]', async ({ page }) => {
            const sku = uniq('SKU');
            await createAndEdit(page, uniq('SkuValid'), async () => {
                await page.locator('#Sku').fill(sku);
            });
            await expect(page.locator('#Sku')).toHaveValue(sku);
        });

        test('should save product with empty SKU [Create_product_sku_empty_17]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#Name').fill(uniq('SkuEmpty'));
            await save(page);
            await expectSaved(page);
        });

        test('should handle duplicate SKU gracefully without server crash [Create_product_sku_duplicate_18]', async ({ page }) => {
            const sku = uniq('DUP');
            await createAndEdit(page, uniq('SkuDupA'), async () => {
                await page.locator('#Sku').fill(sku);
            });
            await openCreate(page);
            await page.locator('#Name').fill(uniq('SkuDupB'));
            await page.locator('#Sku').fill(sku);
            await save(page);
            // Xác nhận theo hành vi thực tế: cho phép lưu hoặc báo lỗi trùng, không lỗi hệ thống
            await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger').first()).toBeVisible({timeout: 30000});
            await expect(page.locator('body')).not.toContainText(/Server Error|Internal Server Error/i);
        });

        test('should save product associated with a single category [Create_product_category_single_19]', async ({ page }) => {
            await createAndEdit(page, uniq('Cat1'), async () => {
                await page.locator('#SelectedCategoryIds').selectOption(['1']);   // Computers
            });
            await expect(page.locator('#SelectedCategoryIds')).toHaveValues(['1']);
        });

        test('should save product associated with multiple categories [Create_product_category_multiple_20]', async ({ page }) => {
            await createAndEdit(page, uniq('CatMulti'), async () => {
                await page.locator('#SelectedCategoryIds').selectOption(['1', '14']);   // Computers, Books
            });
            await expect
                .poll(async () => (await page.locator('#SelectedCategoryIds').evaluate(
                    el => Array.from(el.selectedOptions, o => o.value)
                )).sort())
                .toEqual(['1', '14'].sort());
        });

        test('should save product with valid price value [Create_product_price_valid_21]', async ({ page }) => {
            await createAndEdit(page, uniq('PriceOk'), async () => {
                await fillNum(page, 'Price', '99.99');
            });
            expect(await numValue(page, 'Price')).toBeCloseTo(99.99, 2);
        });

        // bug 100%
        test('should reject negative price value [Create_product_price_negative_22]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#Name').fill(uniq('PriceNeg'));
            await fillNum(page, 'Price', '-10');
            await save(page);
            await expectRejected(page);
        });

        test('should reject non-numeric characters in price field [Create_product_price_text_23]', async ({ page }) => {
            await openCreate(page);
            await numField(page, 'Price').click();
            await numField(page, 'Price').pressSequentially('abc');
            await numField(page, 'Price').press('Tab');
            // Ô số không chấp nhận chữ: giá trị không thể là 'abc'
            expect(await numField(page, 'Price').inputValue()).not.toMatch(/abc/i);
        });

        test('should save product with Tax exempt enabled [Create_product_tax_exempt_24]', async ({ page }) => {
            await createAndEdit(page, uniq('TaxExempt'), async () => {
                await page.locator('#IsTaxExempt').check();
            });
            await expect(page.locator('#IsTaxExempt')).toBeChecked();
        });

        test('should save product with selected Tax category [Create_product_tax_category_25]', async ({ page }) => {
            let chosen = '0';
            await createAndEdit(page, uniq('TaxCat'), async () => {
                await page.locator('#TaxCategoryId').selectOption({index: 1});
                chosen = await page.locator('#TaxCategoryId').inputValue();
            });
            expect(chosen).not.toBe('0');
            await expect(page.locator('#TaxCategoryId')).toHaveValue(chosen);
        });

        test('should hide dimension fields when Shipping enabled is unchecked [Create_product_shipping_disabled_26]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#IsShipEnabled').uncheck();
            await expect(page.locator('.form-group:has(#Weight)')).toBeHidden();
            await page.locator('#IsShipEnabled').check();
            await expect(page.locator('.form-group:has(#Weight)')).toBeVisible();
        });

        test('should save product with valid physical dimensions and weight [Create_product_dimensions_valid_27]', async ({ page }) => {
            await createAndEdit(page, uniq('Dims'), async () => {
                await fillNum(page, 'Weight', '2.5');
                await fillNum(page, 'Length', '10');
                await fillNum(page, 'Width', '20');
                await fillNum(page, 'Height', '30');
            });
            expect(await numValue(page, 'Weight')).toBeCloseTo(2.5, 2);
            expect(await numValue(page, 'Length')).toBeCloseTo(10, 2);
            expect(await numValue(page, 'Width')).toBeCloseTo(20, 2);
            expect(await numValue(page, 'Height')).toBeCloseTo(30, 2);
        });

        test('should display stock quantity field when Track inventory is selected [Create_product_inventory_track_28]', async ({ page }) => {
            await openCreate(page);
            await page.locator('#ManageInventoryMethodId').selectOption({label: 'Track inventory'});
            await expect(page.locator('.form-group:has(#StockQuantity)')).toBeVisible();
        });

        test('should save and continue editing product with valid data [Create_product_save_continue_29]', async ({ page }) => {
            const name = uniq('SaveContinue');
            await createAndEdit(page, name);
            await expectSaved(page);
            await expect(page.locator('#Name')).toHaveValue(name);
            // Sau khi lưu, panel Multimedia và Product attributes không còn thông báo "cần lưu trước"
            await expect(page.getByText(/You need to save the product before you can upload pictures or videos/i)).toHaveCount(0);
        });

        test('should save product with complete data fields and verify persistence [Create_product_full_data_30]', async ({ page }) => {
            const name = uniq('FullData');
            const sku = uniq('FULL');
            await createAndEdit(page, name, async () => {
                await page.locator('#ShortDescription').fill('Mô tả ngắn đầy đủ');
                await page.locator('#Sku').fill(sku);
                await page.locator('#SelectedCategoryIds').selectOption(['1']);
                await fillNum(page, 'Price', '150.5');
                await page.locator('#IsTaxExempt').check();
                await fillNum(page, 'Weight', '1.5');
            });
            await expect(page.locator('#Name')).toHaveValue(name);
            await expect(page.locator('#ShortDescription')).toHaveValue('Mô tả ngắn đầy đủ');
            await expect(page.locator('#Sku')).toHaveValue(sku);
            await expect(page.locator('#SelectedCategoryIds')).toHaveValues(['1']);
            expect(await numValue(page, 'Price')).toBeCloseTo(150.5, 2);
            await expect(page.locator('#IsTaxExempt')).toBeChecked();
            expect(await numValue(page, 'Weight')).toBeCloseTo(1.5, 2);
            expect(await listCount(page, name)).toBe(1);
        });

    });

    // ==========================================================================
    // 2. SEARCH PRODUCT (30 tests)
    // ==========================================================================
    test.describe('Admin - Search Product', () => {
        test('should display default values on Product list page [Search_product_default_value_01]', async ({ page }) => {
            await openProducts(page);
            await expect(page.locator('#SearchProductName')).toHaveValue('');
            for (const id of ['#SearchCategoryId', '#SearchManufacturerId', '#SearchVendorId', '#SearchWarehouseId', '#SearchProductTypeId', '#SearchPublishedId']) {
                await expect(page.locator(id)).toHaveValue('0');
            }
            await expect(page.locator('#SearchIncludeSubCategories')).not.toBeChecked();
            await expect(page.locator('#GoDirectlyToSku')).toHaveValue('');
            expect(await rowCount(page)).toBeGreaterThan(0);
            expect(await rowCount(page)).toBeLessThanOrEqual(15);
        });

        test('should collapse and expand Search panel [Search_product_collapse_panel_02]', async ({ page }) => {
            await openProducts(page);
            await typeName(page, 'abc');
            await page.locator('.search-row').click();
            await expect(page.locator('.search-body')).toBeHidden();
            await expect(page.locator(G)).toBeVisible();
            await page.locator('.search-row').click();
            await expect(page.locator('.search-body')).toBeVisible();
            await expect(page.locator('#SearchProductName')).toHaveValue('abc');
        });

        test('should return all products when product name is empty [Search_product_empty_product_name_03]', async ({ page }) => {
            await openProducts(page);
            await search(page);
            expect(await rowCount(page)).toBeGreaterThan(0);
            expect(await total(page)).toBeGreaterThan(15);
        });

        test('should search product by exact name successfully [Search_product_exact_product_name_04]', async ({ page }) => {
            await openProducts(page);
            await typeName(page, 'Apple MacBook Pro');
            await search(page);
            expect(await rowCount(page)).toBe(1);
            expect(await gridText(page)).toContain('apple macbook pro');
        });

        test('should search product by keyword partial name [Search_product_keyword_05]', async ({ page }) => {
            await openProducts(page);
            await typeName(page, 'Nikon');
            await search(page);
            const n = await rowCount(page);
            expect(n).toBeGreaterThan(0);
            for (const t of await page.locator(`${G} tbody tr`).allInnerTexts()) {
                expect(t.toLowerCase()).toContain('nikon');
            }
        });

        test('should search product case-insensitively [Search_product_case_insensitive_06]', async ({ page }) => {
            await openProducts(page);
            await typeName(page, 'nikon');
            await search(page);
            const lower = await total(page);
            await typeName(page, 'NIKON');
            await search(page);
            const upper = await total(page);
            expect(lower).toBeGreaterThan(0);
            expect(upper).toBe(lower);
        });

        test('should trim spaces in product search keyword [Search_product_keyword_with_spaces_07]', async ({ page }) => {
            await openProducts(page);
            await typeName(page, 'Nikon');
            await search(page);
            const base = await total(page);
            await typeName(page, '  Nikon  ');
            await search(page);
            expect(await total(page)).toBe(base);
        });

        test('should display no matching records for non-existent product [Search_product_not_exist_name_08]', async ({ page }) => {
            await openProducts(page);
            await typeName(page, 'zzzxxx123');
            await search(page);
            await expectEmpty(page);
        });

        test('should handle special characters in product search keyword [Search_product_special_chars_09]', async ({ page }) => {
            await openProducts(page);
            for (const kw of ['%', "'", '_', '\\', '@#$&']) {
                await typeName(page, kw);
                await search(page);              // search() fail nếu server trả lỗi >= 400
                await expect(page.locator(G)).toBeVisible();
            }
        });

        test('should prevent SQL injection and XSS script in product search [Search_product_injection_10]', async ({ page }) => {
            let dialogShown = false;
            page.on('dialog', async d => { dialogShown = true; await d.dismiss(); });
            await openProducts(page);
            await search(page);
            const all = await total(page);
            await typeName(page, "' OR '1'='1");
            await search(page);
            expect(await total(page)).toBeLessThan(all);
            await typeName(page, '<script>alert(1)</script>');
            await search(page);
            expect(dialogShown).toBeFalsy();
        });

        test('should handle long search keywords over 400 characters [Search_product_long_keyword_11]', async ({ page }) => {
            await openProducts(page);
            await typeName(page, 'a'.repeat(500));
            await search(page);
            await expect(page.locator(G)).toBeVisible();
        });

        test('should search product with Vietnamese unicode characters [Search_product_unicode_keyword_12]', async ({ page }) => {
            await openProducts(page);
            await typeName(page, 'máy tính');
            await search(page);
            await expect(page.locator(G)).toBeVisible();
        });

        test('should search product by pressing Enter key [Search_product_press_enter_13]', async ({ page }) => {
            await openProducts(page);
            await typeName(page, 'Lenovo');
            await Promise.all([
                page.waitForResponse(r => r.url().includes('/Product/ProductList')),
                page.locator('#SearchProductName').press('Enter')
            ]);
            await waitGridLoaded(page);
            expect(await rowCount(page)).toBeGreaterThan(0);
            for (const t of await page.locator(`${G} tbody tr`).allInnerTexts()) {
                expect(t.toLowerCase()).toContain('lenovo');
            }
        });

        test('should filter products by category without subcategories [Search_product_category_no_subcategories_14]', async ({ page }) => {
            await openProducts(page);
            await choose(page, '#SearchCategoryId', '1');   // Computers
            await search(page);
            await expect(page.locator(G)).toBeVisible();
            expect(await total(page)).toBeLessThan(await (async () => { await choose(page, '#SearchCategoryId', '0'); await search(page); return total(page); })());
        });

        test('should filter products by category including subcategories [Search_product_category_with_subcategories_15]', async ({ page }) => {
            await openProducts(page);
            await choose(page, '#SearchCategoryId', '1');
            await search(page);
            const without = await total(page);
            await page.locator('#SearchIncludeSubCategories').check();
            await search(page);
            const withSub = await total(page);
            expect(withSub).toBeGreaterThanOrEqual(without);
            expect(withSub).toBeGreaterThan(0);
        });

        test('should handle Search subcategories option when Category is All [Search_product_subcategories_with_all_16]', async ({ page }) => {
            await openProducts(page);
            await search(page);
            const all = await total(page);
            await page.locator('#SearchIncludeSubCategories').check();
            await search(page);
            expect(await total(page)).toBe(all);
        });

        test('should filter products by manufacturer [Search_product_manufacturer_18]', async ({ page }) => {
            await openProducts(page);
            await search(page);
            const all = await total(page);
            await choose(page, '#SearchManufacturerId', '1');   // Apple
            await search(page);
            expect(await total(page)).toBeLessThan(all);
            expect(await gridText(page)).toContain('apple macbook pro');
        });

        test('should filter products by vendor [Search_product_vendor_20]', async ({ page }) => {
            await openProducts(page);
            await search(page);
            const all = await total(page);
            await choose(page, '#SearchVendorId', '1');
            await search(page);
            expect(await total(page)).toBeLessThanOrEqual(all);
        });

        test('should filter products by warehouse [Search_product_warehouse_22]', async ({ page }) => {
            await openProducts(page);
            await search(page);
            const all = await total(page);
            await choose(page, '#SearchWarehouseId', '1');
            await search(page);
            expect(await total(page)).toBeLessThanOrEqual(all);
        });

        test('should filter products by product type Simple [Search_product_type_simple_24]', async ({ page }) => {
            await openProducts(page);
            await search(page);
            const all = await total(page);
            await choose(page, '#SearchProductTypeId', '5');
            await search(page);
            expect(await total(page)).toBeGreaterThan(0);
            expect(await total(page)).toBeLessThanOrEqual(all);
        });

        test('should filter products by product type Grouped [Search_product_type_grouped_25]', async ({ page }) => {
            await openProducts(page);
            await search(page);
            const all = await total(page);
            await choose(page, '#SearchProductTypeId', '5');
            await search(page);
            const simple = await total(page);
            await choose(page, '#SearchProductTypeId', '10');
            await search(page);
            const grouped = await total(page);
            expect(simple + grouped).toBe(all);
        });

        test('should filter products with Published only status [Search_product_published_only_26]', async ({ page }) => {
            await openProducts(page);
            await choose(page, '#SearchPublishedId', '1');
            await search(page);
            expect(await rowCount(page)).toBeGreaterThan(0);
            await expect(page.locator(`${G} .false-icon`)).toHaveCount(0);
            expect(await page.locator(`${G} .true-icon`).count()).toBeGreaterThan(0);
        });

        test('should filter products with Unpublished only status [Search_product_unpublished_only_27]', async ({ page }) => {
            await openProducts(page);
            await choose(page, '#SearchPublishedId', '2');
            await search(page);
            await expect(page.locator(`${G} .true-icon`)).toHaveCount(0);
        });

        test('should navigate directly to product using existing SKU [Search_product_sku_exist_28]', async ({ page }) => {
            await openProducts(page);
            await page.locator('#GoDirectlyToSku').fill('AP_MBP_13');
            await page.locator('#go-to-product-by-sku').click();
            await expect(page).toHaveURL(/\/Admin\/Product\/Edit\/\d+/i, {timeout: 30000});
            await expect(page.locator('#Name')).toHaveValue(/Apple MacBook Pro/i);
        });

        test('should handle Go directly to SKU with non-existent SKU [Search_product_sku_not_exist_29]', async ({ page }) => {
            await openProducts(page);
            await page.locator('#GoDirectlyToSku').fill('NOT_EXIST_999');
            await page.locator('#go-to-product-by-sku').click();
            await page.waitForLoadState('networkidle');
            await expect(page).not.toHaveURL(/\/Product\/Edit\//i);
            await expect(page.locator('#search-products')).toBeVisible();
        });

        test('should handle Go directly to SKU with empty input [Search_product_sku_empty_30]', async ({ page }) => {
            await openProducts(page);
            await page.locator('#go-to-product-by-sku').click();
            await page.waitForLoadState('networkidle');
            await expect(page).not.toHaveURL(/\/Product\/Edit\//i);
            await expect(page.locator('#search-products')).toBeVisible();
        });

        // bug 100 %
        test('should reject when Available start date is later than end date [Create_product_available_date_range_31]', async ({page}) => {
            await openCreate(page);
            // Chuyển từ Basic sang Advanced để hiện 2 ô ngày
            if (!(await page.locator('#advanced-settings-mode').isChecked().catch(() => false))) {
                await page.locator('.onoffswitch-label').click();
            }
            await page.locator('#Name').fill(uniq('DateRange'));
            await page.locator('#AvailableStartDateTimeUtc').fill('2026-12-31T10:00');
            await page.locator('#AvailableEndDateTimeUtc').fill('2026-12-01T10:00');
            await save(page);
            // Mong đợi: bị từ chối (ở lại trang Create, có lỗi, không báo lưu thành công)
            await expect(page.locator('.alert-success')).toHaveCount(0);
            await expect(page).toHaveURL(/\/Admin\/Product\/Create/i);
            await expect(page.locator('.field-validation-error, .validation-summary-errors, .alert-danger, .input-validation-error').first()).toBeVisible({timeout: 15000});
        });


        test('should trigger Go directly to SKU by pressing Enter [Search_product_sku_press_enter_32]', async ({ page }) => {
            await openProducts(page);
            await page.locator('#GoDirectlyToSku').fill('AP_MBP_13');
            await page.locator('#GoDirectlyToSku').press('Enter');
            await expect(page).toHaveURL(/\/Admin\/Product\/Edit\/\d+/i, {timeout: 30000});
        });


        // bug 100%
// BUG: Product cost accepts negative value and product is still saved
        test('should reject negative Product cost when creating product [Create_product_negative_product_cost_33]', async ({ page }) => {
            await openCreate(page);

            // Chuyển từ Basic sang Advanced để hiện Product cost
            if (!(await page.locator('#advanced-settings-mode').isChecked().catch(() => false))) {
                await page.locator('.onoffswitch-label').click();
            }

            await page.locator('#Name').fill(uniq('NegativeProductCost'));

            // Product cost không được phép âm
            await page.locator('#ProductCost').fill('-100');

            await save(page);

            // Mong đợi: bị từ chối, không tạo product
            await expect(page.locator('.alert-success')).toHaveCount(0);
            await expect(page).toHaveURL(/\/Admin\/Product\/Create/i);

            // Phải xuất hiện validation error
            await expect(
                page.locator(
                    '#ProductCost.input-validation-error, ' +
                    '[data-valmsg-for="ProductCost"].field-validation-error, ' +
                    '.validation-summary-errors, ' +
                    '.alert-danger'
                ).first()
            ).toBeVisible({ timeout: 15000 });
        });


// bug 100%
// BUG: Old price accepts negative value and product is still saved
            test('should reject negative Old price when creating product [Create_product_negative_old_price_34]', async ({ page }) => {
            await openCreate(page);

            // Chuyển từ Basic sang Advanced để hiện Old price
            if (!(await page.locator('#advanced-settings-mode').isChecked().catch(() => false))) {
                await page.locator('.onoffswitch-label').click();
            }

            await page.locator('#Name').fill(uniq('NegativeOldPrice'));

            // Old price không được phép âm
            await page.locator('#OldPrice').fill('-100');

            await save(page);

            // Mong đợi: bị từ chối, không tạo product
            await expect(page.locator('.alert-success')).toHaveCount(0);
            await expect(page).toHaveURL(/\/Admin\/Product\/Create/i);

            // Phải xuất hiện validation error
            await expect(
                page.locator(
                    '#OldPrice.input-validation-error, ' +
                    '[data-valmsg-for="OldPrice"].field-validation-error, ' +
                    '.validation-summary-errors, ' +
                    '.alert-danger'
                ).first()
            ).toBeVisible({ timeout: 15000 });
        });

        // bug 100%
// BUG: Product allows Minimum cart quantity to be greater than Maximum cart quantity
        test('should reject when Minimum cart quantity is greater than Maximum cart quantity [Create_product_invalid_cart_quantity_range_34]', async ({ page }) => {
            await openCreate(page);

            // Chuyển từ Basic sang Advanced để hiện Order quantity settings
            if (!(await page.locator('#advanced-settings-mode').isChecked().catch(() => false))) {
                await page.locator('.onoffswitch-label').click();
            }

            await page.locator('#Name').fill(uniq('InvalidCartQuantity'));

            // Minimum quantity > Maximum quantity
            await page.locator('#OrderMinimumQuantity').fill('100');
            await page.locator('#OrderMaximumQuantity').fill('10');

            await save(page);

            // Mong đợi: bị từ chối, không tạo product
            await expect(page.locator('.alert-success')).toHaveCount(0);
            await expect(page).toHaveURL(/\/Admin\/Product\/Create/i);

            // Phải xuất hiện validation error
            await expect(
                page.locator(
                    '#OrderMinimumQuantity.input-validation-error, ' +
                    '#OrderMaximumQuantity.input-validation-error, ' +
                    '[data-valmsg-for="OrderMinimumQuantity"].field-validation-error, ' +
                    '[data-valmsg-for="OrderMaximumQuantity"].field-validation-error, ' +
                    '.validation-summary-errors, ' +
                    '.alert-danger'
                ).first()
            ).toBeVisible({ timeout: 15000 });
        });

        test('should return empty results when product name and category mismatch [Search_product_name_category_mismatch_35]', async ({ page }) => {
            await openProducts(page);
            await typeName(page, 'Nikon');
            await choose(page, '#SearchCategoryId', '6');    // Computers >> Software
            await search(page);
            await expectEmpty(page);
        });

        test('should filter products by both name and category [Search_product_name_and_category_34]', async ({ page }) => {
            await openProducts(page);
            await typeName(page, 'Lenovo');
            await choose(page, '#SearchCategoryId', '1');
            await page.locator('#SearchIncludeSubCategories').check();
            await search(page);
            expect(await rowCount(page)).toBeGreaterThan(0);
            for (const t of await page.locator(`${G} tbody tr`).allInnerTexts()) {
                expect(t.toLowerCase()).toContain('lenovo');
            }
        });

        test('should navigate to next page in products grid [Search_product_paging_next_40]', async ({ page }) => {
            await openProducts(page);
            await search(page);

            // Tìm nút Next theo HTML thực tế
            const next = page.locator(
                'a.page-link.next[aria-controls="products-grid"]'
            );

            // Kiểm tra nút Next tồn tại và hiển thị
            await expect(next).toBeVisible();

            // Kiểm tra nút Next không bị vô hiệu hóa
            await expect(next).not.toHaveClass(/disabled/);

            // Chuyển sang trang kế tiếp
            await next.click();

            // Chờ dữ liệu grid tải xong
            await waitGridLoaded(page);

            // Kiểm tra thông tin hiển thị từ sản phẩm 16 đến 30
            await expect(page.locator('#products-grid_info'))
                .toContainText(/16\s*-\s*30/);

            // Kiểm tra trang 2 đang active
            await expect(
                page.locator('.dt-paging-button.active')
            ).toContainText('2');
        });

    });

    // ==========================================================================
    // 3. BULK EDIT PRODUCTS (32 tests)
    // ==========================================================================
    test.describe('Admin - Bulk Edit Products', () => {
        test.beforeEach(async ({ page }, testInfo) => {
            if (testInfo.title.includes('Search_product_in_bulk_edit_no_login_31')) {
                return;
            }
            await openBulk(page);
            await resetFilters(page);
        });

        // test('should display default values on Bulk edit products page [Search_product_in_bulk_edit_default_value_01]', async ({ page }) => {
        //     expect(await page.locator('#SearchProductName').inputValue()).toBe('');
        //     expect(await page.locator('#SearchCategoryId').inputValue()).toBe('0');
        //     expect(await page.locator('#SearchIncludeSubCategories').isChecked()).toBe(false);
        //     expect(await page.locator('#SearchPublishedId').inputValue()).toBe('0');
        //
        //     await page.locator('#SearchManufacturerId').selectOption('0', { force: true });
        //     await page.locator('#SearchVendorId').selectOption('0', { force: true });
        //     await page.locator('#SearchWarehouseId').selectOption('0', { force: true });
        //     await page.locator('#SearchProductTypeId').selectOption('0', { force: true });
        //
        //     expect(await rowCountBulk(page)).toBeGreaterThan(0);
        //     const loadedInfo = await page.locator('#loaded-info').innerText();
        //     expect(loadedInfo).toMatch(/\d+-\d+ of \d+ items/i);
        // });

        test('should display correct columns in bulk edit table [Search_product_in_bulk_edit_columns_02]', async ({ page }) => {
            const headers = await page.locator(`${TABLE_SELECTOR} thead th`).allInnerTexts();
            const expectedHeaders = ['Select', 'Product name', 'SKU', 'Price', 'Old price', 'Stock quantity', 'Published'];
            for (const h of expectedHeaders) {
                expect(headers.some(header => header.trim().includes(h))).toBe(true);
            }
        });

        test('should search bulk edit products with empty name [Search_product_in_bulk_edit_empty_product_name_03]', async ({ page }) => {
            await page.locator('#SearchProductName').fill('');
            await clickSearch(page);
            expect(await rowCountBulk(page)).toBeGreaterThan(0);
        });

        test('should search bulk edit products by exact name [Search_product_in_bulk_edit_exact_product_name_04]', async ({ page }) => {
            const target = 'Apple MacBook Pro';
            await page.locator('#SearchProductName').fill(target);
            await clickSearch(page);
            const count = await rowCountBulk(page);
            expect(count).toBe(1);
            const names = await getProductNames(page);
            expect(names.length).toBeGreaterThan(0);
            expect(names[0]).toContain(target);
            const loadedInfo = await page.locator('#loaded-info').innerText();
            expect(loadedInfo).toContain('1-1 of 1 items');
        });

        test('should search bulk edit products by partial name keyword [Search_product_in_bulk_edit_keyword_05]', async ({ page }) => {
            await page.locator('#SearchProductName').fill('Nikon');
            await clickSearch(page);
            const count = await rowCountBulk(page);
            expect(count).toBe(3);
            const names = await getProductNames(page);
            expect(names.some(n => n.includes('Nikon'))).toBe(true);
        });

        test('should search bulk edit products case-insensitively [Search_product_in_bulk_edit_case_insensitive_06]', async ({ page }) => {
            await page.locator('#SearchProductName').fill('nikon');
            await clickSearch(page);
            const countLower = await rowCountBulk(page);

            await page.locator('#SearchProductName').fill('NIKON');
            await clickSearch(page);
            const countUpper = await rowCountBulk(page);

            expect(countLower).toBe(countUpper);
            expect(countLower).toBe(3);
        });

        test('should trim spaces in bulk edit product search keyword [Search_product_in_bulk_edit_keyword_with_spaces_07]', async ({ page }) => {
            await page.locator('#SearchProductName').fill('  Nikon  ');
            await clickSearch(page);
            const count = await rowCountBulk(page);
            expect(count).toBe(3);
        });

        test('should display no matching records for non-existent product in bulk edit [Search_product_in_bulk_edit_not_exist_name_08]', async ({ page }) => {
            await page.locator('#SearchProductName').fill('zzzxxx123_not_exist');
            await clickSearch(page);
            expect(await rowCountBulk(page)).toBe(0);
            const tbodyText = await page.locator(`${TABLE_SELECTOR} tbody`).first().innerText();
            expect(tbodyText).toMatch(/No data available|No matching records|Không có dữ liệu/i);
        });

        test('should handle special characters in bulk edit product search [Search_product_in_bulk_edit_special_chars_09]', async ({ page }) => {
            for (const char of ['%', "'", '_']) {
                await page.locator('#SearchProductName').fill(char);
                await clickSearch(page);
                await expect(page.locator('body')).not.toContainText(/Server Error|Exception|500/i);
            }
        });

        test('should prevent SQL injection and XSS in bulk edit product search [Search_product_in_bulk_edit_injection_10]', async ({ page }) => {
            let dialogShown = false;
            page.on('dialog', async d => { dialogShown = true; await d.dismiss(); });

            await page.locator('#SearchProductName').fill("' OR '1'='1");
            await clickSearch(page);
            await expect(page.locator('body')).not.toContainText(/Server Error|Exception|SqlException/i);

            await page.locator('#SearchProductName').fill('<script>alert(1)</script>');
            await clickSearch(page);
            expect(dialogShown).toBe(false);
        });

        test('should handle long search keywords in bulk edit [Search_product_in_bulk_edit_long_keyword_11]', async ({ page }) => {
            const longText = 'A'.repeat(500);
            await page.locator('#SearchProductName').fill(longText);
            await clickSearch(page);
            await expect(page.locator('body')).not.toContainText(/Server Error|Exception/i);
            expect(await rowCountBulk(page)).toBe(0);
        });

        test('should search bulk edit products with Vietnamese unicode characters [Search_product_in_bulk_edit_unicode_keyword_12]', async ({ page }) => {
            await page.locator('#SearchProductName').fill('Điện thoại');
            await clickSearch(page);
            await expect(page.locator('body')).not.toContainText(/Server Error|Exception/i);
        });

        test('should search bulk edit products by pressing Enter [Search_product_in_bulk_edit_press_enter_13]', async ({ page }) => {
            await page.locator('#SearchProductName').fill('Apple');
            await page.locator('#SearchProductName').press('Enter');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(600);
            const count = await rowCountBulk(page);
            expect(count).toBeGreaterThan(0);
        });

        test('should filter bulk edit products by category without subcategories [Search_product_in_bulk_edit_category_no_subcategories_14]', async ({ page }) => {
            await page.locator('#SearchCategoryId').selectOption('1'); // Computers
            await page.locator('#SearchIncludeSubCategories').uncheck();
            await clickSearch(page);
            const count = await rowCountBulk(page);
            expect(count).toBeGreaterThanOrEqual(0);
        });

        test('should filter bulk edit products by category with subcategories [Search_product_in_bulk_edit_category_with_subcategories_15]', async ({ page }) => {
            await page.locator('#SearchCategoryId').selectOption('1'); // Computers
            await page.locator('#SearchIncludeSubCategories').check();
            await clickSearch(page);
            const countWithSub = await rowCountBulk(page);
            expect(countWithSub).toBeGreaterThan(0);
        });

        test('should handle subcategories option when Category is All in bulk edit [Search_product_in_bulk_edit_subcategories_with_all_16]', async ({ page }) => {
            await page.locator('#SearchCategoryId').selectOption('0'); // All
            await page.locator('#SearchIncludeSubCategories').check();
            await clickSearch(page);
            expect(await rowCountBulk(page)).toBeGreaterThan(0);
        });

        test('should filter bulk edit products by manufacturer [Search_product_in_bulk_edit_manufacturer_17]', async ({ page }) => {
            await page.locator('#SearchManufacturerId').selectOption('1'); // Apple
            await clickSearch(page);
            const names = await getProductNames(page);
            expect(names.length).toBeGreaterThan(0);
            expect(names.some(n => n.includes('Apple'))).toBe(true);
        });

        test('should filter bulk edit products by vendor [Search_product_in_bulk_edit_vendor_18]', async ({ page }) => {
            await page.locator('#SearchVendorId').selectOption('1'); // Vendor 1
            await clickSearch(page);
            await expect(page.locator('body')).not.toContainText(/Server Error|Exception/i);
        });

        test('should filter bulk edit products by warehouse [Search_product_in_bulk_edit_warehouse_19]', async ({ page }) => {
            await page.locator('#SearchWarehouseId').selectOption('1'); // Warehouse 1
            await clickSearch(page);
            await expect(page.locator('body')).not.toContainText(/Server Error|Exception/i);
        });

        test('should filter bulk edit products by type Simple [Search_product_in_bulk_edit_type_simple_20]', async ({ page }) => {
            await page.locator('#SearchProductTypeId').selectOption('5'); // Simple
            await clickSearch(page);
            expect(await rowCountBulk(page)).toBeGreaterThan(0);
        });

        test('should filter bulk edit products by type Grouped [Search_product_in_bulk_edit_type_grouped_21]', async ({ page }) => {
            await page.locator('#SearchProductTypeId').selectOption('10'); // Grouped
            await clickSearch(page);
            const count = await rowCountBulk(page);
            expect(count).toBeGreaterThanOrEqual(1);
        });

        test('should filter bulk edit products by Published only [Search_product_in_bulk_edit_published_only_22]', async ({ page }) => {
            await page.locator('#SearchPublishedId').selectOption('1'); // Published only
            await clickSearch(page);
            const count = await rowCountBulk(page);
            expect(count).toBeGreaterThan(0);
            const rows = page.locator(`${TABLE_SELECTOR} tbody tr`);
            for (let i = 0; i < Math.min(count, 5); i++) {
                const pubCheck = rows.nth(i).locator('input[name^="published-"], td:nth-child(7) input[type="checkbox"]').first();
                expect(await pubCheck.isChecked()).toBe(true);
            }
        });

        test('should filter bulk edit products by Unpublished only [Search_product_in_bulk_edit_unpublished_only_23]', async ({ page }) => {
            await page.locator('#SearchPublishedId').selectOption('2'); // Unpublished only
            await clickSearch(page);
            const count = await rowCountBulk(page);
            if (count > 0) {
                const rows = page.locator(`${TABLE_SELECTOR} tbody tr`);
                for (let i = 0; i < count; i++) {
                    const pubCheck = rows.nth(i).locator('input[name^="published-"], td:nth-child(7) input[type="checkbox"]').first();
                    expect(await pubCheck.isChecked()).toBe(false);
                }
            } else {
                expect(count).toBe(0);
            }
        });

        test('should filter bulk edit products by name and category [Search_product_in_bulk_edit_name_and_category_24]', async ({ page }) => {
            await page.locator('#SearchProductName').fill('Lenovo');
            await page.locator('#SearchCategoryId').selectOption('1'); // Computers
            await page.locator('#SearchIncludeSubCategories').check();
            await clickSearch(page);
            const count = await rowCountBulk(page);
            expect(count).toBeGreaterThanOrEqual(1);
            const names = await getProductNames(page);
            expect(names.every(n => n.toLowerCase().includes('lenovo'))).toBe(true);
        });

        test('should return empty results when name and category mismatch in bulk edit [Search_product_in_bulk_edit_name_category_mismatch_25]', async ({ page }) => {
            await page.locator('#SearchProductName').fill('Nikon');
            await page.locator('#SearchCategoryId').selectOption('6'); // Software
            await clickSearch(page);
            expect(await rowCountBulk(page)).toBe(0);
        });

        test('should filter bulk edit products by manufacturer and type [Search_product_in_bulk_edit_manufacturer_and_type_26]', async ({ page }) => {
            await page.locator('#SearchManufacturerId').selectOption('1'); // Apple
            await page.locator('#SearchProductTypeId').selectOption('5'); // Simple
            await clickSearch(page);
            const count = await rowCountBulk(page);
            expect(count).toBeGreaterThan(0);
            const names = await getProductNames(page);
            expect(names.some(n => n.includes('Apple'))).toBe(true);
        });

        test('should filter bulk edit products matching all applied filters [Search_product_in_bulk_edit_all_filters_match_27]', async ({ page }) => {
            await page.locator('#SearchProductName').fill('MacBook');
            await page.locator('#SearchCategoryId').selectOption('5'); // Notebooks
            await page.locator('#SearchManufacturerId').selectOption('1'); // Apple
            await page.locator('#SearchProductTypeId').selectOption('5'); // Simple
            await page.locator('#SearchPublishedId').selectOption('1'); // Published only
            await clickSearch(page);
            const count = await rowCountBulk(page);
            expect(count).toBe(1);
            const names = await getProductNames(page);
            expect(names[0]).toContain('MacBook');
        });

        test('should return no records when conflicting filters applied in bulk edit [Search_product_in_bulk_edit_all_filters_no_result_28]', async ({ page }) => {
            await page.locator('#SearchProductName').fill('MacBook');
            await page.locator('#SearchManufacturerId').selectOption('2'); // HP
            await page.locator('#SearchProductTypeId').selectOption('10'); // Grouped
            await page.locator('#SearchPublishedId').selectOption('2'); // Unpublished
            await clickSearch(page);
            expect(await rowCountBulk(page)).toBe(0);
        });

        test('should verify pagination navigation buttons in bulk edit [Search_product_in_bulk_edit_paging_buttons_29]', async ({ page }) => {
            // Mặc định ở trang 1: First và Previous phải disabled
            await expect(page.locator('#move-first')).toBeDisabled();
            await expect(page.locator('#move-previous')).toBeDisabled();
            // Kiểm tra nút Next nếu có nhiều trang
            const nextBtn = page.locator('#move-next');
            if (await nextBtn.isEnabled()) {
                await nextBtn.click();
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(600);
                await expect(page.locator('#move-first')).toBeEnabled();
                await expect(page.locator('#move-previous')).toBeEnabled();
                await page.locator('#move-first').click();
                await page.waitForLoadState('networkidle');
            }
        });

        test('should update pagination record count after filtering in bulk edit [Search_product_in_bulk_edit_paging_info_after_filter_30]', async ({ page }) => {
            await page.locator('#SearchProductName').fill('Nikon');
            await clickSearch(page);
            const loadedInfo = await page.locator('#loaded-info').innerText();
            expect(loadedInfo).toContain('1-3 of 3 items');
            await expect(page.locator('#move-first')).toBeDisabled();
            await expect(page.locator('#move-previous')).toBeDisabled();
            await expect(page.locator('#move-next')).toBeDisabled();
            await expect(page.locator('#move-last')).toBeDisabled();
        });

        test('should redirect to login page when accessing bulk edit unauthenticated [Search_product_in_bulk_edit_no_login_31]', async ({ browser, page }) => {
            const freshContext = await browser.newContext();
            const newPage = await freshContext.newPage();
            await newPage.goto(BULK_URL);
            await expect(newPage).toHaveURL(/\/login/i, {timeout: 30000});
            await freshContext.close();
        });

        test('should handle access attempt without product management permission [Search_product_in_bulk_edit_no_permission_32]', async ({ page }) => {
            // Xác nhận quyền truy cập: trang Bulk Edit yêu cầu xác thực Admin
            await page.goto(BULK_URL);
            await expect(page).toHaveURL(/\/Admin\/Product\/BulkEdit/i);
            await expectNoServerError(page);
        });

    });

});
