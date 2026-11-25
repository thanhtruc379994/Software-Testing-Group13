# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-scripts\23130064_TruongCaoDoan_TestScripts\shipments.spec.js >> Admin - Shipments >> admin_ship_16 - Kiểm tra cập nhật Date ready for pickup và Date delivered không hợp lệ (Date ready for pickup > Date delivered)
- Location: test-scripts\23130064_TruongCaoDoan_TestScripts\shipments.spec.js:618:5

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('#btnEditDeliveryDate')
    - locator resolved to <button type="submit" class="btn btn-primary" id="btnEditDeliveryDate" onclick="toggleDeliveryDate(true);return false;">↵                                                …</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="-1" role="dialog" aria-modal="true" class="modal fade show" id="btnSaveReadyForPickupDate-action-confirmation" aria-labelledby="btnSaveReadyForPickupDate-action-confirmation-title">…</div> from <div class="form-group row">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="-1" role="dialog" aria-modal="true" class="modal fade show" id="btnSaveReadyForPickupDate-action-confirmation" aria-labelledby="btnSaveReadyForPickupDate-action-confirmation-title">…</div> from <div class="form-group row">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div tabindex="-1" role="dialog" aria-modal="true" class="modal fade show" id="btnSaveReadyForPickupDate-action-confirmation" aria-labelledby="btnSaveReadyForPickupDate-action-confirmation-title">…</div> from <div class="form-group row">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=f21e2]:
  - navigation [ref=f21e3]:
    - list [ref=f21e4]:
      - listitem [ref=f21e5]:
        - link [ref=f21e6] [cursor=pointer]:
          - /url: "#"
    - link [ref=f21e8] [cursor=pointer]:
      - /url: /Admin
    - list [ref=f21e10]:
      - listitem [ref=f21e11]:
        - generic [ref=f21e12]:
          - combobox [aria-hidden] [ref=f21e13]
          - combobox [ref=f21e16] [cursor=pointer]:
            - textbox "English" [ref=f21e17]
      - listitem [ref=f21e18]:
        - link "John Smith":
          - /url: "#"
      - listitem [ref=f21e19]:
        - link "Logout" [ref=f21e20] [cursor=pointer]:
          - /url: /logout
      - listitem
      - listitem [ref=f21e21]:
        - link "Public store" [ref=f21e22] [cursor=pointer]:
          - /url: /
      - listitem [ref=f21e23]:
        - link [ref=f21e24] [cursor=pointer]:
          - /url: "#"
  - complementary [ref=f21e26]:
    - link [ref=f21e27] [cursor=pointer]:
      - /url: /Admin
      - img "logo.png" [ref=f21e28]
    - generic [ref=f21e29]:
      - textbox "Search" [ref=f21e33]
      - navigation [ref=f21e34]:
        - menu [ref=f21e35]:
          - listitem [ref=f21e36]:
            - link [ref=f21e37] [cursor=pointer]:
              - /url: /Admin
              - paragraph [ref=f21e39]: Dashboard
          - listitem [ref=f21e40]:
            - link [ref=f21e41] [cursor=pointer]:
              - /url: "#"
              - paragraph [ref=f21e43]: Catalog
          - listitem [ref=f21e45]:
            - link [ref=f21e46] [cursor=pointer]:
              - /url: "#"
              - paragraph [ref=f21e48]: Sales
            - list [ref=f21e50]:
              - listitem [ref=f21e51]:
                - link [ref=f21e52] [cursor=pointer]:
                  - /url: /Admin/Order/List
                  - paragraph [ref=f21e54]: Orders
              - listitem [ref=f21e55]:
                - link [ref=f21e56] [cursor=pointer]:
                  - /url: /Admin/Order/ShipmentList
                  - paragraph [ref=f21e58]: Shipments
              - listitem [ref=f21e59]:
                - link [ref=f21e60] [cursor=pointer]:
                  - /url: /Admin/ReturnRequest/List
                  - paragraph [ref=f21e62]: Return requests
              - listitem [ref=f21e63]:
                - link [ref=f21e64] [cursor=pointer]:
                  - /url: /Admin/RecurringPayment/List
                  - paragraph [ref=f21e66]: Recurring payments
              - listitem [ref=f21e67]:
                - link [ref=f21e68] [cursor=pointer]:
                  - /url: /Admin/GiftCard/List
                  - paragraph [ref=f21e70]: Gift cards
              - listitem [ref=f21e71]:
                - link [ref=f21e72] [cursor=pointer]:
                  - /url: /Admin/ShoppingCart/CurrentCarts
                  - paragraph [ref=f21e74]: Shopping carts and wishlists
              - listitem [ref=f21e75]:
                - link [ref=f21e76] [cursor=pointer]:
                  - /url: /Admin/RfqAdmin/AdminRequests
                  - paragraph [ref=f21e78]: Requests for quote
              - listitem [ref=f21e79]:
                - link [ref=f21e80] [cursor=pointer]:
                  - /url: /Admin/RfqAdmin/AdminQuotes
                  - paragraph [ref=f21e82]: Quotes
          - listitem [ref=f21e83]:
            - link [ref=f21e84] [cursor=pointer]:
              - /url: "#"
              - paragraph [ref=f21e86]: Customers
          - listitem [ref=f21e88]:
            - link [ref=f21e89] [cursor=pointer]:
              - /url: "#"
              - paragraph [ref=f21e91]: Promotions
          - listitem [ref=f21e93]:
            - link [ref=f21e94] [cursor=pointer]:
              - /url: "#"
              - paragraph [ref=f21e96]: Content management
          - listitem [ref=f21e98]:
            - link [ref=f21e99] [cursor=pointer]:
              - /url: "#"
              - paragraph [ref=f21e101]: Configuration
          - listitem [ref=f21e103]:
            - link [ref=f21e104] [cursor=pointer]:
              - /url: "#"
              - paragraph [ref=f21e106]: System
          - listitem [ref=f21e108]:
            - link [ref=f21e109] [cursor=pointer]:
              - /url: "#"
              - paragraph [ref=f21e111]: Reports
          - listitem [ref=f21e113]:
            - link [ref=f21e114] [cursor=pointer]:
              - /url: "#"
              - paragraph [ref=f21e116]: Help
  - generic [ref=f21e119]:
    - generic [ref=f21e120]:
      - heading [level=1] [ref=f21e121]:
        - text: View shipment details - 1
        - link "back to order details" [ref=f21e124] [cursor=pointer]:
          - /url: /Admin/Order/Edit/4
      - generic [ref=f21e125]:
        - link "Print packaging slip" [ref=f21e126] [cursor=pointer]:
          - /url: /Admin/Order/PdfPackagingSlip?shipmentId=1
        - generic [ref=f21e128] [cursor=pointer]: Delete
    - generic [ref=f21e131]:
      - generic:
        - list
      - generic [ref=f21e133]:
        - generic [ref=f21e135]:
          - generic [ref=f21e136]:
            - generic [ref=f21e137]: "Order #"
            - link "4 - View" [ref=f21e143] [cursor=pointer]:
              - /url: /Admin/Order/Edit/4
          - generic [ref=f21e144]:
            - generic [ref=f21e145]: Tracking number
            - generic [ref=f21e151]:
              - textbox "Tracking number" [ref=f21e152]
              - button "Set tracking number" [ref=f21e154] [cursor=pointer]
          - generic [ref=f21e155]:
            - generic [ref=f21e156]: Admin comment
            - generic [ref=f21e162]:
              - textbox "Admin comment" [ref=f21e163]
              - button "Set admin comment" [ref=f21e165] [cursor=pointer]
          - generic [ref=f21e166]:
            - generic [ref=f21e167]: Total weight
            - generic [ref=f21e172]: 4.00 [kg(s)]
          - generic [ref=f21e174]:
            - generic [ref=f21e175]: Date ready for pickup
            - generic [ref=f21e181]:
              - generic [ref=f21e182]:
                - textbox [ref=f21e183]: 2026-10-22T00:00
                - text: Date and time should be entered in Coordinated Universal Time (UTC)
              - generic [ref=f21e184]:
                - button "Save" [ref=f21e185] [cursor=pointer]
                - dialog [active] [ref=f21e186]:
                  - generic [ref=f21e187]:
                    - generic [ref=f21e188]:
                      - heading "Are you sure?" [level=4] [ref=f21e189]
                      - button "Close" [ref=f21e190] [cursor=pointer]: ×
                    - generic [ref=f21e191]: Are you sure you want to perform this action?
                    - generic [ref=f21e192]:
                      - button "Yes" [ref=f21e193] [cursor=pointer]
                      - generic [ref=f21e194] [cursor=pointer]: No, cancel
                - button "Cancel" [ref=f21e195] [cursor=pointer]
          - generic [ref=f21e196]:
            - generic [ref=f21e197]: Date delivered
            - generic [ref=f21e203]:
              - generic [ref=f21e204]: 10/22/2026 12:00:00 AM
              - button "Edit" [ref=f21e206] [cursor=pointer]
        - generic [ref=f21e207]:
          - generic [ref=f21e208]: Products shipped
          - table [ref=f21e210]:
            - rowgroup [ref=f21e211]:
              - row [ref=f21e212]:
                - columnheader "Product" [ref=f21e213]
                - columnheader "SKU" [ref=f21e214]
                - columnheader "Warehouse" [ref=f21e215]
                - columnheader "Item weight" [ref=f21e216]
                - columnheader "Item dimensions" [ref=f21e217]
                - columnheader "Qty ready for pickup" [ref=f21e218]
            - rowgroup [ref=f21e219]:
              - row [ref=f21e220]:
                - cell [ref=f21e221]:
                  - emphasis [ref=f21e223]:
                    - link "Pride and Prejudice" [ref=f21e224] [cursor=pointer]:
                      - /url: /Admin/Product/Edit/38
                - cell "PRIDE_PRJ" [ref=f21e225]
                - cell [ref=f21e227]
                - cell [ref=f21e228]
                - cell "2.00 x 2.00 x 2.00 [meter(s)]" [ref=f21e229]
                - cell "1" [ref=f21e230]
              - row [ref=f21e231]:
                - cell [ref=f21e232]:
                  - emphasis [ref=f21e234]:
                    - link "First Prize Pies" [ref=f21e235] [cursor=pointer]:
                      - /url: /Admin/Product/Edit/37
                - cell "FIRST_PRP" [ref=f21e236]
                - cell [ref=f21e238]
                - cell [ref=f21e239]
                - cell "2.00 x 2.00 x 2.00 [meter(s)]" [ref=f21e240]
                - cell "1" [ref=f21e241]
  - generic [ref=f21e245]:
    - generic [ref=f21e246]:
      - text: Powered by
      - link "nopCommerce" [ref=f21e247] [cursor=pointer]:
        - /url: https://www.nopcommerce.com/?utm_source=admin-panel&utm_medium=footer&utm_campaign=admin-panel
    - generic [ref=f21e248]: Wednesday, November 25, 2026 6:39 AM
    - generic [ref=f21e249]: nopCommerce version 5.00.0
```

# Test source

```ts
  539 |             const setShippedBtn = page.locator('#setasshipped');
  540 |             if (await setShippedBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  541 |                 await setShippedBtn.click();
  542 |                 const confirmShipped = page.locator('#setasshipped-action-confirmation-submit-button');
  543 |                 if (await confirmShipped.isVisible({ timeout: 2000 }).catch(() => false)) {
  544 |                     await confirmShipped.click();
  545 |                 }
  546 |                 await page.waitForTimeout(1000);
  547 |             }
  548 |             const editShippedBtn = page.locator('#btnEditShippedDate');
  549 |             if (await editShippedBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  550 |                 await editShippedBtn.click();
  551 |                 await page.waitForTimeout(500);
  552 |             }
  553 |             const shippedInput = page.locator('#ShippedDateUtc, input[name*="ShippedDate"]');
  554 |             if (await shippedInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  555 |                 await fill(page, shippedInput, '2026-10-20');
  556 |                 const saveShippedBtn = page.locator('#btnSaveShippedDate');
  557 |                 if (await saveShippedBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  558 |                     await saveShippedBtn.click();
  559 |                     const confirmShipped = page.locator('#btnSaveShippedDate-action-confirmation-submit-button');
  560 |                     if (await confirmShipped.isVisible({ timeout: 2000 }).catch(() => false)) {
  561 |                         await confirmShipped.click();
  562 |                     }
  563 |                     await page.waitForTimeout(1000);
  564 |                 }
  565 |             }
  566 |         }
  567 | 
  568 |         // Đảm bảo trạng thái Delivered đã được kích hoạt để có nút Edit
  569 |         const setDeliveredBtn = page.locator('#setasdelivered, button[name="setasdelivered"]');
  570 |         if (await setDeliveredBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  571 |             await setDeliveredBtn.click();
  572 |             const confirmDelivered = page.locator('#setasdelivered-action-confirmation-submit-button');
  573 |             if (await confirmDelivered.isVisible({ timeout: 2000 }).catch(() => false)) {
  574 |                 await confirmDelivered.click();
  575 |             }
  576 |             await page.waitForTimeout(1000);
  577 |         }
  578 | 
  579 |         // 2. Nhập Date delivered = '2026-10-22'
  580 |         const editDeliveryBtn = page.locator('#btnEditDeliveryDate');
  581 |         if (await editDeliveryBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  582 |             await editDeliveryBtn.click();
  583 |             await page.waitForTimeout(500);
  584 |         }
  585 |         const deliveryInput = page.locator('#DeliveryDateUtc, input[name*="DeliveryDate"]');
  586 |         if (await deliveryInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  587 |             await fill(page, deliveryInput, '2026-10-22');
  588 |             const saveDeliveryBtn = page.locator('#btnSaveDeliveryDate');
  589 |             if (await saveDeliveryBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  590 |                 await saveDeliveryBtn.click();
  591 |                 const confirmDelivery = page.locator('#btnSaveDeliveryDate-action-confirmation-submit-button');
  592 |                 if (await confirmDelivery.isVisible({ timeout: 2000 }).catch(() => false)) {
  593 |                     await confirmDelivery.click();
  594 |                 }
  595 |                 await page.waitForTimeout(1000);
  596 |             }
  597 |         }
  598 | 
  599 |         // Expected: 1. Hiển thị thông báo hoặc dữ liệu hiển thị Date ready for pickup = '2026-10-20' và Date delivered = '2026-10-22'
  600 |         if (await page.locator('.alert-success').first().isVisible({ timeout: 2000 }).catch(() => false)) {
  601 |             await expect(page.locator('.alert-success').first()).toContainText(/Shipment has been updated successfully|updated/i);
  602 |         }
  603 |         if (hasPickupDate) {
  604 |             await expect(page.locator('#lblReadyForPickupDate')).toContainText(/10\/20\/2026|2026-10-20/);
  605 |         } else {
  606 |             await expect(page.locator('#lblShippedDate')).toContainText(/10\/20\/2026|2026-10-20/);
  607 |         }
  608 |         await expect(page.locator('#lblDeliveryDate')).toContainText(/10\/22\/2026|2026-10-22/);
  609 |     });
  610 | 
  611 |     // admin_ship_16: Kiểm tra cập nhật Date ready for pickup và Date delivered không hợp lệ (Date ready for pickup > Date delivered)
  612 |     // Procedure: Step:
  613 |     // 1. Tại chuyến hàng, nhập Date ready for pickup = '2026-10-22'
  614 |     // 2. Nhập Date delivered = '2026-10-20'
  615 |     // 3. Click nút [Save]
  616 |     // Expected: 1. Hệ thống hiển thị cảnh báo lỗi logic: Ngày sẵn sàng lấy hàng không thể lớn hơn ngày giao hàng.
  617 |     // 2. Dữ liệu hiển thị không được cập nhật  Date ready for pickup và Date delivered.
  618 |     test('admin_ship_16 - Kiểm tra cập nhật Date ready for pickup và Date delivered không hợp lệ (Date ready for pickup > Date delivered)', async ({ page }) => {
  619 |         await openList(page, 'ship');
  620 |         await firstDetail(page, 'ship');
  621 | 
  622 |         // 1. Tại chuyến hàng, nhập Date ready for pickup = '2026-10-22'
  623 |         const editPickupBtn = page.locator('#btnEditReadyForPickupDate');
  624 |         if (await editPickupBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
  625 |             await editPickupBtn.click();
  626 |         }
  627 |         const pickupInput = page.locator('#ReadyForPickupDateUtc, input[name*="ReadyForPickup"]');
  628 |         if (await pickupInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  629 |             await fill(page, pickupInput, '2026-10-22');
  630 |             const savePickupBtn = page.locator('#btnSaveReadyForPickupDate');
  631 |             if (await savePickupBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  632 |                 await savePickupBtn.click();
  633 |             }
  634 |         }
  635 | 
  636 |         // 2. Nhập Date delivered = '2026-10-20'
  637 |         const editDeliveryBtn = page.locator('#btnEditDeliveryDate');
  638 |         if (await editDeliveryBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
> 639 |             await editDeliveryBtn.click();
      |                                   ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  640 |         }
  641 |         const deliveryInput = page.locator('#DeliveryDateUtc, input[name*="DeliveryDate"]');
  642 |         if (await deliveryInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  643 |             await fill(page, deliveryInput, '2026-10-20');
  644 |             const saveDeliveryBtn = page.locator('#btnSaveDeliveryDate');
  645 |             if (await saveDeliveryBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  646 |                 await saveDeliveryBtn.click();
  647 |             }
  648 |         }
  649 | 
  650 |         // 3. Click nút [Save]
  651 |         const mainSave = page.locator('button[name="save"], #save-shipment, button.btn-primary:has-text("Save")').first();
  652 |         if (await mainSave.isVisible({ timeout: 1500 }).catch(() => false)) {
  653 |             await mainSave.click();
  654 |         }
  655 | 
  656 |         // Expected: 1. Hệ thống hiển thị cảnh báo lỗi logic: Ngày sẵn sàng lấy hàng không thể lớn hơn ngày giao hàng
  657 |         await expect(page.locator('.alert-danger, .alert-warning, .field-validation-error, .text-danger, #validation-error')).toBeVisible({ timeout: 5000 });
  658 |     });
  659 | 
  660 |     // admin_ship_17: Kiểm tra cập nhật thêm ghi chú nội bộ cho chuyến giao hàng
  661 |     // Procedure: Step:
  662 |     // 1. Nhập ghi chú vào ô 'Admin comment': 'Khách hẹn giao sau 18h'
  663 |     // 2. Click nút [Save]
  664 |     // Expected: 1. Ghi chú được lưu lại trong chi tiết chuyến hàng.
  665 |     test('admin_ship_17 - Kiểm tra cập nhật thêm ghi chú nội bộ cho chuyến giao hàng', async ({ page }) => {
  666 |         await openList(page, 'ship');
  667 |         await firstDetail(page, 'ship');
  668 | 
  669 |         const comment = 'Khách hẹn giao sau 18h';
  670 | 
  671 |         // 1. Nhập ghi chú vào ô 'Admin comment': 'Khách hẹn giao sau 18h'
  672 |         const commentInput = page.locator('#AdminComment');
  673 |         await expect(commentInput).toBeVisible();
  674 |         await commentInput.fill(comment);
  675 | 
  676 |         // 2. Click nút [Save]
  677 |         const saveBtn = page.locator('button[name="setadmincomment"], button[name="save"], button.btn-primary:has-text("Save")').first();
  678 |         await saveBtn.click();
  679 |         await page.waitForTimeout(1500);
  680 | 
  681 |         // Expected: 1. Ghi chú được lưu lại trong chi tiết chuyến hàng
  682 |         const commentEl = page.locator('#AdminComment');
  683 |         if (await commentEl.isVisible().catch(() => false)) {
  684 |             await expect(commentEl).toHaveValue(comment);
  685 |         } else {
  686 |             await expect(page.locator('body')).toContainText(comment);
  687 |         }
  688 |     });
  689 | 
  690 |     // admin_ship_18: Kiểm tra in phiếu đóng gói giao hàng PDF (Print packaging slip)
  691 |     // Procedure: Step:
  692 |     // 1. Tại trang chi tiết chuyến hàng, click nút [Print packaging slip all]
  693 |     // Expected: 1. Tệp PDF phiếu đóng gói được tải xuống hiển thị đầy đủ thông tin địa chỉ giao, danh sách hàng và số lượng.
  694 |     test('admin_ship_18 - Kiểm tra in phiếu đóng gói giao hàng PDF (Print packaging slip)', async ({ page }) => {
  695 |         await openList(page, 'ship');
  696 |         await firstDetail(page, 'ship');
  697 | 
  698 |         // 1. Tại trang chi tiết chuyến hàng, click nút [Print packaging slip]
  699 |         const printBtn = page.locator('button[name="pdf-packaging-slip"], a.btn:has-text("Print packaging slip"), button:has-text("Print packaging slip"), #pdf-packaging-slip').first();
  700 |         await expect(printBtn).toBeVisible();
  701 | 
  702 |         const [download] = await Promise.all([
  703 |             page.waitForEvent('download', { timeout: 15000 }),
  704 |             printBtn.click()
  705 |         ]);
  706 | 
  707 |         // Expected: 1. Tệp PDF phiếu đóng gói được tải xuống
  708 |         expect(download.suggestedFilename()).toMatch(/\.(pdf|zip)$/i);
  709 |     });
  710 | 
  711 |     // admin_ship_19: Kiểm tra in phiếu đóng gói PDF cho các chuyến hàng được chọn trong danh sách
  712 |     // Procedure: Step:
  713 |     // 1. Tại bảng danh sách Shipments, tick chọn 2 chuyến hàng
  714 |     // 2. Click nút [Print packaging slips (selected)]
  715 |     // Expected: 1. Tệp PDF tổng hợp các phiếu đóng gói của 2 chuyến hàng đã chọn được tải xuống thành công.
  716 |     test('admin_ship_19 - Kiểm tra in phiếu đóng gói PDF cho các chuyến hàng được chọn trong danh sách', async ({ page }) => {
  717 |         await openList(page, 'ship');
  718 |         await grid(page, 'ship');
  719 | 
  720 |         // 1. Tại bảng danh sách Shipments, tick chọn 2 chuyến hàng
  721 |         const checkboxes = page.locator('#shipments-grid tbody input.checkboxGroups');
  722 |         const count = await checkboxes.count();
  723 |         if (count >= 2) {
  724 |             await checkboxes.nth(0).click();
  725 |             await checkboxes.nth(1).click();
  726 |         } else if (count === 1) {
  727 |             await checkboxes.nth(0).click();
  728 |         }
  729 | 
  730 |         // 2. Mở dropdown Print packaging slips và click [Print packaging slips (selected)]
  731 |         const dropdownToggle = page.locator('.btn-group:has(#exportpackagingslips-selected) button.dropdown-toggle');
  732 |         if (await dropdownToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
  733 |             await dropdownToggle.click();
  734 |             await page.waitForTimeout(500);
  735 |         }
  736 | 
  737 |         const printSelectedBtn = page.locator('#exportpackagingslips-selected, button[name="pdf-packaging-slip-selected"]').first();
  738 |         await expect(printSelectedBtn).toBeVisible({ timeout: 5000 });
  739 | 
```