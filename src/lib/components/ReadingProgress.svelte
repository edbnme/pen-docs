<script lang="ts">
  let progress = $state(0);

  function onScroll() {
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  }
</script>

<svelte:window onscroll={onScroll} />

<div
  class="reading-progress fixed top-0 left-0 right-0 z-50 h-px bg-transparent pointer-events-none"
>
  <div
    class="h-full bg-blue-500/60 dark:bg-blue-400/40 transition-[width] duration-150 ease-out"
    style="width: {progress}%"
  ></div>
</div>
