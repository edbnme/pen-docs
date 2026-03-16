const COPY_SVG =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

const CHECK_SVG =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

/** Wire up click handlers on all `.copy-btn` elements within the page. */
export function initCopyButtons(): void {
  for (const btn of document.querySelectorAll<HTMLButtonElement>(".copy-btn")) {
    btn.addEventListener("click", () => {
      const code = btn.closest(".code-block")?.querySelector("code");
      if (!code) return;

      navigator.clipboard.writeText(code.textContent ?? "").then(() => {
        btn.classList.add("copied");
        btn.innerHTML = CHECK_SVG;
        setTimeout(() => {
          btn.classList.remove("copied");
          btn.innerHTML = COPY_SVG;
        }, 2000);
      });
    });
  }
}
