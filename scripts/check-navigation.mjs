// Optional browser regression. Point BASE_URL at a running local build and
// PLAYWRIGHT_MODULE at an existing Playwright installation when needed.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'chrome' });

try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).origin === new URL(baseURL).origin ? route.continue() : route.abort());
    await context.addInitScript(() => {
      window.__navigationTest = { searchEvents: 0, hashPushes: 0, tocAtLeave: [], documentMarker: Math.random() };
      window.addEventListener('blog-search', () => window.__navigationTest.searchEvents++);
      const push = history.pushState.bind(history);
      history.pushState = (data, unused, url) => {
        if (typeof url === 'string' && url.startsWith('#')) window.__navigationTest.hashPushes++;
        return push(data, unused, url);
      };
      const observers = new Set();
      const NativeObserver = window.IntersectionObserver;
      window.IntersectionObserver = class extends NativeObserver {
        observe(target) {
          if (/^H[1-6]$/.test(target.tagName) && target.closest('.prose')) observers.add(this);
          return super.observe(target);
        }
        disconnect() { observers.delete(this); return super.disconnect(); }
      };
      document.addEventListener('astro:before-swap', () => {
        if (!document.querySelector('article.article-paper')) return;
        queueMicrotask(() => window.__navigationTest.tocAtLeave.push(observers.size));
      });
    });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(baseURL, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const marker = await page.evaluate(() => window.__navigationTest.documentMarker);
    await page.locator('[data-theme-toggle]:visible').first().click();
    let article;

    for (let cycle = 0; cycle < 3; cycle++) {
      await page.keyboard.press('Control+k');
      await page.waitForFunction(() => document.getElementById('editorial-search-dialog').open, null, { timeout: 8000 });
      if (!article) {
        const result = page.locator('#search-results-list .search-result-card[href^="/posts/"]').first();
        article = { url: await result.getAttribute('href'), title: (await result.locator('.card-title').innerText()).trim() };
      }
      await page.locator('#editorial-search-input').fill(article.title);
      const result = page.locator('#search-results-list a').filter({ hasText: article.title }).first();
      await result.waitFor({ state: 'visible' });
      await result.click();
      await page.waitForURL(url => url.pathname.replace(/\/$/, '') === new URL(article.url, baseURL).pathname.replace(/\/$/, ''));
      await page.waitForTimeout(350);
      if (width === 1440 && await page.locator('.toc-nav-link').count()) {
        const before = await page.evaluate(() => window.__navigationTest.hashPushes);
        await page.locator('.toc-nav-link').first().click();
        assert.equal(await page.evaluate(() => window.__navigationTest.hashPushes), before + 1, 'one TOC click must push one history entry');
      }
      await page.locator('a[href="/"]').first().click();
      await page.waitForURL(url => url.pathname === '/');
      await page.waitForTimeout(350);
      assert.equal(await page.evaluate(() => window.__navigationTest.documentMarker), marker, 'ClientRouter must retain the document');
      assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
      if (width === 390) {
        await page.locator('#mobile-search-toggle').click();
        const before = await page.evaluate(() => window.__navigationTest.searchEvents);
        await page.locator('#mobile-search-input').fill('字幕');
        assert.equal(await page.evaluate(() => window.__navigationTest.searchEvents), before + 1, 'mobile input must dispatch one search event');
        await page.locator('#mobile-search-clear').click();
        await page.locator('#mobile-search-toggle').click();
        await page.locator('#mobile-menu-toggle').click();
        assert.equal(await page.locator('#mobile-menu-toggle').getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#mobile-menu-toggle').getAttribute('aria-expanded'), 'false');
      }
    }
    assert.deepEqual(await page.evaluate(() => window.__navigationTest.tocAtLeave), [0, 0, 0], 'TOC observers must disconnect before leaving the article');
    assert.deepEqual(errors, []);
    console.log(`[navigation] ${width}px: search, theme, TOC, mobile input and repeated navigation passed`);
    await context.close();
  }
} finally { await browser.close(); }
