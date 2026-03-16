export const load = () => ({
  slug: "security",
  title: "Security",
  section: "Users",
  description:
    "PEN's security model: eval gating, expression blocklist, path validation, rate limiting.",
  headings: [
    { id: "overview", text: "Overview", depth: 2 },
    { id: "gate-1-eval-gating", text: "Gate 1: Eval Gating", depth: 2 },
    {
      id: "gate-2-expression-blocklist",
      text: "Gate 2: Expression Blocklist",
      depth: 2,
    },
    {
      id: "gate-3-path-traversal-prevention",
      text: "Gate 3: Path Traversal Prevention",
      depth: 2,
    },
    {
      id: "gate-4-cdp-localhost-restriction",
      text: "Gate 4: CDP Localhost Restriction",
      depth: 2,
    },
    {
      id: "gate-5-url-scheme-validation",
      text: "Gate 5: URL Scheme Validation",
      depth: 2,
    },
    { id: "gate-6-rate-limiting", text: "Gate 6: Rate Limiting", depth: 2 },
    {
      id: "gate-7-temp-file-isolation",
      text: "Gate 7: Temp File Isolation",
      depth: 2,
    },
    { id: "gate-8-http-transport", text: "Gate 8: HTTP Transport", depth: 2 },
    { id: "attack-scenarios", text: "Attack Scenarios", depth: 2 },
    { id: "security-checklist", text: "Security Checklist", depth: 2 },
    { id: "recommendations", text: "Recommendations", depth: 2 },
  ],
});
