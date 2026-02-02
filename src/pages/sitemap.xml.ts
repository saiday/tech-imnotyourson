import { getCollection } from 'astro:content';
import { tagSlug } from '../utils/tags';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const published = posts.filter(post => !post.data.draft);

  const siteUrl = context.site?.toString().replace(/\/$/, '') || 'https://tech.imnotyourson.com';

  const tagSet = new Set<string>();
  for (const post of published) {
    for (const tag of post.data.tags) {
      tagSet.add(tagSlug(tag));
    }
  }

  const staticPages = [
    { url: `${siteUrl}/`, priority: '1.0' },
  ];

  const postPages = published.map(post => ({
    url: `${siteUrl}/${post.data.slug}/`,
    lastmod: post.data.date.toISOString().split('T')[0],
    priority: '0.7',
  }));

  const tagPages = Array.from(tagSet).map(tag => ({
    url: `${siteUrl}/tag/${tag}/`,
    priority: '0.5',
  }));

  const allPages = [...staticPages, ...postPages, ...tagPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    page => `  <url>
    <loc>${page.url}</loc>${page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : ''}
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
