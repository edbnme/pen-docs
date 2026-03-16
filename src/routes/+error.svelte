<script lang="ts">
  import { page } from "$app/state";
  import ArrowLeftIcon from "$lib/components/icons/ArrowLeftIcon.svelte";
</script>

<svelte:head>
  <title>Not Found — PEN Docs</title>
</svelte:head>

<div class="flex items-center justify-center min-h-[60vh] px-4">
  <div class="text-center">
    <div class="text-7xl font-bold text-gray-200 dark:text-gray-800 mb-6">
      {page.status}
    </div>
    <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
      Page not found
    </h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <a
      href="/docs/readme"
      class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 shadow-sm"
    >
      <ArrowLeftIcon />
      Back to docs
    </a>
  </div>
</div>
