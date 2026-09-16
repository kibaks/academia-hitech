const { chromium } = require('/root/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log('Waiting for preloader to dismiss...');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: '/tmp/real_test_catalog.png' });
  console.log('Screenshot captured successfully!');
  await browser.close();
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
