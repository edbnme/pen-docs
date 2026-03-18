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

  <p>
    Your IDE spawns PEN automatically via the MCP config that
    <code>pen init</code> wrote. You don't run PEN by hand unless you're using
    HTTP transport or debugging.
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
        <tr
          ><td><code>--cdp-url</code></td><td
            ><code>http://localhost:9222</code></td
          ><td>CDP endpoint</td></tr
        >
        <tr
          ><td><code>--transport</code></td><td><code>stdio</code></td><td
            ><code>stdio</code>, <code>http</code>, or <code>sse</code></td
          ></tr
        >
        <tr
          ><td><code>--addr</code></td><td><code>localhost:6100</code></td><td
            >Bind address for HTTP/SSE</td
          ></tr
        >
        <tr
          ><td><code>--allow-eval</code></td><td><code>false</code></td><td
            >Enable <code>pen_evaluate</code> (runs JS in browser)</td
          ></tr
        >
        <tr
          ><td><code>--auto-launch</code></td><td><code>true</code></td><td
            >Auto-launch a debug browser if CDP not found</td
          ></tr
        >
        <tr
          ><td><code>--project-root</code></td><td><code>.</code></td><td
            >Sandbox for source file paths</td
          ></tr
        >
        <tr
          ><td><code>--log-level</code></td><td><code>info</code></td><td
            ><code>debug</code> / <code>info</code> / <code>warn</code> /
            <code>error</code></td
          ></tr
        >
        <tr
          ><td><code>--version</code></td><td></td><td
            >Print version and exit</td
          ></tr
        >
      </tbody>
    </table>
  </div>

  <h2 id="ide-config">IDE Config</h2>

  <p>
    <code>pen init</code> writes this for you. If you need to do it manually:
  </p>

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

  <p><strong>Cursor</strong> — <code>.cursor/mcp.json</code>:</p>

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
    (macOS) or <code>%APPDATA%\Claude\claude_desktop_config.json</code> (Windows):
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

  <h2 id="browser-setup">Browser Setup</h2>

  <p>
    By default (<code>--auto-launch=true</code>), PEN launches a separate debug
    browser automatically. Your existing browser is untouched — different
    profile, different process.
  </p>

  <p>To launch manually instead:</p>

  <CodeBlock
    lang="bash"
    code={`# macOS
open -a "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir=/tmp/pen-debug --no-first-run

# Windows
& "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222 --user-data-dir="$env:TEMP\\pen-debug" --no-first-run

# Linux
google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/pen-debug --no-first-run &`}
  />

  <p>
    Use <code>--user-data-dir</code> so it runs alongside your regular browser.
    Verify with <code>http://localhost:9222/json</code>.
  </p>

  <h2 id="http-transport">HTTP Transport</h2>

  <CodeBlock lang="bash" code="pen --transport http --addr localhost:6100" />

  <p>
    Serves MCP at <code>http://localhost:6100/mcp</code>. Use this for
    shared or remote setups instead of stdio.
  </p>

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

  <h2 id="ci--headless">CI / Headless</h2>

  <CodeBlock
    lang="bash"
    code={`google-chrome --headless --no-sandbox --disable-gpu \\
  --remote-debugging-port=9222 --remote-debugging-address=127.0.0.1 &
pen --cdp-url http://127.0.0.1:9222`}
  />

  <p>
    For remote browsers, tunnel with SSH:
    <code>ssh -L 9222:localhost:9222 user@server</code>
  </p>

  <h2 id="security-notes">Security Notes</h2>

  <ul>
    <li>Never expose port 9222 to the network</li>
    <li><code>--no-sandbox</code> only in containers, not bare metal</li>
    <li><code>--allow-eval</code> only in trusted environments</li>
    <li>Always set <code>--project-root</code> in production</li>
  </ul>

  <h2 id="lighthouse">Lighthouse</h2>

  <p>
    <code>pen_lighthouse</code> needs the Lighthouse CLI. All other tools work
    without it.
  </p>

  <CodeBlock lang="bash" code="npm install -g lighthouse" />
</DocPage>
