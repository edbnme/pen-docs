<script lang="ts">
  import { goto } from "$app/navigation";
  import { docs, type DocEntry } from "$lib/docs";

  let open = $state(false);
  let query = $state("");
  let selectedIndex = $state(0);
  let inputEl = $state<HTMLInputElement | null>(null);
  let previousFocus: HTMLElement | null = null;

  const results = $derived.by(() => {
    if (!query.trim()) return docs;
    const q = query.toLowerCase();
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.slug.includes(q),
    );
  });

  function show() {
    previousFocus = document.activeElement as HTMLElement | null;
    open = true;
    query = "";
    selectedIndex = 0;
    requestAnimationFrame(() => inputEl?.focus());
  }

  function hide() {
    open = false;
    previousFocus?.focus();
    previousFocus = null;
  }

  function navigate(doc: DocEntry) {
    hide();
    goto(`/docs/${doc.slug}`);
  }

  function onKeydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      navigate(results[selectedIndex]);
    } else if (e.key === "Escape") {
      hide();
    } else if (e.key === "Tab") {
      // Focus trap — keep Tab within the dialog
      e.preventDefault();
      inputEl?.focus();
    }
  }

  function onGlobalKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (open) {
        hide();
      } else {
        show();
      }
    }
  }
</script>

<svelte:window onkeydown={onGlobalKeydown} />

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
    onkeydown={onKeydown}
  >
    <button
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onclick={hide}
      aria-label="Close search"
    ></button>

    <div
      class="relative w-full max-w-xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-gray-900/10 dark:shadow-black/30 border border-gray-200/80 dark:border-gray-700/60 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
    >
      <div
        class="flex items-center gap-3 px-4 border-b border-gray-100 dark:border-gray-800"
      >
        <svg
          class="w-4 h-4 text-gray-400 shrink-0"
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
        <input
          bind:this={inputEl}
          bind:value={query}
          type="text"
          placeholder="Search documentation..."
          class="flex-1 py-3 text-sm bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          autocomplete="off"
          spellcheck="false"
        />
        <kbd
          class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[0.65rem] font-mono text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
        >
          ESC
        </kbd>
      </div>

      <div class="max-h-72 overflow-y-auto py-2">
        {#if results.length === 0}
          <div class="px-4 py-8 text-center text-sm text-gray-400">
            No results for "{query}"
          </div>
        {:else}
          {#each results as doc, i (doc.slug)}
            <button
              class="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-150 {i ===
              selectedIndex
                ? 'bg-gray-100 dark:bg-white/[0.06] text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.03]'}"
              onclick={() => navigate(doc)}
              onmouseenter={() => (selectedIndex = i)}
            >
              <div class="min-w-0 flex-1">
                <div
                  class="text-sm font-medium {i === selectedIndex
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-900 dark:text-gray-100'}"
                >
                  {doc.title}
                </div>
                <div
                  class="text-xs mt-0.5 truncate {i === selectedIndex
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-gray-400 dark:text-gray-500'}"
                >
                  {doc.description}
                </div>
              </div>
              <span
                class="text-[0.6rem] uppercase tracking-wider px-1.5 py-0.5 rounded {i ===
                selectedIndex
                  ? 'text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800'
                  : 'text-gray-300 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'}"
              >
                {doc.section}
              </span>
            </button>
          {/each}
        {/if}
      </div>

      <div
        class="flex items-center gap-4 px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-[0.65rem] text-gray-400"
      >
        <span class="flex items-center gap-1">
          <kbd
            class="px-1 py-0.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
            >↑↓</kbd
          >
          navigate
        </span>
        <span class="flex items-center gap-1">
          <kbd
            class="px-1 py-0.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
            >↵</kbd
          >
          open
        </span>
        <span class="flex items-center gap-1">
          <kbd
            class="px-1 py-0.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
            >esc</kbd
          >
          close
        </span>
      </div>
    </div>
  </div>
{/if}
