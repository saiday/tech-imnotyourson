# Creating a new post

## 1. Create the file

Add a markdown file in `src/content/posts/` using kebab-case:

```
src/content/posts/my-new-post.md
```

## 2. Frontmatter

Paste this template and fill it in:

```yaml
---
title: "Your Post Title"
slug: "your-post-slug"
date: "2026-02-03T12:00:00.000Z"
description: "One-line summary of the post"
tags: ["iOS", "Swift"]
draft: false
---
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | Displayed as the article heading |
| `slug` | yes | Becomes the URL: `/{slug}/` |
| `date` | yes | ISO 8601 format |
| `description` | no | Defaults to empty string; shown in post listings |
| `tags` | no | Array of strings; generates `/tag/{tag}/` pages |
| `draft` | no | Set `true` to hide from index, RSS, and sitemap |

## 3. Images

Store images in `public/content/images/YYYY/MM/`:

```
public/content/images/2026/02/my-image.jpg
```

Reference in markdown with an absolute path:

```markdown
![Alt text](/content/images/2026/02/my-image.jpg)
```

## 4. Drafts

Set `draft: true` in frontmatter. The post won't appear in the index, tag pages, RSS feed, or sitemap. It also won't have a generated page at `/{slug}/`.

Flip to `draft: false` when ready to publish.

## 5. Preview locally

```bash
npm run dev
```

Visit `http://localhost:4321/{slug}/` to check the post.

## 6. Deploy

Push to `main`. Cloudflare Pages auto-builds and deploys.
