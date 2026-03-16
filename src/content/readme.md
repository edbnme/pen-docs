# PEN

MCP server that connects AI assistants to Chrome DevTools. Ask your AI to profile a page, find a memory leak, or measure coverage — PEN runs the browser profiling and returns structured results.

Single Go binary. No Node.js. No browser launch. Attach to your dev browser and go.

## How It Works

```
AI Assistant ◄── MCP (stdio / HTTP) ──► PEN (Go) ── CDP (WebSocket) ──► Chrome
```

Your IDE (VS Code, Cursor, Claude Desktop) spawns PEN as a child process. When an LLM calls a tool like `pen_heap_snapshot`, PEN translates it to Chrome DevTools Protocol commands, streams results to disk, and returns structured analysis the LLM can interpret.

## What You Can Do

| Category       | What it does                                                               | Tools   |
| -------------- | -------------------------------------------------------------------------- | ------- |
| **Memory**     | Heap snapshots, diff two snapshots for leak detection, allocation tracking | 4 tools |
| **CPU**        | CPU profiling, Chrome traces, offline trace analysis                       | 3 tools |
| **Network**    | Request capture, waterfall view, render-blocking detection                 | 4 tools |
| **Coverage**   | JavaScript and CSS code coverage with unused byte analysis                 | 2 tools |
| **Audit**      | Performance metrics, Core Web Vitals, accessibility scan                   | 3 tools |
| **Source**     | List loaded scripts, retrieve source, search across all scripts            | 3 tools |
| **Console**    | Real-time console message capture and filtering                            | 2 tools |
| **Lighthouse** | Full Lighthouse audits (requires CLI)                                      | 1 tool  |
| **Utility**    | Navigation, screenshots, eval, device emulation, tab management            | 8 tools |

30 tools total. See the full [Tool Reference](/docs/tool-catalog).

## Quick Start

```bash
# Install
curl -fsSL https://raw.githubusercontent.com/edbnme/pen/main/install.sh | sh

# Interactive setup wizard
pen init
```

`pen init` auto-detects your environment, lets you pick your IDE and browser, generates the MCP config, and verifies the connection — all in one command.

Or install via package managers:

```bash
brew install edbnme/tap/pen    # macOS / Linux
scoop bucket add pen https://github.com/edbnme/scoop-pen && scoop install pen  # Windows
```

Full install guide: [Installation](/docs/install)

## Example

Ask your AI assistant:

> _"Check the performance metrics of this page"_

PEN connects to Chrome, runs `pen_performance_metrics` via CDP, and returns:

```
┌ Performance Metrics
│ Metric              │ Value    │ Status
│ JSHeapUsedSize      │ 82.4 MB  │ ⚠ High
│ Nodes               │ 4,521    │
│ LayoutCount         │ 12       │
│ RecalcStyleCount    │ 8        │
│ ScriptDuration      │ 1.23s    │ ⚠ Slow
└
```

The LLM reads this, identifies the high heap usage and slow script duration, and suggests fixes — all without you touching DevTools.

## Key Design Decisions

| Decision       | Choice                     | Why                                                             |
| -------------- | -------------------------- | --------------------------------------------------------------- |
| Language       | Go 1.24                    | Single binary, chromedp + MCP Go SDK                            |
| Transport      | stdio (default), HTTP      | stdio for IDE spawning; HTTP for shared/remote                  |
| CDP            | Attach to existing browser | Never launches a browser — your dev browser is already running  |
| Large payloads | Stream to disk             | Heap snapshots can exceed 1 GB; PEN uses constant memory        |
| Security       | Layered gates              | Eval gating, expression blocklist, path validation, rate limits |

## vs chrome-devtools-mcp

Google maintains [`chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp) — a general DevTools MCP server for navigation, DOM, screenshots, network, traces, memory, and Lighthouse.

PEN is performance-focused: differential heap analysis (multi-snapshot leak detection), streaming architecture for multi-GB payloads, Go single binary (no Node.js runtime), and every tool designed to answer "why is this slow?" rather than "what's on the page?". The two can complement each other.

## Docs

| Section                                  | Description                                    |
| ---------------------------------------- | ---------------------------------------------- |
| [Installation](/docs/install)            | Install, browser setup, IDE config, `pen init` |
| [Running PEN](/docs/running)             | Flags, Docker, server deploys                  |
| [Tool Reference](/docs/tool-catalog)     | Every tool's params and output                 |
| [Workflows](/docs/workflows)             | Common tool chains and recipes                 |
| [Troubleshooting](/docs/troubleshooting) | Common issues and fixes                        |
| [Security](/docs/security)               | Threat model and defenses                      |
| [Architecture](/docs/architecture)       | System design (for contributors)               |
