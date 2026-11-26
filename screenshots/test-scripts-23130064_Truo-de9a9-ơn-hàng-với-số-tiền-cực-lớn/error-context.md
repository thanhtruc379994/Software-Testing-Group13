# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-scripts\23130064_TruongCaoDoan_TestScripts\orders.spec.js >> Admin - Orders >> admin_ord_31 - Kiểm tra thay đổi tổng tiền của đơn hàng với số tiền cực lớn
- Location: test-scripts\23130064_TruongCaoDoan_TestScripts\orders.spec.js:620:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.alert-danger, .alert-warning, .field-validation-error, .text-danger, #validation-error')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.alert-danger, .alert-warning, .field-validation-error, .text-danger, #validation-error') with timeout 5000ms
  - waiting for locator('.alert-danger, .alert-warning, .field-validation-error, .text-danger, #validation-error')

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
- text: Order tax $0.00 Order total $999,999,999,999.00 Profit $999,999,999,999.00
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
- status: 1-5 of 5 items
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
- text: Wednesday, November 25, 2026 6:37 AM nopCommerce version 5.00.0
```

# Test source

```ts
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
  565 |     // 2. Giá trị tổng tiền cũ được giữ nguyên.
  566 |     test('admin_ord_30 - Kiểm tra thay đổi tổng tiền đơn hàng với số âm', async ({ page }) => {
  567 |         await page.goto(`${BASE_URL}/Admin/Order/Edit/1`);
  568 |         await handleCloudflare(page);
  569 | 
  570 |         // Lưu lại tổng tiền ban đầu trước khi sửa
  571 |         const totalsCard = page.locator('.card.card-default:has(#btnEditOrderTotals)');
  572 |         await expect(totalsCard).toBeVisible();
  573 |         const initialCardText = await totalsCard.innerText();
  574 |         const initialTotalMatch = initialCardText.match(/Order total\s*([\$\d\.,\-]+)/i);
  575 |         const originalTotal = initialTotalMatch ? initialTotalMatch[1] : '';
  576 | 
  577 |         // 1. Tại panel 'Order totals', click nút [Edit order total]
  578 |         await page.locator('#btnEditOrderTotals').click();
  579 |         await expect(page.locator('#OrderTotalValue')).toBeVisible();
  580 | 
  581 |         // 2. Nhập số tiền âm: Order total= '-50'
  582 |         await page.locator('#OrderTotalValue').fill('-50');
  583 | 
  584 |         // 3. Click nút [Save]
  585 |         await page.locator('#btnSaveOrderTotals').click();
  586 |         const confirmYes = page.locator('#btnSaveOrderTotals-action-confirmation-submit-button');
  587 |         if (await confirmYes.isVisible({ timeout: 2000 }).catch(() => false)) {
  588 |             await confirmYes.click();
  589 |         }
  590 | 
  591 |         try {
  592 |             // Expected 1: Hệ thống báo lỗi validation không cho phép tổng tiền là số âm (thực tế web không bắt lỗi nên test sẽ FAIL đúng bản chất bug)
  593 |             await expect(page.locator('.alert-danger, .field-validation-error, .text-danger, #validation-error')).toBeVisible({ timeout: 5000 });
  594 | 
  595 |             // Expected 2: Giá trị tổng tiền cũ được giữ nguyên
  596 |             if (originalTotal) {
  597 |                 await expect(totalsCard).toContainText(originalTotal);
  598 |             }
  599 |         } finally {
  600 |             // Khôi phục lại dữ liệu ban đầu để không làm hỏng đơn hàng cho các ca kiểm thử khác
  601 |             if (await page.locator('#btnEditOrderTotals').isVisible({ timeout: 3000 }).catch(() => false)) {
  602 |                 await page.locator('#btnEditOrderTotals').click();
  603 |                 await page.locator('#OrderTotalValue').fill('1855.0000');
  604 |                 await page.locator('#btnSaveOrderTotals').click();
  605 |                 const confirmBtn = page.locator('#btnSaveOrderTotals-action-confirmation-submit-button');
  606 |                 if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  607 |                     await confirmBtn.click();
  608 |                 }
  609 |             }
  610 |         }
  611 |     });
  612 | 
  613 |     // admin_ord_31: Kiểm tra thay đổi tổng tiền của đơn hàng với số tiền cực lớn
  614 |     // Procedure: Step:
  615 |     // 1. Tại panel 'Order totals', click nút [Edit order total]
  616 |     // 2. Nhập số tiền cực lớn: '999999999999'
  617 |     // 3. Click nút [Save]
  618 |     // Expected: 1. Hệ thống cảnh báo giới hạn độ dài hoặc định dạng tiền tệ vượt quá ngưỡng cho phép.
  619 |     // 2. Giá trị tổng tiền cũ được giữ nguyên.
  620 |     test('admin_ord_31 - Kiểm tra thay đổi tổng tiền của đơn hàng với số tiền cực lớn', async ({ page }) => {
  621 |         await page.goto(`${BASE_URL}/Admin/Order/Edit/1`);
  622 |         await handleCloudflare(page);
  623 | 
  624 |         // Lưu lại tổng tiền ban đầu trước khi sửa
  625 |         const totalsCard = page.locator('.card.card-default:has(#btnEditOrderTotals)');
  626 |         await expect(totalsCard).toBeVisible();
  627 |         const initialCardText = await totalsCard.innerText();
  628 |         const initialTotalMatch = initialCardText.match(/Order total\s*([\$\d\.,\-]+)/i);
  629 |         const originalTotal = initialTotalMatch ? initialTotalMatch[1] : '';
  630 | 
  631 |         // 1. Tại panel 'Order totals', click nút [Edit order total]
  632 |         await page.locator('#btnEditOrderTotals').click();
  633 |         await expect(page.locator('#OrderTotalValue')).toBeVisible();
  634 | 
  635 |         // 2. Nhập số tiền cực lớn: '999999999999'
  636 |         await page.locator('#OrderTotalValue').fill('999999999999');
  637 | 
  638 |         // 3. Click nút [Save]
  639 |         await page.locator('#btnSaveOrderTotals').click();
  640 |         const confirmYes = page.locator('#btnSaveOrderTotals-action-confirmation-submit-button');
  641 |         if (await confirmYes.isVisible({ timeout: 2000 }).catch(() => false)) {
  642 |             await confirmYes.click();
  643 |         }
  644 | 
  645 |         try {
  646 |             // Expected 1: Hệ thống cảnh báo giới hạn độ dài hoặc định dạng tiền tệ vượt quá ngưỡng cho phép
> 647 |             await expect(page.locator('.alert-danger, .alert-warning, .field-validation-error, .text-danger, #validation-error')).toBeVisible({ timeout: 5000 });
      |                                                                                                                                   ^ Error: expect(locator).toBeVisible() failed
  648 | 
  649 |             // Expected 2: Giá trị tổng tiền cũ được giữ nguyên
  650 |             if (originalTotal) {
  651 |                 await expect(totalsCard).toContainText(originalTotal);
  652 |             }
  653 |         } finally {
  654 |             // Khôi phục lại dữ liệu ban đầu
  655 |             if (await page.locator('#btnEditOrderTotals').isVisible({ timeout: 3000 }).catch(() => false)) {
  656 |                 await page.locator('#btnEditOrderTotals').click();
  657 |                 await page.locator('#OrderTotalValue').fill('1855.0000');
  658 |                 await page.locator('#btnSaveOrderTotals').click();
  659 |                 const confirmBtn = page.locator('#btnSaveOrderTotals-action-confirmation-submit-button');
  660 |                 if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  661 |                     await confirmBtn.click();
  662 |                 }
  663 |             }
  664 |         }
  665 |     });
  666 | 
  667 |     // admin_ord_32: Kiểm tra thay đổi tổng tiền của đơn hàng với số tiền thực tế
  668 |     // Procedure: Step:
  669 |     // 1. Tại panel 'Order totals', click nút [Edit order total]
  670 |     // 2. Nhập giá trị tổng tiền mới: '1500.00'
  671 |     // 3. Click nút [Save]
  672 |     // Expected: 1. Hiển thị thông báo lưu thành công.
  673 |     // 2. Tổng tiền đơn hàng cập nhật thành $1,500.00 chính xác.
  674 |     test('admin_ord_32 - Kiểm tra thay đổi tổng tiền của đơn hàng với số tiền thực tế', async ({ page }) => {
  675 |         await page.goto(`${BASE_URL}/Admin/Order/Edit/1`);
  676 |         await handleCloudflare(page);
  677 | 
  678 |         // 1. Tại panel 'Order totals', click nút [Edit order total]
  679 |         await page.locator('#btnEditOrderTotals').click();
  680 |         await expect(page.locator('#OrderTotalValue')).toBeVisible();
  681 | 
  682 |         // 2. Nhập giá trị tổng tiền mới: '1500.00'
  683 |         await page.locator('#OrderTotalValue').fill('1500.00');
  684 | 
  685 |         // 3. Click nút [Save]
  686 |         await page.locator('#btnSaveOrderTotals').click();
  687 |         const confirmYes = page.locator('#btnSaveOrderTotals-action-confirmation-submit-button');
  688 |         if (await confirmYes.isVisible({ timeout: 2000 }).catch(() => false)) {
  689 |             await confirmYes.click();
  690 |         }
  691 | 
  692 |         try {
  693 |             // Expected 2: Tổng tiền đơn hàng cập nhật thành $1,500.00 chính xác
  694 |             const totalsCard = page.locator('.card.card-default:has(#btnEditOrderTotals)');
  695 |             await expect(totalsCard).toContainText('$1,500.00');
  696 |         } finally {
  697 |             // Khôi phục lại dữ liệu ban đầu
  698 |             if (await page.locator('#btnEditOrderTotals').isVisible({ timeout: 3000 }).catch(() => false)) {
  699 |                 await page.locator('#btnEditOrderTotals').click();
  700 |                 await page.locator('#OrderTotalValue').fill('1855.0000');
  701 |                 await page.locator('#btnSaveOrderTotals').click();
  702 |                 const confirmBtn = page.locator('#btnSaveOrderTotals-action-confirmation-submit-button');
  703 |                 if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  704 |                     await confirmBtn.click();
  705 |                 }
  706 |             }
  707 |         }
  708 |     });
  709 | 
  710 |     // admin_ord_33: Kiểm tra cập nhật trạng thái đơn hàng từ 'Pending' sang 'Processing'
  711 |     // Procedure: Step:
  712 |     // 1. Tại trang chi tiết đơn hàng đang ở 'Pending'
  713 |     // 2. Click nút [Change status]
  714 |     // 3. Chọn trạng thái mới = 'Processing'
  715 |     // 4. Click nút [Save]
  716 |     // Expected: 1. HIển thị list trạng thái có thể thay đổi gồm "Processing"
  717 |     // 2. Thông tin trạng thái đơn hiển thị 'Processing'.
  718 |     test('admin_ord_33 - Kiểm tra cập nhật trạng thái đơn hàng từ ’Pending’ sang ’Processing’', async ({ page }) => {
  719 |         // Mở đơn hàng đang có trạng thái Pending (#2)
  720 |         await page.goto(`${BASE_URL}/Admin/Order/Edit/2`);
  721 |         await handleCloudflare(page);
  722 | 
  723 |         // 2. Click nút [Change status]
  724 |         await page.locator('#btnChangeOrderStatus').click();
  725 |         await expect(page.locator('#OrderStatusId')).toBeVisible();
  726 | 
  727 |         // Expected 1: HIển thị list trạng thái có thể thay đổi gồm "Processing"
  728 |         await expect(page.locator('#OrderStatusId option')).toContainText(['Processing']);
  729 | 
  730 |         // 3. Chọn trạng thái mới = 'Processing'
  731 |         await page.locator('#OrderStatusId').selectOption({ label: 'Processing' });
  732 | 
  733 |         // 4. Click nút [Save]
  734 |         await page.locator('#btnSaveOrderStatus').click();
  735 |         const confirmYes = page.locator('#btnSaveOrderStatus-action-confirmation-submit-button');
  736 |         if (await confirmYes.isVisible({ timeout: 2000 }).catch(() => false)) {
  737 |             await confirmYes.click();
  738 |         }
  739 | 
  740 |         try {
  741 |             // Expected 2: Thông tin trạng thái đơn hiển thị 'Processing'
  742 |             const infoCard = page.locator('#order-info');
  743 |             await expect(infoCard).toContainText('Processing');
  744 |         } finally {
  745 |             // Khôi phục lại trạng thái Pending ban đầu
  746 |             if (await page.locator('#btnChangeOrderStatus').isVisible({ timeout: 3000 }).catch(() => false)) {
  747 |                 await page.locator('#btnChangeOrderStatus').click();
```