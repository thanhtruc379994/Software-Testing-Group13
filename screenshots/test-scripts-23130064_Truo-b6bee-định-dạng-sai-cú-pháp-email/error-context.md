# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-scripts\23130064_TruongCaoDoan_TestScripts\orders.spec.js >> Admin - Orders >> admin_ord_22 - Kiểm tra tìm kiếm theo Email thanh toán với định dạng sai cú pháp email
- Location: test-scripts\23130064_TruongCaoDoan_TestScripts\orders.spec.js:458:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.field-validation-error, .text-danger, .alert-danger, [data-valmsg-for="BillingEmail"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.field-validation-error, .text-danger, .alert-danger, [data-valmsg-for="BillingEmail"]') with timeout 5000ms
  - waiting for locator('.field-validation-error, .text-danger, .alert-danger, [data-valmsg-for="BillingEmail"]')

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
- heading "Orders" [level=1]
- button "Export"
- button
- button "Import"
- button "Print PDF invoices"
- button
- text: Search Start date
- textbox "Start date"
- text: End date
- textbox "End date"
- text: Warehouse
- combobox "All":
  - textbox "All"
- text: Product
- textbox
- text: Order statuses
- combobox:
  - list:
    - listitem "All": × All
    - listitem:
      - searchbox
- text: Payment statuses
- combobox:
  - list:
    - listitem "All": × All
    - listitem:
      - searchbox
- text: Shipping statuses
- combobox:
  - list:
    - listitem "All": × All
    - listitem:
      - searchbox
- text: Vendor
- combobox "All":
  - textbox "All"
- text: Billing phone number
- textbox "Billing phone number"
- text: Billing email address
- textbox "Billing email address": email_sai_cu_phap@@test
- text: Billing last name
- textbox "Billing last name"
- text: Billing country
- combobox "All":
  - textbox "All"
- text: Payment method
- combobox "All":
  - textbox "All"
- text: Order notes
- textbox "Order notes"
- text: "Go directly to order #"
- 'textbox "Go directly to order #"'
- button "Go"
- button "Search"
- text: Learn more about
- link "orders":
  - /url: https://docs.nopcommerce.com/running-your-store/order-management/orders.html?utm_source=admin-panel&utm_medium=admin-page&utm_campaign=documentation&utm_content=doc-reference
- table:
  - rowgroup:
    - 'row "Order # Order status Payment status Shipping status Customer Created on Order total View"':
      - columnheader:
        - checkbox
      - 'columnheader "Order #"'
      - columnheader "Order status"
      - columnheader "Payment status"
      - columnheader "Shipping status"
      - columnheader "Customer"
      - columnheader "Created on"
      - columnheader "Order total"
      - columnheader "View"
- table:
  - rowgroup:
    - row "Summary Profit $0.00 Shipping $0.00 Tax $0.00 Total $0.00":
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell "Summary Profit $0.00 Shipping $0.00 Tax $0.00 Total $0.00":
        - strong: Summary
        - text: Profit $0.00 Shipping $0.00 Tax $0.00 Total $0.00
      - cell
  - rowgroup:
    - 'row "Order # Order status Payment status Shipping status Customer Created on Order total View"':
      - columnheader:
        - checkbox
      - 'columnheader "Order #"'
      - columnheader "Order status"
      - columnheader "Payment status"
      - columnheader "Shipping status"
      - columnheader "Customer"
      - columnheader "Created on"
      - columnheader "Order total"
      - columnheader "View"
  - rowgroup:
    - row "No data available in table":
      - cell "No data available in table"
- table:
  - rowgroup:
    - row "Summary Profit $0.00 Shipping $0.00 Tax $0.00 Total $0.00":
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell
      - cell "Summary Profit $0.00 Shipping $0.00 Tax $0.00 Total $0.00":
        - strong: Summary
        - text: Profit $0.00 Shipping $0.00 Tax $0.00 Total $0.00
      - cell
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
- text: Wednesday, November 25, 2026 6:36 AM nopCommerce version 5.00.0
- status
```

# Test source

```ts
  364 |         await openList(page, 'ord');
  365 |         await choose(page, '#PaymentStatusIds', 'Refunded');
  366 |         await search(page, 'ord');
  367 |         const rows = page.locator('#orders-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  368 |         for (const row of await rows.all()) await expect(row).toContainText('Refunded');
  369 |     });
  370 | 
  371 |     // admin_ord_16: Kiểm tra lọc đơn hàng theo Payment status = 'Voided'
  372 |     // Procedure: Step:
  373 |     // 1. Chọn Payment status = [Voided]
  374 |     // 2. Click nút [Search]
  375 |     // Expected: 1. Bảng dữ liệu chỉ hiển thị các đơn hàng đã hủy bỏ giao dịch thanh toán ('Voided').
  376 |     test('admin_ord_16 - Kiểm tra lọc đơn hàng theo Payment status = ’Voided’', async ({ page }) => {
  377 |         await openList(page, 'ord');
  378 |         await choose(page, '#PaymentStatusIds', 'Voided');
  379 |         await search(page, 'ord');
  380 |         const rows = page.locator('#orders-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  381 |         for (const row of await rows.all()) await expect(row).toContainText('Voided');
  382 |     });
  383 | 
  384 |     // admin_ord_17: Kiểm tra lọc đơn hàng theo Payment status = 'Partially Refunded'
  385 |     // Procedure: Step:
  386 |     // 1. Chọn Payment status = [Partially Refunded]
  387 |     // 2. Click nút [Search]
  388 |     // Expected: 1. Bảng dữ liệu chỉ hiển thị các đơn hàng được hoàn trả tiền một phần.
  389 |     test('admin_ord_17 - Kiểm tra lọc đơn hàng theo Payment status = ’Partially Refunded’', async ({ page }) => {
  390 |         await openList(page, 'ord');
  391 |         await choose(page, '#PaymentStatusIds', 'Partially refunded');
  392 |         await search(page, 'ord');
  393 |         const rows = page.locator('#orders-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  394 |         for (const row of await rows.all()) await expect(row).toContainText('Partially refunded');
  395 |     });
  396 | 
  397 |     // admin_ord_18: Kiểm tra lọc đơn hàng theo Shipping status = 'Not yet shipped'
  398 |     // Procedure: Step:
  399 |     // 1. Chọn Shipping status = [Not yet shipped]
  400 |     // 2. Click nút [Search]
  401 |     // Expected: 1. Bảng dữ liệu chỉ hiển thị các đơn hàng chưa đóng gói xuất kho giao hàng.
  402 |     test('admin_ord_18 - Kiểm tra lọc đơn hàng theo Shipping status = ’Not yet shipped’', async ({ page }) => {
  403 |         await openList(page, 'ord');
  404 |         await choose(page, '#ShippingStatusIds', 'Not yet shipped');
  405 |         await search(page, 'ord');
  406 |         const rows = page.locator('#orders-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  407 |         for (const row of await rows.all()) await expect(row).toContainText('Not yet shipped');
  408 |     });
  409 | 
  410 |     // admin_ord_19: Kiểm tra lọc đơn hàng theo Shipping status = 'Shipped'
  411 |     // Procedure: Step:
  412 |     // 1. Chọn Shipping status = [Shipped]
  413 |     // 2. Click nút [Search]
  414 |     // Expected: 1. Bảng dữ liệu chỉ hiển thị các đơn hàng đang trên đường vận chuyển.
  415 |     test('admin_ord_19 - Kiểm tra lọc đơn hàng theo Shipping status = ’Shipped’', async ({ page }) => {
  416 |         await openList(page, 'ord');
  417 |         await choose(page, '#ShippingStatusIds', 'Shipped');
  418 |         await search(page, 'ord');
  419 |         const rows = page.locator('#orders-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  420 |         for (const row of await rows.all()) await expect(row).toContainText('Shipped');
  421 |     });
  422 | 
  423 |     // admin_ord_20: Kiểm tra lọc đơn hàng theo Shipping status = 'Delivered'
  424 |     // Procedure: Step:
  425 |     // 1. Chọn Shipping status = [Delivered]
  426 |     // 2. Click nút [Search]
  427 |     // Expected: 1. Bảng dữ liệu chỉ hiển thị các đơn hàng đã được giao thành công đến tay người nhận.
  428 |     test('admin_ord_20 - Kiểm tra lọc đơn hàng theo Shipping status = ’Delivered’', async ({ page }) => {
  429 |         await openList(page, 'ord');
  430 |         await choose(page, '#ShippingStatusIds', 'Delivered');
  431 |         await search(page, 'ord');
  432 |         const rows = page.locator('#orders-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  433 |         for (const row of await rows.all()) await expect(row).toContainText('Delivered');
  434 |     });
  435 | 
  436 |     // admin_ord_21: Kiểm tra tìm kiếm theo Email thanh toán với email đang tồn tại trong hệ thống
  437 |     // Procedure: Pre-condition:
  438 |     // + Có đơn hàng của khách hàng 'steve_gates@nopCommerce.com'.
  439 |     // 
  440 |     // Step:
  441 |     // 1. Nhập 'steve_gates@nopCommerce.com' vào ô 'Billing email'
  442 |     // 2. Click nút [Search]
  443 |     // Expected: 1. Danh sách lọc và hiển thị chính xác các đơn hàng thuộc email 'steve_gates@nopCommerce.com'.
  444 |     test('admin_ord_21 - Kiểm tra tìm kiếm theo Email thanh toán với email đang tồn tại trong hệ thống', async ({ page }) => {
  445 |         await openList(page, 'ord');
  446 |         await clearDates(page);
  447 |         const email = fixture('ORDER_EMAIL') || 'steve_gates@nopCommerce.com';
  448 |         await fill(page, '#BillingEmail', email);
  449 |         await search(page, 'ord');
  450 |         await expect(page.locator('#orders-grid tbody')).toContainText(email);
  451 |     });
  452 | 
  453 |     // admin_ord_22: Kiểm tra tìm kiếm theo Email thanh toán với định dạng sai cú pháp email
  454 |     // Procedure: Step:
  455 |     // 1. Nhập 'email_sai_cu_phap@@test' vào ô 'Billing email'
  456 |     // 2. Click nút [Search]
  457 |     // Expected: 1. Hệ thống hiển thị cảnh báo sai cú pháp email.
  458 |     test('admin_ord_22 - Kiểm tra tìm kiếm theo Email thanh toán với định dạng sai cú pháp email', async ({ page }) => {
  459 |         await openList(page, 'ord');
  460 |         await fill(page, '#BillingEmail', 'email_sai_cu_phap@@test');
  461 |         await search(page, 'ord');
  462 | 
  463 |         // Kiểm tra hệ thống hiển thị cảnh báo sai cú pháp email (nếu web không bắt lỗi thì test sẽ FAIL đúng theo Expected)
> 464 |         await expect(page.locator('.field-validation-error, .text-danger, .alert-danger, [data-valmsg-for="BillingEmail"]')).toBeVisible({ timeout: 5000 });
      |                                                                                                                              ^ Error: expect(locator).toBeVisible() failed
  465 |     });
  466 | 
  467 |     // admin_ord_23: Kiểm tra tìm kiếm theo Tên khách hàng (Billing Last Name)
  468 |     // Procedure: Step:
  469 |     // 1. Nhập Last Name = 'Gates' vào ô tìm kiếm
  470 |     // 2. Click nút [Search]
  471 |     // Expected: 1. Danh sách hiển thị các đơn hàng có họ khách hàng chứa từ 'Gates'.
  472 |     test('admin_ord_23 - Kiểm tra tìm kiếm theo Tên khách hàng (Billing Last Name)', async ({ page }) => {
  473 |         await openList(page, 'ord');
  474 |         await clearDates(page);
  475 |         const lastName = fixture('BILLING_LAST_NAME') || 'Gates';
  476 |         await fill(page, '#BillingLastName', lastName);
  477 |         await search(page, 'ord');
  478 |         await expect(page.locator('#orders-grid tbody')).toContainText(lastName);
  479 |     });
  480 | 
  481 |     // admin_ord_24: Kiểm tra tìm kiếm theo từ khóa trong Ghi chú đơn hàng (Order notes)
  482 |     // Procedure: Step:
  483 |     // 1. Nhập từ khóa 'khách VIP' vào ô 'Order notes'
  484 |     // 2. Click nút [Search]
  485 |     // Expected: 1. Bảng lọc và hiển thị các đơn hàng có nội dung ghi chú chứa từ 'khách VIP'.
  486 |     test('admin_ord_24 - Kiểm tra tìm kiếm theo từ khóa trong Ghi chú đơn hàng (Order notes)', async ({ page }) => {
  487 |         await openList(page, 'ord');
  488 |         await clearDates(page);
  489 |         const note = fixture('ORDER_NOTE') || 'khách VIP';
  490 |         await fill(page, '#OrderNotes', note);
  491 |         await search(page, 'ord');
  492 |     });
  493 | 
  494 |     // admin_ord_25: Kiểm tra chuyển sang trang kế tiếp
  495 |     // Procedure: Step:
  496 |     // 1. Tại chân bảng đơn hàng, click nút [Next] hoặc số trang [2]
  497 |     // Expected: 1. Bảng tải và hiển thị danh sách đơn hàng của trang 2.
  498 |     // 2. Số thứ tự đơn hàng tiếp nối chính xác trang 1.
  499 |     test('admin_ord_25 - Kiểm tra chuyển sang trang kế tiếp', async ({ page }) => {
  500 |         await openList(page, 'ord');
  501 |         await grid(page, 'ord');
  502 |         const next = page.locator('.pagination .next, .pagination .page-item:has(.next), #orders-grid_next').first();
  503 |         const isDisabled = await next.getAttribute('class').then(x => /disabled/.test(x || '')).catch(() => true);
  504 |         test.skip(isDisabled, 'Không đủ trang dữ liệu');
  505 |         await nextPage(page, 'ord');
  506 |     });
  507 | 
  508 |     // admin_ord_26: Kiểm tra quay lại trang trước đó
  509 |     // Procedure: Pre-condition:
  510 |     // + Đang đứng ở trang 2 của danh sách đơn hàng.
  511 |     // 
  512 |     // Step:
  513 |     // 1. Click nút [Previous] hoặc số trang [1]
  514 |     // Expected: 1. Hệ thống quay trở lại và hiển thị danh sách đơn hàng của trang 1.
  515 |     test('admin_ord_26 - Kiểm tra quay lại trang trước đó', async ({ page }) => {
  516 |         await openList(page, 'ord');
  517 |         await grid(page, 'ord');
  518 |         const next = page.locator('.pagination .next, .pagination .page-item:has(.next), #orders-grid_next').first();
  519 |         const isDisabled = await next.getAttribute('class').then(x => /disabled/.test(x || '')).catch(() => true);
  520 |         test.skip(isDisabled, 'Không đủ trang dữ liệu');
  521 |         await nextPage(page, 'ord');
  522 |         const prev = page.locator('.pagination .previous, .pagination .page-item:has(.previous), #orders-grid_previous').first();
  523 |         await prev.click();
  524 |     });
  525 | 
  526 |     // admin_ord_27: Kiểm tra thay đổi số lượng bản ghi hiển thị trên trang (15, 20, 50, 100 dòng/trang)
  527 |     // Procedure: Step:
  528 |     // 1. Chọn dropdown kích thước trang lần lượt là 20, 50, 100 dòng/trang
  529 |     // Expected: 1. Số lượng dòng dữ liệu hiển thị trên bảng cập nhật tương ứng chính xác theo giá trị đã chọn.
  530 |     test('admin_ord_27 - Kiểm tra thay đổi số lượng bản ghi hiển thị trên trang (15, 20, 50, 100 dòng/trang)', async ({ page }) => {
  531 |         await openList(page, 'ord');
  532 |         await grid(page, 'ord');
  533 |         const size = page.locator("select[name='orders-grid_length']");
  534 |         await expect(size).toBeVisible();
  535 |         for (const n of ['15', '20', '50', '100']) {
  536 |             if (await size.locator(`option[value="${n}"]`).count()) await size.selectOption(n);
  537 |         }
  538 |     });
  539 | 
  540 |     // admin_ord_28: Kiểm tra điều hướng vào trang Chi tiết đơn hàng khi click nút [View]
  541 |     // Procedure: Step:
  542 |     // 1. Click nút [View] tại dòng đơn hàng #1
  543 |     // Expected: 1. Hệ thống chuyển hướng vào màn hình xem chi tiết đơn hàng #1 (View order details - 1).
  544 |     test('admin_ord_28 - Kiểm tra điều hướng vào trang Chi tiết đơn hàng khi click nút [View]', async ({ page }) => {
  545 |         await openList(page, 'ord');
  546 |         await firstDetail(page, 'ord');
  547 |     });
  548 | 
  549 |     // admin_ord_29: Kiểm tra bố cục trang Chi tiết đơn hàng (tab Thông tin chung, Địa chỉ, Danh sách sản phẩm, Ghi chú)
  550 |     // Procedure: Step:
  551 |     // 1. Quan sát giao diện trang Chi tiết đơn hàng
  552 |     // Expected: 1. Hiển thị đầy đủ 4 tab chức năng: Info (Thông tin chung), Billing & Shipping (Địa chỉ), Products (Sản phẩm), Order notes (Ghi chú).
  553 |     test('admin_ord_29 - Kiểm tra bố cục trang Chi tiết đơn hàng (tab Thông tin chung, Địa chỉ, Danh sách sản phẩm, Ghi chú)', async ({ page }) => {
  554 |         await openList(page, 'ord');
  555 |         await firstDetail(page, 'ord');
  556 |         await expect(page.locator('body')).toContainText(/Order info|Billing info|Products|Order notes/i);
  557 |     });
  558 | 
  559 |     // admin_ord_30: Kiểm tra thay đổi tổng tiền đơn hàng với số âm
  560 |     // Procedure: Step:
  561 |     // 1. Tại panel 'Order totals', click nút [Edit order total]
  562 |     // 2. Nhập số tiền âm: Order total= '-50'
  563 |     // 3. Click nút [Save]
  564 |     // Expected: 1. Hệ thống báo lỗi validation không cho phép tổng tiền là số âm.
```