<script lang="ts">
  import DocPage from "$lib/content/DocPage.svelte";
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
  <h1>Workflows</h1>

  <p>
    PEN tools chain together naturally. The LLM decides what to run and in what
    order — PEN doesn't enforce any particular flow. These are patterns that
    work well for common investigations.
  </p>

  <h2 id="memory-leak-investigation">Memory Leak Investigation</h2>

  <Mermaid
    code={`flowchart LR
    A["pen_collect_garbage"] --> B["pen_heap_snapshot (A)"]
    B --> C(["User action"])
    C --> D["pen_heap_snapshot (B)"]
    D --> E["pen_heap_diff (A, B)"]`}
  />

  <ol>
    <li>Force GC to get a clean baseline</li>
    <li>Take snapshot A</li>
    <li>Have the user reproduce the suspected leak (navigate, open/close a modal, etc.)</li>
    <li>Take snapshot B</li>
    <li>Diff the two snapshots — PEN shows new objects, grown objects, and total delta</li>
  </ol>

  <p>
    The diff highlights retained objects that grew between the two snapshots —
    those are your leak suspects. From there, the LLM can reason about the
    object types and suggest what's holding the reference.
  </p>

  <blockquote>
    <p>
      <strong>Tip:</strong> If you'd rather track allocations over time instead
      of taking two manual snapshots, use <code>pen_heap_track</code> with
      <code>action: "start"</code>, reproduce the problem, then
      <code>action: "stop"</code>.
    </p>
  </blockquote>

  <h2 id="page-load-optimization">Page Load Optimization</h2>

  <Mermaid
    code={`flowchart LR
    A[pen_navigate] --> B[pen_capture_trace]
    B --> C[pen_trace_insights]
    C --> D[pen_network_waterfall]
    D --> E[pen_web_vitals]`}
  />

  <ol>
    <li>Navigate to the target page</li>
    <li>Capture a Chrome trace during load</li>
    <li>Analyze the trace for long tasks (&gt;50ms), LCP, CLS, and slow resources</li>
    <li>Check the network waterfall for large assets, slow requests, and render-blocking resources</li>
    <li>Measure Core Web Vitals for the final score</li>
  </ol>

  <p>
    That gives the LLM the full picture: trace-level timing, network
    bottlenecks, and Web Vitals scores in one pass.
  </p>

  <h2 id="console-debugging">Console Debugging</h2>

  <Mermaid
    code={`flowchart LR
    A[pen_console_enable] --> B(["User triggers problem"])
    B --> C["pen_console_messages\n(level=error)"]`}
  />

  <ol>
    <li>Start console capture to wire up the CDP listener</li>
    <li>Have the user reproduce the issue</li>
    <li>Pull error messages — filtering by <code>level=error</code> keeps noise down</li>
  </ol>

  <p>
    Console entries include source URLs, line numbers, and stack traces for
    exceptions. Buffer holds 1,000 messages; oldest 100 get evicted when it
    fills up.
  </p>

  <h2 id="full-page-audit">Full Page Audit</h2>

  <Mermaid
    code={`flowchart LR
    A[pen_navigate] --> B[pen_lighthouse]
    B --> C[pen_capture_trace]
    C --> D[pen_trace_insights]`}
  />

  <ol>
    <li>Navigate to the page</li>
    <li>Run Lighthouse for a high-level score (performance, accessibility, SEO, best practices)</li>
    <li>Capture a trace for the detailed timeline</li>
    <li>Analyze the trace to pinpoint exactly what Lighthouse flagged</li>
  </ol>

  <p>
    Lighthouse tells you <em>what's wrong</em>. The trace tells you
    <em>why</em> and <em>where</em> in the timeline.
  </p>

  <h2 id="bundle-audit">Bundle Audit</h2>

  <Mermaid
    code={`flowchart LR
    A["pen_js_coverage\n(navigate=URL)"] --> B["pen_css_coverage\n(navigate=URL)"]`}
  />

  <ol>
    <li>
      Run <code>pen_js_coverage</code> with the <code>navigate</code> parameter
      set to the page URL — PEN starts coverage, navigates, collects, and stops
      internally
    </li>
    <li>
      Run <code>pen_css_coverage</code> the same way to see which CSS rules are unused
    </li>
  </ol>

  <p>
    This surfaces dead code. The LLM can then recommend code splitting or
    tree-shaking based on what's unused. Both coverage tools are single-call —
    they handle start, navigate, collect, and stop in one invocation.
  </p>

  <h2 id="multi-tab-profiling">Multi-Tab Profiling</h2>

  <Mermaid
    code={`flowchart LR
    A[pen_list_pages] --> B[pen_select_page]
    B --> C[pen_cpu_profile]
    C --> D[pen_performance_metrics]`}
  />

  <ol>
    <li>List all browser tabs</li>
    <li>Switch to the target tab</li>
    <li>Profile CPU on that tab</li>
    <li>Grab performance metrics</li>
  </ol>

  <p>
    Handy when your app spans multiple tabs or you need to compare performance
    across pages.
  </p>

  <h2 id="trace-driven-analysis">Trace-Driven Analysis</h2>

  <Mermaid
    code={`flowchart LR
    A[pen_capture_trace] --> B[pen_trace_insights]`}
  />

  <p>
    Record a raw trace, then feed it to <code>pen_trace_insights</code> for a
    structured breakdown. No need to leave the conversation to analyze the file.
    You get:
  </p>

  <ul>
    <li>Long tasks (&gt;50ms threshold)</li>
    <li>Layout shifts (CLS contributors)</li>
    <li>Largest Contentful Paint timing</li>
    <li>Slowest resources</li>
    <li>Frame timing and dropped frames (&gt;33.3ms = below 30fps)</li>
  </ul>

  <h2 id="network-performance">Network Performance</h2>

  <Mermaid
    code={`flowchart LR
    A[pen_network_enable] --> B(["Interact with page"])
    B --> C[pen_network_waterfall]
    C --> D["pen_network_request\n(specific URL)"]`}
  />

  <ol>
    <li>Enable network capture (optionally disable cache)</li>
    <li>Interact with the page — navigate, click, scroll</li>
    <li>View the waterfall to spot slow requests, large assets, or 4xx/5xx errors</li>
    <li>Drill into a specific request for full headers, timing, and body details</li>
  </ol>

  <h2 id="device-simulation">Device Simulation</h2>

  <Mermaid
    code={`flowchart LR
    A["pen_emulate\n(device + throttling)"] --> B[pen_navigate]
    B --> C[pen_web_vitals]
    C --> D[pen_capture_trace]`}
  />

  <ol>
    <li>Set device emulation (e.g., iPhone 14 with 4G network + 4x CPU throttle)</li>
    <li>Navigate to the page</li>
    <li>Measure Web Vitals under throttled conditions</li>
    <li>Capture a trace to see what's slow on constrained hardware</li>
  </ol>

  <p>
    Network presets: <code>3G</code> (563ms latency, 188KB/s down),
    <code>4G</code> (170ms, 500KB/s), <code>WiFi</code> (2ms, 3.75MB/s).
  </p>

  <h2 id="tool-id-flow">Tool ID Flow</h2>

  <p>Some tools produce IDs consumed by downstream tools:</p>

  <Mermaid
    code={`flowchart LR
    HS[pen_heap_snapshot] -->|snapshot ID| HD[pen_heap_diff]
    LP[pen_list_pages] -->|target ID| SP[pen_select_page]
    NW[pen_network_waterfall] -->|request ID| NR[pen_network_request]
    LS[pen_list_sources] -->|script ID| SC[pen_source_content]
    LS -->|script ID| SS[pen_search_source]
    CT[pen_capture_trace] -->|trace path| TI[pen_trace_insights]`}
  />

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Producer</th><th>ID Type</th><th>Consumer</th></tr></thead>
      <tbody>
        <tr><td><code>pen_heap_snapshot</code></td><td>snapshot ID</td><td><code>pen_heap_diff</code></td></tr>
        <tr><td><code>pen_list_pages</code></td><td>target ID</td><td><code>pen_select_page</code></td></tr>
        <tr><td><code>pen_network_waterfall</code></td><td>request ID</td><td><code>pen_network_request</code></td></tr>
        <tr><td><code>pen_list_sources</code></td><td>script ID</td><td><code>pen_source_content</code>, <code>pen_search_source</code></td></tr>
        <tr><td><code>pen_capture_trace</code></td><td>trace path</td><td><code>pen_trace_insights</code></td></tr>
      </tbody>
    </table>
  </div>

  <p>
    IDs are opaque strings (or file paths for traces). They stay valid until PEN
    restarts or the thing they reference goes away (tab closed, page navigated,
    etc.).
  </p>
</DocPage>
