import openpyxl
import re

wb = openpyxl.load_workbook(r'23130350_HuynhThiThanhTruc\Group13_23130350_HuynhThiThanhTruc.xlsx', data_only=True)
ws = wb['Customer Info']

with open(r'23130350_HuynhThiThanhTruc\script\CustomerInfoMgmt.spec.js', 'r', encoding='utf8') as f:
    text = f.read()

tests = re.findall(r"test\('([^']+)'", text)

print(f"{'ID':<14} | {'Excel Description':<48} | {'Script Test Name'}")
print("-" * 110)
for r in range(9, 34):
    tc_id = ws.cell(r, 1).value
    tc_desc = ws.cell(r, 2).value
    script_test = tests[r - 9] if (r - 9) < len(tests) else "MISSING"
    print(f"{tc_id:<14} | {tc_desc[:48]:<48} | {script_test}")
