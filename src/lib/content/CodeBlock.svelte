<script lang="ts">
  import { onMount } from "svelte";

  let {
    lang = "",
    code,
  }: {
    lang?: string;
    code: string;
  } = $props();

  let highlighted = $state("");
  let copied = $state(false);

  const COPY_SVG =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  const CHECK_SVG =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  onMount(async () => {
    const hljs = (await import("highlight.js")).default;
    if (lang && hljs.getLanguage(lang)) {
      highlighted = hljs.highlight(code, { language: lang }).value;
    } else {
      highlighted = hljs.highlightAuto(code).value;
    }
  });

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 2000);
    });
  }
</script>

<div class="code-block">
  {#if lang}
    <span class="code-lang">{lang}</span>
  {/if}
  <button
    class="copy-btn"
    class:copied
    aria-label="Copy code"
    onclick={copy}
  >
    {#if copied}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- Safe: static SVG icon -->
      {@html CHECK_SVG}
    {:else}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- Safe: static SVG icon -->
      {@html COPY_SVG}
    {/if}
  </button>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- Safe: highlight.js sanitized output -->
  <pre><code class="hljs{lang ? ` language-${lang}` : ''}">{#if highlighted}{@html highlighted}{:else}{code}{/if}</code></pre>
</div>
