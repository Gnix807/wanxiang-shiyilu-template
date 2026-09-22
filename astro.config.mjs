import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), 'PUBLIC_');
const siteUrl = env.PUBLIC_SITE_URL || 'https://example.com';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough';
import rehypeKatex from 'rehype-katex';
import { remarkFixLooseBold } from './src/plugins/remark-fix-loose-bold.mjs';
import { remarkAdmonitions } from './src/plugins/remark-admonitions.mjs';
import { remarkGithubCard } from './src/plugins/remark-github-card.mjs';
import { rehypeShiftHeadings } from './src/plugins/rehype-shift-headings.mjs';
import { rehypeExternalLinks } from './src/plugins/rehype-external-links.mjs';
import { rehypeTableWrapper } from './src/plugins/rehype-table-wrapper.mjs';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  outDir: process.env.BUILD_OUT_DIR || 'dist',
  build: {
    inlineStylesheets: 'never',
    compressHTML: true,
  },
  integrations: [react(), svelte(), mdx()],
  site: siteUrl,
  redirects: {
    '/talk': {
      destination: '/talks',
      status: 301
    }
  },
  markdown: {
    remarkPlugins: [
      remarkGfm,
      remarkCjkFriendly,
      remarkCjkFriendlyGfmStrikethrough,
      remarkFixLooseBold,
      remarkMath,
      remarkAdmonitions,
      remarkGithubCard,
    ],
    rehypePlugins: [rehypeKatex, rehypeShiftHeadings, [rehypeExternalLinks, { internalDomains: [new URL(siteUrl).hostname] }], rehypeTableWrapper],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: false,
    },
  },
  vite: {
    build: { emptyOutDir: false },
    plugins: [tailwindcss({
      lightningcss: {
        targets: {
          chrome: 49,
          android: 49,
          ios_saf: 10,
          safari: 10,
          firefox: 68,
          edge: 79,
        },
      },
    })],
    ssr: {
      noExternal: ['@fancyapps/ui', '@google/generative-ai']
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
