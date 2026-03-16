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
  <h1>Running PEN</h1>

  <h2 id="local-usage">Local Usage</h2>

  <CodeBlock
    lang="bash"
    code={`pen                                          # defaults: stdio, localhost:9222
pen --cdp-url http://localhost:9222 --log-level debug
pen --allow-eval --project-root /my/project`}
  />

  <p>
    PEN prints <code>PEN ready</code> to stderr and waits for MCP messages on
    stdin/stdout. Normally your IDE handles this — you don't run PEN by hand.
  </p>

  <h2 id="flags">Flags</h2>

  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Flag</th>
          <th>Default</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>--cdp-url</code></td><td><code>http://localhost:9222</code></td><td>CDP endpoint</td></tr>
        <tr><td><code>--transport</code></td><td><code>stdio</code></td><td><code>stdio</code>, <code>http</code>, or <code>sse</code></td></tr>
        <tr><td><code>--addr</code></td><td><code>localhost:6100</code></td><td>Bind address for HTTP/SSE</td></tr>
        <tr><td><code>--allow-eval</code></td><td><code>false</code></td><td>Enable <code>pen_evaluate</code> (runs JS in browser)</td></tr>
        <tr><td><code>--project-root</code></td><td><code>.</code></td><td>Sandbox for source file paths</td></tr>
        <tr><td><code>--log-level</code></td><td><code>info</code></td><td><code>debug</code> / <code>info</code> / <code>warn</code> / <code>error</code></td></tr>
        <tr><td><code>--version</code></td><td>—</td><td>Print version and exit</td></tr>
      </tbody>
    </table>
  </div>

  <p>Both <code>-flag</code> and <code>--flag</code> work. All flags are optional.</p>

  <h2 id="http-transport">HTTP Transport</h2>

  <p>For network-accessible use instead of stdio:</p>

  <CodeBlock lang="bash" code="pen --transport http --addr localhost:6100" />

  <p>
    Serves MCP at <code>http://localhost:6100/mcp</code>. The
    <code>sse</code> transport works identically — both use
    <code>mcp.NewStreamableHTTPHandler</code> under the hood.
  </p>

  <h2 id="browser-setup">Browser Setup</h2>

  <p>
    Close the browser <strong>all the way</strong> first — every window, every
    background process. The debug port only works when Chrome launches fresh
    with the flag.
  </p>

  <p><strong>macOS:</strong></p>

  <CodeBlock
    lang="bash"
    code="open -a &quot;Google Chrome&quot; --args --remote-debugging-port=9222"
  />

  <p><strong>Windows (PowerShell):</strong></p>

  <CodeBlock
    lang="powershell"
    code={`& "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222       # Chrome
& "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe" --remote-debugging-port=9222      # Edge`}
  />

  <p><strong>Linux:</strong></p>

  <CodeBlock lang="bash" code="google-chrome --remote-debugging-port=9222" />

  <p>
    Verify: <code>http://localhost:9222/json</code> should return a JSON array
    of open tabs.
  </p>

  <h2 id="ide-config">IDE Config</h2>

  <p>Your editor spawns PEN as a child process. Set it up once, then forget it.</p>

  <p><strong>VS Code</strong> — <code>.vscode/mcp.json</code>:</p>

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

  <p>
    <strong>Cursor</strong> — <code>.cursor/mcp.json</code> in your project (or
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

  <p>
    <strong>Claude Desktop</strong> —
    <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>
    (macOS) or
    <code>%APPDATA%\Claude\claude_desktop_config.json</code> (Windows):
  </p>

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

  <h2 id="building-from-source">Building from Source</h2>

  <CodeBlock
    lang="bash"
    code={`git clone https://github.com/edbnme/pen.git && cd pen
go build -o pen ./cmd/pen        # Linux / macOS
go build -o pen.exe ./cmd/pen    # Windows`}
  />

  <p>Requires Go 1.24+. Dependencies download automatically.</p>

  <h3 id="production-build">Production Build</h3>

  <CodeBlock
    lang="bash"
    code="go build -ldflags &quot;-s -w -X main.version=v1.0.0&quot; -o pen ./cmd/pen"
  />

  <p>Cross-compiled via GoReleaser for linux/darwin/windows on amd64 and arm64.</p>

  <h2 id="docker">Docker</h2>

  <CodeBlock
    lang="dockerfile"
    code={`FROM golang:1.24-bookworm AS builder
WORKDIR /app
COPY . .
RUN go build -o pen ./cmd/pen

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y google-chrome-stable --no-install-recommends \\
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/pen /usr/local/bin/pen
CMD ["sh", "-c", "google-chrome --headless --no-sandbox --disable-gpu --remote-debugging-port=9222 --remote-debugging-address=127.0.0.1 & sleep 2 && exec pen --cdp-url http://127.0.0.1:9222"]`}
  />

  <p>
    For real deployments, use a process manager (supervisord, etc.) instead of
    backgrounding Chrome with <code>&</code>.
  </p>

  <h2 id="server--ci">Server / CI</h2>

  <p>
    CDP is locked to localhost on purpose. That's a security choice, not a
    limitation.
  </p>

  <h3 id="headless-chrome">Headless Chrome</h3>

  <CodeBlock
    lang="bash"
    code={`google-chrome --headless --no-sandbox --disable-gpu \\
  --remote-debugging-port=9222 --remote-debugging-address=127.0.0.1 &
pen --cdp-url http://127.0.0.1:9222`}
  />

  <h3 id="ssh-tunnel">SSH Tunnel</h3>

  <p>Forward a remote CDP port to localhost:</p>

  <CodeBlock
    lang="bash"
    code={`ssh -L 9222:localhost:9222 user@server
pen --cdp-url http://localhost:9222`}
  />

  <h3 id="security-notes">Security Notes</h3>

  <ul>
    <li>Never expose port 9222 to the network</li>
    <li><code>--no-sandbox</code> only in containers, not bare metal</li>
    <li><code>--allow-eval</code> only in trusted environments</li>
    <li>Always set <code>--project-root</code> in production</li>
  </ul>

  <h2 id="optional-lighthouse-cli">Optional: Lighthouse CLI</h2>

  <p>
    The <code>pen_lighthouse</code> tool shells out to the Lighthouse CLI for
    full audits. Install it separately:
  </p>

  <CodeBlock lang="bash" code="npm install -g lighthouse" />

  <p>
    If Lighthouse isn't installed, every other PEN tool still works fine. Only
    <code>pen_lighthouse</code> needs it.
  </p>
</DocPage>
