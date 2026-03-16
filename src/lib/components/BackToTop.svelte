<script lang="ts">
  import { onMount } from "svelte";

  let visible = $state(false);

  onMount(() => {
    function onScroll() {
      visible = window.scrollY > 400;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

{#if visible}
  <button
    onclick={scrollToTop}
    class="back-to-top fixed bottom-6 right-6 z-30 w-10 h-10 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition flex items-center justify-center"
    aria-label="Back to top"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 15l7-7 7 7"
      />
    </svg>
  </button>
{/if}
