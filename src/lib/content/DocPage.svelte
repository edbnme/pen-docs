<script lang="ts">
  import TableOfContents from "$lib/components/TableOfContents.svelte";
  import PageNav from "$lib/components/PageNav.svelte";
  import CopyPageButton from "$lib/components/CopyPageButton.svelte";
  import type { Snippet } from "svelte";

  let {
    title,
    description,
    slug,
    headings,
    children,
  }: {
    title: string;
    description: string;
    slug: string;
    headings: { id: string; text: string; depth: number }[];
    children: Snippet;
  } = $props();

  const jsonLd = $derived(
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: `${title} — PEN Docs`,
      description,
      url: `https://pen-docs.vercel.app/docs/${slug}`,
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
</script>

<svelte:head>
  <title>{title} — PEN Docs</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="https://pen-docs.vercel.app/docs/{slug}" />
  <meta property="og:title" content="{title} — PEN Docs" />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://pen-docs.vercel.app/docs/{slug}" />
  <meta property="og:site_name" content="PEN Docs" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="{title} — PEN Docs" />
  <meta name="twitter:description" content={description} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- Safe: JSON-LD structured data from derived state -->
  {@html jsonLdTag}
</svelte:head>

<div
  class="flex gap-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-10 lg:py-16 fade-in"
>
  <article class="prose min-w-0 flex-1 max-w-[52rem]">
    <div class="flex items-start justify-between gap-4 mb-2">
      <div class="flex-1 min-w-0"></div>
      <CopyPageButton {title} {description} />
    </div>
    {@render children()}
    <PageNav {slug} />
  </article>

  <TableOfContents {headings} />
</div>
