export const load = () => ({
  slug: "data-streaming",
  title: "Data Streaming",
  section: "Contributors",
  description:
    "How PEN streams large CDP payloads (heap snapshots, traces) to disk without blowing up memory.",
  headings: [
    { id: "the-problem", text: "The Problem", depth: 2 },
    {
      id: "heap-snapshot-streaming",
      text: "Heap Snapshot Streaming",
      depth: 2,
    },
    { id: "trace-streaming", text: "Trace Streaming", depth: 2 },
    { id: "buffer-management", text: "Buffer Management", depth: 3 },
    { id: "temp-files", text: "Temp Files", depth: 2 },
    { id: "progress-notifications", text: "Progress Notifications", depth: 2 },
    { id: "data-flow-diagram", text: "Data Flow Diagram", depth: 2 },
  ],
});
