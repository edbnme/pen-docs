<script lang="ts">
  import { resolveRoute } from "$app/paths";
  import { getAdjacentDocs } from "$lib/docs";

  let { slug }: { slug: string } = $props();
  let adjacent = $derived(getAdjacentDocs(slug));
</script>

{#if adjacent.prev || adjacent.next}
  <nav
    class="flex justify-between items-center mt-12 pt-6 border-t border-gray-200"
  >
    {#if adjacent.prev}
      <a
        href={resolveRoute("/docs/[slug]", { slug: adjacent.prev.slug })}
        class="group flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition"
      >
        <span class="text-gray-300 group-hover:text-indigo-400 transition"
          >←</span
        >
        <span>{adjacent.prev.title}</span>
      </a>
    {:else}
      <div></div>
    {/if}

    {#if adjacent.next}
      <a
        href={resolveRoute("/docs/[slug]", { slug: adjacent.next.slug })}
        class="group flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition"
      >
        <span>{adjacent.next.title}</span>
        <span class="text-gray-300 group-hover:text-indigo-400 transition"
          >→</span
        >
      </a>
    {:else}
      <div></div>
    {/if}
  </nav>
{/if}
