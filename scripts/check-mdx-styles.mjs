import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

// Exercise the MDX compiler's real style conversion path, without Astro's cache.
const rootRequire = createRequire(import.meta.url);
const integrationRequire = createRequire(rootRequire.resolve('@astrojs/mdx'));
const compilerRequire = createRequire(integrationRequire.resolve('@mdx-js/mdx'));
const estreeRequire = createRequire(compilerRequire.resolve('hast-util-to-estree'));
const styleModule = await import(pathToFileURL(estreeRequire.resolve('style-to-js')).href);
assert.equal(typeof styleModule.default, 'function', 'MDX requires a callable style-to-js default export');
const { toEstree } = await import(pathToFileURL(compilerRequire.resolve('hast-util-to-estree')).href);
toEstree({
  type: 'root',
  children: [{
    type: 'element', tagName: 'span',
    properties: { style: 'color: red; font-weight: 700; --paper-accent: #9e2a2b' },
    children: [{ type: 'text', value: 'MDX style regression check' }],
  }],
});
console.log('[mdx] inline-style conversion passed');
