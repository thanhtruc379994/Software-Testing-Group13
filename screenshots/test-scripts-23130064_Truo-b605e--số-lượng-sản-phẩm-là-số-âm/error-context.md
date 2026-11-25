# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-scripts\23130064_TruongCaoDoan_TestScripts\orders.spec.js >> Admin - Orders >> admin_ord_43 - Kiểm tra thêm sản phẩm vào đơn hàng với số lượng sản phẩm là số âm
- Location: test-scripts\23130064_TruongCaoDoan_TestScripts\orders.spec.js:1063:5

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
- heading "Edit order details - 1 back to order list" [level=1]:
  - text: Edit order details - 1
  - link "back to order list":
    - /url: /Admin/Order/List
- link "Invoice (PDF)":
  - /url: /Admin/Order/PdfInvoice?orderId=1
- text: Delete
- list
- text: Info
- button
- text: "Order # 1 Created on 10/28/2026 5:15:42 AM Customer"
- link "steve_gates@nopCommerce.com":
  - /url: /Admin/Customer/Edit/4
- text: Order status Processing
- button "Cancel order"
- button "Change status"
- text: Order subtotal $1,855.00
- strong: excl tax
- text: Order shipping $0.00
- strong: excl tax
- text: Order tax $0.00 Order total $1,855.00 Profit $1,855.00
- button "Edit order totals"
- text: Payment method Check / Money Order Payment status Paid
- button "Refund (Offline)"
- button "Partial refund (Offline)"
- text: Store Your store name Order GUID 991d7637-8e7e-4eea-9288-331b466599a2 Customer IP address 127.0.0.1 Billing & shipping
- button
- text: Billing address Full name Steve Gates Email steve_gates@nopCommerce.com Phone 87654321 Fax Company Steve Company Address 1 750 Bel Air Rd. Address 2 City Los Angeles County / region State / province California Zip / postal code 90077 Country United States of America
- link "Edit":
  - /url: /Admin/Order/AddressEdit?addressId=10&orderId=1
- text: Shipping address Full name Steve Gates Email steve_gates@nopCommerce.com Phone 87654321 Fax Company Steve Company Address 1 750 Bel Air Rd. Address 2 City Los Angeles County / region State / province California Zip / postal code 90077 Country United States of America
- img "google maps"
- link "View address on Google Maps":
  - /url: https://maps.google.com/maps?f=q&hl=en&ie=UTF8&oe=UTF8&geocode=&q=750+Bel+Air+Rd.+90077+Los+Angeles+United+States+of+America
- link "Edit":
  - /url: /Admin/Order/AddressEdit?addressId=11&orderId=1
- text: Shipping method Ground
- button "Edit"
- text: Shipping status Not yet shipped Shipments
- table:
  - rowgroup:
    - 'row "Shipment # Order # Tracking number Total weight Date shipped Date delivered View"':
      - columnheader
      - 'columnheader "Shipment #"'
      - 'columnheader "Order #"'
      - columnheader "Tracking number"
      - columnheader "Total weight"
      - columnheader "Date shipped"
      - columnheader "Date delivered"
      - columnheader "View"
- table:
  - rowgroup:
    - 'row "Shipment # Order # Tracking number Total weight Date shipped Date delivered View"':
      - columnheader
      - 'columnheader "Shipment #"'
      - 'columnheader "Order #"'
      - columnheader "Tracking number"
      - columnheader "Total weight"
      - columnheader "Date shipped"
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
- button "Add shipment"
- text: Products
- button
- table:
  - rowgroup:
    - row "Picture Product name Price Quantity Discount Total Edit":
      - columnheader "Picture"
      - columnheader "Product name"
      - columnheader "Price"
      - columnheader "Quantity"
      - columnheader "Discount"
      - columnheader "Total"
      - columnheader "Edit"
  - rowgroup:
    - 'row "Apple iCam SKU: APPLE_CAM $1,300.00 excl tax 1 $0.00 excl tax $1,300.00 excl tax Edit Delete"':
      - cell
      - 'cell "Apple iCam SKU: APPLE_CAM"':
        - emphasis:
          - link "Apple iCam":
            - /url: /Admin/Product/Edit/17
        - paragraph:
          - strong: SKU
          - text: ": APPLE_CAM"
      - cell "$1,300.00 excl tax"
      - cell "1"
      - cell "$0.00 excl tax"
      - cell "$1,300.00 excl tax"
      - cell "Edit Delete":
        - button "Edit"
        - button "Delete"
    - 'row "Leica T Mirrorless Digital Camera SKU: LT_MIR_DC $530.00 excl tax 1 $0.00 excl tax $530.00 excl tax Edit Delete"':
      - cell
      - 'cell "Leica T Mirrorless Digital Camera SKU: LT_MIR_DC"':
        - emphasis:
          - link "Leica T Mirrorless Digital Camera":
            - /url: /Admin/Product/Edit/16
        - paragraph:
          - strong: SKU
          - text: ": LT_MIR_DC"
      - cell "$530.00 excl tax"
      - cell "1"
      - cell "$0.00 excl tax"
      - cell "$530.00 excl tax"
      - cell "Edit Delete":
        - button "Edit"
        - button "Delete"
    - 'row "$25 Virtual Gift Card From: Steve Gates <steve_gates@nopCommerce.com> For: Brenda Lindgren <brenda_lindgren@nopCommerce.com> SKU: VG_CR_025 $25.00 excl tax 1 $0.00 excl tax $25.00 excl tax Edit Delete"':
      - cell
      - 'cell "$25 Virtual Gift Card From: Steve Gates <steve_gates@nopCommerce.com> For: Brenda Lindgren <brenda_lindgren@nopCommerce.com> SKU: VG_CR_025"':
        - emphasis:
          - link "$25 Virtual Gift Card":
            - /url: /Admin/Product/Edit/42
        - paragraph: "From: Steve Gates <steve_gates@nopCommerce.com> For: Brenda Lindgren <brenda_lindgren@nopCommerce.com>"
        - paragraph:
          - strong: SKU
          - text: ": VG_CR_025"
      - cell "$25.00 excl tax"
      - cell "1"
      - cell "$0.00 excl tax"
      - cell "$25.00 excl tax"
      - cell "Edit Delete":
        - button "Edit"
        - button "Delete"
    - 'row "Lenovo IdeaCentre SKU: LE_IC_600 $500.00 excl tax -2 $0.00 excl tax $500.00 excl tax Edit Delete"':
      - cell
      - 'cell "Lenovo IdeaCentre SKU: LE_IC_600"':
        - emphasis:
          - link "Lenovo IdeaCentre":
            - /url: /Admin/Product/Edit/3
        - paragraph:
          - strong: SKU
          - text: ": LE_IC_600"
      - cell "$500.00 excl tax"
      - cell "-2"
      - cell "$0.00 excl tax"
      - cell "$500.00 excl tax"
      - cell "Edit Delete":
        - button "Edit"
        - button "Delete"
- button "Add product"
- text: Order notes
- button
- table:
  - rowgroup:
    - row "Created on Note Attached file Display to customer Delete":
      - columnheader "Created on"
      - columnheader "Note"
      - columnheader "Attached file"
      - columnheader "Display to customer"
      - columnheader "Delete"
- table:
  - rowgroup:
    - row "Created on Note Attached file Display to customer Delete":
      - columnheader "Created on"
      - columnheader "Note"
      - columnheader "Attached file"
      - columnheader "Display to customer"
      - columnheader "Delete"
  - rowgroup:
    - row "11/25/2026 6:38:01 AM A new order item has been added No file attached Delete":
      - cell "11/25/2026 6:38:01 AM"
      - cell "A new order item has been added"
      - cell "No file attached"
      - cell
      - cell "Delete":
        - link "Delete":
          - /url: "#"
    - 'row "11/25/2026 6:37:33 AM Order status has been edited. New status: Processing No file attached Delete"':
      - cell "11/25/2026 6:37:33 AM"
      - 'cell "Order status has been edited. New status: Processing"'
      - cell "No file attached"
      - cell
      - cell "Delete":
        - link "Delete":
          - /url: "#"
    - 'row "11/25/2026 6:37:31 AM Order status has been edited. New status: Complete No file attached Delete"':
      - cell "11/25/2026 6:37:31 AM"
      - 'cell "Order status has been edited. New status: Complete"'
      - cell "No file attached"
      - cell
      - cell "Delete":
        - link "Delete":
          - /url: "#"
    - row "11/25/2026 6:37:25 AM Order totals have been edited No file attached Delete":
      - cell "11/25/2026 6:37:25 AM"
      - cell "Order totals have been edited"
      - cell "No file attached"
      - cell
      - cell "Delete":
        - link "Delete":
          - /url: "#"
    - row "11/25/2026 6:37:23 AM Order totals have been edited No file attached Delete":
      - cell "11/25/2026 6:37:23 AM"
      - cell "Order totals have been edited"
      - cell "No file attached"
      - cell
      - cell "Delete":
        - link "Delete":
          - /url: "#"
    - row "11/25/2026 6:37:18 AM Order totals have been edited No file attached Delete":
      - cell "11/25/2026 6:37:18 AM"
      - cell "Order totals have been edited"
      - cell "No file attached"
      - cell
      - cell "Delete":
        - link "Delete":
          - /url: "#"
    - row "11/25/2026 6:37:12 AM Order totals have been edited No file attached Delete":
      - cell "11/25/2026 6:37:12 AM"
      - cell "Order totals have been edited"
      - cell "No file attached"
      - cell
      - cell "Delete":
        - link "Delete":
          - /url: "#"
    - row "11/25/2026 6:37:07 AM Order totals have been edited No file attached Delete":
      - cell "11/25/2026 6:37:07 AM"
      - cell "Order totals have been edited"
      - cell "No file attached"
      - cell
      - cell "Delete":
        - link "Delete":
          - /url: "#"
    - row "11/25/2026 6:37:00 AM Order totals have been edited No file attached Delete":
      - cell "11/25/2026 6:37:00 AM"
      - cell "Order totals have been edited"
      - cell "No file attached"
      - cell
      - cell "Delete":
        - link "Delete":
          - /url: "#"
    - row "10/28/2026 5:15:42 AM Order placed No file attached Delete":
      - cell "10/28/2026 5:15:42 AM"
      - cell "Order placed"
      - cell "No file attached"
      - cell
      - cell "Delete":
        - link "Delete":
          - /url: "#"
    - row "10/28/2026 5:15:42 AM Order paid No file attached Delete":
      - cell "10/28/2026 5:15:42 AM"
      - cell "Order paid"
      - cell "No file attached"
      - cell
      - cell "Delete":
        - link "Delete":
          - /url: "#"
- table
- navigation "pagination":
  - list:
    - listitem: Previous
    - listitem:
      - link "1":
        - /url: "#"
    - listitem: Next
- text: Show
- combobox "Show items":
  - option "7"
  - option "15" [selected]
  - option "20"
  - option "50"
  - option "100"
- text: items
- status: 1-11 of 11 items
- button
- text: Add order note Note
- textbox "Note"
- text: Attached file
- checkbox "(check to upload file)"
- text: (check to upload file) Display to customer
- checkbox "Display to customer"
- button "Add order note"
- text: Powered by
- link "nopCommerce":
  - /url: https://www.nopcommerce.com/?utm_source=admin-panel&utm_medium=footer&utm_campaign=admin-panel
- text: Wednesday, November 25, 2026 6:38 AM nopCommerce version 5.00.0
```

# Test source

```ts
  977  | 
  978  |         // 3. Chọn [Export to Excel (selected)]
  979  |         const [download] = await Promise.all([
  980  |             page.waitForEvent('download', { timeout: 15000 }),
  981  |             page.locator('#exportexcel-selected').click()
  982  |         ]);
  983  | 
  984  |         // Expected: 1. Tệp Excel được tải xuống
  985  |         expect(download.suggestedFilename()).toMatch(/\.xlsx$/i);
  986  |     });
  987  | 
  988  |     // admin_ord_40: Kiểm tra xuất tất cả đơn hàng ra tệp Excel (.xlsx)
  989  |     // Procedure: Step:
  990  |     // 1. Click menu [Export]
  991  |     // 2. Chọn [Export to Excel (all)]
  992  |     // Expected: 1. Tệp Excel được tải xuống và chứa toàn bộ danh sách đơn hàng trong hệ thống được tải xuống thành công.
  993  |     test('admin_ord_40 - Kiểm tra xuất tất cả đơn hàng ra tệp Excel (.xlsx)', async ({ page }) => {
  994  |         await openList(page, 'ord');
  995  |         await grid(page, 'ord');
  996  | 
  997  |         // 1. Click menu [Export]
  998  |         await page.locator('.btn-group:has-text("Export") button.dropdown-toggle').click();
  999  | 
  1000 |         // 2. Chọn [Export to Excel (all)]
  1001 |         const [download] = await Promise.all([
  1002 |             page.waitForEvent('download', { timeout: 15000 }),
  1003 |             page.locator('button[name="exportexcel-all"]').click()
  1004 |         ]);
  1005 | 
  1006 |         // Expected: 1. Tệp Excel được tải xuống thành công
  1007 |         expect(download.suggestedFilename()).toMatch(/\.xlsx$/i);
  1008 |     });
  1009 | 
  1010 |     // admin_ord_41: Kiểm tra in hóa đơn PDF cho các đơn hàng được chọn
  1011 |     // Procedure: Step:
  1012 |     // 1. Đánh dấu chọn 2 đơn hàng trong bảng
  1013 |     // 2. Click nút [Print PDF invoices (selected)]
  1014 |     // Expected: 1. Tệp PDF được tạo và tải xuống,  hiển thị đầy đủ  thông tin người mua, chi tiết sản phẩm, thuế và tổng tiền chính xác.
  1015 |     test('admin_ord_41 - Kiểm tra in hóa đơn PDF cho các đơn hàng được chọn', async ({ page }) => {
  1016 |         await openList(page, 'ord');
  1017 |         await grid(page, 'ord');
  1018 | 
  1019 |         // 1. Đánh dấu chọn 2 đơn hàng trong bảng
  1020 |         const checkboxes = page.locator('#orders-grid tbody input.checkboxGroups');
  1021 |         await checkboxes.nth(0).click();
  1022 |         await checkboxes.nth(1).click();
  1023 | 
  1024 |         // 2. Click nút [Print PDF invoices (selected)]
  1025 |         await page.locator('.btn-group:has-text("Print PDF invoices") button.dropdown-toggle').click();
  1026 | 
  1027 |         const [download] = await Promise.all([
  1028 |             page.waitForEvent('download', { timeout: 15000 }),
  1029 |             page.locator('#pdf-invoice-selected').click()
  1030 |         ]);
  1031 | 
  1032 |         // Expected: 1. Tệp hóa đơn (PDF/ZIP) được tạo và tải xuống
  1033 |         expect(download.suggestedFilename()).toMatch(/\.(pdf|zip)$/i);
  1034 |     });
  1035 | 
  1036 |     // admin_ord_42: Kiểm tra in hóa đơn PDF cho tất cả đơn hàng
  1037 |     // Procedure: Step:
  1038 |     // 1. Click nút [Print PDF invoices (all)]
  1039 |     // Expected: 1. Tệp PDF được tạo và tải xuống,  hiển thị đầy đủ  thông tin người mua, chi tiết sản phẩm, thuế và tổng tiền chính xác.
  1040 |     test('admin_ord_42 - Kiểm tra in hóa đơn PDF cho tất cả đơn hàng', async ({ page }) => {
  1041 |         await openList(page, 'ord');
  1042 |         await grid(page, 'ord');
  1043 | 
  1044 |         // 1. Click nút [Print PDF invoices (all)]
  1045 |         await page.locator('.btn-group:has-text("Print PDF invoices") button.dropdown-toggle').click();
  1046 | 
  1047 |         const [download] = await Promise.all([
  1048 |             page.waitForEvent('download', { timeout: 15000 }),
  1049 |             page.locator('button[name="pdf-invoice-all"]').click()
  1050 |         ]);
  1051 | 
  1052 |         // Expected: 1. Tệp hóa đơn (PDF/ZIP) được tạo và tải xuống
  1053 |         expect(download.suggestedFilename()).toMatch(/\.(pdf|zip)$/i);
  1054 |     });
  1055 | 
  1056 |     // admin_ord_43: Kiểm tra thêm sản phẩm vào đơn hàng với số lượng sản phẩm là số âm
  1057 |     // Procedure: Step:
  1058 |     // 1. Tại tab Products của chi tiết đơn hàng, click [Add product]
  1059 |     // 2. Chọn 1 sản phẩm và nhập Số lượng: '-2'
  1060 |     // 3. Click [Save]
  1061 |     // Expected: 1. Hệ thống báo lỗi validation yêu cầu số lượng phải lớn hơn 0.
  1062 |     // 2. Sản phẩm không được thêm vào đơn hàng.
  1063 |     test('admin_ord_43 - Kiểm tra thêm sản phẩm vào đơn hàng với số lượng sản phẩm là số âm', async ({ page }) => {
  1064 |         // 1. Mở trang chọn chi tiết sản phẩm để thêm vào đơn #1
  1065 |         await page.goto(`${BASE_URL}/Admin/Order/AddProductToOrderDetails?orderId=1&productId=3`);
  1066 |         await handleCloudflare(page);
  1067 | 
  1068 |         // 2. Nhập Số lượng: '-2'
  1069 |         await page.locator('#Quantity').fill('-2');
  1070 | 
  1071 |         // 3. Click nút thêm [Add product] / [Save]
  1072 |         await page.locator('button.btn-primary:has-text("Add product")').click();
  1073 |         await page.waitForTimeout(1000);
  1074 | 
  1075 |         try {
  1076 |             // Expected 1: Hệ thống báo lỗi validation yêu cầu số lượng phải lớn hơn 0 (web không validate nên test sẽ FAIL đúng bản chất lỗi)
> 1077 |             await expect(page.locator('.alert-danger, .field-validation-error, .text-danger, #validation-error')).toBeVisible({ timeout: 5000 });
       |                                                                                                                   ^ Error: expect(locator).toBeVisible() failed
  1078 | 
  1079 |             // Expected 2: Sản phẩm không được thêm vào đơn hàng
  1080 |             await page.goto(`${BASE_URL}/Admin/Order/Edit/1`);
  1081 |             await expect(page.locator('#order-products tr:has-text("Lenovo IdeaCentre")')).toHaveCount(0);
  1082 |         } finally {
  1083 |             // Dọn dẹp nếu hệ thống lỡ lưu sản phẩm số lượng âm vào đơn hàng
  1084 |             await page.goto(`${BASE_URL}/Admin/Order/Edit/1`);
  1085 |             while (await page.locator('#order-products tr:has-text("Lenovo IdeaCentre")').count() > 0) {
  1086 |                 const row = page.locator('#order-products tr:has-text("Lenovo IdeaCentre")').first();
  1087 |                 const delBtn = row.locator('button[name*="btnDeleteOrderItem"]');
  1088 |                 const delId = await delBtn.getAttribute('name');
  1089 |                 await delBtn.click();
  1090 |                 await page.waitForTimeout(500);
  1091 |                 await page.locator(`#${delId}-action-confirmation-submit-button`).click();
  1092 |                 await page.waitForTimeout(1500);
  1093 |             }
  1094 |         }
  1095 |     });
  1096 | 
  1097 |     // admin_ord_44: Kiểm tra thêm sản phẩm vào đơn hàng với giá sản phẩm được thêm là số âm
  1098 |     // Procedure: Step:
  1099 |     // 1. Tại form thêm sản phẩm, nhập Giá sản phẩm: '-100'
  1100 |     // 2. Click [Save]
  1101 |     // Expected: 1. Hệ thống báo lỗi giá sản phẩm không được là số âm.
  1102 |     // 2. Form không được lưu.
  1103 |     test('admin_ord_44 - Kiểm tra thêm sản phẩm vào đơn hàng với giá sản phẩm được thêm là số âm', async ({ page }) => {
  1104 |         // 1. Mở trang chi tiết sản phẩm để thêm
  1105 |         await page.goto(`${BASE_URL}/Admin/Order/AddProductToOrderDetails?orderId=1&productId=3`);
  1106 |         await handleCloudflare(page);
  1107 | 
  1108 |         // Nhập Giá sản phẩm: '-100'
  1109 |         await page.locator('#UnitPriceInclTax').fill('-100');
  1110 | 
  1111 |         // 2. Click [Save] / [Add product]
  1112 |         await page.locator('button.btn-primary:has-text("Add product")').click();
  1113 |         await page.waitForTimeout(1000);
  1114 | 
  1115 |         try {
  1116 |             // Expected 1: Hệ thống báo lỗi giá sản phẩm không được là số âm (thực tế web không kiểm tra nên test sẽ FAIL đúng lỗi hệ thống)
  1117 |             await expect(page.locator('.alert-danger, .field-validation-error, .text-danger, #validation-error')).toBeVisible({ timeout: 5000 });
  1118 | 
  1119 |             // Expected 2: Form không được lưu
  1120 |             await page.goto(`${BASE_URL}/Admin/Order/Edit/1`);
  1121 |             await expect(page.locator('#order-products tr:has-text("Lenovo IdeaCentre")')).toHaveCount(0);
  1122 |         } finally {
  1123 |             // Dọn dẹp
  1124 |             await page.goto(`${BASE_URL}/Admin/Order/Edit/1`);
  1125 |             while (await page.locator('#order-products tr:has-text("Lenovo IdeaCentre")').count() > 0) {
  1126 |                 const row = page.locator('#order-products tr:has-text("Lenovo IdeaCentre")').first();
  1127 |                 const delBtn = row.locator('button[name*="btnDeleteOrderItem"]');
  1128 |                 const delId = await delBtn.getAttribute('name');
  1129 |                 await delBtn.click();
  1130 |                 await page.waitForTimeout(500);
  1131 |                 await page.locator(`#${delId}-action-confirmation-submit-button`).click();
  1132 |                 await page.waitForTimeout(1500);
  1133 |             }
  1134 |         }
  1135 |     });
  1136 | });
```