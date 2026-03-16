<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  import GithubIcon from "./GithubIcon.svelte";

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
      <svg
        class="w-5 h-5 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {#if open}
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        {:else}
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        {/if}
      </svg>
    </button>
    <span class="text-sm font-semibold text-gray-900">PEN Docs</span>
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

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 lg:hidden"
    onkeydown={(e) => e.key === "Escape" && close()}
  >
    <button
      class="absolute inset-0 bg-black/20"
      onclick={close}
      aria-label="Close navigation"
    ></button>
    <div
      class="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl overflow-y-auto"
    >
      <Sidebar onNavigate={close} />
    </div>
  </div>
{/if}
