<script lang="ts">
  import "../app.css";
  import "highlight.js/styles/github.css";
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
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="min-h-screen bg-white">
  <ReadingProgress />
  <MobileHeader />
  <CommandPalette />

  <div class="flex">
    <!-- Desktop sidebar -->
    <aside
      class="sidebar hidden lg:block w-60 shrink-0 border-r border-gray-200 fixed top-0 left-0 h-screen overflow-y-auto bg-white/80 backdrop-blur z-30"
    >
      <Sidebar />
    </aside>

    <!-- Main content -->
    <main id="main-content" class="flex-1 lg:ml-60 min-w-0 pt-12 lg:pt-0">
      {@render children()}
    </main>
  </div>

  <BackToTop />
</div>
