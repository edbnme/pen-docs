<script lang="ts">
  import DocPage from "$lib/content/DocPage.svelte";
  import CodeBlock from "$lib/content/CodeBlock.svelte";
  import Mermaid from "$lib/content/Mermaid.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<DocPage
  title={data.title}
  description={data.description}
  slug={data.slug}
  headings={data.headings}
>
  <h1>PEN</h1>

  <p>
    MCP server for browser performance profiling. Tell your AI to profile a
    page, hunt down a memory leak, or check code coverage — PEN does the
    DevTools work and hands back structured results.
  </p>

  <p>
    One Go binary. No Node.js. Auto-launches a debug browser or attaches to one
    you're already running.
  </p>

  <h2 id="how-it-works">How It Works</h2>

  <Mermaid
    code={`flowchart LR
    IDE["AI Assistant<br>(IDE / LLM)"] -->|"MCP (stdio or HTTP)"| PEN["PEN<br>(Go binary)"]
    PEN -->|"CDP (WebSocket)"| Chrome[Chrome]`}
  />

  <p>
    Your editor spawns PEN as a child process. When the LLM calls a tool like
    <code>pen_heap_snapshot</code>, PEN fires CDP commands, streams data to
    disk, and sends back structured analysis.
  </p>

  <h2 id="what-you-can-do">What You Can Do</h2>

  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>What it does</th>
          <th>Tools</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Memory</strong></td>
          <td>Heap snapshots, diffs, allocation tracking</td>
          <td>4</td>
        </tr>
        <tr>
          <td><strong>CPU</strong></td>
          <td>CPU profiling, Chrome traces, trace analysis</td>
          <td>3</td>
        </tr>
        <tr>
          <td><strong>Network</strong></td>
          <td>Capture, waterfall, render-blocking detection</td>
          <td>4</td>
        </tr>
        <tr>
          <td><strong>Coverage</strong></td>
          <td>JS and CSS coverage with unused byte breakdown</td>
          <td>2</td>
        </tr>
        <tr>
          <td><strong>Audit</strong></td>
          <td>Performance metrics, Web Vitals, accessibility</td>
          <td>3</td>
        </tr>
        <tr>
          <td><strong>Source</strong></td>
          <td>List and search loaded scripts</td>
          <td>3</td>
        </tr>
        <tr>
          <td><strong>Console</strong></td>
          <td>Live console capture and filtering</td>
          <td>2</td>
        </tr>
        <tr>
          <td><strong>Lighthouse</strong></td>
          <td>Full Lighthouse audits</td>
          <td>1</td>
        </tr>
        <tr>
          <td><strong>Utility</strong></td>
          <td>Navigation, screenshots, eval, emulation, tabs</td>
          <td>8</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p>
    30 tools total.
    <a href="/docs/tool-catalog" data-sveltekit-preload-data="hover"
      >Full reference &rarr;</a
    >
  </p>

  <h2 id="example">Example</h2>

  <p>Ask your AI: <em>"Check the performance metrics of this page"</em></p>

  <CodeBlock
    code={`## Performance Metrics

| Metric           | Value   |
|------------------|---------|
| JSHeapUsedSize   | 41.3 MB |
| Nodes            | 6,284   |
| JSEventListeners | 1,116   |
| ScriptDuration   | 4.47s   |
| LayoutCount      | 127     |
| LayoutDuration   | 305.3ms |`}
  />

  <p>
    The LLM spots the high heap and slow scripts, then suggests fixes. You never
    open DevTools.
  </p>

  <h2 id="vs-chrome-devtools-mcp">vs chrome-devtools-mcp</h2>

  <p>
    Google's
    <a
      href="https://github.com/ChromeDevTools/chrome-devtools-mcp"
      target="_blank"
      rel="noopener noreferrer"><code>chrome-devtools-mcp</code></a
    >
    is a general DevTools MCP server. PEN is built specifically for performance work:
    multi-snapshot heap diffs, streaming for multi-GB payloads, no Node.js runtime,
    and every tool aimed at "why is this slow?" rather than "what's on the page?".
    They complement each other.
  </p>
</DocPage>
