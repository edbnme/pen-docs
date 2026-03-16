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
  <h1>MCP Server Design</h1>

  <p>
    PEN implements the
    <a
      href="https://spec.modelcontextprotocol.io/2025-03-26/"
      target="_blank"
      rel="noopener noreferrer">Model Context Protocol</a
    >
    with the
    <a
      href="https://github.com/modelcontextprotocol/go-sdk"
      target="_blank"
      rel="noopener noreferrer">MCP Go SDK</a
    >
    v1.3.1.
  </p>

  <h2 id="server-initialization">Server Initialization</h2>

  <p>
    PEN creates the MCP server with an identity header and a few key options:
  </p>

  <CodeBlock
    lang="go"
    code={`srv := mcp.NewServer(
    &mcp.Implementation{Name: "pen", Version: version},
    &mcp.ServerOptions{
        Logger:       logger,
        Instructions: "PEN is an autonomous performance engineer for web applications. Use pen_ tools to profile, analyze, and debug frontend performance.",
        KeepAlive:    30 * time.Second,
        InitializedHandler: func(ctx context.Context, _ *mcp.InitializedRequest) {
            logger.Info("MCP client connected and initialized")
        },
    },
)`}
  />

  <p><strong>What matters here:</strong></p>

  <ul>
    <li>
      <code>Instructions</code> tells the LLM what PEN is and how to use it.
      Sent during the <code>initialize</code> handshake.
    </li>
    <li>
      <code>KeepAlive</code> pings the transport periodically to catch dead sessions.
    </li>
    <li>
      <code>InitializedHandler</code> fires once the client finishes the handshake.
    </li>
  </ul>

  <h2 id="tool-registration">Tool Registration</h2>

  <p>
    All 30 tools are registered at startup via <code>tools.RegisterAll</code>:
  </p>

  <CodeBlock
    lang="go"
    code={`tools.RegisterAll(pen.Server(), &tools.Deps{
    CDP:     cdpClient,
    Locks:   pen.Locks(),
    Limiter: security.NewRateLimiter(security.DefaultCooldowns),
    Config:  &tools.ToolsConfig{
        AllowEval:   *allowEval,
        ProjectRoot: *projectRoot,
        Version:     version,
    },
})`}
  />

  <p>
    The <code>Deps</code> struct bundles everything handlers need — no globals
    anywhere. Tools are grouped by category (<code>registerMemoryTools</code>,
    <code>registerCPUTools</code>, etc.).
  </p>

  <h3 id="typed-generic-handlers">Typed Generic Handlers</h3>

  <p>The MCP Go SDK uses Go generics for type-safe tool handlers:</p>

  <CodeBlock
    lang="go"
    code="mcp.AddTool[InputType, any](server, toolDefinition, handlerFunc)"
  />

  <p>
    Where <code>InputType</code> is a Go struct with <code>jsonschema</code>
    tags. The SDK builds the <code>inputSchema</code> from these tags automatically.
    Handlers get the unmarshaled input directly — no manual JSON parsing.
  </p>

  <h3 id="handler-signature">Handler Signature</h3>

  <p>Every tool handler follows this pattern:</p>

  <CodeBlock
    lang="go"
    code="func makeToolHandler(deps *Deps) func(context.Context, *mcp.CallToolRequest, InputType) (*mcp.CallToolResult, any, error)"
  />

  <p>The return values:</p>

  <ul>
    <li>
      <code>*mcp.CallToolResult</code> — structured response with
      <code>Content</code> (text, images)
    </li>
    <li><code>any</code> — unused (reserved for future SDK use)</li>
    <li>
      <code>error</code> — sets <code>isError: true</code> on the MCP response
    </li>
  </ul>

  <h2 id="transports">Transports</h2>

  <p>PEN supports three MCP transports:</p>

  <Mermaid
    code={`flowchart TD
    Start["pen.Run(ctx)"] --> Transport{--transport flag}
    Transport -->|"stdio (default)"| Stdio["Read JSON-RPC from stdin<br>Write responses to stdout<br>Logs to stderr"]
    Transport -->|sse| HTTP["NewStreamableHTTPHandler<br>Mount at /mcp"]
    Transport -->|http| HTTP
    HTTP --> Bind["Bind to --addr<br>(default: localhost:6100)"]
    Bind --> Serve[Serve with session management]`}
  />

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Transport</th><th>Flag</th><th>Use Case</th></tr></thead>
      <tbody>
        <tr
          ><td>stdio</td><td><code>--transport stdio</code> (default)</td><td
            >IDE spawns PEN as child process</td
          ></tr
        >
        <tr
          ><td>SSE</td><td><code>--transport sse</code></td><td
            >Browser-based or remote clients</td
          ></tr
        >
        <tr
          ><td>HTTP</td><td><code>--transport http</code></td><td
            >Streamable HTTP (stateful sessions)</td
          ></tr
        >
      </tbody>
    </table>
  </div>

  <p>
    Both <code>sse</code> and <code>http</code> use
    <code>mcp.NewStreamableHTTPHandler</code> internally, mounted at
    <code>/mcp</code>. Default bind: <code>localhost:6100</code>.
  </p>

  <h2 id="error-handling">Error Handling</h2>

  <p>Tool errors return through the SDK's error mechanism:</p>

  <CodeBlock
    lang="go"
    code={`func toolError(msg string) (*mcp.CallToolResult, any, error) {
    return nil, nil, errors.New(msg)
}`}
  />

  <p>
    The SDK sets <code>isError: true</code> on the response automatically. Errors
    are written for LLM consumption — they explain what went wrong and what to try
    next.
  </p>

  <p>
    Example: <em
      >"HeapProfiler is already in use by another operation. Wait for the
      current heap snapshot to finish, or call another tool in the meantime."</em
    >
  </p>

  <h2 id="concurrency">Concurrency</h2>

  <h3>OperationLock</h3>

  <p>Domain-exclusive locking prevents conflicting CDP operations:</p>

  <CodeBlock
    lang="go"
    code={`release, err := deps.Locks.Acquire("HeapProfiler")
if err != nil {
    return toolError("HeapProfiler is already in use by another operation")
}
defer release()`}
  />

  <p>
    The lock never spans async boundaries — <code>defer release()</code>
    guarantees cleanup even on panics.
  </p>

  <h3>Rate Limiting</h3>

  <p>Heavy tools have cooldowns enforced before execution:</p>

  <CodeBlock
    lang="go"
    code={`if err := deps.Limiter.Check("pen_heap_snapshot"); err != nil {
    return toolError(err.Error())
}`}
  />

  <p>
    The limiter tracks the last execution time per tool.
    <code>Record</code> is called after successful execution.
  </p>

  <h3>Context Cancellation</h3>

  <p>
    Every handler respects <code>ctx.Done()</code>. If the client bails
    mid-operation, CDP calls cancel, temp files clean up via <code>defer</code>,
    and domain locks release.
  </p>

  <h2 id="capabilities">Capabilities</h2>

  <p>
    PEN declares standard MCP server capabilities during the <code
      >initialize</code
    > handshake:
  </p>

  <ul>
    <li>
      <strong>Tools</strong>: Full <code>tools/list</code> and
      <code>tools/call</code> support
    </li>
    <li>
      <strong>Progress</strong>: Sends <code>notifications/progress</code> for slow
      operations (heap snapshots, traces)
    </li>
    <li>
      <strong>No resources or prompts</strong>: PEN is tools-only — no MCP
      resources or prompt templates
    </li>
  </ul>

  <h2 id="pen-init">pen init — Interactive Setup</h2>

  <p>
    PEN ships with an interactive setup wizard via <code>pen init</code>, built
    with:
  </p>

  <ul>
    <li>
      <a
        href="https://github.com/charmbracelet/huh"
        target="_blank"
        rel="noopener noreferrer">charmbracelet/huh</a
      >
      v1.0.0 — terminal form framework for the multi-step wizard
    </li>
    <li>
      <a
        href="https://github.com/charmbracelet/lipgloss"
        target="_blank"
        rel="noopener noreferrer">charmbracelet/lipgloss</a
      >
      v1.1.0 — terminal styling for formatted output
    </li>
    <li>
      charmbracelet/huh/spinner — loading animations during connection
      verification
    </li>
  </ul>

  <p>
    The wizard sniffs out installed browsers and IDE configs, then writes the
    right MCP config file. It's the best way to get started.
  </p>
</DocPage>
