<script lang="ts" module>
  let initPromise: Promise<typeof import("mermaid").default> | null = null;

  function getMermaid(): Promise<typeof import("mermaid").default> {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "neutral",
        fontFamily: "Inter, system-ui, sans-serif",
        flowchart: { curve: "basis", padding: 16 },
        sequence: { mirrorActors: false },
        themeVariables: isDark
          ? {
              primaryColor: "#312e81",
              primaryTextColor: "#e0e7ff",
              primaryBorderColor: "#6366f1",
              lineColor: "#818cf8",
              secondaryColor: "#064e3b",
              tertiaryColor: "#78350f",
              mainBkg: "#1e1b4b",
              nodeBorder: "#6366f1",
              clusterBkg: "#1e1b4b",
              titleColor: "#e0e7ff",
              edgeLabelBackground: "#1f2937",
            }
          : {
              primaryColor: "#e0e7ff",
              primaryTextColor: "#312e81",
              primaryBorderColor: "#818cf8",
              lineColor: "#6366f1",
              secondaryColor: "#f0fdf4",
              tertiaryColor: "#fef3c7",
            },
      });
      return mermaid;
    })();
    return initPromise;
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  let { code }: { code: string } = $props();
  let container: HTMLDivElement;
  let error = $state("");

  onMount(async () => {
    try {
      const mermaid = await getMermaid();
      const id = `mermaid-${crypto.randomUUID().slice(0, 8)}`;
      const { svg } = await mermaid.render(id, code);
      // eslint-disable-next-line svelte/no-dom-manipulating -- Required: mermaid.render() returns SVG string
      container.innerHTML = svg;
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to render diagram";
    }
  });
</script>

{#if error}
  <div class="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
    <p class="font-medium">Diagram rendering failed</p>
    <pre class="mt-1 whitespace-pre-wrap text-xs">{error}</pre>
  </div>
{/if}
<div bind:this={container} class="mermaid-container"></div>
