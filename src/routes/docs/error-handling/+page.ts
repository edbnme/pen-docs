export const load = () => ({
  slug: "error-handling",
  title: "Error Handling",
  section: "Contributors",
  description:
    "How PEN handles failures across CDP, MCP, browser interactions, and edge cases.",
  headings: [
    { id: "cdp-connection-errors", text: "CDP Connection Errors", depth: 2 },
    {
      id: "network-resource-errors",
      text: "Network & Resource Errors",
      depth: 2,
    },
    { id: "mcp-protocol-errors", text: "MCP Protocol Errors", depth: 2 },
    { id: "concurrent-tool-calls", text: "Concurrent Tool Calls", depth: 2 },
    { id: "rate-limiting", text: "Rate Limiting", depth: 2 },
    { id: "input-validation", text: "Input Validation", depth: 2 },
    {
      id: "heap-profiling-edge-cases",
      text: "Heap Profiling Edge Cases",
      depth: 2,
    },
    { id: "lighthouse-edge-cases", text: "Lighthouse Edge Cases", depth: 2 },
    { id: "console-buffer", text: "Console Buffer", depth: 2 },
    {
      id: "trace-collection-edge-cases",
      text: "Trace Collection Edge Cases",
      depth: 2,
    },
    { id: "recovery-patterns", text: "Recovery Patterns", depth: 2 },
  ],
});
