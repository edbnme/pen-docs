export const load = () => ({
  slug: "mcp-server-design",
  title: "MCP Server Design",
  section: "Contributors",
  description:
    "How PEN implements the Model Context Protocol using the MCP Go SDK v1.3.1.",
  headings: [
    { id: "server-initialization", text: "Server Initialization", depth: 2 },
    { id: "tool-registration", text: "Tool Registration", depth: 2 },
    { id: "typed-generic-handlers", text: "Typed Generic Handlers", depth: 3 },
    { id: "handler-signature", text: "Handler Signature", depth: 3 },
    { id: "transports", text: "Transports", depth: 2 },
    { id: "error-handling", text: "Error Handling", depth: 2 },
    { id: "concurrency", text: "Concurrency", depth: 2 },
    { id: "capabilities", text: "Capabilities", depth: 2 },
    { id: "pen-init", text: "pen init — Interactive Setup", depth: 2 },
  ],
});
