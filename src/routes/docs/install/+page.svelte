<script lang="ts">
  import DocPage from "$lib/content/DocPage.svelte";
  import CodeBlock from "$lib/content/CodeBlock.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<DocPage
  title={data.title}
  description={data.description}
  slug={data.slug}
  headings={data.headings}
>
  <h1>Installation</h1>

  <h2 id="what-you-need">What You Need</h2>

  <ul>
    <li>A Chromium browser (Chrome, Edge, Brave)</li>
    <li>
      An MCP-capable editor (VS Code + Copilot, Cursor, or Claude Desktop)
    </li>
  </ul>

  <p>That's it. No Go, no Node.js — just download the binary.</p>

  <p>
    <strong>Optional:</strong> The <code>pen_lighthouse</code> tool needs the Lighthouse
    CLI:
  </p>

  <CodeBlock lang="bash" code="npm install -g lighthouse" />

  <p>All other 29 tools work without it.</p>

  <h2 id="quick-install-recommended">Quick Install (Recommended)</h2>

  <p>One command to download PEN, then run the interactive setup wizard:</p>

  <p><strong>macOS / Linux:</strong></p>

  <CodeBlock
    lang="bash"
    code={`curl -fsSL https://raw.githubusercontent.com/edbnme/pen/main/install.sh | sh
pen init`}
  />

  <p><strong>Windows (PowerShell):</strong></p>

  <CodeBlock
    lang="powershell"
    code={`irm https://raw.githubusercontent.com/edbnme/pen/main/install.ps1 | iex
pen init`}
  />

  <h3 id="the-pen-init-wizard">The <code>pen init</code> Wizard</h3>

  <p>
    <code>pen init</code> is a full interactive setup wizard powered by
    <a
      href="https://github.com/charmbracelet/huh"
      target="_blank"
      rel="noopener noreferrer">charmbracelet/huh</a
    >. It handles everything — detecting what's on your machine, asking a few
    questions, and writing the config files so you don't have to.
  </p>

  <p>
    <strong>Phase 1 — Environment scan.</strong> PEN detects your OS and
    architecture, then searches for installed Chromium browsers (Chrome, Edge,
    Brave) and MCP-capable IDEs (VS Code, Cursor, Claude Desktop). On macOS it
    checks <code>/Applications</code>, on Windows it checks Program Files and
    LocalAppData, on Linux it uses <code>$PATH</code>.
  </p>

  <p>
    <strong>Phase 2 — Interactive config.</strong> A form-based TUI asks you to:
  </p>

  <ul>
    <li>Pick your IDE (detected ones appear first, with a "skip" option)</li>
    <li>Pick your browser</li>
    <li>Set the CDP port (defaults to <code>9222</code>)</li>
    <li>
      Enable or disable <code>pen_evaluate</code> (disabled by default — it lets PEN
      run JavaScript in the browser)
    </li>
  </ul>

  <p>
    <strong>Phase 3 — Write the config.</strong> PEN generates the correct MCP config
    for your IDE:
  </p>

  <ul>
    <li>
      <strong>VS Code</strong> → <code>.vscode/mcp.json</code> (key:
      <code>"servers"</code>)
    </li>
    <li>
      <strong>Cursor</strong> → <code>.cursor/mcp.json</code> (key:
      <code>"mcpServers"</code>)
    </li>
    <li>
      <strong>Claude Desktop</strong> → platform-specific path (key:
      <code>"mcpServers"</code>)
    </li>
  </ul>

  <p>
    If a config already exists, PEN asks before overwriting. Other server
    entries in the file are preserved.
  </p>

  <p>
    <strong>Phase 4 — Launch the browser.</strong> Optionally opens your browser
    with <code>--remote-debugging-port</code> set. If PEN can't launch it automatically,
    it prints the exact command for your OS.
  </p>

  <p>
    <strong>Phase 5 — Verify the connection.</strong> Tests
    <code>http://localhost:PORT/json</code> and reports how many tabs are open. If
    it can't connect yet, that's fine — PEN connects when your IDE starts it.
  </p>

  <p>Works after any install method.</p>

  <h2 id="package-managers">Package Managers</h2>

  <h3 id="homebrew-macos--linux">Homebrew (macOS / Linux)</h3>

  <CodeBlock lang="bash" code="brew install edbnme/tap/pen" />

  <h3 id="scoop-windows">Scoop (Windows)</h3>

  <CodeBlock
    lang="powershell"
    code={`scoop bucket add pen https://github.com/edbnme/scoop-pen
scoop install pen`}
  />

  <h2 id="github-releases">GitHub Releases</h2>

  <p>
    Grab the latest binary from the
    <a
      href="https://github.com/edbnme/pen/releases/latest"
      target="_blank"
      rel="noopener noreferrer">Releases page</a
    >.
  </p>

  <p><strong>macOS / Linux:</strong></p>

  <CodeBlock
    lang="bash"
    code={`curl -Lo pen.tar.gz "https://github.com/edbnme/pen/releases/latest/download/pen_$(uname -s | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/' | sed 's/aarch64/arm64/').tar.gz"
tar xzf pen.tar.gz pen
sudo mv pen /usr/local/bin/`}
  />

  <p>
    <strong>Windows:</strong> Download the <code>.zip</code> from releases,
    extract <code>pen.exe</code>, put it somewhere on your <code>PATH</code>.
  </p>

  <h2 id="go-install">go install</h2>

  <CodeBlock
    lang="bash"
    code="go install github.com/edbnme/pen/cmd/pen@latest"
  />

  <p>
    Requires Go 1.24+. Binary goes to <code>$(go env GOPATH)/bin</code> — make
    sure that's on your <code>PATH</code>.
  </p>

  <h2 id="from-source">From Source</h2>

  <CodeBlock
    lang="bash"
    code={`git clone https://github.com/edbnme/pen.git
cd pen
go build -o pen ./cmd/pen        # Linux / macOS
go build -o pen.exe ./cmd/pen    # Windows`}
  />

  <p>Requires Go 1.24+. Dependencies download automatically.</p>

  <h2 id="verify">Verify</h2>

  <CodeBlock
    lang="bash"
    code={`pen --version
# pen v0.x.x (or "pen dev" when built without version flags)`}
  />

  <h2 id="start-your-browser">Start Your Browser</h2>

  <p>
    Close the browser <strong>all the way</strong> first — every window, every background
    process. The debug port only works when Chrome launches fresh with the flag.
  </p>

  <p><strong>macOS:</strong></p>

  <CodeBlock
    lang="bash"
    code="open -a &quot;Google Chrome&quot; --args --remote-debugging-port=9222"
  />

  <p><strong>Windows (PowerShell):</strong></p>

  <CodeBlock
    lang="powershell"
    code={`# Chrome
& "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222

# Edge
& "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe" --remote-debugging-port=9222`}
  />

  <p><strong>Linux:</strong></p>

  <CodeBlock lang="bash" code="google-chrome --remote-debugging-port=9222" />

  <p>
    <strong>Verify:</strong> open <code>http://localhost:9222/json</code> in a new
    tab — you should see a JSON array of open tabs.
  </p>

  <blockquote>
    <p>
      <strong>Still stuck?</strong> The browser wasn't fully killed before
      relaunch. On Windows, hit <code>Ctrl+Shift+Esc</code> and end all
      Chrome/Edge processes. On macOS, <code>killall "Google Chrome"</code> and try
      again.
    </p>
  </blockquote>

  <h2 id="configure-your-ide">Configure Your IDE</h2>

  <p>
    PEN runs as a child process of your editor. Configure it once, then forget
    about it.
  </p>

  <h3 id="vs-code--github-copilot">VS Code + GitHub Copilot</h3>

  <p><code>.vscode/mcp.json</code> in your project:</p>

  <CodeBlock
    lang="json"
    code={`{
  "servers": {
    "pen": {
      "command": "pen",
      "args": ["--project-root", "\${workspaceFolder}"]
    }
  }
}`}
  />

  <h3 id="cursor">Cursor</h3>

  <p>
    <code>.cursor/mcp.json</code> in your project (or
    <code>~/.cursor/mcp.json</code> for global):
  </p>

  <CodeBlock
    lang="json"
    code={`{
  "mcpServers": {
    "pen": {
      "command": "pen",
      "args": ["--project-root", "\${workspaceFolder}"]
    }
  }
}`}
  />

  <h3 id="claude-desktop">Claude Desktop</h3>

  <p>Config file location:</p>

  <ul>
    <li>
      <strong>macOS:</strong>
      <code
        >~/Library/Application Support/Claude/claude_desktop_config.json</code
      >
    </li>
    <li>
      <strong>Windows:</strong>
      <code>%APPDATA%\Claude\claude_desktop_config.json</code>
    </li>
  </ul>

  <CodeBlock
    lang="json"
    code={`{
  "mcpServers": {
    "pen": {
      "command": "pen",
      "args": ["--project-root", "/absolute/path/to/project"]
    }
  }
}`}
  />

  <p>
    Claude Desktop doesn't support <code>$&#123;workspaceFolder&#125;</code> — use
    the full path.
  </p>

  <blockquote>
    <p>
      If <code>pen</code> isn't on your PATH, use the full binary path in the
      <code>command</code> field.
    </p>
  </blockquote>

  <h2 id="test-it">Test It</h2>

  <ol>
    <li>Browser running with <code>--remote-debugging-port=9222</code></li>
    <li>Open a page in that browser</li>
    <li>Ask your AI: <em>"Check the performance metrics of this page"</em></li>
  </ol>

  <p>
    PEN connects, runs the profiling, and hands back results. If something goes
    wrong, check the MCP output panel in your IDE — PEN logs to stderr.
  </p>
</DocPage>
