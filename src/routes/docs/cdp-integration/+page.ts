export const load = () => ({
  slug: "cdp-integration",
  title: "CDP Integration",
  section: "Contributors",
  description:
    "How PEN uses chromedp to communicate with Chrome via CDP WebSocket connections.",
  headings: [
    { id: "connection-lifecycle", text: "Connection Lifecycle", depth: 2 },
    { id: "endpoint-discovery", text: "Endpoint Discovery", depth: 3 },
    { id: "connection", text: "Connection", depth: 3 },
    {
      id: "chromedp-remote-allocator",
      text: "chromedp Remote Allocator",
      depth: 3,
    },
    { id: "cleanup", text: "Cleanup", depth: 3 },
    { id: "event-listening", text: "Event Listening", depth: 2 },
    { id: "tab-management", text: "Tab Management", depth: 2 },
    { id: "cdp-domains-used", text: "CDP Domains Used", depth: 2 },
    { id: "network-event-handling", text: "Network Event Handling", depth: 2 },
    { id: "devtools-coexistence", text: "DevTools Coexistence", depth: 2 },
  ],
});
