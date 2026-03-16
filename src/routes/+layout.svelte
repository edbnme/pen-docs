<script lang="ts">
  import "../app.css";
  // highlight.js themes are imported via app.css with media queries
  import { onNavigate } from "$app/navigation";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import MobileHeader from "$lib/components/MobileHeader.svelte";
  import BackToTop from "$lib/components/BackToTop.svelte";
  import CommandPalette from "$lib/components/CommandPalette.svelte";
  import ReadingProgress from "$lib/components/ReadingProgress.svelte";

  let { children } = $props();

  onNavigate((navigation) => {
    // Use View Transitions API if available
    if (!document.startViewTransition) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:head>
  <!-- System fonts, no external font loading needed -->
</svelte:head>

<div class="min-h-screen bg-white dark:bg-black">
  <ReadingProgress />
  <MobileHeader />
  <CommandPalette />

  <div class="flex">
    <!-- Desktop sidebar -->
    <aside
      class="sidebar hidden lg:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800/60 fixed top-0 left-0 h-screen overflow-y-auto bg-gray-50/80 dark:bg-[#0d0d0d] backdrop-blur-xl z-30"
    >
      <Sidebar />
    </aside>

    <!-- Main content -->
    <main id="main-content" class="flex-1 lg:ml-64 min-w-0 pt-12 lg:pt-0">
      {@render children()}
    </main>
  </div>

  <BackToTop />
</div>
