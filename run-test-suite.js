/**
 * TEST SUITE RUNNER - GROUP 13 - NOPCOMMERCE E-COMMERCE TESTING
 * Học phần: Software Testing (Assignment 10 – Final Project)
 * Hướng dẫn sử dụng:
 *   node run-test-suite.js             -> Chạy toàn bộ 5 Phase (554 Test Cases)
 *   node run-test-suite.js --phase=1   -> Chạy riêng Phase 1 (Nền tảng & RBAC)
 *   node run-test-suite.js --phase=4   -> Chạy riêng Phase 4 (Storefront & Cart)
 *   node run-test-suite.js --headless  -> Chạy ngầm (không hiển thị trình duyệt)
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục reports và screenshots luôn sẵn sàng
const screenshotsDir = path.resolve(__dirname, 'screenshots');
const reportsDir = path.resolve(__dirname, 'playwright-report');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Hàm cập nhật trang Dashboard tổng quan (index.html) và file Phase HTML ở lớp ngoài
function updateDashboardAndPhaseFile(phase, runStatus, durationSec) {
  const summaryPath = path.resolve(reportsDir, 'summary.json');
  let summary = {};
  if (fs.existsSync(summaryPath)) {
    try {
      summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    } catch (e) {
      summary = {};
    }
  }

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const displayTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

  // 1. Tạo / Cập nhật file HTML riêng cho Phase ở lớp ngoài: Phase-X.html (trỏ thẳng vào phase-X/index.html)
  const phaseHtmlFile = path.resolve(reportsDir, `Phase-${phase.id}.html`);
  const phaseHtmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=./phase-${phase.id}/index.html">
  <title>Báo Cáo - ${phase.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: white; border-radius: 12px; padding: 32px 40px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); text-align: center; max-width: 540px; }
    h2 { margin-top: 0; color: #0284c7; }
    .btn { display: inline-block; margin-top: 20px; background: #0284c7; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .btn:hover { background: #0369a1; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Báo Cáo Kiểm Thử ${phase.name}</h2>
    <p>Cập nhật lần cuối: <strong>${displayTime}</strong> (${durationSec}s)</p>
    <p>Đang tự động chuyển hướng đến báo cáo chi tiết Playwright...</p>
    <a class="btn" href="./phase-${phase.id}/index.html">Mở Báo Cáo Chi Tiết</a>
  </div>
</body>
</html>`;
  fs.writeFileSync(phaseHtmlFile, phaseHtmlContent, 'utf8');

  // 2. Lưu lại thông tin vào summary.json
  summary[phase.id] = {
    id: phase.id,
    name: phase.name,
    owners: phase.owners,
    filesCount: phase.files.length,
    lastRun: displayTime,
    durationSec: durationSec,
    exitCode: runStatus,
    statusText: runStatus === 0 ? 'Passed' : 'Finished (Defects Recorded)'
  };
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

  // 3. Tạo / Cập nhật Master Dashboard index.html tổng hợp toàn bộ 5 Phase
  const dashboardFile = path.resolve(reportsDir, 'index.html');
  const phaseRows = PHASES.map(p => {
    const info = summary[p.id];
    const hasRun = !!info;
    const badgeColor = !hasRun ? '#94a3b8' : (info.exitCode === 0 ? '#16a34a' : '#d97706');
    const badgeText = !hasRun ? 'Chưa chạy' : (info.exitCode === 0 ? 'Thành công (Passed)' : 'Đã chạy (Có Defect)');
    const reportLink = hasRun 
      ? `<a class="view-btn" href="./Phase-${p.id}.html" target="_blank">Xem Báo Cáo Phase ${p.id}</a>`
      : `<span style="color:#94a3b8; font-size:13px;">Chưa có dữ liệu</span>`;

    return `
      <tr>
        <td style="font-weight: bold; text-align: center;">Phase ${p.id}</td>
        <td>
          <div style="font-weight: 600; color: #0f172a;">${p.name.split(': ')[1] || p.name}</div>
          <div style="font-size: 13px; color: #64748b;">Phụ trách: ${p.owners} (${p.files.length} test files)</div>
        </td>
        <td style="text-align: center;">
          <span style="background:${badgeColor}15; color:${badgeColor}; border:1px solid ${badgeColor}40; padding:4px 10px; border-radius:12px; font-size:12px; font-weight:600;">
            ${badgeText}
          </span>
        </td>
        <td style="font-size: 13px; color: #475569; text-align: center;">
          ${hasRun ? `${info.lastRun}<br><span style="color:#94a3b8;">(${info.durationSec}s)</span>` : '-'}
        </td>
        <td style="text-align: center;">
          ${reportLink}
        </td>
      </tr>
    `;
  }).join('');

  const dashboardContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Bảng Điều Khiển Kiểm Thử - Nhóm 13 (NopCommerce)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f1f5f9; color: #1e293b; margin: 0; padding: 40px 20px; }
    .container { max-width: 1050px; margin: 0 auto; background: white; border-radius: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); padding: 32px; }
    header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px; }
    h1 { margin: 0 0 8px 0; font-size: 24px; color: #0f172a; }
    .sub { color: #64748b; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { background: #f8fafc; text-align: left; padding: 12px 14px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; border-bottom: 1px solid #cbd5e1; }
    td { padding: 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: middle; }
    tr:hover { background: #f8fafc; }
    .view-btn { display: inline-block; background: #0284c7; color: white; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500; }
    .view-btn:hover { background: #0369a1; }
    footer { margin-top: 24px; font-size: 13px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>HỆ THỐNG BÁO CÁO KIỂM THỬ TỰ ĐỘNG - NHÓM 13</h1>
      <div class="sub">Học phần: Software Testing | GVHD: ThS. Trần Thị Thanh Nga | Nền tảng: nopCommerce v4.60/v5.00</div>
    </header>
    <table>
      <thead>
        <tr>
          <th style="text-align: center; width: 80px;">Phase</th>
          <th>Tên Giai Đoạn & Phân Công</th>
          <th style="text-align: center; width: 180px;">Trạng Thái</th>
          <th style="text-align: center; width: 170px;">Lần Chạy Gần Nhất</th>
          <th style="text-align: center; width: 170px;">Báo Cáo Chi Tiết</th>
        </tr>
      </thead>
      <tbody>
        ${phaseRows}
      </tbody>
    </table>
    <footer>Cập nhật lần cuối: ${displayTime} | Thư mục: E:\\work_space\\edu\\Tester\\TestProject\\Group13_NopCommerce\\playwright-report</footer>
  </div>
</body>
</html>`;
  fs.writeFileSync(dashboardFile, dashboardContent, 'utf8');

  return { htmlFile: `Phase-${phase.id}.html` };
}

const PHASES = [
  {
    id: 1,
    name: 'Phase 1: Nền tảng Quản trị & Phân quyền (RBAC & Foundation)',
    owners: 'Huỳnh Thị Thanh Trúc & Mạc Chí Nguyên',
    files: [
      'test-scripts/23130350_HuynhThiThanhTruc_TestScripts/CustomerRoleMgmt.spec.js',
      'test-scripts/23130350_HuynhThiThanhTruc_TestScripts/CustomerInfoMgmt.spec.js',
      'test-scripts/23130211_MacChiNguyen_TestScripts/admin-content-topics.spec.js',
      'test-scripts/23130211_MacChiNguyen_TestScripts/admin-content-menus.spec.js',
    ]
  },
  {
    id: 2,
    name: 'Phase 2: Quản trị Danh mục hàng hóa & Sản phẩm (Catalog Management)',
    owners: 'Nguyễn Hữu Duy',
    files: [
      'test-scripts/23130075_NguyenHuuDuy_TestScripts/admin_categories.spec.js',
      'test-scripts/23130075_NguyenHuuDuy_TestScripts/admin_manufacturer.spec.js',
      'test-scripts/23130075_NguyenHuuDuy_TestScripts/admin_product.spec.js',
    ]
  },
  {
    id: 3,
    name: 'Phase 3: Tiếp thị & Khuyến mãi (Marketing & Promotions)',
    owners: 'Lê Hữu Phước & Trương Cao Đoàn',
    files: [
      'test-scripts/23130251_LeHuuPhuoc_TestScripts/promotion.spec.js',
      'test-scripts/23130064_TruongCaoDoan_TestScripts/giftcards.spec.js',
      'test-scripts/23130251_LeHuuPhuoc_TestScripts/affiliates.spec.js',
    ]
  },
  {
    id: 4,
    name: 'Phase 4: Trải nghiệm Khách hàng trên Storefront (Storefront Customer Journey)',
    owners: 'Mạc Chí Nguyên, Lê Hữu Phước & Huỳnh Thị Thanh Trúc',
    files: [
      'test-scripts/23130211_MacChiNguyen_TestScripts/user-search-filter.spec.js',
      'test-scripts/23130251_LeHuuPhuoc_TestScripts/wishlist.spec.js',
      'test-scripts/23130350_HuynhThiThanhTruc_TestScripts/ShoppingCartMgmt.spec.js',
    ]
  },
  {
    id: 5,
    name: 'Phase 5: Xử lý Đơn hàng & Giao vận (Orders & Fulfillment)',
    owners: 'Trương Cao Đoàn',
    files: [
      'test-scripts/23130064_TruongCaoDoan_TestScripts/orders.spec.js',
      'test-scripts/23130064_TruongCaoDoan_TestScripts/shipments.spec.js',
    ]
  }
];

// Phân tích tham số dòng lệnh
const args = process.argv.slice(2);
let selectedPhase = null;
let isHeadless = false;
for (const arg of args) {
  if (arg.startsWith('--phase=')) {
    selectedPhase = parseInt(arg.split('=')[1], 10);
  } else if (arg === '--headless') {
    isHeadless = true;
  }
}
console.log('NOPCOMMERCE AUTOMATION TEST SUITE RUNNER - NHÓM 13');
console.log('Học phần: Software Testing , GVHD: ThS. Trần Thị Thanh Nga');
console.log(`Chế độ chạy: ${isHeadless ? 'HEADLESS (Ẩn giao diện)' : 'HEADED (Hiển thị Chrome)'}`);
if (selectedPhase) {
  console.log(`Lựa chọn thực thi: CHỈ CHẠY PHASE ${selectedPhase}`);
} else {
  console.log('Lựa chọn thực thi: CHẠY TOÀN BỘ 5 PHASES THEO THỨ TỰ NGHIỆP VỤ (554 TCs)');
}
console.log('-----\n');

const phasesToRun = selectedPhase 
  ? PHASES.filter(p => p.id === selectedPhase)
  : PHASES;

if (phasesToRun.length === 0) {
  console.error(`Lỗi: Không tìm thấy Phase ${selectedPhase}. Vui lòng chọn từ 1 đến 5.`);
  process.exit(1);
}

const startTime = Date.now();
let totalPassedPhases = 0;

for (const phase of phasesToRun) {
  console.log(`\nSTARTING ${phase.name}`);
  console.log(`  Phụ trách: ${phase.owners}`);
  console.log(`   Files (${phase.files.length}):`);
  phase.files.forEach(f => console.log(`     • ${f}`));
  const phaseReportSubdir = path.join('playwright-report', `phase-${phase.id}`);
  const cliArgs = [
    'playwright',
    'test',
    ...phase.files,
    '--output=screenshots',
    '--config=playwright.config.js'
  ];

  if (isHeadless) {
    cliArgs.push('--headless');
  }

  const phaseStart = Date.now();
  const run = spawnSync('npx', cliArgs, {
    shell: true,
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      ...process.env,
      SCREENSHOT_DIR: screenshotsDir,
      PLAYWRIGHT_HTML_REPORT: phaseReportSubdir,
      PLAYWRIGHT_HTML_OPEN: 'never'
    }
  });

  const durationSec = ((Date.now() - phaseStart) / 1000).toFixed(1);

  // Cập nhật file Phase riêng biệt và Dashboard tổng hợp
  updateDashboardAndPhaseFile(phase, run.status, durationSec);

  if (run.status === 0) {
    totalPassedPhases++;
    console.log(`\nCOMPLETED ${phase.name} (Thời gian: ${durationSec}s)`);
  } else {
    console.log(`\nNOTE ${phase.name} kết thúc với mã thoát: ${run.status} (Thời gian: ${durationSec}s)`);
  }
  console.log(`   File HTML báo cáo Phase ${phase.id} : playwright-report/Phase-${phase.id}.html`);
  console.log(`   Bảng điều khiển tổng hợp    : playwright-report/index.html`);
  console.log('-----');
}

const totalDurationMin = ((Date.now() - startTime) / 60000).toFixed(2);
console.log('\nTỔNG KẾT THỰC THI TEST SUITE NHÓM 13');
console.log(`Tổng thời gian chạy         : ${totalDurationMin} phút`);
console.log(`Số Phase hoàn thành         : ${totalPassedPhases} / ${phasesToRun.length} Phase`);
console.log('Bảng điều khiển tổng hợp     : playwright-report/index.html');
console.log('File báo cáo Phase riêng lẻ  : playwright-report/Phase-1.html, Phase-2.html, ...\n');
