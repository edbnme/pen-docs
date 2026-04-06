export const load = () => ({
  slug: "comparison",
  title: "Comparison",
  section: "Users",
  description:
    "How PEN compares to Playwright MCP, BrowserTools MCP, Lighthouse CLI, and other browser tools.",
  headings: [
    { id: "overview", text: "Overview", depth: 2 },
    { id: "feature-matrix", text: "Feature Matrix", depth: 2 },
    {
      id: "performance-profiling",
      text: "Performance Profiling",
      depth: 3,
    },
    { id: "network-coverage", text: "Network & Coverage", depth: 3 },
    {
      id: "browser-interaction",
      text: "Browser Interaction",
      depth: 3,
    },
    { id: "auditing", text: "Auditing & Analysis", depth: 3 },
    { id: "console-debugging", text: "Console & Debugging", depth: 3 },
    {
      id: "architecture-dx",
      text: "Architecture & DX",
      depth: 3,
    },
    { id: "differentiators", text: "PEN's Differentiators", depth: 2 },
    { id: "when-to-use-what", text: "When to Use What", depth: 2 },
  ],
});
