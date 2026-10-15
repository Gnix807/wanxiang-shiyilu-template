import assert from 'node:assert/strict';
import { onPageReady } from '../src/scripts/lifecycle.ts';

const previousDocument = globalThis.document;
const doc = new EventTarget();
doc.body = {};
doc.readyState = 'loading';
globalThis.document = doc;
let mounts = 0;
let cleanups = 0;
try {
  const stop = onPageReady(() => { mounts++; return () => { cleanups++; }; });
  doc.dispatchEvent(new Event('DOMContentLoaded'));
  doc.dispatchEvent(new Event('astro:page-load'));
  doc.dispatchEvent(new Event('astro:page-load'));
  assert.equal(mounts, 1, 'initial ready and page-load must not double-bind');
  doc.dispatchEvent(new Event('astro:before-swap'));
  assert.equal(cleanups, 1);
  doc.body = {};
  doc.dispatchEvent(new Event('astro:page-load'));
  assert.equal(mounts, 2);
  stop();
  stop();
  assert.equal(cleanups, 2, 'cleanup must be idempotent');
  doc.body = {};
  doc.dispatchEvent(new Event('astro:page-load'));
  assert.equal(mounts, 2, 'disposed entry must not remount');
} finally {
  if (previousDocument === undefined) delete globalThis.document;
  else globalThis.document = previousDocument;
}
console.log('[lifecycle] mount once, clean before swap, and dispose passed');
