/** Initialize mermaid diagrams within the current page, if any exist. */
export async function initMermaidDiagrams(): Promise<void> {
  const els = document.querySelectorAll(".mermaid");
  if (els.length === 0) return;

  const mermaid = (await import("mermaid")).default;
  mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
    fontFamily: "Inter, system-ui, sans-serif",
    flowchart: { curve: "basis", padding: 16 },
    themeVariables: {
      primaryColor: "#e0e7ff",
      primaryTextColor: "#312e81",
      primaryBorderColor: "#818cf8",
      lineColor: "#6366f1",
      secondaryColor: "#f0fdf4",
      tertiaryColor: "#fef3c7",
    },
  });
  await mermaid.run({ nodes: Array.from(els) as HTMLElement[] });
}
