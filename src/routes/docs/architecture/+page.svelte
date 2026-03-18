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
  <h1>System Architecture</h1>

  <h2 id="component-overview">Component Overview</h2>

  <Mermaid
    code={`flowchart TB
    IDE["IDE / LLM Client<br>(Cursor, VS Code, Claude Desktop)"]
    IDE -->|"MCP (stdio or HTTP)"| Server

    subgraph PEN["PEN Server (cmd/pen)"]
        Server["MCP Server<br>server/"]
        Tools["Tool Handlers<br>tools/"]
        Security["Security<br>security/"]
        Format["Format<br>format/"]
        CDP["CDP Client<br>cdp/"]

        Server --> Tools
        Tools --> Security
        Tools --> CDP
        Tools --> Format
    end

    CDP -->|"CDP (WebSocket)"| Chrome["Chrome / Chromium<br>(--remote-debugging-port=9222)"]`}
  />

  <h2 id="package-map">Package Map</h2>

  <CodeBlock
    lang="text"
    code={`cmd/pen/
  main.go           Entry point. Flag parsing, signal handling, wiring.
  init.go           Interactive setup wizard (pen init) using charmbracelet/huh.

internal/
  cdp/
    client.go       CDP connection lifecycle (Connect, Reconnect, Close).
    listener.go     Event listener registration (ListenTarget wrapper).
    targets.go      Tab listing and switching (ListTargets, SelectTarget, FindTargetByURL).

  server/
    server.go       MCP server creation, transport handling (stdio/sse/http).
    lock.go         Domain-exclusive locking (OperationLock).
    progress.go     MCP progress notification helper.

  tools/
    register.go     Tool registration entry point (RegisterAll + Deps struct).
    audit.go        pen_performance_metrics, pen_web_vitals, pen_accessibility_check.
    memory.go       pen_heap_snapshot, pen_heap_diff, pen_heap_track, pen_heap_sampling.
    cpu.go          pen_cpu_profile, pen_capture_trace, pen_trace_insights.
    network.go      pen_network_enable, pen_network_waterfall, pen_network_request, pen_network_blocking.
    coverage.go     pen_js_coverage, pen_css_coverage.
    source.go       pen_list_sources, pen_source_content, pen_search_source.
    console.go      pen_console_enable, pen_console_messages.
    lighthouse.go   pen_lighthouse.
    utility.go      pen_list_pages, pen_select_page, pen_collect_garbage, pen_screenshot,
                    pen_emulate, pen_navigate, pen_evaluate.
    status.go       pen_status.

  format/
    output.go       Markdown table builder and formatting helpers.

  security/
    validate.go     Expression filtering, path traversal, CDP URL validation, temp files.
    ratelimit.go    Per-tool cooldown enforcement.`}
  />

  <h2 id="dependencies">Dependencies</h2>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Dependency</th><th>Version</th><th>Purpose</th></tr></thead
      >
      <tbody>
        <tr
          ><td><code>github.com/modelcontextprotocol/go-sdk</code></td><td
            >v1.3.1</td
          ><td>MCP server, transports, types</td></tr
        >
        <tr
          ><td><code>github.com/chromedp/chromedp</code></td><td>v0.13.6</td><td
            >CDP connection and browser automation</td
          ></tr
        >
        <tr
          ><td><code>github.com/chromedp/cdproto</code></td><td>pinned</td><td
            >Auto-generated CDP type bindings</td
          ></tr
        >
        <tr
          ><td><code>github.com/charmbracelet/huh</code></td><td>v1.0.0</td><td
            >Interactive terminal wizard (<code>pen init</code>)</td
          ></tr
        >
        <tr
          ><td><code>github.com/charmbracelet/lipgloss</code></td><td>v1.1.0</td
          ><td>Terminal styling for <code>pen init</code> output</td></tr
        >
      </tbody>
    </table>
  </div>

  <p>
    Go version: <strong>1.24.2</strong>. No runtime dependencies beyond the
    standard library and the above.
  </p>

  <h2 id="entry-point-flow">Entry Point Flow</h2>

  <p>From <code>cmd/pen/main.go</code>, here's what happens on launch:</p>

  <Mermaid
    code={`flowchart TD
    Start([pen starts]) --> SubCheck{subcommand?}
    SubCheck -->|"pen init"| Wizard["Run interactive wizard<br>(charmbracelet/huh)"]
    SubCheck -->|"pen update"| Updater["Self-update to latest release"]
    Wizard --> Done([Exit])
    Updater --> Done
    SubCheck -->|"(none)"| Flags[Parse flags]
    Flags --> Validate["Validate CDP URL<br>(localhost-only)"]
    Validate --> Signal["Set up signal context<br>(SIGINT, SIGTERM)"]
    Signal --> Connect["Create CDP client + reconnect<br>(3 retries, exponential backoff)"]
    Connect --> Server[Create MCP server]
    Server --> Register[Register all 30 tools]
    Register --> Run["Start server on transport<br>(stdio / SSE / HTTP)"]
    Run --> Cleanup[Clean temp files]
    Cleanup --> Done`}
  />

  <ol>
    <li>
      Check for subcommands — <code>pen init</code> runs the interactive wizard,
      <code>pen update</code> self-updates to the latest release
    </li>
    <li>
      Parse flags (<code>--cdp-url</code>, <code>--transport</code>,
      <code>--addr</code>, <code>--allow-eval</code>, <code>--stateless</code>,
      <code>--auto-launch</code>, <code>--project-root</code>,
      <code>--log-level</code>, <code>--version</code>)
    </li>
    <li>
      Validate the CDP URL via <code>security.ValidateCDPURL</code> (localhost only)
    </li>
    <li>Wire up signal handling (<code>SIGINT</code>, <code>SIGTERM</code>)</li>
    <li>
      Connect to Chrome with retry: <code>cdp.NewClient(url, logger)</code> →
      <code>client.Reconnect(ctx, 3)</code> (3 attempts, backoff from 500ms to 10s)
    </li>
    <li>
      Stand up the MCP server: <code
        >server.New(cdpClient, &Config{"{...}"})</code
      >
    </li>
    <li>
      Register all 30 tools: <code
        >tools.RegisterAll(server.Server(), deps)</code
      >
    </li>
    <li>Start serving on the configured transport</li>
    <li>Clean up temp files on exit (deferred)</li>
  </ol>

  <h2 id="data-flow">Data Flow</h2>

  <p>Here's what a typical tool call looks like end-to-end:</p>

  <Mermaid
    code={`sequenceDiagram
    participant LLM as IDE / LLM
    participant Server as MCP Server (server/)
    participant Handler as Tool Handler (tools/)
    participant CDPClient as CDP Client (cdp/)
    participant Chrome

    LLM->>Server: CallToolRequest (pen_heap_snapshot)
    Server->>Handler: dispatch to handler
    Handler->>Handler: rate limit check
    Handler->>Handler: acquire OperationLock
    Handler->>CDPClient: get chromedp context
    CDPClient->>Chrome: enable domain + register listeners
    Chrome-->>CDPClient: stream events (heap chunks)
    Note right of CDPClient: Chunks streamed to temp file
    CDPClient-->>Handler: operation complete
    Handler->>Handler: analyze from disk + format output
    Handler-->>Server: CallToolResult (Markdown)
    Server-->>LLM: structured analysis`}
  />

  <h2 id="key-type-signatures">Key Type Signatures</h2>

  <h3>CDP Client</h3>

  <CodeBlock
    lang="go"
    code={`type Client struct { /* unexported fields */ }

func NewClient(debugURL string, logger *slog.Logger) *Client
func (c *Client) Connect(ctx context.Context) error
func (c *Client) Close()
func (c *Client) Reconnect(ctx context.Context, maxAttempts int) error
func (c *Client) IsConnected() bool
func (c *Client) SetLogger(logger *slog.Logger)
func (c *Client) SetReconnectFunc(fn func() error)

// Context access
func (c *Client) Context() (context.Context, error)
func (c *Client) ContextWithTimeout(timeout time.Duration) (context.Context, context.CancelFunc, error)
func (c *Client) AllocContext() (context.Context, error)

// Actions
func (c *Client) RunAction(ctx context.Context, actions ...chromedp.Action) error
func (c *Client) RunActionFunc(fn func(ctx context.Context) error) error
func (c *Client) Listen(handler func(ev interface{})) (context.CancelFunc, error)

// Target management
func (c *Client) ListTargets(ctx context.Context) ([]TargetInfo, error)
func (c *Client) SelectTarget(ctx context.Context, targetID string) (context.Context, context.CancelFunc, error)
func (c *Client) FindTargetByURL(ctx context.Context, urlPattern string) (*TargetInfo, error)
func (c *Client) CurrentTargetID() string

// Discovery
func DiscoverEndpoint(ctx context.Context, baseURL string) (string, error)`}
  />

  <h3>MCP Server</h3>

  <CodeBlock
    lang="go"
    code={`type Config struct {
    Name      string
    Version   string
    Transport string
    HTTPAddr  string
    AllowEval bool
    Stateless bool
    Logger    *slog.Logger
}

type PEN struct { /* unexported fields */ }
func New(cdpClient *cdp.Client, cfg *Config) *PEN
func (p *PEN) Server() *mcp.Server
func (p *PEN) CDP() *cdp.Client
func (p *PEN) Locks() *OperationLock
func (p *PEN) Run(ctx context.Context) error`}
  />

  <h3>Tool Registration</h3>

  <CodeBlock
    lang="go"
    code={`type Deps struct {
    CDP     *cdp.Client
    Locks   *server.OperationLock
    Limiter *security.RateLimiter
    Config  *ToolsConfig
}

type ToolsConfig struct {
    AllowEval   bool
    ProjectRoot string
    Version     string
    CDPPort     int
}

func RegisterAll(s *mcp.Server, deps *Deps)`}
  />

  <h3>Security</h3>

  <CodeBlock
    lang="go"
    code={`type RateLimiter struct { /* unexported fields */ }
func NewRateLimiter(cooldowns map[string]time.Duration) *RateLimiter
func (rl *RateLimiter) Check(toolName string) error
func (rl *RateLimiter) Record(toolName string)

func ValidateExpression(expr string) error
func ValidateSourcePath(projectRoot, requestedPath string) (string, error)
func ValidateTempPath(path string) error
func ValidateCDPURL(rawURL string) error
func CreateSecureTempFile(prefix string) (*os.File, error)
func CleanTempFiles() (int64, error)`}
  />

  <h3>Format</h3>

  <CodeBlock
    lang="go"
    code={`func Table(headers []string, rows [][]string) string
func Section(title string, parts ...string) string
func Bytes(n int64) string
func Duration(d time.Duration) string
func Percent(pct float64) string
func BulletList(items []string) string
func Warning(msg string) string
func KeyValue(key, value string) string
func Summary(pairs [][2]string) string
func ToolResult(title string, sections ...string) string`}
  />

  <h3>Operation Lock</h3>

  <CodeBlock
    lang="go"
    code={`type OperationLock struct { /* unexported fields */ }
func NewOperationLock() *OperationLock
func (ol *OperationLock) Acquire(domain string) (release func(), err error)
func (ol *OperationLock) IsLocked(domain string) bool`}
  />

  <h2 id="concurrency-model">Concurrency Model</h2>

  <h3 id="domain-exclusive-locking">Domain-Exclusive Locking</h3>

  <p>
    Tools that use conflicting CDP domains are protected by
    <code>OperationLock</code>:
  </p>

  <CodeBlock
    lang="go"
    code={`release, err := deps.Locks.Acquire("HeapProfiler")
if err != nil {
    return toolError("HeapProfiler is already in use by another operation")
}
defer release()`}
  />

  <p>
    The lock is a simple per-domain mutex. If a second tool tries to grab a
    locked domain, it fails immediately — PEN never queues or blocks.
  </p>

  <h3 id="rate-limiting">Rate Limiting</h3>

  <p>Per-tool cooldowns enforced before execution:</p>

  <CodeBlock
    lang="go"
    code={`if err := deps.Limiter.Check("pen_heap_snapshot"); err != nil {
    return toolError(err.Error()) // "pen_heap_snapshot has a 10s cooldown. Try again in 6s"
}`}
  />

  <h3 id="context-propagation">Context Propagation</h3>

  <p>
    Every handler gets a <code>context.Context</code> from MCP. If the client disconnects
    mid-operation:
  </p>

  <ol>
    <li><code>ctx.Done()</code> fires</li>
    <li>CDP operations abort (chromedp respects context)</li>
    <li>Temp files cleaned via <code>defer</code></li>
    <li>Domain locks released via <code>defer</code></li>
    <li>No dangling goroutines — chromedp's context tree handles cleanup</li>
  </ol>

  <h2 id="build">Build</h2>

  <CodeBlock
    lang="bash"
    code="go build -ldflags &quot;-s -w -X main.version=v1.0.0&quot; -o pen ./cmd/pen"
  />

  <p>Cross-compiled via GoReleaser for:</p>

  <ul>
    <li><code>linux/amd64</code>, <code>linux/arm64</code></li>
    <li><code>darwin/amd64</code>, <code>darwin/arm64</code></li>
    <li><code>windows/amd64</code></li>
  </ul>

  <h2 id="constants-and-limits">Constants and Limits</h2>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Constant</th><th>Value</th><th>Location</th></tr></thead>
      <tbody>
        <tr
          ><td>Max console entries</td><td>1,000</td><td
            ><code>tools/console.go</code></td
          ></tr
        >
        <tr
          ><td>Console eviction batch</td><td>100 (oldest)</td><td
            ><code>tools/console.go</code></td
          ></tr
        >
        <tr
          ><td>Max debugger scripts</td><td>500</td><td
            ><code>tools/source.go</code></td
          ></tr
        >
        <tr
          ><td>Max heap snapshots retained</td><td>20</td><td
            ><code>tools/memory.go</code></td
          ></tr
        >
        <tr
          ><td>Console text truncation</td><td>2,000 chars</td><td
            ><code>tools/console.go</code></td
          ></tr
        >
        <tr
          ><td>Trace capture hard cap</td><td>500 MB</td><td
            ><code>tools/cpu.go</code></td
          ></tr
        >
        <tr
          ><td>Trace insights file size limit</td><td>100 MB</td><td
            ><code>tools/cpu.go</code></td
          ></tr
        >
        <tr
          ><td>CPU profile duration</td><td>1–30 seconds</td><td
            ><code>tools/cpu.go</code></td
          ></tr
        >
        <tr
          ><td>CPU sampling interval min</td><td>10 µs</td><td
            ><code>tools/cpu.go</code></td
          ></tr
        >
        <tr
          ><td>Default coverage topN</td><td>20</td><td
            ><code>tools/coverage.go</code></td
          ></tr
        >
        <tr
          ><td>Network large asset threshold</td><td>100 KB</td><td
            ><code>tools/network.go</code></td
          ></tr
        >
        <tr
          ><td>Default waterfall limit</td><td>50 requests</td><td
            ><code>tools/network.go</code></td
          ></tr
        >
        <tr
          ><td>Long task threshold</td><td>50 ms</td><td
            ><code>tools/cpu.go</code></td
          ></tr
        >
        <tr
          ><td>Frame drop threshold</td><td>33.3 ms (30fps)</td><td
            ><code>tools/cpu.go</code></td
          ></tr
        >
        <tr
          ><td>Heap sampling interval</td><td>32,768 bytes</td><td
            ><code>tools/memory.go</code></td
          ></tr
        >
        <tr
          ><td>Default trace categories</td><td>6 categories</td><td
            ><code>tools/cpu.go</code></td
          ></tr
        >
        <tr
          ><td>Temp dir permissions</td><td>0700</td><td
            ><code>security/validate.go</code></td
          ></tr
        >
        <tr
          ><td>Temp file permissions</td><td>0600</td><td
            ><code>security/validate.go</code></td
          ></tr
        >
      </tbody>
    </table>
  </div>
</DocPage>
