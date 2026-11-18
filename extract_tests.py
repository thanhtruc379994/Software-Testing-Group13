import re

with open(r'23130350_HuynhThiThanhTruc\script\CustomerInfoMgmt.spec.js', 'r', encoding='utf8') as f:
    text = f.read()

tests = re.findall(r"test\('([^']+)'", text)
for idx, t in enumerate(tests, 1):
    print(f"{idx:02d}. {t}")
