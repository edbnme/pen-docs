import type { Tokens } from "marked";
import { slugify } from "./slugify";
import { highlight } from "./highlight";

type Parser = { parseInline: (tokens: Tokens.Generic[]) => string };

const COPY_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

export function headingRenderer(
  this: { parser: Parser },
  token: Tokens.Heading,
): string {
  const raw = token.tokens.map((t) => t.raw).join("");
  const id = slugify(raw);
  return `<h${token.depth} id="${id}">${this.parser.parseInline(token.tokens)}</h${token.depth}>`;
}

export function linkRenderer(
  this: { parser: Parser },
  token: Tokens.Link,
): string {
  const text = token.tokens
    ? this.parser.parseInline(token.tokens)
    : token.text;
  const titleAttr = token.title ? ` title="${token.title}"` : "";

  if (token.href?.startsWith("/docs/")) {
    return `<a href="${token.href}"${titleAttr} data-sveltekit-preload-data="hover">${text}</a>`;
  }
  if (token.href?.startsWith("http://") || token.href?.startsWith("https://")) {
    return `<a href="${token.href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
  }
  return `<a href="${token.href}"${titleAttr}>${text}</a>`;
}

export function tableRenderer(
  this: { parser: Parser },
  token: Tokens.Table,
): string {
  let header = "<tr>";
  for (const cell of token.header) {
    header += `<th>${this.parser.parseInline(cell.tokens)}</th>`;
  }
  header += "</tr>";

  let body = "";
  for (const row of token.rows) {
    body += "<tr>";
    for (const cell of row) {
      body += `<td>${this.parser.parseInline(cell.tokens)}</td>`;
    }
    body += "</tr>";
  }

  return `<div class="table-wrapper"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
}

export function codeRenderer(token: Tokens.Code): string {
  if (token.lang === "mermaid") {
    return `<div class="mermaid">${token.text}</div>`;
  }

  const lang = token.lang || "";
  const langClass = lang ? `hljs language-${lang}` : "hljs";
  const langLabel = lang ? `<span class="code-lang">${lang}</span>` : "";
  const copyBtn = `<button class="copy-btn" aria-label="Copy code">${COPY_ICON}</button>`;

  return `<div class="code-block">${langLabel}${copyBtn}<pre><code class="${langClass}">${highlight(token.text, lang)}</code></pre></div>`;
}
