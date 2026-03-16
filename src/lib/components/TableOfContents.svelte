<script lang="ts">
  import { onMount } from "svelte";

  let {
    headings,
  }: { headings: { id: string; text: string; depth: number }[] } = $props();
  let activeId = $state("");

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  });
</script>

{#if headings.length > 0}
  <nav class="toc hidden xl:block w-56 shrink-0">
    <div class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div
        class="text-[0.6875rem] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3"
      >
        On this page
      </div>
      <ul
        class="space-y-0.5 border-l border-gray-200/80 dark:border-gray-800/60"
      >
        {#each headings as heading (heading.id)}
          <li
            style="padding-left: {(heading.depth - 2) * 0.75 + 0.75}rem"
            class="-ml-px border-l-2 transition-colors duration-200 {activeId ===
            heading.id
              ? 'border-gray-900 dark:border-gray-100'
              : 'border-transparent'}"
          >
            <a
              href={`#${heading.id}`}
              class="block text-[0.75rem] py-1 transition-colors duration-200 {activeId ===
              heading.id
                ? 'text-gray-900 dark:text-gray-100 font-medium'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}"
            >
              {heading.text}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </nav>
{/if}
