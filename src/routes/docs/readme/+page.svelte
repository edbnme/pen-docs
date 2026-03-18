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
    Your editor spawns PEN as a child process. When the LLM calls something like <code
      >pen_heap_snapshot</code
    >, PEN fires the right Chrome DevTools Protocol commands, streams data to
    disk, and sends back analysis the LLM can act on.
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
          <td
            >Heap snapshots, snapshot diffs for leak detection, allocation
            tracking</td
          >
          <td>4 tools</td>
        </tr>
        <tr>
          <td><strong>CPU</strong></td>
          <td>CPU profiling, Chrome traces, offline trace analysis</td>
          <td>3 tools</td>
        </tr>
        <tr>
          <td><strong>Network</strong></td>
          <td>Request capture, waterfall, render-blocking detection</td>
          <td>4 tools</td>
        </tr>
        <tr>
          <td><strong>Coverage</strong></td>
          <td>JS and CSS coverage with unused byte breakdown</td>
          <td>2 tools</td>
        </tr>
        <tr>
          <td><strong>Audit</strong></td>
          <td>Performance metrics, Core Web Vitals, accessibility</td>
          <td>3 tools</td>
        </tr>
        <tr>
          <td><strong>Source</strong></td>
          <td>List scripts, grab source, search across all loaded scripts</td>
          <td>3 tools</td>
        </tr>
        <tr>
          <td><strong>Console</strong></td>
          <td>Live console capture and filtering</td>
          <td>2 tools</td>
        </tr>
        <tr>
          <td><strong>Lighthouse</strong></td>
          <td>Full Lighthouse audits (needs the CLI)</td>
          <td>1 tool</td>
        </tr>
        <tr>
          <td><strong>Utility</strong></td>
          <td>Navigation, screenshots, eval, device emulation, tab switching</td
          >
          <td>8 tools</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p>
    30 tools total. See the full
    <a href="/docs/tool-catalog" data-sveltekit-preload-data="hover"
      >Tool Reference</a
    >.
  </p>

  <h2 id="quick-start">Quick Start</h2>

  <CodeBlock
    lang="bash"
    code={`# Install
curl -fsSL https://raw.githubusercontent.com/edbnme/pen/main/install.sh | sh

# Interactive setup wizard
pen init`}
  />

  <p>
    <code>pen init</code> detects your browser and IDE, writes the MCP config, and
    verifies the connection.
  </p>

  <p>Or install via package managers:</p>

  <CodeBlock
    lang="bash"
    code={`brew install edbnme/tap/pen    # macOS / Linux
scoop bucket add pen https://github.com/edbnme/scoop-pen && scoop install pen  # Windows`}
  />

  <p>
    Full install guide:
    <a href="/docs/install" data-sveltekit-preload-data="hover">Installation</a>
  </p>

  <h2 id="example">Example</h2>

  <p>Ask your AI assistant:</p>

  <blockquote>
    <p><em>"Check the performance metrics of this page"</em></p>
  </blockquote>

  <p>
    PEN connects to Chrome, runs <code>pen_performance_metrics</code> via CDP, and
    returns:
  </p>

  <CodeBlock
    code={`┌ Performance Metrics
│ Metric              │ Value    │ Status
│ JSHeapUsedSize      │ 82.4 MB  │ ⚠ High
│ Nodes               │ 4,521    │
│ LayoutCount         │ 12       │
│ RecalcStyleCount    │ 8        │
│ ScriptDuration      │ 1.23s    │ ⚠ Slow
└`}
  />

  <p>
    The LLM spots the high heap and slow scripts, then suggests fixes. You never
    open DevTools.
  </p>

  <h2 id="key-design-decisions">Key Design Decisions</h2>

  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Decision</th>
          <th>Choice</th>
          <th>Why</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Language</td>
          <td>Go 1.24</td>
          <td>Single binary, chromedp + MCP Go SDK</td>
        </tr>
        <tr>
          <td>Transport</td>
          <td>stdio (default), HTTP</td>
          <td>stdio for IDE spawning; HTTP for shared/remote</td>
        </tr>
        <tr>
          <td>CDP</td>
          <td>Auto-launch or attach</td>
          <td
            >Launches a separate debug browser, or attaches to an existing one</td
          >
        </tr>
        <tr>
          <td>Large payloads</td>
          <td>Stream to disk</td>
          <td>Heap snapshots can exceed 1 GB; PEN uses constant memory</td>
        </tr>
        <tr>
          <td>Security</td>
          <td>Layered gates</td>
          <td
            >Eval gating, expression blocklist, path validation, rate limits</td
          >
        </tr>
      </tbody>
    </table>
  </div>

  <h2 id="vs-chrome-devtools-mcp">vs chrome-devtools-mcp</h2>

  <p>
    Google maintains
    <a
      href="https://github.com/ChromeDevTools/chrome-devtools-mcp"
      target="_blank"
      rel="noopener noreferrer"><code>chrome-devtools-mcp</code></a
    >
    — a general DevTools MCP server for navigation, DOM, screenshots, network, traces,
    memory, and Lighthouse.
  </p>

  <p>
    PEN is built for performance work: multi-snapshot heap diffs for leak
    detection, streaming for multi-GB payloads, no Node.js runtime, and every
    tool aimed at "why is this slow?" rather than "what's on the page?". They
    complement each other.
  </p>

  <h2 id="docs">Docs</h2>

  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Section</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            ><a href="/docs/install" data-sveltekit-preload-data="hover"
              >Installation</a
            ></td
          >
          <td>Install, browser setup, IDE config, <code>pen init</code></td>
        </tr>
        <tr>
          <td
            ><a href="/docs/running" data-sveltekit-preload-data="hover"
              >Running PEN</a
            ></td
          >
          <td>Flags, Docker, server deploys</td>
        </tr>
        <tr>
          <td
            ><a href="/docs/tool-catalog" data-sveltekit-preload-data="hover"
              >Tool Reference</a
            ></td
          >
          <td>Every tool's params and output</td>
        </tr>
        <tr>
          <td
            ><a href="/docs/workflows" data-sveltekit-preload-data="hover"
              >Workflows</a
            ></td
          >
          <td>Common tool chains and recipes</td>
        </tr>
        <tr>
          <td
            ><a href="/docs/troubleshooting" data-sveltekit-preload-data="hover"
              >Troubleshooting</a
            ></td
          >
          <td>Common issues and fixes</td>
        </tr>
        <tr>
          <td
            ><a href="/docs/security" data-sveltekit-preload-data="hover"
              >Security</a
            ></td
          >
          <td>Threat model and defenses</td>
        </tr>
        <tr>
          <td
            ><a href="/docs/architecture" data-sveltekit-preload-data="hover"
              >Architecture</a
            ></td
          >
          <td>System design (for contributors)</td>
        </tr>
      </tbody>
    </table>
  </div>
</DocPage>
