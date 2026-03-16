<script lang="ts">
  import { resolveRoute } from "$app/paths";
  import { page } from "$app/state";
  import { getDocSections } from "$lib/docs";
  import GithubIcon from "./icons/GithubIcon.svelte";
  import StarIcon from "./icons/StarIcon.svelte";
  import { onMount } from "svelte";

  let { onNavigate }: { onNavigate?: () => void } = $props();

  const sections = getDocSections();

  let currentSlug = $derived(
    page.url.pathname === "/"
      ? "readme"
      : page.url.pathname.replace("/docs/", ""),
  );

  onMount(() => {
    requestAnimationFrame(() => {
      const activeEl = document.querySelector("[data-active-nav]");
      activeEl?.scrollIntoView({ block: "center", behavior: "instant" });
    });
  });
</script>

<div class="flex h-full flex-col">
  <div class="p-5 pb-3">
    <a
      href={resolveRoute("/docs/[slug]", { slug: "readme" })}
      onclick={onNavigate}
      class="block group"
    >
      <div
        class="text-[1.0625rem] font-bold text-gray-900 dark:text-gray-50 tracking-tight"
      >
        PEN
      </div>
      <div class="text-[0.6875rem] text-gray-400 dark:text-gray-500 mt-0.5">
        Performance Engineer Node
      </div>
    </a>
  </div>

  <div class="px-3 pb-3">
    <button
      onclick={() => {
        const e = new KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(e);
      }}
      class="w-full flex items-center gap-2 px-3 py-2 text-[0.8125rem] text-gray-400 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-gray-800/60 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-500 dark:hover:text-gray-300 transition-all duration-200 cursor-pointer shadow-sm shadow-gray-900/[0.03] dark:shadow-none"
    >
      <svg
        class="w-3.5 h-3.5 opacity-60"
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
        class="hidden sm:inline-flex text-[0.625rem] font-mono px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-400"
      >
        ⌘K
      </kbd>
    </button>
  </div>

  <nav class="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
    {#each sections as section (section.name)}
      <div>
        <div
          class="pt-5 pb-1.5 px-3 text-[0.6875rem] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest"
        >
          {section.name}
        </div>
        {#each section.docs as doc (doc.slug)}
          {@const isActive = currentSlug === doc.slug}
          <a
            href={resolveRoute("/docs/[slug]", { slug: doc.slug })}
            onclick={onNavigate}
            data-active-nav={isActive ? "" : undefined}
            class="block py-2 px-3 rounded-lg text-[0.8125rem] transition-all duration-200 {isActive
              ? 'text-gray-900 dark:text-gray-50 bg-gray-200/60 dark:bg-white/[0.08] font-medium'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.04]'}"
          >
            {doc.title}
          </a>
        {/each}
      </div>
    {/each}
  </nav>

  <div
    class="px-3 pb-4 mt-auto border-t border-gray-100 dark:border-gray-800/60 pt-3"
  >
    <a
      href="https://github.com/edbnme/pen"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.8125rem] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-200"
    >
      <GithubIcon />
      <span>Star on GitHub</span>
      <StarIcon class="w-3.5 h-3.5 ml-auto opacity-30" />
    </a>
  </div>
</div>
