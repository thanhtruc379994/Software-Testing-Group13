import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Defect Report - Trúc"

# Define Defect Data (10 distinct defects across 3 modules)
defects = [
    {
        "id": "DEF_CUST_01",
        "title": "Cho phép tạo mới khách hàng với mật khẩu quá ngắn (< 6 ký tự) thiếu kiểm tra độ phức tạp",
        "module": "Quản lý Thông tin Khách hàng (Admin)",
        "desc": "Tại form thêm mới khách hàng trong Admin, khi nhập mật khẩu quá ngắn (dưới 6 ký tự), hệ thống vẫn cho phép lưu thành công mà không hiển thị thông báo lỗi kiểm tra độ dài tối thiểu hay độ phức tạp mật khẩu.",
        "pre": "Đã đăng nhập quyền Administrator, truy cập trang /Admin/Customer/Create.",
        "steps": "1. Truy cập Customer > Customers > Add new\n2. Nhập Email hợp lệ: testuser_shortpwd@gmail.com\n3. Nhập Password: 123 (3 ký tự)\n4. Bấm nút [Save]",
        "data": "Email: testuser_shortpwd@gmail.com, Password: 123",
        "expected": "Hệ thống phải hiển thị thông báo lỗi validation yêu cầu mật khẩu tối thiểu 6 ký tự (theo tiêu chuẩn bảo mật).",
        "actual": "Hệ thống lưu thành công mà không có thông báo lỗi kiểm tra độ dài mật khẩu.",
        "severity": "High",
        "priority": "P2",
        "repro": "Always",
        "evidence": "screenshots/CustomerInfo/cust_info_17_FAILED.png",
        "reported_by": "Trúc",
        "status": "New"
    },
    {
        "id": "DEF_CUST_02",
        "title": "Form tạo mới khách hàng ở trang Admin thiếu trường xác nhận mật khẩu (Confirm Password)",
        "module": "Quản lý Thông tin Khách hàng (Admin)",
        "desc": "Giao diện tạo mới khách hàng chỉ có duy nhất trường Password, thiếu trường Confirm Password dẫn đến rủi ro gõ nhầm mật khẩu mà không được xác thực lại ở phía người dùng.",
        "pre": "Đã đăng nhập quyền Administrator, truy cập trang /Admin/Customer/Create.",
        "steps": "1. Mở form thêm mới khách hàng\n2. Quan sát các trường nhập liệu trong nhóm Thông tin tài khoản",
        "data": "N/A",
        "expected": "Form phải có trường Confirm Password để yêu cầu quản trị viên nhập lại mật khẩu nhằm tránh lỗi chính tả.",
        "actual": "Chỉ có duy nhất một ô Password, hoàn toàn không có trường Confirm Password.",
        "severity": "Medium",
        "priority": "P3",
        "repro": "Always",
        "evidence": "screenshots/CustomerInfo/cust_info_18_FAILED.png",
        "reported_by": "Trúc",
        "status": "New"
    },
    {
        "id": "DEF_CUST_03",
        "title": "Bộ lọc tìm kiếm khách hàng theo Ngày sinh (Date of Birth) không bắt lỗi khi nhập sai logic khoảng ngày",
        "module": "Quản lý Thông tin Khách hàng (Admin)",
        "desc": "Tại bộ lọc tìm kiếm khách hàng theo ngày sinh, nếu người dùng chọn ngày bắt đầu lớn hơn ngày kết thúc, hệ thống không thông báo lỗi logic khoảng thời gian.",
        "pre": "Đã đăng nhập quyền Administrator, truy cập trang /Admin/Customer/List.",
        "steps": "1. Mở khối tìm kiếm trên danh sách khách hàng\n2. Nhập Tháng sinh bắt đầu: 12, Tháng sinh kết thúc: 01\n3. Bấm nút [Search]",
        "data": "DateOfBirthMonth: 12 đến 01",
        "expected": "Hệ thống phải hiển thị cảnh báo khoảng ngày sinh không hợp lệ.",
        "actual": "Hệ thống thực thi tìm kiếm bình thường trả về danh sách rỗng mà không có cảnh báo logic khoảng giá trị.",
        "severity": "Low",
        "priority": "P4",
        "repro": "Always",
        "evidence": "screenshots/CustomerInfo/cust_info_06_PASS.png",
        "reported_by": "Trúc",
        "status": "New"
    },
    {
        "id": "DEF_ROLE_01",
        "title": "Ô nhập Tên vai trò (Role Name) thiếu thuộc tính maxlength='255' giới hạn độ dài ở phía Client",
        "module": "Quản lý Vai trò Khách hàng (Admin)",
        "desc": "Thẻ input nhập Name của vai trò khách hàng không có thuộc tính maxlength='255', cho phép người dùng dán hoặc nhập chuỗi ký tự vô hạn ở Client.",
        "pre": "Đã đăng nhập Administrator, mở trang /Admin/CustomerRole/Create.",
        "steps": "1. Mở form thêm mới vai trò khách hàng\n2. Nhập chuỗi ký tự có độ dài > 300 ký tự vào ô Name\n3. Bấm [Save]",
        "data": "Role Name: Chuỗi 'Role_' kèm 300 ký tự 'A'",
        "expected": "Thẻ <input id='Name'> phải có thuộc tính maxlength='255' để ngăn nhập quá giới hạn.",
        "actual": "Thẻ input không có thuộc tính maxlength, cho phép người dùng nhập vượt độ dài cơ sở dữ liệu.",
        "severity": "Medium",
        "priority": "P3",
        "repro": "Always",
        "evidence": "screenshots/CustomerRole/cust_role_06_FAILED.png",
        "reported_by": "Trúc",
        "status": "New"
    },
    {
        "id": "DEF_ROLE_02",
        "title": "Hệ thống cho phép tạo mới nhiều Vai trò khách hàng trùng tên (Duplicate Role Name)",
        "module": "Quản lý Vai trò Khách hàng (Admin)",
        "desc": "Hệ thống không kiểm tra tính duy nhất (Uniqueness) của tên vai trò khách hàng, cho phép tạo nhiều vai trò có cùng tên hiển thị, gây nhầm lẫn nghiêm trọng khi phân quyền người dùng.",
        "pre": "Hệ thống đã có vai trò mặc định 'Administrators'.",
        "steps": "1. Vào Customer roles > Add new\n2. Nhập Name: 'Administrators'\n3. Bấm [Save]",
        "data": "Name: Administrators",
        "expected": "Hệ thống phải chặn lại và hiển thị thông báo lỗi 'Customer role name already exists'.",
        "actual": "Hệ thống lưu thành công tạo thêm một vai trò 'Administrators' thứ hai mà không có thông báo lỗi.",
        "severity": "High",
        "priority": "P2",
        "repro": "Always",
        "evidence": "screenshots/CustomerRole/cust_role_07_FAILED.png",
        "reported_by": "Trúc",
        "status": "New"
    },
    {
        "id": "DEF_ROLE_03",
        "title": "Trường 'System name' của vai trò hệ thống không bị vô hiệu hóa khi chỉnh sửa chi tiết vai trò",
        "module": "Quản lý Vai trò Khách hàng (Admin)",
        "desc": "Đối với các vai trò core của hệ thống (Administrators, Guests, Registered), trường System name rất nhạy cảm nhưng không bị vô hiệu hóa (disabled), tiềm ẩn rủi ro hỏng phân quyền hệ thống.",
        "pre": "Đã đăng nhập Administrator, mở danh sách Customer Roles.",
        "steps": "1. Tìm vai trò 'Administrators' trong danh sách\n2. Bấm [Edit] để mở chi tiết\n3. Kiểm tra trạng thái của ô input 'System name'",
        "data": "Role: Administrators",
        "expected": "Trường System name của vai trò hệ thống phải bị khóa cứng (disabled) hoặc ẩn để không cho chỉnh sửa.",
        "actual": "Trường System name vẫn ở trạng thái mở (Enabled) cho phép nhập/sửa trên form.",
        "severity": "High",
        "priority": "P2",
        "repro": "Always",
        "evidence": "screenshots/CustomerRole/cust_role_14_FAILED.png",
        "reported_by": "Trúc",
        "status": "New"
    },
    {
        "id": "DEF_ROLE_04",
        "title": "Vô hiệu hóa vai trò (Active = False) nhưng không cảnh báo ảnh hưởng tới các tài khoản đang gắn vai trò này",
        "module": "Quản lý Vai trò Khách hàng (Admin)",
        "desc": "Khi quản trị viên bỏ chọn Active của một vai trò đang có nhiều tài khoản sử dụng, hệ thống lưu ngay lập tức mà không hiển thị cảnh báo xác nhận ảnh hưởng quyền truy cập.",
        "pre": "Vai trò tùy chỉnh đang được gán cho ít nhất 1 tài khoản khách hàng.",
        "steps": "1. Mở trang Edit của vai trò khách hàng\n2. Bỏ chọn checkbox 'Active'\n3. Bấm [Save]",
        "data": "Active: Unchecked",
        "expected": "Hệ thống phải hiển thị hộp thoại xác nhận về số lượng người dùng bị ảnh hưởng trước khi vô hiệu hóa.",
        "actual": "Hệ thống lưu trạng thái Inactive ngay lập tức mà không có thông báo cảnh báo xác nhận.",
        "severity": "Low",
        "priority": "P4",
        "repro": "Always",
        "evidence": "screenshots/CustomerRole/cust_role_10_PASS.png",
        "reported_by": "Trúc",
        "status": "New"
    },
    {
        "id": "DEF_CART_01",
        "title": "Nút 'Add to cart' tại Trang chủ tự chuyển hướng vào trang chi tiết thay vì thêm sản phẩm vào giỏ",
        "module": "Giỏ hàng (Shopping Cart - Storefront)",
        "desc": "Tại trang chủ, khi người dùng bấm nút 'Add to cart' trên thẻ sản phẩm có thuộc tính chọn thêm (Build your own computer), hệ thống tự chuyển hướng sang trang chi tiết sản phẩm và chưa được thêm vào giỏ hàng mà không hiển thị thông báo hướng dẫn.",
        "pre": "Khách hàng truy cập trang chủ http://localhost:8080/.",
        "steps": "1. Tại trang chủ, tìm sản phẩm 'Build your own computer'\n2. Bấm nút [Add to cart]\n3. Quan sát URL và thông báo phản hồi",
        "data": "Sản phẩm: Build your own computer",
        "expected": "Hệ thống phải thêm ngay vào giỏ (nếu dùng cấu hình mặc định) và hiện thanh thông báo xanh, hoặc mở popup chọn thuộc tính ngay tại trang chủ.",
        "actual": "Hệ thống tự động chuyển hướng (redirect) vào trang /build-your-own-computer, sản phẩm vẫn chưa được thêm vào giỏ hàng.",
        "severity": "Medium",
        "priority": "P3",
        "repro": "Always",
        "evidence": "screenshots/ShoppingCart/cart_add_03_FAILED.png",
        "reported_by": "Trúc",
        "status": "New"
    },
    {
        "id": "DEF_CART_02",
        "title": "Cập nhật số lượng sản phẩm trong giỏ hàng thành số âm (-1) không hiển thị thông báo lỗi Validation",
        "module": "Giỏ hàng (Shopping Cart - Storefront)",
        "desc": "Tại trang giỏ hàng, khi nhập số lượng là số âm vào ô Qty rồi bấm Enter hoặc Update cart, hệ thống không hiển thị thông báo lỗi inline hoặc thông báo cảnh báo số lượng không hợp lệ.",
        "pre": "Đã có ít nhất 1 sản phẩm trong giỏ hàng (/cart).",
        "steps": "1. Truy cập giỏ hàng http://localhost:8080/cart\n2. Nhập '-1' vào ô số lượng (Qty)\n3. Nhấn [Enter] hoặc nút [Update shopping cart]",
        "data": "Quantity: -1",
        "expected": "Hiển thị thông báo lỗi validation 'Quantity must be positive' hoặc 'Số lượng không hợp lệ'.",
        "actual": "Hệ thống không hiển thị bất kỳ thông báo lỗi nào, tự động xóa sản phẩm hoặc đặt lại số lượng mà không báo trước.",
        "severity": "Medium",
        "priority": "P3",
        "repro": "Always",
        "evidence": "screenshots/ShoppingCart/cart_upd_03_FAILED.png",
        "reported_by": "Trúc",
        "status": "New"
    },
    {
        "id": "DEF_CART_03",
        "title": "Nút Thanh toán (Checkout) vẫn ở trạng thái Enabled khi sản phẩm trong giỏ bị cảnh báo hết hàng",
        "module": "Giỏ hàng (Shopping Cart - Storefront)",
        "desc": "Khi sản phẩm trong giỏ hàng vượt quá số lượng tồn kho (Out of stock), nút Checkout vẫn sáng và bấm được (Enabled) thay vì bị vô hiệu hóa (disabled).",
        "pre": "Giỏ hàng có sản phẩm với số lượng vượt quá tồn kho khả dụng.",
        "steps": "1. Mở trang giỏ hàng (/cart)\n2. Quan sát nút Checkout khi có cảnh báo hết hàng xuất hiện trên bảng sản phẩm",
        "data": "Sản phẩm trạng thái hết hàng",
        "expected": "Nút Checkout phải bị vô hiệu hóa (disabled) để ngăn khách hàng bấm tiếp tục tiến trình thanh toán.",
        "actual": "Nút Checkout vẫn Enabled cho phép khách hàng click.",
        "severity": "High",
        "priority": "P2",
        "repro": "Always",
        "evidence": "screenshots/ShoppingCart/cart_inv_01_FAILED.png",
        "reported_by": "Trúc",
        "status": "New"
    },
    {
        "id": "DEF_CART_04",
        "title": "Áp dụng mã giảm giá rỗng hoặc chỉ chứa khoảng trắng không hiển thị phản hồi lỗi trực quan",
        "module": "Giỏ hàng (Shopping Cart - Storefront)",
        "desc": "Khi người dùng nhấn nút 'Apply coupon' mà không nhập mã giảm giá (hoặc nhập toàn khoảng trắng), thẻ thông báo lỗi có style display:none khiến người dùng không thấy cảnh báo lỗi.",
        "pre": "Khách hàng đang ở trang giỏ hàng (/cart).",
        "steps": "1. Để trống ô Discount code\n2. Bấm nút [Apply coupon]\n3. Quan sát phản hồi trên giao diện",
        "data": "Discount code: '' (rỗng) hoặc '   ' (khoảng trắng)",
        "expected": "Hiển thị thông báo lỗi rõ ràng 'The coupon code cannot be empty'.",
        "actual": "Giao diện tải lại ngầm nhưng thẻ thông báo lỗi bị ẩn (display: none), không có phản hồi trực quan.",
        "severity": "Low",
        "priority": "P4",
        "repro": "Always",
        "evidence": "screenshots/ShoppingCart/cart_vouch_02_PASS.png",
        "reported_by": "Trúc",
        "status": "New"
    }
]

# Write Header Block
ws["A1"] = "DEFECT REPORT – TRÚC"
ws["A1"].font = Font(name="Arial", size=14, bold=True, color="1F497D")

ws["A2"] = "Thành viên"
ws["B2"] = "Huỳnh Thị Thanh Trúc (MSSV: 23130350)"
ws["A2"].font = Font(name="Arial", size=11, bold=True)
ws["B2"].font = Font(name="Arial", size=11)

ws["A3"] = "Chức năng phân công"
ws["B3"] = "1) Quản lý Thông tin Khách hàng (Admin)   2) Quản lý Vai trò Khách hàng (Admin)   3) Giỏ hàng (Shopping Cart - Storefront)"
ws["A3"].font = Font(name="Arial", size=11, bold=True)
ws["B3"].font = Font(name="Arial", size=11)

headers = [
    "Defect ID", "Defect Title", "Module / Function", "Defect Description",
    "Preconditions", "Steps to Reproduce", "Test Data / Input",
    "Expected Result", "Actual Result", "Severity", "Priority",
    "Reproducibility", "Evidence (Screenshot / Video / Log)",
    "Reported By", "Defect Status"
]

header_row = 4
header_fill = PatternFill(start_color="1F497D", end_color="1F497D", fill_type="solid")
header_font = Font(name="Arial", size=11, bold=True, color="FFFFFF")
thin_border = Border(
    left=Side(style='thin', color='BFBFBF'),
    right=Side(style='thin', color='BFBFBF'),
    top=Side(style='thin', color='BFBFBF'),
    bottom=Side(style='thin', color='BFBFBF')
)

for col_idx, h in enumerate(headers, 1):
    cell = ws.cell(row=header_row, column=col_idx, value=h)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = thin_border

# Write Data Rows
sev_colors = {
    "Critical": "FFC7CE", # light red
    "High": "FFD9B3",     # light orange
    "Medium": "FFF2CC",   # light yellow
    "Low": "E2EFDA"       # light green
}

for row_idx, d in enumerate(defects, header_row + 1):
    vals = [
        d["id"], d["title"], d["module"], d["desc"],
        d["pre"], d["steps"], d["data"], d["expected"],
        d["actual"], d["severity"], d["priority"],
        d["repro"], d["evidence"], d["reported_by"], d["status"]
    ]
    for col_idx, val in enumerate(vals, 1):
        cell = ws.cell(row=row_idx, column=col_idx, value=val)
        cell.font = Font(name="Arial", size=10)
        cell.border = thin_border
        
        # Alignment
        if col_idx in [1, 10, 11, 12, 14, 15]:
            cell.alignment = Alignment(horizontal="center", vertical="top")
        else:
            cell.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
            
        # Highlight severity
        if col_idx == 10 and val in sev_colors:
            cell.fill = PatternFill(start_color=sev_colors[val], end_color=sev_colors[val], fill_type="solid")
            cell.font = Font(name="Arial", size=10, bold=True)
            
        # Highlight Status
        if col_idx == 15:
            cell.fill = PatternFill(start_color="DDEBF7", end_color="DDEBF7", fill_type="solid")
            cell.font = Font(name="Arial", size=10, bold=True)

# Adjust row heights and column widths
ws.row_dimensions[4].height = 28
col_widths = {
    1: 14,  # Defect ID
    2: 30,  # Title
    3: 25,  # Module
    4: 35,  # Description
    5: 25,  # Preconditions
    6: 35,  # Steps
    7: 22,  # Data
    8: 30,  # Expected
    9: 30,  # Actual
    10: 12, # Severity
    11: 10, # Priority
    12: 15, # Repro
    13: 35, # Evidence
    14: 14, # Reported By
    15: 14  # Status
}

for col_idx, width in col_widths.items():
    ws.column_dimensions[get_column_letter(col_idx)].width = width

out_path = r"23130350_HuynhThiThanhTruc\Group13_Defect_Report_Truc.xlsx"
wb.save(out_path)
print(f"Successfully created Defect Report with {len(defects)} defects at {out_path}!")
