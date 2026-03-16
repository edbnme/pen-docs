# Installation

## What You Need

- A Chromium browser (Chrome, Edge, Brave)
- An MCP-capable editor (VS Code + Copilot, Cursor, or Claude Desktop)

That's it. No Go, no Node.js — just download the binary.

**Optional:** The `pen_lighthouse` tool needs the Lighthouse CLI:

```bash
npm install -g lighthouse
```

All other 29 tools work without it.

## Quick Install (Recommended)

One command to download PEN, then run the interactive setup wizard:

**macOS / Linux:**

```bash
curl -fsSL https://raw.githubusercontent.com/edbnme/pen/main/install.sh | sh
pen init
```

**Windows (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/edbnme/pen/main/install.ps1 | iex
pen init
```

### The `pen init` Wizard

`pen init` is a full interactive setup wizard powered by [charmbracelet/huh](https://github.com/charmbracelet/huh). It handles everything — detecting what's on your machine, asking a few questions, and writing the config files so you don't have to.

**Phase 1 — Environment scan.** PEN detects your OS and architecture, then searches for installed Chromium browsers (Chrome, Edge, Brave) and MCP-capable IDEs (VS Code, Cursor, Claude Desktop). On macOS it checks `/Applications`, on Windows it checks Program Files and LocalAppData, on Linux it uses `$PATH`.

**Phase 2 — Interactive config.** A form-based TUI asks you to:

- Pick your IDE (detected ones appear first, with a "skip" option)
- Pick your browser
- Set the CDP port (defaults to `9222`)
- Enable or disable `pen_evaluate` (disabled by default — it lets PEN run JavaScript in the browser)

**Phase 3 — Write the config.** PEN generates the correct MCP config for your IDE:

- **VS Code** → `.vscode/mcp.json` (key: `"servers"`)
- **Cursor** → `.cursor/mcp.json` (key: `"mcpServers"`)
- **Claude Desktop** → platform-specific path (key: `"mcpServers"`)

If a config already exists, PEN asks before overwriting. Other server entries in the file are preserved.

**Phase 4 — Launch the browser.** Optionally opens your browser with `--remote-debugging-port` set. If PEN can't launch it automatically, it prints the exact command for your OS.

**Phase 5 — Verify the connection.** Tests `http://localhost:PORT/json` and reports how many tabs are open. If it can't connect yet, that's fine — PEN connects when your IDE starts it.

Works after any install method.

## Package Managers

### Homebrew (macOS / Linux)

```bash
brew install edbnme/tap/pen
```

### Scoop (Windows)

```powershell
scoop bucket add pen https://github.com/edbnme/scoop-pen
scoop install pen
```

## GitHub Releases

Grab the latest binary from the [Releases page](https://github.com/edbnme/pen/releases/latest).

**macOS / Linux:**

```bash
curl -Lo pen.tar.gz "https://github.com/edbnme/pen/releases/latest/download/pen_$(uname -s | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/' | sed 's/aarch64/arm64/').tar.gz"
tar xzf pen.tar.gz pen
sudo mv pen /usr/local/bin/
```

**Windows:** Download the `.zip` from releases, extract `pen.exe`, put it somewhere on your `PATH`.

## go install

```bash
go install github.com/edbnme/pen/cmd/pen@latest
```

Requires Go 1.24+. Binary goes to `$(go env GOPATH)/bin` — make sure that's on your `PATH`.

## From Source

```bash
git clone https://github.com/edbnme/pen.git
cd pen
go build -o pen ./cmd/pen        # Linux / macOS
go build -o pen.exe ./cmd/pen    # Windows
```

Requires Go 1.24+. Dependencies download automatically.

## Verify

```bash
pen --version
# pen v0.x.x (or "pen dev" when built without version flags)
```

## Start Your Browser

Close the browser **all the way** first — every window, every background process. The debug port only works when Chrome launches fresh with the flag.

**macOS:**

```bash
open -a "Google Chrome" --args --remote-debugging-port=9222
```

**Windows (PowerShell):**

```powershell
# Chrome
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222

# Edge
& "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --remote-debugging-port=9222
```

**Linux:**

```bash
google-chrome --remote-debugging-port=9222
```

**Verify:** open `http://localhost:9222/json` in a new tab — you should see a JSON array of open tabs.

> **Still stuck?** The browser wasn't fully killed before relaunch. On Windows, hit `Ctrl+Shift+Esc` and end all Chrome/Edge processes. On macOS, `killall "Google Chrome"` and try again.

## Configure Your IDE

PEN runs as a child process of your editor. Configure it once, then forget about it.

### VS Code + GitHub Copilot

`.vscode/mcp.json` in your project:

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

### Cursor

`.cursor/mcp.json` in your project (or `~/.cursor/mcp.json` for global):

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

### Claude Desktop

Config file location:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

Claude Desktop doesn't support `${workspaceFolder}` — use the full path.

> If `pen` isn't on your PATH, use the full binary path in the `command` field.

## Test It

1. Browser running with `--remote-debugging-port=9222`
2. Open a page in that browser
3. Ask your AI: _"Check the performance metrics of this page"_

PEN connects, runs the profiling, and hands back results. If something goes wrong, check the MCP output panel in your IDE — PEN logs to stderr.
