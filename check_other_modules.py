import openpyxl
import re

wb = openpyxl.load_workbook(r'23130350_HuynhThiThanhTruc\Group13_23130350_HuynhThiThanhTruc.xlsx', data_only=True)

# 1. Customer Roles
ws_cr = wb['Customer Roles']
with open(r'23130350_HuynhThiThanhTruc\script\CustomerRoleMgmt.spec.js', 'r', encoding='utf8') as f:
    text_cr = f.read()
tests_cr = re.findall(r"test\('([^']+)'", text_cr)

print('=== CUSTOMER ROLES ===')
for r in range(9, 29):
    tc_id = ws_cr.cell(r, 1).value
    tc_desc = ws_cr.cell(r, 2).value
    script_test = tests_cr[r - 9] if (r - 9) < len(tests_cr) else "MISSING"
    print(f"{tc_id:<14} | {tc_desc[:40]:<40} | {script_test[:50]}")

# 2. Shopping Cart
ws_cart = wb['Shopping Cart']
with open(r'23130350_HuynhThiThanhTruc\script\ShoppingCartMgmt.spec.js', 'r', encoding='utf8') as f:
    text_cart = f.read()
tests_cart = re.findall(r"test\('([^']+)'", text_cart)

print('\n=== SHOPPING CART ===')
for r in range(9, 37):
    tc_id = ws_cart.cell(r, 1).value
    tc_desc = ws_cart.cell(r, 2).value
    script_test = tests_cart[r - 9] if (r - 9) < len(tests_cart) else "MISSING"
    print(f"{tc_id:<14} | {tc_desc[:40]:<40} | {script_test[:50]}")
