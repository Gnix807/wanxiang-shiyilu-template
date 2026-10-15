import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { applyBiliData, loadBiliVideo, readBiliCache } from '../src/scripts/bilibili.ts';
import { syncBilibili } from './sync-bilibili.mjs';

const storage = new Map();
globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
globalThis.window = {};
const scripts = new Set();
const frames = new Set();
globalThis.document = {
  createElement(tag) {
    if (tag !== 'iframe') return { tag };
    const callbacks = {};
    return {
      contentWindow: callbacks,
      contentDocument: {
        createElement: () => ({ callbacks, remove() { scripts.delete(this); } }),
        head: { appendChild: script => scripts.add(script) },
      },
      setAttribute() {},
      remove() { frames.delete(this); },
    };
  },
  body: { appendChild: frame => frames.add(frame) },
};
const item = { time: Date.now(), title: 'API title', pic: 'https://example.invalid/cover.jpg', desc: 'API description', author: 'API author', duration: '1:00', views: '12', danmaku: '3' };
const fields = ['title', 'desc', 'author', 'cover', 'duration', 'views', 'danmaku'];
const nodes = Object.fromEntries(fields.map(field => [field, { textContent: `manual ${field}`, style: {}, classList: { remove() {} } }]));
const card = {
  dataset: { biliPreserve: fields.join(',') },
  querySelector: selector => nodes[selector.match(/data-bili-([^\]]+)/)?.[1]] ?? null,
  classList: { add() {} },
};
applyBiliData(card, item);
for (const field of fields) assert.equal(nodes[field].textContent, `manual ${field}`, `preserve authored ${field}`);
card.dataset.biliPreserve = 'author,cover';
applyBiliData(card, item);
assert.equal(nodes.desc.textContent, item.desc, 'fill metadata that was not authored');

storage.set('bili_cache_v1_BV0000000001', JSON.stringify({ ...item, time: Date.now() - 2 * 86400000 }));
assert.ok(readBiliCache('BV0000000001'), 'old seven-day caches remain readable');
assert.equal(readBiliCache('BV0000000001', 3600000), null, 'old metadata must not suppress fresh stats');
storage.set('bili_cache_v1_BV0000000002', '{broken');
assert.equal(readBiliCache('BV0000000002'), null);
storage.set('bili_cache_v1_BV0000000003', JSON.stringify({ ...item, time: Date.now() + 60000 }));
assert.equal(readBiliCache('BV0000000003'), null, 'future timestamps are invalid');

const payload = { code: 0, data: { title: 'remote title', pic: item.pic, desc: 'description', owner: { name: 'author' }, duration: 60, stat: { view: 0, danmaku: 0 } } };
function respond(script, response = payload) {
  const callback = new URL(script.src).searchParams.get('callback');
  script.callbacks[callback](response);
  assert.equal(script.callbacks[callback], undefined, 'JSONP callback must be removed');
}
const first = new AbortController();
const second = new AbortController();
const p1 = loadBiliVideo('BV0000000004', first.signal);
const p2 = loadBiliVideo('BV0000000004', second.signal);
assert.equal(scripts.size, 1, 'same BV shares one request');
first.abort();
await assert.rejects(p1, { name: 'AbortError' });
assert.equal(scripts.size, 1, 'another consumer still needs this request');
respond([...scripts][0]);
assert.equal((await p2).views, '0', 'zero plays are valid');
assert.equal(scripts.size, 0);
await loadBiliVideo('BV0000000004', new AbortController().signal);
assert.equal(scripts.size, 0, 'fresh cache avoids a second request');

const leaving = new AbortController();
const requests = Array.from({ length: 5 }, (_, i) => loadBiliVideo(`BV00000000${10 + i}`, leaving.signal));
assert.equal(scripts.size, 2, 'at most two network requests are active');
const settled = Promise.allSettled(requests);
leaving.abort();
assert.ok((await settled).every(result => result.status === 'rejected' && result.reason.name === 'AbortError'));
await new Promise(resolve => queueMicrotask(resolve));
assert.equal(scripts.size, 0, 'leaving removes active scripts and queued requests');
assert.equal(frames.size, 0, 'leaving removes JSONP execution contexts');
assert.equal(Object.keys(window).length, 0, 'leaving removes JSONP globals');

const failing = loadBiliVideo('BV0000000099', new AbortController().signal);
[...scripts][0].onerror();
await assert.rejects(failing, /failed/);
assert.equal(scripts.size, 0);

await fs.mkdir('scratch', { recursive: true });
const root = await fs.mkdtemp(path.resolve('scratch/bili-sync-check-'));
await fs.mkdir(path.join(root, 'src/data'), { recursive: true });
const listPath = path.join(root, 'src/data/bilibili-videos.json');
const cachePath = path.join(root, 'src/data/bilibili-cache.json');
await fs.writeFile(listPath, '["original list"]');
await fs.writeFile(cachePath, JSON.stringify({ BV0000000004: { desc: 'preserved description', danmaku: '42' }, BV0000000005: { title: 'unrelated video' } }));
const originalList = await fs.readFile(listPath, 'utf8');
const originalCache = await fs.readFile(cachePath, 'utf8');
const api = data => async () => ({ ok: true, json: async () => data });
await assert.rejects(syncBilibili({ root, mid: '12345', fetcher: api({ code: -412, message: 'blocked' }) }), /blocked/);
await assert.rejects(syncBilibili({ root, mid: '12345', fetcher: api({ code: 0, data: { media_list: [{}] } }) }), /Invalid video/);
assert.equal(await fs.readFile(listPath, 'utf8'), originalList);
assert.equal(await fs.readFile(cachePath, 'utf8'), originalCache);
await syncBilibili({ root, mid: '12345', fetcher: api({ code: 0, data: { media_list: [{ bv_id: 'BV0000000004', title: 'new title', cover: 'http://example.invalid/cover.jpg', duration: 60, cnt_info: { play: 0 }, pubtime: 1 }] } }) });
const cache = JSON.parse(await fs.readFile(cachePath, 'utf8'));
assert.equal(cache.BV0000000004.desc, 'preserved description');
assert.equal(cache.BV0000000004.danmaku, '42');
assert.equal(cache.BV0000000004.views, '0');
assert.equal(cache.BV0000000005.title, 'unrelated video');
const preload = 'data:text/javascript,' + encodeURIComponent('globalThis.fetch = async () => { throw new Error("offline test"); };');
const cli = spawnSync(process.execPath, ['--import', preload, 'scripts/sync-bilibili.mjs'], { encoding: 'utf8' });
assert.equal(cli.status, 1, 'failed sync must return a failing exit status');
console.log('[bilibili] authored fields, cache, deduplication, concurrency, cancellation and safe sync passed');
