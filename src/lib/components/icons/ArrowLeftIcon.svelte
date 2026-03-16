<script lang="ts">
  let { class: className = "w-4 h-4" }: { class?: string } = $props();
</script>

<svg
  class={className}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M19 12H5M12 19l-7-7 7-7" />
</svg>
