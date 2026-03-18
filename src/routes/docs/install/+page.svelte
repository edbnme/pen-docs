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

  <p>
    You need a Chromium browser (Chrome, Edge, Brave) and an MCP-capable editor
    (VS Code + Copilot, Cursor, or Claude Desktop). That's it.
  </p>

  <h2 id="quick-install">Quick Install</h2>

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

  <p>
    <code>pen init</code> detects your browser and IDE, writes the MCP config, and
    optionally launches a debug browser. It handles everything.
  </p>

  <h2 id="other-install-methods">Other Install Methods</h2>

  <h3 id="homebrew">Homebrew (macOS / Linux)</h3>

  <CodeBlock lang="bash" code="brew install edbnme/tap/pen" />

  <h3 id="scoop">Scoop (Windows)</h3>

  <CodeBlock
    lang="powershell"
    code={`scoop bucket add pen https://github.com/edbnme/scoop-pen
scoop install pen`}
  />

  <h3 id="go-install">go install</h3>

  <CodeBlock
    lang="bash"
    code="go install github.com/edbnme/pen/cmd/pen@latest"
  />

  <p>Requires Go 1.24+.</p>

  <h3 id="github-releases">GitHub Releases</h3>

  <p>
    Download the latest binary from
    <a
      href="https://github.com/edbnme/pen/releases/latest"
      target="_blank"
      rel="noopener noreferrer">Releases</a
    >, extract, and put it on your <code>PATH</code>.
  </p>

  <h3 id="from-source">From Source</h3>

  <CodeBlock
    lang="bash"
    code={`git clone https://github.com/edbnme/pen.git && cd pen
go build -o pen ./cmd/pen        # Linux / macOS
go build -o pen.exe ./cmd/pen    # Windows`}
  />

  <h2 id="verify">Verify</h2>

  <CodeBlock lang="bash" code="pen --version" />

  <p>
    After any install method, run <code>pen init</code> to set up your IDE and browser.
  </p>

  <h2 id="updating">Updating</h2>

  <CodeBlock lang="bash" code="pen update" />

  <p>
    Downloads the latest release and replaces the binary in place. Also works:
    re-run the install script, <code>brew upgrade pen</code>,
    <code>scoop update pen</code>, or <code>go install ...@latest</code>.
  </p>
</DocPage>
