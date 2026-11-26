# DỰ ÁN KIỂM THỬ TỰ ĐỘNG HỆ THỐNG NOPCOMMERCE (NHÓM 13)

> **Môn học:** Đảm bảo chất lượng và Kiểm thử phần mềm  
> **Nhóm thực hiện:** Nhóm 13  
> **Repository:** [https://github.com/thanhtruc379994/Tester](https://github.com/thanhtruc379994/Tester)

---

## 1. Project Overview (Tổng quan dự án)

Dự án này là đồ án thực hành môn Kiểm thử phần mềm, tập trung vào việc xây dựng bộ kiểm thử tự động End-to-End (E2E Testing) cho nền tảng thương mại điện tử mã nguồn mở **nopCommerce**.

Bộ kiểm thử bao gồm cả kiểm thử phía quản trị viên (**Admin Dashboard**) và phía người dùng cuối (**Customer/Storefront**), đảm bảo tính đúng đắn của các quy trình nghiệp vụ chính như quản lý danh mục, sản phẩm, đơn hàng, giao hàng, khách hàng, chương trình khuyến mãi, bài viết nội dung và giỏ hàng.

### Các liên kết tài liệu dự án
- **GitHub Repository URL:** [https://github.com/thanhtruc379994/Tester](https://github.com/thanhtruc379994/Tester)
- **Function Analysis URL:** [https://docs.google.com/document/d/1qhighUkc086JAuzBfUTuBbc6M3qhog14FgjCn0Mwd4c/edit?usp=sharing](https://docs.google.com/document/d/1qhighUkc086JAuzBfUTuBbc6M3qhog14FgjCn0Mwd4c/edit?usp=sharing)
- **Google Sheets – Test Cases URL:** [https://docs.google.com/spreadsheets/d/1BDj2GDrRwo57Pd_PU2GgXwDwqKWTOI15RB8Ds-x5Iqw/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1BDj2GDrRwo57Pd_PU2GgXwDwqKWTOI15RB8Ds-x5Iqw/edit?usp=sharing)
- **Google Sheets – Task Assignment & Progress URL:** [https://docs.google.com/spreadsheets/d/1pCoccrbKkJfXaAXW1ui2W3o84JUjxQJSs8s5MQHpoPg/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1pCoccrbKkJfXaAXW1ui2W3o84JUjxQJSs8s5MQHpoPg/edit?usp=sharing)
- **Google Sheets – Defect List URL:** [https://docs.google.com/spreadsheets/d/1fIbgGFcDGK1-eBBoK4P1DFotBlaJpOoryl_POzfWrok/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1fIbgGFcDGK1-eBBoK4P1DFotBlaJpOoryl_POzfWrok/edit?usp=sharing)
- **Google Slides – Final Presentation URL:** *Đợi bài cá nhân*
- **Google Drive – Test Report & Evidence URL (Xem Screenshots & Minh chứng kiểm thử):** [https://drive.google.com/drive/folders/1R86osQ2socVUL-MMhVIgLSae8S_RyIQ_?usp=sharing](https://drive.google.com/drive/folders/1R86osQ2socVUL-MMhVIgLSae8S_RyIQ_?usp=sharing)

---

## 2. Website được kiểm thử (Target System Under Test)

Hệ thống được kiểm thử là nền tảng thương mại điện tử **nopCommerce** (phiên bản 4.70 / 4.80 chạy trên nền ASP.NET Core & Microsoft SQL Server). Dự án hỗ trợ kiểm thử trên 2 môi trường:

### Môi trường 1: Local Docker Container (Khuyến nghị cho kiểm thử ổn định)
- **Trang chủ Cửa hàng:** [http://localhost:8080](http://localhost:8080)
- **Trang Quản trị (Admin):** [http://localhost:8080/Admin](http://localhost:8080/Admin)
- **Tài khoản Administrator mặc định:**
  - **Email:** `admin@yourstore.com` (hoặc `admin@yourStore.com`)
  - **Mật khẩu:** `Admin@123` (hoặc cấu hình tùy chọn trong Docker)

### Môi trường 2: nopCommerce Demo Server (Online)
- **Trang chủ Storefront:** [https://demo.nopcommerce.com](https://demo.nopcommerce.com)
- **Trang Quản trị (Admin):** [https://admin-demo.nopcommerce.com](https://admin-demo.nopcommerce.com)
- **Tài khoản Demo Admin:** `admin@yourstore.com` (Tự động điền trên form login của nopCommerce Demo)
- *Lưu ý:* Môi trường Demo Online có thể kích hoạt lớp bảo vệ Cloudflare Turnstile ("Verify you are human"). Dự án đã tích hợp sẵn cơ chế xử lý và persistent browser profile.

---

## 3. Danh sách thành viên (Team Members)

| STT | Họ và Tên | Mã số sinh viên (MSSV) | Email Sinh viên | GitHub Username | Module / Chức năng phụ trách |
|:---:|:---|:---:|:---|:---:|:---|
| 1 | **Trương Cao Doãn** | 23130064 | 23130064@st.hcmuaf.edu.vn | [@D04N](https://github.com/D04N) | **Sales & Orders Management**: Quản lý Đơn hàng (`orders`), Quản lý Giao hàng/Vận chuyển (`shipments`), Quản lý Thẻ quà tặng (`giftcards`). |
| 2 | **Nguyễn Hữu Duy** | 23130075 | 23130075@st.hcmuaf.edu.vn | [@DuyHuuNguyen](https://github.com/DuyHuuNguyen) | **Catalog Management**: Quản lý Sản phẩm (`admin_product`), Danh mục (`admin_categories`), Nhà sản xuất/Thương hiệu (`admin_manufacturer`). |
| 3 | **Mạc Chí Nguyên** | 23130211 | 23130211@st.hcmuaf.edu.vn | [@macchinguyen123](https://github.com/macchinguyen123) | **Content & User Search**: Quản lý Menu nội dung (`admin-content-menus`), Quản lý Topics/Trang tĩnh (`admin-content-topics`), Tìm kiếm & Lọc sản phẩm phía người dùng (`user-search-filter`). |
| 4 | **Lê Hữu Phước** | 23130251 | 23130251@st.hcmuaf.edu.vn | [@LeeHuuPhuoc]([https://github.com/lhphu]https://github.com/LeeHuuPhuoc) | **Promotions & Wishlist**: Quản lý Tiếp thị liên kết (`affiliates`), Quản lý Khuyến mãi/Giảm giá (`promotion`), Danh sách yêu thích phía người dùng (`wishlist`). |
| 5 | **Huỳnh Thị Thanh Trúc** | 23130350 | 23130350@st.hcmuaf.edu.vn | [@thanhtruc379994](https://github.com/thanhtruc379994) | **Customers & Cart**: Quản lý Thông tin khách hàng (`CustomerInfoMgmt`), Quản lý Vai trò khách hàng (`CustomerRoleMgmt`), Quản lý Giỏ hàng (`ShoppingCartMgmt`). |

---

## 4. Công nghệ và công cụ sử dụng (Tech Stack & Tools)

- **Ngôn ngữ kịch bản:** JavaScript (Node.js ES6+ / CommonJS)
- **Framework kiểm thử tự động:** [Playwright Test](https://playwright.dev/) (`^1.40+`)
- **Trình duyệt kiểm thử:** Google Chrome (Real Chrome Channel) / Chromium
- **Môi trường ảo hóa & Database (Local):**
  - **Docker & Docker Compose**: Điều phối các container nopCommerce Web và MS SQL Server.
  - **Microsoft SQL Server (MSSQL 2022 Express)**: Lưu trữ cơ sở dữ liệu nopCommerce mẫu.
- **Hệ thống CI/CD & Quản lý mã nguồn:** Git, GitHub, GitHub Actions (tự động chạy test suite khi có commit hoặc pull request).
- **Bộ công cụ tài liệu, thiết kế & lưu trữ:**
  - **Google Docs**: Soạn thảo tài liệu phân tích chức năng (Function Analysis).
  - **Google Sheets**: Xây dựng kịch bản kiểm thử (Test Cases), phân công & theo dõi tiến độ (Task Assignment) và quản lý danh sách lỗi (Defect List).
  - **Google Drive**: Lưu trữ tập trung toàn bộ tài liệu dự án, video và hình ảnh minh chứng kiểm thử (Screenshots & Evidence).
  - **Canva**: Thiết kế slide thuyết trình báo cáo tổng kết dự án (Final Presentation).
- **Công cụ báo cáo kiểm thử:**
  - Báo cáo HTML tĩnh theo 5 Phase (`reports/Phase-1.html` -> `Phase-5.html`).
  - Playwright HTML Reporter (kèm trace viewer, call log, execution time).

---

## 5. Cấu trúc thư mục (Directory Structure)

```text
Tester/
├── .github/
│   └── workflows/
│       └── playwright.yml            # Pipeline CI/CD chạy Playwright trên GitHub Actions
├── docker/
│   ├── docker-compose.yaml           # Cấu hình khởi chạy nopCommerce + MSSQL Server local
│   ├── note.txt                      # Hướng dẫn thông số cài đặt ban đầu cho nopCommerce local
│   └── .env
├── reports/                          # Các file HTML Report tổng hợp theo từng Phase kiểm thử
│   ├── Phase-1.html                  # Phase 1: Nền tảng Quản trị & Phân quyền (RBAC & Foundation)
│   ├── Phase-2.html                  # Phase 2: Quản trị Danh mục hàng hóa & Sản phẩm (Catalog Management)
│   ├── Phase-3.html                  # Phase 3: Tiếp thị & Khuyến mãi (Marketing & Promotions)
│   ├── Phase-4.html                  # Phase 4: Trải nghiệm Khách hàng trên Storefront (Storefront Customer Journey)
│   └── Phase-5.html                  # Phase 5: Xử lý Đơn hàng & Giao vận (Orders & Fulfillment)
├── test-scripts/                     # Thư mục chính chứa mã nguồn kiểm thử của các thành viên
│   ├── 23130064_TruongCaoDoan_TestScripts/
│   │   ├── orders.spec.js            # Test Scripts Quản lý Đơn hàng
│   │   ├── shipments.spec.js         # Test Scripts Quản lý Giao hàng
│   │   ├── giftcards.spec.js         # Test Scripts Quản lý Thẻ quà tặng
│   │   └── Group13_23130064_TruongCaoDoan.xlsx
│   ├── 23130075_NguyenHuuDuy_TestScripts/
│   │   ├── admin_product.spec.js     # Test Scripts Thêm mới, Tìm kiếm & Bulk Edit Sản phẩm
│   │   ├── admin_categories.spec.js  # Test Scripts Quản lý Danh mục
│   │   └── admin_manufacturer.spec.js# Test Scripts Quản lý Nhà sản xuất
│   ├── 23130211_MacChiNguyen_TestScripts/
│   │   ├── admin-content-menus.spec.js   # Test Scripts Quản lý Menu Content
│   │   ├── admin-content-topics.spec.js  # Test Scripts Quản lý Topics tĩnh
│   │   ├── user-search-filter.spec.js    # Test Scripts Tìm kiếm & Lọc phía Storefront
│   │   └── Group13_23130211_MacChiNguyen.xlsx
│   ├── 23130251_LeHuuPhuoc_TestScripts/
│   │   ├── affiliates.spec.js        # Test Scripts Quản lý Tiếp thị liên kết (Affiliates)
│   │   ├── promotion.spec.js         # Test Scripts Quản lý Khuyến mãi & Giảm giá
│   │   ├── wishlist.spec.js          # Test Scripts Danh sách yêu thích (Wishlist)
│   │   └── Group13_23130251_LeHuuPhuoc.xlsx
│   └── 23130350_HuynhThiThanhTruc_TestScripts/
│       ├── CustomerInfoMgmt.spec.js      # Test Scripts Quản lý Thông tin Khách hàng
│       ├── CustomerRoleMgmt.spec.js      # Test Scripts Quản lý Vai trò Khách hàng
│       ├── ShoppingCartMgmt.spec.js      # Test Scripts Quản lý Giỏ hàng
│       └── screenshots/                  # Thư mục lưu minh chứng ảnh chụp lỗi tự động
├── auth.js                           # Script khởi tạo session & hỗ trợ xác thực Cloudflare thủ công
├── fixtures.js                       # Tùy biến Playwright Fixture (Persistent Context tránh bot detection)
├── package.json                      # Cấu hình dependencies và lệnh npm scripts
├── playwright.config.js              # Cấu hình Playwright (browsers, timeout, workers, reporters)
└── README.md                         # Tài liệu hướng dẫn dự án
```

---

## 6. Hướng dẫn cài đặt và cấu hình (Installation & Setup)

### Bước 1: Yêu cầu môi trường tiền đề
- Đã cài đặt **Node.js** (Khuyến nghị phiên bản LTS 18.x hoặc 20.x trở lên).
- Đã cài đặt **Git**.
- Đã cài đặt trình duyệt **Google Chrome** (Bản chuẩn được cài tại đường dẫn mặc định trên hệ điều hành).
- *(Tùy chọn nếu chạy local)*: Đã cài đặt **Docker Desktop** (hỗ trợ WSL2 trên Windows).

### Bước 2: Clone repository và cài đặt thư viện
Mở Terminal / PowerShell và thực hiện các lệnh:
```bash
# 1. Clone repository về máy
git clone https://github.com/thanhtruc379994/Tester.git

# 2. Điều hướng vào thư mục dự án
cd Tester //thư mục để project

# 3. Cài đặt các Node packages
npm install

# 4. Cài đặt môi trường trình duyệt cho Playwright
npx playwright install --with-deps
```

### Bước 3: Cấu hình môi trường kiểm thử

#### Cách A: Chạy trên môi trường Local Docker (Khuyến nghị)
1. Khởi động Docker containers bằng Docker Compose:
   ```bash
   cd docker
   docker compose up -d
   ```
2. Mở trình duyệt truy cập `http://localhost:8080` để hoàn tất cài đặt lần đầu theo hướng dẫn trong `docker/note.txt` (Kết nối DB MSSQL: Server `nopcommerce_database`, user `sa`, pass `nopCommerce_Pass123`, chọn tạo sample data).
3. Sau khi cài đặt hoàn tất, website sẽ sẵn sàng tại `http://localhost:8080`.

#### Cách B: Chạy trên môi trường Demo Online (`https://admin-demo.nopcommerce.com`)
Nếu chạy trên môi trường demo và gặp cảnh báo bảo mật Cloudflare, bạn có thể chạy script xác thực session 1 lần:
```bash
npm run auth
```
Trình duyệt Chrome sẽ tự động bật lên. Bạn chỉ cần tick chọn xác minh "Tôi không phải là người máy" và đăng nhập, sau đó đóng cửa sổ trình duyệt lại để profile lưu session.

---

## 7. Hướng dẫn chạy Test Scripts của từng thành viên

Bạn có thể chạy kiểm thử cho từng thành viên bằng cách chỉ định đường dẫn thư mục hoặc file `.spec.js` tương ứng.

### 1. Thành viên: Trương Cao Doãn (23130064)
- **Chạy toàn bộ kịch bản của thành viên:**
  ```bash
  npx playwright test test-scripts/23130064_TruongCaoDoan_TestScripts/
  ```
- **Chạy từng module cụ thể:**
  ```bash
  # Kiểm thử Quản lý Đơn hàng (Orders)
  npx playwright test test-scripts/23130064_TruongCaoDoan_TestScripts/orders.spec.js

  # Kiểm thử Quản lý Giao hàng (Shipments)
  npx playwright test test-scripts/23130064_TruongCaoDoan_TestScripts/shipments.spec.js

  # Kiểm thử Quản lý Thẻ quà tặng (Gift Cards)
  npx playwright test test-scripts/23130064_TruongCaoDoan_TestScripts/giftcards.spec.js
  ```

---

### 2. Thành viên: Nguyễn Hữu Duy (23130075)
- **Chạy toàn bộ kịch bản của thành viên:**
  ```bash
  npx playwright test test-scripts/23130075_NguyenHuuDuy_TestScripts/
  ```
- **Chạy từng module cụ thể:**
  ```bash
  # Kiểm thử Sản phẩm (Create, Search & Bulk Edit)
  npx playwright test test-scripts/23130075_NguyenHuuDuy_TestScripts/admin_product.spec.js

  # Kiểm thử Danh mục sản phẩm (Categories)
  npx playwright test test-scripts/23130075_NguyenHuuDuy_TestScripts/admin_categories.spec.js

  # Kiểm thử Nhà sản xuất (Manufacturers)
  npx playwright test test-scripts/23130075_NguyenHuuDuy_TestScripts/admin_manufacturer.spec.js
  ```

---

### 3. Thành viên: Mạc Chí Nguyên (23130211)
- **Chạy toàn bộ kịch bản của thành viên:**
  ```bash
  npx playwright test test-scripts/23130211_MacChiNguyen_TestScripts/
  ```
- **Chạy từng module cụ thể:**
  ```bash
  # Kiểm thử Quản lý Menus (Admin Content)
  npx playwright test test-scripts/23130211_MacChiNguyen_TestScripts/admin-content-menus.spec.js

  # Kiểm thử Quản lý Topics (Admin Content)
  npx playwright test test-scripts/23130211_MacChiNguyen_TestScripts/admin-content-topics.spec.js

  # Kiểm thử Tìm kiếm & Bộ lọc Storefront (User Search & Filter)
  npx playwright test test-scripts/23130211_MacChiNguyen_TestScripts/user-search-filter.spec.js
  ```

---

### 4. Thành viên: Lê Hữu Phước (23130251)
- **Chạy toàn bộ kịch bản của thành viên:**
  ```bash
  npx playwright test test-scripts/23130251_LeHuuPhuoc_TestScripts/
  ```
- **Chạy từng module cụ thể:**
  ```bash
  # Kiểm thử Đại lý tiếp thị liên kết (Affiliates)
  npx playwright test test-scripts/23130251_LeHuuPhuoc_TestScripts/affiliates.spec.js

  # Kiểm thử Khuyến mãi & Giảm giá (Promotions / Discounts)
  npx playwright test test-scripts/23130251_LeHuuPhuoc_TestScripts/promotion.spec.js

  # Kiểm thử Danh sách yêu thích Storefront (Wishlist)
  npx playwright test test-scripts/23130251_LeHuuPhuoc_TestScripts/wishlist.spec.js
  ```

---

### 5. Thành viên: Huỳnh Thị Thanh Trúc (23130350)
- **Chạy toàn bộ kịch bản của thành viên:**
  ```bash
  npx playwright test test-scripts/23130350_HuynhThiThanhTruc_TestScripts/
  ```
- **Chạy từng module cụ thể:**
  ```bash
  # Kiểm thử Quản lý Thông tin Khách hàng (Customer Info)
  npx playwright test test-scripts/23130350_HuynhThiThanhTruc_TestScripts/CustomerInfoMgmt.spec.js

  # Kiểm thử Quản lý Vai trò Khách hàng (Customer Roles)
  npx playwright test test-scripts/23130350_HuynhThiThanhTruc_TestScripts/CustomerRoleMgmt.spec.js

  # Kiểm thử Quản lý Giỏ hàng (Shopping Cart)
  npx playwright test test-scripts/23130350_HuynhThiThanhTruc_TestScripts/ShoppingCartMgmt.spec.js
  ```

---

## 8. Hướng dẫn chạy toàn bộ Test Suite (Full Test Suite Execution)

### 1. Lệnh thực thi cơ bản
Để chạy tất cả các kịch bản kiểm thử trong thư mục `test-scripts/`:
```bash
npm test
# hoặc:
npx playwright test test-scripts/
```

### 2. Các tùy chọn hữu ích khi chạy kiểm thử
- **Chế độ quan sát trực quan (Headed Mode):**
  ```bash
  npx playwright test test-scripts/ --headed
  ```
- **Chế độ UI tương tác của Playwright:**
  ```bash
  npx playwright test --ui
  ```
- **Chỉ định URL kiểm thử bằng biến môi trường `BASE_URL`:**
  ```bash
  # Trên Windows PowerShell:
  $env:BASE_URL="http://localhost:8080"; npx playwright test test-scripts/

  # Trên CMD:
  set BASE_URL=http://localhost:8080 && npx playwright test test-scripts/
  ```
- **Chạy kiểm thử một kịch bản đơn lẻ theo tiêu đề (grep):**
  ```bash
  npx playwright test -g "CONTENT_Menu_View_01"
  ```

---

## 9. Hướng dẫn xem Test Reports và Screenshots

### 1. Xem Screenshots và Minh chứng kiểm thử trên Google Drive (Khuyến nghị)
Toàn bộ hình ảnh Screenshots minh chứng kết quả chạy kiểm thử (Pass/Fail) và các video/báo cáo minh chứng của từng thành viên trong Nhóm 13 đã được tải lên và lưu trữ đầy đủ tại thư mục Google Drive:

- **Link Google Drive – Test Report & Evidence:** [https://drive.google.com/drive/folders/1R86osQ2socVUL-MMhVIgLSae8S_RyIQ_?usp=sharing](https://drive.google.com/drive/folders/1R86osQ2socVUL-MMhVIgLSae8S_RyIQ_?usp=sharing)

Thư mục trên Google Drive được phân chia theo từng thành viên và module tương ứng:
- Thư mục Screenshots minh chứng cho từng test case của từng thành viên.
- Các file báo cáo kết quả kiểm thử (Test Reports dạng HTML và PDF).

### 2. Xem các file Test Report tĩnh theo từng Phase (Thư mục `reports/`)
Dự án đã tích hợp sẵn các file báo cáo kết quả HTML tĩnh theo 5 Phase kiểm thử trong thư mục `reports/`:
- [Phase-1.html](file:///d:/n4k1/test/gh/Tester/reports/Phase-1.html): Báo cáo Phase 1 - Nền tảng Quản trị & Phân quyền (RBAC & Foundation).
- [Phase-2.html](file:///d:/n4k1/test/gh/Tester/reports/Phase-2.html): Báo cáo Phase 2 - Quản trị Danh mục hàng hóa & Sản phẩm (Catalog Management).
- [Phase-3.html](file:///d:/n4k1/test/gh/Tester/reports/Phase-3.html): Báo cáo Phase 3 - Tiếp thị & Khuyến mãi (Marketing & Promotions).
- [Phase-4.html](file:///d:/n4k1/test/gh/Tester/reports/Phase-4.html): Báo cáo Phase 4 - Trải nghiệm Khách hàng trên Storefront (Storefront Customer Journey).
- [Phase-5.html](file:///d:/n4k1/test/gh/Tester/reports/Phase-5.html): Báo cáo Phase 5 - Xử lý Đơn hàng & Giao vận (Orders & Fulfillment).

*(Người dùng có thể mở trực tiếp các file `.html` này trên bất kỳ trình duyệt nào để xem tổng hợp và chuyển hướng đến báo cáo chi tiết).*

### 3. Xem Playwright HTML Report khi chạy trực tiếp trên máy (Local)
Sau khi thực thi test trên máy cục bộ, Playwright sẽ tự động tạo báo cáo trực quan trong thư mục `playwright-report/`.

Để mở báo cáo trên trình duyệt:
```bash
npx playwright show-report
```
Báo cáo này hiển thị:
- Tổng số test case Pass, Fail, Flaky và Skipped.
- Thời gian thực thi từng bước (Step-by-step Execution Time).
- Call log, network logs và chi tiết lỗi nếu có.

---
*Nhóm 13 - Môn Kiểm thử phần mềm - Đại học Nông Lâm TP.HCM (NLU)*
