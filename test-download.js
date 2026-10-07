const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();
  // We need to bypass auth or just go to a profile
  await page.goto('http://localhost:3845/profiles/demo');
  await page.waitForTimeout(2000);
  
  // Actually, wait, downloading is on /join/explorercard !
  // Let's take a screenshot of /profiles/demo first to see what it looks like
  await page.screenshot({ path: 'mobile-profile-demo.png' });
  
  await browser.close();
})();
