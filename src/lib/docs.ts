export interface DocEntry {
  slug: string;
  title: string;
  section: string;
}

export const docs: DocEntry[] = [
  { slug: "readme", title: "README", section: "Getting Started" },
  { slug: "install", title: "Getting Started", section: "Getting Started" },
  { slug: "running", title: "Running PEN", section: "Getting Started" },
  {
    slug: "executive-summary",
    title: "Executive Summary",
    section: "Guide",
  },
  { slug: "tool-catalog", title: "Tool Catalog", section: "Guide" },
  { slug: "edge-cases", title: "Edge Cases", section: "Guide" },
  { slug: "security-model", title: "Security Model", section: "Guide" },
  {
    slug: "system-architecture",
    title: "System Architecture",
    section: "Architecture",
  },
  { slug: "cdp-integration", title: "CDP Integration", section: "Architecture" },
  { slug: "data-streaming", title: "Data Streaming", section: "Architecture" },
  {
    slug: "mcp-server-design",
    title: "MCP Server Design",
    section: "Architecture",
  },
  { slug: "source-tools", title: "Source Tools", section: "Architecture" },
  {
    slug: "ide-llm-integration",
    title: "IDE & LLM Integration",
    section: "Architecture",
  },
  { slug: "sources", title: "Sources", section: "Reference" },
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
