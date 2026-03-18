import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = () => {
  return {
    slug: "install",
    title: "Installation",
    section: "Users",
    description:
      "Install PEN via Homebrew, Scoop, go install, or curl. Run pen init to set up your IDE.",
    headings: [
      { id: "quick-install", text: "Quick Install", depth: 2 },
      { id: "other-install-methods", text: "Other Install Methods", depth: 2 },
      { id: "homebrew", text: "Homebrew (macOS / Linux)", depth: 3 },
      { id: "scoop", text: "Scoop (Windows)", depth: 3 },
      { id: "go-install", text: "go install", depth: 3 },
      { id: "github-releases", text: "GitHub Releases", depth: 3 },
      { id: "from-source", text: "From Source", depth: 3 },
      { id: "verify", text: "Verify", depth: 2 },
      { id: "updating", text: "Updating", depth: 2 },
    ],
  };
};
