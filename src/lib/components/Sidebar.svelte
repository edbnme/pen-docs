<script lang="ts">
  import { resolveRoute } from "$app/paths";
  import { page } from "$app/state";
  import { getDocSections } from "$lib/docs";
  import GithubIcon from "./GithubIcon.svelte";
  import { onMount } from "svelte";

  let { onNavigate }: { onNavigate?: () => void } = $props();

  const sections = getDocSections();
  let filter = $state("");
  let filterInput: HTMLInputElement;

  let currentSlug = $derived(
    page.url.pathname === "/"
      ? "readme"
      : page.url.pathname.replace("/docs/", ""),
  );

  onMount(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const active = document.activeElement;
        if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA") return;
        e.preventDefault();
        filterInput?.focus();
      }
    }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  });
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
      placeholder="Filter pages… (press /)"
      autocomplete="off"
      spellcheck="false"
      bind:value={filter}
      bind:this={filterInput}
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

  <div class="px-3 pb-4 mt-auto border-t border-gray-100 pt-3">
    <a
      href="https://github.com/edbnme/pen"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-2 px-3 py-2 rounded-md text-[0.8125rem] text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition"
    >
      <GithubIcon />
      <span>Star on GitHub</span>
      <svg
        class="w-3.5 h-3.5 ml-auto opacity-40"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path
          d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"
        />
      </svg>
    </a>
  </div>
</div>
