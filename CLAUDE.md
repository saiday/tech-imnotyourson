# tech.imnotyourson.com

Saiday's personal tech blog. Astro 5, static output, deployed on Cloudflare Pages. Migrated from
Ghost, so old URLs must keep working.

## What matters here

This is a writing project with a small site around it. Almost every task is either writing a post or
keeping the publishing path working. The site code is deliberately plain: no UI framework, no client
JS beyond the Disqus embed and Cloudflare analytics.

## Where things live

- `src/content/posts/` is the blog. One markdown file per post, frontmatter validated by
  `src/content.config.ts`.
- `src/pages/` builds the index, tag pages, per-post pages, RSS, and sitemap from that collection.
- `docs/` is the working documentation.

## Before writing or editing a post

Read `docs/tech-post-content-style.md` for what a post is, its structure and its claims as much
as its sentences, and `docs/creating-posts.md` for frontmatter,
images, drafts, and deploy. Those two files are authoritative; do not restate their rules here.

## Constraints

- A post's `slug` is its permanent URL, and Disqus uses it as the thread identifier. Never change one
  on an existing post: it breaks inbound links and orphans the comments. The Ghost-era redirects and
  the Disqus domain migration map are in `docs/cloudflare-redirects.csv` and
  `docs/disqus-url-mapper.csv`.
- Publishing is push to `main`. Anything committed there goes live, so drafts stay `draft: true`.
- Images are committed to the repo under `public/content/images/YYYY/MM/`.
