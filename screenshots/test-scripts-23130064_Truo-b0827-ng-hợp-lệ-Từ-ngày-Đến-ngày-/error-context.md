# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-scripts\23130064_TruongCaoDoan_TestScripts\orders.spec.js >> Admin - Orders >> admin_ord_05 - Kiểm tra lọc đơn hàng với khoảng ngày không hợp lệ (Từ ngày > Đến ngày)
- Location: test-scripts\23130064_TruongCaoDoan_TestScripts\orders.spec.js:227:5

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
- heading "Orders" [level=1]
- button "Export"
- button
- button "Import"
- button "Print PDF invoices"
- button
- text: Search Start date
- textbox "Start date": 2026-10-20
- text: End date
- textbox "End date": 2026-10-01
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
- textbox "Billing email address"
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
  134 | let isInitialLoggedIn = false;
  135 | 
  136 | test.describe('Admin - Orders', () => {
  137 | 
  138 |     test.setTimeout(120000);
  139 | 
  140 |     test.beforeEach(async ({ page }) => {
  141 |         // Chỉ thực hiện đăng nhập 1 lần duy nhất từ đầu cho tất cả các test case
  142 |         if (!isInitialLoggedIn) {
  143 |             await login(page);
  144 |             isInitialLoggedIn = true;
  145 |         }
  146 |     });
  147 | 
  148 |     // admin_ord_01: Kiểm tra hiển thị màn hình danh sách đơn hàng khi click [admin > Orders]
  149 |     // Procedure: Pre-condition:
  150 |     // + Đăng nhập tài khoản Quản trị viên (Admin).
  151 |     // 
  152 |     // Step:
  153 |     // 1. Tại thanh menu bên trái, click chọn [admin]
  154 |     // 2. Click chọn mục con [Orders]
  155 |     // Expected: 1. Màn hình Quản lý đơn hàng hiển thị chính xác.
  156 |     // 2. Khung lọc tìm kiếm, các nút chức năng và bảng dữ liệu hiển thị đúng chuẩn GUI.
  157 |     test('admin_ord_01 - Kiểm tra hiển thị màn hình danh sách đơn hàng khi click [admin > Orders]', async ({ page }) => {
  158 |         await openList(page, 'ord');
  159 |         await grid(page, 'ord');
  160 |     });
  161 | 
  162 |     // admin_ord_02: Kiểm tra trạng thái hiển thị mặc định của bảng đơn hàng
  163 |     // Procedure: Step:
  164 |     // 1. Mở màn hình Orders
  165 |     // 2. Quan sát các tiêu chí lọc mặc định và bảng danh sách
  166 |     // Expected: 1. Các dropdown trạng thái hiển thị mặc định là 'All'.
  167 |     // 2. Bảng dữ liệu hiển thị danh sách toàn bộ các đơn hàng hiện có trong hệ thống.
  168 |     test('admin_ord_02 - Kiểm tra trạng thái hiển thị mặc định của bảng đơn hàng', async ({ page }) => {
  169 |         await openList(page, 'ord');
  170 |         await grid(page, 'ord');
  171 | 
  172 |         // 1. Các dropdown trạng thái hiển thị mặc định là 'All'
  173 |         await expect(page.locator('#OrderStatusIds option:checked')).toHaveText('All');
  174 |         await expect(page.locator('#PaymentStatusIds option:checked')).toHaveText('All');
  175 |         await expect(page.locator('#ShippingStatusIds option:checked')).toHaveText('All');
  176 | 
  177 |         // 2. Bảng dữ liệu hiển thị danh sách toàn bộ các đơn hàng hiện có trong hệ thống
  178 |         const rows = page.locator('#orders-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  179 |         expect(await rows.count()).toBeGreaterThan(0);
  180 |     });
  181 | 
  182 |     // admin_ord_03: Kiểm tra bố cục và các cột dữ liệu trên bảng đơn hàng
  183 |     // Procedure: Step:
  184 |     // 1. Quan sát hàng tiêu đề của bảng dữ liệu đơn hàng
  185 |     // Expected: 1. Bảng hiển thị đầy đủ các cột: Mã đơn (Order #), Trạng thái đơn (Order status), Trạng thái thanh toán (Payment status), Trạng thái giao hàng (Shipping status), Khách hàng (Customer), Cửa hàng (Store), Ngày tạo (Created on), Tổng tiền (Order total), Nút xem (View).
  186 |     test('admin_ord_03 - Kiểm tra bố cục và các cột dữ liệu trên bảng đơn hàng', async ({ page }) => {
  187 |         await openList(page, 'ord');
  188 |         await grid(page, 'ord');
  189 | 
  190 |         const thead = page.locator('#orders-grid thead');
  191 |         const expectedColumns = [
  192 |             'Order #',
  193 |             'Order status',
  194 |             'Payment status',
  195 |             'Shipping status',
  196 |             'Customer',
  197 |             'Created on',
  198 |             'Order total',
  199 |             'View'
  200 |         ];
  201 | 
  202 |         for (const col of expectedColumns) {
  203 |             await expect(thead).toContainText(col);
  204 |         }
  205 |     });
  206 | 
  207 |     // admin_ord_04: Kiểm tra lọc đơn hàng với khoảng ngày hợp lệ (Từ ngày <= Đến ngày)
  208 |     // Procedure: Step:
  209 |     // 1. Chọn Start date = '2026-10-01'
  210 |     // 2. Chọn End date = '2026-10-20'
  211 |     // 3. Click nút [Search]
  212 |     // Expected: 1. Danh sách chỉ hiển thị các đơn hàng được tạo trong khoảng từ 2026-10-01 00:00:00 đến 2026-10-20 23:59:59.
  213 |     test('admin_ord_04 - Kiểm tra lọc đơn hàng với khoảng ngày hợp lệ (Từ ngày <= Đến ngày)', async ({ page }) => {
  214 |         await openList(page, 'ord');
  215 |         await fill(page, '#StartDate', '2026-10-01');
  216 |         await fill(page, '#EndDate', '2026-10-20');
  217 |         await search(page, 'ord');
  218 |     });
  219 | 
  220 |     // admin_ord_05: Kiểm tra lọc đơn hàng với khoảng ngày không hợp lệ (Từ ngày > Đến ngày)
  221 |     // Procedure: Step:
  222 |     // 1. Chọn Start date = '2026-10-20'
  223 |     // 2. Chọn End date = '2026-10-01'
  224 |     // 3. Click nút [Search]
  225 |     // Expected: 1. Hệ thống hiển thị cảnh báo khoảng ngày không hợp lệ.
  226 |     // 2. Bảng dữ liệu hiển thị 'No data available in table'.
  227 |     test('admin_ord_05 - Kiểm tra lọc đơn hàng với khoảng ngày không hợp lệ (Từ ngày > Đến ngày)', async ({ page }) => {
  228 |         await openList(page, 'ord');
  229 |         await fill(page, '#StartDate', '2026-10-20');
  230 |         await fill(page, '#EndDate', '2026-10-01');
  231 |         await search(page, 'ord');
  232 | 
  233 |         // 1. Kiểm tra hệ thống hiển thị cảnh báo khoảng ngày không hợp lệ (nếu web không bắt lỗi thì test sẽ FAIL đúng theo Expected)
> 234 |         await expect(page.locator('.alert-danger, .field-validation-error, .text-danger, #validation-error')).toBeVisible({ timeout: 5000 });
      |                                                                                                               ^ Error: expect(locator).toBeVisible() failed
  235 | 
  236 |         // 2. Bảng dữ liệu hiển thị 'No data available in table'
  237 |         await empty(page, 'ord');
  238 |     });
  239 | 
  240 |     // admin_ord_06: Kiểm tra lọc đơn hàng khi chỉ nhập Từ ngày (Start date)
  241 |     // Procedure: Step:
  242 |     // 1. Nhập Start date = '2026-10-01'
  243 |     // 2. Để trống End date
  244 |     // 3. Click nút [Search]
  245 |     // Expected: 1. Danh sách hiển thị tất cả các đơn hàng được tạo từ ngày 2026-10-01 trở về sau.
  246 |     test('admin_ord_06 - Kiểm tra lọc đơn hàng khi chỉ nhập Từ ngày (Start date)', async ({ page }) => {
  247 |         await openList(page, 'ord');
  248 |         await fill(page, '#StartDate', '2026-10-01');
  249 |         await page.locator('#EndDate').fill('');
  250 |         await search(page, 'ord');
  251 |     });
  252 | 
  253 |     // admin_ord_07: Kiểm tra lọc đơn hàng khi chỉ nhập Đến ngày (End date)
  254 |     // Procedure: Step:
  255 |     // 1. Để trống Start date
  256 |     // 2. Nhập End date = '2026-10-20'
  257 |     // 3. Click nút [Search]
  258 |     // Expected: 1. Danh sách hiển thị tất cả các đơn hàng được tạo trước hoặc trong ngày 2026-10-20.
  259 |     test('admin_ord_07 - Kiểm tra lọc đơn hàng khi chỉ nhập Đến ngày (End date)', async ({ page }) => {
  260 |         await openList(page, 'ord');
  261 |         await page.locator('#StartDate').fill('');
  262 |         await fill(page, '#EndDate', '2026-10-20');
  263 |         await search(page, 'ord');
  264 |     });
  265 | 
  266 |     // admin_ord_08: Kiểm tra lọc đơn hàng theo Order status = 'Pending'
  267 |     // Procedure: Step:
  268 |     // 1. Chọn Order status = [Pending]
  269 |     // 2. Click nút [Search]
  270 |     // Expected: 1. Bảng dữ liệu chỉ lọc các đơn hàng có trạng thái là 'Pending'.
  271 |     test('admin_ord_08 - Kiểm tra lọc đơn hàng theo Order status = ’Pending’', async ({ page }) => {
  272 |         await openList(page, 'ord');
  273 |         await clearDates(page);
  274 |         await choose(page, '#OrderStatusIds', 'Pending');
  275 |         await search(page, 'ord');
  276 |         const rows = page.locator('#orders-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  277 |         for (const row of await rows.all()) await expect(row).toContainText('Pending');
  278 |     });
  279 | 
  280 |     // admin_ord_09: Kiểm tra lọc đơn hàng theo Order status = 'Processing'
  281 |     // Procedure: Step:
  282 |     // 1. Chọn Order status = [Processing]
  283 |     // 2. Click nút [Search]
  284 |     // Expected: 1. Bảng dữ liệu chỉ hiển thị các đơn hàng đang xử lý có trạng thái 'Processing'.
  285 |     test('admin_ord_09 - Kiểm tra lọc đơn hàng theo Order status = ’Processing’', async ({ page }) => {
  286 |         await openList(page, 'ord');
  287 |         await choose(page, '#OrderStatusIds', 'Processing');
  288 |         await search(page, 'ord');
  289 |         const rows = page.locator('#orders-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  290 |         for (const row of await rows.all()) await expect(row).toContainText('Processing');
  291 |     });
  292 | 
  293 |     // admin_ord_10: Kiểm tra lọc đơn hàng theo Order status = 'Complete'
  294 |     // Procedure: Step:
  295 |     // 1. Chọn Order status = [Complete]
  296 |     // 2. Click nút [Search]
  297 |     // Expected: 1. Bảng dữ liệu chỉ hiển thị các đơn hàng đã hoàn tất (Complete) với nhãn màu xanh lá.
  298 |     test('admin_ord_10 - Kiểm tra lọc đơn hàng theo Order status = ’Complete’', async ({ page }) => {
  299 |         await openList(page, 'ord');
  300 |         await choose(page, '#OrderStatusIds', 'Complete');
  301 |         await search(page, 'ord');
  302 |         const rows = page.locator('#orders-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  303 |         for (const row of await rows.all()) await expect(row).toContainText('Complete');
  304 |     });
  305 | 
  306 |     // admin_ord_11: Kiểm tra lọc đơn hàng theo Order status = 'Cancelled'
  307 |     // Procedure: Step:
  308 |     // 1. Chọn Order status = [Cancelled]
  309 |     // 2. Click nút [Search]
  310 |     // Expected: 1. Bảng dữ liệu chỉ hiển thị các đơn hàng đã bị hủy (Cancelled).
  311 |     test('admin_ord_11 - Kiểm tra lọc đơn hàng theo Order status = ’Cancelled’', async ({ page }) => {
  312 |         await openList(page, 'ord');
  313 |         await choose(page, '#OrderStatusIds', 'Cancelled');
  314 |         await search(page, 'ord');
  315 |         const rows = page.locator('#orders-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  316 |         for (const row of await rows.all()) await expect(row).toContainText('Cancelled');
  317 |     });
  318 | 
  319 |     // admin_ord_12: Kiểm tra lọc đơn hàng theo Payment status = 'Pending'
  320 |     // Procedure: Step:
  321 |     // 1. Chọn Payment status = [Pending]
  322 |     // 2. Click nút [Search]
  323 |     // Expected: 1. Bảng dữ liệu chỉ hiển thị các đơn hàng chưa thực hiện thanh toán ('Pending').
  324 |     test('admin_ord_12 - Kiểm tra lọc đơn hàng theo Payment status = ’Pending’', async ({ page }) => {
  325 |         await openList(page, 'ord');
  326 |         await choose(page, '#PaymentStatusIds', 'Pending');
  327 |         await search(page, 'ord');
  328 |         const rows = page.locator('#orders-grid tbody tr').filter({ hasNotText: /No data available|No matching records/i });
  329 |         for (const row of await rows.all()) await expect(row).toContainText('Pending');
  330 |     });
  331 | 
  332 |     // admin_ord_13: Kiểm tra lọc đơn hàng theo Payment status = 'Authorized'
  333 |     // Procedure: Step:
  334 |     // 1. Chọn Payment status = [Authorized]
```