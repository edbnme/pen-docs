<script lang="ts">
  import { resolveRoute } from "$app/paths";
  import { goto } from "$app/navigation";
  import { getAdjacentDocs } from "$lib/docs";
  import { onMount } from "svelte";

  let { slug }: { slug: string } = $props();
  let adjacent = $derived(getAdjacentDocs(slug));

  onMount(() => {
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
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  });
</script>

{#if adjacent.prev || adjacent.next}
  <nav
    class="grid grid-cols-2 gap-4 mt-12 pt-6 border-t border-gray-200 dark:border-gray-800"
    aria-label="Page navigation"
  >
    {#if adjacent.prev}
      <a
        href={resolveRoute("/docs/[slug]", { slug: adjacent.prev.slug })}
        class="group flex flex-col gap-1 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 transition-all"
      >
        <span
          class="text-[0.65rem] uppercase tracking-wider text-gray-400 group-hover:text-indigo-400"
          >← Previous</span
        >
        <span
          class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
          >{adjacent.prev.title}</span
        >
      </a>
    {:else}
      <div></div>
    {/if}

    {#if adjacent.next}
      <a
        href={resolveRoute("/docs/[slug]", { slug: adjacent.next.slug })}
        class="group flex flex-col items-end gap-1 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 transition-all"
      >
        <span
          class="text-[0.65rem] uppercase tracking-wider text-gray-400 group-hover:text-indigo-400"
          >Next →</span
        >
        <span
          class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
          >{adjacent.next.title}</span
        >
      </a>
    {:else}
      <div></div>
    {/if}
  </nav>
{/if}
