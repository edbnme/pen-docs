import { Marked, type Tokens } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  }),
);

marked.use({
  renderer: {
    heading(
      this: { parser: { parseInline: (tokens: Tokens.Generic[]) => string } },
      token: Tokens.Heading,
    ): string {
      const text = token.tokens.map((t) => t.raw).join("");
      const id = text
        .toLowerCase()
        .replace(/<[^>]*>/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      return `<h${token.depth} id="${id}">${this.parser.parseInline(token.tokens)}</h${token.depth}>`;
    },
    link(token: Tokens.Link): string {
      const text = token.text;
      const titleAttr = token.title ? ` title="${token.title}"` : "";
      if (token.href && token.href.startsWith("/docs/")) {
        return `<a href="${token.href}"${titleAttr} data-sveltekit-preload-data="hover">${text}</a>`;
      }
      if (
        token.href &&
        (token.href.startsWith("http://") || token.href.startsWith("https://"))
      ) {
        return `<a href="${token.href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
      }
      return `<a href="${token.href}"${titleAttr}>${text}</a>`;
    },
    table(token: Tokens.Table): string {
      let header = "<tr>";
      for (const cell of token.header) {
        header += `<th>${cell.text}</th>`;
      }
      header += "</tr>";
      let body = "";
      for (const row of token.rows) {
        body += "<tr>";
        for (const cell of row) {
          body += `<td>${cell.text}</td>`;
        }
        body += "</tr>";
      }
      return `<div class="table-wrapper"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
    },
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
    const text = match[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    headings.push({ id, text, depth: match[1].length });
  }
  return headings;
}
