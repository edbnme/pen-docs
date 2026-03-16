<script lang="ts">
  let { title, description }: { title: string; description: string } = $props();
  let copied = $state(false);

  function extractPageContent(): string {
    const article = document.querySelector("article.prose");
    if (!article) return "";

    const lines: string[] = [];
    lines.push(`# ${title}`);
    lines.push("");
    lines.push(description);
    lines.push("");

    function walk(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return;
      }
      const el = node as HTMLElement;

      // Skip navigation, copy buttons, mermaid loading text
      if (
        el.tagName === "NAV" ||
        el.classList?.contains("copy-btn") ||
        el.classList?.contains("code-lang")
      )
        return;

      switch (el.tagName) {
        case "H1":
          lines.push(`# ${el.textContent?.trim()}`);
          lines.push("");
          break;
        case "H2":
          lines.push(`## ${el.textContent?.trim()}`);
          lines.push("");
          break;
        case "H3":
          lines.push(`### ${el.textContent?.trim()}`);
          lines.push("");
          break;
        case "H4":
          lines.push(`#### ${el.textContent?.trim()}`);
          lines.push("");
          break;
        case "P":
          lines.push(el.textContent?.trim() ?? "");
          lines.push("");
          break;
        case "PRE": {
          const codeEl = el.querySelector("code");
          const langClass = codeEl
            ?.getAttribute("class")
            ?.match(/language-(\w+)/);
          const lang = langClass ? langClass[1] : "";
          // Get the raw text content, which preserves code formatting
          const codeText = codeEl?.textContent ?? el.textContent ?? "";
          lines.push("```" + lang);
          lines.push(codeText.trimEnd());
          lines.push("```");
          lines.push("");
          break;
        }
        case "UL":
          for (const li of el.children) {
            if (li.tagName === "LI") {
              lines.push(`- ${li.textContent?.trim()}`);
            }
          }
          lines.push("");
          break;
        case "OL": {
          let i = 1;
          for (const li of el.children) {
            if (li.tagName === "LI") {
              lines.push(`${i}. ${li.textContent?.trim()}`);
              i++;
            }
          }
          lines.push("");
          break;
        }
        case "BLOCKQUOTE":
          lines.push(`> ${el.textContent?.trim()?.replace(/\n/g, "\n> ")}`);
          lines.push("");
          break;
        case "TABLE": {
          const rows = el.querySelectorAll("tr");
          rows.forEach((row, idx) => {
            const cells = row.querySelectorAll("th, td");
            const rowText = Array.from(cells)
              .map((c) => c.textContent?.trim())
              .join(" | ");
            lines.push(`| ${rowText} |`);
            if (idx === 0) {
              lines.push(
                `| ${Array.from(cells)
                  .map(() => "---")
                  .join(" | ")} |`,
              );
            }
          });
          lines.push("");
          break;
        }
        case "HR":
          lines.push("---");
          lines.push("");
          break;
        case "STRONG":
        case "EM":
        case "CODE":
        case "A":
        case "SPAN":
          // Inline elements — handled by parent's textContent
          break;
        case "DIV": {
          // Mermaid containers — extract as code block
          if (el.classList?.contains("mermaid-container")) {
            const svg = el.querySelector("svg");
            if (svg) {
              lines.push("[Diagram]");
              lines.push("");
            }
            break;
          }
          // Code block wrappers
          if (el.classList?.contains("code-block")) {
            // Let PRE child handle it
            for (const child of el.children) {
              walk(child);
            }
            break;
          }
          // Table wrappers
          if (el.classList?.contains("table-wrapper")) {
            for (const child of el.children) {
              walk(child);
            }
            break;
          }
          // Generic div — walk children
          for (const child of el.children) {
            walk(child);
          }
          break;
        }
        default:
          // Walk children for unknown elements
          for (const child of el.children) {
            walk(child);
          }
      }
    }

    for (const child of article.children) {
      walk(child);
    }

    // Clean up multiple blank lines
    return lines
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function copyForLLM() {
    const content = extractPageContent();
    navigator.clipboard.writeText(content).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 2500);
    });
  }
</script>

<button
  onclick={copyForLLM}
  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-medium rounded-lg border transition-all duration-200 cursor-pointer {copied
    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40'
    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-white/[0.04] border-gray-200 dark:border-gray-800/60 hover:border-gray-300 dark:hover:border-gray-700'}"
  aria-label="Copy page content for LLM"
>
  {#if copied}
    <svg
      class="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <polyline
        points="20 6 9 17 4 12"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    Copied
  {:else}
    <svg
      class="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    Copy for LLM
  {/if}
</button>
