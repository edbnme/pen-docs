<script lang="ts">
  import { page } from "$app/state";
  import ArrowLeftIcon from "$lib/components/icons/ArrowLeftIcon.svelte";
</script>

<svelte:head>
  <title>Not Found — PEN Docs</title>
</svelte:head>

<div class="flex items-center justify-center min-h-[60vh] px-4">
  <div class="text-center">
    <div class="text-6xl font-bold text-gray-200 dark:text-gray-800 mb-4">
      {page.status}
    </div>
    <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
      Page not found
    </h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <a
      href="/docs/readme"
      class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
    >
      <ArrowLeftIcon />
      Back to docs
    </a>
  </div>
</div>
