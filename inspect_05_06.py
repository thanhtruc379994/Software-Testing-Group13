import openpyxl

wb = openpyxl.load_workbook(r'23130350_HuynhThiThanhTruc\Group13_23130350_HuynhThiThanhTruc.xlsx', data_only=True)
ws = wb['Customer Info']
for r in range(13, 17):
    row_vals = [ws.cell(r, c).value for c in range(1, 8)]
    print(f'Row {r}:', row_vals)
