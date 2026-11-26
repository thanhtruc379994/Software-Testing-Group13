# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-scripts\23130075_NguyenHuuDuy_TestScripts\admin_manufacturer.spec.js >> Admin - Manufacturers >> Admin - Add Manufacturer >> should upload valid manufacturer picture [Add_manufacturer_picture_valid_19]
- Location: test-scripts\23130075_NguyenHuuDuy_TestScripts\admin_manufacturer.spec.js:557:13

# Error details

```
Error: expect(locator).not.toHaveValue(expected) failed

Locator:  locator('#PictureId')
Expected: not "0"
Received: "0"
Timeout:  30000ms

Call log:
  - Expect "not toHaveValue" locator('#PictureId') with timeout 30000ms
  - waiting for locator('#PictureId')
    62 × locator resolved to <input value="0" type="hidden" id="PictureId" data-val="true" name="PictureId" data-val-required="The PictureId field is required."/>
       - unexpected value "0"

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
        - list:
          - listitem:
            - link "Products":
              - /url: /Admin/Product/List
              - paragraph: Products
          - listitem:
            - link "Categories":
              - /url: /Admin/Category/List
              - paragraph: Categories
          - listitem:
            - link "Manufacturers":
              - /url: /Admin/Manufacturer/List
              - paragraph: Manufacturers
          - listitem:
            - link "Product reviews":
              - /url: /Admin/ProductReview/List
              - paragraph: Product reviews
          - listitem:
            - link "Product tags":
              - /url: /Admin/Product/ProductTags
              - paragraph: Product tags
          - listitem:
            - link "Attributes":
              - /url: "#"
              - paragraph: Attributes
          - listitem:
            - link "Price lists":
              - /url: /Admin/PriceList/List
              - paragraph: Price lists
      - listitem:
        - link "Sales":
          - /url: "#"
          - paragraph: Sales
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
- heading "Add a new manufacturer back to manufacturer list" [level=1]:
  - text: Add a new manufacturer
  - link "back to manufacturer list":
    - /url: /Admin/Manufacturer/List
- button "Save"
- button "Save and Continue Edit"
- list
- text: Advanced Basic Manufacturer info
- button
- tablist:
  - listitem:
    - tab "Standard"
  - listitem:
    - tab "English"
  - listitem:
    - tab "Tiếng Việt"
- tabpanel:
  - text: Name
  - textbox "Name"
  - text: "* Description"
  - toolbar:
    - button "Undo (CTRL+Z)": 
    - button "Redo (CTRL+Y)": 
    - button "Style": 
    - button "Bold (CTRL+B)": 
    - button "Italic (CTRL+I)": 
    - button "Underline (CTRL+U)": 
    - button "Remove Font Style (CTRL+\\)": 
    - button "Font Family": Source Sans Pro
    - button "Font Size": "16"
    - button "Recent Color": 
    - button "More Color"
    - button "Unordered list (CTRL+SHIFT+NUM7)": 
    - button "Ordered list (CTRL+SHIFT+NUM8)": 
    - button "Paragraph": 
    - button "Table": 
    - button "Link (CTRL+K)": 
    - button "Insert image"
    - button "Video": 
    - button "Insert Horizontal Rule (CTRL+ENTER)": 
    - button "Full Screen": 
    - button "Code View": 
    - button "Help": 
  - textbox:
    - paragraph
  - status
  - status
- text: Picture
- button "Drop files here to upload / Browse"
- text: Drop files here to upload / Browse
- list
- alert
- img
- text: Display
- button
- text: GPSR
- button
- text: Mappings
- button
- text: SEO
- button
- text: Products
- button
- text: Powered by
- link "nopCommerce":
  - /url: https://www.nopcommerce.com/?utm_source=admin-panel&utm_medium=footer&utm_campaign=admin-panel
- text: Wednesday, November 25, 2026 8:36 AM nopCommerce version 5.00.0
```

# Test source

```ts
  468 |                 if (await editor.isVisible({timeout: 3000}).catch(() => false)) {
  469 |                     await expect(editor).toContainText('Mô tả hãng sản xuất');
  470 |                 } else {
  471 |                     await expect(page.locator('#Description')).toHaveValue(/Mô tả hãng sản xuất/);
  472 |                 }
  473 |             });
  474 |         });
  475 | 
  476 |         test('should save manufacturer with empty description [Add_manufacturer_empty_description_14]', async ({ page }) => {
  477 |             await withMf(page, async (ctx) => {
  478 |                 const name = uniq('NoDesc');
  479 |                 ctx.track(name);
  480 |                 await openCreate(page);
  481 |                 await page.locator('#Name').fill(name);
  482 |                 await save(page);
  483 |                 await expect(page).toHaveURL(/\/Admin\/Manufacturer\/List/i, {timeout: 30000});
  484 |                 await expectSaved(page);
  485 |             });
  486 |         });
  487 | 
  488 |         test('should safely handle HTML script tags in manufacturer description [Add_manufacturer_html_description_15]', async ({ page }) => {
  489 |             await withMf(page, async (ctx) => {
  490 |                 const name = uniq('DescHtml');
  491 |                 ctx.track(name);
  492 |                 await openCreate(page);
  493 |                 await page.locator('#Name').fill(name);
  494 |                 await setDescription(page, '<script>alert(1)</script>');
  495 |                 await saveContinue(page);
  496 |                 await expectEditPage(page);
  497 |                 await page.waitForLoadState('networkidle').catch(() => {});
  498 |                 expect(xssExecuted()).toBeFalsy();
  499 |                 await expectNoServerError(page);
  500 |             });
  501 |         });
  502 | 
  503 |         test('should save localized manufacturer names for English and Vietnamese [Add_manufacturer_localized_names_16]', async ({ page }) => {
  504 |             await withMf(page, async (ctx) => {
  505 |                 const name = uniq('Locale');
  506 |                 ctx.track(name);
  507 |                 await openCreate(page);
  508 |                 await page.locator('#Name').fill(name);
  509 |                 await nameTab(page, '1').click();
  510 |                 await page.locator('#Locales_0__Name').fill('AutoMF English');
  511 |                 await nameTab(page, '2').click();
  512 |                 await page.locator('#Locales_1__Name').fill('Hãng thử nghiệm');
  513 |                 await saveContinue(page);
  514 |                 await expectEditPage(page);
  515 |                 await expectSaved(page);
  516 | 
  517 |                 await nameTab(page, '1').click();
  518 |                 await expect(page.locator('#Locales_0__Name')).toHaveValue('AutoMF English');
  519 |                 await nameTab(page, '2').click();
  520 |                 await expect(page.locator('#Locales_1__Name')).toHaveValue('Hãng thử nghiệm');
  521 |             });
  522 |         });
  523 | 
  524 |         test('should preserve entered data when switching between localized tabs [Add_manufacturer_localized_tab_switch_17]', async ({ page }) => {
  525 |             await openCreate(page);
  526 |             await page.locator('#Name').fill('TabKeep');
  527 | 
  528 |             await nameTab(page, '1').click();
  529 |             await expect(page.locator('#Locales_0__Name')).toBeVisible();
  530 |             await expect(page.locator('#Name')).toBeHidden();
  531 |             await expect(page.locator('#Locales_1__Name')).toBeHidden();
  532 | 
  533 |             await nameTab(page, '2').click();
  534 |             await expect(page.locator('#Locales_1__Name')).toBeVisible();
  535 |             await expect(page.locator('#Locales_0__Name')).toBeHidden();
  536 | 
  537 |             await nameTab(page, 'standard').click();
  538 |             await expect(page.locator('#Name')).toBeVisible();
  539 |             await expect(page.locator('#Name')).toHaveValue('TabKeep');
  540 |         });
  541 | 
  542 |         test('should validate length boundary on localized manufacturer name [Add_manufacturer_localized_over_length_18]', async ({ page }) => {
  543 |             await withMf(page, async (ctx) => {
  544 |                 const name = uniq('LocaleLong');
  545 |                 ctx.track(name);
  546 |                 await openCreate(page);
  547 |                 await page.locator('#Name').fill(name);
  548 |                 await nameTab(page, '1').click();
  549 |                 await page.locator('#Locales_0__Name').fill('c'.repeat(401));
  550 |                 await save(page);
  551 |                 // Xử lý có kiểm soát: báo lỗi hoặc lưu theo quy định, không lỗi hệ thống
  552 |                 await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger, .input-validation-error').first()).toBeVisible({timeout: 30000});
  553 |                 await expectNoServerError(page);
  554 |             });
  555 |         });
  556 | 
  557 |         test('should upload valid manufacturer picture [Add_manufacturer_picture_valid_19]', async ({ page }) => {
  558 |             await withMf(page, async (ctx) => {
  559 |                 const name = uniq('Pic');
  560 |                 ctx.track(name);
  561 |                 await openCreate(page);
  562 |                 await ensureAdvanced(page);
  563 |                 const fileInput = page.locator('input[type="file"]').first();
  564 |                 await fileInput.setInputFiles({
  565 |                     name: 'logo.png', mimeType: 'image/png', buffer: PNG_1X1
  566 |                 });
  567 |                 // Ảnh được upload thành công: PictureId khác 0
> 568 |                 await expect(page.locator('#PictureId')).not.toHaveValue('0', {timeout: 30000});
      |                                                              ^ Error: expect(locator).not.toHaveValue(expected) failed
  569 |                 await page.locator('#Name').fill(name);
  570 |                 await saveContinue(page);
  571 |                 await expectEditPage(page);
  572 |                 await expect(page.locator('#PictureId')).not.toHaveValue('0');
  573 |             });
  574 |         });
  575 | 
  576 |         test('should reject invalid file format for manufacturer picture [Add_manufacturer_picture_invalid_type_20]', async ({ page }) => {
  577 |             await openCreate(page);
  578 |             await ensureAdvanced(page);
  579 |             const fileInput = page.locator('input[type="file"]').first();
  580 |             await fileInput.setInputFiles({
  581 |                 name: 'note.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image')
  582 |             });
  583 |             await page.waitForLoadState('networkidle').catch(() => {});
  584 |             await page.waitForTimeout(3000);
  585 |             // File không phải ảnh bị từ chối: không có Picture nào được gán, không lỗi hệ thống
  586 |             await expect(page.locator('#PictureId')).toHaveValue('0');
  587 |             await expectNoServerError(page);
  588 |         });
  589 | 
  590 |     });
  591 | 
  592 |     // ==========================================================================
  593 |     // 2. SEARCH MANUFACTURER (20 tests)
  594 |     // ==========================================================================
  595 |     test.describe('Admin - Search Manufacturer', () => {
  596 |         test.beforeAll(async ({ browser }) => {
  597 |             const page = await browser.newPage();
  598 |             try {
  599 |                 await gotoAdmin(page, LIST_URL);
  600 |                 const existing = await page.locator(`${G} tbody`).innerText().catch(() => '');
  601 |                 const needed = ['Apple', 'HP', 'Nike'].filter(n => !new RegExp(n, 'i').test(existing));
  602 |                 for (const name of needed) {
  603 |                     await gotoAdmin(page, CREATE_URL);
  604 |                     await page.locator('#Name').fill(name);
  605 |                     await page.locator('button[name="save"]').click();
  606 |                     await page.waitForURL(/\/Admin\/Manufacturer\/List/i, { timeout: 30000 });
  607 |                 }
  608 |             } catch (err) {
  609 |                 // Ignore
  610 |             } finally {
  611 |                 await page.close().catch(() => {});
  612 |             }
  613 |         });
  614 | 
  615 |         test('should display default values on Manufacturer list page [Search_manufacturer_default_value_01]', async ({ page }) => {
  616 |             await openManufacturers(page);
  617 |             await expect(page.locator('#SearchManufacturerName')).toHaveValue('');
  618 |             await expect(page.locator('#SearchPublishedId')).toHaveValue('0');
  619 |             // Nhánh ẩn: trường Store không hiển thị
  620 |             await expect(page.locator('.form-group:has(#SearchStoreId)')).toBeHidden();
  621 |             expect(await rowCount(page)).toBe(3);
  622 |             const text = await gridText(page);
  623 |             for (const n of ['apple', 'hp', 'nike']) expect(text).toContain(n);
  624 |             await expect(page.locator(`${G}_info`)).toContainText(/1\s*-\s*3\s+of\s+3/i);
  625 |         });
  626 | 
  627 |         test('should return all manufacturers when search name is empty [Search_manufacturer_empty_name_02]', async ({ page }) => {
  628 |             await openManufacturers(page);
  629 |             await page.locator('#SearchManufacturerName').fill('');
  630 |             await search(page);
  631 |             expect(await rowCount(page)).toBe(3);
  632 |         });
  633 | 
  634 |         test('should search manufacturer by exact name successfully [Search_manufacturer_exact_name_03]', async ({ page }) => {
  635 |             await openManufacturers(page);
  636 |             await page.locator('#SearchManufacturerName').fill('Apple');
  637 |             await search(page);
  638 |             expect(await rowCount(page)).toBe(1);
  639 |             expect(await gridText(page)).toContain('apple');
  640 |             await expect(page.locator(`${G}_info`)).toContainText(/1\s*-\s*1\s+of\s+1/i);
  641 |         });
  642 | 
  643 |         test('should search manufacturer by partial name successfully [Search_manufacturer_partial_name_04]', async ({ page }) => {
  644 |             await openManufacturers(page);
  645 |             await page.locator('#SearchManufacturerName').fill('Nik');
  646 |             await search(page);
  647 |             expect(await rowCount(page)).toBe(1);
  648 |             expect(await gridText(page)).toContain('nike');
  649 |         });
  650 | 
  651 |         test('should search manufacturer by single character keyword [Search_manufacturer_single_char_05]', async ({ page }) => {
  652 |             await openManufacturers(page);
  653 |             await page.locator('#SearchManufacturerName').fill('p');
  654 |             await search(page);
  655 |             expect(await rowCount(page)).toBe(2);
  656 |             const text = await gridText(page);
  657 |             expect(text).toContain('apple');
  658 |             expect(text).toContain('hp');
  659 |         });
  660 | 
  661 |         test('should search manufacturer case-insensitively [Search_manufacturer_case_insensitive_06]', async ({ page }) => {
  662 |             await openManufacturers(page);
  663 |             await page.locator('#SearchManufacturerName').fill('apple');
  664 |             await search(page);
  665 |             const lower = await rowCount(page);
  666 | 
  667 |             await page.locator('#SearchManufacturerName').fill('APPLE');
  668 |             await search(page);
```