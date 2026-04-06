<script lang="ts" module>
  import type { HLJSApi, LanguageFn } from "highlight.js";

  const languageLoaders: Record<
    string,
    () => Promise<{ default: LanguageFn }>
  > = {
    bash: () => import("highlight.js/lib/languages/bash"),
    diff: () => import("highlight.js/lib/languages/diff"),
    go: () => import("highlight.js/lib/languages/go"),
    javascript: () => import("highlight.js/lib/languages/javascript"),
    json: () => import("highlight.js/lib/languages/json"),
    plaintext: () => import("highlight.js/lib/languages/plaintext"),
    typescript: () => import("highlight.js/lib/languages/typescript"),
    xml: () => import("highlight.js/lib/languages/xml"),
    yaml: () => import("highlight.js/lib/languages/yaml"),
  };

  let highlighterPromise: Promise<HLJSApi> | null = null;

  function normalizeLanguage(lang: string): string {
    switch (lang.toLowerCase()) {
      case "html":
        return "xml";
      case "js":
        return "javascript";
      case "shell":
      case "sh":
        return "bash";
      case "text":
        return "plaintext";
      case "ts":
        return "typescript";
      case "yml":
        return "yaml";
      default:
        return lang.toLowerCase();
    }
  }

  async function loadHighlighter(): Promise<HLJSApi> {
    if (!highlighterPromise) {
      highlighterPromise = (async () => {
        const hljs = (await import("highlight.js/lib/core")).default;

        for (const [name, loadLanguage] of Object.entries(languageLoaders)) {
          hljs.registerLanguage(name, (await loadLanguage()).default);
        }

        return hljs;
      })();
    }

    return highlighterPromise;
  }
</script>

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
    const hljs = await loadHighlighter();
    const normalizedLang = normalizeLanguage(lang);

    if (normalizedLang && hljs.getLanguage(normalizedLang)) {
      highlighted = hljs.highlight(code, { language: normalizedLang }).value;
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
  <button class="copy-btn" class:copied aria-label="Copy code" onclick={copy}>
    {#if copied}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- Safe: static SVG icon -->
      {@html CHECK_SVG}
    {:else}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- Safe: static SVG icon -->
      {@html COPY_SVG}
    {/if}
  </button>
  <!-- eslint-disable svelte/no-at-html-tags -- Safe: highlight.js sanitized output -->
  <pre><code class="hljs{lang ? ` language-${lang}` : ''}"
      >{#if highlighted}{@html highlighted}{:else}{code}{/if}</code
    ></pre>
  <!-- eslint-enable svelte/no-at-html-tags -->
</div>
