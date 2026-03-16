# Tool Reference

PEN ships with 30 tools in 9 categories. Every tool follows MCP conventions: auto-generated `inputSchema` from Go structs, text output, and `isError: true` on failure.

## Memory (4 tools)

### `pen_heap_snapshot`

Take a V8 heap snapshot. Streamed to disk, so even massive heaps won’t blow up memory.

| Param        | Type | Default | Description                         |
| ------------ | ---- | ------- | ----------------------------------- |
| `forceGC`    | bool | true    | Force GC before snapshot            |
| `includeDOM` | bool | false   | Include detached DOM node analysis  |
| `maxDepth`   | int  | 3       | Retained size analysis depth (1–10) |

CDP: `HeapProfiler.takeHeapSnapshot`, `addHeapSnapshotChunk` events. Exclusive lock. Rate limit: **10s cooldown**.

### `pen_heap_diff`

Compare two snapshots to spot memory growth. Shows new objects, grown objects, and total delta.

| Param       | Type   | Required | Description           |
| ----------- | ------ | -------- | --------------------- |
| `snapshotA` | string | yes      | ID of first snapshot  |
| `snapshotB` | string | yes      | ID of second snapshot |

### `pen_heap_track`

Toggle heap allocation tracking for leak detection over time.

| Param              | Type   | Default | Description             |
| ------------------ | ------ | ------- | ----------------------- |
| `action`           | string | —       | `"start"` or `"stop"`   |
| `trackAllocations` | bool   | true    | Track allocation stacks |

CDP: `HeapProfiler.startTrackingHeapObjects` / `stopTrackingHeapObjects`.

### `pen_heap_sampling`

Toggle sampling-based heap profiling. Lower overhead than full snapshots.

| Param              | Type   | Default | Description           |
| ------------------ | ------ | ------- | --------------------- |
| `action`           | string | —       | `"start"` or `"stop"` |
| `samplingInterval` | int    | 32768   | Bytes between samples |

CDP: `HeapProfiler.startSampling` / `stopSampling` / `getSamplingProfile`.

---

## CPU (3 tools)

### `pen_cpu_profile`

Record a CPU profile and surface the hottest functions.

| Param        | Type | Default | Description                                |
| ------------ | ---- | ------- | ------------------------------------------ |
| `duration`   | int  | 5       | Seconds to profile (1–30)                  |
| `sampleRate` | int  | 100     | Sampling interval in microseconds (min 10) |
| `topN`       | int  | 20      | Number of top hotspot functions            |

CDP: `Profiler.start` / `stop`. Exclusive lock.

### `pen_capture_trace`

Grab a Chrome trace (DevTools Timeline). Streamed to disk via `IO.read`.

| Param        | Type     | Default | Description             |
| ------------ | -------- | ------- | ----------------------- |
| `duration`   | int      | 5       | Seconds to trace (1–30) |
| `categories` | []string | —       | Chrome trace categories |

Default categories: `devtools.timeline`, `v8.execute`, `blink.user_timing`, `loading`, `latencyInfo`, `disabled-by-default-devtools.timeline`. Exclusive lock. Rate limit: **5s cooldown**.

### `pen_trace_insights`

Crunch a previously captured trace file. Pulls out long tasks (>50ms), CLS, LCP, slowest resources, and frame timing.

| Param  | Type   | Default | Description                                        |
| ------ | ------ | ------- | -------------------------------------------------- |
| `file` | string | —       | Path to trace JSON file (from `pen_capture_trace`) |
| `topN` | int    | 10      | Number of top items per category                   |

Max file size: 100 MB. Supports both `{traceEvents:[...]}` wrapper and plain array formats.

---

## Network (4 tools)

### `pen_network_enable`

Start capturing network requests.

| Param          | Type | Default | Description                    |
| -------------- | ---- | ------- | ------------------------------ |
| `disableCache` | bool | true    | Disable browser cache          |
| `clearFirst`   | bool | true    | Clear previously captured data |

CDP: `Network.enable`.

### `pen_network_waterfall`

Show captured network requests as a waterfall table.

| Param    | Type   | Default  | Description                                |
| -------- | ------ | -------- | ------------------------------------------ |
| `sortBy` | string | `"time"` | Sort: `time`, `size`, `status`, `duration` |
| `filter` | string | —        | Filter by MIME type prefix                 |
| `limit`  | int    | 50       | Max entries                                |

Large assets flagged at **100 KB** threshold.

### `pen_network_request`

Get details of a specific captured network request.

| Param        | Type   | Description                     |
| ------------ | ------ | ------------------------------- |
| `urlPattern` | string | URL substring to match          |
| `requestID`  | string | Exact request ID from waterfall |

### `pen_network_blocking`

Identify render-blocking resources. No parameters. Returns synchronous scripts and blocking stylesheets.

---

## Coverage (2 tools)

### `pen_js_coverage`

Collect JavaScript code coverage: per-function byte ranges, used vs unused percentages.

| Param       | Type   | Default | Description                          |
| ----------- | ------ | ------- | ------------------------------------ |
| `callCount` | bool   | true    | Include per-function call counts     |
| `detailed`  | bool   | false   | Block-level coverage granularity     |
| `navigate`  | string | —       | URL to navigate to before collecting |
| `topN`      | int    | 20      | Top N scripts by unused bytes        |

CDP: `Profiler.startPreciseCoverage` / `stopPreciseCoverage`.

### `pen_css_coverage`

Collect CSS rule usage: which rules were applied vs unused.

| Param      | Type   | Default | Description                          |
| ---------- | ------ | ------- | ------------------------------------ |
| `navigate` | string | —       | URL to navigate to for full-page CSS |
| `topN`     | int    | 20      | Top N stylesheets by unused rules    |

CDP: `CSS.startRuleUsageTracking` / `stopRuleUsageTracking`.

---

## Audit (3 tools)

### `pen_performance_metrics`

Grab real-time performance counters (instant, no profiling needed). No parameters.

CDP: `Performance.getMetrics`. Returns JSHeapUsedSize, Nodes, LayoutCount, RecalcStyleCount, ScriptDuration, TaskDuration, etc.

### `pen_web_vitals`

Capture Core Web Vitals (LCP, CLS, INP estimate).

| Param        | Type | Default | Description               |
| ------------ | ---- | ------- | ------------------------- |
| `waitForLCP` | bool | true    | Wait for LCP to stabilize |

CDP: `Runtime.evaluate` with PerformanceObserver entries.

### `pen_accessibility_check`

Quick accessibility sweep: missing alt text, unlabeled inputs, contrast problems, ARIA violations.

| Param      | Type   | Description                                  |
| ---------- | ------ | -------------------------------------------- |
| `selector` | string | CSS selector to scope (default: entire page) |

CDP: `DOM`, `Runtime`.

---

## Source (3 tools)

### `pen_list_sources`

List every parsed JS source in the page.

| Param     | Type   | Default | Description                       |
| --------- | ------ | ------- | --------------------------------- |
| `refresh` | bool   | false   | Re-enable debugger for fresh list |
| `filter`  | string | —       | Filter by URL substring           |

CDP: `Debugger.enable`, `scriptParsed` events. Reports source map URLs as metadata (does not fetch or parse source maps).

### `pen_source_content`

Fetch the source of a specific script.

| Param        | Type   | Default | Description                       |
| ------------ | ------ | ------- | --------------------------------- |
| `scriptID`   | string | —       | Script ID from `pen_list_sources` |
| `urlPattern` | string | —       | URL substring (first match)       |
| `maxLines`   | int    | 200     | Truncate after N lines            |

CDP: `Debugger.getScriptSource`. You get the code as V8 sees it — bundled or minified if that’s what’s loaded.

### `pen_search_source`

Search across all loaded scripts for a string or regex pattern.

| Param           | Type   | Default | Description                |
| --------------- | ------ | ------- | -------------------------- |
| `query`         | string | —       | Search query (required)    |
| `isRegex`       | bool   | false   | Treat query as regex       |
| `caseSensitive` | bool   | false   | Case-sensitive search      |
| `maxResults`    | int    | 50      | Max results across scripts |

CDP: `Debugger.searchInContent`.

---

## Console (2 tools)

### `pen_console_enable`

Start capturing console output and exceptions. Call this before `pen_console_messages`.

| Param        | Type | Default | Description                             |
| ------------ | ---- | ------- | --------------------------------------- |
| `clearFirst` | bool | false   | Clear existing messages before starting |

CDP: `Runtime.enable`. Registers listeners for `Runtime.consoleAPICalled` and `Runtime.exceptionThrown` events. Idempotent — safe to call multiple times (uses `consoleListenerOnce`).

### `pen_console_messages`

List captured console messages with level, text, source URL, and timestamp.

| Param   | Type   | Default | Description                                        |
| ------- | ------ | ------- | -------------------------------------------------- |
| `level` | string | —       | Filter: `error`, `warning`, `log`, `info`, `debug` |
| `last`  | int    | all     | Return only the N most recent messages (max 200)   |
| `clear` | bool   | false   | Clear messages after reading                       |

Buffers up to **1,000 messages**. When full, the oldest 100 entries are evicted. Text truncated at 2,000 characters. Stack traces included for errors.

---

## Lighthouse (1 tool)

### `pen_lighthouse`

Run a full Lighthouse audit. Needs the Lighthouse CLI (`npm install -g lighthouse`).

| Param        | Type     | Default                                                  | Description         |
| ------------ | -------- | -------------------------------------------------------- | ------------------- |
| `categories` | []string | `["performance","accessibility","best-practices","seo"]` | Categories to audit |
| `url`        | string   | current page                                             | URL to audit        |

Allowed categories: `performance`, `accessibility`, `best-practices`, `seo`, `pwa`. Lighthouse connects to Chrome through the same CDP port PEN uses — no extra browser.

---

## Utility (8 tools)

### `pen_status`

Show PEN server status. No parameters. Returns connection state, version, active target, and config.

### `pen_list_pages`

List all open browser tabs with URLs, titles, and target IDs. No parameters.

### `pen_select_page`

Point PEN at a different tab.

| Param        | Type   | Description                     |
| ------------ | ------ | ------------------------------- |
| `targetId`   | string | Target ID from `pen_list_pages` |
| `urlPattern` | string | URL substring to match          |

### `pen_navigate`

Navigate the current page: go to a URL, back, forward, or reload.

| Param    | Type   | Default | Description                                       |
| -------- | ------ | ------- | ------------------------------------------------- |
| `action` | string | —       | `goto`, `back`, `forward`, or `reload` (required) |
| `url`    | string | —       | URL (required when action is `goto`)              |
| `wait`   | int    | 2       | Seconds to wait after navigation (0–30)           |

URL validation blocks dangerous schemes (`javascript:`, `data:`, `file:`, `chrome:`, `about:`, `ftp:`, `ws:`, `wss:`, `blob:`, `vbscript:`). Only HTTP and HTTPS get through. Forward navigation uses `Page.getNavigationHistory` + `Page.navigateToHistoryEntry`.

### `pen_collect_garbage`

Force V8 garbage collection. No parameters. Rate limit: **5s cooldown**.

### `pen_screenshot`

Snap a screenshot of the current page or a specific element.

| Param      | Type   | Default | Description                      |
| ---------- | ------ | ------- | -------------------------------- |
| `selector` | string | —       | CSS selector for element capture |
| `fullPage` | bool   | false   | Full page capture                |
| `format`   | string | `"png"` | `png`, `jpeg`, or `webp`         |
| `quality`  | int    | —       | 0–100 for jpeg/webp              |

Returns base64-encoded image in `mcp.ImageContent`.

### `pen_emulate`

Set device emulation: CPU throttling, network throttling, viewport presets.

| Param               | Type    | Description                               |
| ------------------- | ------- | ----------------------------------------- |
| `device`            | string  | Preset: `iPhone 14`, `Pixel 7`, `iPad`    |
| `cpuThrottling`     | float64 | CPU slowdown factor (e.g., 4 = 4x slower) |
| `networkThrottling` | string  | `3G`, `4G`, or `WiFi`                     |

Network presets: 3G (563ms latency, 188KB/s), 4G (170ms, 500KB/s), WiFi (2ms, 3.75MB/s).

### `pen_evaluate`

Run JavaScript in the page context. **Requires the `--allow-eval` flag.**

| Param           | Type   | Default | Description              |
| --------------- | ------ | ------- | ------------------------ |
| `expression`    | string | —       | JS expression (required) |
| `returnByValue` | bool   | true    | Return result by value   |

Gated by `--allow-eval` flag and an expression blocklist. See [Security](/docs/security).

---

## Rate Limits

| Tool                  | Cooldown | Reason                   |
| --------------------- | -------- | ------------------------ |
| `pen_heap_snapshot`   | 10s      | Heavy GC + disk I/O      |
| `pen_capture_trace`   | 5s       | Exclusive Tracing domain |
| `pen_collect_garbage` | 5s       | V8 GC is expensive       |

All other tools: no cooldown.

## Tool Chaining

Tools produce IDs consumed by downstream tools:

| Producer                | Consumer                                  | ID Type         |
| ----------------------- | ----------------------------------------- | --------------- |
| `pen_heap_snapshot`     | `pen_heap_diff`                           | Snapshot ID     |
| `pen_list_pages`        | `pen_select_page`                         | Target ID       |
| `pen_network_waterfall` | `pen_network_request`                     | Request ID      |
| `pen_list_sources`      | `pen_source_content`, `pen_search_source` | Script ID       |
| `pen_capture_trace`     | `pen_trace_insights`                      | Trace File Path |
| `pen_console_enable`    | `pen_console_messages`                    | — (implicit)    |

IDs stay valid until PEN restarts or the underlying thing goes away (tab closed, page navigated, etc.).
