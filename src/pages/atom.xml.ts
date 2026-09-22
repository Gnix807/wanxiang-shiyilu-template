import { getCollection } from 'astro:content';
import { siteConfig } from '../config/site';
import MarkdownIt from 'markdown-it';
import markdownItCjkFriendly from 'markdown-it-cjk-friendly';
import sanitizeHtml from 'sanitize-html';
import type { APIContext } from 'astro';

const parser = new MarkdownIt().use(markdownItCjkFriendly);

function stripInvalidXmlChars(str: string): string {
  return str.replace(
    /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
    '',
  );
}

function stripMarkdown(md: string): string {
  return md
    .replace(/[#*`_\[\]()\->|~]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toIso8601(value: unknown): string {
  if (!value) return new Date().toISOString();
  const d = value instanceof Date ? value : new Date(value as string | number);
  if (isNaN(d.getTime())) return new Date().toISOString();
  // Frontmatter dates are Beijing Time (UTC+8) but parsed by js-yaml as UTC.
  // Subtract 8h to get correct UTC moment
  const utc = new Date(d.getTime() - 8 * 60 * 60 * 1000);
  return utc.toISOString();
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(context: APIContext) {
  const [posts, talks] = await Promise.all([
    getCollection('posts'),
    getCollection('talks'),
  ]);

  const siteUrl = (context.site ?? new URL(siteConfig.url)).toString().replace(/\/$/, '');
  const author = siteConfig.author;

  const entries = [
    ...posts.map((post) => {
      const body = typeof post.body === 'string' ? post.body : '';
      const cleaned = stripInvalidXmlChars(body);
      const slug = (post.data.slug || (post as any).slug || post.id || '').trim();
      const desc = post.data.description || stripMarkdown(body).substring(0, 180);
      const url = `${siteUrl}/posts/${slug}/`;
      const published = toIso8601(post.data.published || post.data.date);
      const updated = post.data.updated ? toIso8601(post.data.updated) : published;
      const category = post.data.category || post.data.tags?.[0] || '文章';
      const content = sanitizeHtml(parser.render(cleaned), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      });
      return {
        timestamp: new Date(published).getTime(),
        xml: [
          '  <entry>',
          `    <id>${escapeXml(url)}</id>`,
          `    <title>${escapeXml(post.data.title)}</title>`,
          `    <link href="${escapeXml(url)}" rel="alternate"/>`,
          `    <published>${published}</published>`,
          `    <updated>${updated}</updated>`,
          `    <author><name>${escapeXml(author)}</name></author>`,
          `    <category term="${escapeXml(category)}"/>`,
          `    <summary>${escapeXml(desc)}</summary>`,
          `    <content type="html"><![CDATA[${content}]]></content>`,
          '  </entry>',
        ].join('\n'),
      };
    }),
    ...talks.map((talk) => {
      const body = typeof talk.body === 'string' ? talk.body : '';
      const cleaned = stripInvalidXmlChars(body);
      const slug = (talk.data.slug || (talk as any).slug || talk.id || '').trim();
      const url = `${siteUrl}/talk/${slug}/`;
      const published = toIso8601(talk.data.date);
      const updated = published;
      const desc = body.substring(0, 180).replace(/[#*`_\[\]()\-]/g, '').trim() || '';
      const content = sanitizeHtml(parser.render(cleaned), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      });
      return {
        timestamp: new Date(published).getTime(),
        xml: [
          '  <entry>',
          `    <id>${escapeXml(url)}</id>`,
          `    <title>${escapeXml(`「说说」${talk.data.title}`)}</title>`,
          `    <link href="${escapeXml(url)}" rel="alternate"/>`,
          `    <published>${published}</published>`,
          `    <updated>${updated}</updated>`,
          `    <author><name>${escapeXml(author)}</name></author>`,
          `    <category term="说说"/>`,
          `    <summary>${escapeXml(desc)}</summary>`,
          `    <content type="html"><![CDATA[${content}]]></content>`,
          '  </entry>',
        ].join('\n'),
      };
    }),
  ]
    .sort((a, b) => b.timestamp - a.timestamp);

  const latestUpdated = entries.length > 0
    ? new Date(entries[0].timestamp).toISOString()
    : new Date().toISOString();

  const atomXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `  <id>${escapeXml(siteUrl)}/atom.xml</id>`,
    `  <title>${escapeXml(siteConfig.title)}</title>`,
    `  <subtitle>${escapeXml(siteConfig.subtitle || '')}</subtitle>`,
    `  <updated>${latestUpdated}</updated>`,
    `  <link href="${escapeXml(siteUrl)}/atom.xml" rel="self" type="application/atom+xml"/>`,
    `  <link href="${escapeXml(siteUrl)}/" rel="alternate" type="text/html"/>`,
    `  <author>`,
    `    <name>${escapeXml(author)}</name>`,
    `    <email>${escapeXml(siteConfig.socials.email || '')}</email>`,
    `    <uri>${escapeXml(siteUrl)}</uri>`,
    `  </author>`,
    `  <icon>${escapeXml(siteConfig.avatar)}</icon>`,
    `  <logo>${escapeXml(siteConfig.avatar)}</logo>`,
    `  <rights>© 2026 ${escapeXml(author)}. All rights reserved.</rights>`,
    `  <generator uri="https://astro.build">Astro</generator>`,
    entries.map((e) => e.xml).join('\n'),
    '</feed>',
  ].join('\n');

  return new Response(atomXml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
