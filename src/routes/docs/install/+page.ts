import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = () => {
  return {
    slug: "install",
    title: "Installation",
    section: "Users",
    description:
      "Install PEN via Homebrew, Scoop, go install, or curl. Set up your browser and IDE.",
    headings: [
      { id: "what-you-need", text: "What You Need", depth: 2 },
      {
        id: "quick-install-recommended",
        text: "Quick Install (Recommended)",
        depth: 2,
      },
      { id: "the-pen-init-wizard", text: "The pen init Wizard", depth: 3 },
      { id: "package-managers", text: "Package Managers", depth: 2 },
      {
        id: "homebrew-macos--linux",
        text: "Homebrew (macOS / Linux)",
        depth: 3,
      },
      { id: "scoop-windows", text: "Scoop (Windows)", depth: 3 },
      { id: "github-releases", text: "GitHub Releases", depth: 2 },
      { id: "go-install", text: "go install", depth: 2 },
      { id: "from-source", text: "From Source", depth: 2 },
      { id: "verify", text: "Verify", depth: 2 },
      { id: "start-your-browser", text: "Start Your Browser", depth: 2 },
      { id: "configure-your-ide", text: "Configure Your IDE", depth: 2 },
      {
        id: "vs-code--github-copilot",
        text: "VS Code + GitHub Copilot",
        depth: 3,
      },
      { id: "cursor", text: "Cursor", depth: 3 },
      { id: "claude-desktop", text: "Claude Desktop", depth: 3 },
      { id: "test-it", text: "Test It", depth: 2 },
    ],
  };
};
