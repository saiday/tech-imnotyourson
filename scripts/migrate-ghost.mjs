/**
 * migrate-ghost.mjs
 *
 * Migrates published posts from a Ghost JSON export into Astro-compatible
 * markdown files with YAML frontmatter.
 *
 * Usage:
 *   node scripts/migrate-ghost.mjs [path-to-ghost-export.json]
 *
 * If no path is given the default export path is used.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const ghostJsonPath =
  process.argv[2] ||
  resolve(projectRoot, 'imnotyourson.ghost.2026-02-02.json');

const outputDir = resolve(projectRoot, 'src/content/posts');

// ---------------------------------------------------------------------------
// Read & parse Ghost export
// ---------------------------------------------------------------------------

console.log(`Reading Ghost export from: ${ghostJsonPath}`);
const ghost = JSON.parse(readFileSync(ghostJsonPath, 'utf-8'));

const allPosts = ghost.db[0].data.posts;
const allTags = ghost.db[0].data.tags;
const postsTags = ghost.db[0].data.posts_tags;

// Build lookup maps
const tagById = new Map(allTags.map(t => [t.id, t]));

// post_id -> sorted tag names
const tagsForPost = new Map();
for (const pt of postsTags) {
  if (!tagsForPost.has(pt.post_id)) {
    tagsForPost.set(pt.post_id, []);
  }
  tagsForPost.get(pt.post_id).push({ tagId: pt.tag_id, sort: pt.sort_order });
}
for (const [postId, arr] of tagsForPost) {
  arr.sort((a, b) => a.sort - b.sort);
  tagsForPost.set(
    postId,
    arr.map(a => {
      const tag = tagById.get(a.tagId);
      return tag ? tag.name : null;
    }).filter(Boolean),
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse Ghost's published_at format ("2013-07-01 18:07:00") into ISO string.
 */
function parseDate(ghostDate) {
  if (!ghostDate) return new Date().toISOString();
  // Ghost stores dates as "YYYY-MM-DD HH:MM:SS" (UTC)
  const iso = ghostDate.replace(' ', 'T') + '.000Z';
  return new Date(iso).toISOString();
}

/**
 * Normalize code-fence language identifiers.
 *
 * Patterns handled (order matters):
 *   prettyprint objective-c        -> objc
 *   prettyprint language-objectivec -> objc
 *   prettyprint language-swift      -> swift
 *   prettyprint bash               -> bash
 *   prettyprint (bare)             -> (empty — plain fence)
 *   pretty-bash                    -> bash
 *   language-bash                  -> bash
 *   language-swift                 -> swift
 *   language-*                     -> * (strip prefix)
 *   objective-c / objectivec       -> objc
 *   Java (capital)                 -> java
 *   Vim (capital)                  -> vim
 *   everything else                -> lowercased
 */
function normalizeCodeFences(md) {
  return md.replace(/```([^\n]*)/g, (_match, langRaw) => {
    let lang = langRaw.trim();

    if (!lang) return '```';

    // Strip leading "prettyprint " prefix (may have further qualifiers)
    if (lang.startsWith('prettyprint')) {
      lang = lang.replace(/^prettyprint\s*/, '').trim();
      if (!lang) return '```'; // bare prettyprint
    }

    // Strip "pretty-" prefix
    lang = lang.replace(/^pretty-/, '');

    // Strip "language-" prefix
    lang = lang.replace(/^language-/, '');

    // Normalize objective-c variants
    if (/^objective-?c$/i.test(lang) || /^objectivec$/i.test(lang)) {
      return '```objc';
    }

    // Lowercase everything
    lang = lang.toLowerCase();

    return '```' + lang;
  });
}

/**
 * Strip basic markdown formatting to produce a plain-text excerpt.
 */
function stripMarkdown(md) {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')   // images
    .replace(/\[[^\]]*\]\([^)]*\)/g, '')     // links
    .replace(/<[^>]+>/g, '')                  // HTML tags
    .replace(/```[\s\S]*?```/g, '')          // code blocks
    .replace(/`[^`]+`/g, '')                 // inline code
    .replace(/#{1,6}\s+/g, '')               // headings
    .replace(/[*_~>]+/g, '')                 // emphasis, blockquotes
    .replace(/\n{2,}/g, ' ')                 // collapse newlines
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Generate a description from meta_description or first ~160 chars of content.
 */
function generateDescription(metaDescription, markdown) {
  if (metaDescription && metaDescription.trim()) {
    return metaDescription.trim();
  }
  const plain = stripMarkdown(markdown || '');
  if (plain.length <= 160) return plain;
  // Cut at last word boundary before 160 chars
  const trimmed = plain.substring(0, 160);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 0 ? trimmed.substring(0, lastSpace) : trimmed) + '...';
}

/**
 * Escape a string for use inside double-quoted YAML.
 */
function yamlEscape(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

/**
 * Build the YAML frontmatter + body for one post.
 */
function buildFile(post, tags, body) {
  const title = yamlEscape(post.title || 'Untitled');
  const slug = post.slug;
  const date = parseDate(post.published_at);
  const description = yamlEscape(
    generateDescription(post.meta_description, post.markdown),
  );
  const tagList = tags.map(t => `"${yamlEscape(t)}"`).join(', ');

  const frontmatter = [
    '---',
    `title: "${title}"`,
    `slug: "${slug}"`,
    `date: "${date}"`,
    `description: "${description}"`,
    `tags: [${tagList}]`,
    `draft: false`,
    '---',
  ].join('\n');

  return frontmatter + '\n\n' + body.trimEnd() + '\n';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

mkdirSync(outputDir, { recursive: true });

const publishedPosts = allPosts.filter(p => p.status === 'published');
const allImageRefs = new Set();
const redirects = [];
let postsWritten = 0;

for (const post of publishedPosts) {
  const tags = tagsForPost.get(post.id) || [];

  let body = post.markdown || '';

  // Normalize code fences
  body = normalizeCodeFences(body);

  // Collect /content/images/ references
  const imageMatches = body.match(/\/content\/images\/[^\s)"']*/g) || [];
  imageMatches.forEach(ref => allImageRefs.add(ref));

  // Write file
  const fileContent = buildFile(post, tags, body);
  const filePath = resolve(outputDir, `${post.slug}.md`);
  writeFileSync(filePath, fileContent, 'utf-8');
  postsWritten++;

  // Collect redirect
  redirects.push(
    `imnotyourson.com/${post.slug}/ → tech.imnotyourson.com/${post.slug}/`,
  );
}

// ---------------------------------------------------------------------------
// Output: Image references
// ---------------------------------------------------------------------------

console.log('\n========================================');
console.log(' IMAGE REFERENCES');
console.log('========================================\n');

const sortedImages = [...allImageRefs].sort();
if (sortedImages.length === 0) {
  console.log('(none)');
} else {
  for (const img of sortedImages) {
    console.log(`curl -O "https://imnotyourson.com${img}"`);
  }
}

// ---------------------------------------------------------------------------
// Output: Redirects
// ---------------------------------------------------------------------------

console.log('\n========================================');
console.log(' CLOUDFLARE BULK REDIRECTS');
console.log('========================================\n');

for (const r of redirects) {
  console.log(r);
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log('\n========================================');
console.log(' SUMMARY');
console.log('========================================\n');
console.log(`Posts written:        ${postsWritten}`);
console.log(`Image references:     ${allImageRefs.size}`);
console.log(`Redirects generated:  ${redirects.length}`);
console.log(`Output directory:     ${outputDir}`);
console.log('\nDone.');
