// @ts-check
const { defineConfig } = require('@playwright/test');
const path = require('path');

/**
 * ==============================================================================
 * TEST SUITE CONFIGURATION - GROUP 13 (NOPCOMMERCE E-COMMERCE TESTING)
 * Học phần: Software Testing - GVHD: ThS. Trần Thị Thanh Nga
 * ==============================================================================
 * Quy trình thực thi gồm 5 Giai đoạn (5 Phases) tuần tự:
 * Phase 1: Nền tảng Quản trị & Phân quyền (RBAC & Admin Foundation)
 * Phase 2: Quản trị Danh mục hàng hóa & Sản phẩm (Catalog Management)
 * Phase 3: Quản trị Tiếp thị & Khuyến mãi (Marketing & Promotions)
 * Phase 4: Trải nghiệm Mua sắm của Khách hàng (Storefront Customer Journey)
 * Phase 5: Xử lý Đơn hàng & Giao vận (Orders & Fulfillment)
 * ==============================================================================
 */

module.exports = defineConfig({
  timeout: 45000,
  outputDir: path.resolve(__dirname, 'screenshots', 'failures'),
  workers: 1, // Chạy tuần tự 1 worker để bảo toàn tính toàn vẹn của dữ liệu luồng E-Commerce
  fullyParallel: false,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report-suite', open: 'on-failure' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
    headless: false,
    channel: 'chrome',
    actionTimeout: 15000,
    launchOptions: {
      slowMo: 200,
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    // GIAI ĐOẠN 1: Nền tảng Quản trị & Phân quyền
    {
      name: 'Phase-1: RBAC & Admin Foundation (Truc, Nguyen)',
      testMatch: [
        'test-scripts/23130350_HuynhThiThanhTruc_TestScripts/CustomerRoleMgmt.spec.js',
        'test-scripts/23130350_HuynhThiThanhTruc_TestScripts/CustomerInfoMgmt.spec.js',
        'test-scripts/23130211_MacChiNguyen_TestScripts/admin-content-topics.spec.js',
        'test-scripts/23130211_MacChiNguyen_TestScripts/admin-content-menus.spec.js',
      ],
    },

    // GIAI ĐOẠN 2: Quản trị Danh mục hàng hóa & Sản phẩm
    {
      name: 'Phase-2: Catalog Management (Duy)',
      dependencies: ['Phase-1: RBAC & Admin Foundation (Truc, Nguyen)'],
      testMatch: [
        'test-scripts/23130075_NguyenHuuDuy_TestScripts/admin_categories.spec.js',
        'test-scripts/23130075_NguyenHuuDuy_TestScripts/admin_manufacturer.spec.js',
        'test-scripts/23130075_NguyenHuuDuy_TestScripts/admin_product.spec.js',
      ],
    },

    // GIAI ĐOẠN 3: Quản trị Tiếp thị & Khuyến mãi
    {
      name: 'Phase-3: Marketing & Promotions (Phuoc, Doan)',
      dependencies: ['Phase-2: Catalog Management (Duy)'],
      testMatch: [
        'test-scripts/23130251_LeHuuPhuoc_TestScripts/promotion.spec.js',
        'test-scripts/23130064_TruongCaoDoan_TestScripts/giftcards.spec.js',
        'test-scripts/23130251_LeHuuPhuoc_TestScripts/affiliates.spec.js',
      ],
    },

    // GIAI ĐOẠN 4: Trải nghiệm Mua sắm của Khách hàng
    {
      name: 'Phase-4: Storefront Customer Journey (Nguyen, Phuoc, Truc)',
      dependencies: ['Phase-3: Marketing & Promotions (Phuoc, Doan)'],
      testMatch: [
        'test-scripts/23130211_MacChiNguyen_TestScripts/user-search-filter.spec.js',
        'test-scripts/23130251_LeHuuPhuoc_TestScripts/wishlist.spec.js',
        'test-scripts/23130350_HuynhThiThanhTruc_TestScripts/ShoppingCartMgmt.spec.js',
      ],
    },

    // GIAI ĐOẠN 5: Xử lý Đơn hàng & Giao vận
    {
      name: 'Phase-5: Orders & Fulfillment (Doan)',
      dependencies: ['Phase-4: Storefront Customer Journey (Nguyen, Phuoc, Truc)'],
      testMatch: [
        'test-scripts/23130064_TruongCaoDoan_TestScripts/orders.spec.js',
        'test-scripts/23130064_TruongCaoDoan_TestScripts/shipments.spec.js',
      ],
    },
  ],
});
