# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-scripts/23130075_NguyenHuuDuy_TestScripts/admin_categories.spec.js >> Admin - Categories >> Admin - Edit Category >> should save category successfully without making any changes [Edit_category_no_change_16]
- Location: test-scripts/23130075_NguyenHuuDuy_TestScripts/admin_categories.spec.js:1003:13

# Error details

```
Error: expect(locator).not.toBeEmpty() failed

Locator:  locator('.note-editable').first()
Expected: not empty
Received: empty
Timeout:  5000ms

Call log:
  - Expect "not toBeEmpty" locator('.note-editable').first() with timeout 5000ms
  - waiting for locator('.note-editable').first()
    14 × locator resolved to <div role="textbox" spellcheck="true" autocorrect="true" aria-multiline="true" contenteditable="true" class="note-editable card-block">…</div>
       - unexpected value "empty"

```

```yaml
- textbox:
  - paragraph
```

# Test source

```ts
  912  |                 await openEdit(page, c.id);
  913  |                 await expect(page.locator('#Name')).toHaveValue(newName);
  914  |             });
  915  |         });
  916  | 
  917  |         test('should reject updating category when name is cleared [Edit_category_empty_name_08]', async ({ page }) => {
  918  |             await withCats(page, async (ctx) => {
  919  |                 const c = await ctx.make();
  920  |                 await openEdit(page, c.id);
  921  |                 await page.locator('#Name').fill('');
  922  |                 await save(page);
  923  |                 await expectRejected(page);
  924  |                 await openEdit(page, c.id);
  925  |                 await expect(page.locator('#Name')).toHaveValue(c.name);
  926  |             });
  927  |         });
  928  | 
  929  |         // loi
  930  |         test('should reject updating category with whitespace only name [Edit_category_whitespace_name_09]', async ({ page }) => {
  931  |             await withCats(page, async (ctx) => {
  932  |                 const c = await ctx.make();
  933  |                 await openEdit(page, c.id);
  934  |                 await page.locator('#Name').fill('     ');
  935  |                 await save(page);
  936  |                 await expectRejected(page);
  937  |             });
  938  |         });
  939  | 
  940  |         test('should reject updating category name exceeding 400 characters [Edit_category_over_length_name_11]', async ({ page }) => {
  941  |             await withCats(page, async (ctx) => {
  942  |                 const c = await ctx.make();
  943  |                 await openEdit(page, c.id);
  944  |                 await page.locator('#Name').fill('b'.repeat(401));
  945  |                 await save(page);
  946  |                 // Xử lý có kiểm soát: báo lỗi hoặc lưu theo quy định, không lỗi 500
  947  |                 await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger, .input-validation-error').first()).toBeVisible({timeout: 30000});
  948  |                 await expectNoServerError(page);
  949  |             });
  950  |         });
  951  | 
  952  |         test('should update category name with special characters [Edit_category_special_chars_name_12]', async ({ page }) => {
  953  |             await withCats(page, async (ctx) => {
  954  |                 const c = await ctx.make();
  955  |                 const name = uniq('Spec') + ' @#$%&\'"';
  956  |                 await openEdit(page, c.id);
  957  |                 await page.locator('#Name').fill(name);
  958  |                 await saveContinue(page);
  959  |                 await expectSaved(page);
  960  |                 await expect(page.locator('#Name')).toHaveValue(name);
  961  |             });
  962  |         });
  963  | 
  964  |         test('should safely escape HTML and script tags when updating category name [Edit_category_html_name_13]', async ({ page }) => {
  965  |             let dialogShown = false;
  966  |             page.on('dialog', async d => { dialogShown = true; await d.dismiss(); });
  967  |             await withCats(page, async (ctx) => {
  968  |                 const c = await ctx.make();
  969  |                 await openEdit(page, c.id);
  970  |                 await page.locator('#Name').fill(uniq('Html') + '<script>alert(1)</script>');
  971  |                 await save(page);
  972  |                 await expect(page).toHaveURL(/\/Admin\/Category\/List/i, {timeout: 30000});
  973  |                 await page.waitForLoadState('networkidle');
  974  |                 expect(dialogShown).toBeFalsy();
  975  |             });
  976  |         });
  977  | 
  978  |         test('should update category name with Vietnamese unicode characters [Edit_category_unicode_name_14]', async ({ page }) => {
  979  |             await withCats(page, async (ctx) => {
  980  |                 const c = await ctx.make();
  981  |                 const name = uniq('Máy tính');
  982  |                 await openEdit(page, c.id);
  983  |                 await page.locator('#Name').fill(name);
  984  |                 await saveContinue(page);
  985  |                 await expectSaved(page);
  986  |                 await expect(page.locator('#Name')).toHaveValue(name);
  987  |             });
  988  |         });
  989  | 
  990  |         test('should handle duplicate category name when updating without server error [Edit_category_duplicate_name_15]', async ({ page }) => {
  991  |             await withCats(page, async (ctx) => {
  992  |                 const a = await ctx.make();
  993  |                 const b = await ctx.make();
  994  |                 await openEdit(page, b.id);
  995  |                 await page.locator('#Name').fill(a.name);
  996  |                 await save(page);
  997  |                 // Xác nhận theo hành vi thực tế: lưu được hoặc báo lỗi trùng, không lỗi hệ thống
  998  |                 await expect(page.locator('.alert-success, .field-validation-error, .validation-summary-errors, .alert-danger').first()).toBeVisible({timeout: 30000});
  999  |                 await expectNoServerError(page);
  1000 |             });
  1001 |         });
  1002 | 
  1003 |         test('should save category successfully without making any changes [Edit_category_no_change_16]', async ({ page }) => {
  1004 |             await withCats(page, async (ctx) => {
  1005 |                 const c = await ctx.make({description: 'Giữ nguyên'});
  1006 |                 await openEdit(page, c.id);
  1007 |                 await save(page);
  1008 |                 await expect(page).toHaveURL(/\/Admin\/Category\/List/i, {timeout: 30000});
  1009 |                 await expectSaved(page);
  1010 |                 await openEdit(page, c.id);
  1011 |                 await expect(page.locator('#Name')).toHaveValue(c.name);
> 1012 |                 await expect(page.locator('.note-editable').first()).not.toBeEmpty();
       |                                                                          ^ Error: expect(locator).not.toBeEmpty() failed
  1013 |             });
  1014 |         });
  1015 | 
  1016 |         test('should update category with valid description [Edit_category_valid_description_17]', async ({ page }) => {
  1017 |             await withCats(page, async (ctx) => {
  1018 |                 const c = await ctx.make();
  1019 |                 await openEdit(page, c.id);
  1020 |                 await setDescription(page, 'Mô tả mới');
  1021 |                 await saveContinue(page);
  1022 |                 await expectSaved(page);
  1023 |                 await openEdit(page, c.id);
  1024 |                 await expect(page.locator('.note-editable').first()).toContainText('Mô tả mới');
  1025 |             });
  1026 |         });
  1027 | 
  1028 |         test('should update category with empty description [Edit_category_empty_description_18]', async ({ page }) => {
  1029 |             await withCats(page, async (ctx) => {
  1030 |                 const c = await ctx.make({description: 'Sẽ bị xóa'});
  1031 |                 await openEdit(page, c.id);
  1032 |                 await setDescription(page, '');
  1033 |                 await saveContinue(page);
  1034 |                 await expectSaved(page);
  1035 |                 await openEdit(page, c.id);
  1036 |                 await expect(page.locator('.note-editable').first()).toHaveText('');
  1037 |             });
  1038 |         });
  1039 | 
  1040 |         test('should update parent category from None to another category [Edit_category_parent_to_other_21]', async ({ page }) => {
  1041 |             await withCats(page, async (ctx) => {
  1042 |                 const parent = await ctx.make();
  1043 |                 const c = await ctx.make();
  1044 |                 await openEdit(page, c.id);
  1045 |                 await page.locator('#ParentCategoryId').selectOption({label: parent.name});
  1046 |                 await save(page);
  1047 |                 await expectSaved(page);
  1048 |                 const rows = await listRows(page, c.name);
  1049 |                 expect(rows.length).toBe(1);
  1050 |                 expect(rows[0]).toContain(`${parent.name.toLowerCase()} >> ${c.name.toLowerCase()}`);
  1051 |             });
  1052 |         });
  1053 | 
  1054 |         test('should update parent category back to None [Edit_category_parent_to_none_22]', async ({ page }) => {
  1055 |             await withCats(page, async (ctx) => {
  1056 |                 const parent = await ctx.make();
  1057 |                 const c = await ctx.make({parent: parent.name});
  1058 |                 await openEdit(page, c.id);
  1059 |                 await page.locator('#ParentCategoryId').selectOption({label: '[None]'});
  1060 |                 await save(page);
  1061 |                 await expectSaved(page);
  1062 |                 const rows = await listRows(page, c.name);
  1063 |                 expect(rows.length).toBe(1);
  1064 |                 expect(rows[0]).not.toContain('>>');
  1065 |             });
  1066 |         });
  1067 | 
  1068 |         test('should change parent category to a different parent [Edit_category_parent_change_23]', async ({ page }) => {
  1069 |             await withCats(page, async (ctx) => {
  1070 |                 const p1 = await ctx.make();
  1071 |                 const p2 = await ctx.make();
  1072 |                 const c = await ctx.make({parent: p1.name});
  1073 |                 await openEdit(page, c.id);
  1074 |                 await page.locator('#ParentCategoryId').selectOption({label: p2.name});
  1075 |                 await save(page);
  1076 |                 await expectSaved(page);
  1077 |                 const rows = await listRows(page, c.name);
  1078 |                 expect(rows.length).toBe(1);
  1079 |                 expect(rows[0]).toContain(`${p2.name.toLowerCase()} >> ${c.name.toLowerCase()}`);
  1080 |             });
  1081 |         });
  1082 | 
  1083 |         test('should prevent circular parent-child dependency loop [Edit_category_parent_loop_25]', async ({ page }) => {
  1084 |             await withCats(page, async (ctx) => {
  1085 |                 const parent = await ctx.make();
  1086 |                 const child = await ctx.make({parent: parent.name});
  1087 |                 await openEdit(page, parent.id);
  1088 |                 const label = `${parent.name} >> ${child.name}`;
  1089 |                 const options = (await page.locator('#ParentCategoryId option').allInnerTexts()).map(o => o.trim());
  1090 |                 if (!options.includes(label)) return;   // Không cho chọn: đạt yêu cầu
  1091 |                 await page.locator('#ParentCategoryId').selectOption({label});
  1092 |                 await save(page);
  1093 |                 await expectNoServerError(page);
  1094 |                 // Không được tạo vòng lặp: cha vẫn là category gốc
  1095 |                 await openEdit(page, parent.id);
  1096 |                 expect(await parentLabel(page)).toBe('[None]');
  1097 |             });
  1098 |         });
  1099 | 
  1100 |         test('should update display order with valid numeric value [Edit_category_display_order_27]', async ({ page }) => {
  1101 |             await withCats(page, async (ctx) => {
  1102 |                 const c = await ctx.make();
  1103 |                 await openEdit(page, c.id);
  1104 |                 await expandDisplay(page);
  1105 |                 await fillNum(page, 'DisplayOrder', 20);
  1106 |                 await saveContinue(page);
  1107 |                 await expectSaved(page);
  1108 |                 await openEdit(page, c.id);
  1109 |                 await expandDisplay(page);
  1110 |                 expect(await numValue(page, 'DisplayOrder')).toBe(20);
  1111 |             });
  1112 |         });
```