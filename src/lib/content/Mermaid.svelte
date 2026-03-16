<script lang="ts" module>
  let initPromise: Promise<typeof import("mermaid").default> | null = null;
  let initializedTheme: string | null = null;

  function getMermaid(
    isDark: boolean,
  ): Promise<typeof import("mermaid").default> {
    const theme = isDark ? "dark" : "light";
    if (initPromise && initializedTheme === theme) return initPromise;
    initializedTheme = theme;
    initPromise = (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
        flowchart: { curve: "basis", padding: 16 },
        sequence: { mirrorActors: false },
        themeVariables: isDark
          ? {
              primaryColor: "#1c1c1e",
              primaryTextColor: "#e5e5ea",
              primaryBorderColor: "#48484a",
              lineColor: "#636366",
              secondaryColor: "#2c2c2e",
              tertiaryColor: "#2c2c2e",
              mainBkg: "#1c1c1e",
              nodeBorder: "#48484a",
              clusterBkg: "#1c1c1e",
              titleColor: "#e5e5ea",
              edgeLabelBackground: "#2c2c2e",
            }
          : {
              primaryColor: "#f2f2f7",
              primaryTextColor: "#1c1c1e",
              primaryBorderColor: "#c7c7cc",
              lineColor: "#8e8e93",
              secondaryColor: "#ffffff",
              tertiaryColor: "#f2f2f7",
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
  let loaded = $state(false);

  onMount(async () => {
    try {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const mermaid = await getMermaid(isDark);
      const id = `mermaid-${crypto.randomUUID().slice(0, 8)}`;
      const { svg } = await mermaid.render(id, code);
      // eslint-disable-next-line svelte/no-dom-manipulating -- Required: mermaid.render() returns SVG string
      container.innerHTML = svg;
      loaded = true;
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to render diagram";
      loaded = true;
    }
  });
</script>

{#if error}
  <div
    class="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
  >
    <p class="font-medium">Diagram rendering failed</p>
    <pre class="mt-1 whitespace-pre-wrap text-xs">{error}</pre>
  </div>
{/if}
<div bind:this={container} class="mermaid-container">
  {#if !loaded}
    <span class="text-sm text-gray-400">Loading diagram…</span>
  {/if}
</div>
