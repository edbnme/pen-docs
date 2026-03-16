# Output Design

How PEN formats tool output for LLM consumption.

## Principles

Every PEN tool returns text in `CallToolResult.Content`. The text is designed for LLM consumption first, human readability second.

### Structure

1. **Section header** — tool name and summary stats
2. **Data tables** — Markdown tables with the most important columns
3. **Observations** — anything anomalous, flagged inline
4. **Recommendations** — prioritized as HIGH / MEDIUM / LOW / INFO

### Constraints

- **Token budget**: Tools truncate output to stay within reasonable LLM context limits. Large result sets (e.g., 500 network requests) are capped at the top N entries.
- **No binary data**: Everything is text. Screenshots are base64-encoded PNGs in `mcp.ImageContent`.
- **No external references**: Output is self-contained. An LLM should never need to "go look at a file" to understand the result.
- **Structured, not free-form**: Tables and labeled sections, not prose paragraphs. LLMs parse structured text more reliably.

## Token Budget Awareness

| Tool                      | Typical Output | Upper Bound      |
| ------------------------- | -------------- | ---------------- |
| `pen_performance_metrics` | ~30 lines      | 50 lines         |
| `pen_heap_snapshot`       | ~40 lines      | 100 lines        |
| `pen_network_waterfall`   | ~50 lines      | 120 lines        |
| `pen_cpu_profile`         | ~40 lines      | 100 lines        |
| `pen_source_content`      | ~200 lines     | `maxLines` param |
| `pen_capture_trace`       | ~50 lines      | 120 lines        |
| `pen_trace_insights`      | ~60 lines      | 150 lines        |
| `pen_console_messages`    | ~30 lines      | 100 lines        |
| `pen_lighthouse`          | ~50 lines      | 120 lines        |

Tools with unbounded output accept `topN`, `limit`, `last`, or `maxResults` parameters.

## Format Package

PEN uses `internal/format/output.go` for consistent formatting across all tools.

### Table Builder

```go
out := format.Table(
    []string{"Metric", "Value", "Status"},
    [][]string{
        {"JSHeapUsedSize", "82.4 MB", "⚠ High"},
        {"Nodes", "4,521", ""},
    },
)
```

Tables auto-size column widths for clean alignment.

### Section Builder

```go
out := format.ToolResult("Performance Metrics",
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
)
```

### Formatting Helpers

| Function                   | Purpose                 | Example              |
| -------------------------- | ----------------------- | -------------------- |
| `format.Bytes(n)`          | Human-readable bytes    | `82.4 MB`            |
| `format.Duration(d)`       | Human-readable duration | `1.23s`, `450ms`     |
| `format.Percent(pct)`      | Percentage              | `73.2%`              |
| `format.BulletList(items)` | Bullet-point list       | `• item 1\n• item 2` |
| `format.Warning(msg)`      | Warning prefix          | `⚠ msg`              |
| `format.KeyValue(k, v)`    | Key-value pair          | `Key: Value`         |
| `format.Summary(pairs)`    | Summary block           | Key-value summary    |

## Error Output

When a tool fails, the error text follows the same structured approach:

- **What happened** — the error
- **Why it likely happened** — context
- **What to do next** — actionable suggestion

Example: _"HeapProfiler is already in use by another operation. Wait for the current heap snapshot to finish, or call another tool in the meantime."_

## Workflow Composition

PEN tools are designed to chain. The LLM drives the composition — PEN doesn't enforce workflows.

### Tool ID Flow

Some tools produce IDs consumed by downstream tools:

| Producer                | ID Type     | Consumer                                  |
| ----------------------- | ----------- | ----------------------------------------- |
| `pen_heap_snapshot`     | snapshot ID | `pen_heap_diff`                           |
| `pen_list_pages`        | target ID   | `pen_select_page`                         |
| `pen_network_waterfall` | request ID  | `pen_network_request`                     |
| `pen_list_sources`      | script ID   | `pen_source_content`, `pen_search_source` |
| `pen_capture_trace`     | trace path  | `pen_trace_insights`                      |

IDs are opaque strings (or file paths for traces). They remain valid until PEN restarts or the resource is destroyed.

## MCP Content Types

PEN returns two content types:

### Text Content

Used by all tools for structured output:

```go
&mcp.TextContent{Text: formattedString}
```

### Image Content

Used by `pen_screenshot`:

```go
&mcp.ImageContent{MIMEType: "image/png", Data: base64String}
```

Screenshots are base64-encoded and included directly in the MCP response. The LLM can display or analyze them.
