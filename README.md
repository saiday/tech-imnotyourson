# tech.imnotyourson.com

Astro 5 static tech blog, migrated from Ghost CMS. Deployed on Cloudflare Pages.

## URLs

- **Production:** https://tech.imnotyourson.com
- **Cloudflare default:** https://tech-imnotyourson.pages.dev

## Tech stack

- [Astro](https://astro.build/) 5.17.1, static output (no SSR)
- Shiki syntax highlighting (`github-dark` theme)
- Cloudflare Pages hosting
- Cloudflare Web Analytics (no Google Analytics)
- Disqus comments (`imnotyourson` forum)

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview production build
```

## Project structure

```
src/
├── content.config.ts          # Zod schema for posts collection (glob loader)
├── content/posts/             # 73 markdown posts
├── components/
│   ├── Disqus.astro           # Disqus embed component
│   └── Header.astro           # Site header / nav
├── layouts/
│   ├── BaseLayout.astro       # HTML shell, CF Web Analytics script
│   └── PostLayout.astro       # Article layout, includes Disqus
├── pages/
│   ├── [...page].astro        # Paginated index (5 per page)
│   ├── [slug].astro           # Individual post pages
│   ├── tag/[tag].astro        # Tag archive pages
│   ├── rss.xml.ts             # RSS feed
│   └── sitemap.xml.ts         # XML sitemap
└── utils/
    └── tags.ts                # Tag slug helper
```

## Content

73 posts in `src/content/posts/`. Each post uses this frontmatter schema:

```yaml
---
title: "string"
slug: "string"
date: "2024-01-15T12:00:00.000Z"   # ISO 8601, coerced to Date
description: "string"               # auto-generated if empty
tags: ["iOS", "Swift"]              # can be empty
draft: false                        # default: false
---
```

Images live in `public/content/images/` organized by year/month.

## Routing

| Path | Source | Description |
|------|--------|-------------|
| `/` | `[...page].astro` | Paginated post index, 5 per page |
| `/{slug}/` | `[slug].astro` | Individual post |
| `/tag/{tag}/` | `tag/[tag].astro` | Posts filtered by tag |
| `/rss.xml` | `rss.xml.ts` | RSS feed |
| `/sitemap.xml` | `sitemap.xml.ts` | XML sitemap |

## Deployment

GitHub repo linked to Cloudflare Pages. Auto-builds on push to `main`.

- **Build command:** `npm run build`
- **Output directory:** `dist/`
- **Node version:** 20

No `wrangler.toml` needed — Cloudflare Pages handles the static hosting.

## Migration script

```bash
npm run migrate   # node scripts/migrate-ghost.mjs [ghost-export.json]
```

Reads a Ghost JSON export and generates Astro-compatible markdown files. Handles:
- Extracting published posts with tags
- Normalizing code fence language identifiers
- Generating descriptions from meta or content
- Outputting image download commands and Cloudflare redirect mappings

## Reference files

```
docs/
├── cloudflare-redirects.csv   # 73 bulk redirects (old domain → new)
├── disqus-url-mapper.csv      # Disqus comment URL mappings
└── plan.md                    # Original migration plan
```
