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
  <h1>CDP Integration</h1>

  <p>
    PEN talks to Chrome through
    <a href="https://github.com/chromedp/chromedp" target="_blank" rel="noopener noreferrer">chromedp</a>
    (v0.13.6), which wraps the Chrome DevTools Protocol over WebSocket.
  </p>

  <h2 id="connection-lifecycle">Connection Lifecycle</h2>

  <p>PEN attaches to a browser that's already running. It never launches one.</p>

  <Mermaid
    code={`sequenceDiagram
    participant PEN as PEN (cdp/client.go)
    participant HTTP as Chrome HTTP Endpoint
    participant WS as Chrome WebSocket

    PEN->>HTTP: GET /json/version
    HTTP-->>PEN: webSocketDebuggerUrl (ws://...)
    PEN->>WS: NewRemoteAllocator(wsURL)
    PEN->>WS: NewContext (create tab context)
    PEN->>WS: Run (no-op to verify connection)
    WS-->>PEN: Connection verified

    alt Connection fails
        loop Up to 3 retries
            Note over PEN: Exponential backoff (500ms start, 10s max)
            PEN->>HTTP: GET /json/version
            PEN->>WS: Retry connection
        end
    end`}
  />

  <h3 id="endpoint-discovery">Endpoint Discovery</h3>

  <p>
    At startup, PEN hits the HTTP endpoint (usually
    <code>http://localhost:9222/json/version</code>) to get the browser's
    WebSocket URL:
  </p>

  <CodeBlock
    lang="go"
    code="func DiscoverEndpoint(ctx context.Context, httpURL string) (string, error)"
  />

  <p>
    This hands back a <code>ws://</code> URL like
    <code>ws://localhost:9222/devtools/browser/...</code> that chromedp uses to
    open the CDP session.
  </p>

  <h3 id="connection">Connection</h3>

  <CodeBlock
    lang="go"
    code={`client := cdp.NewClient("http://localhost:9222", logger)
err := client.Reconnect(ctx, 3) // 3 retries with exponential backoff`}
  />

  <p>
    Under the hood, <code>Connect</code> calls <code>DiscoverEndpoint</code>,
    sets up a <code>chromedp.NewRemoteAllocator</code>, opens a
    <code>chromedp.NewContext</code>, and verifies with a no-op
    <code>chromedp.Run</code>. If that fails, <code>Reconnect</code> retries
    with exponential backoff (500ms start, 10s cap).
  </p>

  <h3 id="chromedp-remote-allocator">chromedp Remote Allocator</h3>

  <p>PEN uses chromedp's remote allocator (not its default browser-launching mode):</p>

  <CodeBlock
    lang="go"
    code={`allocCtx, cancel := chromedp.NewRemoteAllocator(ctx, wsURL)
tabCtx, cancel := chromedp.NewContext(allocCtx)
chromedp.Run(tabCtx) // no-op to verify connection`}
  />

  <p>
    This connects to an existing browser instead of spawning one. The allocator
    context owns the WebSocket; tab contexts own individual pages.
  </p>

  <h3 id="cleanup">Cleanup</h3>

  <p>
    <code>client.Close()</code> cancels the tab and allocator contexts. Called
    via <code>defer</code> in <code>main.go</code>. chromedp's context tree
    cascades the cleanup — killing the allocator kills all child tabs.
  </p>

  <h2 id="event-listening">Event Listening</h2>

  <p>
    PEN registers CDP event listeners through a thin wrapper over
    <code>chromedp.ListenTarget</code>:
  </p>

  <CodeBlock
    lang="go"
    code={`func (c *Client) Listen(handler func(ev interface{})) (context.CancelFunc, error)`}
  />

  <p>
    Tool handlers type-switch on events. For instance, heap snapshot streaming
    catches <code>heapProfiler.AddHeapSnapshotChunk</code> events and writes
    each chunk straight to a temp file.
  </p>

  <p>The listener pattern from chromedp:</p>

  <CodeBlock
    lang="go"
    code={`chromedp.ListenTarget(ctx, func(ev interface{}) {
    switch ev := ev.(type) {
    case *runtime.EventConsoleAPICalled:
        // handle console message
    case *runtime.EventExceptionThrown:
        // handle exception
    case *heapprofiler.EventAddHeapSnapshotChunk:
        // write chunk to temp file
    }
})`}
  />

  <h2 id="tab-management">Tab Management</h2>

  <h3>Listing Targets</h3>

  <CodeBlock lang="go" code="targets, err := client.ListTargets(ctx)" />

  <p>
    Returns <code>[]TargetInfo</code> with ID, type, title, and URL for each
    target. Powers <code>pen_list_pages</code>.
  </p>

  <h3>Switching Targets</h3>

  <CodeBlock
    lang="go"
    code="tabCtx, cancel, err := client.SelectTarget(ctx, targetID)"
  />

  <p>
    Creates a new <code>chromedp.NewContext</code> with
    <code>chromedp.WithTargetID</code>, checks it's reachable, and updates the
    active context. Powers <code>pen_select_page</code>.
  </p>

  <h3>Finding by URL</h3>

  <CodeBlock
    lang="go"
    code="target, err := client.FindTargetByURL(ctx, urlPattern)"
  />

  <p>
    Finds a target by URL substring. Used internally when a tool takes
    <code>urlPattern</code> instead of <code>targetId</code>.
  </p>

  <h2 id="cdp-domains-used">CDP Domains Used</h2>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Domain</th><th>Tools</th><th>Exclusive?</th></tr></thead>
      <tbody>
        <tr><td>HeapProfiler</td><td><code>pen_heap_snapshot</code>, <code>pen_heap_diff</code>, <code>pen_heap_track</code>, <code>pen_heap_sampling</code>, <code>pen_collect_garbage</code></td><td>Yes</td></tr>
        <tr><td>Profiler</td><td><code>pen_cpu_profile</code>, <code>pen_js_coverage</code></td><td>Yes</td></tr>
        <tr><td>Tracing</td><td><code>pen_capture_trace</code></td><td>Yes</td></tr>
        <tr><td>CSS</td><td><code>pen_css_coverage</code></td><td>Yes</td></tr>
        <tr><td>Lighthouse</td><td><code>pen_lighthouse</code></td><td>Yes</td></tr>
        <tr><td>Performance</td><td><code>pen_performance_metrics</code></td><td>No</td></tr>
        <tr><td>Network</td><td><code>pen_network_enable</code>, <code>pen_network_waterfall</code>, <code>pen_network_request</code>, <code>pen_network_blocking</code></td><td>No</td></tr>
        <tr><td>Page</td><td><code>pen_screenshot</code>, <code>pen_navigate</code></td><td>No</td></tr>
        <tr><td>Runtime</td><td><code>pen_evaluate</code>, <code>pen_web_vitals</code>, <code>pen_console_enable</code>, <code>pen_console_messages</code></td><td>No</td></tr>
        <tr><td>Emulation</td><td><code>pen_emulate</code> (CPU throttling, network conditions)</td><td>No</td></tr>
        <tr><td>Debugger</td><td><code>pen_list_sources</code>, <code>pen_source_content</code>, <code>pen_search_source</code></td><td>No</td></tr>
        <tr><td>IO</td><td>Trace streaming (<code>pen_capture_trace</code> uses <code>IO.read</code>/<code>IO.close</code>)</td><td>No</td></tr>
        <tr><td>DOM</td><td><code>pen_accessibility_check</code></td><td>No</td></tr>
      </tbody>
    </table>
  </div>

  <p>
    "Exclusive" means PEN holds an <code>OperationLock</code> so two tools can't
    fight over the same domain. If a second tool tries, it gets an immediate
    error explaining the conflict.
  </p>

  <h2 id="network-event-handling">Network Event Handling</h2>

  <p>PEN listens to four network event types from the Network CDP domain:</p>

  <ul>
    <li><code>Network.requestWillBeSent</code> — request initiated</li>
    <li><code>Network.responseReceived</code> — response headers received</li>
    <li><code>Network.loadingFinished</code> — request completed successfully</li>
    <li><code>Network.loadingFailed</code> — request failed</li>
  </ul>

  <p>
    These are stored in an in-memory map keyed by request ID, used by
    <code>pen_network_waterfall</code> and <code>pen_network_request</code>.
  </p>

  <h2 id="devtools-coexistence">DevTools Coexistence</h2>

  <p>
    Chrome handles multiple CDP clients on one WebSocket. PEN can run alongside
    open DevTools, but watch out:
  </p>

  <ul>
    <li>Only one client can control the Tracing domain at a time</li>
    <li>HeapProfiler operations may conflict with DevTools Memory panel usage</li>
    <li>This is a Chrome limitation, not a PEN limitation</li>
  </ul>

  <p>
    PEN's internal locks prevent its own tools from colliding. External conflicts
    (e.g., DevTools Memory panel vs. PEN) show up as CDP errors, which PEN
    passes back to the LLM.
  </p>
</DocPage>
