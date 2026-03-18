<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    summary: string;
    children: Snippet;
    open?: boolean;
  }

  let { summary, children, open = false }: Props = $props();
</script>

<details class="details-dropdown" {open}>
  <summary>{summary}</summary>
  <div class="details-content">
    {@render children()}
  </div>
</details>
