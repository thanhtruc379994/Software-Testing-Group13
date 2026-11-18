// search_manufacturer.spec.js
// 20 test tự động cho chức năng Search Manufacturer (Admin > Catalog > Manufacturers)
// Bao gồm: hợp lệ, không hợp lệ, giá trị biên và các nhánh ẩn
import {test, expect} from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:8080';
const G = '#manufacturers-grid';
const ADMIN_EMAIL = 'admin@yourStore.com';
const ADMIN_PASSWORD = 'Admin@123';
const LIST_URL = BASE + '/Admin/Manufacturer/List';

// ===== Nếu file của bạn đã có sẵn handleCloudflare thì XÓA hàm tạm này =====
async function handleCloudflare(page) {
    // TODO: dùng hàm handleCloudflare thật của bạn
}

async function login(page) {
    if (page.url().includes('/Admin') && !page.url().includes('/login')) {
        return;
    }
    await page.goto(BASE + '/Admin');
    await handleCloudflare(page);

    const isDashboard = await page.locator('.main-sidebar, .brand-link, .nav-sidebar').isVisible({timeout: 5000}).catch(() => false);
    if (isDashboard) {
        return;
    }

    if (await page.locator('#Email').isVisible({timeout: 3000}).catch(() => false)) {
        await page.locator('#Email').fill(ADMIN_EMAIL);
        await page.locator('#Password').fill(ADMIN_PASSWORD);
        await page.locator('button.login-button, button[type="submit"]:has-text("Log in")').first().click();
        await handleCloudflare(page);
        await page.waitForURL(/\/Admin/i, {timeout: 60000});
    }
}

// ------------------------------ helpers ------------------------------

// Vào thẳng Manufacturer list bằng cookie đã có; chỉ login khi bị đẩy về trang đăng nhập
async function openManufacturers(page) {
    await page.goto(LIST_URL);
    await handleCloudflare(page);

    const needLogin = page.url().includes('/login') ||
        await page.locator('#Email').isVisible({timeout: 3000}).catch(() => false);
    if (needLogin) {
        await login(page);
        await page.goto(LIST_URL);
        await handleCloudflare(page);
    }

    await expect(page).toHaveURL(/\/Admin\/Manufacturer\/List/i, {timeout: 30000});
    await expect(page.locator('#search-manufacturers')).toBeVisible({timeout: 30000});
    await expect(page.locator(G)).toBeAttached({timeout: 30000});
    await waitGridLoaded(page);
}

async function waitGridLoaded(page) {
    await expect(page.locator(`${G} tbody tr`).first()).toBeVisible({timeout: 30000});
    await expect(page.locator(`${G}_processing`)).toBeHidden({timeout: 30000}).catch(() => {});
}

async function search(page) {
    const [res] = await Promise.all([
        page.waitForResponse(r => r.url().includes('/Manufacturer/List') && r.request().method() === 'POST', {timeout: 30000}),
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

// ------------------------------ tests ------------------------------

test.describe('Admin - Search Manufacturer', () => {

    test.setTimeout(120000);

    // Tự động chụp màn hình cho từng test case (dù PASS hay FAILED) lưu vào thư mục 23130075_NguyenHuuDuy/sreenshots
    test.afterEach(async ({ page }, testInfo) => {
        const screenshotDir = path.resolve(__dirname, '..', 'sreenshots');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        // Tách mã ID test case (ví dụ: Search_manufacturer_default_value_01)
        const match = testInfo.title.match(/^([A-Za-z0-9_]+)/);
        const tcId = match ? match[1] : 'unknown_tc';
        const status = testInfo.status === testInfo.expectedStatus ? 'PASS' : 'FAILED';
        const screenshotPath = path.join(screenshotDir, `${tcId}_${status}.png`);

        try {
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`[Screenshot saved]: ${screenshotPath}`);
        } catch (err) {
            console.error(`Không thể chụp màn hình cho ${tcId}:`, err);
        }
    });

    // ===================== Hiển thị =====================

    test('Search_manufacturer_default_value_01 - Kiểm tra giao diện & giá trị mặc định khi mở trang Manufacturer list', async ({page}) => {
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

    // ===================== Manufacturer name: hợp lệ =====================

    test('Search_manufacturer_empty_name_02 - Tìm với Manufacturer name để trống, bấm Search', async ({page}) => {
        await openManufacturers(page);
        await page.locator('#SearchManufacturerName').fill('');
        await search(page);
        expect(await rowCount(page)).toBe(3);
    });

    test('Search_manufacturer_exact_name_03 - Tìm với tên manufacturer chính xác', async ({page}) => {
        await openManufacturers(page);
        await page.locator('#SearchManufacturerName').fill('Apple');
        await search(page);
        expect(await rowCount(page)).toBe(1);
        expect(await gridText(page)).toContain('apple');
        await expect(page.locator(`${G}_info`)).toContainText(/1\s*-\s*1\s+of\s+1/i);
    });

    test('Search_manufacturer_partial_name_04 - Tìm với một phần tên manufacturer', async ({page}) => {
        await openManufacturers(page);
        await page.locator('#SearchManufacturerName').fill('Nik');
        await search(page);
        expect(await rowCount(page)).toBe(1);
        expect(await gridText(page)).toContain('nike');
    });

    test('Search_manufacturer_single_char_05 - Tìm với từ khóa 1 ký tự', async ({page}) => {
        await openManufacturers(page);
        await page.locator('#SearchManufacturerName').fill('p');
        await search(page);
        expect(await rowCount(page)).toBe(2);
        const text = await gridText(page);
        expect(text).toContain('apple');
        expect(text).toContain('hp');
    });

    test('Search_manufacturer_case_insensitive_06 - Tìm không phân biệt hoa/thường', async ({page}) => {
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

    test('Search_manufacturer_spaces_07 - Tìm với từ khóa có khoảng trắng đầu/cuối', async ({page}) => {
        await openManufacturers(page);
        await page.locator('#SearchManufacturerName').fill('Apple');
        await search(page);
        const base = await total(page);

        await page.locator('#SearchManufacturerName').fill('  Apple  ');
        await search(page);
        expect(await total(page)).toBe(base);
    });

    test('Search_manufacturer_not_exist_08 - Tìm với tên manufacturer không tồn tại', async ({page}) => {
        await openManufacturers(page);
        await page.locator('#SearchManufacturerName').fill('KhongTonTai_99999');
        await search(page);
        expect(await rowCount(page)).toBe(0);
        await expect(page.locator(`${G} tbody`)).toContainText(/No data available|No matching records|Không có dữ liệu/i);
    });

    // ===================== Manufacturer name: ký tự đặc biệt, injection, biên =====================

    test('Search_manufacturer_special_chars_09 - Tìm với ký tự đặc biệt', async ({page}) => {
        await openManufacturers(page);
        await page.locator('#SearchManufacturerName').fill('@#$%&*');
        await search(page);
        expect(await rowCount(page)).toBeLessThan(3);
    });

    test('Search_manufacturer_injection_10 - Tìm với SQL injection / script', async ({page}) => {
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

    test('Search_manufacturer_length_boundary_11 - Tìm với từ khóa 400 và 401 ký tự', async ({page}) => {
        await openManufacturers(page);
        await page.locator('#SearchManufacturerName').fill('a'.repeat(400));
        await search(page);

        await page.locator('#SearchManufacturerName').fill('a'.repeat(401));
        await search(page);
    });

    test('Search_manufacturer_unicode_12 - Tìm với từ khóa tiếng Việt / Unicode', async ({page}) => {
        await openManufacturers(page);
        await page.locator('#SearchManufacturerName').fill('Hãng điện máy');
        await search(page);
        expect(await rowCount(page)).toBeLessThanOrEqual(3);
    });

    test('Search_manufacturer_press_enter_13 - Tìm bằng phím Enter trong ô Manufacturer name', async ({page}) => {
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

    // ===================== Published filter =====================

    test('Search_manufacturer_published_list_14 - Kiểm tra danh sách giá trị của Published', async ({page}) => {
        await openManufacturers(page);
        const options = (await page.locator('#SearchPublishedId option').allInnerTexts()).map(o => o.trim());
        expect(options).toEqual(['All', 'Published only', 'Unpublished only']);
        await expect(page.locator('#SearchPublishedId')).toHaveValue('0');
    });

    test('Search_manufacturer_published_only_15 - Tìm với Published = Published only', async ({page}) => {
        await openManufacturers(page);
        await page.locator('#SearchPublishedId').selectOption('1');
        await search(page);
        expect(await rowCount(page)).toBe(3);
        const text = await gridText(page);
        for (const n of ['apple', 'hp', 'nike']) expect(text).toContain(n);
    });

    test('Search_manufacturer_unpublished_only_16 - Tìm với Published = Unpublished only', async ({page}) => {
        await openManufacturers(page);
        await page.locator('#SearchPublishedId').selectOption('2');
        await search(page);
        await expect(page.locator(`${G} .true-icon, ${G} i.fa-check`)).toHaveCount(0);
    });

    test('Search_manufacturer_name_and_published_17 - Kết hợp Manufacturer name + Published', async ({page}) => {
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

    // ===================== Nhánh ẩn: phân trang, trường Store, trạng thái thu gọn =====================

    test('Search_manufacturer_paging_boundary_18 - Kiểm tra phân trang khi kết quả ít hơn 1 trang', async ({page}) => {
        await openManufacturers(page);
        await page.locator('#SearchManufacturerName').fill('');
        await search(page);
        await page.locator(`${G}_length select`).selectOption('7');
        await expect(page.locator(`${G}_paginate .paginate_button.next`)).toHaveClass(/disabled/);
        await expect(page.locator(`${G}_paginate .paginate_button.previous`)).toHaveClass(/disabled/);
    });

    test('Search_manufacturer_hidden_store_field_19 - Kiểm tra trường Store bị ẩn khi tìm kiếm', async ({page}) => {
        await openManufacturers(page);
        await expect(page.locator('.form-group:has(#SearchStoreId)')).toBeHidden();
        await expect(page.locator('#SearchStoreId')).toHaveValue('0');
        await page.locator('#SearchManufacturerName').fill('Apple');
        await search(page);
        expect(await rowCount(page)).toBe(1);
        expect(await gridText(page)).toContain('apple');
    });

    test('Search_manufacturer_collapse_persist_20 - Thu gọn panel Search rồi tải lại trang', async ({page}) => {
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
