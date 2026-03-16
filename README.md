# PEN Docs

Documentation site for [PEN](https://github.com/edbnme/pen), the MCP server that connects AI assistants to Chrome DevTools for performance profiling and analysis.

## Related Repos

| Repo                                                          | What it is                                                      |
| ------------------------------------------------------------- | --------------------------------------------------------------- |
| [edbnme/pen](https://github.com/edbnme/pen)                   | Main PEN binary — Go source, CLI, MCP server, all tool handlers |
| [edbnme/pen-docs](https://github.com/edbnme/pen-docs)         | This repo — the documentation site                              |
| [edbnme/homebrew-tap](https://github.com/edbnme/homebrew-tap) | Homebrew tap for `brew install edbnme/tap/pen` (macOS / Linux)  |
| [edbnme/scoop-pen](https://github.com/edbnme/scoop-pen)       | Scoop bucket for `scoop install pen` (Windows)                  |

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) (static adapter)
- [Svelte 5](https://svelte.dev/) (runes)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [marked](https://github.com/markedjs/marked) + highlight.js for markdown rendering
- Markdown content in `src/content/`

## Development

```bash
npm install
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Static HTML goes to `build/`. Deploy anywhere — Vercel, Cloudflare Pages, Netlify, or just serve the folder.

## Content

All documentation is split into two sections:

- **Users** (7 pages): Getting started, installation, tool catalog, workflows, troubleshooting, security
- **Contributors** (8 pages): Architecture, CDP integration, data streaming, MCP server design, tool development, output design, error handling, references

To add or edit a page:

1. Create or edit a `.md` file in `src/content/`
2. Add the entry to the docs registry in `src/lib/docs.ts`
3. The page appears in the sidebar automatically

## Project Structure

```
src/
  routes/               SvelteKit routes
    docs/[slug]/        Dynamic doc page (SSG)
  lib/
    components/         Svelte components (Sidebar, TOC, PageNav, etc.)
    docs.ts             Document registry
    markdown.ts         Markdown → HTML pipeline
  content/              Markdown documentation files (15 pages)
```
