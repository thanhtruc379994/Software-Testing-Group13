# BÁO CÁO PHÂN TÍCH CHỨC NĂNG (FUNCTION ANALYSIS)
**Học phần:** Software Testing (Assignment 10 – Final Project) | **Nhóm:** Group 13  
**Thành viên thực hiện:** Huỳnh Thị Thanh Trúc (MSSV: 23130350) | **Giảng viên hướng dẫn:** ThS. Trần Thị Thanh Nga  
**Hệ thống kiểm thử (AUT):** nopCommerce System (v4.60 Localhost / Demo)  
• **Storefront URL:** http://localhost:8080/ (hoặc https://demo.nopcommerce.com/)  
• **Admin Portal URL:** http://localhost:8080/Admin (hoặc https://admin-demo.nopcommerce.com/)  

---

## 1. DANH SÁCH CHỨC NĂNG ĐƯỢC PHÂN CÔNG

Bảng dưới đây thống kê 03 chức năng cốt lõi được phân công phụ trách cho sinh viên **Huỳnh Thị Thanh Trúc** trong đồ án kiểm thử phần mềm hệ thống thương mại điện tử nopCommerce:

| STT | Tên chức năng | Phân hệ | Đường dẫn (URL / Navigation) | Actor chính | Mức ưu tiên | Phạm vi kiểm thử |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **1** | **Quản lý Thông tin Khách hàng (Customer Info Management)** | Admin Portal (Customer Management) | `/Admin/Customer/List`<br>(Customers ➔ Customers) | Quản trị viên (Administrator), Chăm sóc khách hàng (Support Staff) | **Rất cao (Critical)** | Quản lý danh sách, tìm kiếm đa tiêu chí (Email, Name, DoB, Company, Role), thêm mới khách hàng, kiểm tra tính hợp lệ dữ liệu (Email format, Password policy, Duplicate email), chỉnh sửa hồ sơ, đổi mật khẩu, gán nhiều vai trò (Customer Roles), xuất khẩu dữ liệu và xóa khách hàng. |
| **2** | **Quản lý Vai trò Khách hàng (Customer Roles Management)** | Admin Portal (Customer Management) | `/Admin/CustomerRole/List`<br>(Customers ➔ Customer roles) | Quản trị viên hệ thống (Administrator) | **Cao (High)** | Quản trị danh sách vai trò, tạo mới vai trò, cấu hình thuộc tính (Free shipping, Tax exempt, Active), liên kết sản phẩm (Purchasable with product), kiểm tra ràng buộc vai trò hệ thống (Administrators, Guests, Registered), bảo vệ trường System Name và kiểm soát thao tác xóa vai trò. |
| **3** | **Giỏ hàng & Mua sắm (Shopping Cart)** | Client Storefront (Customer Experience) | `/cart`<br>(Header Shopping Cart) | Khách vãng lai (Guest), Khách hàng đã đăng nhập (Registered) | **Rất cao (Critical)** | Thêm sản phẩm từ trang chủ và trang chi tiết, xử lý tùy chọn bắt buộc (Attributes), cập nhật số lượng (Boundary, 0, số âm, tồn kho), tự động tính thành tiền/tổng tiền, áp dụng Coupon/Gift card, ước tính phí vận chuyển, kiểm tra đồng ý điều khoản dịch vụ và điều hướng Checkout. |

---

## 2. PHÂN TÍCH CHI TIẾT CHỨC NĂNG 1: ADMIN - CUSTOMER INFO MANAGEMENT

### 2.1. Mô tả mục đích và nghiệp vụ của chức năng
Chức năng **Quản lý Thông tin Khách hàng (Customer Info Management)** là phân hệ trung tâm trong việc quản lý dữ liệu người dùng của nopCommerce. Phân hệ này cho phép Quản trị viên giám sát toàn diện thông tin cá nhân, hồ sơ tài khoản, tình trạng kích hoạt, lịch sử hoạt động và phân quyền truy cập của toàn bộ khách hàng trên hệ thống. Chức năng cung cấp bộ lọc tìm kiếm chuyên sâu, cơ chế kiểm tra tính hợp lệ dữ liệu nghiêm ngặt và tính năng thay đổi mật khẩu trực tiếp từ phía trang quản trị.

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Đường dẫn** | `/Admin/Customer/List` (Thêm mới: `/Admin/Customer/Create`, Sửa: `/Admin/Customer/Edit/{id}`) |
| **Actor** | Quản trị viên hệ thống (Administrator), Nhân viên hỗ trợ (Support Agent) |
| **Tiền điều kiện** | Quản trị viên đã đăng nhập thành công vào Admin Portal với tài khoản có quyền truy cập module `Customer`. |
| **Hậu điều kiện** | Dữ liệu khách hàng được lưu trữ/cập nhật an toàn trong cơ sở dữ liệu (`Customer` table); phân quyền và trạng thái tài khoản có hiệu lực ngay lập tức khi khách hàng đăng nhập ngoài Storefront. |
| **Nghiệp vụ chính** | • Hiển thị danh sách khách hàng dạng bảng với phân trang động (Page size: 7, 15, 20, 50, 100).<br>• Tìm kiếm và lọc khách hàng theo: Email, First name, Last name, Ngày sinh (Month/Day), Company name, Customer roles, và Trạng thái kích hoạt (Active: All / Yes / No).<br>• Thêm mới tài khoản khách hàng thủ công kèm validation ràng buộc Email duy nhất, định dạng mật khẩu, và gán vai trò ban đầu.<br>• Chỉnh sửa hồ sơ khách hàng, cập nhật thông tin cá nhân, địa chỉ thanh toán/giao hàng, và thiết lập ghi chú (Admin comment).<br>• Đổi mật khẩu trực tiếp cho khách hàng từ giao diện quản trị.<br>• Xóa tài khoản khách hàng khỏi hệ thống kèm xác nhận hộp thoại an toàn. |

### 2.2. Các luồng xử lý chính (Main Workflows)

#### Luồng 1: Xem danh sách và Tìm kiếm / Lọc khách hàng (Search & Filter Customer Grid)
1. Quản trị viên truy cập vào Admin Portal ➔ Chọn menu `Customers` ➔ Click `Customers`.
2. Hệ thống tải trang `/Admin/Customer/List`, hiển thị bảng DataTables chứa danh sách khách hàng gồm các cột: Email, Name, Customer roles, Company name, Active, Created on, Edit.
3. Tại khối Search, Quản trị viên nhập các tiêu chí lọc: Email, First name, Last name, Ngày sinh, Customer roles, Trạng thái Active.
4. Nhấp nút **[Search]**.
5. Hệ thống kích hoạt Ajax request, truy vấn cơ sở dữ liệu và hiển thị danh sách các khách hàng thỏa mãn đồng thời tất cả các tiêu chí lọc. Nếu không có kết quả, hiển thị thông báo *"No data available in table"*.

#### Luồng 2: Thêm mới tài khoản khách hàng (Create New Customer)
1. Tại trang danh sách khách hàng, Quản trị viên nhấp nút **[Add new]** ở góc trên bên phải.
2. Hệ thống chuyển hướng sang form `/Admin/Customer/Create`.
3. Quản trị viên điền các trường thông tin: Email, Password, First name, Last name, Customer roles, Active.
4. Quản trị viên nhấp nút **[Save]** (hoặc **[Save and Continue Edit]**).
5. Hệ thống kiểm tra tính hợp lệ dữ liệu phía server: mã hóa mật khẩu, lưu khách hàng mới vào cơ sở dữ liệu và hiển thị thông báo thành công. Nếu không hợp lệ, hiển thị thông báo lỗi tương ứng.

#### Luồng 3: Chỉnh sửa hồ sơ và Đặt lại mật khẩu (Edit Profile & Change Password)
1. Tại một dòng khách hàng trong bảng danh sách, Quản trị viên nhấp nút **[Edit]**.
2. Hệ thống chuyển sang trang `/Admin/Customer/Edit/{id}` hiển thị đầy đủ thông tin hiện hành của khách hàng.
3. Quản trị viên cập nhật các trường thông tin cá nhân hoặc địa chỉ.
4. Tại trường **Password**, Quản trị viên nhập mật khẩu mới và nhấp nút **[Change password]**.
5. Hệ thống cập nhật mật khẩu mã hóa mới và thông báo *"Password has been changed"*.
6. Quản trị viên nhấp **[Save]** để lưu toàn bộ các thay đổi khác và quay về danh sách.

#### Luồng 4: Xóa khách hàng khỏi hệ thống (Delete Customer)
1. Tại trang chỉnh sửa khách hàng (`/Admin/Customer/Edit/{id}`), Quản trị viên nhấp nút **[Delete]** ở thanh công cụ phía trên.
2. Hệ thống hiển thị hộp thoại xác nhận: *"Are you sure you want to delete this item?"*.
3. Quản trị viên bấm xác nhận xóa: hệ thống thực hiện xóa an toàn trong CSDL, quay về danh sách và hiển thị thông báo thành công.

### 2.3. Điều kiện đầu vào và đầu ra (Input & Output Specifications)

| Tên trường (Input Field) | Kiểu dữ liệu | Bắt buộc | Ràng buộc / Định dạng dữ liệu |
| :--- | :--- | :---: | :--- |
| **Email** | String | **Có** | Định dạng email chuẩn RFC (chứa ký tự `@` và tên miền hợp lệ); tối đa 1000 ký tự; **bắt buộc duy nhất (Unique)** trong CSDL. |
| **Password** | String | **Có (khi tạo mới)** | Chuỗi ký tự mật khẩu; tối thiểu 6 ký tự (theo chính sách bảo mật); hỗ trợ ký tự chữ, số và ký tự đặc biệt. |
| **First name / Last name** | String | Không | Tối đa 400 ký tự; hỗ trợ ký tự Unicode tiếng Việt. |
| **Gender** | Radio Button | Không | Chọn `Male` (Nam) hoặc `Female` (Nữ). |
| **Date of birth** | DatePicker / Dropdown | Không | Định dạng ngày tháng hợp lệ; không được lớn hơn ngày hiện tại. |
| **Company name** | String | Không | Tối đa 400 ký tự. |
| **Customer roles** | Multi-select Dropdown | **Có** | Bắt buộc gán ít nhất một vai trò hợp lệ (mặc định: `Registered`). |
| **Active** | Boolean | Không | Checkbox (`true`/`false`); bật/tắt khả năng đăng nhập của khách hàng. |

| Thành phần giao diện / Dữ liệu | Loại đầu ra | Kết quả mong đợi |
| :--- | :--- | :--- |
| **Bảng danh sách Customers** | Data Table (Ajax) | Hiển thị các cột: Email, Name, Customer roles, Company name, Active, Created on, Edit link; phân trang và sắp xếp chính xác. |
| **Thanh thông báo thành công** | UI Alert Banner | Hiển thị thông báo màu xanh: *"The new customer has been added successfully."* hoặc *"The customer has been updated successfully."*. |
| **Thông báo lỗi Validation** | Inline Error Text | Xuất hiện dòng chữ đỏ dưới trường vi phạm: *"Valid Email is required"*, *"The specified email already exists"*, *"Please enter a password"*. |
| **Popup xác nhận xóa** | Modal Dialog | Hộp thoại cảnh báo với hai nút **[Delete]** và **[Cancel]**. |

### 2.4. Các quy tắc nghiệp vụ (Business Rules)

| Mã quy tắc | Tên quy tắc nghiệp vụ | Quy tắc xử lý chi tiết |
| :---: | :--- | :--- |
| **BR-CUST-01** | **Tính duy nhất của địa chỉ Email** | Trường Email là định danh tài khoản duy nhất của khách hàng trên toàn hệ thống. Không cho phép tạo mới hoặc chỉnh sửa Email trùng với một tài khoản khác đã có trong cơ sở dữ liệu. Khi trùng lặp, hệ thống phải chặn lưu và báo lỗi *"The specified email already exists"*. |
| **BR-CUST-02** | **Chính sách mật khẩu an toàn** | Mật khẩu tài khoản phải tuân thủ chính sách mật khẩu (Password policy) của nopCommerce: tối thiểu 6 ký tự. Hệ thống phải từ chối các mật khẩu quá ngắn hoặc rỗng. |
| **BR-CUST-03** | **Ràng buộc vai trò tối thiểu (Mandatory Roles)** | Một tài khoản khách hàng bắt buộc phải thuộc về ít nhất một vai trò (`Registered` hoặc `Guests`). Hệ thống không cho phép lưu khách hàng khi bỏ chọn toàn bộ Customer roles. |
| **BR-CUST-04** | **Trạng thái kích hoạt (Active Status)** | Khách hàng ở trạng thái `Active = False` sẽ bị chặn đăng nhập tức thì ngoài Storefront kèm thông báo lỗi tài khoản bị khóa, nhưng dữ liệu lịch sử đơn hàng của họ trong quá khứ vẫn được bảo toàn. |
| **BR-CUST-05** | **Ràng buộc gán vai trò Vendor** | Khi một khách hàng được gán vai trò `Vendors`, trường cấu hình liên kết tài khoản Nhà cung cấp (`Manager of vendor`) bắt buộc phải được chọn để xác định quyền quản trị gian hàng. |
| **BR-CUST-06** | **Xóa an toàn & Bảo toàn đơn hàng** | Khi xóa một khách hàng đã phát sinh đơn hàng (Orders) trong quá khứ, hệ thống phải xử lý xóa logic (Soft Delete), không làm hỏng khóa ngoại (Foreign Key) của các bảng Order/Invoice. |
| **BR-CUST-07** | **Bảo mật quyền truy cập Quản trị** | Toàn bộ các route `/Admin/Customer/*` chỉ cho phép truy cập đối với Quản trị viên có quyền `Manage Customers`. Mọi phiên làm việc chưa xác thực phải bị điều hướng về trang đăng nhập `/login`. |

### 2.5. Các trường hợp ngoại lệ và tình huống phát sinh lỗi (Exceptions & Edge Cases)

| Phân loại | Tình huống ngoại lệ / Biên | Hành vi mong đợi & Cơ chế xử lý an toàn |
| :--- | :--- | :--- |
| **Validation & Biên** | Nhập email thiếu ký tự `@` (ví dụ: `email.com`) | Báo lỗi inline format ngay tại ô nhập liệu: *"Wrong email"* hoặc *"Please enter a valid email address"*. |
| **Validation & Biên** | Nhập email có khoảng trắng ở đầu hoặc cuối (` user@gmail.com `) | Hệ thống tự động gọi hàm `.trim()` để loại bỏ khoảng trắng thừa trước khi kiểm tra và lưu vào CSDL. |
| **Validation & Biên** | Mật khẩu chỉ nhập 1 đến 3 ký tự (quá ngắn) | Hệ thống phải kích hoạt validation chặn lưu và thông báo mật khẩu phải có ít nhất 6 ký tự. *(Ghi nhận `DEF_CUST_01`)*. |
| **Validation & Biên** | Form thêm mới chỉ có 1 ô Password, thiếu ô Confirm Password | Cần bổ sung ô nhập lại mật khẩu để tránh Quản trị viên gõ nhầm chính tả mà không phát hiện được. *(Ghi nhận `DEF_CUST_02`)*. |
| **Dữ liệu lọc** | Chọn bộ lọc Ngày sinh với Tháng bắt đầu > Tháng kết thúc | Form lọc phải cảnh báo khoảng thời gian không hợp lệ hoặc tự động hoán vị hai mốc ngày. *(Ghi nhận `DEF_CUST_03`)*. |
| **Bảo mật & Tấn công** | Nhập mã XSS vào ô First name (`<script>alert(1)</script>`) | Hệ thống phải áp dụng cơ chế HTML Encoding khi hiển thị trên DataTables để ngăn script độc hại thực thi trên trình duyệt Admin. |
| **Bảo mật & Tấn công** | Tấn công SQL Injection vào ô Search Email (`' OR '1'='1`) | Phải sử dụng Entity Framework Parameterized Queries để so khớp chuỗi an toàn, không làm lộ dữ liệu. |
| **Quản lý trạng thái** | Xóa chính tài khoản Admin đang đăng nhập phiên hiện tại | Hệ thống phải nhận diện ID của phiên làm việc hiện hành và chặn không cho phép Quản trị viên tự xóa chính mình. |

---

## 3. PHÂN TÍCH CHI TIẾT CHỨC NĂNG 2: ADMIN - CUSTOMER ROLES MANAGEMENT

### 3.1. Mô tả mục đích và nghiệp vụ của chức năng
Chức năng **Quản lý Vai trò Khách hàng (Customer Roles Management)** đóng vai trò là xương sống trong mô hình kiểm soát truy cập dựa trên vai trò (**RBAC - Role-Based Access Control**) của nopCommerce. Chức năng cho phép Quản trị viên thiết lập các nhóm người dùng với các đặc quyền và chính sách giá/vận chuyển riêng biệt (ví dụ: *Administrators, Registered, Guests, Vendors, VIP Customers*). Hệ thống phân tách rõ ràng giữa các vai trò hệ thống bất biến (System Roles) và các vai trò tùy chỉnh do người dùng tạo thêm.

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Đường dẫn** | `/Admin/CustomerRole/List` (Thêm mới: `/Admin/CustomerRole/Create`, Sửa: `/Admin/CustomerRole/Edit/{id}`) |
| **Actor** | Quản trị viên hệ thống cấp cao (System Administrator) |
| **Tiền điều kiện** | Đã đăng nhập vào trang quản trị với quyền hạn `Manage Customers & Roles`. |
| **Hậu điều kiện** | Vai trò được tạo/cập nhật trong bảng `CustomerRole`; các chính sách chiết khấu, miễn phí vận chuyển hoặc phân quyền menu sẽ được áp dụng cho toàn bộ người dùng thuộc vai trò này. |
| **Nghiệp vụ chính** | • Hiển thị danh sách tất cả các vai trò người dùng trong hệ thống.<br>• Phân biệt giữa vai trò hệ thống (`Is system role = True`) và vai trò tự tạo.<br>• Tạo mới vai trò khách hàng (/Admin/CustomerRole/Create) với cấu hình: Name, Free shipping, Tax exempt, Active.<br>• Cấu hình liên kết sản phẩm cần mua để đạt vai trò (Purchasable with product).<br>• Chỉnh sửa thông tin vai trò và bảo vệ các trường định danh hệ thống (System name).<br>• Xóa vai trò tùy chỉnh kèm cơ chế chặn xóa đối với vai trò mặc định của hệ thống. |

### 3.2. Các luồng xử lý chính (Main Workflows)

#### Luồng 1: Xem danh sách vai trò khách hàng (View Roles Grid)
1. Quản trị viên mở menu `Customers` ➔ Click chọn `Customer roles`.
2. Hệ thống tải trang `/Admin/CustomerRole/List`, hiển thị bảng danh sách các vai trò gồm các cột: Name, Free shipping, Tax exempt, Active, Is system role, Edit.

#### Luồng 2: Thêm mới vai trò khách hàng tùy chỉnh (Create Custom Role)
1. Tại trang danh sách vai trò, Quản trị viên nhấp nút **[Add new]**.
2. Hệ thống tải form tạo mới `/Admin/CustomerRole/Create`.
3. Quản trị viên điền các thông tin: Name, Free shipping, Tax exempt, Active. (Tùy chọn) Chọn sản phẩm liên kết.
4. Nhấp nút **[Save]**. Hệ thống kiểm tra hợp lệ, lưu vào CSDL và thông báo: *"The new customer role has been added successfully."*.

#### Luồng 3: Chỉnh sửa và Cấu hình thuộc tính vai trò (Edit Role Configuration)
1. Quản trị viên nhấp nút **[Edit]** tại vai trò muốn chỉnh sửa.
2. Hệ thống mở trang `/Admin/CustomerRole/Edit/{id}`.
3. Quản trị viên thay đổi tên hiển thị, bật/tắt các thuộc tính Free shipping, Tax exempt, hoặc bỏ tích chọn Active.
4. Nhấp nút **[Save]**. Toàn bộ khách hàng thuộc vai trò này sẽ lập tức được áp dụng các chính sách mới ngoài Storefront.

#### Luồng 4: Bảo vệ và Chặn xóa đối với Vai trò hệ thống (System Roles Protection)
1. Quản trị viên mở danh sách hoặc trang chỉnh sửa của các vai trò hệ thống (*Administrators, Guests, Registered*).
2. Hệ thống nhận diện cờ `IsSystemRole = True`: trường System name phải bị vô hiệu hóa (`disabled`), nút [Delete] phải bị ẩn.
3. Nếu cố tình xóa qua URL API, hệ thống chặn lại và báo lỗi: *"You cannot delete system customer role."*.

### 3.3. Điều kiện đầu vào và đầu ra (Input & Output Specifications)

| Tên trường (Input Field) | Kiểu dữ liệu | Bắt buộc | Ràng buộc / Định dạng dữ liệu |
| :--- | :--- | :---: | :--- |
| **Name** | String | **Có** | Tên hiển thị của vai trò; tối đa 255 ký tự; **phải là duy nhất** để tránh trùng lặp nhận diện. |
| **Free shipping** | Boolean | Không | Checkbox (`true`/`false`); mặc định là `false`. |
| **Tax exempt** | Boolean | Không | Checkbox (`true`/`false`); mặc định là `false`. |
| **Active** | Boolean | Không | Checkbox (`true`/`false`); mặc định là `true`. |
| **System name** | String | Cố định | Tên kỹ thuật hệ thống (ví dụ: `Administrators`); chỉ sinh tự động cho system role và **bắt buộc bị khóa**. |
| **Purchasable with product** | Integer | Không | ID sản phẩm liên kết; chọn thông qua cửa sổ popup tìm kiếm sản phẩm. |

| Thành phần giao diện / Dữ liệu | Loại đầu ra | Kết quả mong đợi |
| :--- | :--- | :--- |
| **Bảng danh sách Roles** | Data Table | Danh sách hiển thị đủ 5 vai trò hệ thống ban đầu kèm các vai trò tự tạo; các cột hiển thị đúng icon boolean. |
| **Cảnh báo lỗi trùng tên** | Validation Alert | Thông báo lỗi đỏ: *"Customer role name already exists"* khi nhập tên vai trò đã có. |
| **Thuộc tính Is system role** | UI Badge / Icon | Hiển thị icon dấu tick xanh (`fa-check`) cố định đối với vai trò hệ thống, ngăn chỉnh sửa. |

### 3.4. Các quy tắc nghiệp vụ (Business Rules)

| Mã quy tắc | Tên quy tắc nghiệp vụ | Quy tắc xử lý chi tiết |
| :---: | :--- | :--- |
| **BR-ROLE-01** | **Tính duy nhất của Tên vai trò** | Tên vai trò khách hàng (Name) là cơ sở hiển thị duy nhất. Hệ thống không được phép cho tạo nhiều vai trò có cùng tên để ngăn ngừa nhầm lẫn khi phân quyền người dùng. |
| **BR-ROLE-02** | **Bất biến của Vai trò hệ thống** | Các vai trò cốt lõi (`Administrators`, `Registered`, `Guests`, `ForumModerators`, `Vendors`) có cờ `IsSystemRole = True`. Hệ thống tuyệt đối cấm xóa các vai trò này và cấm sửa trường `SystemName`. |
| **BR-ROLE-03** | **Ưu đãi Miễn phí vận chuyển tự động** | Khi một khách hàng thuộc vai trò có cấu hình `FreeShipping = True` mua hàng tại Storefront, hệ thống tự động miễn phí toàn bộ chi phí vận chuyển trong bước Checkout (Shipping fee = 0). |
| **BR-ROLE-04** | **Ưu đãi Miễn trừ thuế tự động** | Khách hàng thuộc vai trò có `TaxExempt = True` sẽ không bị tính thuế giá trị gia tăng (Tax = 0) trên toàn bộ sản phẩm và dịch vụ trong giỏ hàng. |
| **BR-ROLE-05** | **Ảnh hưởng của trạng thái Inactive** | Khi một vai trò chuyển sang trạng thái `Active = False`, các đặc quyền của vai trò đó phải bị đình chỉ ngay lập tức đối với tất cả người dùng thuộc nhóm. |
| **BR-ROLE-06** | **Ràng buộc toàn vẹn khi xóa vai trò** | Chỉ cho phép xóa vai trò tự tạo khi vai trò đó không còn tài khoản nào đang được gán, hoặc hệ thống phải hiển thị cảnh báo di chuyển người dùng sang vai trò khác trước khi xóa. |

### 3.5. Các trường hợp ngoại lệ và tình huống phát sinh lỗi (Exceptions & Edge Cases)

| Phân loại | Tình huống ngoại lệ / Biên | Hành vi mong đợi & Cơ chế xử lý an toàn |
| :--- | :--- | :--- |
| **Validation & Biên** | Bỏ trống ô Tên vai trò (Name) rồi bấm Lưu | Báo lỗi validation bắt buộc: *"Please provide a name."*. |
| **Validation & Biên** | Nhập Tên vai trò có độ dài cực lớn (> 255 ký tự) | Thẻ `<input id="Name">` phải có thuộc tính `maxlength="255"` để chặn nhập quá độ dài CSDL. *(Lỗi nopCommerce: Thiếu thuộc tính maxlength - Ghi nhận `DEF_ROLE_01`)*. |
| **Validation & Biên** | Thêm mới vai trò trùng tên với vai trò đã có (`Administrators`) | Bắt lỗi trùng lặp và chặn lưu. *(Lỗi nopCommerce: Cho phép tạo trùng tên không báo lỗi - Ghi nhận `DEF_ROLE_02`)*. |
| **Bảo mật & Phân quyền** | Mở form sửa vai trò Administrators, trường System name vẫn sửa được | Trường System name phải bị `disabled` hoặc ẩn hoàn toàn. *(Lỗi nopCommerce: Bị để hở Enabled - Ghi nhận `DEF_ROLE_03`)*. |
| **Bảo mật & Phân quyền** | Bỏ chọn Active của vai trò có đông người dùng | Cần có hộp thoại cảnh báo số lượng người dùng bị ảnh hưởng trước khi lưu. *(Ghi nhận `DEF_ROLE_04`)*. |
| **Tính toàn vẹn** | Xóa vai trò tùy chỉnh đang có người dùng | Hiển thị modal chi tiết các tài khoản liên kết thay vì xóa thẳng sau một confirm đơn giản. *(Ghi nhận `DEF_ROLE_05`)*. |

---

## 4. PHÂN TÍCH CHI TIẾT CHỨC NĂNG 3: USER - SHOPPING CART (GIỎ HÀNG STOREFRONT)

### 4.1. Mô tả mục đích và nghiệp vụ của chức năng
Chức năng **Giỏ hàng (Shopping Cart)** là mắt xích trực tiếp quyết định tỷ lệ chuyển đổi đơn hàng và doanh thu của website thương mại điện tử nopCommerce. Chức năng cho phép cả khách vãng lai (Guest) và khách hàng thành viên (Registered) gom chọn sản phẩm, tùy biến cấu hình thuộc tính, cập nhật số lượng, áp dụng mã giảm giá/Gift card, dự toán chi phí vận chuyển/thuế, và chuẩn bị các điều kiện bắt buộc trước khi bước vào tiến trình Thanh toán (Checkout).

| Hạng mục | Nội dung chi tiết |
| :--- | :--- |
| **Đường dẫn** | `/cart` (Kèm Mini-cart flyout trên thanh Header của toàn bộ website) |
| **Actor** | Khách vãng lai (Guest Customer), Khách hàng thành viên đã đăng nhập (Registered Customer) |
| **Tiền điều kiện** | Khách hàng truy cập Storefront; sản phẩm trong Catalog ở trạng thái hiển thị và cho phép đặt hàng (`Published = True`, `DisableBuyButton = False`). |
| **Hậu điều kiện** | Dữ liệu giỏ hàng được lưu theo Session/Cookie (với Guest) hoặc lưu vào bảng `ShoppingCartItem` (với Registered); cập nhật đồng bộ lên badge số lượng trên Header. |
| **Nghiệp vụ chính** | • Thêm sản phẩm vào giỏ từ trang chủ, danh mục hoặc chi tiết sản phẩm.<br>• Kiểm tra thuộc tính bắt buộc (RAM, HDD, Size, Color).<br>• Hiển thị chi tiết giỏ hàng: SKU, ảnh, tên, đơn giá, số lượng (Qty), thành tiền và tổng tiền.<br>• Cập nhật số lượng sản phẩm linh hoạt với cơ chế Ajax Auto-update.<br>• Xóa từng sản phẩm hoặc làm rỗng giỏ hàng.<br>• Áp dụng mã giảm giá (Discount code) và thẻ quà tặng (Gift card).<br>• Ước tính phí vận chuyển theo quốc gia và mã bưu chính (Estimate shipping).<br>• Kiểm tra đồng ý Điều khoản dịch vụ (Terms of service) trước khi chuyển sang Checkout.<br>• Tự động gộp giỏ hàng vãng lai vào tài khoản sau khi khách hàng đăng nhập. |

### 4.2. Các luồng xử lý chính (Main Workflows)

#### Luồng 1: Thêm sản phẩm vào giỏ hàng (Add Product to Cart)
1. Khách hàng xem sản phẩm tại trang chủ hoặc trang chi tiết (`/build-your-own-computer`).
2. Khách hàng lựa chọn số lượng và các thuộc tính bắt buộc (RAM, HDD...).
3. Nhấp nút **[Add to cart]**: nếu đủ thông tin, sản phẩm được thêm vào giỏ, cập nhật icon giỏ hàng và hiện banner thông báo xanh. Nếu thiếu tùy chọn, hiển thị thông báo lỗi màu đỏ yêu cầu chọn đủ.

#### Luồng 2: Cập nhật số lượng và Tự động tính toán lại giá trị (Update Quantity & Recalculate)
1. Khách hàng vào trang giỏ hàng `/cart`.
2. Khách hàng thay đổi số lượng tại ô Qty (ví dụ: từ 1 thành 3), nhấn phím Enter hoặc nút **[Update shopping cart]**.
3. Hệ thống kiểm tra tồn kho: tính lại thành tiền (Đơn giá x Số lượng), cập nhật Sub-Total, Tax, Order Total. Nếu nhập Qty = 0, sản phẩm tự động bị xóa khỏi giỏ.

#### Luồng 3: Áp dụng Mã giảm giá và Thẻ quà tặng (Apply Coupon & Gift Card)
1. Tại khối Discount Box, khách hàng nhập mã coupon vào ô Discount code.
2. Nhấp nút **[Apply coupon]**. Hệ thống kiểm tra: nếu mã hợp lệ, trừ tiền chiết khấu vào tổng đơn hàng. Nếu mã sai/hết hạn, hiện thông báo lỗi rõ ràng.

#### Luồng 4: Tiến hành Thanh toán và Kiểm tra Điều khoản (Proceed to Checkout)
1. Khách hàng kiểm tra danh sách sản phẩm và tổng tiền.
2. Tích chọn checkbox **"I agree with the terms of service and I adhere to them unconditionally"**.
3. Nhấp nút **[Checkout]**: nếu chưa tích điều khoản, hiện popup cảnh báo. Nếu sản phẩm hết hàng, nút Checkout phải bị khóa. Nếu hợp lệ, chuyển sang `/onepagecheckout`.

### 4.3. Điều kiện đầu vào và đầu ra (Input & Output Specifications)

| Tên trường (Input Field) | Kiểu dữ liệu | Bắt buộc | Ràng buộc / Định dạng dữ liệu |
| :--- | :--- | :---: | :--- |
| **Quantity (Qty)** | Integer | **Có** | Số nguyên dương (≥ 1); không được là số âm, số thập phân hoặc ký tự chữ cái; phải nằm trong giới hạn Min/Max cart quantity và tồn kho. |
| **Product Attributes** | Dropdown / Radio | Có (nếu có tùy chọn bắt buộc) | Lựa chọn các giá trị thuộc tính tương ứng của sản phẩm (RAM, CPU, Size, Color). |
| **Discount code** | String | Không | Mã giảm giá; không phân biệt hoa thường; tối đa 100 ký tự. |
| **Gift card code** | String | Không | Mã thẻ quà tặng hợp lệ do hệ thống phát hành. |
| **Terms of service** | Boolean | **Có** | Checkbox bắt buộc phải tích chọn (true) mới được tiến hành thanh toán. |

| Thành phần giao diện / Dữ liệu | Loại đầu ra | Kết quả mong đợi |
| :--- | :--- | :--- |
| **Bảng tóm tắt giỏ hàng (Cart Table)** | Data Grid | Hiển thị đủ: Cột ảnh, Tên sản phẩm + Thuộc tính con, Đơn giá, Ô Qty, Thành tiền, Nút xóa [x]. |
| **Khối tổng tiền (Order Summary)** | Financial Summary | Hiển thị chính xác Sub-total, Shipping fee, Tax, Order Total định dạng đúng tiền tệ hiện hành ($ / €). |
| **Thanh thông báo nổi (Bar notification)** | UI Banner | Trượt từ trên cùng xuống: Màu xanh khi thêm thành công, Màu đỏ khi gặp lỗi validation. |
| **Trạng thái giỏ rỗng** | Empty State UI | Khi không còn sản phẩm, hiển thị thông điệp: *"Your Shopping Cart is empty!"*. |

### 4.4. Các quy tắc nghiệp vụ (Business Rules)

| Mã quy tắc | Tên quy tắc nghiệp vụ | Quy tắc xử lý chi tiết |
| :---: | :--- | :--- |
| **BR-CART-01** | **Cộng dồn số lượng khi thêm trùng** | Khi người dùng thêm sản phẩm đã có sẵn trong giỏ (cùng cấu hình thuộc tính), hệ thống tự động tăng số lượng (Qty = Qty_cũ + Qty_mới) mà không tạo dòng mới. |
| **BR-CART-02** | **Xử lý số lượng tối thiểu và tối đa** | Nếu sản phẩm có cấu hình số lượng mua tối thiểu hoặc tối đa, hệ thống bắt buộc số lượng trong giỏ nằm trong khoảng [Min, Max]. |
| **BR-CART-03** | **Cơ chế cập nhật tự động (Ajax trigger)** | nopCommerce 4.60 tự động kích hoạt cập nhật khi thay đổi giá trị trong ô Qty và rời khỏi ô (`onchange: $('#updatecart').trigger('click')`). |
| **BR-CART-04** | **Tính toàn vẹn kiểm tra tồn kho** | Khi sản phẩm trong giỏ bị hết hàng hoặc không đủ tồn kho khả dụng, hệ thống phải hiển thị cảnh báo hết hàng và vô hiệu hóa nút Checkout. |
| **BR-CART-05** | **Gộp giỏ hàng khi đăng nhập** | Khi khách vãng lai đã thêm hàng vào giỏ, sau đó Đăng nhập tài khoản, hệ thống tự động gộp giỏ hàng tạm thời vào giỏ hàng lưu trữ của tài khoản đó. |
| **BR-CART-06** | **Chặn thanh toán khi chưa duyệt điều khoản** | Checkbox đồng ý Điều khoản dịch vụ là bắt buộc. Nút Checkout phải chặn điều hướng và cảnh báo nếu người dùng chưa tích chọn ô này. |
| **BR-CART-07** | **Đồng bộ trạng thái đa tab** | Thay đổi số lượng hoặc xóa sản phẩm tại một tab giỏ hàng phải được đồng bộ chính xác khi người dùng tải lại trang ở tab khác hoặc mở Mini-cart trên header. |

### 4.5. Các trường hợp ngoại lệ và tình huống phát sinh lỗi (Exceptions & Edge Cases)

| Phân loại | Tình huống ngoại lệ / Biên | Hành vi mong đợi & Cơ chế xử lý an toàn |
| :--- | :--- | :--- |
| **Validation & Biên** | Nhập số lượng là số âm (-1) vào ô Qty | Form phải có thông báo lỗi validation rõ ràng *"Quantity must be positive"*. *(Lỗi nopCommerce: Tự xóa sản phẩm mà không hề thông báo lỗi - Ghi nhận `DEF_CART_02`)*. |
| **Validation & Biên** | Dán (paste) chuỗi chữ cái (abc) vào ô Qty | Ngăn chặn sự kiện dán ký tự không phải số ở client. *(Ghi nhận `DEF_CART_05`)*. |
| **Nghiệp vụ Storefront** | Bấm nút Add to cart tại trang chủ cho máy tính tùy biến | Thêm ngay vào giỏ theo cấu hình mặc định hoặc mở modal chọn options. *(Lỗi nopCommerce: Nhảy thẳng vào trang chi tiết mà chưa thêm giỏ - Ghi nhận `DEF_CART_01`)*. |
| **Nghiệp vụ Tồn kho** | Sản phẩm hết hàng xuất hiện cảnh báo tồn kho | Nút Checkout bắt buộc phải bị vô hiệu hóa (`disabled`). *(Lỗi nopCommerce: Nút Checkout vẫn Enabled cho bấm tiếp - Ghi nhận `DEF_CART_03`)*. |
| **Giao diện & Phản hồi** | Bấm Apply Coupon với ô nhập rỗng hoặc toàn khoảng trắng | Phải hiển thị thông báo lỗi rõ ràng. *(Lỗi nopCommerce: Thẻ thông báo lỗi bị gán `display: none` gây ẩn lỗi - Ghi nhận `DEF_CART_04`)*. |
| **Hiệu năng & Đồng bộ** | Mạng chậm, thay đổi số lượng giỏ hàng liên tục | Header Cart badge có độ trễ cập nhật số lượng sản phẩm. *(Ghi nhận `DEF_CART_06`)*. |

---

## 5. TỔNG HỢP ÁNH XẠ THIẾT KẾ KIỂM THỬ (TEST DESIGN & EXECUTION MAPPING)

Dưới đây là bảng tổng hợp kết quả thiết kế kịch bản và thực thi kiểm thử tự động hóa bằng **Playwright Test Framework** trên môi trường thực tế (Localhost Docker nopCommerce 4.60) cho cả 03 chức năng do sinh viên **Huỳnh Thị Thanh Trúc** phụ trách:

| Chức năng phụ trách | Phân hệ kiểm thử | Bộ Test Case ID | Tổng số Test Cases | Kết quả thực thi (Playwright) | Số Defect phát hiện |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **1. Quản lý Thông tin Khách hàng (Customer Info)** | Admin Portal | `cust_info_01` ➔ `cust_info_25` | 25 Test Cases | 23 Passed / 2 Failed (92.0%) | 04 Defects |
| **2. Quản lý Vai trò Khách hàng (Customer Roles)** | Admin Portal | `cust_role_01` ➔ `cust_role_20` | 20 Test Cases | 17 Passed / 3 Failed (85.0%) | 05 Defects |
| **3. Giỏ hàng & Mua sắm (Shopping Cart)** | Client Storefront | `cart_disp_01` ➔ `cart_inv_01` | 28 Test Cases | 25 Passed / 3 Failed (89.29%) | 06 Defects |
| **TỔNG CỘNG** | **Toàn bộ 3 Module** | **73 Test Cases chuẩn hóa** | **73 Test Cases** | **65 Passed / 8 Failed (89.04%)** | **15 Defects thực tế** |

---

### Danh mục 10 Defects thực tế tiêu biểu đã kiểm chứng và báo cáo (Matching Group13 Defect Report)

| STT | Mã Defect | Chức năng / Phân hệ | Tóm tắt hành vi lỗi phát hiện (Defect Summary) | Mức độ (Severity) | Mức ưu tiên (Priority) | Trạng thái |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: |
| **1** | `DEF_CUST_01` | Customer Info (Admin) | Form tạo mới khách hàng cho phép lưu mật khẩu quá ngắn (< 6 ký tự), vi phạm chính sách bảo mật (*Weak Password Policy*). | **High** | **P2** | New |
| **2** | `DEF_CUST_02` | Customer Info (Admin) | Form tạo mới khách hàng ở trang Admin chỉ có 1 ô Password, thiếu trường xác nhận mật khẩu (*Confirm Password*). | **Medium** | **P3** | New |
| **3** | `DEF_CUST_03` | Customer Info (Admin) | Bộ lọc tìm kiếm ngày sinh không bắt lỗi khi chọn khoảng thời gian ngược (Tháng bắt đầu: 12 > Tháng kết thúc: 01). | **Low** | **P4** | New |
| **4** | `DEF_ROLE_01` | Customer Roles (Admin) | Ô nhập Tên vai trò (Name) thiếu thuộc tính `maxlength='255'`, cho phép dán chuỗi ký tự vô hạn ở phía Client. | **Medium** | **P3** | New |
| **5** | `DEF_ROLE_02` | Customer Roles (Admin) | Hệ thống cho phép tạo mới nhiều vai trò trùng tên nhau (*Duplicate Role Name*), gây nhầm lẫn khi phân quyền. | **High** | **P2** | New |
| **6** | `DEF_ROLE_03` | Customer Roles (Admin) | Trường `System name` của vai trò hệ thống (Administrators) không bị vô hiệu hóa (`disabled`) khi sửa chi tiết vai trò. | **High** | **P2** | New |
| **7** | `DEF_ROLE_04` | Customer Roles (Admin) | Bỏ tích chọn Active của vai trò khách hàng nhưng không hiển thị cảnh báo xác nhận số lượng tài khoản bị ảnh hưởng. | **Low** | **P4** | New |
| **8** | `DEF_CART_01` | Shopping Cart (Storefront) | Nhấn nút [Add to cart] tại trang chủ cho sản phẩm có tùy chọn thì bị nhảy thẳng vào trang chi tiết, sản phẩm chưa được thêm giỏ. | **Medium** | **P3** | New |
| **9** | `DEF_CART_02` | Shopping Cart (Storefront) | Cập nhật số lượng sản phẩm trong giỏ thành số âm (`-1`) không hiển thị thông báo lỗi Validation cho người dùng. | **Medium** | **P3** | New |
| **10** | `DEF_CART_03` | Shopping Cart (Storefront) | Nút Thanh toán (Checkout) vẫn ở trạng thái Enabled bấm được khi sản phẩm trong giỏ bị cảnh báo hết hàng (*Out of stock*). | **High** | **P2** | New |
