<script lang="ts">
  import { resolveRoute } from "$app/paths";
  import { goto } from "$app/navigation";
  import { getAdjacentDocs } from "$lib/docs";

  let { slug }: { slug: string } = $props();
  let adjacent = $derived(getAdjacentDocs(slug));

  function onKeydown(e: KeyboardEvent) {
    if (e.altKey && e.key === "ArrowLeft" && adjacent.prev) {
      e.preventDefault();
      goto(`/docs/${adjacent.prev.slug}`);
    }
    if (e.altKey && e.key === "ArrowRight" && adjacent.next) {
      e.preventDefault();
      goto(`/docs/${adjacent.next.slug}`);
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

{#if adjacent.prev || adjacent.next}
  <nav
    class="grid grid-cols-2 gap-4 mt-16 pt-8 border-t border-gray-200 dark:border-gray-800"
    aria-label="Page navigation"
  >
    {#if adjacent.prev}
      <a
        href={resolveRoute("/docs/[slug]", { slug: adjacent.prev.slug })}
        class="group flex flex-col gap-1.5 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm hover:shadow-gray-900/[0.04] dark:hover:shadow-none transition-all duration-200"
      >
        <span
          class="text-[0.6875rem] uppercase tracking-wider text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
          >← Previous</span
        >
        <span
          class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100"
          >{adjacent.prev.title}</span
        >
      </a>
    {:else}
      <div></div>
    {/if}

    {#if adjacent.next}
      <a
        href={resolveRoute("/docs/[slug]", { slug: adjacent.next.slug })}
        class="group flex flex-col items-end gap-1.5 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm hover:shadow-gray-900/[0.04] dark:hover:shadow-none transition-all duration-200"
      >
        <span
          class="text-[0.6875rem] uppercase tracking-wider text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
          >Next →</span
        >
        <span
          class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100"
          >{adjacent.next.title}</span
        >
      </a>
    {:else}
      <div></div>
    {/if}
  </nav>
{/if}
