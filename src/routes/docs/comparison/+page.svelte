<script lang="ts">
  import DocPage from "$lib/content/DocPage.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<DocPage
  title={data.title}
  description={data.description}
  slug={data.slug}
  headings={data.headings}
>
  <h1>Comparison</h1>

  <p>
    PEN is a performance-focused MCP server. This page compares it to other
    browser tools so you can decide when PEN is the right choice — and when
    another tool might be a better fit.
  </p>

  <h2 id="overview">Overview</h2>

  <table>
    <thead>
      <tr>
        <th>Tool</th>
        <th>Type</th>
        <th>Language</th>
        <th>Focus</th>
        <th>MCP</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>PEN</strong></td>
        <td>MCP server</td>
        <td>Go (single binary)</td>
        <td>Performance profiling &amp; analysis</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td><strong>Playwright MCP</strong></td>
        <td>MCP server</td>
        <td>TypeScript (npx)</td>
        <td>Browser automation &amp; interaction</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td><strong>BrowserTools MCP</strong></td>
        <td>MCP server</td>
        <td>JS/TS (npx + extension)</td>
        <td>Browser log monitoring &amp; debugging</td>
        <td>Yes (discontinued)</td>
      </tr>
      <tr>
        <td><strong>Chrome DevTools MCP</strong></td>
        <td>MCP server</td>
        <td>TypeScript</td>
        <td>General DevTools (DOM, network, traces)</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td><strong>Lighthouse CLI</strong></td>
        <td>Standalone CLI</td>
        <td>Node.js</td>
        <td>Page quality audits</td>
        <td>No</td>
      </tr>
      <tr>
        <td><strong>WebPageTest</strong></td>
        <td>SaaS + self-host</td>
        <td>PHP/Node</td>
        <td>Real-world performance testing</td>
        <td>No</td>
      </tr>
    </tbody>
  </table>

  <h2 id="feature-matrix">Feature Matrix</h2>

  <p>
    A ✅ means the tool has the feature. A <strong>bold ✅</strong> means it's a standout
    strength. A ❌ means the feature is not available.
  </p>

  <h3 id="performance-profiling">Performance Profiling</h3>

  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>PEN</th>
        <th>Playwright</th>
        <th>BrowserTools</th>
        <th>DevTools MCP</th>
        <th>Lighthouse</th>
        <th>WebPageTest</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>CPU profiling (V8 profiles, hot functions)</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Heap snapshots</td>
        <td><strong>✅</strong> (streamed to disk)</td>
        <td>❌</td>
        <td>❌</td>
        <td>✅</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Heap diffing (leak detection)</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Allocation tracking</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Heap sampling profiler</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Chrome Timeline traces</td>
        <td><strong>✅</strong> (capture + analysis)</td>
        <td>✅ (opt-in)</td>
        <td>❌</td>
        <td>✅</td>
        <td>❌</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>Automated trace insights</td>
        <td><strong>✅</strong> (long tasks, CLS, LCP)</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>Core Web Vitals</td>
        <td><strong>✅</strong> (LCP, CLS, INP)</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>✅</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>Real-time performance metrics</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
    </tbody>
  </table>

  <h3 id="network-coverage">Network &amp; Coverage</h3>

  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>PEN</th>
        <th>Playwright</th>
        <th>BrowserTools</th>
        <th>DevTools MCP</th>
        <th>Lighthouse</th>
        <th>WebPageTest</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Network request capture</td>
        <td><strong>✅</strong> (waterfall, detail, filtering)</td>
        <td>❌</td>
        <td>✅ (XHR only)</td>
        <td>✅</td>
        <td>❌</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>Render-blocking resource detection</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>✅</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>JS code coverage (per-function)</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>✅</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>CSS code coverage (rule-level)</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td>✅</td>
        <td>❌</td>
      </tr>
    </tbody>
  </table>

  <h3 id="browser-interaction">Browser Interaction</h3>

  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>PEN</th>
        <th>Playwright</th>
        <th>BrowserTools</th>
        <th>DevTools MCP</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Navigate (goto/back/forward/reload)</td>
        <td>✅</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>Click / type / hover / drag</td>
        <td>❌</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>Form filling</td>
        <td>❌</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>DOM element selection</td>
        <td>❌</td>
        <td><strong>✅</strong> (accessibility tree)</td>
        <td>✅</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>Tab management</td>
        <td>✅</td>
        <td>✅</td>
        <td>❌</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>Device emulation</td>
        <td>✅ (presets + throttling)</td>
        <td>✅</td>
        <td>❌</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>Screenshot capture</td>
        <td>✅ (full-page, element, formats)</td>
        <td>✅</td>
        <td>✅</td>
        <td>✅</td>
      </tr>
    </tbody>
  </table>

  <h3 id="auditing">Auditing &amp; Analysis</h3>

  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>PEN</th>
        <th>Playwright</th>
        <th>BrowserTools</th>
        <th>DevTools MCP</th>
        <th>Lighthouse</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Lighthouse integration</td>
        <td>✅ (via CLI)</td>
        <td>❌</td>
        <td>✅ (via Puppeteer)</td>
        <td>✅</td>
        <td><strong>Native</strong></td>
      </tr>
      <tr>
        <td>Accessibility scan</td>
        <td>✅ (basic)</td>
        <td>✅ (accessibility tree)</td>
        <td>✅ (WCAG via Lighthouse)</td>
        <td>❌</td>
        <td><strong>✅</strong> (full WCAG)</td>
      </tr>
      <tr>
        <td>SEO audit</td>
        <td>✅ (via Lighthouse)</td>
        <td>❌</td>
        <td>✅ (Lighthouse + NextJS)</td>
        <td>❌</td>
        <td><strong>✅</strong></td>
      </tr>
      <tr>
        <td>Best practices audit</td>
        <td>✅ (via Lighthouse)</td>
        <td>❌</td>
        <td>✅ (via Lighthouse)</td>
        <td>❌</td>
        <td><strong>✅</strong></td>
      </tr>
      <tr>
        <td>PWA audit</td>
        <td>✅ (via Lighthouse)</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
        <td><strong>✅</strong></td>
      </tr>
    </tbody>
  </table>

  <h3 id="console-debugging">Console &amp; Debugging</h3>

  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>PEN</th>
        <th>Playwright</th>
        <th>BrowserTools</th>
        <th>DevTools MCP</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Console log capture</td>
        <td><strong>✅</strong> (all levels + exceptions)</td>
        <td>✅</td>
        <td>✅</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>Console message filtering</td>
        <td><strong>✅</strong> (level, text, last N)</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Exception stack traces</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>JS source listing</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Source code retrieval</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Cross-script search</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>JS evaluation (gated)</td>
        <td>✅</td>
        <td>✅</td>
        <td>❌</td>
        <td>✅</td>
      </tr>
    </tbody>
  </table>

  <h3 id="architecture-dx">Architecture &amp; DX</h3>

  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>PEN</th>
        <th>Playwright</th>
        <th>BrowserTools</th>
        <th>DevTools MCP</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Single binary (no runtime)</td>
        <td><strong>✅</strong></td>
        <td>❌ (Node.js)</td>
        <td>❌ (Node.js + extension)</td>
        <td>❌ (Node.js)</td>
      </tr>
      <tr>
        <td>Zero dependencies</td>
        <td><strong>✅</strong></td>
        <td>❌ (npx)</td>
        <td>❌ (3 components)</td>
        <td>❌ (npx)</td>
      </tr>
      <tr>
        <td>Connects to existing browser</td>
        <td>✅</td>
        <td>✅ (extension)</td>
        <td>✅ (extension)</td>
        <td>✅</td>
      </tr>
      <tr>
        <td>Streaming for large payloads</td>
        <td><strong>✅</strong></td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Interactive setup wizard</td>
        <td><strong>✅</strong> (<code>pen init</code>)</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Diagnostic tool</td>
        <td><strong>✅</strong> (<code>pen check</code>)</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>Security gates (eval, rate limits)</td>
        <td><strong>✅</strong></td>
        <td>✅ (origins)</td>
        <td>✅ (header stripping)</td>
        <td>❌</td>
      </tr>
    </tbody>
  </table>

  <h2 id="differentiators">PEN's Differentiators</h2>

  <ol>
    <li>
      <strong>Deep V8 profiling</strong> — CPU profiles with hot-function analysis,
      heap snapshots with cross-snapshot diffing for leak detection, allocation tracking,
      and sampling profiler. No other MCP server offers this depth.
    </li>
    <li>
      <strong>Streaming architecture</strong> — Heap snapshots (which can exceed 1
      GB) are streamed to disk with constant memory usage. Other tools either can't
      handle large payloads or buffer everything in memory.
    </li>
    <li>
      <strong>Single Go binary</strong> — Zero runtime dependencies. Download and
      run. No Node.js, no npx, no Chrome extension required.
    </li>
    <li>
      <strong>Performance-first design</strong> — Every tool answers "why is this
      slow?" — structured output is optimized for LLM consumption.
    </li>
    <li>
      <strong>Trace analysis</strong> — Automated long-task detection, CLS identification,
      LCP candidates, and resource bottleneck analysis from Chrome Timeline captures.
    </li>
    <li>
      <strong>Source code intelligence</strong> — List all parsed scripts, retrieve
      source by ID or URL, regex search across all loaded scripts. Unique among MCP
      servers.
    </li>
  </ol>

  <h2 id="when-to-use-what">When to Use What</h2>

  <table>
    <thead>
      <tr>
        <th>Task</th>
        <th>Best Tool</th>
        <th>Why</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Find memory leaks</td>
        <td><strong>PEN</strong></td>
        <td
          >Heap snapshots, diffing, allocation tracking — no other MCP tool does
          this</td
        >
      </tr>
      <tr>
        <td>Profile CPU hot paths</td>
        <td><strong>PEN</strong></td>
        <td>V8 CPU profiling with call tree and hot function analysis</td>
      </tr>
      <tr>
        <td>Analyze page load performance</td>
        <td><strong>PEN</strong></td>
        <td
          >Web Vitals, trace insights, network waterfall, coverage — all in one</td
        >
      </tr>
      <tr>
        <td>Find unused JavaScript/CSS</td>
        <td><strong>PEN</strong></td>
        <td>Per-function JS coverage and rule-level CSS coverage</td>
      </tr>
      <tr>
        <td>Automate browser interactions</td>
        <td><strong>Playwright MCP</strong></td>
        <td>Full click/type/hover/drag automation with accessibility tree</td>
      </tr>
      <tr>
        <td>End-to-end testing</td>
        <td><strong>Playwright MCP</strong></td>
        <td>Test assertions, code generation, session recording</td>
      </tr>
      <tr>
        <td>Quick SEO/a11y audit</td>
        <td><strong>Lighthouse CLI</strong></td>
        <td
          >Purpose-built for page quality audits with detailed recommendations</td
        >
      </tr>
      <tr>
        <td>Test across geo-locations</td>
        <td><strong>WebPageTest</strong></td>
        <td>Cloud-based testing from global locations with real devices</td>
      </tr>
      <tr>
        <td>Debug console errors in IDE</td>
        <td><strong>PEN</strong></td>
        <td>Console capture with filtering, stack traces, and source search</td>
      </tr>
    </tbody>
  </table>

  <blockquote>
    <p>
      <strong>Tip:</strong> PEN and Playwright MCP serve different purposes and complement
      each other. Use PEN for profiling and diagnostics, Playwright for automation
      and interaction. You can run both as MCP servers in the same IDE.
    </p>
  </blockquote>
</DocPage>
