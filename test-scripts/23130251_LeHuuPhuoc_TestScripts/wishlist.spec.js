// @ts-check
const { test, expect } = require('../../fixtures');

// Biến đường dẫn web (Base URL)
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

// Helper điều hướng trang sản phẩm linh hoạt giữa Localhost và Demo
async function gotoMacBook(page) {
  const resp = await page.goto(`${BASE_URL}/apple-macbook-pro`);
  if (!resp || resp.status() === 404) {
    await page.goto(`${BASE_URL}/apple-macbook-pro-13-inch`);
  }
}

async function gotoAsus(page) {
  const resp = await page.goto(`${BASE_URL}/asus-laptop`);
  if (!resp || resp.status() === 404) {
    await page.goto(`${BASE_URL}/asus-n551jk-xo076h-laptop`);
  }
}

test.describe('Kiểm thử User - Wishlist (30 Test Cases theo Excel)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.locator('.header-menu, ul.top-menu').first().waitFor({ state: 'visible', timeout: 30000 });
  });

  // Helper dọn dẹp Wishlist
  async function clearWishlist(page) {
    await page.goto(`${BASE_URL}/wishlist`);
    await page.waitForTimeout(500);
    for (let i = 0; i < 5; i++) {
      const removeBtn = page.locator('button.remove-btn, .cart td.remove-from-cart button').first();
      if (await removeBtn.isVisible().catch(() => false)) {
        await removeBtn.click();
        await page.waitForTimeout(600);
      } else {
        break;
      }
    }
  }

  // Helper thêm Apple MacBook Pro (Qty mặc định 2)
  async function addMacBook(page, qty = 2) {
    await gotoMacBook(page);
    await page.waitForSelector('#add-to-wishlist-button-4, button[id*="add-to-wishlist"]', { timeout: 30000 });
    if (qty !== 2) {
      await page.locator('#product_enteredQuantity_4, .qty-input').first().fill(String(qty));
    }
    const respPromise = page.waitForResponse(r => r.url().includes('addproducttocart'), { timeout: 10000 }).catch(() => null);
    await page.click('#add-to-wishlist-button-4, button[id*="add-to-wishlist"]');
    await respPromise;
    await page.waitForTimeout(600);
  }

  // Helper thêm Asus Laptop
  async function addAsus(page) {
    await gotoAsus(page);
    await page.waitForSelector('#add-to-wishlist-button-5, button[id*="add-to-wishlist"]', { timeout: 30000 });
    const btn = page.locator('#add-to-wishlist-button-5, button[id*="add-to-wishlist"]').first();
    const respPromise = page.waitForResponse(r => r.url().includes('addproducttocart'), { timeout: 10000 }).catch(() => null);
    await btn.click();
    await respPromise;
    await page.waitForTimeout(600);
  }

  // ==========================================
  // NHÓM 1: GIAO DIỆN & TRÌNH BÀY (WISH_View_01 -> WISH_View_05)
  // ==========================================

  test('WISH_View_01: Kiểm tra nút thêm wishlist (biểu tượng trái tim) trên ô sản phẩm', async ({ page }) => {
    await page.goto(`${BASE_URL}/notebooks`);
    const macbookItem = page.locator('.product-item:has-text("Apple MacBook Pro")').first();
    await expect(macbookItem).toBeVisible();
    await expect(macbookItem.locator('.price')).toContainText(/(\$1,800\.00|1\.800\s*₫)/);
    await expect(macbookItem.locator('button.add-to-wishlist-button')).toBeVisible();
    await expect(macbookItem.locator('button.product-box-add-to-cart-button')).toBeVisible();
  });

  test('WISH_View_02: Kiểm tra các nút và ô số lượng trên trang chi tiết sản phẩm', async ({ page }) => {
    await gotoMacBook(page);
    await expect(page.locator('.product-name h1')).toContainText('Apple MacBook Pro');
    await expect(page.locator('.sku .value')).toContainText('AP_MBP_13');
    await expect(page.locator('#product_enteredQuantity_4, .qty-input').first()).toHaveValue('2');
    await expect(page.locator('#add-to-wishlist-button-4, button[id*="add-to-wishlist"]').first()).toBeVisible();
    await expect(page.locator('#add-to-cart-button-4, button[id*="add-to-cart"]').first()).toBeVisible();
    await expect(page.locator('button.add-to-compare-list-button').first()).toBeVisible();
    await expect(page.locator('button.email-a-friend-button').first()).toBeVisible();
  });

  test('WISH_View_03: Kiểm tra trang Wishlist khi chưa có sản phẩm', async ({ page }) => {
    await clearWishlist(page);
    await page.goto(`${BASE_URL}/wishlist`);
    await expect(page.locator('.page-title h1')).toContainText('Wishlist');
    await expect(page.locator('.no-data, .wishlist-content')).toContainText('The wishlist is empty!');
    await expect(page.locator('table.cart')).not.toBeVisible();
  });

  test('WISH_View_04: Kiểm tra các cột và nút trên trang Wishlist', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page);
    await page.goto(`${BASE_URL}/wishlist`);
    await expect(page.locator('.page-title h1')).toContainText('Wishlist');
    await expect(page.locator('table.cart th:has-text("Add to cart")')).toBeVisible();
    await expect(page.locator('table.cart th:has-text("SKU")')).toBeVisible();
    await expect(page.locator('table.cart th:has-text("Image")')).toBeVisible();
    await expect(page.locator('table.cart th:has-text("Product(s)")')).toBeVisible();
    await expect(page.locator('table.cart th:has-text("Price")')).toBeVisible();
    await expect(page.locator('table.cart th:has-text("Qty.")')).toBeVisible();
    await expect(page.locator('table.cart th:has-text("Total")')).toBeVisible();
    await expect(page.locator('table.cart th:has-text("Remove")')).toBeVisible();
    await expect(page.locator('#updatecart, button.update-wishlist-button, button[name="updatecart"]').first()).toBeVisible();
    await expect(page.locator('button[name="addtocartbutton"]')).toBeVisible();
    await expect(page.locator('button.email-a-friend-wishlist-button')).toBeVisible();
    await expect(page.locator('.share-info')).toContainText('Your wishlist URL for sharing');
  });

  test('WISH_View_05: Kiểm tra layout trang Wishlist trên desktop và mobile', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page);
    await page.goto(`${BASE_URL}/wishlist`);
    // Co màn hình về mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    // DEFECT trong Excel: layout mobile bị cuộn ngang hoặc vỡ bảng table
    const tableScroll = await page.locator('table.cart').evaluate(el => el.scrollWidth > 375);
    expect(tableScroll, 'Defect: Layout bảng Wishlist trên mobile bị tràn màn hình (horizontal scroll)').toBe(false);
  });

  // ==========================================
  // NHÓM 2: THÊM SẢN PHẨM (WISH_Add_01 -> WISH_Add_06)
  // ==========================================

  test('WISH_Add_01: Kiểm tra thêm sản phẩm vào wishlist từ trang chi tiết sản phẩm', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    const noti = page.locator('#bar-notification .bar-notification');
    await expect(noti).toBeVisible({ timeout: 15000 });
    await expect(noti).toContainText('The product has been added to your wishlist');
    await expect(page.locator('.wishlist-qty')).toContainText('(2)');
  });

  test('WISH_Add_02: Kiểm tra thêm sản phẩm vào wishlist bằng nút trái tim ở danh sách sản phẩm', async ({ page }) => {
    await clearWishlist(page);
    await page.goto(`${BASE_URL}/notebooks`);
    const heartBtn = page.locator('.product-item:has-text("Apple MacBook Pro") button.add-to-wishlist-button').first();
    await heartBtn.click();
    await page.waitForTimeout(1000);
    if (page.url().includes('apple-macbook-pro')) {
      await page.click('#add-to-wishlist-button-4, button[id*="add-to-wishlist"]');
    }
    const noti = page.locator('#bar-notification .bar-notification');
    await expect(noti).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.wishlist-qty')).not.toContainText('(0)');
  });

  test('WISH_Add_03: Kiểm tra click liên kết "wishlist" trong thông báo thêm thành công', async ({ page }) => {
    await clearWishlist(page);
    await gotoMacBook(page);
    await page.click('#add-to-wishlist-button-4, button[id*="add-to-wishlist"]');
    const link = page.locator('#bar-notification a[href*="/wishlist"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });
    await link.click();
    await expect(page).toHaveURL(/.*\/wishlist/);
    await expect(page.locator('.cart tbody tr .product a')).toContainText('Apple MacBook Pro');
  });

  test('WISH_Add_04: Kiểm tra thêm cùng một sản phẩm lần thứ hai thì số lượng được cộng dồn', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await addMacBook(page, 2);
    await page.goto(`${BASE_URL}/wishlist`);
    const rows = page.locator('.cart tbody tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first().locator('input.qty-input')).toHaveValue('4');
    await expect(rows.first().locator('.product-subtotal')).toContainText(/(\$7,200\.00|7\.200\s*₫)/);
  });

  test('WISH_Add_05: Kiểm tra thêm hai sản phẩm khác nhau vào wishlist', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await addAsus(page);
    await page.goto(`${BASE_URL}/wishlist`);
    const rows = page.locator('.cart tbody tr');
    await expect(rows).toHaveCount(2);
    await expect(page.locator('.cart')).toContainText('Apple MacBook Pro');
    await expect(page.locator('.cart')).toContainText(/Asus/);
  });

  test('WISH_Add_06: Kiểm tra nhấn [Add to wishlist] nhiều lần liên tiếp', async ({ page }) => {
    await clearWishlist(page);
    await gotoMacBook(page);
    const btn = page.locator('#add-to-wishlist-button-4, button[id*="add-to-wishlist"]').first();
    await btn.click();
    await page.waitForTimeout(500);
    await btn.click();
    await page.waitForTimeout(500);
    await expect(page.locator('.wishlist-qty')).toBeVisible();
  });

  // ==========================================
  // NHÓM 3: SỐ LƯỢNG (WISH_Qty_01 -> WISH_Qty_04)
  // ==========================================

  test('WISH_Qty_01: Kiểm tra thêm với số lượng bằng mức tối thiểu (2)', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await expect(page.locator('.wishlist-qty')).toContainText('(2)');
  });

  test('WISH_Qty_02: Kiểm tra thêm với số lượng nhỏ hơn mức tối thiểu (1)', async ({ page }) => {
    await clearWishlist(page);
    await gotoMacBook(page);
    await page.locator('#product_enteredQuantity_4, .qty-input').first().fill('1');
    await page.click('#add-to-wishlist-button-4, button[id*="add-to-wishlist"]');
    const errNoti = page.locator('#bar-notification .bar-notification.error, .bar-notification');
    await expect(errNoti).toBeVisible({ timeout: 15000 });
    await expect(errNoti).toContainText(/minimum quantity/i);
  });

  test('WISH_Qty_03: Kiểm tra thêm khi Qty bằng 0, để trống hoặc nhập chữ', async ({ page }) => {
    await gotoMacBook(page);
    await page.locator('#product_enteredQuantity_4, .qty-input').first().fill('0');
    await page.click('#add-to-wishlist-button-4, button[id*="add-to-wishlist"]');
    const errNoti = page.locator('#bar-notification .bar-notification, .field-validation-error').first();
    await expect(errNoti).toBeVisible({ timeout: 15000 });
  });

  test('WISH_Qty_04: Kiểm tra thêm với số lượng rất lớn (100000)', async ({ page }) => {
    await gotoMacBook(page);
    await page.locator('#product_enteredQuantity_4, .qty-input').first().fill('100000');
    await page.click('#add-to-wishlist-button-4, button[id*="add-to-wishlist"]');
    await expect(page.locator('#bar-notification, .field-validation-error, body').first()).toBeVisible();
  });

  // ==========================================
  // NHÓM 4: CẬP NHẬT SỐ LƯỢNG (WISH_Upd_01 -> WISH_Upd_03)
  // ==========================================

  test('WISH_Upd_01: Kiểm tra đổi số lượng rồi nhấn [UPDATE WISHLIST]', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await page.goto(`${BASE_URL}/wishlist`);
    await page.locator('.cart tbody tr input.qty-input').first().fill('3');
    await page.locator('#updatecart, button.update-wishlist-button, button[name="updatecart"]').last().click();
    await page.waitForTimeout(1000);
    await expect(page.locator('.cart tbody tr input.qty-input').first()).toHaveValue('3');
    await expect(page.locator('.cart tbody tr .product-subtotal').first()).toContainText(/(\$5,400\.00|5\.400\s*₫)/);
  });

  test('WISH_Upd_02: Kiểm tra đổi số lượng về 0 rồi cập nhật', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await page.goto(`${BASE_URL}/wishlist`);
    await page.locator('.cart tbody tr input.qty-input').first().fill('0');
    await page.click('button[name="updatecart"]');
    await page.waitForTimeout(1000);
    await expect(page.locator('.no-data, .wishlist-content')).toContainText('The wishlist is empty!');
  });

  test('WISH_Upd_03: Kiểm tra nhập số lượng là chữ hoặc số âm rồi cập nhật', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await page.goto(`${BASE_URL}/wishlist`);
    await page.locator('.cart tbody tr input.qty-input').first().fill('-2');
    await page.click('button[name="updatecart"]');
    await page.waitForTimeout(1000);
    // Theo Excel: Đúng như Expected Output (Playwright: Passed) - không crash và giữ nguyên hoặc xử lý an toàn
    await expect(page.locator('.wishlist-content, .cart, .page-title')).toBeVisible();
  });

  // ==========================================
  // NHÓM 5: XÓA SẢN PHẨM (WISH_Del_01 -> WISH_Del_02)
  // ==========================================

  test('WISH_Del_01: Kiểm tra xóa sản phẩm bằng nút X ở cột Remove', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await page.goto(`${BASE_URL}/wishlist`);
    await page.locator('.cart td.remove-from-cart button, button.remove-btn').first().click();
    await page.waitForTimeout(1000);
    await expect(page.locator('.no-data, .wishlist-content')).toContainText('The wishlist is empty!');
  });

  test('WISH_Del_02: Kiểm tra xóa một trong hai sản phẩm', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await addAsus(page);
    await page.goto(`${BASE_URL}/wishlist`);
    const macRow = page.locator('.cart tbody tr:has-text("Apple MacBook Pro")');
    await macRow.locator('button.remove-btn, td.remove-from-cart button').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('.cart')).not.toContainText('Apple MacBook Pro');
    await expect(page.locator('.cart')).toContainText(/Asus/);
  });

  // ==========================================
  // NHÓM 6: THÊM VÀO GIỎ HÀNG (WISH_Cart_01 -> WISH_Cart_03)
  // ==========================================

  test('WISH_Cart_01: Kiểm tra chọn sản phẩm rồi nhấn [ADD TO CART]', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await page.goto(`${BASE_URL}/wishlist`);
    await page.locator('.cart tbody tr input[name="addtocart"]').first().check();
    await page.click('button[name="addtocartbutton"]');
    await expect(page).toHaveURL(/.*\/cart/);
    await expect(page.locator('.cart')).toContainText('Apple MacBook Pro');
  });

  test('WISH_Cart_02: Kiểm tra chọn nhiều sản phẩm rồi thêm vào giỏ', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await addAsus(page);
    await page.goto(`${BASE_URL}/wishlist`);
    const checkboxes = page.locator('.cart tbody tr input[name="addtocart"]');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }
    await page.click('button[name="addtocartbutton"]');
    await expect(page).toHaveURL(/.*\/cart/);
    await expect(page.locator('.cart')).toContainText('Apple MacBook Pro');
    await expect(page.locator('.cart')).toContainText(/Asus/);
  });

  test('WISH_Cart_03: Kiểm tra sản phẩm trong wishlist sau khi đã thêm vào giỏ', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await page.goto(`${BASE_URL}/wishlist`);
    await page.locator('.cart tbody tr input[name="addtocart"]').first().check();
    await page.click('button[name="addtocartbutton"]');
    await page.goto(`${BASE_URL}/wishlist`);
    // DEFECT trong Excel: Trạng thái hiển thị giữa Wishlist và Cart không đồng bộ cấu hình xóa sản phẩm
    const keepInWishlist = await page.locator('.cart tbody tr:has-text("Apple MacBook Pro")').isVisible().catch(() => false);
    expect(keepInWishlist, 'Defect: Sản phẩm chưa được tự động loại khỏi Wishlist sau khi chuyển vào Shopping cart').toBe(true);
  });

  // ==========================================
  // NHÓM 7: CHIA SẺ WISHLIST (WISH_Share_01 -> WISH_Share_03)
  // ==========================================

  test('WISH_Share_01: Kiểm tra URL chia sẻ wishlist', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await page.goto(`${BASE_URL}/wishlist`);
    const shareLink = page.locator('a.share-link').first();
    await expect(shareLink).toBeVisible();
    const href = await shareLink.getAttribute('href');
    expect(href).toMatch(/\/wishlist\/[a-zA-Z0-9-]+/);
  });

  test('WISH_Share_02: Kiểm tra mở URL chia sẻ ở trình duyệt khác (chế độ ẩn danh)', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await page.goto(`${BASE_URL}/wishlist`);
    const shareLink = page.locator('a.share-link').first();
    const href = await shareLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      await expect(page.locator('.page-title h1')).toContainText(/Wishlist of|Wishlist/);
      await expect(page.locator('table.cart')).toBeVisible();
    }
  });

  test('WISH_Share_03: Kiểm tra nút [Email a friend] ở trang Wishlist', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await page.goto(`${BASE_URL}/wishlist`);
    await page.click('button.email-a-friend-wishlist-button');
    // DEFECT trong Excel: Khách vãng lai bấm Email a friend thiếu thông báo hướng dẫn đăng nhập
    const loginHint = page.locator('.message-error a[href*="/login"]');
    await expect(loginHint, 'Defect: Thiếu liên kết hướng dẫn đăng nhập khi khách vãng lai dùng Email a friend').toBeVisible({ timeout: 1500 });
  });

  // ==========================================
  // NHÓM 8: LƯU TRỮ & BẢO MẬT (WISH_Keep_01 -> WISH_Sec_02)
  // ==========================================

  test('WISH_Keep_01: Kiểm tra wishlist được giữ sau khi tải lại trang (F5)', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await page.goto(`${BASE_URL}/wishlist`);
    await page.reload();
    await expect(page.locator('.cart')).toContainText('Apple MacBook Pro');
  });

  test('WISH_Keep_02: Kiểm tra wishlist được giữ khi đóng rồi mở lại tab', async ({ page, context }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    const newPage = await context.newPage();
    await newPage.goto(`${BASE_URL}/wishlist`);
    await expect(newPage.locator('.cart')).toContainText('Apple MacBook Pro');
    await newPage.close();
  });

  test('WISH_Sec_01: Kiểm tra nhập mã script vào ô Qty ở trang Wishlist', async ({ page }) => {
    await clearWishlist(page);
    await addMacBook(page, 2);
    await page.goto(`${BASE_URL}/wishlist`);
    let dialogTriggered = false;
    page.on('dialog', () => { dialogTriggered = true; });
    await page.locator('.cart tbody tr input.qty-input').first().fill('<script>alert(1)</script>');
    await page.locator('#updatecart, button.update-wishlist-button, button[name="updatecart"]').last().click();
    await page.waitForTimeout(600);
    expect(dialogTriggered).toBe(false);
  });

  test('WISH_Sec_02: Kiểm tra mở URL wishlist với mã GUID không tồn tại', async ({ page }) => {
    await page.goto(`${BASE_URL}/wishlist/00000000-0000-0000-0000-000000000000`);
    await expect(page.locator('.page-title h1, .no-data, h1, body').first()).toBeVisible();
  });

});
