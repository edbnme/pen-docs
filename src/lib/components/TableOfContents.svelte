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
    <div class="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div
        class="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-widest mb-2"
      >
        On this page
      </div>
      <ul class="space-y-0.5 border-l border-gray-100">
        {#each headings as heading (heading.id)}
          <li
            style="padding-left: {(heading.depth - 2) * 0.75 + 0.75}rem"
            class="-ml-px border-l-2 transition-colors {activeId === heading.id
              ? 'border-indigo-500'
              : 'border-transparent'}"
          >
            <a
              href={`#${heading.id}`}
              class="block text-[0.75rem] py-1 transition-colors {activeId ===
              heading.id
                ? 'text-indigo-600 font-medium'
                : 'text-gray-400 hover:text-gray-600'}"
            >
              {heading.text}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </nav>
{/if}
