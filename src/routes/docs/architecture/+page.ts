export const load = () => ({
  slug: "architecture",
  title: "Architecture",
  section: "Contributors",
  description:
    "PEN system architecture, package map, dependencies, data flow, and concurrency model.",
  headings: [
    { id: "component-overview", text: "Component Overview", depth: 2 },
    { id: "package-map", text: "Package Map", depth: 2 },
    { id: "dependencies", text: "Dependencies", depth: 2 },
    { id: "entry-point-flow", text: "Entry Point Flow", depth: 2 },
    { id: "data-flow", text: "Data Flow", depth: 2 },
    { id: "key-type-signatures", text: "Key Type Signatures", depth: 2 },
    { id: "concurrency-model", text: "Concurrency Model", depth: 2 },
    {
      id: "domain-exclusive-locking",
      text: "Domain-Exclusive Locking",
      depth: 3,
    },
    { id: "rate-limiting", text: "Rate Limiting", depth: 3 },
    { id: "context-propagation", text: "Context Propagation", depth: 3 },
    { id: "build", text: "Build", depth: 2 },
    { id: "constants-and-limits", text: "Constants and Limits", depth: 2 },
  ],
});
