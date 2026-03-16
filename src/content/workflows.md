# Workflows

PEN tools are designed to chain. The LLM drives the composition — PEN doesn't enforce workflows. These are proven patterns for common performance investigations.

## Memory Leak Investigation

```mermaid
flowchart LR
    A["pen_collect_garbage"] --> B["pen_heap_snapshot (A)"]
    B --> C(["User action"])
    C --> D["pen_heap_snapshot (B)"]
    D --> E["pen_heap_diff (A, B)"]
```

1. Force GC to get a clean baseline
2. Take snapshot A
3. Have the user reproduce the suspected leak (navigate, open/close a modal, etc.)
4. Take snapshot B
5. Diff the two snapshots — PEN shows new objects, grown objects, and total delta

The diff output highlights retained objects that grew between snapshots, which are your leak candidates. The LLM can then suggest the root cause based on the object types and retainer chains.

> **Tip:** For allocation tracking over time (without two manual snapshots), use `pen_heap_track` with `action: "start"`, reproduce the issue, then `action: "stop"`.

## Page Load Optimization

```mermaid
flowchart LR
    A[pen_navigate] --> B[pen_capture_trace]
    B --> C[pen_trace_insights]
    C --> D[pen_network_waterfall]
    D --> E[pen_web_vitals]
```

1. Navigate to the target page
2. Capture a Chrome trace during load
3. Analyze the trace for long tasks (>50ms), LCP, CLS, and slow resources
4. Check the network waterfall for large assets, slow requests, and render-blocking resources
5. Measure Core Web Vitals for the final score

This gives the LLM a complete picture: trace-level timing, network bottlenecks, and the actual Web Vitals numbers all in one flow.

## Console Debugging

```mermaid
flowchart LR
    A[pen_console_enable] --> B(["User triggers problem"])
    B --> C["pen_console_messages<br/>(level=error)"]
```

1. Start console capture to wire up the CDP listener
2. Have the user reproduce the issue
3. Pull error messages — filtering by `level=error` keeps noise down

Console messages include source URLs, line numbers, and stack traces for exceptions. The buffer holds up to 1,000 messages; oldest 100 are evicted when full.

## Full Page Audit

```mermaid
flowchart LR
    A[pen_navigate] --> B[pen_lighthouse]
    B --> C[pen_capture_trace]
    C --> D[pen_trace_insights]
```

1. Navigate to the page
2. Run Lighthouse for a high-level score (performance, accessibility, SEO, best practices)
3. Capture a trace for the detailed timeline
4. Analyze the trace to pinpoint exactly what Lighthouse flagged

Lighthouse tells you _what's wrong_; trace insights tell you _why_ and _where_ in the execution timeline.

## Bundle Audit

```mermaid
flowchart LR
    A["pen_js_coverage<br/>(start)"] --> B([Navigate])
    B --> C["pen_js_coverage<br/>(stop)"]
    C --> D["pen_css_coverage<br/>(start)"]
    D --> E([Navigate])
    E --> F["pen_css_coverage<br/>(stop)"]
```

1. Start JS coverage
2. Navigate to the page (full page load)
3. Stop JS coverage — see which scripts have the most unused bytes
4. Repeat for CSS coverage

This identifies dead code. The LLM can recommend code splitting or tree-shaking based on the unused byte percentages.

## Multi-Tab Profiling

```mermaid
flowchart LR
    A[pen_list_pages] --> B[pen_select_page]
    B --> C[pen_cpu_profile]
    C --> D[pen_performance_metrics]
```

1. List all browser tabs
2. Switch to the target tab
3. Profile CPU on that tab
4. Grab performance metrics

Useful when your app spans multiple tabs or you need to compare performance across different pages.

## Trace-Driven Analysis

```mermaid
flowchart LR
    A[pen_capture_trace] --> B[pen_trace_insights]
```

Capture a raw trace file, then hand it to `pen_trace_insights` for a structured breakdown. No need to leave the MCP conversation to analyze the trace manually. The insights include:

- Long tasks (>50ms threshold)
- Layout shifts (CLS contributors)
- Largest Contentful Paint timing
- Slowest resources
- Frame timing and dropped frames (>33.3ms = below 30fps)

## Network Performance

```mermaid
flowchart LR
    A[pen_network_enable] --> B(["Interact with page"])
    B --> C[pen_network_waterfall]
    C --> D["pen_network_request<br/>(specific URL)"]
```

1. Enable network capture (optionally disable cache)
2. Interact with the page — navigate, click, scroll
3. View the waterfall to spot slow requests, large assets, or 4xx/5xx errors
4. Drill into a specific request for full headers, timing, and body details

## Device Simulation

```mermaid
flowchart LR
    A["pen_emulate<br/>(device + throttling)"] --> B[pen_navigate]
    B --> C[pen_web_vitals]
    C --> D[pen_capture_trace]
```

1. Set device emulation (e.g., iPhone 14 with 4G network + 4x CPU throttle)
2. Navigate to the page
3. Measure Web Vitals under throttled conditions
4. Capture a trace to see what's slow on constrained hardware

Network presets: `3G` (563ms latency, 188KB/s down), `4G` (170ms, 500KB/s), `WiFi` (2ms, 3.75MB/s).

## Tool ID Flow

Some tools produce IDs consumed by downstream tools:

```mermaid
flowchart LR
    HS[pen_heap_snapshot] -->|snapshot ID| HD[pen_heap_diff]
    LP[pen_list_pages] -->|target ID| SP[pen_select_page]
    NW[pen_network_waterfall] -->|request ID| NR[pen_network_request]
    LS[pen_list_sources] -->|script ID| SC[pen_source_content]
    LS -->|script ID| SS[pen_search_source]
    CT[pen_capture_trace] -->|trace path| TI[pen_trace_insights]
```

| Producer                | ID Type     | Consumer                                  |
| ----------------------- | ----------- | ----------------------------------------- |
| `pen_heap_snapshot`     | snapshot ID | `pen_heap_diff`                           |
| `pen_list_pages`        | target ID   | `pen_select_page`                         |
| `pen_network_waterfall` | request ID  | `pen_network_request`                     |
| `pen_list_sources`      | script ID   | `pen_source_content`, `pen_search_source` |
| `pen_capture_trace`     | trace path  | `pen_trace_insights`                      |

IDs are opaque strings (or file paths for traces). They remain valid until PEN restarts or the referenced resource is destroyed (tab closed, page navigated, etc.).
