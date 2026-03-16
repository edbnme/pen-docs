<script lang="ts">
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>Not Found — PEN Docs</title>
</svelte:head>

<div class="flex items-center justify-center min-h-[60vh] px-4">
  <div class="text-center">
    <div class="text-6xl font-bold text-gray-200 mb-4">{page.status}</div>
    <h1 class="text-xl font-semibold text-gray-900 mb-2">Page not found</h1>
    <p class="text-sm text-gray-500 mb-6">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <a
      href="/docs/readme"
      class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
    >
      <svg
        class="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to docs
    </a>
  </div>
</div>
