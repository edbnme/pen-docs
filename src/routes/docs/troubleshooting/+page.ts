export const load = () => ({
  slug: "troubleshooting",
  title: "Troubleshooting",
  section: "Users",
  description:
    "Fix common PEN issues: connection errors, rate limits, domain locks, and IDE setup.",
  headings: [
    { id: "connection-issues", text: "Connection Issues", depth: 2 },
    {
      id: "browser-not-running-or-wrong-port",
      text: "Browser not running or wrong port",
      depth: 3,
    },
    { id: "no-targets-found", text: "No targets found", depth: 3 },
    { id: "invalid-cdp-url", text: "Invalid CDP URL", depth: 3 },
    {
      id: "connection-drops-mid-operation",
      text: "Connection drops mid-operation",
      depth: 3,
    },
    { id: "ide-issues", text: "IDE Issues", depth: 2 },
    { id: "tool-specific-issues", text: "Tool-Specific Issues", depth: 2 },
    { id: "rate-limit-errors", text: "Rate limit errors", depth: 3 },
    { id: "domain-lock-conflicts", text: "Domain lock conflicts", depth: 3 },
    { id: "lighthouse-not-found", text: "Lighthouse not found", depth: 3 },
    { id: "lighthouse-timeout", text: "Lighthouse timeout", depth: 3 },
    {
      id: "large-heap-snapshot-warnings",
      text: "Large heap snapshot warnings",
      depth: 3,
    },
    { id: "trace-buffer-overflow", text: "Trace buffer overflow", depth: 3 },
    { id: "console-buffer-full", text: "Console buffer full", depth: 3 },
    { id: "trace-file-too-large", text: "Trace file too large", depth: 3 },
    {
      id: "page-and-navigation-issues",
      text: "Page and Navigation Issues",
      depth: 2,
    },
    { id: "security-issues", text: "Security Issues", depth: 2 },
  ],
});
