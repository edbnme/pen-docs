import hljs from "highlight.js";

/** Highlight code with highlight.js — uses explicit language if available, falls back to auto-detect. */
export function highlight(code: string, lang: string): string {
  if (lang && hljs.getLanguage(lang)) {
    return hljs.highlight(code, { language: lang }).value;
  }
  return hljs.highlightAuto(code).value;
}
