import { Marked } from "marked";
import { slugify } from "./slugify";
import {
  headingRenderer,
  linkRenderer,
  tableRenderer,
  codeRenderer,
} from "./renderers";

export { slugify } from "./slugify";

const marked = new Marked();

marked.use({
  renderer: {
    heading: headingRenderer,
    link: linkRenderer,
    table: tableRenderer,
    code: codeRenderer,
  },
});

export function renderMarkdown(content: string): string {
  return marked.parse(content) as string;
}

export function extractHeadings(
  content: string,
): { id: string; text: string; depth: number }[] {
  const headings: { id: string; text: string; depth: number }[] = [];
  const regex = /^(#{2,4})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const raw = match[2];
    const id = slugify(raw);
    const text = raw
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    headings.push({ id, text, depth: match[1].length });
  }
  return headings;
}
