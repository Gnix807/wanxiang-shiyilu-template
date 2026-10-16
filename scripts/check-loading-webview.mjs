// BASE_URL points at a production preview; reuse an installed PLAYWRIGHT_MODULE.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:3000';
// The default template has no chat article. Supply CHAT_PATH to check your own.
const chatPath = process.env.CHAT_PATH || '';
const showcasePath = process.env.SHOWCASE_PATH || chatPath;
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'chrome' });
const failures = [];
function check(name, run) {
  try { run(); }
  catch (error) { failures.push(`${name}: ${error.message}`); }
}
async function localContext(options) {
  const context = await browser.newContext(options);
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(baseURL).origin ? route.continue() : route.abort());
  return context;
}
try {
  for (const connection of [{ effectiveType: '4g', saveData: false }, { effectiveType: '2g', saveData: false }, { effectiveType: '4g', saveData: true }]) {
    const context = await localContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await context.addInitScript(connection => Object.defineProperty(navigator, 'connection', { configurable: true, value: connection }), connection);
    const page = await context.newPage();
    const speculative = [];
    page.on('request', request => {
      const path = new URL(request.url()).pathname;
      if (!request.isNavigationRequest() && (path.startsWith('/posts/') || /^\/(about|friends|tags|talks|blogstats|posts)\/?$/.test(path))) speculative.push(path);
    });
    await page.goto(baseURL, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('astro-island[component-url*="SearchablePosts"]:not([ssr])'));
    await page.waitForTimeout(600);
    const label = `${connection.effectiveType}${connection.saveData ? ' save-data' : ''}`;
    check(`mobile ${label} idle`, () => assert.equal(speculative.length, 0, 'idle mobile must not download unrequested pages'));
    const link = page.locator('main a[href^="/posts/"]').first();
    const href = new URL(await link.getAttribute('href'), baseURL).pathname;
    await link.dispatchEvent('touchstart');
    await page.waitForTimeout(300);
    await link.dispatchEvent('touchstart');
    await link.dispatchEvent('focusin');
    await page.waitForTimeout(300);
    const allowed = !connection.saveData && connection.effectiveType !== '2g';
    check(`mobile ${label} intent`, () => assert.equal(speculative.filter(path => path === href).length, allowed ? 1 : 0, 'intent must prefetch once, respecting slow networks and data saver'));
    await context.close();
  }
  {
    const context = await localContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const articleRequests = [];
    const active = new Set();
    let peak = 0;
    await context.route('**/posts/**', async route => {
      if (!route.request().isNavigationRequest()) await new Promise(resolve => setTimeout(resolve, 120));
      await route.continue();
    });
    page.on('request', request => {
      if (new URL(request.url()).pathname.startsWith('/posts/') && !request.isNavigationRequest()) {
        articleRequests.push(request.url()); active.add(request); peak = Math.max(peak, active.size);
      }
    });
    page.on('requestfinished', request => active.delete(request));
    page.on('requestfailed', request => active.delete(request));
    await page.goto(baseURL, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    check('desktop prefetch retained', () => assert.ok(articleRequests.length > 0, 'desktop proximity prefetch should remain available'));
    check('desktop prefetch budget', () => assert.ok(peak <= 2, 'at most two article requests may run together; observed ' + peak));
    check('desktop prefetch deduplication', () => assert.equal(new Set(articleRequests).size, articleRequests.length, 'each article should be requested once'));
    const navRequests = [];
    page.on('request', request => { if (new URL(request.url()).pathname.replace(/\/$/, '') === '/about') navRequests.push(request); });
    const about = page.locator('[data-prefetch="nav"] a[href="/about"]').first();
    await about.dispatchEvent('focusin');
    await page.waitForTimeout(150);
    await about.dispatchEvent('focusin');
    await page.waitForTimeout(150);
    check('navigation link intent', () => assert.equal(navRequests.length, 1, 'navigation links must prefetch once on intent'));
    await context.close();
  }
  if (chatPath) {
  for (const width of [320, 390, 768, 1440]) {
    const context = await localContext({ viewport: { width, height: 900 }, isMobile: width < 768, hasTouch: width < 768, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(baseURL + chatPath, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => { document.documentElement.classList.toggle('dark', theme === 'dark'); document.documentElement.dataset.theme = theme; }, theme);
      const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
      check(`${width}px ${theme} scheme`, () => assert.ok(scheme.includes(theme), 'the browser color scheme must match the selected site theme'));
      const frames = await page.locator('.im-chat-window .im-bubble-container').evaluateAll(bubbles => bubbles.map(bubble => {
        const style = getComputedStyle(bubble);
        return { source: style.borderImageSource, legacyTail: !!bubble.querySelector('.im-bubble-tail'), outset: style.borderImageOutset.split(/\s+/).map(value => parseFloat(value)), right: bubble.classList.contains('im-bubble-right') };
      }));
      check(width + 'px ' + theme + ' complete outline', () => assert.ok(frames.length > 0 && frames.every(frame => !frame.legacyTail && frame.source !== 'none' && frame.outset.length === 4 && frame.outset.every((value, index) => value === (index === (frame.right ? 1 : 3) ? 8 : 0))), 'one border image must supply the complete bubble and its outward tail'));
      const original = await page.locator('.im-chat-window .im-message-row').first().evaluate(row => row.innerHTML);
      await page.locator('.im-chat-window .im-message-row').first().evaluate(row => {
        row.querySelector('.im-header-row span').textContent = 'VeryLongSpeakerName'.repeat(12);
        const code = document.createElement('code');
        code.textContent = 'https://example.com/' + 'unbroken-link-segment'.repeat(18);
        row.querySelector('.im-bubble-content').append(code);
      });
      const geometry = await page.locator('.im-chat-window .im-message-row').first().evaluate(row => {
        const header = row.querySelector('.im-header-row');
        const bubble = row.querySelector('.im-bubble-container');
        const content = row.querySelector('.im-bubble-content');
        const avatar = row.querySelector('.im-avatar').getBoundingClientRect();
        const r = row.getBoundingClientRect();
        const b = bubble.getBoundingClientRect();
        return { headerOverflow: header.scrollWidth - header.clientWidth, contentOverflow: content.scrollWidth - content.clientWidth, bubbleLeft: b.left, bubbleRight: b.right, rowLeft: r.left, rowRight: r.right, avatarWidth: avatar.width, avatarHeight: avatar.height };
      });
      check(`${width}px ${theme} speaker`, () => assert.ok(geometry.headerOverflow <= 1, `long speaker overflows by ${geometry.headerOverflow}px`));
      check(`${width}px ${theme} message`, () => assert.ok(geometry.contentOverflow <= 1 && geometry.bubbleLeft >= geometry.rowLeft - 1 && geometry.bubbleRight <= geometry.rowRight + 1, 'long inline links must fit inside the message row'));
      check(`${width}px ${theme} avatar`, () => assert.equal(Math.round(geometry.avatarWidth), width < 640 ? 36 : 40));
      await page.locator('.im-chat-window .im-message-row').first().evaluate((row, original) => { row.innerHTML = original; }, original);
    }
    await context.close();
  }
  for (const systemTheme of ['light', 'dark']) {
    for (const siteTheme of ['light', 'dark']) {
      const context = await localContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: systemTheme, reducedMotion: 'reduce' });
      await context.addInitScript(theme => localStorage.setItem('theme', theme), siteTheme);
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Emulation.setAutoDarkModeOverride', { enabled: false });
      await page.goto(baseURL + showcasePath, { waitUntil: 'load' });
      const chat = page.locator('.im-chat-window').first();
      await chat.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      const normal = await chat.screenshot({ animations: 'disabled' });
      // Automatic darkening accompanies a dark OS preference. Starting light
      // also checks switching the OS theme while keeping the site's selection.
      if (systemTheme === 'light') await page.emulateMedia({ colorScheme: 'dark' });
      await cdp.send('Emulation.setAutoDarkModeOverride', { enabled: true });
      const forced = await chat.screenshot({ animations: 'disabled' });
      check('system ' + systemTheme + ' site ' + siteTheme, () => assert.ok(normal.equals(forced), 'automatic darkening must not repaint the selected site theme'));
      await context.close();
    }
  }
  } else {
    console.log('[loading/webview] chat rendering skipped: set CHAT_PATH to an article with ChatWindow/Dialogue');
  }
} finally { await browser.close(); }
assert.deepEqual(failures, [], failures.join('\n'));
console.log('[loading/webview] mobile intent, data saver, slow networks and desktop prefetch checks passed' + (chatPath ? '; chat rendering and light-dark combinations passed' : ''));
