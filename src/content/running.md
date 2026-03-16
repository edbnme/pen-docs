# Running PEN

## Local Usage

```bash
pen                                          # defaults: stdio, localhost:9222
pen --cdp-url http://localhost:9222 --log-level debug
pen --allow-eval --project-root /my/project
```

PEN prints `PEN ready` to stderr and waits for MCP messages on stdin/stdout. Normally your IDE handles this — you don’t run PEN by hand.

## Flags

| Flag             | Default                 | Purpose                                    |
| ---------------- | ----------------------- | ------------------------------------------ |
| `--cdp-url`      | `http://localhost:9222` | CDP endpoint                               |
| `--transport`    | `stdio`                 | `stdio`, `http`, or `sse`                  |
| `--addr`         | `localhost:6100`        | Bind address for HTTP/SSE                  |
| `--allow-eval`   | `false`                 | Enable `pen_evaluate` (runs JS in browser) |
| `--project-root` | `.`                     | Sandbox for source file paths              |
| `--log-level`    | `info`                  | `debug` / `info` / `warn` / `error`        |
| `--version`      | —                       | Print version and exit                     |

Both `-flag` and `--flag` work. All flags are optional.

## HTTP Transport

For network-accessible use instead of stdio:

```bash
pen --transport http --addr localhost:6100
```

Serves MCP at `http://localhost:6100/mcp`. The `sse` transport works identically — both use `mcp.NewStreamableHTTPHandler` under the hood.

## Browser Setup

Close the browser **all the way** first — every window, every background process. The debug port only works when Chrome launches fresh with the flag.

**macOS:**

```bash
open -a "Google Chrome" --args --remote-debugging-port=9222
```

**Windows (PowerShell):**

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222       # Chrome
& "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --remote-debugging-port=9222      # Edge
```

**Linux:**

```bash
google-chrome --remote-debugging-port=9222
```

Verify: `http://localhost:9222/json` should return a JSON array of open tabs.

## IDE Config

Your editor spawns PEN as a child process. Set it up once, then forget it.

**VS Code** — `.vscode/mcp.json`:

```json
{
  "servers": {
    "pen": {
      "command": "pen",
      "args": ["--project-root", "${workspaceFolder}"]
    }
  }
}
```

**Cursor** — `.cursor/mcp.json` in your project (or `~/.cursor/mcp.json` for global):

```json
{
  "mcpServers": {
    "pen": {
      "command": "pen",
      "args": ["--project-root", "${workspaceFolder}"]
    }
  }
}
```

**Claude Desktop** — `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "pen": {
      "command": "pen",
      "args": ["--project-root", "/absolute/path/to/project"]
    }
  }
}
```

## Building from Source

```bash
git clone https://github.com/edbnme/pen.git && cd pen
go build -o pen ./cmd/pen        # Linux / macOS
go build -o pen.exe ./cmd/pen    # Windows
```

Requires Go 1.24+. Dependencies download automatically.

### Production Build

```bash
go build -ldflags "-s -w -X main.version=v1.0.0" -o pen ./cmd/pen
```

Cross-compiled via GoReleaser for linux/darwin/windows on amd64 and arm64.

## Docker

```dockerfile
FROM golang:1.24-bookworm AS builder
WORKDIR /app
COPY . .
RUN go build -o pen ./cmd/pen

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/pen /usr/local/bin/pen
CMD ["sh", "-c", "google-chrome --headless --no-sandbox --disable-gpu --remote-debugging-port=9222 --remote-debugging-address=127.0.0.1 & sleep 2 && exec pen --cdp-url http://127.0.0.1:9222"]
```

For real deployments, use a process manager (supervisord, etc.) instead of backgrounding Chrome with `&`.

## Server / CI

CDP is locked to localhost on purpose. That’s a security choice, not a limitation.

### Headless Chrome

```bash
google-chrome --headless --no-sandbox --disable-gpu \
  --remote-debugging-port=9222 --remote-debugging-address=127.0.0.1 &
pen --cdp-url http://127.0.0.1:9222
```

### SSH Tunnel

Forward a remote CDP port to localhost:

```bash
ssh -L 9222:localhost:9222 user@server
pen --cdp-url http://localhost:9222
```

### Security Notes

- Never expose port 9222 to the network
- `--no-sandbox` only in containers, not bare metal
- `--allow-eval` only in trusted environments
- Always set `--project-root` in production

## Optional: Lighthouse CLI

The `pen_lighthouse` tool shells out to the Lighthouse CLI for full audits. Install it separately:

```bash
npm install -g lighthouse
```

If Lighthouse isn’t installed, every other PEN tool still works fine. Only `pen_lighthouse` needs it.
