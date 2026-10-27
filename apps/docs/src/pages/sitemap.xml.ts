import type { APIRoute } from 'astro';
import componentsData from '../data/components-data.json';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = (site ? site.toString() : 'https://nnui-kit.vercel.app').replace(/\/$/, '');
  const now = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily', title: 'NNUI-KIT — All-In-One Universal UI Kit' },
    { url: '/docs', priority: '0.95', changefreq: 'daily', title: 'NNUI-KIT Documentation & Architecture' },
    { url: '/components', priority: '0.95', changefreq: 'daily', title: 'NNUI-KIT Components Catalog' },
    { url: '/shadow-vs-light', priority: '0.9', changefreq: 'weekly', title: 'Why Light DOM: Shadow DOM vs Light DOM Manifesto' },
    { url: '/tokens', priority: '0.85', changefreq: 'weekly', title: 'Design System Tokens & Theme Studio' },
    { url: '/typography', priority: '0.85', changefreq: 'weekly', title: 'Typography Studio & Font Scale' },
    { url: '/llms', priority: '0.9', changefreq: 'weekly', title: 'llms.txt AI Assistant Specification' },
  ];

  const componentPages = Object.values(componentsData).map((comp: any) => ({
    url: `/components/${comp.slug}`,
    priority: ['data-grid', 'stepper', 'ai-prompt-box', 'dialog', 'accordion', 'combobox', 'tabs', 'slider'].includes(comp.slug) ? '0.9' : '0.8',
    changefreq: 'weekly',
    title: `${comp.title} Component — All-In-One Light-DOM UI`,
  }));

  const allPages = [...staticPages, ...componentPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <image:image>
      <image:loc>${siteUrl}/og-image.png</image:loc>
      <image:title>${page.title}</image:title>
    </image:image>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
