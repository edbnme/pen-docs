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
  <h1>Output Design</h1>

  <p>How PEN formats what it sends back to the LLM.</p>

  <h2 id="principles">Principles</h2>

  <p>
    Every tool returns text in <code>CallToolResult.Content</code>. The text is
    shaped for LLMs first, humans second.
  </p>

  <Mermaid
    code={`flowchart LR
    Tool[Tool Handler] --> Format["format/ package"]
    Format --> Result["CallToolResult"]
    Result --> Text["TextContent<br>(Markdown tables, sections)"]
    Result --> Image["ImageContent<br>(base64 PNG)"]

    subgraph Structure["Output Structure"]
        direction TB
        Header["Section Header<br>Tool name + summary stats"]
        Tables["Data Tables<br>Key columns only"]
        Flags["Observations<br>Anomalies flagged inline"]
        Recs["Recommendations<br>HIGH / MEDIUM / LOW / INFO"]
        Header --> Tables --> Flags --> Recs
    end`}
  />

  <h3>Constraints</h3>

  <ul>
    <li>
      <strong>Token budget</strong>: Output is capped to fit LLM context
      windows. Big result sets (e.g., 500 network requests) get trimmed to the
      top N.
    </li>
    <li>
      <strong>No binary blobs</strong>: Everything is text. Screenshots are
      base64 PNGs in <code>mcp.ImageContent</code>.
    </li>
    <li>
      <strong>Self-contained</strong>: No "go look at this file" references. The
      LLM should have everything it needs in the response.
    </li>
    <li>
      <strong>Structured, not prose</strong>: Tables and labeled sections. LLMs
      parse structured text better than paragraphs.
    </li>
  </ul>

  <h2 id="token-budget-awareness">Token Budget Awareness</h2>

  <div class="table-wrapper">
    <table>
      <thead
        ><tr><th>Tool</th><th>Typical Output</th><th>Upper Bound</th></tr
        ></thead
      >
      <tbody>
        <tr
          ><td><code>pen_performance_metrics</code></td><td>~30 lines</td><td
            >50 lines</td
          ></tr
        >
        <tr
          ><td><code>pen_heap_snapshot</code></td><td>~40 lines</td><td
            >100 lines</td
          ></tr
        >
        <tr
          ><td><code>pen_network_waterfall</code></td><td>~50 lines</td><td
            >120 lines</td
          ></tr
        >
        <tr
          ><td><code>pen_cpu_profile</code></td><td>~40 lines</td><td
            >100 lines</td
          ></tr
        >
        <tr
          ><td><code>pen_source_content</code></td><td>~200 lines</td><td
            ><code>maxLines</code> param</td
          ></tr
        >
        <tr
          ><td><code>pen_capture_trace</code></td><td>~50 lines</td><td
            >120 lines</td
          ></tr
        >
        <tr
          ><td><code>pen_trace_insights</code></td><td>~60 lines</td><td
            >150 lines</td
          ></tr
        >
        <tr
          ><td><code>pen_console_messages</code></td><td>~30 lines</td><td
            >100 lines</td
          ></tr
        >
        <tr
          ><td><code>pen_lighthouse</code></td><td>~50 lines</td><td
            >120 lines</td
          ></tr
        >
      </tbody>
    </table>
  </div>

  <p>
    Tools with open-ended output accept <code>topN</code>, <code>limit</code>,
    <code>last</code>, or <code>maxResults</code> to keep things bounded.
  </p>

  <h2 id="format-package">Format Package</h2>

  <p>
    PEN uses <code>internal/format/output.go</code> for consistent output across tools.
  </p>

  <h3>Table Builder</h3>

  <CodeBlock
    lang="go"
    code={`out := format.Table(
    []string{"Metric", "Value", "Status"},
    [][]string{
        {"JSHeapUsedSize", "82.4 MB", "⚠ High"},
        {"Nodes", "4,521", ""},
    },
)`}
  />

  <p>Tables auto-size column widths for clean alignment.</p>

  <h3>Section Builder</h3>

  <CodeBlock
    lang="go"
    code={`out := format.ToolResult("Performance Metrics",
    format.Section("Summary",
        format.Summary([][2]string{
            {"Total Metrics", "12"},
            {"Issues Found", "2"},
        }),
    ),
    format.Section("Details",
        format.Table(headers, rows),
    ),
    format.Section("Recommendations",
        format.BulletList(recommendations),
    ),
)`}
  />

  <h3>Formatting Helpers</h3>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Function</th><th>Purpose</th><th>Example</th></tr></thead>
      <tbody>
        <tr
          ><td><code>format.Bytes(n)</code></td><td>Human-readable bytes</td><td
            ><code>82.4 MB</code></td
          ></tr
        >
        <tr
          ><td><code>format.Duration(d)</code></td><td
            >Human-readable duration</td
          ><td><code>1.23s</code>, <code>450ms</code></td></tr
        >
        <tr
          ><td><code>format.Percent(pct)</code></td><td>Percentage</td><td
            ><code>73.2%</code></td
          ></tr
        >
        <tr
          ><td><code>format.BulletList(items)</code></td><td
            >Bullet-point list</td
          ><td><code>• item 1\n• item 2</code></td></tr
        >
        <tr
          ><td><code>format.Warning(msg)</code></td><td>Warning prefix</td><td
            ><code>⚠ msg</code></td
          ></tr
        >
        <tr
          ><td><code>format.KeyValue(k, v)</code></td><td>Key-value pair</td><td
            ><code>Key: Value</code></td
          ></tr
        >
        <tr
          ><td><code>format.Summary(pairs)</code></td><td>Summary block</td><td
            >Key-value summary</td
          ></tr
        >
      </tbody>
    </table>
  </div>

  <h2 id="error-output">Error Output</h2>

  <p>When a tool fails, the error follows the same structure:</p>

  <ul>
    <li><strong>What happened</strong> — the error itself</li>
    <li><strong>Why</strong> — likely cause</li>
    <li><strong>What to do</strong> — a concrete next step</li>
  </ul>

  <p>
    Example: <em
      >"HeapProfiler is already in use by another operation. Wait for the
      current heap snapshot to finish, or call another tool in the meantime."</em
    >
  </p>

  <h2 id="workflow-composition">Workflow Composition</h2>

  <p>
    PEN tools chain naturally. The LLM picks the order — PEN doesn't force any
    particular flow.
  </p>

  <h3>Tool ID Flow</h3>

  <p>Some tools produce IDs consumed by downstream tools:</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Producer</th><th>ID Type</th><th>Consumer</th></tr></thead>
      <tbody>
        <tr
          ><td><code>pen_heap_snapshot</code></td><td>snapshot ID</td><td
            ><code>pen_heap_diff</code></td
          ></tr
        >
        <tr
          ><td><code>pen_list_pages</code></td><td>target ID</td><td
            ><code>pen_select_page</code></td
          ></tr
        >
        <tr
          ><td><code>pen_network_waterfall</code></td><td>request ID</td><td
            ><code>pen_network_request</code></td
          ></tr
        >
        <tr
          ><td><code>pen_list_sources</code></td><td>script ID</td><td
            ><code>pen_source_content</code>, <code>pen_search_source</code></td
          ></tr
        >
        <tr
          ><td><code>pen_capture_trace</code></td><td>trace path</td><td
            ><code>pen_trace_insights</code></td
          ></tr
        >
      </tbody>
    </table>
  </div>

  <p>
    IDs are opaque strings (or file paths for traces). They stay valid until PEN
    restarts or the thing they point to disappears.
  </p>

  <h2 id="mcp-content-types">MCP Content Types</h2>

  <p>PEN returns two content types:</p>

  <h3>Text Content</h3>

  <p>Used by all tools for structured output:</p>

  <CodeBlock lang="go" code={`&mcp.TextContent{Text: formattedString}`} />

  <h3>Image Content</h3>

  <p>Used by <code>pen_screenshot</code>:</p>

  <CodeBlock
    lang="go"
    code={`&mcp.ImageContent{MIMEType: "image/png", Data: base64String}`}
  />

  <p>
    Screenshots are base64-encoded and embedded directly in the MCP response.
    The LLM can display or reason about them.
  </p>
</DocPage>
