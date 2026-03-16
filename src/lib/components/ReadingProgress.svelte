<script lang="ts">
  import { onMount } from "svelte";

  let progress = $state(0);

  onMount(() => {
    function onScroll() {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });
</script>

<div
  class="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none"
>
  <div
    class="h-full bg-indigo-500 transition-[width] duration-150 ease-out"
    style="width: {progress}%"
  ></div>
</div>
