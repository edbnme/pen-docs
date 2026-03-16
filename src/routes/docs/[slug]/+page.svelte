<script lang="ts">
  import { onMount } from "svelte";
  import { initMermaidDiagrams } from "$lib/mermaid";
  import { initCopyButtons } from "$lib/copy-code";
  import TableOfContents from "$lib/components/TableOfContents.svelte";
  import PageNav from "$lib/components/PageNav.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const jsonLd = $derived(
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: `${data.title} — PEN Docs`,
      description: data.description,
      url: `https://pen-docs.vercel.app/docs/${data.slug}`,
      isPartOf: {
        "@type": "WebSite",
        name: "PEN Docs",
        url: "https://pen-docs.vercel.app",
      },
      about: {
        "@type": "SoftwareApplication",
        name: "PEN",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Windows, macOS, Linux",
      },
    }),
  );

  const jsonLdTag = $derived(
    `<script type="application/ld+json">${jsonLd}${"<"}/script>`,
  );

  onMount(() => {
    initMermaidDiagrams();
    initCopyButtons();
  });
</script>

<svelte:head>
  <title>{data.title} — PEN Docs</title>
  <meta name="description" content={data.description} />
  <link rel="canonical" href="https://pen-docs.vercel.app/docs/{data.slug}" />

  <!-- Open Graph -->
  <meta property="og:title" content="{data.title} — PEN Docs" />
  <meta property="og:description" content={data.description} />
  <meta property="og:type" content="article" />
  <meta
    property="og:url"
    content="https://pen-docs.vercel.app/docs/{data.slug}"
  />
  <meta property="og:site_name" content="PEN Docs" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="{data.title} — PEN Docs" />
  <meta name="twitter:description" content={data.description} />

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- structured data is build-time JSON, not user input -->
  {@html jsonLdTag}
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
