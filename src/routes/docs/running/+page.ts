export const load = () => ({
  slug: "running",
  title: "Running PEN",
  section: "Users",
  description:
    "Run PEN with stdio, HTTP, or SSE transport. Flags, Docker, CI, and server deployment.",
  headings: [
    { id: "local-usage", text: "Local Usage", depth: 2 },
    { id: "flags", text: "Flags", depth: 2 },
    { id: "http-transport", text: "HTTP Transport", depth: 2 },
    { id: "browser-setup", text: "Browser Setup", depth: 2 },
    { id: "ide-config", text: "IDE Config", depth: 2 },
    { id: "building-from-source", text: "Building from Source", depth: 2 },
    { id: "production-build", text: "Production Build", depth: 3 },
    { id: "docker", text: "Docker", depth: 2 },
    { id: "server--ci", text: "Server / CI", depth: 2 },
    { id: "headless-chrome", text: "Headless Chrome", depth: 3 },
    { id: "ssh-tunnel", text: "SSH Tunnel", depth: 3 },
    { id: "security-notes", text: "Security Notes", depth: 3 },
    {
      id: "optional-lighthouse-cli",
      text: "Optional: Lighthouse CLI",
      depth: 2,
    },
  ],
});
