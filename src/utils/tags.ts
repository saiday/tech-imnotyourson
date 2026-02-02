export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[\/\.:]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
