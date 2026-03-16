<script lang="ts">
  import { onMount } from "svelte";
  import TableOfContents from "$lib/components/TableOfContents.svelte";
  import PageNav from "$lib/components/PageNav.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  onMount(async () => {
    // Mermaid diagrams
    const els = document.querySelectorAll(".mermaid");
    if (els.length > 0) {
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

    // Copy buttons for code blocks
    for (const btn of document.querySelectorAll<HTMLButtonElement>(".copy-btn")) {
      btn.addEventListener("click", () => {
        const code = btn.closest(".code-block")?.querySelector("code");
        if (!code) return;
        navigator.clipboard.writeText(code.textContent ?? "").then(() => {
          btn.classList.add("copied");
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
          setTimeout(() => {
            btn.classList.remove("copied");
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
          }, 2000);
        });
      });
    }
  });
</script>

<svelte:head>
  <title>{data.title} — PEN Docs</title>
  <meta name="description" content={data.description} />
  <meta property="og:title" content="{data.title} — PEN Docs" />
  <meta property="og:description" content={data.description} />
  <meta property="og:type" content="article" />
  <link rel="canonical" href="https://pen-docs.vercel.app/docs/{data.slug}" />
</svelte:head>

<div
  class="flex gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 fade-in"
>
  <article class="prose min-w-0 flex-1 max-w-3xl">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- content is build-time rendered markdown, not user input -->
    {@html data.html}
    <PageNav slug={data.slug} />
  </article>

  <TableOfContents headings={data.headings} />
</div>
