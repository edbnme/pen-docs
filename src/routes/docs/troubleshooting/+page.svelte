<script lang="ts">
  import DocPage from "$lib/content/DocPage.svelte";
  import CodeBlock from "$lib/content/CodeBlock.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<DocPage
  title={data.title}
  description={data.description}
  slug={data.slug}
  headings={data.headings}
>
  <h1>Troubleshooting</h1>

  <p>Quick fixes for the most common PEN issues.</p>

  <h2 id="connection-issues">Connection Issues</h2>

  <h3 id="browser-not-running-or-wrong-port">
    Browser not running or wrong port
  </h3>

  <p>
    <strong>Symptom:</strong>
    <code>CDP connect failed: connection refused</code>
  </p>

  <p>
    <strong>Fix:</strong> The browser wasn't launched with
    <code>--remote-debugging-port=9222</code>. Kill all browser processes and
    relaunch:
  </p>

  <CodeBlock
    lang="bash"
    code={`# macOS
open -a "Google Chrome" --args --remote-debugging-port=9222

# Windows
& "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222

# Linux
google-chrome --remote-debugging-port=9222`}
  />

  <p>
    Verify: <code>http://localhost:9222/json</code> should return a JSON array. If
    it doesn't, the browser wasn't fully killed before relaunch.
  </p>

  <p>
    <strong>Windows tip:</strong> Open Task Manager (<code>Ctrl+Shift+Esc</code
    >) and end all Chrome/Edge processes before relaunching.
  </p>

  <p>
    <strong>macOS tip:</strong> Run
    <code>killall "Google Chrome"</code> before relaunching.
  </p>

  <h3 id="no-targets-found">No targets found</h3>

  <p><strong>Symptom:</strong> <code>no targets found</code></p>

  <p>
    <strong>Fix:</strong> Open a tab. PEN needs at least one page target to work with.
  </p>

  <h3 id="invalid-cdp-url">Invalid CDP URL</h3>

  <p><strong>Symptom:</strong> <code>invalid CDP URL</code></p>

  <p>
    <strong>Fix:</strong> PEN only talks to localhost (<code>localhost</code>,
    <code>127.0.0.1</code>, <code>::1</code>). For remote browsers, tunnel with
    SSH:
  </p>

  <CodeBlock
    lang="bash"
    code={`ssh -L 9222:localhost:9222 user@remote-server
pen --cdp-url http://localhost:9222`}
  />

  <h3 id="connection-drops-mid-operation">Connection drops mid-operation</h3>

  <p>
    <strong>Symptom:</strong> <code>Browser disconnected during operation</code>
  </p>

  <p>
    <strong>Cause:</strong> Browser crashed or tab closed during a heap snapshot or
    trace.
  </p>

  <p>
    <strong>What PEN does:</strong> Detects the disconnection automatically
    (monitors the browser context for cancellation), marks the connection as
    lost, cleans up partial temp files via
    <code>defer</code>, releases domain locks, and returns <code>isError</code>
    explaining what happened. On the next call, PEN tries to reconnect (up to 3 retries,
    exponential backoff from 1s to 10s).
  </p>

  <h2 id="ide-issues">IDE Issues</h2>

  <h3><code>pen: command not found</code></h3>

  <p>
    <strong>Fix:</strong> The binary isn't on your PATH. Either add it, or use the
    full path in your IDE config:
  </p>

  <CodeBlock
    lang="json"
    code="&quot;command&quot;: &quot;/full/path/to/pen&quot;"
  />

  <h3>IDE doesn't see PEN tools</h3>

  <p>
    <strong>Fix:</strong> Restart your editor. Most IDEs don't hot-reload MCP configs.
  </p>

  <h3>PEN doesn't respond</h3>

  <p>
    <strong>Fix:</strong> Check the MCP output panel. PEN logs to stderr — look for
    connection errors or startup failures there.
  </p>

  <h2 id="tool-specific-issues">Tool-Specific Issues</h2>

  <h3 id="rate-limit-errors">Rate limit errors</h3>

  <p>
    <strong>Symptom:</strong>
    <code>pen_heap_snapshot has a 10s cooldown. Try again in 6s</code>
  </p>

  <p>
    <strong>Fix:</strong> Wait it out. Rate limits prevent resource exhaustion:
  </p>

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

  <h3 id="domain-lock-conflicts">Domain lock conflicts</h3>

  <p>
    <strong>Symptom:</strong>
    <code>HeapProfiler is already in use by HeapProfiler (held for 12s)</code>
  </p>

  <p>
    <strong>Cause:</strong> Two tools tried to use the same exclusive CDP domain
    at once (e.g., <code>pen_cpu_profile</code> while
    <code>pen_capture_trace</code> is still running).
  </p>

  <p>
    <strong>Fix:</strong> Let the first operation finish. The error message
    tells you which tool holds the lock and how long it’s been running. PEN also
    suggests alternative tools you can use in the meantime (e.g.,
    <code>pen_performance_metrics</code> instead of
    <code>pen_cpu_profile</code>). Use <code>pen_status</code> to see all active operations.
  </p>

  <h3 id="lighthouse-not-found">Lighthouse not found</h3>

  <p><strong>Symptom:</strong> <code>lighthouse CLI not found</code></p>

  <p><strong>Fix:</strong> Install Lighthouse globally:</p>

  <CodeBlock lang="bash" code="npm install -g lighthouse" />

  <p>
    Every other PEN tool works without Lighthouse. Only
    <code>pen_lighthouse</code> needs it.
  </p>

  <h3 id="lighthouse-timeout">Lighthouse timeout</h3>

  <p>
    <strong>Symptom:</strong> Lighthouse audit hangs or times out on complex pages.
  </p>

  <p>
    <strong>Fix:</strong> Lighthouse has its own internal timeout. If the page is
    extremely large or slow, the audit may fail. Try:
  </p>

  <ul>
    <li>Auditing a simpler page first</li>
    <li>Reducing the number of categories</li>
    <li>Checking that the browser isn't frozen or unresponsive</li>
  </ul>

  <h3 id="large-heap-snapshot-warnings">Large heap snapshot warnings</h3>

  <p>
    <strong>Symptom:</strong>
    <code>Large heap detected. Analysis limited to top retainers.</code>
  </p>

  <p>
    <strong>Cause:</strong> The heap is huge (&gt;500 MB). Big enterprise SPAs can
    do this.
  </p>

  <p>
    <strong>What PEN does:</strong> Keeps streaming to disk (constant memory —
    the snapshot never sits in RAM). Limits analysis depth to stay fast. The raw
    data is still complete. If the snapshot exceeds <strong>2 GB</strong>, PEN
    aborts with an error suggesting <code>pen_heap_sampling</code> as a lower-overhead
    alternative.
  </p>

  <h3 id="trace-buffer-overflow">Trace buffer overflow</h3>

  <p>
    <strong>Symptom:</strong>
    <code>Trace truncated at Xs due to buffer limit</code>
  </p>

  <p><strong>Cause:</strong> Chrome's trace buffer filled during capture.</p>

  <p>
    <strong>Fix:</strong> Reduce trace duration or use fewer trace categories:
  </p>

  <CodeBlock lang="text" code="pen_capture_trace with duration=3 (shorter)" />

  <h3 id="console-buffer-full">Console buffer full</h3>

  <p><strong>Symptom:</strong> Console messages appear to be missing.</p>

  <p>
    <strong>Cause:</strong> The console buffer holds 1,000 messages max. When full,
    the oldest 100 are evicted.
  </p>

  <p>
    <strong>Fix:</strong> Use <code>pen_console_messages</code> with
    <code>last=N</code> to get recent messages, or use <code>clear=true</code>
    to reset the buffer periodically.
  </p>

  <h3 id="trace-file-too-large">Trace file too large</h3>

  <p>
    <strong>Symptom:</strong>
    <code>Trace file is X MB — exceeds the 100 MB limit</code>
  </p>

  <p>
    <strong>Fix:</strong> <code>pen_trace_insights</code> caps at 100 MB to
    avoid blowing up during JSON parsing. The trace capture itself (<code
      >pen_capture_trace</code
    >) has a <strong>500 MB</strong> hard cap — if the trace data exceeds this during
    streaming, capture is aborted. Record shorter traces or use fewer categories.
  </p>

  <h2 id="page-and-navigation-issues">Page and Navigation Issues</h2>

  <h3>Page navigates during profiling</h3>

  <p>
    <strong>Cause:</strong> SPA route change or full page reload during an active
    profile.
  </p>

  <p><strong>What PEN does:</strong></p>

  <ul>
    <li>Same-page navigation (SPA): continues, notes it in output</li>
    <li>Full reload: aborts current operation, returns partial results</li>
  </ul>

  <h3>Blocked URL scheme</h3>

  <p>
    <strong>Symptom:</strong>
    <code
      >URL scheme is not allowed. Only HTTP and HTTPS URLs are accepted.</code
    >
  </p>

  <p>
    <strong>Cause:</strong> Attempted to navigate to a <code>javascript:</code>,
    <code>data:</code>, <code>file:</code>, or other non-HTTP URL.
  </p>

  <p>
    <strong>Fix:</strong> This is a security feature. Only HTTP and HTTPS URLs are
    allowed for navigation and Lighthouse.
  </p>

  <h3>No forward history</h3>

  <p>
    <strong>Symptom:</strong> Error when using <code>pen_navigate</code> with
    <code>action: forward</code>
  </p>

  <p>
    <strong>Cause:</strong> The browser has no forward navigation history from the
    current entry.
  </p>

  <p>
    <strong>Fix:</strong> You can only go forward if you've previously gone back.
  </p>

  <h2 id="security-issues">Security Issues</h2>

  <h3>Expression blocked</h3>

  <p>
    <strong>Symptom:</strong> Expression blocked by the security filter when
    using <code>pen_evaluate</code>.
  </p>

  <p>
    <strong>Cause:</strong> The expression hit one of PEN's blocklist patterns (<code
      >fetch</code
    >, <code>document.cookie</code>, <code>eval</code>,
    <code>localStorage</code>, etc.).
  </p>

  <p>
    <strong>Fix:</strong> That's intentional. See
    <a href="/docs/security" data-sveltekit-preload-data="hover">Security</a>
    for the full list.
  </p>

  <h3>Path access denied</h3>

  <p>
    <strong>Symptom:</strong>
    <code>path resolves outside project root — access denied</code>
  </p>

  <p>
    <strong>Cause:</strong> A source tool tried to access a file outside
    <code>--project-root</code>.
  </p>

  <p>
    <strong>Fix:</strong> Set <code>--project-root</code> to the correct directory,
    or access files within the allowed path.
  </p>
</DocPage>
