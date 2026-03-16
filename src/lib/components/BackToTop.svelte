<script lang="ts">
  import ChevronUpIcon from "./icons/ChevronUpIcon.svelte";

  let visible = $state(false);

  function onScroll() {
    visible = window.scrollY > 400;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

<svelte:window onscroll={onScroll} />

{#if visible}
  <button
    onclick={scrollToTop}
    class="back-to-top fixed bottom-6 right-6 z-30 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg text-gray-500 dark:text-gray-400 shadow-lg shadow-gray-900/[0.08] dark:shadow-black/20 border border-gray-200/60 dark:border-gray-700/40 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center cursor-pointer"
    aria-label="Back to top"
  >
    <ChevronUpIcon />
  </button>
{/if}
