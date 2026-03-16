export interface DocEntry {
  slug: string;
  title: string;
  section: string;
  description: string;
}

export const docs: DocEntry[] = [
  // Users
  { slug: "readme", title: "Introduction", section: "Users", description: "MCP server connecting AI assistants to Chrome DevTools for browser performance profiling." },
  { slug: "install", title: "Installation", section: "Users", description: "Install PEN via Homebrew, Scoop, go install, or curl. Set up your browser and IDE." },
  { slug: "running", title: "Running PEN", section: "Users", description: "Run PEN with stdio, HTTP, or SSE transport. Flags, Docker, CI, and server deployment." },
  { slug: "tool-catalog", title: "Tool Reference", section: "Users", description: "Complete reference for all 30 PEN tools — parameters, CDP domains, and output formats." },
  { slug: "workflows", title: "Workflows", section: "Users", description: "Proven tool chains for memory leaks, page load optimization, bundle audits, and more." },
  { slug: "troubleshooting", title: "Troubleshooting", section: "Users", description: "Fix common PEN issues: connection errors, rate limits, domain locks, and IDE setup." },
  { slug: "security", title: "Security", section: "Users", description: "PEN's security model: eval gating, expression blocklist, path validation, rate limiting." },

  // Contributors
  { slug: "architecture", title: "Architecture", section: "Contributors", description: "PEN system architecture, package map, dependencies, data flow, and concurrency model." },
  { slug: "cdp-integration", title: "CDP Integration", section: "Contributors", description: "How PEN uses chromedp to communicate with Chrome via CDP WebSocket connections." },
  { slug: "data-streaming", title: "Data Streaming", section: "Contributors", description: "Streaming large CDP payloads (heap snapshots, traces) to disk with constant memory." },
  { slug: "mcp-server-design", title: "MCP Server Design", section: "Contributors", description: "MCP Go SDK integration, typed tool handlers, transports, and concurrency patterns." },
  { slug: "tool-development", title: "Adding Tools", section: "Contributors", description: "Step-by-step guide to adding new tools to PEN with real code examples." },
  { slug: "output-design", title: "Output Design", section: "Contributors", description: "How PEN formats tool output for LLM consumption: token budgets, tables, and sections." },
  { slug: "error-handling", title: "Error Handling", section: "Contributors", description: "Error handling across CDP, MCP, and browser interactions. Edge cases and recovery." },
  { slug: "references", title: "References", section: "Contributors", description: "CDP spec references, Go library versions, prior art, and project links." },
];

export const docOrder = docs.map((d) => d.slug);

export function getDocBySlug(slug: string): DocEntry | undefined {
  return docs.find((d) => d.slug === slug);
}

export function getAdjacentDocs(slug: string) {
  const idx = docOrder.indexOf(slug);
  return {
    prev: idx > 0 ? docs[idx - 1] : null,
    next: idx < docs.length - 1 ? docs[idx + 1] : null,
  };
}

export function getDocSections() {
  const sections: { name: string; docs: DocEntry[] }[] = [];
  let current: { name: string; docs: DocEntry[] } | null = null;

  for (const doc of docs) {
    if (!current || current.name !== doc.section) {
      current = { name: doc.section, docs: [] };
      sections.push(current);
    }
    current.docs.push(doc);
  }

  return sections;
}
