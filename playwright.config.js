const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    use: {
        headless: false,
        channel: 'chrome',
        launchOptions: {
            slowMo: 500
        }
    },
    workers: 1,
    fullyParallel: false,
    reporter: [
        ['list'],
        ['html', { open: 'always' }] // Tự động bật trình duyệt hiển thị báo cáo ngay khi chạy xong
    ]
});
