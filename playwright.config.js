const { defineConfig } = require('@playwright/test');
const path = require('path');

const htmlOutputFolder = process.env.PLAYWRIGHT_HTML_REPORT || 'playwright-report';

module.exports = defineConfig({
    timeout: 30000,
    outputDir: path.resolve(__dirname, 'screenshots', 'failures'),
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:8080',
        headless: false,
        channel: 'chrome',
        actionTimeout: 15000,
        launchOptions: {
            slowMo: 300
        }
    },
    workers: 1,
    fullyParallel: false,
    reporter: [
        ['list'],
        ['html', { 
            outputFolder: path.resolve(__dirname, htmlOutputFolder), 
            open: process.env.PLAYWRIGHT_HTML_OPEN || 'never' 
        }]
    ]
});
