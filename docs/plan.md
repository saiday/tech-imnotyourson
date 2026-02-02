# Migration Plan: Ghost Tech Blog → Astro 5 on Cloudflare Pages

## Summary

Migrate ~73 articles from Ghost CMS (imnotyourson.com on AWS EC2) to a static Astro 5 site deployed on Cloudflare Pages at `tech.imnotyourson.com`. Follow patterns from the existing `imnotyourson-photos` project.

## Key Decisions

- **Static output** (no SSR, no `@astrojs/cloudflare` adapter)
- **Shiki built-in** syntax highlighting (zero JS, `github-dark` theme)
- **Domain:** `tech.imnotyourson.com` (CNAME subdomain)
- **Dark-only theme**, scoped CSS, CSS variables (matching photos site)
- **Functional tags** with `/tag/[tag]/` archive pages
- **Cloudflare Web Analytics** only (no GA)
- **Same URL slugs** as Ghost for URL preservation
- **URL redirects** from old `imnotyourson.com` paths to new `tech.imnotyourson.com`
- **Ghost `markdown` field** used directly (no HTML-to-markdown conversion needed)
- **Astro 5 Content Layer API** with `glob` loader (not legacy `type: 'content'`)

---

## Implementation Steps

### Step 1: Project Scaffolding ✅

**Files to create/modify:**
- `package.json`
- `astro.config.mjs`
- `tsconfig.json`
- `.gitignore`

```bash
cd /Users/saiday/projects/tech-imnotyourson
npm create astro@latest . -- --template minimal --no-git --no-install
npm install
npm install -D @astrojs/rss wrangler
```

**`astro.config.mjs`:**
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tech.imnotyourson.com',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
```

No `@astrojs/cloudflare` adapter — static output is the default.

**`package.json` scripts:**
```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "migrate": "node scripts/migrate-ghost.mjs"
}
```

---

### Step 2: Migration Script ✅

**File:** `scripts/migrate-ghost.mjs`

Parse the Ghost JSON export (user provides the file). For each published post:

1. Extract `title`, `slug`, `published_at`, `markdown`, `meta_description`
2. Resolve tags via `posts_tags` junction table → `tags` array
3. Normalize code fence languages in markdown:
   - `prettyprint objective-c` → `objc`
   - `prettyprint` (no lang) → plain fence
   - `pretty-bash` / `language-bash` → `bash`
   - `language-swift` → `swift`, etc.
   - Lowercase all language identifiers
4. Convert GitHub Gist `<script>` embeds → `[View Gist](url)` links
5. Generate description from `meta_description` or first ~160 chars of content
6. Write `.md` file with YAML frontmatter to `src/content/posts/{slug}.md`
7. Report all `/content/images/...` references for image download

**Image handling:** Script outputs a list of image URLs from Ghost. Download them with curl into `public/content/images/` preserving paths so markdown references work unchanged.

---

### Step 3: Content Collection ✅

**File:** `src/content.config.ts` (Astro 5 location — NOT `src/content/config.ts`)

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().default(''),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

**Content directory:** `src/content/posts/` — 73 `.md` files named by slug.

---

### Step 4: Layouts ✅

**`src/layouts/BaseLayout.astro`** — Adapted from photos site `BaseLayout.astro`:
- Same CSS variables (`--color-bg: #1a1a1a`, `--color-text: #ffffff`, etc.)
- Add `--color-accent: #6cb6ff` for prose links
- Same global resets and system font stack
- Remove Google Analytics, keep Cloudflare Web Analytics only
- Add RSS `<link>` in `<head>`
- Open Graph / Twitter meta tags

**`src/layouts/PostLayout.astro`** — Article wrapper:
- Props: `title`, `description`, `date`, `tags`
- Renders date, clickable tag links, then `<slot />` for content
- Container max-width: ~720px (narrower than photos site for readability)
- Prose styles via `:global()` scoped CSS:
  - Code blocks: `#0d1117` background, border, border-radius, overflow-x scroll
  - Inline code: `#2d2d2d` background, padding, border-radius
  - Links: accent color with subtle underline
  - Blockquotes, lists, images, tables

---

### Step 5: Components ✅

**`src/components/Header.astro`** — Adapted from photos site:
- Site title "imnotyourson" linking to `/`
- Minimal nav: RSS link
- Same dark header styling

---

### Step 6: Pages ✅

**`src/pages/index.astro`** → later replaced by `src/pages/[...page].astro` — Article list (homepage):
- `getCollection('posts')`, filter drafts, sort newest first
- Each entry: title (linked), date, tag pills (linked)
- No excerpts, no images — scannable list

**`src/pages/[slug].astro`** — Individual articles:
```astro
export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.filter(p => !p.data.draft).map(post => ({
    params: { slug: post.data.slug },
    props: { post },
  }));
}
const { post } = Astro.props;
const { Content } = await render(post);
```
- Uses `post.data.slug` as the URL param (preserving Ghost URLs)
- Renders through PostLayout with Shiki-highlighted code blocks

**`src/pages/tag/[tag].astro`** — Tag archive:
- `getStaticPaths()` collects all unique tags, generates a page per tag
- Tag name → slug: `tag.toLowerCase().replace(/\s+/g, '-')`
- Same list format as index, filtered to one tag

**Tag slug utility:** Extract the `tag → slug` conversion to `src/utils/tags.ts` to ensure consistency across PostLayout, index, tag page, and sitemap.

---

### Step 7: RSS & Sitemap ✅

**`src/pages/rss.xml.ts`** — Following photos site pattern with `@astrojs/rss`.

**`src/pages/sitemap.xml.ts`** — Manual XML generation including homepage, all posts, and all tag pages.

---

### Step 8: URL Redirects (article-only, old domain → new subdomain)

Redirect **only the 73 existing article URLs** from `imnotyourson.com` to `tech.imnotyourson.com`. The root `imnotyourson.com/` and any non-article paths stay untouched.

**Implementation: Cloudflare Bulk Redirect List**

1. In Cloudflare dashboard → Bulk Redirects → Create a redirect list
2. Add only the 73 specific article paths as 301 redirects:
   ```
   imnotyourson.com/adding-shortcuts-and-spotlight-actions-to-ios/ → tech.imnotyourson.com/adding-shortcuts-and-spotlight-actions-to-ios/
   imnotyourson.com/autoreleasepool-in-arc/ → tech.imnotyourson.com/autoreleasepool-in-arc/
   ... (73 entries total)
   ```
3. Enable the redirect list via a Bulk Redirect Rule

**The migration script will output a CSV/list of all 73 redirect pairs** ready to import into Cloudflare's Bulk Redirect, so you don't have to type them manually.

This approach:
- Only redirects article URLs, not the entire domain
- Works regardless of whether Ghost is still running
- Preserves SEO link equity via 301 permanent redirects
- Can be set up before or after decommissioning Ghost

---

### Step 9: Deployment & DNS

1. **Create Cloudflare Pages project:**
   ```bash
   wrangler pages project create tech-imnotyourson
   ```
   - Build command: `npm run build`
   - Output directory: `dist/`
   - Node version env var: `NODE_VERSION=20`

2. **DNS CNAME:** In Cloudflare DNS for `imnotyourson.com`:
   - Name: `tech`
   - Target: `tech-imnotyourson.pages.dev`
   - Proxied: Yes

3. **Custom domain:** Add `tech.imnotyourson.com` in Pages project settings.

4. **Cloudflare Web Analytics:** Create site, get token, add to BaseLayout.

---

## File Structure

```
/Users/saiday/projects/tech-imnotyourson/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .gitignore
├── public/
│   ├── favicon.ico
│   └── content/images/          # Downloaded Ghost images
├── scripts/
│   └── migrate-ghost.mjs        # One-time Ghost → Astro converter
├── src/
│   ├── content.config.ts         # Astro 5 content collection schema
│   ├── content/
│   │   └── posts/                # 73 migrated .md articles
│   ├── components/
│   │   └── Header.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/
│   │   ├── [...page].astro       # Paginated article list homepage
│   │   ├── [slug].astro          # Article detail
│   │   ├── tag/
│   │   │   └── [tag].astro       # Tag archive
│   │   ├── rss.xml.ts
│   │   └── sitemap.xml.ts
│   └── utils/
│       └── tags.ts               # Tag name → slug helper
```

---

## Post-Implementation Improvements ✅

### Restore Gist `<script>` Embeds ✅
Removed `convertGistEmbeds()` from migration script so Gist `<script>` tags are preserved as-is. Re-ran migration to regenerate `.md` files.

### Paginated Index (5 posts per page) ✅
Converted single-page index to `src/pages/[...page].astro` with `paginate(posts, { pageSize: 5 })`. Generates 15 pages.

### Add Disqus Comments ✅
Created `src/components/Disqus.astro` and added to `PostLayout.astro`.

### UI Fixes ✅
- Dark theme CSS for Gist embeds (idle-fingers syntax theme + dark overrides)
- 2-line clamp on index page `.post-title` for consistent row heights
- Removed double divider between post list and pagination

---

## Remaining TODO

- [ ] Download Ghost images from EC2 before shutdown
- [ ] Configure Cloudflare Bulk Redirect list with 73 article-specific redirects
- [ ] Set up Cloudflare Web Analytics (replace `REPLACE_ME` token in BaseLayout)
- [ ] Deploy to Cloudflare Pages
- [ ] Disqus URL Mapper: upload CSV mapping old → new URLs
- [ ] Decommission AWS EC2 Ghost instance after redirects confirmed
