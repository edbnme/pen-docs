<script lang="ts">
  import { resolveRoute } from "$app/paths";
  import { page } from "$app/state";
  import { getDocSections } from "$lib/docs";
  import GithubIcon from "./icons/GithubIcon.svelte";
  import StarIcon from "./icons/StarIcon.svelte";
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
        if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA")
          return;
        e.preventDefault();
        filterInput?.focus();
      }
    }
    document.addEventListener("keydown", onKeydown);

    // Scroll active nav item into view
    requestAnimationFrame(() => {
      const activeEl = document.querySelector("[data-active-nav]");
      activeEl?.scrollIntoView({ block: "center", behavior: "instant" });
    });

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
      <div
        class="text-base font-bold text-gray-900 dark:text-gray-100 tracking-tight"
      >
        PEN
      </div>
      <div class="text-[0.65rem] text-gray-400 dark:text-gray-500 mt-0.5">
        Performance Engineer Node
      </div>
    </a>
  </div>

  <div class="px-3 pb-2 space-y-2">
    <button
      onclick={() => {
        const e = new KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(e);
      }}
      class="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-400 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-500 dark:hover:text-gray-300 transition cursor-pointer"
    >
      <svg
        class="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span class="flex-1 text-left">Search…</span>
      <kbd
        class="hidden sm:inline-flex text-[0.6rem] font-mono px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-400"
      >
        Ctrl K
      </kbd>
    </button>

    <input
      type="text"
      placeholder="Filter pages… (press /)"
      autocomplete="off"
      spellcheck="false"
      bind:value={filter}
      bind:this={filterInput}
      class="w-full text-xs px-2.5 py-1.5 border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:border-indigo-300 dark:focus:border-indigo-600 focus:ring-1 focus:ring-indigo-200 dark:focus:ring-indigo-800 placeholder-gray-300 dark:placeholder-gray-600 bg-transparent text-gray-900 dark:text-gray-100 transition"
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
            class="pt-4 pb-1 px-2.5 text-[0.65rem] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest"
          >
            {section.name}
          </div>
          {#each filteredDocs as doc (doc.slug)}
            {@const isActive = currentSlug === doc.slug}
            <a
              href={resolveRoute("/docs/[slug]", { slug: doc.slug })}
              onclick={onNavigate}
              data-active-nav={isActive ? "" : undefined}
              class="block py-2 px-3 rounded-md text-[0.8125rem] transition-all border-l-2 min-h-[2.25rem] {isActive
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 border-indigo-500 font-medium'
                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'}"
            >
              {doc.title}
            </a>
          {/each}
        </div>
      {/if}
    {/each}
  </nav>

  <div
    class="px-3 pb-4 mt-auto border-t border-gray-100 dark:border-gray-800 pt-3"
  >
    <a
      href="https://github.com/edbnme/pen"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-2 px-3 py-2 rounded-md text-[0.8125rem] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
    >
      <GithubIcon />
      <span>Star on GitHub</span>
      <StarIcon class="w-3.5 h-3.5 ml-auto opacity-40" />
    </a>
  </div>
</div>
