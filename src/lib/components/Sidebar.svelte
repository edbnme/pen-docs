<script lang="ts">
  import { resolveRoute } from "$app/paths";
  import { page } from "$app/state";
  import { getDocSections } from "$lib/docs";

  let { onNavigate }: { onNavigate?: () => void } = $props();

  const sections = getDocSections();
  let filter = $state("");

  let currentSlug = $derived(
    page.url.pathname === "/"
      ? "readme"
      : page.url.pathname.replace("/docs/", ""),
  );
</script>

<div class="flex h-full flex-col">
  <div class="p-4 pb-2">
    <a
      href={resolveRoute("/docs/[slug]", { slug: "readme" })}
      onclick={onNavigate}
      class="block"
    >
      <div class="text-base font-bold text-gray-900 tracking-tight">PEN</div>
      <div class="text-[0.65rem] text-gray-400 mt-0.5">
        Performance Engineer Node
      </div>
    </a>
  </div>

  <div class="px-3 pb-2">
    <input
      type="text"
      placeholder="Filter pages…"
      autocomplete="off"
      spellcheck="false"
      bind:value={filter}
      class="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 placeholder-gray-300 transition"
      aria-label="Filter documentation pages"
    />
  </div>

  <nav class="flex-1 px-2 pb-4 space-y-0.5 overflow-y-auto">
    {#each sections as section (section.name)}
      {@const filteredDocs = section.docs.filter(
        (doc) =>
          !filter || doc.title.toLowerCase().includes(filter.toLowerCase()),
      )}
      {#if filteredDocs.length > 0}
        <div>
          <div
            class="pt-4 pb-1 px-2.5 text-[0.65rem] font-semibold text-gray-400 uppercase tracking-widest"
          >
            {section.name}
          </div>
          {#each filteredDocs as doc (doc.slug)}
            {@const isActive = currentSlug === doc.slug}
            <a
              href={resolveRoute("/docs/[slug]", { slug: doc.slug })}
              onclick={onNavigate}
              class="block py-2 px-3 rounded-md text-[0.8125rem] transition-all border-l-2 min-h-[2.25rem] {isActive
                ? 'text-indigo-600 bg-indigo-50 border-indigo-500 font-medium'
                : 'text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50'}"
            >
              {doc.title}
            </a>
          {/each}
        </div>
      {/if}
    {/each}
  </nav>
</div>
