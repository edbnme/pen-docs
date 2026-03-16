<script lang="ts">
  import TableOfContents from "$lib/components/TableOfContents.svelte";
  import PageNav from "$lib/components/PageNav.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.title} — PEN Docs</title>
  <meta name="description" content="PEN documentation — {data.title}" />
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
