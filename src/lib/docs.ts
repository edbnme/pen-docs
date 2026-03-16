export interface DocEntry {
  slug: string;
  title: string;
  section: string;
}

export const docs: DocEntry[] = [
  // Users
  { slug: "readme", title: "Introduction", section: "Users" },
  { slug: "install", title: "Installation", section: "Users" },
  { slug: "running", title: "Running PEN", section: "Users" },
  { slug: "tool-catalog", title: "Tool Reference", section: "Users" },
  { slug: "workflows", title: "Workflows", section: "Users" },
  { slug: "troubleshooting", title: "Troubleshooting", section: "Users" },
  { slug: "security", title: "Security", section: "Users" },

  // Contributors
  { slug: "architecture", title: "Architecture", section: "Contributors" },
  {
    slug: "cdp-integration",
    title: "CDP Integration",
    section: "Contributors",
  },
  { slug: "data-streaming", title: "Data Streaming", section: "Contributors" },
  {
    slug: "mcp-server-design",
    title: "MCP Server Design",
    section: "Contributors",
  },
  { slug: "tool-development", title: "Adding Tools", section: "Contributors" },
  { slug: "output-design", title: "Output Design", section: "Contributors" },
  { slug: "error-handling", title: "Error Handling", section: "Contributors" },
  { slug: "references", title: "References", section: "Contributors" },
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
