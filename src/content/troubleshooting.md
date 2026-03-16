# Troubleshooting

Quick fixes for the most common PEN issues.

## Connection Issues

### Browser not running or wrong port

**Symptom:** `CDP connect failed: connection refused`

**Fix:** The browser wasn’t launched with `--remote-debugging-port=9222`. Kill all browser processes and relaunch:

```bash
# macOS
open -a "Google Chrome" --args --remote-debugging-port=9222

# Windows
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222

# Linux
google-chrome --remote-debugging-port=9222
```

Verify: `http://localhost:9222/json` should return a JSON array. If it doesn’t, the browser wasn’t fully killed before relaunch.

**Windows tip:** Open Task Manager (`Ctrl+Shift+Esc`) and end all Chrome/Edge processes before relaunching.

**macOS tip:** Run `killall "Google Chrome"` before relaunching.

### No targets found

**Symptom:** `no targets found`

**Fix:** Open a tab. PEN needs at least one page target to work with.

### Invalid CDP URL

**Symptom:** `invalid CDP URL`

**Fix:** PEN only talks to localhost (`localhost`, `127.0.0.1`, `::1`). For remote browsers, tunnel with SSH:

```bash
ssh -L 9222:localhost:9222 user@remote-server
pen --cdp-url http://localhost:9222
```

### Connection drops mid-operation

**Symptom:** `Browser disconnected during operation`

**Cause:** Browser crashed or tab closed during a heap snapshot or trace.

**What PEN does:** Cleans up partial temp files via `defer`, releases domain locks, returns `isError` explaining what happened. On the next call, PEN tries to reconnect (up to 3 retries, exponential backoff from 500ms to 10s).

## IDE Issues

### `pen: command not found`

**Fix:** The binary isn't on your PATH. Either add it, or use the full path in your IDE config:

```json
"command": "/full/path/to/pen"
```

### IDE doesn't see PEN tools

**Fix:** Restart your editor. Most IDEs don’t hot-reload MCP configs.

### PEN doesn't respond

**Fix:** Check the MCP output panel. PEN logs to stderr — look for connection errors or startup failures there.

## Tool-Specific Issues

### Rate limit errors

**Symptom:** `pen_heap_snapshot has a 10s cooldown. Try again in 6s`

**Fix:** Wait it out. Rate limits prevent resource exhaustion:

| Tool                  | Cooldown |
| --------------------- | -------- |
| `pen_heap_snapshot`   | 10s      |
| `pen_capture_trace`   | 5s       |
| `pen_collect_garbage` | 5s       |

### Domain lock conflicts

**Symptom:** `HeapProfiler is already in use by another operation`

**Cause:** Two tools tried to use the same exclusive CDP domain at once (e.g., `pen_cpu_profile` while `pen_capture_trace` is still running).

**Fix:** Let the first operation finish. PEN uses domain-level locks to keep results clean — this is by design.

### Lighthouse not found

**Symptom:** `lighthouse CLI not found`

**Fix:** Install Lighthouse globally:

```bash
npm install -g lighthouse
```

Every other PEN tool works without Lighthouse. Only `pen_lighthouse` needs it.

### Lighthouse timeout

**Symptom:** Lighthouse audit hangs or times out on complex pages.

**Fix:** Lighthouse has its own internal timeout for auditing. If the page is extremely large or slow, the audit may fail. Try:

- Auditing a simpler page first
- Reducing the number of categories
- Checking that the browser isn't frozen or unresponsive

### Large heap snapshot warnings

**Symptom:** `Large heap detected. Analysis limited to top retainers.`

**Cause:** The heap is huge (>500 MB). Big enterprise SPAs can do this.

**What PEN does:** Keeps streaming to disk (constant memory — the snapshot never sits in RAM). Limits analysis depth to stay fast. The raw data is still complete.

### Trace buffer overflow

**Symptom:** `Trace truncated at Xs due to buffer limit`

**Cause:** Chrome's trace buffer filled during capture.

**Fix:** Reduce trace duration or use fewer trace categories:

```
pen_capture_trace with duration=3 (shorter)
```

### Console buffer full

**Symptom:** Console messages appear to be missing.

**Cause:** The console buffer holds 1,000 messages max. When full, the oldest 100 are evicted.

**Fix:** Use `pen_console_messages` with `last=N` to get recent messages, or use `clear=true` to reset the buffer periodically.

### Trace file too large

**Symptom:** `Trace file is X MB — exceeds the 100 MB limit`

**Fix:** `pen_trace_insights` caps at 100 MB to avoid blowing up during JSON parsing. Record shorter traces or use fewer categories.

## Page and Navigation Issues

### Page navigates during profiling

**Cause:** SPA route change or full page reload during an active profile.

**What PEN does:**

- Same-page navigation (SPA): continues, notes it in output
- Full reload: aborts current operation, returns partial results

### Blocked URL scheme

**Symptom:** `URL scheme is not allowed. Only HTTP and HTTPS URLs are accepted.`

**Cause:** Attempted to navigate to a `javascript:`, `data:`, `file:`, or other non-HTTP URL.

**Fix:** This is a security feature. Only HTTP and HTTPS URLs are allowed for navigation and Lighthouse.

### No forward history

**Symptom:** Error when using `pen_navigate` with `action: forward`

**Cause:** The browser has no forward navigation history from the current entry.

**Fix:** You can only go forward if you've previously gone back.

## Security Issues

### Expression blocked

**Symptom:** Expression blocked by the security filter when using `pen_evaluate`.

**Cause:** The expression hit one of PEN’s blocklist patterns (`fetch`, `document.cookie`, `eval`, `localStorage`, etc.).

**Fix:** That’s intentional. See [Security](/docs/security) for the full list.

### Path access denied

**Symptom:** `path resolves outside project root — access denied`

**Cause:** A source tool tried to access a file outside `--project-root`.

**Fix:** Set `--project-root` to the correct directory, or access files within the allowed path.
