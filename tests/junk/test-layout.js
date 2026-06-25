const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(`
    <style>
      .container { display: flex; gap: 48px; align-items: stretch; max-width: 1200px; border: 1px solid black; }
      .left { flex: 1; background: #eee; padding: 20px; }
      .right { aspect-ratio: 640 / 662; background: blue; flex-shrink: 0; }
      .right2 { height: 100%; aspect-ratio: 640 / 662; background: red; flex-shrink: 0; }
      .right3 { flex-shrink: 0; }
      .right3-inner { height: 100%; aspect-ratio: 640 / 662; background: green; }
    </style>
    <div class="container" id="c1">
      <div class="left" style="height: 300px;">Left 1</div>
      <div class="right" id="r1"></div>
    </div>
    <br/>
    <div class="container" id="c2">
      <div class="left" style="height: 300px;">Left 2</div>
      <div class="right2" id="r2"></div>
    </div>
    <br/>
    <div class="container" id="c3">
      <div class="left" style="height: 300px;">Left 3</div>
      <div class="right3" id="r3"><div class="right3-inner" id="r3i"></div></div>
    </div>
  `);
  const r1 = await page.$eval('#r1', el => ({ w: el.offsetWidth, h: el.offsetHeight }));
  const r2 = await page.$eval('#r2', el => ({ w: el.offsetWidth, h: el.offsetHeight }));
  const r3 = await page.$eval('#r3', el => ({ w: el.offsetWidth, h: el.offsetHeight }));
  const r3i = await page.$eval('#r3i', el => ({ w: el.offsetWidth, h: el.offsetHeight }));
  console.log('r1', r1);
  console.log('r2', r2);
  console.log('r3', r3, 'r3i', r3i);
  await browser.close();
})();
