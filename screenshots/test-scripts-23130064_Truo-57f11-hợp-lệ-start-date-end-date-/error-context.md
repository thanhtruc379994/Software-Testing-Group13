# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-scripts\23130064_TruongCaoDoan_TestScripts\shipments.spec.js >> Admin - Shipments >> admin_ship_07 - Kiểm tra lọc danh sách giao hàng theo khoảng ngày xuất kho không hợp lệ (start date > end date)
- Location: test-scripts\23130064_TruongCaoDoan_TestScripts\shipments.spec.js:316:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.alert-danger, .field-validation-error, .text-danger, #validation-error')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.alert-danger, .field-validation-error, .text-danger, #validation-error') with timeout 5000ms
  - waiting for locator('.alert-danger, .field-validation-error, .text-danger, #validation-error')

```

```yaml
- navigation:
  - list:
    - listitem:
      - link:
        - /url: "#"
  - link:
    - /url: /Admin
  - list:
    - listitem:
      - combobox "English":
        - textbox "English"
    - listitem:
      - link "John Smith":
        - /url: "#"
    - listitem:
      - link "Logout":
        - /url: /logout
    - listitem
    - listitem:
      - link "Public store":
        - /url: /
    - listitem:
      - link:
        - /url: "#"
- complementary:
  - link "logo.png":
    - /url: /Admin
    - img "logo.png"
  - textbox "Search"
  - navigation:
    - menu:
      - listitem:
        - link "Dashboard":
          - /url: /Admin
          - paragraph: Dashboard
      - listitem:
        - link "Catalog":
          - /url: "#"
          - paragraph: Catalog
      - listitem:
        - link "Sales":
          - /url: "#"
          - paragraph: Sales
        - list:
          - listitem:
            - link "Orders":
              - /url: /Admin/Order/List
              - paragraph: Orders
          - listitem:
            - link "Shipments":
              - /url: /Admin/Order/ShipmentList
              - paragraph: Shipments
          - listitem:
            - link "Return requests":
              - /url: /Admin/ReturnRequest/List
              - paragraph: Return requests
          - listitem:
            - link "Recurring payments":
              - /url: /Admin/RecurringPayment/List
              - paragraph: Recurring payments
          - listitem:
            - link "Gift cards":
              - /url: /Admin/GiftCard/List
              - paragraph: Gift cards
          - listitem:
            - link "Shopping carts and wishlists":
              - /url: /Admin/ShoppingCart/CurrentCarts
              - paragraph: Shopping carts and wishlists
          - listitem:
            - link "Requests for quote":
              - /url: /Admin/RfqAdmin/AdminRequests
              - paragraph: Requests for quote
          - listitem:
            - link "Quotes":
              - /url: /Admin/RfqAdmin/AdminQuotes
              - paragraph: Quotes
      - listitem:
        - link "Customers":
          - /url: "#"
          - paragraph: Customers
      - listitem:
        - link "Promotions":
          - /url: "#"
          - paragraph: Promotions
      - listitem:
        - link "Content management":
          - /url: "#"
          - paragraph: Content management
      - listitem:
        - link "Configuration":
          - /url: "#"
          - paragraph: Configuration
      - listitem:
        - link "System":
          - /url: "#"
          - paragraph: System
      - listitem:
        - link "Reports":
          - /url: "#"
          - paragraph: Reports
      - listitem:
        - link "Help":
          - /url: "#"
          - paragraph: Help
- heading "Shipments" [level=1]
- button "Print packaging slips"
- button
- button "Set as shipped (selected)"
- button "Set as ready for pickup (selected)"
- button "Set as delivered (selected)"
- text: Search Start date
- textbox "Start date": 2026-10-20
- text: End date
- textbox "End date": 2026-10-01
- text: Tracking number
- textbox "Tracking number"
- text: Warehouse
- combobox "All":
  - textbox "All"
- text: Load not delivered
- checkbox "Load not delivered"
- text: Country
- combobox "Select country":
  - textbox "Select country"
- text: State / province
- combobox "Other":
  - textbox "Other"
- text: County / region
- textbox "County / region"
- text: City
- textbox "City"
- text: Load not shipped
- checkbox "Load not shipped"
- text: Load not ready for pickup
- checkbox "Load not ready for pickup"
- button "Search"
- text: Learn more about
- link "shipping management":
  - /url: https://docs.nopcommerce.com/running-your-store/order-management/shipping-management.html?utm_source=admin-panel&utm_medium=admin-page&utm_campaign=documentation&utm_content=doc-reference
- table:
  - rowgroup:
    - 'row "Shipment # Order # Pickup from store Tracking number Total weight Date shipped Date ready for pickup Date delivered View"':
      - columnheader
      - columnheader:
        - checkbox
      - 'columnheader "Shipment #"'
      - 'columnheader "Order #"'
      - columnheader "Pickup from store"
      - columnheader "Tracking number"
      - columnheader "Total weight"
      - columnheader "Date shipped"
      - columnheader "Date ready for pickup"
      - columnheader "Date delivered"
      - columnheader "View"
- table:
  - rowgroup:
    - 'row "Shipment # Order # Pickup from store Tracking number Total weight Date shipped Date ready for pickup Date delivered View"':
      - columnheader
      - columnheader:
        - checkbox
      - 'columnheader "Shipment #"'
      - 'columnheader "Order #"'
      - columnheader "Pickup from store"
      - columnheader "Tracking number"
      - columnheader "Total weight"
      - columnheader "Date shipped"
      - columnheader "Date ready for pickup"
      - columnheader "Date delivered"
      - columnheader "View"
  - rowgroup:
    - row "No data available in table":
      - cell "No data available in table"
- table
- navigation "pagination":
  - list:
    - listitem: Previous
    - listitem: Next
- text: Show
- combobox "Show items":
  - option "7"
  - option "15" [selected]
  - option "20"
  - option "50"
  - option "100"
- text: items
- status: No records
- button
- text: Powered by
- link "nopCommerce":
  - /url: https://www.nopcommerce.com/?utm_source=admin-panel&utm_medium=footer&utm_campaign=admin-panel
- text: Wednesday, November 25, 2026 6:38 AM nopCommerce version 5.00.0
```

# Test source

```ts
  223 |         await expect(page).toHaveURL(/\/Admin\/Order\/ShipmentList/i);
  224 |     });
  225 | 
  226 |     // admin_ship_02: Kiểm tra trạng thái hiển thị mặc định của bảng giao hàng
  227 |     // Procedure: Step:
  228 |     // 1. Truy cập màn hình Shipments
  229 |     // 2. Quan sát bảng dữ liệu ban đầu
  230 |     // Expected: 1. Bảng hiển thị danh sách các chuyến giao hàng hiện có trong hệ thống.
  231 |     // 2. Các ô lọc tìm kiếm ban đầu ở trạng thái trống.
  232 |     test('admin_ship_02 - Kiểm tra trạng thái hiển thị mặc định của bảng giao hàng', async ({ page }) => {
  233 |         await openList(page, 'ship');
  234 |         await grid(page, 'ship');
  235 | 
  236 |         // 1. Bảng hiển thị danh sách các chuyến giao hàng hiện có trong hệ thống
  237 |         const rows = page.locator('#shipments-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  238 |         expect(await rows.count()).toBeGreaterThan(0);
  239 | 
  240 |         // 2. Các ô lọc tìm kiếm ban đầu ở trạng thái trống
  241 |         await expect(page.locator('#StartDate')).toHaveValue('');
  242 |         await expect(page.locator('#EndDate')).toHaveValue('');
  243 |         await expect(page.locator('#TrackingNumber')).toHaveValue('');
  244 |     });
  245 | 
  246 |     // admin_ship_03: Kiểm tra lọc danh sách giao hàng theo Mã vận đơn (Tracking number) không tồn tại
  247 |     // Procedure: Step:
  248 |     // 1. Nhập Tracking number = 'MA_KHONG_TON_TAI_999'
  249 |     // 2. Click nút [Search]
  250 |     // Expected: 1. Bảng dữ liệu không hiển thị bản ghi nào.
  251 |     // 2. Hiển thị thông báo 'No data available in table'.
  252 |     test('admin_ship_03 - Kiểm tra lọc danh sách giao hàng theo Mã vận đơn (Tracking number) không tồn tại', async ({ page }) => {
  253 |         await openList(page, 'ship');
  254 |         await clearDates(page);
  255 |         await fill(page, '#TrackingNumber', 'MA_KHONG_TON_TAI_999');
  256 |         await search(page, 'ship');
  257 | 
  258 |         // 1. Bảng dữ liệu không hiển thị bản ghi nào.
  259 |         // 2. Hiển thị thông báo 'No data available in table'.
  260 |         await empty(page, 'ship');
  261 |     });
  262 | 
  263 |     // admin_ship_04: Kiểm tra lọc danh sách giao hàng theo Mã vận đơn (Tracking number) tồn tại
  264 |     // Procedure: Pre-condition:
  265 |     // + Có chuyến hàng với Tracking number = 'VNPOST_123456'.
  266 |     // 
  267 |     // Step:
  268 |     // 1. Nhập Tracking number = 'VNPOST_123456'
  269 |     // 2. Click nút [Search]
  270 |     // Expected: 1. Danh sách lọc và hiển thị chính xác chuyến hàng có mã vận đơn 'VNPOST_123456'.
  271 |     test('admin_ship_04 - Kiểm tra lọc danh sách giao hàng theo Mã vận đơn (Tracking number) tồn tại', async ({ page }) => {
  272 |         await openList(page, 'ship');
  273 |         await clearDates(page);
  274 |         const tracking = fixture('TRACKING_NUMBER') || 'VNPOST_123456';
  275 |         await fill(page, '#TrackingNumber', tracking);
  276 |         await search(page, 'ship');
  277 | 
  278 |         // Expected: 1. Danh sách lọc và hiển thị chính xác chuyến hàng có mã vận đơn 'VNPOST_123456'
  279 |         await expect(page.locator('#shipments-grid tbody')).toContainText(tracking);
  280 |     });
  281 | 
  282 |     // admin_ship_05: Kiểm tra lọc danh sách giao hàng theo Quốc gia / Tỉnh thành
  283 |     // Procedure: Step:
  284 |     // 1. Chọn Country = [United States]
  285 |     // 2. Click nút [Search]
  286 |     // Expected: 1. Hiển thị danh sách các option quốc gia trong đó có United States of America
  287 |     // 2.. Bảng dữ liệu hiển thị các chuyến hàng có địa chỉ người nhận thuộc quốc gia United States of America.
  288 |     test('admin_ship_05 - Kiểm tra lọc danh sách giao hàng theo Quốc gia', async ({ page }) => {
  289 |         await openList(page, 'ship');
  290 |         await clearDates(page);
  291 | 
  292 |         // 1. Hiển thị danh sách các option quốc gia trong đó có United States
  293 |         await expect(page.locator('#CountryId option')).toContainText(['United States of America']);
  294 |     });
  295 | 
  296 |     // admin_ship_06: Kiểm tra lọc danh sách giao hàng theo khoảng ngày xuất kho hợp lệ (start date <= end date)
  297 |     // Procedure: Step:
  298 |     // 1. Chọn Start date = '2026-10-01'
  299 |     // 2. Chọn End date = '2026-10-20'
  300 |     // 3. Click nút [Search]
  301 |     // Expected: 1. Danh sách hiển thị các chuyến hàng có Shipped date nằm trong khoảng từ 2026-10-01 đến 2026-10-20.
  302 |     test('admin_ship_06 - Kiểm tra lọc danh sách giao hàng theo khoảng ngày xuất kho hợp lệ (start date <= end date)', async ({ page }) => {
  303 |         await openList(page, 'ship');
  304 |         await fill(page, '#StartDate', '2026-10-01');
  305 |         await fill(page, '#EndDate', '2026-10-20');
  306 |         await search(page, 'ship');
  307 |     });
  308 | 
  309 |     // admin_ship_07: Kiểm tra lọc danh sách giao hàng theo khoảng ngày xuất kho không hợp lệ (start date > end date)
  310 |     // Procedure: Step:
  311 |     // 1. Chọn Start date = '2026-10-20'
  312 |     // 2. Chọn End date = '2026-10-01'
  313 |     // 3. Click nút [Search]
  314 |     // Expected: 1. Hệ thống thông báo ngày không hợp lệ
  315 |     // 2. Hiển thị thông báo 'No data available in table'.
  316 |     test('admin_ship_07 - Kiểm tra lọc danh sách giao hàng theo khoảng ngày xuất kho không hợp lệ (start date > end date)', async ({ page }) => {
  317 |         await openList(page, 'ship');
  318 |         await fill(page, '#StartDate', '2026-10-20');
  319 |         await fill(page, '#EndDate', '2026-10-01');
  320 |         await search(page, 'ship');
  321 | 
  322 |         // 1. Hệ thống thông báo ngày không hợp lệ (nếu web không bắt lỗi thì test sẽ FAIL đúng theo Expected)
> 323 |         await expect(page.locator('.alert-danger, .field-validation-error, .text-danger, #validation-error')).toBeVisible({ timeout: 5000 });
      |                                                                                                               ^ Error: expect(locator).toBeVisible() failed
  324 | 
  325 |         // 2. Hiển thị thông báo 'No data available in table'
  326 |         await empty(page, 'ship');
  327 |     });
  328 | 
  329 |     // admin_ship_08: Kiểm tra lọc danh sách giao hàng khi chỉ nhập Start date
  330 |     // Procedure: Step:
  331 |     // 1. Nhập Start date = '2026-10-01'
  332 |     // 2. Để trống End date
  333 |     // 3. Click nút [Search]
  334 |     // Expected: 1. Hiển thị tất cả các chuyến hàng được xuất kho từ ngày 2026-10-01 trở về sau.
  335 |     test('admin_ship_08 - Kiểm tra lọc danh sách giao hàng khi chỉ nhập Start date', async ({ page }) => {
  336 |         await openList(page, 'ship');
  337 |         await fill(page, '#StartDate', '2026-10-01');
  338 |         await page.locator('#EndDate').fill('');
  339 |         await search(page, 'ship');
  340 |     });
  341 | 
  342 |     // admin_ship_09: Kiểm tra lọc danh sách giao hàng khi chỉ nhập End date
  343 |     // Procedure: Step:
  344 |     // 1. Để trống Start date
  345 |     // 2. Nhập End date = '2026-10-20'
  346 |     // 3. Click nút [Search]
  347 |     // Expected: 1. Hiển thị tất cả các chuyến hàng xuất kho trước hoặc trong ngày 2026-10-20.
  348 |     test('admin_ship_09 - Kiểm tra lọc danh sách giao hàng khi chỉ nhập End date', async ({ page }) => {
  349 |         await openList(page, 'ship');
  350 |         await page.locator('#StartDate').fill('');
  351 |         await fill(page, '#EndDate', '2026-10-20');
  352 |         await search(page, 'ship');
  353 |     });
  354 | 
  355 |     // admin_ship_10: Kiểm tra phân trang danh sách chuyến giao hàng
  356 |     // Procedure: Step:
  357 |     // 1. Tại chân bảng Shipments, click nút [Next] hoặc số trang [2]
  358 |     // 2. Click nút [Previous] hoặc số trang [1]
  359 |     // Expected: 1. Chuyển sang trang 2 và quay lại trang 1 mượt mà, dữ liệu không bị trùng lặp.
  360 |     test('admin_ship_10 - Kiểm tra phân trang danh sách chuyến giao hàng', async ({ page }) => {
  361 |         await openList(page, 'ship');
  362 |         await grid(page, 'ship');
  363 | 
  364 |         const next = page.locator(`.pagination .next, .pagination .page-item:has(.next), ${ids.ship.grid}_next`).first();
  365 |         const isDisabled = await next.getAttribute('class').then(x => /disabled/.test(x || '')).catch(() => true);
  366 |         test.skip(isDisabled, 'Không đủ trang dữ liệu');
  367 | 
  368 |         // 1. Chuyển sang trang 2
  369 |         await nextPage(page, 'ship');
  370 | 
  371 |         // 2. Quay lại trang 1
  372 |         const prev = page.locator(`.pagination .previous, .pagination .page-item:has(.previous), ${ids.ship.grid}_previous`).first();
  373 |         await expect(prev).not.toHaveClass(/disabled/);
  374 |         await prev.click();
  375 |     });
  376 | 
  377 |     // admin_ship_11: Kiểm tra xem màn hình chi tiết chuyến giao hàng
  378 |     // Procedure: Step:
  379 |     // 1. Click nút [View] tại chuyến giao hàng #1
  380 |     // Expected: 1. Điều hướng vào trang chi tiết chuyến hàng (View shipment details).
  381 |     test('admin_ship_11 - Kiểm tra xem màn hình chi tiết chuyến giao hàng', async ({ page }) => {
  382 |         await openList(page, 'ship');
  383 |         await firstDetail(page, 'ship');
  384 | 
  385 |         // Expected: 1. Điều hướng vào trang chi tiết chuyến hàng (View shipment details).
  386 |         await expect(page).toHaveURL(/\/Admin\/Order\/ShipmentDetails/i);
  387 |         await expect(page.locator('.content-header h1, h1.float-left').first()).toContainText(/Shipment details|View shipment details/i);
  388 |     });
  389 | 
  390 |     // admin_ship_12: Kiểm tra cập nhật trạng thái 'Set as shipped' có nhập mã vận đơn Tracking number hợp lệ
  391 |     // Procedure: Step:
  392 |     // 1. Tại chi tiết chuyến hàng chưa xuất kho, nhập Tracking number = 'VNPOST_654321'
  393 |     // 2. Click nút [Set as shipped]
  394 |     // Expected: 2. Cột Shipped date được tự động ghi nhận ngày giờ hiện tại.
  395 |     test('admin_ship_12 - Kiểm tra cập nhật trạng thái ’Set as shipped’ có nhập mã vận đơn Tracking number hợp lệ', async ({ page }) => {
  396 |         await openList(page, 'ship');
  397 |         await firstDetail(page, 'ship');
  398 | 
  399 |         // 1. Tại chi tiết chuyến hàng chưa xuất kho, nhập Tracking number = 'VNPOST_654321'
  400 |         const trackingInput = page.locator('#TrackingNumber');
  401 |         await expect(trackingInput).toBeVisible();
  402 |         await trackingInput.fill('VNPOST_654321');
  403 | 
  404 |         const setTrackingBtn = page.locator('button[name="settrackingnumber"], #settrackingnumber');
  405 |         if (await setTrackingBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  406 |             await setTrackingBtn.click();
  407 |             await page.waitForTimeout(1000);
  408 |         }
  409 | 
  410 |         // 2. Click nút [Set as shipped]
  411 |         const setShippedBtn = page.locator('button[name="setasshipped"], #setasshipped');
  412 |         if (await setShippedBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  413 |             await setShippedBtn.click();
  414 |             const confirmYes = page.locator('#setasshipped-action-confirmation-submit-button');
  415 |             if (await confirmYes.isVisible({ timeout: 2000 }).catch(() => false)) {
  416 |                 await confirmYes.click();
  417 |             }
  418 |         }
  419 | 
  420 |         // Expected: 2. Cột Shipped date được tự động ghi nhận ngày giờ hiện tại
  421 |         await expect(page.locator('body')).toContainText(/Shipped|VNPOST_654321/i);
  422 |     });
  423 | 
```