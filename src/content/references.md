# References

Sources, specifications, and prior art referenced during PEN's development.

## Core Specifications

### Chrome DevTools Protocol

The CDP spec defines every domain PEN uses:

| Domain         | Purpose                                  | Reference                                                                                                                          |
| -------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Runtime`      | Console messages, JS evaluation          | [chromedevtools.github.io/devtools-protocol/tot/Runtime](https://chromedevtools.github.io/devtools-protocol/tot/Runtime)           |
| `Network`      | Request/response interception, waterfall | [chromedevtools.github.io/devtools-protocol/tot/Network](https://chromedevtools.github.io/devtools-protocol/tot/Network)           |
| `Page`         | Navigation, screenshots, lifecycle       | [chromedevtools.github.io/devtools-protocol/tot/Page](https://chromedevtools.github.io/devtools-protocol/tot/Page)                 |
| `HeapProfiler` | Heap snapshots, allocation tracking      | [chromedevtools.github.io/devtools-protocol/tot/HeapProfiler](https://chromedevtools.github.io/devtools-protocol/tot/HeapProfiler) |
| `Profiler`     | CPU profiling                            | [chromedevtools.github.io/devtools-protocol/tot/Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler)         |
| `Debugger`     | Source maps, script sources              | [chromedevtools.github.io/devtools-protocol/tot/Debugger](https://chromedevtools.github.io/devtools-protocol/tot/Debugger)         |
| `Tracing`      | Performance traces                       | [chromedevtools.github.io/devtools-protocol/tot/Tracing](https://chromedevtools.github.io/devtools-protocol/tot/Tracing)           |
| `Audits`       | Lighthouse-style audits                  | [chromedevtools.github.io/devtools-protocol/tot/Audits](https://chromedevtools.github.io/devtools-protocol/tot/Audits)             |
| `Target`       | Tab management, target discovery         | [chromedevtools.github.io/devtools-protocol/tot/Target](https://chromedevtools.github.io/devtools-protocol/tot/Target)             |

### Model Context Protocol

- **Specification**: [spec.modelcontextprotocol.io/2025-03-26](https://spec.modelcontextprotocol.io/2025-03-26/)
- **Transport**: stdio (stdin/stdout JSON-RPC 2.0)
- **Capabilities used**: Tools (ListTools, CallTool)
- **SDK**: [github.com/modelcontextprotocol/go-sdk](https://github.com/modelcontextprotocol/go-sdk)

## Go Libraries

| Library                                  | Version      | Purpose                                  |
| ---------------------------------------- | ------------ | ---------------------------------------- |
| `github.com/modelcontextprotocol/go-sdk` | v1.3.1       | MCP server implementation                |
| `github.com/chromedp/chromedp`           | v0.13.6      | Chrome DevTools Protocol client          |
| `github.com/chromedp/cdproto`            | (transitive) | CDP type definitions                     |
| `github.com/charmbracelet/huh`           | v1.0.0       | Interactive terminal wizard (`pen init`) |
| `github.com/charmbracelet/lipgloss`      | v1.1.0       | Terminal output styling                  |

All versions are from [go.mod](https://github.com/nicholasgasior/pen/blob/main/go.mod). PEN requires Go 1.24.2+.

## Prior Art

Tools and projects that informed PEN's design:

| Tool                | Relationship to PEN                                                      |
| ------------------- | ------------------------------------------------------------------------ |
| **Chrome DevTools** | PEN exposes the same browser internals, but through MCP instead of a GUI |
| **Puppeteer**       | Node.js CDP library; PEN uses chromedp (Go) for the same protocol        |
| **Playwright**      | Multi-browser automation; PEN focuses on Chrome-only MCP integration     |
| **Lighthouse CLI**  | PEN wraps CDP audit domains rather than shelling out to Lighthouse       |
| **web-vitals**      | Client-side metrics; PEN collects the same metrics server-side via CDP   |

## Architecture References

- **Go concurrency patterns**: `sync.Mutex` for operation locks, `context.Context` for cancellation, goroutines for event listeners
- **Graceful degradation**: Partial results preferred over hard failures (see [Error Handling](/docs/error-handling))
- **Token-aware output**: All tool output designed for LLM context windows (see [Output Design](/docs/output-design))

## Project Links

| Resource      | URL                                                                    |
| ------------- | ---------------------------------------------------------------------- |
| Source code   | [github.com/nicholasgasior/pen](https://github.com/nicholasgasior/pen) |
| Documentation | [pen-docs (this site)](https://github.com/edbnme/pen-docs)             |
| Go module     | `github.com/nicholasgasior/pen`                                        |
| License       | MIT                                                                    |
