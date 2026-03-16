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
  <h1>Adding Tools</h1>

  <p>
    How to add a new tool to PEN. Every tool follows the same shape — this guide
    walks through it end-to-end.
  </p>

  <Mermaid
    code={`flowchart LR
    A["1. Define Input Struct<br>(json + jsonschema tags)"] --> B["2. Write Tool Definition<br>(name, description, schema)"]
    B --> C["3. Implement Handler<br>(rate limit → lock → CDP → format)"]
    C --> D["4. Register in category file<br>(mcp.AddTool)"]
    D --> E["5. Wire up in RegisterAll"]`}
  />

  <h2 id="architecture">Architecture</h2>

  <p>
    Tools live in <code>internal/tools/</code>. Each file covers one category:
  </p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>File</th><th>Category</th><th>Tools</th></tr></thead>
      <tbody>
        <tr
          ><td><code>audit.go</code></td><td>Performance</td><td
            ><code>pen_performance_metrics</code>, <code>pen_web_vitals</code>,
            <code>pen_accessibility_check</code></td
          ></tr
        >
        <tr
          ><td><code>memory.go</code></td><td>Memory</td><td
            ><code>pen_heap_snapshot</code>, <code>pen_heap_diff</code>,
            <code>pen_heap_track</code>, <code>pen_heap_sampling</code></td
          ></tr
        >
        <tr
          ><td><code>cpu.go</code></td><td>CPU</td><td
            ><code>pen_cpu_profile</code>, <code>pen_capture_trace</code>,
            <code>pen_trace_insights</code></td
          ></tr
        >
        <tr
          ><td><code>network.go</code></td><td>Network</td><td
            ><code>pen_network_enable</code>,
            <code>pen_network_waterfall</code>,
            <code>pen_network_request</code>,
            <code>pen_network_blocking</code></td
          ></tr
        >
        <tr
          ><td><code>coverage.go</code></td><td>Coverage</td><td
            ><code>pen_js_coverage</code>, <code>pen_css_coverage</code></td
          ></tr
        >
        <tr
          ><td><code>source.go</code></td><td>Source</td><td
            ><code>pen_list_sources</code>, <code>pen_source_content</code>,
            <code>pen_search_source</code></td
          ></tr
        >
        <tr
          ><td><code>console.go</code></td><td>Console</td><td
            ><code>pen_console_enable</code>,
            <code>pen_console_messages</code></td
          ></tr
        >
        <tr
          ><td><code>lighthouse.go</code></td><td>Lighthouse</td><td
            ><code>pen_lighthouse</code></td
          ></tr
        >
        <tr
          ><td><code>utility.go</code></td><td>Utility</td><td
            >8 tools (navigation, screenshots, eval, etc.)</td
          ></tr
        >
        <tr
          ><td><code>status.go</code></td><td>Status</td><td
            ><code>pen_status</code></td
          ></tr
        >
      </tbody>
    </table>
  </div>

  <p>
    <code>register.go</code> has the <code>RegisterAll</code> entry point and
    the
    <code>Deps</code> struct.
  </p>

  <h2 id="step-1-define-the-input-struct">Step 1: Define the Input Struct</h2>

  <p>
    Create a Go struct with <code>json</code> and <code>jsonschema</code> tags.
    The SDK turns these into <code>inputSchema</code> automatically.
  </p>

  <CodeBlock
    lang="go"
    code={`type myToolInput struct {
    Duration int    \`json:"duration" jsonschema:"description=Duration in seconds (1-30),minimum=1,maximum=30"\`
    Format   string \`json:"format"   jsonschema:"description=Output format,enum=brief,enum=detailed"\`
    TopN     int    \`json:"topN"     jsonschema:"description=Number of top items to return"\`
}`}
  />

  <p>For tools with no parameters, use an empty struct:</p>

  <CodeBlock lang="go" code={"type perfMetricsInput struct{}"} />

  <h2 id="step-2-define-the-tool">Step 2: Define the Tool</h2>

  <p>
    Create an <code>mcp.Tool</code> definition with name, description, and annotations:
  </p>

  <CodeBlock
    lang="go"
    code={`var myTool = mcp.Tool{
    Name:        "pen_my_tool",
    Description: "What this tool does in one sentence. Used by LLMs to decide when to call it.",
    Annotations: &mcp.ToolAnnotations{
        ReadOnlyHint: boolPtr(true), // or false if it modifies state
    },
}`}
  />

  <p>
    All PEN tools start with <code>pen_</code>. Write the description for LLMs —
    it shows up in <code>tools/list</code> and that's how the model decides whether
    to call it.
  </p>

  <h2 id="step-3-write-the-handler">Step 3: Write the Handler</h2>

  <p>Handler signature (using Go generics):</p>

  <CodeBlock
    lang="go"
    code={`func handleMyTool(deps *Deps) func(context.Context, *mcp.CallToolRequest, myToolInput) (*mcp.CallToolResult, any, error) {
    return func(ctx context.Context, req *mcp.CallToolRequest, input myToolInput) (*mcp.CallToolResult, any, error) {
        // 1. Rate limit check (if this is a heavy operation)
        if err := deps.Limiter.Check("pen_my_tool"); err != nil {
            return toolError(err.Error())
        }

        // 2. Acquire domain lock (if using an exclusive CDP domain)
        release, err := deps.Locks.Acquire("MyDomain")
        if err != nil {
            return toolError("MyDomain is already in use by another operation")
        }
        defer release()

        // 3. Get chromedp context
        cdpCtx, cancel, err := deps.CDP.ContextWithTimeout(30 * time.Second)
        if err != nil {
            return toolError(err.Error())
        }
        defer cancel()

        // 4. Do CDP work
        // ...

        // 5. Format output
        out := format.ToolResult("My Tool",
            format.Section("Results",
                format.Table(headers, rows),
            ),
        )

        // 6. Record rate limit (after success)
        deps.Limiter.Record("pen_my_tool")

        return &mcp.CallToolResult{
            Content: []mcp.Content{
                &mcp.TextContent{Text: out},
            },
        }, nil, nil
    }
}`}
  />

  <h3>Error Handling</h3>

  <p>Use <code>toolError</code> for expected errors (user-facing):</p>

  <CodeBlock
    lang="go"
    code={`func toolError(msg string) (*mcp.CallToolResult, any, error) {
    return nil, nil, errors.New(msg)
}`}
  />

  <p>
    The SDK flips <code>isError: true</code> automatically. Write errors for the LLM
    — say what happened, why, and what to try next.
  </p>

  <h3>Progress Notifications</h3>

  <p>For long-running operations, send progress:</p>

  <CodeBlock
    lang="go"
    code="server.NotifyProgress(ctx, req, bytesWritten, totalBytes, &quot;processing...&quot;)"
  />

  <p>Safe to call every time — it's a no-op if there's no progress token.</p>

  <h2 id="step-4-register-the-tool">Step 4: Register the Tool</h2>

  <p>
    Add registration to the appropriate <code>register*Tools</code> function, or create
    a new one:
  </p>

  <CodeBlock
    lang="go"
    code={`func registerMyTools(s *mcp.Server, deps *Deps) {
    mcp.AddTool(s, myTool, handleMyTool(deps))
}`}
  />

  <p>Then add the call in <code>RegisterAll</code>:</p>

  <CodeBlock
    lang="go"
    code={`func RegisterAll(s *mcp.Server, deps *Deps) {
    registerMemoryTools(s, deps)
    registerCPUTools(s, deps)
    // ...
    registerMyTools(s, deps)  // add this
}`}
  />

  <h2 id="step-5-add-rate-limiting">Step 5: Add Rate Limiting</h2>

  <p>
    If the tool is expensive, give it a cooldown in
    <code>security/ratelimit.go</code>:
  </p>

  <CodeBlock
    lang="go"
    code={`var DefaultCooldowns = map[string]time.Duration{
    "pen_heap_snapshot":   10 * time.Second,
    "pen_capture_trace":   5 * time.Second,
    "pen_collect_garbage": 5 * time.Second,
    "pen_my_tool":         5 * time.Second,  // add this
}`}
  />

  <h2 id="step-6-test-it">Step 6: Test It</h2>

  <p>
    Add tests in <code>tools/tools_test.go</code> or a new file. The MCP SDK has test
    helpers for exercising tools without a real browser.
  </p>

  <h2 id="patterns-worth-following">Patterns Worth Following</h2>

  <h3>Output Formatting</h3>

  <p>
    Always use <code>format.ToolResult</code> and <code>format.Table</code> for consistent
    output:
  </p>

  <CodeBlock
    lang="go"
    code={`out := format.ToolResult("Tool Name",
    format.Section("Summary",
        format.Summary([][2]string{
            {"Total", fmt.Sprintf("%d items", len(items))},
            {"Duration", format.Duration(elapsed)},
        }),
    ),
    format.Section("Details",
        format.Table(
            []string{"Name", "Value", "Status"},
            rows,
        ),
    ),
)`}
  />

  <h3>Temp Files</h3>

  <p>For tools that produce big output:</p>

  <CodeBlock
    lang="go"
    code={`f, err := security.CreateSecureTempFile("mytool-")
if err != nil {
    return toolError(err.Error())
}
defer os.Remove(f.Name())
defer f.Close()`}
  />

  <h3>Domain Locking</h3>

  <p>Use <code>OperationLock</code> for exclusive CDP domains:</p>

  <CodeBlock
    lang="go"
    code={`release, err := deps.Locks.Acquire("DomainName")
if err != nil {
    return toolError("DomainName is already in use")
}
defer release()`}
  />

  <h3>Context Timeout</h3>

  <p>Always add a timeout to CDP operations:</p>

  <CodeBlock
    lang="go"
    code={`cdpCtx, cancel, err := deps.CDP.ContextWithTimeout(30 * time.Second)
if err != nil {
    return toolError(err.Error())
}
defer cancel()`}
  />

  <h3>Defaults</h3>

  <p>Apply defaults for optional parameters:</p>

  <CodeBlock
    lang="go"
    code={`topN := input.TopN
if topN <= 0 {
    topN = 20
}`}
  />

  <h2 id="checklist">Checklist</h2>

  <p>Before submitting a new tool:</p>

  <ul>
    <li>Input struct has <code>json</code> and <code>jsonschema</code> tags</li>
    <li>Tool name starts with <code>pen_</code></li>
    <li>Description is written for LLM consumption</li>
    <li><code>ReadOnlyHint</code> is set correctly in annotations</li>
    <li>Rate limiting added if the tool is expensive</li>
    <li>Domain lock acquired if using an exclusive CDP domain</li>
    <li>Context timeout set on all CDP calls</li>
    <li>
      Output uses <code>format.ToolResult</code> / <code>format.Table</code>
    </li>
    <li>Temp files cleaned up via <code>defer</code></li>
    <li>Errors explain what happened + what to try next</li>
    <li>Tests cover the happy path and key error cases</li>
  </ul>
</DocPage>
