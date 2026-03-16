/** Generate a URL-safe slug from heading text — strips HTML tags, inline code, and markdown links. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
