import { siteConfig } from '../config/site';

export async function GET(context: any) {
  const siteUrl = context.site ? context.site.toString() : siteConfig.url;
  const domain = siteUrl.replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${domain}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
