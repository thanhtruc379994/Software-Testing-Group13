// add_manufacturer.spec.js
// 20 test tự động cho chức năng Add Manufacturer (Admin > Catalog > Manufacturers > Add new)
// Bao gồm: hợp lệ, không hợp lệ, giá trị biên và các nhánh ẩn (tab ngôn ngữ, upload Picture)
import {test, expect} from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:8080';
const ADMIN_EMAIL = 'admin@yourStore.com';
const ADMIN_PASSWORD = 'Admin@123';
const CREATE_URL = BASE + '/Admin/Manufacturer/Create';
const LIST_URL = BASE + '/Admin/Manufacturer/List';

// Ảnh png 1x1 dùng để test upload Picture
const PNG_1X1 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64');

async function handleCloudflare(page) {
    // Để trống nếu chạy localhost
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

// Mở một URL admin bằng cookie đã có; chỉ login khi bị đẩy về trang đăng nhập
async function gotoAdmin(page, url) {
    await page.goto(url);
    await handleCloudflare(page);
    const needLogin = page.url().includes('/login') ||
        await page.locator('#Email').isVisible({timeout: 3000}).catch(() => false);
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
    await expect(page).toHaveURL(/\/Admin\/Manufacturer\/Create/i, {timeout: 30000});
    await expect(page.locator('#Name')).toBeVisible({timeout: 30000});
    await ensureAdvanced(page);
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
    if (await editor.isVisible({timeout: 3000}).catch(() => false)) {
        await editor.click();
        await editor.fill(text).catch(async () => {
            await editor.evaluate((el, val) => {
                el.innerText = val;
                el.dispatchEvent(new Event('input', {bubbles: true}));
                el.dispatchEvent(new Event('change', {bubbles: true}));
            }, text);
        });
    } else {
        await page.locator('#Description').fill(text);
    }
}

// ---- Cửa sổ xác nhận (confirm/modal) khi lưu ----
let dialogs = [];

async function confirmIfAsked(page) {
    const btn = page.locator(
        '.swal2-confirm, ' +
        '.bootbox .btn-primary, ' +
        '.modal.show .modal-footer :is(button, span):has-text("OK"), ' +
        '.modal.show .modal-footer :is(button, span):has-text("Ok"), ' +
        '.modal.show .modal-footer :is(button, span):has-text("Yes"), ' +
        '.modal.show .modal-footer :is(button, span):has-text("Confirm"), ' +
        '.modal.show .modal-footer .btn-primary'
    ).filter({visible: true}).first();
    if (await btn.isVisible({timeout: 1500}).catch(() => false)) {
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

// alert(1) từ script chèn vào có được thực thi không (không tính confirm của hệ thống)
function xssExecuted() {
    return dialogs.some(d => d.type === 'alert' && d.message === '1');
}

async function expectSaved(page) {
    await expect(page.locator('.alert-success')).toBeVisible({timeout: 30000});
}

async function expectRejected(page) {
    await expect(page.locator('.field-validation-error, .validation-summary-errors, .alert-danger, .input-validation-error').first()).toBeVisible({timeout: 15000});
    await expect(page.locator('.alert-success')).toHaveCount(0);
}

async function expectNoServerError(page) {
    await expect(page.locator('body')).not.toContainText(/Server Error|Internal Server Error|Exception/i);
}

async function expectEditPage(page) {
    await expect(page).toHaveURL(/\/Admin\/Manufacturer\/Edit\/\d+/i, {timeout: 30000});
}

// Tìm manufacturer theo tên trong Manufacturer list; trả về [{href, text}] của các dòng khớp
async function findRows(page, name) {
    await gotoAdmin(page, LIST_URL);
    await page.locator('#SearchManufacturerName').fill(name);
    await Promise.all([
        page.waitForResponse(r => r.url().includes('/Manufacturer/List') && r.request().method() === 'POST', {timeout: 10000}).catch(() => null),
        page.locator('#search-manufacturers').click()
    ]);
    const rows = page.locator('#manufacturers-grid tbody tr');
    await expect(rows.first()).toBeVisible({timeout: 30000});
    const first = (await rows.first().innerText()) || '';
    if (/No data available|No matching records|Không có dữ liệu/i.test(first)) return [];
    const out = [];
    for (let i = 0; i < await rows.count(); i++) {
        const row = rows.nth(i);
        const editLink = row.locator('a[href*="/Manufacturer/Edit/"]').first();
        const href = await editLink.getAttribute('href').catch(() => null);
        if (href) {
            out.push({href, text: (await row.innerText()).trim()});
        }
    }
    return out;
}

// Chỉ trả về danh sách link Edit (dùng khi chỉ cần số dòng khớp)
async function findInList(page, name) {
    return (await findRows(page, name)).map(r => r.href);
}

// Xóa manufacturer thử nghiệm (dọn dữ liệu)
async function deleteByHref(page, href) {
    if (!href) return;
    await gotoAdmin(page, href.startsWith('http') ? href : BASE + href);
    const btn = page.locator('#manufacturer-delete, button[name="delete"], span.btn-danger:has-text("Delete")').first();
    if (!(await btn.isVisible({timeout: 5000}).catch(() => false))) return;
    await btn.click();
    await page.waitForTimeout(500);

    const modal = page.locator(
        '#manufacturermodel-Delete-delete-confirmation, ' +
        '#manufacturer-Delete-delete-confirmation, ' +
        '#manufacturer-delete-confirmation, ' +
        '.modal.show'
    ).first();
    await modal.waitFor({state: 'visible', timeout: 5000}).catch(() => {});

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

    await confirmBtn.waitFor({state: 'visible', timeout: 5000}).catch(() => {});
    if (await confirmBtn.isVisible().catch(() => false)) {
        await confirmBtn.click({force: true});
    } else {
        await page.locator('button[type="submit"].btn-danger.float-right, button[type="submit"]:has-text("Delete")').first().click({force: true}).catch(() => {});
    }
    await page.waitForURL(/\/Admin\/Manufacturer\/List/i, {timeout: 30000}).catch(() => {});
}

// Chạy test và tự xóa các manufacturer đã tạo (ctx.track(tên) để đăng ký tên cần dọn)
async function withMf(page, fn) {
    const ctx = {names: [], track(n) { this.names.push(n); }};
    try {
        await fn(ctx);
    } finally {
        for (const n of ctx.names) {
            const rows = await findRows(page, n).catch(() => []);
            for (const r of rows) {
                // Tên ngắn (vd 'Q'): chỉ xóa dòng có tên đúng bằng n để không xóa nhầm dữ liệu thật
                const lines = r.text.split(/\s+/);
                if (n.length < 5 && !lines.some(w => w.toLowerCase() === n.toLowerCase())) continue;
                await deleteByHref(page, r.href).catch(() => {});
            }
        }
    }
}

// ------------------------------ tests ------------------------------

test.describe('Admin - Add Manufacturer', () => {

    test.setTimeout(180000);

    // Tự động chụp màn hình cho từng test case (dù PASS hay FAILED) lưu vào thư mục 23130075_NguyenHuuDuy/sreenshots
    test.afterEach(async ({ page }, testInfo) => {
        const screenshotDir = path.resolve(__dirname, '..', 'sreenshots');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

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

    // Tự bấm OK cho mọi hộp thoại confirm/alert của trình duyệt và ghi lại để kiểm tra
    test.beforeEach(async ({page}) => {
        dialogs = [];
        page.on('dialog', async d => {
            dialogs.push({type: d.type(), message: d.message()});
            await d.accept().catch(() => {});
        });
    });

    // ===================== Hiển thị =====================

    test('Add_manufacturer_default_value_01 - Kiểm tra giao diện & giá trị mặc định khi mở màn hình Add a new manufacturer', async ({page}) => {
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

    // ===================== Name: hợp lệ =====================

    test('Add_manufacturer_valid_name_02 - Lưu manufacturer với Name hợp lệ', async ({page}) => {
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

    // ===================== Name: không hợp lệ =====================

    test('Add_manufacturer_empty_name_03 - Lưu manufacturer để trống Name', async ({page}) => {
        await openCreate(page);
        await save(page);
        await expectRejected(page);
        await expect(page).toHaveURL(/\/Admin\/Manufacturer\/Create/i);
    });

    test('Add_manufacturer_whitespace_name_04 - Lưu manufacturer với Name chỉ có khoảng trắng', async ({page}) => {
        await openCreate(page);
        await page.locator('#Name').fill('     ');
        await save(page);
        await expectRejected(page);
    });

    // ===================== Name: giá trị biên =====================

    test('Add_manufacturer_trim_name_05 - Name có khoảng trắng đầu/cuối', async ({page}) => {
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

    test('Add_manufacturer_single_char_name_06 - Lưu manufacturer với Name 1 ký tự', async ({page}) => {
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

    test('Add_manufacturer_max_length_name_07 - Lưu manufacturer với Name 400 ký tự', async ({page}) => {
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

    test('Add_manufacturer_over_length_name_08 - Lưu manufacturer với Name 401 ký tự', async ({page}) => {
        await openCreate(page);
        await page.locator('#Name').fill('b'.repeat(401));
        await save(page);
        // Phải xử lý có kiểm soát: báo lỗi validation, không lỗi hệ thống
        await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger, .input-validation-error').first()).toBeVisible({timeout: 30000});
        await expectNoServerError(page);
        await expectRejected(page);
    });

    // ===================== Name: ký tự đặc biệt =====================

    test('Add_manufacturer_special_chars_name_09 - Name chứa ký tự đặc biệt', async ({page}) => {
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

    test('Add_manufacturer_html_script_name_10 - Name chứa mã HTML/script', async ({page}) => {
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

    test('Add_manufacturer_unicode_name_11 - Name chứa tiếng Việt có dấu', async ({page}) => {
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

    test('Add_manufacturer_duplicate_name_12 - Name trùng manufacturer đã tồn tại', async ({page}) => {
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

    // ===================== Description =====================

    test('Add_manufacturer_valid_description_13 - Nhập Description hợp lệ', async ({page}) => {
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

    test('Add_manufacturer_empty_description_14 - Lưu để trống Description', async ({page}) => {
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

    test('Add_manufacturer_html_description_15 - Description chứa mã HTML/script', async ({page}) => {
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

    // ===================== Nhánh ẩn: tab ngôn ngữ =====================

    test('Add_manufacturer_localized_names_16 - Nhập Name theo ngôn ngữ English / Tiếng Việt', async ({page}) => {
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

    test('Add_manufacturer_localized_tab_switch_17 - Chuyển đổi giữa các tab ngôn ngữ giữ nguyên dữ liệu', async ({page}) => {
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

    test('Add_manufacturer_localized_over_length_18 - Name theo ngôn ngữ vượt 400 ký tự', async ({page}) => {
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

    // ===================== Nhánh ẩn: Picture =====================

    test('Add_manufacturer_picture_valid_19 - Tải lên Picture hợp lệ (png)', async ({page}) => {
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

    test('Add_manufacturer_picture_invalid_type_20 - Tải lên file không phải ảnh', async ({page}) => {
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
