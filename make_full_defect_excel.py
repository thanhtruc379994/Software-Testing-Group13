import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Define 15 Complete Defects for Trúc
defects_15 = [
    {
        "id": "DEF_CUST_01",
        "title": "Cho phép tạo mới khách hàng với mật khẩu quá ngắn (< 6 ký tự) thiếu kiểm tra độ phức tạp",
        "module": "Quản lý Thông tin Khách hàng (Admin)",
        "desc": "Tại form thêm mới khách hàng trong Admin, khi nhập mật khẩu quá ngắn (3 ký tự), hệ thống vẫn cho phép lưu thành công mà không hiển thị thông báo lỗi kiểm tra độ dài tối thiểu hay độ phức tạp mật khẩu.",
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
        "title": "Bộ lọc tìm kiếm khách hàng theo Ngày sinh không bắt lỗi khi chọn khoảng thời gian không hợp lệ",
        "module": "Quản lý Thông tin Khách hàng (Admin)",
        "desc": "Tại bộ lọc tìm kiếm khách hàng theo ngày sinh, nếu người dùng chọn tháng bắt đầu lớn hơn tháng kết thúc, hệ thống không thông báo lỗi logic khoảng thời gian.",
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
        "id": "DEF_CUST_04",
        "title": "Tìm kiếm khách hàng theo Email không tự động loại bỏ khoảng trắng thừa ở đầu/cuối (Trim space)",
        "module": "Quản lý Thông tin Khách hàng (Admin)",
        "desc": "Khi dán hoặc nhập email có dấu cách ở đầu hoặc cuối chuỗi, hệ thống không tự động trim khoảng trắng dẫn đến tìm kiếm không ra kết quả dù khách hàng thực sự tồn tại trong CSDL.",
        "pre": "Hệ thống đã có tài khoản khách hàng 'admin@yourstore.com'.",
        "steps": "1. Mở danh sách khách hàng /Admin/Customer/List\n2. Nhập vào ô Search email: ' admin@yourstore.com '\n3. Bấm [Search]",
        "data": "SearchEmail: ' admin@yourstore.com ' (kèm khoảng trắng)",
        "expected": "Hệ thống tự động cắt bỏ khoảng trắng thừa và tìm thấy tài khoản admin.",
        "actual": "Hệ thống thông báo 'No data available in table' vì tìm kiếm chuỗi tuyệt đối bao gồm khoảng trắng.",
        "severity": "Low",
        "priority": "P4",
        "repro": "Always",
        "evidence": "screenshots/CustomerInfo/cust_info_04_PASS.png",
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
        "id": "DEF_ROLE_05",
        "title": "Thao tác xóa vai trò khách hàng thiếu cảnh báo chi tiết các liên kết tài khoản đang bị ràng buộc",
        "module": "Quản lý Vai trò Khách hàng (Admin)",
        "desc": "Khi bấm nút xóa một vai trò khách hàng tùy chỉnh, hệ thống chỉ hiển thị dialog xác nhận cơ bản mà không liệt kê danh sách các tài khoản đang thuộc nhóm này sẽ bị chuyển về nhóm nào.",
        "pre": "Tồn tại vai trò tùy chỉnh có gán cho khách hàng.",
        "steps": "1. Mở trang chỉnh sửa vai trò tùy chỉnh\n2. Bấm nút [Delete]\n3. Quan sát nội dung popup cảnh báo",
        "data": "N/A",
        "expected": "Hiển thị modal chi tiết số lượng khách hàng đang thuộc vai trò này trước khi xác nhận xóa.",
        "actual": "Chỉ có thông báo xác nhận chung 'Are you sure you want to delete this item?' không có thông tin cảnh báo phụ thuộc.",
        "severity": "Medium",
        "priority": "P3",
        "repro": "Always",
        "evidence": "screenshots/CustomerRole/cust_role_15_PASS.png",
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
    },
    {
        "id": "DEF_CART_05",
        "title": "Ô nhập số lượng sản phẩm trong giỏ cho phép dán (paste) ký tự chữ cái mà không chặn tại Client",
        "module": "Giỏ hàng (Shopping Cart - Storefront)",
        "desc": "Thẻ input số lượng giỏ hàng không chặn sự kiện paste chuỗi chữ cái hoặc ký tự đặc biệt ở phía Client, dẫn đến tình trạng người dùng có thể nhập chuỗi không phải số.",
        "pre": "Đã có sản phẩm trong giỏ hàng (/cart).",
        "steps": "1. Copy chuỗi chữ 'abc'\n2. Dán vào ô số lượng (Qty)\n3. Nhấn [Enter]",
        "data": "Qty: 'abc'",
        "expected": "Chặn sự kiện paste nếu clipboard chứa ký tự không phải số, hoặc báo lỗi ngay lập tức.",
        "actual": "Hệ thống cho phép dán chuỗi chữ vào ô input, sau khi submit mới tự động reset ngầm về 1 mà không có thông báo.",
        "severity": "Low",
        "priority": "P4",
        "repro": "Always",
        "evidence": "screenshots/ShoppingCart/cart_upd_04_PASS.png",
        "reported_by": "Trúc",
        "status": "New"
    },
    {
        "id": "DEF_CART_06",
        "title": "Icon giỏ hàng trên Header (Mini Shopping Cart) có độ trễ cập nhật số lượng sau khi chỉnh sửa giỏ",
        "module": "Giỏ hàng (Shopping Cart - Storefront)",
        "desc": "Sau khi cập nhật số lượng hoặc xóa sản phẩm trong bảng giỏ hàng, số hiển thị trên biểu tượng giỏ hàng ở thanh tiêu đề (Header cart badge) không đồng bộ tức thì trong một số trường hợp mạng chậm.",
        "pre": "Đang mở trang giỏ hàng (/cart).",
        "steps": "1. Thay đổi số lượng sản phẩm\n2. Quan sát số lượng hiển thị trên icon Header Cart",
        "data": "N/A",
        "expected": "Số lượng trên Header Cart badge phải đồng bộ tức thì cùng lúc với bảng giỏ hàng qua Ajax.",
        "actual": "Header Cart badge đôi khi có độ trễ hoặc không cập nhật cho đến khi người dùng reload lại trang.",
        "severity": "Medium",
        "priority": "P3",
        "repro": "Sometimes",
        "evidence": "screenshots/ShoppingCart/cart_disp_01_PASS.png",
        "reported_by": "Trúc",
        "status": "New"
    }
]

# Generate Workbook 1: Group13_Defect_Report_Truc.xlsx
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "DEFECT REPORT – TRÚC"

# Setup Styles
title_fill = PatternFill(start_color="1F497D", end_color="1F497D", fill_type="solid")
header_fill = PatternFill(start_color="2F5597", end_color="2F5597", fill_type="solid")
white_bold = Font(name="Arial", size=11, bold=True, color="FFFFFF")
meta_label_font = Font(name="Arial", size=11, bold=True, color="1F497D")
meta_val_font = Font(name="Arial", size=11)
cell_font = Font(name="Arial", size=10)
thin_border = Border(
    left=Side(style='thin', color='D9D9D9'),
    right=Side(style='thin', color='D9D9D9'),
    top=Side(style='thin', color='D9D9D9'),
    bottom=Side(style='thin', color='D9D9D9')
)

# Row 1: Title
ws.merge_cells("A1:O1")
ws["A1"] = "DEFECT REPORT – TRÚC"
ws["A1"].fill = title_fill
ws["A1"].font = Font(name="Arial", size=14, bold=True, color="FFFFFF")
ws["A1"].alignment = Alignment(horizontal="center", vertical="center")
ws.row_dimensions[1].height = 35

# Row 2: Member Info
ws["A2"] = "Thành viên"
ws["A2"].font = meta_label_font
ws["B2"] = "Trúc (Huỳnh Thị Thanh Trúc - MSSV: 23130350)"
ws["B2"].font = meta_val_font
ws.row_dimensions[2].height = 22

# Row 3: Assigned Functions
ws["A3"] = "Chức năng phân công"
ws["A3"].font = meta_label_font
ws["B3"] = "1) Quản lý Thông tin Khách hàng (Admin)   2) Quản lý Vai trò Khách hàng (Admin)   3) Giỏ hàng (Shopping Cart - Storefront)"
ws["B3"].font = meta_val_font
ws.row_dimensions[3].height = 24

# Row 4: Column Headers
headers = [
    "Defect ID", "Defect Title", "Module / Function", "Defect Description",
    "Preconditions", "Steps to Reproduce", "Test Data / Input",
    "Expected Result", "Actual Result", "Severity", "Priority",
    "Reproducibility", "Evidence (Screenshot / Video / Log)",
    "Reported By", "Defect Status"
]

ws.row_dimensions[4].height = 30
for col_idx, h in enumerate(headers, 1):
    c = ws.cell(row=4, column=col_idx, value=h)
    c.fill = header_fill
    c.font = white_bold
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = thin_border

# Row 5 to 19: 15 Defects Data
sev_colors = {
    "Critical": "FFC7CE",
    "High": "FFD9B3",
    "Medium": "FFF2CC",
    "Low": "E2EFDA"
}

for row_idx, d in enumerate(defects_15, 5):
    vals = [
        d["id"], d["title"], d["module"], d["desc"],
        d["pre"], d["steps"], d["data"], d["expected"],
        d["actual"], d["severity"], d["priority"],
        d["repro"], d["evidence"], d["reported_by"], d["status"]
    ]
    ws.row_dimensions[row_idx].height = 45
    for col_idx, val in enumerate(vals, 1):
        c = ws.cell(row=row_idx, column=col_idx, value=val)
        c.font = cell_font
        c.border = thin_border
        
        if col_idx in [1, 10, 11, 12, 14, 15]:
            c.alignment = Alignment(horizontal="center", vertical="center")
        else:
            c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            
        if col_idx == 1:
            c.font = Font(name="Arial", size=10, bold=True, color="1F497D")
        elif col_idx == 10 and val in sev_colors:
            c.fill = PatternFill(start_color=sev_colors[val], end_color=sev_colors[val], fill_type="solid")
            c.font = Font(name="Arial", size=10, bold=True)
        elif col_idx == 15:
            c.fill = PatternFill(start_color="DDEBF7", end_color="DDEBF7", fill_type="solid")
            c.font = Font(name="Arial", size=10, bold=True, color="1F497D")

# Column Widths
col_widths = {
    1: 15,  # Defect ID
    2: 32,  # Title
    3: 26,  # Module
    4: 38,  # Description
    5: 26,  # Preconditions
    6: 38,  # Steps
    7: 24,  # Data
    8: 32,  # Expected
    9: 32,  # Actual
    10: 13, # Severity
    11: 11, # Priority
    12: 16, # Repro
    13: 38, # Evidence
    14: 14, # Reported By
    15: 14  # Status
}

for col_idx, width in col_widths.items():
    ws.column_dimensions[get_column_letter(col_idx)].width = width

out1 = r"23130350_HuynhThiThanhTruc\Group13_Defect_Report_Truc.xlsx"
out2 = r"E:\Group13_Defect_Report_Truc.xlsx"
wb.save(out1)
try:
    wb.save(out2)
except Exception:
    pass
print("Saved Trúc file successfully!")

# Also generate the full group template file with Trúc filled in and others ready
wb_group = openpyxl.Workbook()
ws_g = wb_group.active
ws_g.title = "Defect Report - Nhóm 13"

# Copy Trúc content to ws_g
current_r = 1

# Setup group members
members = [
    ("TRÚC", "Trúc (Huỳnh Thị Thanh Trúc - 23130350)", "1) Quản lý Thông tin Khách hàng (Admin)   2) Quản lý Vai trò Khách hàng (Admin)   3) Giỏ hàng (Shopping Cart - Storefront)", defects_15),
    ("PHƯỚC", "Phước", "1) …………   2) …………   3) …………", []),
    ("NGUYÊN", "Nguyên", "1) …………   2) …………   3) …………", []),
    ("ĐOÀN", "Đoàn", "1) …………   2) …………   3) …………", []),
    ("DUY", "Duy", "1) …………   2) …………   3) …………", [])
]

for m_tag, m_name, m_funcs, m_data in members:
    # Title
    ws_g.merge_cells(start_row=current_r, start_column=1, end_row=current_r, end_column=15)
    c_title = ws_g.cell(row=current_r, column=1, value=f"DEFECT REPORT – {m_tag}")
    c_title.fill = title_fill
    c_title.font = Font(name="Arial", size=13, bold=True, color="FFFFFF")
    c_title.alignment = Alignment(horizontal="center", vertical="center")
    ws_g.row_dimensions[current_r].height = 30
    current_r += 1
    
    # Member
    ws_g.cell(row=current_r, column=1, value="Thành viên").font = meta_label_font
    ws_g.cell(row=current_r, column=2, value=m_name).font = meta_val_font
    ws_g.row_dimensions[current_r].height = 20
    current_r += 1
    
    # Funcs
    ws_g.cell(row=current_r, column=1, value="Chức năng phân công").font = meta_label_font
    ws_g.cell(row=current_r, column=2, value=m_funcs).font = meta_val_font
    ws_g.row_dimensions[current_r].height = 22
    current_r += 1
    
    # Header
    ws_g.row_dimensions[current_r].height = 28
    for col_idx, h in enumerate(headers, 1):
        c = ws_g.cell(row=current_r, column=col_idx, value=h)
        c.fill = header_fill
        c.font = white_bold
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = thin_border
    current_r += 1
    
    # Data rows
    if m_data:
        for d in m_data:
            vals = [
                d["id"], d["title"], d["module"], d["desc"],
                d["pre"], d["steps"], d["data"], d["expected"],
                d["actual"], d["severity"], d["priority"],
                d["repro"], d["evidence"], d["reported_by"], d["status"]
            ]
            ws_g.row_dimensions[current_r].height = 42
            for col_idx, val in enumerate(vals, 1):
                c = ws_g.cell(row=current_r, column=col_idx, value=val)
                c.font = cell_font
                c.border = thin_border
                if col_idx in [1, 10, 11, 12, 14, 15]:
                    c.alignment = Alignment(horizontal="center", vertical="center")
                else:
                    c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
                if col_idx == 1:
                    c.font = Font(name="Arial", size=10, bold=True, color="1F497D")
                elif col_idx == 10 and val in sev_colors:
                    c.fill = PatternFill(start_color=sev_colors[val], end_color=sev_colors[val], fill_type="solid")
                    c.font = Font(name="Arial", size=10, bold=True)
                elif col_idx == 15:
                    c.fill = PatternFill(start_color="DDEBF7", end_color="DDEBF7", fill_type="solid")
                    c.font = Font(name="Arial", size=10, bold=True, color="1F497D")
            current_r += 1
    else:
        # 15 empty placeholder rows
        for i in range(15):
            ws_g.row_dimensions[current_r].height = 20
            for col_idx in range(1, 16):
                c = ws_g.cell(row=current_r, column=col_idx)
                c.border = thin_border
                if col_idx == 14:
                    c.value = m_name
                    c.alignment = Alignment(horizontal="center", vertical="center")
                elif col_idx == 15:
                    c.value = "New"
                    c.alignment = Alignment(horizontal="center", vertical="center")
            current_r += 1
            
    current_r += 1 # Empty row between members

# Apply col widths
for col_idx, width in col_widths.items():
    ws_g.column_dimensions[get_column_letter(col_idx)].width = width

out_g1 = r"23130350_HuynhThiThanhTruc\Group13_Defect_Report_Full_Group.xlsx"
out_g2 = r"E:\Group13_Defect_Report_Full_Group.xlsx"
wb_group.save(out_g1)
try:
    wb_group.save(out_g2)
except Exception:
    pass
print("Saved Full Group file successfully!")
