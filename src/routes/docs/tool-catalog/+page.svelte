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
  <h1>Tool Reference</h1>

  <p>
    PEN ships with 30 tools in 9 categories. Every tool follows MCP
    conventions: auto-generated <code>inputSchema</code> from Go structs, text
    output, and <code>isError: true</code> on failure.
  </p>

  <!-- ─── Memory ─── -->
  <h2 id="memory-4-tools">Memory (4 tools)</h2>

  <h3 id="pen_heap_snapshot"><code>pen_heap_snapshot</code></h3>
  <p>Take a V8 heap snapshot. Streamed to disk, so even massive heaps won't blow up memory.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>forceGC</code></td><td>bool</td><td>true</td><td>Force GC before snapshot</td></tr>
        <tr><td><code>includeDOM</code></td><td>bool</td><td>false</td><td>Include detached DOM node analysis</td></tr>
        <tr><td><code>maxDepth</code></td><td>int</td><td>3</td><td>Retained size analysis depth (1–10)</td></tr>
      </tbody>
    </table>
  </div>
  <p>CDP: <code>HeapProfiler.takeHeapSnapshot</code>, <code>addHeapSnapshotChunk</code> events. Exclusive lock. Rate limit: <strong>10s cooldown</strong>.</p>

  <h3 id="pen_heap_diff"><code>pen_heap_diff</code></h3>
  <p>Compare two snapshots to spot memory growth. Shows new objects, grown objects, and total delta.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>snapshotA</code></td><td>string</td><td>yes</td><td>ID of first snapshot</td></tr>
        <tr><td><code>snapshotB</code></td><td>string</td><td>yes</td><td>ID of second snapshot</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="pen_heap_track"><code>pen_heap_track</code></h3>
  <p>Toggle heap allocation tracking for leak detection over time.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>action</code></td><td>string</td><td>—</td><td><code>"start"</code> or <code>"stop"</code></td></tr>
        <tr><td><code>trackAllocations</code></td><td>bool</td><td>true</td><td>Track allocation stacks</td></tr>
      </tbody>
    </table>
  </div>
  <p>CDP: <code>HeapProfiler.startTrackingHeapObjects</code> / <code>stopTrackingHeapObjects</code>.</p>

  <h3 id="pen_heap_sampling"><code>pen_heap_sampling</code></h3>
  <p>Toggle sampling-based heap profiling. Lower overhead than full snapshots.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>action</code></td><td>string</td><td>—</td><td><code>"start"</code> or <code>"stop"</code></td></tr>
        <tr><td><code>samplingInterval</code></td><td>int</td><td>32768</td><td>Bytes between samples</td></tr>
      </tbody>
    </table>
  </div>
  <p>CDP: <code>HeapProfiler.startSampling</code> / <code>stopSampling</code> / <code>getSamplingProfile</code>.</p>

  <hr />

  <!-- ─── CPU ─── -->
  <h2 id="cpu-3-tools">CPU (3 tools)</h2>

  <h3 id="pen_cpu_profile"><code>pen_cpu_profile</code></h3>
  <p>Record a CPU profile and surface the hottest functions.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>duration</code></td><td>int</td><td>5</td><td>Seconds to profile (1–30)</td></tr>
        <tr><td><code>sampleRate</code></td><td>int</td><td>100</td><td>Sampling interval in microseconds (min 10)</td></tr>
        <tr><td><code>topN</code></td><td>int</td><td>20</td><td>Number of top hotspot functions</td></tr>
      </tbody>
    </table>
  </div>
  <p>CDP: <code>Profiler.start</code> / <code>stop</code>. Exclusive lock.</p>

  <h3 id="pen_capture_trace"><code>pen_capture_trace</code></h3>
  <p>Grab a Chrome trace (DevTools Timeline). Streamed to disk via <code>IO.read</code>.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>duration</code></td><td>int</td><td>5</td><td>Seconds to trace (1–30)</td></tr>
        <tr><td><code>categories</code></td><td>[]string</td><td>—</td><td>Chrome trace categories</td></tr>
      </tbody>
    </table>
  </div>
  <p>
    Default categories: <code>devtools.timeline</code>, <code>v8.execute</code>,
    <code>blink.user_timing</code>, <code>loading</code>,
    <code>latencyInfo</code>,
    <code>disabled-by-default-devtools.timeline</code>. Exclusive lock. Rate
    limit: <strong>5s cooldown</strong>.
  </p>

  <h3 id="pen_trace_insights"><code>pen_trace_insights</code></h3>
  <p>Crunch a previously captured trace file. Pulls out long tasks (&gt;50ms), CLS, LCP, slowest resources, and frame timing.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>file</code></td><td>string</td><td>—</td><td>Path to trace JSON file (from <code>pen_capture_trace</code>)</td></tr>
        <tr><td><code>topN</code></td><td>int</td><td>10</td><td>Number of top items per category</td></tr>
      </tbody>
    </table>
  </div>
  <p>Max file size: 100 MB. Supports both <code>{"{"}"traceEvents":[...]}</code> wrapper and plain array formats.</p>

  <hr />

  <!-- ─── Network ─── -->
  <h2 id="network-4-tools">Network (4 tools)</h2>

  <h3 id="pen_network_enable"><code>pen_network_enable</code></h3>
  <p>Start capturing network requests.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>disableCache</code></td><td>bool</td><td>true</td><td>Disable browser cache</td></tr>
        <tr><td><code>clearFirst</code></td><td>bool</td><td>true</td><td>Clear previously captured data</td></tr>
      </tbody>
    </table>
  </div>
  <p>CDP: <code>Network.enable</code>.</p>

  <h3 id="pen_network_waterfall"><code>pen_network_waterfall</code></h3>
  <p>Show captured network requests as a waterfall table.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>sortBy</code></td><td>string</td><td><code>"time"</code></td><td>Sort: <code>time</code>, <code>size</code>, <code>status</code>, <code>duration</code></td></tr>
        <tr><td><code>filter</code></td><td>string</td><td>—</td><td>Filter by MIME type prefix</td></tr>
        <tr><td><code>limit</code></td><td>int</td><td>50</td><td>Max entries</td></tr>
      </tbody>
    </table>
  </div>
  <p>Large assets flagged at <strong>100 KB</strong> threshold.</p>

  <h3 id="pen_network_request"><code>pen_network_request</code></h3>
  <p>Get details of a specific captured network request.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>urlPattern</code></td><td>string</td><td>URL substring to match</td></tr>
        <tr><td><code>requestID</code></td><td>string</td><td>Exact request ID from waterfall</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="pen_network_blocking"><code>pen_network_blocking</code></h3>
  <p>Identify render-blocking resources. No parameters. Returns synchronous scripts and blocking stylesheets.</p>

  <hr />

  <!-- ─── Coverage ─── -->
  <h2 id="coverage-2-tools">Coverage (2 tools)</h2>

  <h3 id="pen_js_coverage"><code>pen_js_coverage</code></h3>
  <p>Collect JavaScript code coverage: per-function byte ranges, used vs unused percentages.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>callCount</code></td><td>bool</td><td>true</td><td>Include per-function call counts</td></tr>
        <tr><td><code>detailed</code></td><td>bool</td><td>false</td><td>Block-level coverage granularity</td></tr>
        <tr><td><code>navigate</code></td><td>string</td><td>—</td><td>URL to navigate to before collecting</td></tr>
        <tr><td><code>topN</code></td><td>int</td><td>20</td><td>Top N scripts by unused bytes</td></tr>
      </tbody>
    </table>
  </div>
  <p>CDP: <code>Profiler.startPreciseCoverage</code> / <code>stopPreciseCoverage</code>.</p>

  <h3 id="pen_css_coverage"><code>pen_css_coverage</code></h3>
  <p>Collect CSS rule usage: which rules were applied vs unused.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>navigate</code></td><td>string</td><td>—</td><td>URL to navigate to for full-page CSS</td></tr>
        <tr><td><code>topN</code></td><td>int</td><td>20</td><td>Top N stylesheets by unused rules</td></tr>
      </tbody>
    </table>
  </div>
  <p>CDP: <code>CSS.startRuleUsageTracking</code> / <code>stopRuleUsageTracking</code>.</p>

  <hr />

  <!-- ─── Audit ─── -->
  <h2 id="audit-3-tools">Audit (3 tools)</h2>

  <h3 id="pen_performance_metrics"><code>pen_performance_metrics</code></h3>
  <p>Grab real-time performance counters (instant, no profiling needed). No parameters.</p>
  <p>CDP: <code>Performance.getMetrics</code>. Returns JSHeapUsedSize, Nodes, LayoutCount, RecalcStyleCount, ScriptDuration, TaskDuration, etc.</p>

  <h3 id="pen_web_vitals"><code>pen_web_vitals</code></h3>
  <p>Capture Core Web Vitals (LCP, CLS, INP estimate).</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>waitForLCP</code></td><td>bool</td><td>true</td><td>Wait for LCP to stabilize</td></tr>
      </tbody>
    </table>
  </div>
  <p>CDP: <code>Runtime.evaluate</code> with PerformanceObserver entries.</p>

  <h3 id="pen_accessibility_check"><code>pen_accessibility_check</code></h3>
  <p>Quick accessibility sweep: missing alt text, unlabeled inputs, contrast problems, ARIA violations.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>selector</code></td><td>string</td><td>CSS selector to scope (default: entire page)</td></tr>
      </tbody>
    </table>
  </div>
  <p>CDP: <code>DOM</code>, <code>Runtime</code>.</p>

  <hr />

  <!-- ─── Source ─── -->
  <h2 id="source-3-tools">Source (3 tools)</h2>

  <h3 id="pen_list_sources"><code>pen_list_sources</code></h3>
  <p>List every parsed JS source in the page.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>refresh</code></td><td>bool</td><td>false</td><td>Re-enable debugger for fresh list</td></tr>
        <tr><td><code>filter</code></td><td>string</td><td>—</td><td>Filter by URL substring</td></tr>
      </tbody>
    </table>
  </div>
  <p>CDP: <code>Debugger.enable</code>, <code>scriptParsed</code> events. Reports source map URLs as metadata (does not fetch or parse source maps).</p>

  <h3 id="pen_source_content"><code>pen_source_content</code></h3>
  <p>Fetch the source of a specific script.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>scriptID</code></td><td>string</td><td>—</td><td>Script ID from <code>pen_list_sources</code></td></tr>
        <tr><td><code>urlPattern</code></td><td>string</td><td>—</td><td>URL substring (first match)</td></tr>
        <tr><td><code>maxLines</code></td><td>int</td><td>200</td><td>Truncate after N lines</td></tr>
      </tbody>
    </table>
  </div>
  <p>CDP: <code>Debugger.getScriptSource</code>. You get the code as V8 sees it — bundled or minified if that's what's loaded.</p>

  <h3 id="pen_search_source"><code>pen_search_source</code></h3>
  <p>Search across all loaded scripts for a string or regex pattern.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>query</code></td><td>string</td><td>—</td><td>Search query (required)</td></tr>
        <tr><td><code>isRegex</code></td><td>bool</td><td>false</td><td>Treat query as regex</td></tr>
        <tr><td><code>caseSensitive</code></td><td>bool</td><td>false</td><td>Case-sensitive search</td></tr>
        <tr><td><code>maxResults</code></td><td>int</td><td>50</td><td>Max results across scripts</td></tr>
      </tbody>
    </table>
  </div>
  <p>CDP: <code>Debugger.searchInContent</code>.</p>

  <hr />

  <!-- ─── Console ─── -->
  <h2 id="console-2-tools">Console (2 tools)</h2>

  <h3 id="pen_console_enable"><code>pen_console_enable</code></h3>
  <p>Start capturing console output and exceptions. Call this before <code>pen_console_messages</code>.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>clearFirst</code></td><td>bool</td><td>false</td><td>Clear existing messages before starting</td></tr>
      </tbody>
    </table>
  </div>
  <p>
    CDP: <code>Runtime.enable</code>. Registers listeners for
    <code>Runtime.consoleAPICalled</code> and
    <code>Runtime.exceptionThrown</code> events. Idempotent — safe to call
    multiple times (uses <code>consoleListenerOnce</code>).
  </p>

  <h3 id="pen_console_messages"><code>pen_console_messages</code></h3>
  <p>List captured console messages with level, text, source URL, and timestamp.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>level</code></td><td>string</td><td>—</td><td>Filter: <code>error</code>, <code>warning</code>, <code>log</code>, <code>info</code>, <code>debug</code></td></tr>
        <tr><td><code>last</code></td><td>int</td><td>all</td><td>Return only the N most recent messages (max 200)</td></tr>
        <tr><td><code>clear</code></td><td>bool</td><td>false</td><td>Clear messages after reading</td></tr>
      </tbody>
    </table>
  </div>
  <p>
    Buffers up to <strong>1,000 messages</strong>. When full, the oldest 100
    entries are evicted. Text truncated at 2,000 characters. Stack traces
    included for errors.
  </p>

  <hr />

  <!-- ─── Lighthouse ─── -->
  <h2 id="lighthouse-1-tool">Lighthouse (1 tool)</h2>

  <h3 id="pen_lighthouse"><code>pen_lighthouse</code></h3>
  <p>Run a full Lighthouse audit. Needs the Lighthouse CLI (<code>npm install -g lighthouse</code>).</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>categories</code></td><td>[]string</td><td><code>["performance","accessibility","best-practices","seo"]</code></td><td>Categories to audit</td></tr>
        <tr><td><code>url</code></td><td>string</td><td>current page</td><td>URL to audit</td></tr>
      </tbody>
    </table>
  </div>
  <p>
    Allowed categories: <code>performance</code>,
    <code>accessibility</code>, <code>best-practices</code>,
    <code>seo</code>, <code>pwa</code>. Lighthouse connects to Chrome through
    the same CDP port PEN uses — no extra browser.
  </p>

  <hr />

  <!-- ─── Utility ─── -->
  <h2 id="utility-8-tools">Utility (8 tools)</h2>

  <h3 id="pen_status"><code>pen_status</code></h3>
  <p>Show PEN server status. No parameters. Returns connection state, version, active target, and config.</p>

  <h3 id="pen_list_pages"><code>pen_list_pages</code></h3>
  <p>List all open browser tabs with URLs, titles, and target IDs. No parameters.</p>

  <h3 id="pen_select_page"><code>pen_select_page</code></h3>
  <p>Point PEN at a different tab.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>targetId</code></td><td>string</td><td>Target ID from <code>pen_list_pages</code></td></tr>
        <tr><td><code>urlPattern</code></td><td>string</td><td>URL substring to match</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="pen_navigate"><code>pen_navigate</code></h3>
  <p>Navigate the current page: go to a URL, back, forward, or reload.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>action</code></td><td>string</td><td>—</td><td><code>goto</code>, <code>back</code>, <code>forward</code>, or <code>reload</code> (required)</td></tr>
        <tr><td><code>url</code></td><td>string</td><td>—</td><td>URL (required when action is <code>goto</code>)</td></tr>
        <tr><td><code>wait</code></td><td>int</td><td>2</td><td>Seconds to wait after navigation (0–30)</td></tr>
      </tbody>
    </table>
  </div>
  <p>
    URL validation blocks dangerous schemes (<code>javascript:</code>,
    <code>data:</code>, <code>file:</code>, <code>chrome:</code>,
    <code>about:</code>, <code>ftp:</code>, <code>ws:</code>,
    <code>wss:</code>, <code>blob:</code>, <code>vbscript:</code>). Only HTTP
    and HTTPS get through. Forward navigation uses
    <code>Page.getNavigationHistory</code> +
    <code>Page.navigateToHistoryEntry</code>.
  </p>

  <h3 id="pen_collect_garbage"><code>pen_collect_garbage</code></h3>
  <p>Force V8 garbage collection. No parameters. Rate limit: <strong>5s cooldown</strong>.</p>

  <h3 id="pen_screenshot"><code>pen_screenshot</code></h3>
  <p>Snap a screenshot of the current page or a specific element.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>selector</code></td><td>string</td><td>—</td><td>CSS selector for element capture</td></tr>
        <tr><td><code>fullPage</code></td><td>bool</td><td>false</td><td>Full page capture</td></tr>
        <tr><td><code>format</code></td><td>string</td><td><code>"png"</code></td><td><code>png</code>, <code>jpeg</code>, or <code>webp</code></td></tr>
        <tr><td><code>quality</code></td><td>int</td><td>—</td><td>0–100 for jpeg/webp</td></tr>
      </tbody>
    </table>
  </div>
  <p>Returns base64-encoded image in <code>mcp.ImageContent</code>.</p>

  <h3 id="pen_emulate"><code>pen_emulate</code></h3>
  <p>Set device emulation: CPU throttling, network throttling, viewport presets.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>device</code></td><td>string</td><td>Preset: <code>iPhone 14</code>, <code>Pixel 7</code>, <code>iPad</code></td></tr>
        <tr><td><code>cpuThrottling</code></td><td>float64</td><td>CPU slowdown factor (e.g., 4 = 4x slower)</td></tr>
        <tr><td><code>networkThrottling</code></td><td>string</td><td><code>3G</code>, <code>4G</code>, or <code>WiFi</code></td></tr>
      </tbody>
    </table>
  </div>
  <p>Network presets: 3G (563ms latency, 188KB/s), 4G (170ms, 500KB/s), WiFi (2ms, 3.75MB/s).</p>

  <h3 id="pen_evaluate"><code>pen_evaluate</code></h3>
  <p>Run JavaScript in the page context. <strong>Requires the <code>--allow-eval</code> flag.</strong></p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>expression</code></td><td>string</td><td>—</td><td>JS expression (required)</td></tr>
        <tr><td><code>returnByValue</code></td><td>bool</td><td>true</td><td>Return result by value</td></tr>
      </tbody>
    </table>
  </div>
  <p>
    Gated by <code>--allow-eval</code> flag and an expression blocklist. See
    <a href="/docs/security" data-sveltekit-preload-data="hover">Security</a>.
  </p>

  <hr />

  <!-- ─── Rate Limits ─── -->
  <h2 id="rate-limits">Rate Limits</h2>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Tool</th><th>Cooldown</th><th>Reason</th></tr></thead>
      <tbody>
        <tr><td><code>pen_heap_snapshot</code></td><td>10s</td><td>Heavy GC + disk I/O</td></tr>
        <tr><td><code>pen_capture_trace</code></td><td>5s</td><td>Exclusive Tracing domain</td></tr>
        <tr><td><code>pen_collect_garbage</code></td><td>5s</td><td>V8 GC is expensive</td></tr>
      </tbody>
    </table>
  </div>

  <p>All other tools: no cooldown.</p>

  <!-- ─── Tool Chaining ─── -->
  <h2 id="tool-chaining">Tool Chaining</h2>

  <p>Tools produce IDs consumed by downstream tools:</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Producer</th><th>Consumer</th><th>ID Type</th></tr></thead>
      <tbody>
        <tr><td><code>pen_heap_snapshot</code></td><td><code>pen_heap_diff</code></td><td>Snapshot ID</td></tr>
        <tr><td><code>pen_list_pages</code></td><td><code>pen_select_page</code></td><td>Target ID</td></tr>
        <tr><td><code>pen_network_waterfall</code></td><td><code>pen_network_request</code></td><td>Request ID</td></tr>
        <tr><td><code>pen_list_sources</code></td><td><code>pen_source_content</code>, <code>pen_search_source</code></td><td>Script ID</td></tr>
        <tr><td><code>pen_capture_trace</code></td><td><code>pen_trace_insights</code></td><td>Trace File Path</td></tr>
        <tr><td><code>pen_console_enable</code></td><td><code>pen_console_messages</code></td><td>— (implicit)</td></tr>
      </tbody>
    </table>
  </div>

  <p>
    IDs stay valid until PEN restarts or the underlying thing goes away (tab
    closed, page navigated, etc.).
  </p>
</DocPage>
