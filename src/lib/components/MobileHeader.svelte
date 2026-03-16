<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  import GithubIcon from "./icons/GithubIcon.svelte";
  import MenuIcon from "./icons/MenuIcon.svelte";
  import CloseIcon from "./icons/CloseIcon.svelte";

  let open = $state(false);

  function close() {
    open = false;
  }
</script>

<div
  class="mobile-header lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200"
>
  <div class="flex items-center justify-between px-4 h-12">
    <button
      onclick={() => (open = !open)}
      class="p-1.5 -ml-1.5 rounded-md hover:bg-gray-100 transition"
      aria-label="Toggle navigation"
    >
      {#if open}
        <CloseIcon class="w-5 h-5 text-gray-600" />
      {:else}
        <MenuIcon class="w-5 h-5 text-gray-600" />
      {/if}
    </button>
    <span class="text-sm font-semibold text-gray-900">PEN Docs</span>
    <div class="flex items-center gap-1">
      <button
        onclick={() => {
          const e = new KeyboardEvent("keydown", {
            key: "k",
            ctrlKey: true,
            bubbles: true,
          });
          document.dispatchEvent(e);
        }}
        class="p-1.5 rounded-md hover:bg-gray-100 transition"
        aria-label="Search documentation"
      >
        <svg
          class="w-5 h-5 text-gray-500"
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
      </button>
      <a
        href="https://github.com/edbnme/pen"
        target="_blank"
        rel="noopener noreferrer"
        class="p-1.5 -mr-1.5 rounded-md hover:bg-gray-100 transition"
        aria-label="GitHub repository"
      >
        <GithubIcon class="w-5 h-5 text-gray-500" />
      </a>
    </div>
  </div>
</div>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 lg:hidden"
    onkeydown={(e) => e.key === "Escape" && close()}
  >
    <button
      class="absolute inset-0 bg-black/30 backdrop-blur-sm"
      onclick={close}
      aria-label="Close navigation"
    ></button>
    <div
      class="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto animate-slide-in-left"
    >
      <Sidebar onNavigate={close} />
    </div>
  </div>
{/if}
