# CDP Integration

PEN uses [chromedp](https://github.com/chromedp/chromedp) (v0.13.6) to communicate with Chrome via the Chrome DevTools Protocol over WebSocket.

## Connection Lifecycle

PEN attaches to an already-running Chrome/Chromium instance. It never launches a browser.

```mermaid
sequenceDiagram
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
    end
```

### Endpoint Discovery

On startup, PEN hits the HTTP endpoint (typically `http://localhost:9222/json/version`) to discover the browser's WebSocket URL:

```go
func DiscoverEndpoint(ctx context.Context, httpURL string) (string, error)
```

This returns a `ws://` URL like `ws://localhost:9222/devtools/browser/...` that chromedp uses to establish the CDP session.

### Connection

```go
client := cdp.NewClient("http://localhost:9222", logger)
err := client.Reconnect(ctx, 3) // 3 retries with exponential backoff
```

Internally, `Connect` calls `DiscoverEndpoint`, creates a `chromedp.NewRemoteAllocator`, then a `chromedp.NewContext`, and verifies with a no-op `chromedp.Run`. If it fails, `Reconnect` retries with exponential backoff (starting at 500ms, max 10s).

### chromedp Remote Allocator

PEN uses chromedp's remote allocator pattern (not its default browser launcher):

```go
allocCtx, cancel := chromedp.NewRemoteAllocator(ctx, wsURL)
tabCtx, cancel := chromedp.NewContext(allocCtx)
chromedp.Run(tabCtx) // no-op to verify connection
```

This connects to an existing browser instead of launching one. The allocator context manages the WebSocket connection; tab contexts manage individual page targets.

### Cleanup

`client.Close()` cancels the tab context and the allocator context. Called via `defer` in `main.go`. chromedp's context tree handles cascading cleanup — when the allocator context is cancelled, all child tab contexts are cancelled too.

## Event Listening

PEN registers CDP event listeners through a wrapper over `chromedp.ListenTarget`:

```go
func (c *Client) Listen(handler func(ev interface{})) (context.CancelFunc, error)
```

Tool handlers type-switch on event types. For example, heap snapshot streaming listens for `heapProfiler.AddHeapSnapshotChunk` events and writes each chunk to a temp file.

The listener pattern from chromedp:

```go
chromedp.ListenTarget(ctx, func(ev interface{}) {
    switch ev := ev.(type) {
    case *runtime.EventConsoleAPICalled:
        // handle console message
    case *runtime.EventExceptionThrown:
        // handle exception
    case *heapprofiler.EventAddHeapSnapshotChunk:
        // write chunk to temp file
    }
})
```

## Tab Management

### Listing Targets

```go
targets, err := client.ListTargets(ctx)
```

Returns `[]TargetInfo` with ID, Type, Title, and URL for each browser target. Used by `pen_list_pages`.

### Switching Targets

```go
tabCtx, cancel, err := client.SelectTarget(ctx, targetID)
```

Creates a new `chromedp.NewContext` with `chromedp.WithTargetID`, verifies it's reachable, and updates the client's active context. Used by `pen_select_page`.

### Finding by URL

```go
target, err := client.FindTargetByURL(ctx, urlPattern)
```

Searches targets by URL substring match. Used internally when tools accept `urlPattern` instead of `targetId`.

## CDP Domains Used

| Domain       | Tools                                                                                              | Exclusive? |
| ------------ | -------------------------------------------------------------------------------------------------- | ---------- |
| HeapProfiler | `pen_heap_snapshot`, `pen_heap_diff`, `pen_heap_track`, `pen_heap_sampling`, `pen_collect_garbage` | Yes        |
| Profiler     | `pen_cpu_profile`, `pen_js_coverage`                                                               | Yes        |
| Tracing      | `pen_capture_trace`                                                                                | Yes        |
| CSS          | `pen_css_coverage`                                                                                 | Yes        |
| Lighthouse   | `pen_lighthouse`                                                                                   | Yes        |
| Performance  | `pen_performance_metrics`                                                                          | No         |
| Network      | `pen_network_enable`, `pen_network_waterfall`, `pen_network_request`, `pen_network_blocking`       | No         |
| Page         | `pen_screenshot`, `pen_navigate`                                                                   | No         |
| Runtime      | `pen_evaluate`, `pen_web_vitals`, `pen_console_enable`, `pen_console_messages`                     | No         |
| Emulation    | `pen_emulate` (CPU throttling, network conditions)                                                 | No         |
| Debugger     | `pen_list_sources`, `pen_source_content`, `pen_search_source`                                      | No         |
| IO           | Trace streaming (`pen_capture_trace` uses `IO.read`/`IO.close` for stream data)                    | No         |
| DOM          | `pen_accessibility_check`                                                                          | No         |

"Exclusive" means PEN uses `OperationLock` to prevent two tools from using the domain simultaneously. If a second tool tries to acquire a locked domain, it returns an immediate error explaining the conflict.

## Network Event Handling

PEN listens to four network event types from the Network CDP domain:

- `Network.requestWillBeSent` — request initiated
- `Network.responseReceived` — response headers received
- `Network.loadingFinished` — request completed successfully
- `Network.loadingFailed` — request failed

These are stored in an in-memory map keyed by request ID, used by `pen_network_waterfall` and `pen_network_request`.

## DevTools Coexistence

Chrome supports multiple CDP clients on the same WebSocket. PEN can run alongside open DevTools, but:

- Only one client can control the Tracing domain at a time
- HeapProfiler operations may conflict with DevTools Memory panel usage
- This is a Chrome limitation, not a PEN limitation

PEN's domain locking prevents internal conflicts. External conflicts (DevTools vs PEN) surface as CDP errors, which PEN reports back to the LLM.
