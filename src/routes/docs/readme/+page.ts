import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = () => {
  return {
    slug: "readme",
    title: "Introduction",
    section: "Users",
    description:
      "MCP server connecting AI assistants to Chrome DevTools for browser performance profiling.",
    headings: [
      { id: "how-it-works", text: "How It Works", depth: 2 },
      { id: "what-you-can-do", text: "What You Can Do", depth: 2 },
      { id: "quick-start", text: "Quick Start", depth: 2 },
      { id: "example", text: "Example", depth: 2 },
      { id: "key-design-decisions", text: "Key Design Decisions", depth: 2 },
      {
        id: "vs-chrome-devtools-mcp",
        text: "vs chrome-devtools-mcp",
        depth: 2,
      },
      { id: "docs", text: "Docs", depth: 2 },
    ],
  };
};
