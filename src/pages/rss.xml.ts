import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');

  const published = posts
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const siteUrl = (context.site?.toString() || 'https://tech.imnotyourson.com').replace(/\/$/, '');

  return rss({
    title: 'imnotyourson',
    description: 'Your code and agents are scapegoats; I want you to be nice to it.',
    site: siteUrl,
    items: published.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/${post.data.slug}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
