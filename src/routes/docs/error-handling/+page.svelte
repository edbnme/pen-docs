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
  <h1>Error Handling &amp; Edge Cases</h1>

  <p>How PEN deals with failures across CDP, MCP, and browser interactions.</p>

  <Mermaid
    code={`flowchart TD
    ToolCall[LLM calls a tool] --> RateCheck{Rate limit OK?}
    RateCheck -->|No| RateErr[Error: cooldown active, returns wait time]
    RateCheck -->|Yes| LockCheck{Domain lock available?}
    LockCheck -->|No| LockErr[Error: domain in use by another operation]
    LockCheck -->|Yes| CDPCheck{CDP connected?}
    CDPCheck -->|No| CDPErr[Error: not connected, suggest starting Chrome]
    CDPCheck -->|Yes| Execute[Execute CDP operation]
    Execute --> Success{Success?}
    Success -->|Yes| Format[Format result + release lock]
    Success -->|No| TabGone{Target disappeared?}
    TabGone -->|Yes| TabErr[Error: target invalid, suggest pen_list_pages]
    TabGone -->|No| ChromeErr[Error: CDP error details with recovery suggestion]`}
  />

  <h2 id="cdp-connection-errors">CDP Connection Errors</h2>

  <h3>Browser Not Running</h3>

  <p>If PEN can't reach <code>--remote-debugging-port</code>:</p>

  <CodeBlock
    lang="text"
    code={`pen: cannot reach Chrome at ws://127.0.0.1:9222
Start Chrome with: chrome --remote-debugging-port=9222`}
  />

  <p>
    <strong>What happens:</strong> <code>chromedp.NewRemoteAllocator</code>
    fails → PEN exits with a non-zero code before the MCP server even starts.
  </p>

  <h3>Browser Disconnects Mid-Session</h3>

  <p>If Chrome dies while PEN is running:</p>

  <ol>
    <li>The WebSocket drops</li>
    <li>CDP calls come back with <code>context.Canceled</code></li>
    <li>PEN wraps the error and sends it to the LLM</li>
    <li>PEN itself stays up — it doesn't crash</li>
  </ol>

  <p>The LLM can tell the user to restart Chrome.</p>

  <h3>Target Disappears</h3>

  <p>If a tab gets closed while a tool is working on it:</p>

  <ul>
    <li>The active CDP context goes stale</li>
    <li>CDP calls on that target start failing</li>
    <li>
      <code>pen_list_pages</code> still works (it queries the browser, not a specific
      tab)
    </li>
    <li>
      The LLM should call <code>pen_list_pages</code> →
      <code>pen_select_page</code> to pick a live target
    </li>
  </ul>

  <h2 id="network-resource-errors">Network &amp; Resource Errors</h2>

  <h3>Large Payloads</h3>

  <p>
    Network response bodies can be big. Here's how PEN handles the edge cases:
  </p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Scenario</th><th>Handling</th></tr></thead>
      <tbody>
        <tr
          ><td>Response body &gt; limit</td><td
            >Truncated with <code>[truncated at N bytes]</code> suffix</td
          ></tr
        >
        <tr
          ><td>Binary response</td><td
            >Not captured (only text-based MIME types)</td
          ></tr
        >
        <tr><td>Streaming response</td><td>Captured when complete</td></tr>
        <tr
          ><td>No response (canceled)</td><td
            >Marked as <code>(canceled)</code> in waterfall</td
          ></tr
        >
      </tbody>
    </table>
  </div>

  <h3>Source Map Failures</h3>

  <p><code>pen_source_content</code> may hit missing or busted source maps:</p>

  <ul>
    <li>
      <strong>Missing source map</strong>: PEN serves the minified source as-is
    </li>
    <li>
      <strong>Bad source map URL</strong>: Logged, skipped, minified source
      returned
    </li>
    <li>
      <strong>Cross-origin source map</strong>: Can't fetch via CDP; minified
      source returned
    </li>
  </ul>

  <p>PEN doesn't blow up on source map problems — it degrades gracefully.</p>

  <h2 id="mcp-protocol-errors">MCP Protocol Errors</h2>

  <h3>Invalid Parameters</h3>

  <p>If the LLM sends bad parameters (wrong type, missing required field):</p>

  <ul>
    <li>The SDK validates against the JSON Schema</li>
    <li>Returns MCP error code <code>-32602</code> (Invalid params)</li>
    <li>PEN handlers also validate and return descriptive errors</li>
  </ul>

  <h3>Unknown Tool</h3>

  <p>If the LLM calls a tool that doesn't exist:</p>

  <ul>
    <li>The SDK returns code <code>-32601</code> (Method not found)</li>
    <li>PEN code isn't involved</li>
  </ul>

  <h2 id="concurrent-tool-calls">Concurrent Tool Calls</h2>

  <p>
    MCP allows concurrent tool calls. PEN handles this with <code
      >OperationLock</code
    >:
  </p>

  <CodeBlock
    lang="go"
    code={`type OperationLock struct {
    mu    sync.Mutex
    locks map[string]struct{} // domain → lock
}`}
  />

  <p>
    Locks are keyed by CDP domain — tools that use different domains can run in
    parallel. If two tools need the same exclusive domain at once:
  </p>

  <ol>
    <li>The first caller acquires the domain lock</li>
    <li>
      The second caller gets an immediate error: <em
        >"HeapProfiler is already in use by another operation. Wait for the
        current heap snapshot to finish, or call another tool in the meantime."</em
      >
    </li>
    <li>
      The error is returned as a <code>CallToolResult</code>, not an MCP
      protocol error
    </li>
  </ol>

  <p>Exclusive domains and their tools:</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Domain</th><th>Tools</th></tr></thead>
      <tbody>
        <tr
          ><td><code>HeapProfiler</code></td><td
            ><code>pen_heap_snapshot</code></td
          ></tr
        >
        <tr
          ><td><code>HeapProfiler.tracking</code></td><td
            ><code>pen_heap_track</code></td
          ></tr
        >
        <tr
          ><td><code>Profiler</code></td><td
            ><code>pen_cpu_profile</code>, <code>pen_js_coverage</code></td
          ></tr
        >
        <tr
          ><td><code>Tracing</code></td><td><code>pen_capture_trace</code></td
          ></tr
        >
        <tr><td><code>CSS</code></td><td><code>pen_css_coverage</code></td></tr>
        <tr
          ><td><code>Lighthouse</code></td><td><code>pen_lighthouse</code></td
          ></tr
        >
      </tbody>
    </table>
  </div>

  <p>
    Tools that <strong>don't</strong> need a lock:
    <code>pen_console_messages</code>, <code>pen_list_pages</code>,
    <code>pen_select_page</code>, <code>pen_screenshot</code>,
    <code>pen_network_waterfall</code>, <code>pen_performance_metrics</code>,
    <code>pen_web_vitals</code>, <code>pen_accessibility_check</code>,
    <code>pen_status</code>.
  </p>

  <h2 id="rate-limiting">Rate Limiting</h2>

  <p>PEN applies per-tool cooldown-based rate limiting:</p>

  <CodeBlock
    lang="go"
    code={`type RateLimiter struct {
    mu        sync.Mutex
    lastCalls map[string]time.Time
    cooldowns map[string]time.Duration
}`}
  />

  <p>Each rate-limited tool has a minimum gap between calls:</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Tool</th><th>Cooldown</th></tr></thead>
      <tbody>
        <tr><td><code>pen_heap_snapshot</code></td><td>10s</td></tr>
        <tr><td><code>pen_capture_trace</code></td><td>5s</td></tr>
        <tr><td><code>pen_collect_garbage</code></td><td>5s</td></tr>
      </tbody>
    </table>
  </div>

  <p>
    When a call lands inside the cooldown window, <code>Check</code> returns an
    error with the remaining wait time (e.g.,
    <em>"pen_heap_snapshot has a 10s cooldown. Try again in 6s"</em>).
    Everything else has no cooldown.
  </p>

  <p>
    Rate limits exist to stop runaway LLM loops from hammering expensive
    operations.
  </p>

  <h2 id="input-validation">Input Validation</h2>

  <p>All tool inputs are validated at the boundary:</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Check</th><th>Scope</th><th>Example</th></tr></thead>
      <tbody>
        <tr
          ><td>URL scheme</td><td><code>pen_navigate</code></td><td
            >Only <code>http://</code>, <code>https://</code> allowed</td
          ></tr
        >
        <tr
          ><td>Path traversal</td><td><code>pen_source_content</code></td><td
            >No <code>../</code> sequences</td
          ></tr
        >
        <tr
          ><td>Integer bounds</td><td>Various</td><td
            ><code>topN</code> must be &gt; 0</td
          ></tr
        >
        <tr
          ><td>String length</td><td>Various</td><td
            >URLs capped at 2048 chars</td
          ></tr
        >
        <tr
          ><td>Required fields</td><td>All tools</td><td
            >Schema-enforced by MCP SDK</td
          ></tr
        >
      </tbody>
    </table>
  </div>

  <p>
    Validation functions live in <code>internal/security/validate.go</code>.
  </p>

  <h2 id="heap-profiling-edge-cases">Heap Profiling Edge Cases</h2>

  <h3>Snapshot During Navigation</h3>

  <p>If <code>pen_heap_snapshot</code> fires during a page navigation:</p>

  <ul>
    <li>The snapshot might catch a half-built heap</li>
    <li>PEN doesn't prevent this — you get whatever state the heap is in</li>
    <li>For clean snapshots, wait for navigation to finish</li>
  </ul>

  <h3>Diffing Mismatched Snapshots</h3>

  <p><code>pen_heap_diff</code> compares two snapshot IDs. Some edge cases:</p>

  <ul>
    <li><strong>Same snapshot twice</strong>: Returns zero changes</li>
    <li><strong>Bad snapshot ID</strong>: Returns an error</li>
    <li>
      <strong>Snapshot from a different page</strong>: Works, but the diff
      probably won't mean much
    </li>
  </ul>

  <h2 id="lighthouse-edge-cases">Lighthouse Edge Cases</h2>

  <h3>Lighthouse Caching</h3>

  <p><code>pen_lighthouse</code> runs Lighthouse via the CLI. Keep in mind:</p>

  <ul>
    <li>First run can be slow (cold cache)</li>
    <li>Scores fluctuate between runs (network jitter, CPU load)</li>
    <li>PEN returns raw scores, no averaging</li>
  </ul>

  <h3>Page Requires Authentication</h3>

  <p>If the page needs a login:</p>

  <ul>
    <li>Lighthouse navigates fresh, losing the session</li>
    <li>You'll get scores for the login redirect, not the actual page</li>
    <li>Make sure the user is already logged in and on the right page</li>
  </ul>

  <h2 id="console-buffer">Console Buffer</h2>

  <p><code>pen_console_messages</code> keeps messages in memory:</p>

  <ul>
    <li>Messages pile up from page load onward</li>
    <li>The <code>last</code> param caps how many come back (max 200)</li>
    <li>Use <code>clear=true</code> to flush the buffer</li>
    <li>Noisy pages (thousands of logs) can eat memory</li>
  </ul>

  <h2 id="trace-collection-edge-cases">Trace Collection Edge Cases</h2>

  <h3>Trace File Size</h3>

  <p>Trace files land in the temp directory:</p>

  <ul>
    <li>Small pages: 1–5 MB</li>
    <li>Complex SPAs: 10–50 MB</li>
    <li>Long recordings: 100+ MB is possible</li>
  </ul>

  <p>
    <code>pen_capture_trace</code> takes a <code>duration</code> param (default: 5s).
    Keep it short for sane file sizes.
  </p>

  <h3>Temp File Cleanup</h3>

  <p>
    Trace files and other temp data live under <code>os.TempDir()/pen/</code>.
    PEN cleans up the temp directory on normal exit via
    <code>defer cleanupTempDir(logger)</code> in <code>main.go</code>.
    Individual handlers also clean up via <code>defer os.Remove(f.Name())</code> after
    processing.
  </p>

  <h2 id="recovery-patterns">Recovery Patterns</h2>

  <p>When something goes wrong, PEN follows these rules:</p>

  <ol>
    <li>
      <strong>Never crash</strong>: PEN stays up. Errors go back as tool
      results.
    </li>
    <li>
      <strong>Be specific</strong>: Say what happened and what to do about it.
    </li>
    <li>
      <strong>Degrade gracefully</strong>: Partial results beat no results
      (truncated payloads, missing source maps, etc.).
    </li>
    <li>
      <strong>Clean up after yourself</strong>: Every operation resets its own
      state, even on failure (<code>defer</code> in Go).
    </li>
    <li>
      <strong>Let the LLM decide</strong>: PEN reports the problem. The LLM
      figures out what's next.
    </li>
  </ol>
</DocPage>
