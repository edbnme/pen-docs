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
  <h1>References</h1>

  <p>Specs, libraries, and prior art that shaped PEN.</p>

  <h2 id="core-specifications">Core Specifications</h2>

  <h3>Chrome DevTools Protocol</h3>

  <p>The CDP spec covers every domain PEN talks to:</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Domain</th><th>Purpose</th><th>Reference</th></tr></thead>
      <tbody>
        <tr><td><code>Runtime</code></td><td>Console messages, JS evaluation</td><td><a href="https://chromedevtools.github.io/devtools-protocol/tot/Runtime" target="_blank" rel="noopener noreferrer">Runtime</a></td></tr>
        <tr><td><code>Network</code></td><td>Request/response interception, waterfall</td><td><a href="https://chromedevtools.github.io/devtools-protocol/tot/Network" target="_blank" rel="noopener noreferrer">Network</a></td></tr>
        <tr><td><code>Page</code></td><td>Navigation, screenshots, lifecycle</td><td><a href="https://chromedevtools.github.io/devtools-protocol/tot/Page" target="_blank" rel="noopener noreferrer">Page</a></td></tr>
        <tr><td><code>HeapProfiler</code></td><td>Heap snapshots, allocation tracking</td><td><a href="https://chromedevtools.github.io/devtools-protocol/tot/HeapProfiler" target="_blank" rel="noopener noreferrer">HeapProfiler</a></td></tr>
        <tr><td><code>Profiler</code></td><td>CPU profiling</td><td><a href="https://chromedevtools.github.io/devtools-protocol/tot/Profiler" target="_blank" rel="noopener noreferrer">Profiler</a></td></tr>
        <tr><td><code>Debugger</code></td><td>Source maps, script sources</td><td><a href="https://chromedevtools.github.io/devtools-protocol/tot/Debugger" target="_blank" rel="noopener noreferrer">Debugger</a></td></tr>
        <tr><td><code>Tracing</code></td><td>Performance traces</td><td><a href="https://chromedevtools.github.io/devtools-protocol/tot/Tracing" target="_blank" rel="noopener noreferrer">Tracing</a></td></tr>
        <tr><td><code>Audits</code></td><td>Lighthouse-style audits</td><td><a href="https://chromedevtools.github.io/devtools-protocol/tot/Audits" target="_blank" rel="noopener noreferrer">Audits</a></td></tr>
        <tr><td><code>Target</code></td><td>Tab management, target discovery</td><td><a href="https://chromedevtools.github.io/devtools-protocol/tot/Target" target="_blank" rel="noopener noreferrer">Target</a></td></tr>
      </tbody>
    </table>
  </div>

  <h3>Model Context Protocol</h3>

  <ul>
    <li><strong>Specification</strong>: <a href="https://spec.modelcontextprotocol.io/2025-03-26/" target="_blank" rel="noopener noreferrer">spec.modelcontextprotocol.io/2025-03-26</a></li>
    <li><strong>Transport</strong>: stdio (stdin/stdout JSON-RPC 2.0)</li>
    <li><strong>Capabilities used</strong>: Tools (ListTools, CallTool)</li>
    <li><strong>SDK</strong>: <a href="https://github.com/modelcontextprotocol/go-sdk" target="_blank" rel="noopener noreferrer">github.com/modelcontextprotocol/go-sdk</a></li>
  </ul>

  <h2 id="go-libraries">Go Libraries</h2>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Library</th><th>Version</th><th>Purpose</th></tr></thead>
      <tbody>
        <tr><td><code>github.com/modelcontextprotocol/go-sdk</code></td><td>v1.3.1</td><td>MCP server implementation</td></tr>
        <tr><td><code>github.com/chromedp/chromedp</code></td><td>v0.13.6</td><td>Chrome DevTools Protocol client</td></tr>
        <tr><td><code>github.com/chromedp/cdproto</code></td><td>(transitive)</td><td>CDP type definitions</td></tr>
        <tr><td><code>github.com/charmbracelet/huh</code></td><td>v1.0.0</td><td>Interactive terminal wizard (<code>pen init</code>)</td></tr>
        <tr><td><code>github.com/charmbracelet/lipgloss</code></td><td>v1.1.0</td><td>Terminal output styling</td></tr>
      </tbody>
    </table>
  </div>

  <p>
    All versions pulled from
    <a href="https://github.com/edbnme/pen/blob/main/go.mod" target="_blank" rel="noopener noreferrer">go.mod</a>.
    Requires Go 1.24.2+.
  </p>

  <h2 id="prior-art">Prior Art</h2>

  <p>Tools and projects that influenced PEN:</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Tool</th><th>Relationship to PEN</th></tr></thead>
      <tbody>
        <tr><td><strong>Chrome DevTools</strong></td><td>PEN exposes the same browser internals, but over MCP instead of a GUI</td></tr>
        <tr><td><strong>Puppeteer</strong></td><td>Node.js CDP library; PEN uses chromedp (Go) for the same protocol</td></tr>
        <tr><td><strong>Playwright</strong></td><td>Multi-browser automation; PEN is Chrome-only, MCP-native</td></tr>
        <tr><td><strong>Lighthouse CLI</strong></td><td>PEN shells out to the Lighthouse CLI via <code>exec.CommandContext</code> rather than wrapping CDP audit domains directly</td></tr>
        <tr><td><strong>web-vitals</strong></td><td>Client-side metrics library; PEN grabs the same data server-side via CDP</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="architecture-references">Architecture References</h2>

  <ul>
    <li><strong>Go concurrency</strong>: <code>sync.Mutex</code> for operation locks, <code>context.Context</code> for cancellation, goroutines for event listeners</li>
    <li><strong>Graceful degradation</strong>: Partial results over hard failures (see <a href="/docs/error-handling">Error Handling</a>)</li>
    <li><strong>Token-aware output</strong>: Everything shaped for LLM context windows (see <a href="/docs/output-design">Output Design</a>)</li>
  </ul>

  <h2 id="project-links">Project Links</h2>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Resource</th><th>URL</th></tr></thead>
      <tbody>
        <tr><td>Source code</td><td><a href="https://github.com/edbnme/pen" target="_blank" rel="noopener noreferrer">github.com/edbnme/pen</a></td></tr>
        <tr><td>Documentation</td><td><a href="https://github.com/edbnme/pen-docs" target="_blank" rel="noopener noreferrer">pen-docs (this site)</a></td></tr>
        <tr><td>Go module</td><td><code>github.com/edbnme/pen</code></td></tr>
        <tr><td>License</td><td>MIT</td></tr>
      </tbody>
    </table>
  </div>
</DocPage>
